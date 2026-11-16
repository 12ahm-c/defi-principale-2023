import { SourceCategory } from './source.types';

export interface VerificationSourceInfo {
  entity: string;
  sourceCategory: SourceCategory;
  documentTitle: string;
  publicationDate: string;
  officialUrl: string;
}

export interface VerificationFinding {
  findingQuote: string;
  exactReference: string;
  directLink: string;
}

export interface VerificationContextAndLimits {
  period: string;
  geographicScope: string;
  scenarioOrModel: string;
  confidenceLevel: string;
}

export interface VerificationCardDTO {
  source: VerificationSourceInfo;
  whatWeFound: VerificationFinding;
  contextAndLimits: VerificationContextAndLimits;
  whatWeDoNotKnow: string;
  neutralFallbackTriggered: boolean;
}
