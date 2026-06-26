import { Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

type MessageInputProps = {
  onSend: (body: string) => Promise<string | null>;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSending(true);
    const nextError = await onSend(body);
    setSending(false);

    if (nextError) {
      setError(nextError);
      return;
    }

    setBody('');
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="message-body">
        メッセージ
      </label>
      <textarea
        id="message-body"
        value={body}
        onChange={(event) => setBody(event.target.value.slice(0, 300))}
        placeholder="集会所へ送信..."
        rows={2}
        disabled={disabled || sending}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <div className="message-input-footer">
        <span className={body.length > 280 ? 'is-danger' : ''}>{body.length}/300</span>
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="primary-button send-button" disabled={disabled || sending}>
          <Send size={18} />
          送信
        </button>
      </div>
    </form>
  );
}
