import { useState, useEffect, useCallback } from 'react';
import type { AppSessionState } from '@/types/state.types';

const initial: AppSessionState = {
  currentScreenId: 1,
  screen4SubStep: 'claim1',
  activeClaimId: '',
  isScanning: false,
  contextLensValue: 0,
  selectedPathwayId: '',
  capturedClaimIds: [],
  icebergIndex: 50,
  quizClaimIndex: 0,
  quizUserAnswer: null,
  quizAnswerCorrect: null,
  quizScore: 0,
};

let state: AppSessionState = { ...initial };
const listeners = new Set<(s: AppSessionState) => void>();

export function getSessionState(): AppSessionState {
  return state;
}

export function setSessionState(partial: Partial<AppSessionState>): void {
  state = { ...state, ...partial };
  listeners.forEach((l) => l(state));
}

export function resetSessionState(): void {
  state = { ...initial };
  listeners.forEach((l) => l(state));
}

export function subscribeSession(listener: (s: AppSessionState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSessionStore(): [AppSessionState, (p: Partial<AppSessionState>) => void] {
  const [s, setS] = useState<AppSessionState>(state);
  useEffect(() => {
    const unsub = subscribeSession(setS);
    return unsub;
  }, []);
  const update = useCallback((p: Partial<AppSessionState>) => setSessionState(p), []);
  return [s, update];
}
