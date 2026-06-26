import { DoorOpen } from 'lucide-react';
import IconPicker from './IconPicker';

type NicknameModalProps = {
  nickname: string;
  icon: string;
  onNicknameChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onSubmit: () => void;
};

export default function NicknameModal({
  nickname,
  icon,
  onNicknameChange,
  onIconChange,
  onSubmit,
}: NicknameModalProps) {
  return (
    <section className="panel entry-panel" aria-labelledby="profile-heading">
      <div>
        <p className="eyebrow">匿名プロフィール</p>
        <h1 id="profile-heading">集会所の名札</h1>
      </div>
      <label className="field">
        <span>ニックネーム</span>
        <input
          value={nickname}
          onChange={(event) => onNicknameChange(event.target.value.slice(0, 24))}
          placeholder="例: アカツキの客人"
          maxLength={24}
        />
      </label>
      <div className="field">
        <span>アイコン</span>
        <IconPicker value={icon} onChange={onIconChange} />
      </div>
      <button type="button" className="primary-button" onClick={onSubmit}>
        <DoorOpen size={18} />
        この名札で入る
      </button>
    </section>
  );
}
