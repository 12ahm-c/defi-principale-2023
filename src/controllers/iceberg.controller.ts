import { icebergService } from '@/core/iceberg.service';
import { formatResponse, nowIso, API_VERSION } from '@/utils/response-envelope';

export function getIcebergState() {
  const data = icebergService.getState();
  return formatResponse(true, data, null, { timestamp: nowIso(), version: API_VERSION });
}

export function applyQuizAnswer(isCorrect: boolean) {
  icebergService.onQuizAnswer(isCorrect);
  return getIcebergState();
}
