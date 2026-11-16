import { useEffect, useState } from 'react';
import { ArrowRight, Camera, Check, ChevronRight, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { useSessionStore } from '@/state/session-store';
import apiClient from '@/services/api-client';
import VerificationCard from '@/components/VerificationCard';
import type { ClaimDTO } from '@/types/claim.types';
import '@/styles/crossroads.css';

interface VerifyData {
  verificationCard: ClaimDTO['verificationCard'];
}

function IcebergPreview() {
  return (
    <svg className="crossroads-iceberg" viewBox="0 0 600 310" aria-hidden="true">
      <defs>
        <linearGradient id="crossroads-sea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#badce5"/><stop offset="1" stopColor="#f4faf8"/></linearGradient>
        <linearGradient id="crossroads-ice" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eef9fa"/><stop offset=".52" stopColor="#a9d8e7"/><stop offset="1" stopColor="#f8ffff"/></linearGradient>
        <clipPath id="crossroads-underwater"><rect y="165" width="600" height="145"/></clipPath>
      </defs>
      <rect y="118" width="600" height="192" fill="url(#crossroads-sea)"/>
      <path d="M0 152 44 119l35 21 35-31 43 35 35-25 44 33ZM375 154l42-33 39 17 36-32 39 29 37-20 32 28v35H375Z" fill="#c9e2e9" opacity=".8"/>
      <path d="M0 164h600" stroke="#fff" strokeWidth="4" opacity=".9"/>
      <path d="M222 165 256 125 278 107 297 72 317 40 340 76 357 111 382 131 406 165Z" fill="url(#crossroads-ice)"/>
      <path d="m317 40 4 55-24 70h-75l34-40 22-18 19-35Z" fill="#9bcde0" opacity=".65"/>
      <path d="m317 40 23 36 17 35 25 20 24 34h-89Z" fill="#fff" opacity=".85"/>
      <g clipPath="url(#crossroads-underwater)">
        <path d="m222 164 184 0-17 60-31 41-41 44-34-34-34-45-20-40Z" fill="url(#crossroads-ice)"/>
        <path d="m222 164 95 0v145l-34-34-34-45-20-40Z" fill="#b5dce7" opacity=".76"/>
        <path d="m317 164 89 0-17 60-31 41Z" fill="#f8ffff" opacity=".75"/>
      </g>
      <g fill="none" stroke="#5d9db9" strokeWidth="2" opacity=".24"><path d="M17 191h54m42 0h32m310 0h58m42 0h27M4 224h68m422 0h86M19 269h64m434 0h69"/></g>
    </svg>
  );
}

function MountainLine() {
  return <svg className="crossroads-mountain-line" viewBox="0 0 210 64" aria-hidden="true"><path d="M2 55h30l20-12 19 5 22-25 12 9 15-27 18 26 13-10 22 24 14-4 20 14h4M71 48l22-25 9 9 16-27 17 25 8-8 12 16" /></svg>;
}

export default function Screen4Crossroads() {
  const [session, update] = useSessionStore();
  const [claims, setClaims] = useState<ClaimDTO[]>([]);
  const [verified, setVerified] = useState(false);
  const [result, setResult] = useState<VerifyData | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const res = apiClient.getClaims(4);
    if (res.success && Array.isArray(res.data)) setClaims(res.data as ClaimDTO[]);
  }, []);

  const subStep = session.screen4SubStep;
  const claim = subStep === 'claim1' ? claims[0] : claims[1];

  const handleExamine = () => {
    if (!claim || scanning) return;
    setScanning(true);
    apiClient.scanClaim(claim.id, claim.rawText);
    const res = apiClient.verifyClaim(claim.id, true);
    if (res.success && res.data) {
      setResult(res.data as VerifyData);
      setVerified(true);
    }
    setScanning(false);
  };

  const handleReturn = () => {
    if (subStep === 'claim2') {
      update({ screen4SubStep: 'claim1' });
      setVerified(false);
      setResult(null);
      return;
    }
    update({ currentScreenId: 3 });
  };

  const handleContinue = () => {
    if (subStep === 'claim1') {
      update({ screen4SubStep: 'claim2' });
      setVerified(false);
      setResult(null);
    } else {
      update({ currentScreenId: 5, screen4SubStep: 'claim1' });
    }
  };

  if (!claim) return <div className="crossroads-loading">Chargement…</div>;

  return (
    <main className="crossroads-page">
      <MountainLine />
      <header className="crossroads-header">
        <div className="crossroads-brand"><span><Camera size={32} strokeWidth={1.8} /></span><h1>Caméra de la Vérité</h1></div>
        <div className="crossroads-progress"><i /><i /></div>
        <p>2/2 <b>·</b> Affirmation</p>
      </header>

      {!verified ? (
        <section className="crossroads-main">
          <div className="crossroads-intro">
            <h2>À vous de voir</h2>
            <p>Repérez les indices avant de révéler le résultat.</p>
          </div>

          <div className="next-claim-card">
            <span className="target-corner target-top-left" /><span className="target-corner target-top-right" />
            <span className="target-corner target-bottom-left" /><span className="target-corner target-bottom-right" />
            <Camera className="next-claim-camera" size={42} strokeWidth={1.5} />
            <h3>Affirmation suivante</h3>
            <p className="next-claim-text">{claim.rawText}</p>
            <IcebergPreview />
            <span className="iceberg-target" aria-hidden="true"><i>+</i></span>
          </div>

          <div className="crossroads-actions">
            <button className="examine-button" type="button" onClick={handleExamine} disabled={scanning}>
              <span>{scanning ? 'Examen en cours…' : 'Examiner'}</span><ArrowRight size={27} />
            </button>
            <button className="return-button" type="button" onClick={handleReturn}>Retour</button>
          </div>
        </section>
      ) : (
        <section className="crossroads-verified">
          <div className="verified-heading"><span><Check size={23} /></span><div><h2>Affirmation examinée</h2><p>{claim.rawText}</p></div></div>
          {result && <VerificationCard card={result.verificationCard} />}
          <div className="verified-hints"><span><FileText size={18} /> Source</span><span><Search size={18} /> Preuve</span><span><SlidersHorizontal size={18} /> Contexte</span></div>
          <button className="examine-button" type="button" onClick={handleContinue}><span>{subStep === 'claim1' ? 'Affirmation suivante' : 'Poursuivre'}</span><ChevronRight size={25} /></button>
          <button className="return-button" type="button" onClick={handleReturn}>Retour</button>
        </section>
      )}
    </main>
  );
}
