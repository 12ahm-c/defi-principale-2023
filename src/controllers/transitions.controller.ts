import { TransitionsService } from '@/core/transitions.service';
import { formatResponse, nowIso, API_VERSION } from '@/utils/response-envelope';

export function getTransitionsPathways() {
  const data = TransitionsService.getPathways();
  const meta = TransitionsService.getMeta();
  return formatResponse(true, data, null, {
    timestamp: nowIso(),
    version: API_VERSION,
    source: meta.source,
    methodologyWarning: meta.methodologyWarning,
  });
}