export interface CertificateDTO {
  certificateId: string;
  issuedAt: string;
  recipientTitle: string;
  verifiedClaimsCount: number;
  icebergFinalStatus: {
    meltIndex: number;
    state: string;
    badgeTitle: string;
    badgeIconSvg: string;
  };
  coreLearningSummaryFr: string;
  shareableSummaryText: string;
  actions: {
    downloadPngUrl: string;
    replayUrl: string;
  };
}
