import { useEffect, useState } from 'react';
import { useSessionStore } from '@/state/session-store';
import apiClient from '@/services/api-client';
import Viewfinder from '@/components/Viewfinder';
import IndicatorsBar from '@/components/IndicatorsBar';
import ContextLens from '@/components/ContextLens';
import VerificationCard from '@/components/VerificationCard';
import IcebergWidget from '@/components/IcebergWidget';
import type { ClaimDTO } from '@/types/claim.types';
import type { IcebergStateDTO } from '@/types/iceberg.types';
import '@/styles/camera.css';
import '@/styles/context.css';

interface ContextResult {
  evaluation: string;
  evaluationLabelFr: string;
  reasonFr: string;
  socialJusticeDimension?: ClaimDTO['socialJusticeDimension'];
  verificationCard: ClaimDTO['verificationCard'];
}

export default function Screen5Context() {
  const [, update] = useSessionStore();
  const [claim, setClaim] = useState<ClaimDTO | null>(null);
  const [lensValue, setLensValue] = useState(0);
  const [result, setResult] = useState<ContextResult | null>(null);
  const [iceberg, setIceberg] = useState<IcebergStateDTO | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const res = apiClient.getClaims(5);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setClaim(res.data[0] as ClaimDTO);
    }
  }, []);

  const handleCapture = () => {
    if (!claim) return;
    setScanning(true);
    apiClient.scanClaim(claim.id, claim.rawText);
    const res = apiClient.contextLens(claim.id, lensValue);
    if (res.success && res.data) {
      setResult(res.data as ContextResult);
    }
    const ice = apiClient.getIcebergState();
    if (ice.success && ice.data) {
      setIceberg(ice.data as IcebergStateDTO);
    }
    setScanning(false);
  };

  if (!claim) {
    return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  }

  return (
    <main className="context-page">
      <header className="context-header">
        <h1>Caméra de la Vérité</h1>
        <p>Sources, preuves et contexte</p>
      </header>
      <section className="context-content">
      {!result ? (
        <>
          <Viewfinder claimText={claim.rawText} onCapture={handleCapture} isScanning={scanning} />
          <IndicatorsBar indicators={claim.indicators} />
          <ContextLens value={lensValue} onChange={setLensValue} />
          <button
            type="button"
            onClick={handleCapture}
            className="context-action-button"
          >
            Capturer avec contexte
          </button>
        </>
      ) : (
        <>
          <div className="context-result-badge">
            {result.evaluationLabelFr}
          </div>
          <p className="context-result-copy">{result.reasonFr}</p>
          {result.socialJusticeDimension && (
            <div className="context-insight-card">
              <h3>Justice sociale et transition juste</h3>
              <p>{result.socialJusticeDimension.insightFr}</p>
            </div>
          )}
          <VerificationCard card={result.verificationCard} />
          {iceberg && <IcebergWidget state={iceberg} />}
          <button
            type="button"
            onClick={() => update({ currentScreenId: 6 })}
            className="context-action-button"
          >
            Suivant
          </button>
        </>
      )}
      </section>
    </main>
  );
}
