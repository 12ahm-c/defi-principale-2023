import { ClaimService } from '@/core/claim.service';
import { OcrValidationService } from '@/core/ocr-validation.service';
import { formatResponse, nowIso, API_VERSION } from '@/utils/response-envelope';

export function getClaims(screenId?: number) {
  const data = screenId ? ClaimService.getClaimsByScreen(screenId) : ClaimService.getAll();
  return formatResponse(true, data, null, {
    timestamp: nowIso(),
    version: API_VERSION,
    total: data.length,
    screen: screenId ?? null,
  });
}

export function getClaimById(id: string) {
  const claim = ClaimService.getClaimById(id);
  if (!claim) {
    return formatResponse(false, null, { code: 'CLAIM_NOT_FOUND', message: 'Affirmation introuvable.' }, {
      timestamp: nowIso(),
      version: API_VERSION,
    });
  }
  return formatResponse(true, claim, null, { timestamp: nowIso(), version: API_VERSION });
}

export function scanClaim(id: string, body: { userConfirmedText?: string }) {
  const userConfirmedText = body?.userConfirmedText ?? '';
  const result = OcrValidationService.scan(id, userConfirmedText);
  if (!result) {
    return formatResponse(false, null, { code: 'CLAIM_NOT_FOUND', message: 'Affirmation introuvable.' }, {
      timestamp: nowIso(),
      version: API_VERSION,
    });
  }
  return formatResponse(true, result, null, { timestamp: nowIso(), version: API_VERSION });
}