import type { ClaimIndicators } from '@/types/claim.types';

interface Props {
  indicators: ClaimIndicators;
}

const statusColor = (s: 'green' | 'yellow' | 'red') =>
  s === 'green' ? 'bg-emerald-100 text-emerald-700' : s === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

export default function IndicatorsBar({ indicators }: Props) {
  const items = [
    indicators.sourceIndicator,
    indicators.evidenceIndicator,
    indicators.contextIndicator,
  ];
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {items.map((it) => (
        <span key={it.name} className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(it.status)}`}>
          {it.name}: {it.hint}
        </span>
      ))}
    </div>
  );
}