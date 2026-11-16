import { icebergService } from './iceberg.service';
import type { CertificateDTO } from '@/types/certificate.types';

export interface GenerateCertificateInput {
  capturedClaimIds: string[];
  selected2050PathwayId: string;
}

export class CertificateService {
  static generate(input: GenerateCertificateInput): CertificateDTO {
    icebergService.onCertificate();
    const ice = icebergService.getState();
    const count = input.capturedClaimIds.length;

    return {
      certificateId: `CERT-VCLIMAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issuedAt: new Date().toISOString(),
      recipientTitle: 'Porteur de Caméra Éclairé',
      verifiedClaimsCount: count,
      icebergFinalStatus: {
        meltIndex: ice.meltIndex,
        state: ice.visualStage,
        badgeTitle: 'Iceberg Consolidé',
        badgeIconSvg: 'assets/svg/iceberg-stable.svg',
      },
      coreLearningSummaryFr:
        "Vous avez su dépasser les raccourcis simplificateurs, identifier les sources fiables (GIEC, ADEME, HCC), contextualiser les leviers d'action et constater que des solutions collectives concrètes existent pour bâtir un avenir désirable.",
      shareableSummaryText:
        "J'ai complété le parcours Vérité Climat : j'ai vérifié " +
        count +
        " affirmations clés avec les données du GIEC et de l'ADEME. Un avenir positif et décarboné est possible !",
      actions: {
        downloadPngUrl: '#canvas-export',
        replayUrl: '/api/v1/session/reset',
      },
    };
  }
}

export default CertificateService;