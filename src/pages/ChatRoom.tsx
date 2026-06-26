import { LogOut } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import PresencePanel from '../components/PresencePanel';
import { validateMessageBody } from '../lib/filter';
import { canSendMessage, nextSendGuardState, SendGuardState } from '../lib/rateLimit';
import { Message, Room, supabase } from '../lib/supabase';

const profileKey = 'akatsuki-profile';

type Profile = {
  nickname: string;
  icon: string;
};

function loadProfile(): Profile | null {
  const stored = localStorage.getItem(profileKey);
  if (!stored) {
    return null;
  }

  try {
    const profile = JSON.parse(stored) as Profile;
    return profile.nickname?.trim() ? profile : null;
  } catch {
    return null;
  }
}

function createSessionId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [profile] = useState<Profile | null>(() => loadProfile());
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionId = useMemo(createSessionId, []);
  const sendGuardRef = useRef<SendGuardState>({ lastSentAt: 0, lastBody: '' });
  const leaveSentRef = useRef(false);

  const insertSystemMessage = useCallback(
    async (body: string) => {
      if (!roomId || !profile) {
        return;
      }

      await supabase.from('messages').insert({
        room_id: roomId,
        nickname: 'system',
        icon: 'default',
        body,
        message_type: 'system',
      });
    },
    [profile, roomId],
  );

  const sendLeaveMessage = useCallback(() => {
    if (!roomId || !profile || leaveSentRef.current) {
      return;
    }

    leaveSentRef.current = true;
    const body = `${profile.nickname} が退室しました。`;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      fetch(`${supabaseUrl}/rest/v1/messages`, {
        method: 'POST',
        keepalive: true,
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          room_id: roomId,
          nickname: 'system',
          icon: 'default',
          body,
          message_type: 'system',
        }),
      }).catch(() => undefined);
      return;
    }

    insertSystemMessage(body);
  }, [insertSystemMessage, profile, roomId]);

  useEffect(() => {
    if (!roomId) {
      navigate('/chat');
      return;
    }

    if (!profile) {
      navigate('/chat');
      return;
    }

    async function bootstrap() {
      setLoading(true);
      const [{ data: roomData, error: roomError }, { data: messageData, error: messageError }] =
        await Promise.all([
          supabase.from('rooms').select('*').eq('id', roomId).single(),
          supabase
            .from('messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true })
            .limit(100),
        ]);

      if (roomError || !roomData) {
        setError('部屋を取得できませんでした。');
        setLoading(false);
        return;
      }

      if (messageError) {
        setError('メッセージを取得できませんでした。');
      }

      setRoom(roomData);
      setMessages(messageData || []);
      setLoading(false);
    }

    bootstrap();
  }, [navigate, profile, roomId]);

  useEffect(() => {
    if (!roomId || !profile) {
      return undefined;
    }

    const channel = supabase.channel(`akatsuki-room-${roomId}`, {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const nextMessage = payload.new as Message;
          setMessages((current) => {
            if (current.some((message) => message.id === nextMessage.id)) {
              return current;
            }
            return [...current.slice(-120), nextMessage];
          });
        },
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.values(state).reduce((total, presences) => total + presences.length, 0);
        setOnlineCount(Math.max(count, 1));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            nickname: profile.nickname,
            icon: profile.icon,
            joinedAt: new Date().toISOString(),
          });
          await insertSystemMessage(`${profile.nickname} が入室しました。`);
        }
      });

    window.addEventListener('beforeunload', sendLeaveMessage);
    window.addEventListener('pagehide', sendLeaveMessage);

    return () => {
      window.removeEventListener('beforeunload', sendLeaveMessage);
      window.removeEventListener('pagehide', sendLeaveMessage);
      sendLeaveMessage();
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [insertSystemMessage, profile, roomId, sendLeaveMessage, sessionId]);

  async function sendMessage(body: string) {
    const validationError = validateMessageBody(body);
    if (validationError) {
      return validationError;
    }

    const rateLimitError = canSendMessage(body, sendGuardRef.current);
    if (rateLimitError) {
      return rateLimitError;
    }

    if (!profile || !roomId) {
      return 'プロフィールまたは部屋情報がありません。';
    }

    const { error: insertError } = await supabase.from('messages').insert({
      room_id: roomId,
      nickname: profile.nickname,
      icon: profile.icon,
      body: body.trim(),
      message_type: 'normal',
    });

    if (insertError) {
      return '送信できませんでした。';
    }

    sendGuardRef.current = nextSendGuardState(body);
    return null;
  }

  function leaveRoom() {
    sendLeaveMessage();
    navigate('/chat');
  }

  if (loading) {
    return <p className="muted">チャットルームを読み込み中...</p>;
  }

  if (error || !room) {
    return (
      <section className="panel">
        <h1>部屋に入れませんでした</h1>
        <p className="form-error">{error}</p>
        <Link to="/chat" className="ghost-button">
          ロビーに戻る
        </Link>
      </section>
    );
  }

  return (
    <section className="chat-room-shell">
      <header className="chat-room-header">
        <div>
          <p className="eyebrow">Now in session</p>
          <h1>{room.name}</h1>
          {room.description && <p>{room.description}</p>}
        </div>
        <div className="chat-room-actions">
          <PresencePanel count={onlineCount} />
          <button type="button" className="ghost-button" onClick={leaveRoom}>
            <LogOut size={17} />
            退室
          </button>
        </div>
      </header>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </section>
  );
}
