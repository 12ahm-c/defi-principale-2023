import * as claimsCtrl from '@/controllers/claims.controller';
import * as verificationCtrl from '@/controllers/verification.controller';
import * as sourcesCtrl from '@/controllers/sources.controller';
import * as icebergCtrl from '@/controllers/iceberg.controller';
import * as transitionsCtrl from '@/controllers/transitions.controller';
import * as certificateCtrl from '@/controllers/certificate.controller';

export const apiClient = {
  getClaims: (screenId?: number) => claimsCtrl.getClaims(screenId),
  getClaim: (id: string) => claimsCtrl.getClaimById(id),
  scanClaim: (id: string, userConfirmedText: string) =>
    claimsCtrl.scanClaim(id, { userConfirmedText }),
  verifyClaim: (id: string, includeFullContext = true, updateIceberg = true) =>
    verificationCtrl.verifyClaim(id, { includeFullContext, updateIceberg }),
  contextLens: (id: string, lensSliderPosition: number) =>
    verificationCtrl.contextLens(id, { lensSliderPosition }),
  getSources: () => sourcesCtrl.getSources(),
  getIcebergState: () => icebergCtrl.getIcebergState(),
  applyQuizAnswer: (isCorrect: boolean) => icebergCtrl.applyQuizAnswer(isCorrect),
  getTransitions: () => transitionsCtrl.getTransitionsPathways(),
  generateCertificate: (capturedClaimIds: string[], selected2050PathwayId: string) =>
    certificateCtrl.generateCertificate({ capturedClaimIds, selected2050PathwayId }),
  resetSession: () => certificateCtrl.resetSession(),
};

export default apiClient;
