import { Flag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { memberIcons } from './IconPicker';
import { Message, ReportReason, supabase } from '../lib/supabase';

const reportReasons: ReportReason[] = ['暴言・嫌がらせ', '荒らし', '個人情報', '違法行為', 'その他'];

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reason, setReason] = useState<ReportReason>('荒らし');
  const [customReason, setCustomReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  async function submitReport(messageId: string) {
    const reportReason = reason === 'その他' ? customReason.trim() || 'その他' : reason;
    const { error } = await supabase.from('reports').insert({
      message_id: messageId,
      reason: reportReason,
    });

    if (error) {
      setNotice('通報を保存できませんでした。');
      return;
    }

    setNotice('通報を受け付けました。');
    setReportingId(null);
    setCustomReason('');
  }

  return (
    <div className="message-list" ref={listRef} aria-live="polite">
      {messages.map((message) => {
        const icon = memberIcons.find((item) => item.id === message.icon) || memberIcons[0];

        if (message.message_type === 'system') {
          return (
            <div key={message.id} className="system-message">
              <span>{message.body}</span>
            </div>
          );
        }

        return (
          <article key={message.id} className="chat-message">
            <div className="message-avatar" aria-hidden="true">
              {icon.glyph}
            </div>
            <div className="message-bubble">
              <header>
                <strong>{message.nickname}</strong>
                <time dateTime={message.created_at}>
                  {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </header>
              <p>{message.body}</p>
              <button
                type="button"
                className="report-button"
                onClick={() => setReportingId(reportingId === message.id ? null : message.id)}
                title="通報"
              >
                <Flag size={14} />
                通報
              </button>
              {reportingId === message.id && (
                <div className="report-panel">
                  <label>
                    <span>理由</span>
                    <select value={reason} onChange={(event) => setReason(event.target.value as ReportReason)}>
                      {reportReasons.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  {reason === 'その他' && (
                    <input
                      value={customReason}
                      onChange={(event) => setCustomReason(event.target.value.slice(0, 120))}
                      placeholder="理由を入力"
                    />
                  )}
                  <button type="button" className="ghost-button" onClick={() => submitReport(message.id)}>
                    送信
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
      {notice && (
        <button type="button" className="toast" onClick={() => setNotice(null)}>
          {notice}
        </button>
      )}
    </div>
  );
}
