export interface StandardResponseEnvelope<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
  meta: {
    timestamp: string;
    version: string;
    [key: string]: unknown;
  } | null;
}

export interface AppSessionState {
  currentScreenId: 1 | 2 | 3 | 4 | 5 | 6;
  screen4SubStep: 'claim1' | 'claim2';
  activeClaimId: string;
  isScanning: boolean;
  contextLensValue: number; // 0 to 100
  selectedPathwayId: string;
  capturedClaimIds: string[];
  icebergIndex: number;
  quizClaimIndex: number;
  quizUserAnswer: boolean | null;
  quizAnswerCorrect: boolean | null;
  quizScore: number;
}
