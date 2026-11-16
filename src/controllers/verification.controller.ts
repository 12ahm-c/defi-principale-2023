import { VerificationService } from '@/core/verification.service';
import { ContextLensService } from '@/core/context-lens.service';
import { ClaimService } from '@/core/claim.service';
import { formatResponse, nowIso, API_VERSION } from '@/utils/response-envelope';

export function verifyClaim(id: string, body?: { includeFullContext?: boolean; updateIceberg?: boolean }) {
  const claim = ClaimService.getClaimById(id);
  if (!claim) {
    return formatResponse(false, null, { code: 'CLAIM_NOT_FOUND', message: 'Affirmation introuvable.' }, {
      timestamp: nowIso(),
      version: API_VERSION,
    });
  }

  // Fallback for unverified sample
  if (id === 'claim-unverified-sample') {
    const result = VerificationService.verifyFallback(id);
    return formatResponse(true, result, null, { timestamp: nowIso(), version: API_VERSION });
  }

  const result = VerificationService.verifyClaim(id, body?.includeFullContext ?? true, body?.updateIceberg ?? true);
  if (!result) {
    return formatResponse(false, null, { code: 'CLAIM_NOT_FOUND', message: 'Affirmation introuvable.' }, {
      timestamp: nowIso(),
      version: API_VERSION,
    });
  }
  return formatResponse(true, result, null, { timestamp: nowIso(), version: API_VERSION });
}

export function contextLens(id: string, body?: { lensSliderPosition?: number }) {
  const claim = ClaimService.getClaimById(id);
  if (!claim) {
    return formatResponse(false, null, { code: 'CLAIM_NOT_FOUND', message: 'Affirmation introuvable.' }, {
      timestamp: nowIso(),
      version: API_VERSION,
    });
  }
  const result = ContextLensService.apply(id, body?.lensSliderPosition ?? 100);
  if (!result) {
    return formatResponse(false, null, { code: 'CLAIM_NOT_FOUND', message: 'Affirmation introuvable.' }, {
      timestamp: nowIso(),
      version: API_VERSION,
    });
  }
  return formatResponse(true, result, null, { timestamp: nowIso(), version: API_VERSION });
}
