import type { IcebergStateDTO } from '@/types/iceberg.types';

interface Props {
  state: IcebergStateDTO;
}

export default function IcebergWidget({ state }: Props) {
  const src =
    state.meltIndex <= 10
      ? '/assets/svg/iceberg-stable.svg'
      : '/assets/svg/iceberg-melting.svg';

  return (
    <div className="iceberg-widget flex flex-col items-center gap-1">
      <img src={src} alt="Iceberg" className="w-24 h-24" />
      <p className="text-xs text-gray-600 text-center max-w-[160px]">{state.statusMessageFr}</p>
      <span aria-live="polite" className="sr-only">
        {state.ariaLiveMessage ?? state.statusMessageFr}
      </span>
    </div>
  );
}
