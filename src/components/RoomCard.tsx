import { DoorOpen } from 'lucide-react';
import { Room } from '../lib/supabase';

type RoomCardProps = {
  room: Room;
  onEnter: (roomId: string) => void;
};

export default function RoomCard({ room, onEnter }: RoomCardProps) {
  return (
    <article className="room-card">
      <div>
        <h3>{room.name}</h3>
        <p>{room.description || '説明はまだありません。'}</p>
      </div>
      <button type="button" className="ghost-button" onClick={() => onEnter(room.id)}>
        <DoorOpen size={16} />
        入室
      </button>
    </article>
  );
}
