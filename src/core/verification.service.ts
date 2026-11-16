import { ClaimService } from './claim.service';
import { icebergService } from './iceberg.service';
import type { ClaimDTO } from '@/types/claim.types';
import type { IcebergImpact } from '@/types/iceberg.types';

export interface VerifyResult {
  claimId: string;
  evaluation: ClaimDTO['evaluation'];
  evaluationLabelFr: string;
  reasonFr: string;
  ahaInsightFr?: string;
  actionablePositiveInsightFr?: string;
  socialJusticeDimension?: ClaimDTO['socialJusticeDimension'];
  verificationCard: ClaimDTO['verificationCard'];
  icebergImpact: IcebergImpact;
}

export class VerificationService {
  static verifyClaim(id: string, _includeFullContext = true, updateIceberg = true): VerifyResult | undefined {
    const claim = ClaimService.getClaimById(id);
    if (!claim) return undefined;

    const previousMeltIndex = icebergService.getState().meltIndex;

    if (updateIceberg) {
      if (claim.id === 'claim-renewables-01') {
        icebergService.onScan();
      } else if (claim.evaluation === 'trompeur') {
        icebergService.onVerifyTrompeur();
      }
    }

    const newState = icebergService.getState();
    const stateTransition = newState.visualStage;

    const visualFeedback =
      stateTransition === 'first_scan_melt'
        ? 'melt_burst_minor'
        : stateTransition === 'sequenced_melt'
        ? 'melt_burst_minor'
        : 'none';

    return {
      claimId: claim.id,
      evaluation: claim.evaluation,
      evaluationLabelFr: claim.evaluationLabelFr,
      reasonFr: claim.reasonFr,
      ahaInsightFr: claim.ahaInsightFr,
      actionablePositiveInsightFr: claim.actionablePositiveInsightFr,
      socialJusticeDimension: claim.socialJusticeDimension,
      verificationCard: claim.verificationCard,
      icebergImpact: {
        previousMeltIndex,
        newMeltIndex: newState.meltIndex,
        stateTransition,
        visualFeedback,
      },
    };
  }

  static verifyFallback(id: string): VerifyResult {
    const previousMeltIndex = icebergService.getState().meltIndex;
    return {
      claimId: id,
      evaluation: 'non_verifie',
      evaluationLabelFr: 'Non vérifié dans nos sources',
      reasonFr: 'Nous n\'avons pas pu vérifier cette formulation à partir des sources présentées.',
      verificationCard: {
        source: {
          entity: 'Sources scientifiques du projet (IPCC / ADEME / HCC)',
          sourceCategory: 'scientifique_institutionnel',
          documentTitle: 'Corpus de référence du projet Vérité Climat',
          publicationDate: '2026',
          officialUrl: 'https://www.ipcc.ch/',
        },
        whatWeFound: {
          findingQuote: 'Aucun extrait textuel ou donnée quantitative directe ne correspond exactement aux termes de cette affirmation dans les rapports indexés.',
          exactReference: 'Corpus complet Ressources.md',
          directLink: '',
        },
        contextAndLimits: {
          period: 'Toutes périodes',
          geographicScope: 'Non applicable',
          scenarioOrModel: 'Absence de correspondance directe',
          confidenceLevel: 'Indéterminé',
        },
        whatWeDoNotKnow: "L'absence de mention dans notre corpus ne permet pas de qualifier cette assertion de fausse ou de vraie.",
        neutralFallbackTriggered: true,
      },
      icebergImpact: {
        previousMeltIndex,
        newMeltIndex: previousMeltIndex,
        stateTransition: icebergService.getState().visualStage,
        visualFeedback: 'none',
      },
    };
  }
}

export default VerificationService;
