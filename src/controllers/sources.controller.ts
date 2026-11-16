import sourcesData from '@/data/sources.json';
import { formatResponse, nowIso, API_VERSION } from '@/utils/response-envelope';

export function getSources() {
  const data = sourcesData;
  return formatResponse(true, data, null, {
    timestamp: nowIso(),
    version: API_VERSION,
    totalSources: Array.isArray(data) ? data.length : 0,
  });
}