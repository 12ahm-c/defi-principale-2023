import claimsData from '@/data/claims.json';
import type { ClaimDTO } from '@/types/claim.types';

const claims: ClaimDTO[] = claimsData as ClaimDTO[];

export class ClaimService {
  static getAll(): ClaimDTO[] {
    return claims;
  }

  static getClaimsByScreen(screenId: number): ClaimDTO[] {
    return claims.filter((c) => c.screenId === screenId);
  }

  static getClaimById(id: string): ClaimDTO | undefined {
    return claims.find((c) => c.id === id);
  }

  static getScreen4Sequence(step: 1 | 2): ClaimDTO | undefined {
    const order = step === 1 ? 1 : 2;
    return claims.find((c) => c.screenId === 4 && c.sequenceOrder === order);
  }
}

export default ClaimService;