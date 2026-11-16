interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function ContextLens({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label="Curseur de contexte"
      />
      <p className="text-xs text-gray-500 text-center mt-1">Contexte: {value}%</p>
    </div>
  );
}