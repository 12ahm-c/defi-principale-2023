export function validateVerifyRequest(body: unknown): { isValid: boolean; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { isValid: false, error: 'Le corps de la requête doit être un objet JSON valide.' };
  }
  return { isValid: true };
}

export function validateScreen4Sequence(currentClaimId: string, requestedSequenceOrder: number): boolean {
  if (requestedSequenceOrder === 1 && currentClaimId === 'claim-inaction-01') return true;
  if (requestedSequenceOrder === 2 && currentClaimId === 'claim-tech-save-02') return true;
  return false;
}

export function validateContextLensRequest(body: unknown): { isValid: boolean; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { isValid: false, error: 'Le corps de la requête doit être un objet JSON valide.' };
  }
  const b = body as { lensSliderPosition?: unknown };
  if (b.lensSliderPosition !== undefined && typeof b.lensSliderPosition !== 'number') {
    return { isValid: false, error: 'lensSliderPosition doit être un nombre.' };
  }
  return { isValid: true };
}