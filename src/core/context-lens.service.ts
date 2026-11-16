import { ClaimService } from './claim.service';
import { icebergService } from './iceberg.service';
import type { ClaimDTO } from '@/types/claim.types';

export interface ContextLensResult {
  claimId: string;
  rawText: string;
  evaluation: ClaimDTO['evaluation'];
  evaluationLabelFr: string;
  reasonFr: string;
  socialJusticeDimension: ClaimDTO['socialJusticeDimension'];
  verificationCard: ClaimDTO['verificationCard'];
  icebergImpact: {
    previousMeltIndex: number;
    newMeltIndex: number;
    stateTransition: string;
    visualFeedback: string;
  };
}

export class ContextLensService {
  static apply(claimId: string, _lensSliderPosition: number): ContextLensResult | undefined {
    const claim = ClaimService.getClaimById(claimId);
    if (!claim) return undefined;

    const previousMeltIndex = icebergService.getState().meltIndex;
    icebergService.onContextLens();
    const newState = icebergService.getState();

    return {
      claimId: claim.id,
      rawText: claim.rawText,
      evaluation: claim.evaluation,
      evaluationLabelFr: claim.evaluationLabelFr,
      reasonFr: claim.reasonFr,
      socialJusticeDimension: claim.socialJusticeDimension,
      verificationCard: claim.verificationCard,
      icebergImpact: {
        previousMeltIndex,
        newMeltIndex: newState.meltIndex,
        stateTransition: newState.visualStage,
        visualFeedback: 'freeze_consolidation_partial',
      },
    };
  }
}

export default ContextLensService;