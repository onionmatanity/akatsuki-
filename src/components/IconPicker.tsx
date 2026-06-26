export const memberIcons = [
  { id: 'default', label: '標準', glyph: 'A' },
  { id: 'moon', label: '月影', glyph: '☾' },
  { id: 'star', label: '星灯', glyph: '✦' },
  { id: 'signal', label: '信号', glyph: '⌁' },
  { id: 'key', label: '鍵', glyph: '◆' },
  { id: 'nova', label: '暁光', glyph: '◎' },
];

type IconPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="icon-grid" role="radiogroup" aria-label="アイコン選択">
      {memberIcons.map((icon) => (
        <button
          type="button"
          key={icon.id}
          className={`icon-choice${value === icon.id ? ' is-selected' : ''}`}
          onClick={() => onChange(icon.id)}
          aria-pressed={value === icon.id}
          title={icon.label}
        >
          <span>{icon.glyph}</span>
          <small>{icon.label}</small>
        </button>
      ))}
    </div>
  );
}
