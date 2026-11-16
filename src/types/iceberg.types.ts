export type IcebergVisualStage =
  | 'initial_cracked'
  | 'first_scan_melt'
  | 'sequenced_melt'
  | 'context_recovering'
  | 'solid_consolidated';

export interface IcebergImpact {
  previousMeltIndex: number;
  newMeltIndex: number;
  stateTransition: IcebergVisualStage;
  visualFeedback: string;
}

export interface IcebergColorPalette {
  baseIceColor: string;
  crackWarningColor: string;
  solidGlowColor: string;
}

export interface IcebergStateDTO {
  meltIndex: number; // 0 to 100
  visualStage: IcebergVisualStage;
  statusMessageFr: string;
  icebergColorPalette: IcebergColorPalette;
  noGuiltDisclaimer: string;
  ariaLiveMessage?: string;
}
