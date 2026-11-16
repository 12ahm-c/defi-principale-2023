import type { StandardResponseEnvelope } from '@/types/state.types';

export function formatResponse<T>(
  success: boolean,
  data: T | null,
  error: { code: string; message: string; details?: Record<string, unknown> } | null,
  meta: { timestamp: string; version: string; [key: string]: unknown } | null,
): StandardResponseEnvelope<T> {
  return {
    success,
    data,
    error,
    meta,
  };
}

export function nowIso(): string {
  return new Date().toISOString();
}

export const API_VERSION = 'v1.0';