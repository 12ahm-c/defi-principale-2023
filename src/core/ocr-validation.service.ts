import { ClaimService } from './claim.service';

export interface OcrScanResult {
  claimId: string;
  scanTimestamp: string;
  status: string;
  ocrDisclaimer: {
    isMatchingExact: boolean;
    disclaimerText: string;
    userConfirmed: boolean;
  };
  animationDirective: {
    shutterFlashDurationMs: number;
    nextScreenId: number;
  };
}

export class OcrValidationService {
  static scan(claimId: string, userConfirmedText: string): OcrScanResult | undefined {
    const claim = ClaimService.getClaimById(claimId);
    if (!claim) return undefined;

    const isMatchingExact = userConfirmedText.trim() === claim.rawText.trim();

    return {
      claimId: claim.id,
      scanTimestamp: new Date().toISOString(),
      status: 'scanned_ready_to_reveal',
      ocrDisclaimer: {
        isMatchingExact,
        disclaimerText:
          "La reconnaissance visuelle et la détection textuelle ne constituent en aucun cas une preuve de véracité ou de fausseté de l'affirmation.",
        userConfirmed: true,
      },
      animationDirective: {
        shutterFlashDurationMs: 150,
        nextScreenId: claim.screenId === 2 ? 3 : claim.screenId,
      },
    };
  }
}

export default OcrValidationService;