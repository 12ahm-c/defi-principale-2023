import type { IcebergStateDTO, IcebergVisualStage } from '@/types/iceberg.types';

const PALETTE = {
  baseIceColor: '#E0F2FE',
  crackWarningColor: '#EF4444',
  solidGlowColor: '#10B981',
};

const NO_GUILT = "Cet indicateur mesure la solidité de la connaissance collective et non la responsabilité morale de l'utilisateur.";

interface IcebergInternal {
  meltIndex: number;
  visualStage: IcebergVisualStage;
  statusMessageFr: string;
  ariaLiveMessage: string;
}

const STAGE_MESSAGES: Record<IcebergVisualStage, string> = {
  initial_cracked: "L'iceberg reflète l'état actuel de l'information : fissuré sous le poids des discours contradictoires.",
  first_scan_melt: "Un premier éclairage fait fondre une partie des certitudes fragiles.",
  sequenced_melt: "Les discours de l'inaction se fissurent à leur tour.",
  context_recovering: "Le contexte se précise : l'iceberg se consolide.",
  solid_consolidated: "L'iceberg est consolidé : des solutions concrètes existent.",
};

class IcebergService {
  private state: IcebergInternal = {
    meltIndex: 50,
    visualStage: 'initial_cracked',
    statusMessageFr: STAGE_MESSAGES.initial_cracked,
    ariaLiveMessage: STAGE_MESSAGES.initial_cracked,
  };

  getState(): IcebergStateDTO {
    return {
      meltIndex: this.state.meltIndex,
      visualStage: this.state.visualStage,
      statusMessageFr: this.state.statusMessageFr,
      icebergColorPalette: { ...PALETTE },
      noGuiltDisclaimer: NO_GUILT,
      ariaLiveMessage: this.state.ariaLiveMessage,
    };
  }

  reset(): void {
    this.state = {
      meltIndex: 50,
      visualStage: 'initial_cracked',
      statusMessageFr: STAGE_MESSAGES.initial_cracked,
      ariaLiveMessage: STAGE_MESSAGES.initial_cracked,
    };
  }

  onScan(): void {
    this.state = {
      meltIndex: 65,
      visualStage: 'first_scan_melt',
      statusMessageFr: STAGE_MESSAGES.first_scan_melt,
      ariaLiveMessage: STAGE_MESSAGES.first_scan_melt,
    };
  }

  onVerifyTrompeur(): void {
    this.state = {
      meltIndex: 55,
      visualStage: 'sequenced_melt',
      statusMessageFr: STAGE_MESSAGES.sequenced_melt,
      ariaLiveMessage: STAGE_MESSAGES.sequenced_melt,
    };
  }

  onContextLens(): void {
    this.state = {
      meltIndex: 35,
      visualStage: 'context_recovering',
      statusMessageFr: STAGE_MESSAGES.context_recovering,
      ariaLiveMessage: STAGE_MESSAGES.context_recovering,
    };
  }

  onQuizAnswer(isCorrect: boolean): void {
    const meltIndex = Math.max(0, Math.min(100, this.state.meltIndex + (isCorrect ? -15 : 15)));
    const visualStage: IcebergVisualStage = isCorrect
      ? meltIndex === 0 ? 'solid_consolidated' : 'context_recovering'
      : 'sequenced_melt';
    const statusMessageFr = isCorrect
      ? 'Bonne réponse : une partie de la glace se reconstitue.'
      : 'Réponse incorrecte : une partie de la glace fond.';

    this.state = { meltIndex, visualStage, statusMessageFr, ariaLiveMessage: statusMessageFr };
  }

  onCertificate(): void {
    this.state = {
      meltIndex: 0,
      visualStage: 'solid_consolidated',
      statusMessageFr: STAGE_MESSAGES.solid_consolidated,
      ariaLiveMessage: STAGE_MESSAGES.solid_consolidated,
    };
  }
}

export const icebergService = new IcebergService();
export default icebergService;
