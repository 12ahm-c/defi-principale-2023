import { CertificateService } from '@/core/certificate.service';
import { icebergService } from '@/core/iceberg.service';
import { formatResponse, nowIso, API_VERSION } from '@/utils/response-envelope';

export function generateCertificate(body: { capturedClaimIds?: string[]; selected2050PathwayId?: string }) {
  const result = CertificateService.generate({
    capturedClaimIds: body?.capturedClaimIds ?? [],
    selected2050PathwayId: body?.selected2050PathwayId ?? '',
  });
  return formatResponse(true, result, null, { timestamp: nowIso(), version: API_VERSION });
}

export function resetSession() {
  icebergService.reset();
  return formatResponse(true, {
    sessionReset: true,
    redirectToScreen: 2,
    newScenePack: 'scene_pack_b',
    initialClaimId: 'claim-buildings-insulation-01',
    resetIcebergIndex: 50,
  }, null, {
    timestamp: nowIso(),
    version: API_VERSION,
    message: 'Session réinitialisée avec succès pour une nouvelle exploration.',
  });
}