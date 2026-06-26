import { Plus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NicknameModal from '../components/NicknameModal';
import RoomCard from '../components/RoomCard';
import { isSupabaseConfigured, Room, supabase } from '../lib/supabase';

const profileKey = 'akatsuki-profile';

type Profile = {
  nickname: string;
  icon: string;
};

function loadProfile(): Profile {
  const stored = localStorage.getItem(profileKey);
  if (!stored) {
    return { nickname: '', icon: 'default' };
  }

  try {
    return JSON.parse(stored) as Profile;
  } catch {
    return { nickname: '', icon: 'default' };
  }
}

export default function ChatLobby() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: true });

      if (fetchError) {
        setError('部屋一覧を取得できませんでした。Supabase設定を確認してください。');
      } else {
        setRooms(data || []);
      }

      setLoading(false);
    }

    fetchRooms();
  }, []);

  function saveProfile() {
    const nickname = profile.nickname.trim();
    if (!nickname) {
      setError('ニックネームを入力してください。');
      return false;
    }

    localStorage.setItem(profileKey, JSON.stringify({ ...profile, nickname }));
    setProfile((current) => ({ ...current, nickname }));
    setError(null);
    return true;
  }

  function enterRoom(roomId: string) {
    if (!saveProfile()) {
      return;
    }

    navigate(`/chat/${roomId}`);
  }

  async function createRoom(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!saveProfile()) {
      return;
    }

    const name = newRoomName.trim();
    if (!name) {
      setError('部屋名を入力してください。');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('rooms')
      .insert({
        name: name.slice(0, 40),
        description: newRoomDescription.trim().slice(0, 100) || null,
      })
      .select()
      .single();

    if (insertError || !data) {
      setError('部屋を作成できませんでした。');
      return;
    }

    setRooms((current) => [...current, data]);
    setNewRoomName('');
    setNewRoomDescription('');
    navigate(`/chat/${data.id}`);
  }

  return (
    <div className="lobby-grid">
      <NicknameModal
        nickname={profile.nickname}
        icon={profile.icon}
        onNicknameChange={(nickname) => setProfile((current) => ({ ...current, nickname }))}
        onIconChange={(icon) => setProfile((current) => ({ ...current, icon }))}
        onSubmit={saveProfile}
      />

      <section className="panel room-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rooms</p>
            <h1>部屋一覧</h1>
          </div>
          {!isSupabaseConfigured && <span className="status-pill is-warning">env未設定</span>}
        </div>
        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <p className="muted">部屋を読み込み中...</p>
        ) : (
          <div className="room-list">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onEnter={enterRoom} />
            ))}
          </div>
        )}
      </section>

      <section className="panel create-room-panel">
        <p className="eyebrow">Create</p>
        <h2>部屋を作成</h2>
        <form onSubmit={createRoom}>
          <label className="field">
            <span>部屋名</span>
            <input
              value={newRoomName}
              onChange={(event) => setNewRoomName(event.target.value.slice(0, 40))}
              placeholder="例: 今夜の企画室"
              maxLength={40}
            />
          </label>
          <label className="field">
            <span>説明</span>
            <input
              value={newRoomDescription}
              onChange={(event) => setNewRoomDescription(event.target.value.slice(0, 100))}
              placeholder="任意"
              maxLength={100}
            />
          </label>
          <button type="submit" className="primary-button">
            <Plus size={18} />
            作成して入室
          </button>
        </form>
      </section>
    </div>
  );
}
