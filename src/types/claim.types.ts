import { VerificationCardDTO } from './verification.types';

export type EvaluationResult = 'soutenu' | 'trompeur' | 'necessite_contexte' | 'non_verifie';

export type ClaimCategory =
  | 'observation_historique'
  | 'projection_conditionnelle'
  | 'option_attenuation'
  | 'option_adaptation';

export interface IndicatorDTO {
  name: string;
  hint: string;
  status: 'green' | 'yellow' | 'red';
}

export interface ClaimIndicators {
  sourceIndicator: IndicatorDTO;
  evidenceIndicator: IndicatorDTO;
  contextIndicator: IndicatorDTO;
}

export interface SocialJusticeDimension {
  principle: string;
  insightFr: string;
  supportingSources: string[];
}

export interface ClaimDTO {
  id: string;
  screenId: number;
  sequenceOrder?: number;
  rawText: string;
  category: ClaimCategory;
  inactionDiscoursePattern?: string;
  indicators: ClaimIndicators;
  evaluation: EvaluationResult;
  evaluationLabelFr: string;
  reasonFr: string;
  ahaInsightFr?: string;
  actionablePositiveInsightFr?: string;
  socialJusticeDimension?: SocialJusticeDimension;
  verificationCard: VerificationCardDTO;
}
