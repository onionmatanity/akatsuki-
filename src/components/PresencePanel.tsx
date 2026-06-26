import { Users } from 'lucide-react';

type PresencePanelProps = {
  count: number;
};

export default function PresencePanel({ count }: PresencePanelProps) {
  return (
    <div className="presence-panel" aria-label="オンライン人数">
      <Users size={18} />
      <span>{count}</span>
      <small>online</small>
    </div>
  );
}
