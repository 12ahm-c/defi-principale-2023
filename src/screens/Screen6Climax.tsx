import { useEffect, useState } from 'react';
import { BookOpen, Check, ChevronDown } from 'lucide-react';
import { useSessionStore } from '@/state/session-store';
import apiClient from '@/services/api-client';
import type { TransitionPathwayDTO } from '@/types/transitions.types';
import type { CertificateDTO } from '@/types/certificate.types';
import '@/styles/climax.css';

function FinalIceberg({ meltIndex }: { meltIndex: number }) {
  const targetState = meltIndex > 50 ? 'trompeuse' : 'etayee';
  const [icebergState, setIcebergState] = useState<'etayee' | 'trompeuse'>('etayee');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIcebergState(targetState));
    return () => window.cancelAnimationFrame(frame);
  }, [targetState]);

  return (
    <div className={`final-iceberg final-iceberg-${icebergState}`} role="img" aria-label={icebergState === 'etayee' ? 'Iceberg intact et consolidé' : 'Iceberg partiellement fondu'}>
      <svg viewBox="0 0 720 580" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="final-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#faf9f6"/><stop offset="1" stopColor="#e9f5f8"/></linearGradient>
          <linearGradient id="final-sea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7cc1d8"/><stop offset="1" stopColor="#28789f"/></linearGradient>
          <linearGradient id="final-ice" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".5" stopColor="#8dc9df"/><stop offset="1" stopColor="#eaf9fa"/></linearGradient>
          <linearGradient id="final-sub-ice" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#62b0d0"/><stop offset=".52" stopColor="#236d94"/><stop offset="1" stopColor="#c8edf2"/></linearGradient>
          <linearGradient id="final-melt-wash" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e5f5f7" stopOpacity=".15"/><stop offset=".42" stopColor="#83c4d7" stopOpacity=".43"/><stop offset="1" stopColor="#4696b6" stopOpacity=".82"/></linearGradient>
          <clipPath id="final-underwater"><rect x="0" y="278" width="720" height="300" /></clipPath>
        </defs>
        <rect width="720" height="280" fill="url(#final-sky)" />
        <circle cx="575" cy="116" r="43" fill="#fbded2" opacity=".9" />
        <path d="M0 257 55 218l47 21 63-53 59 62 53-33 61 63ZM424 278l62-62 48 32 56-68 55 57 41-30 34 29v42Z" fill="#d1e6ed" />
        <path d="M0 280 52 249l50 13 63-50 58 57 53-35 62 46ZM430 280l57-47 48 24 55-53 56 48 43-19 31 24v23Z" fill="#e4f0f2" />
        <rect y="280" width="720" height="300" fill="url(#final-sea)" />
        <path d="M0 279h720" stroke="#fff" strokeWidth="5" />
        <g className="final-iceberg-body">
          <g className="final-iceberg-above">
            <path d="M204 281 248 223 284 199 315 140 357 83 396 138 428 196 473 229 524 281Z" fill="url(#final-ice)" />
            <path d="m357 83 39 55 32 58 45 33 51 52H357Z" fill="#fff" opacity=".82" />
            <path d="m204 281 74-82 37-59 42 102v39Z" fill="#65b2d0" opacity=".62" />
            <path className="final-iceberg-melt-wash" d="M357 83 396 138 428 196 473 229 524 281H204L248 223 284 199 315 140Z" fill="url(#final-melt-wash)" />
          </g>
          <g clipPath="url(#final-underwater)" className="final-iceberg-below">
            <path d="m204 279 320 0-38 83-43 65-87 130-74-81-48-75-30-67Z" fill="url(#final-sub-ice)" />
            <path d="m204 279 153 0v278l-74-81-48-75-30-67Z" fill="#155c84" opacity=".63" />
            <path d="m357 279 167 0-38 83-43 65Z" fill="#e3f7f8" opacity=".48" />
            <path d="m357 279 0 278-74-81-48-75-30-67Z" fill="#2a789b" opacity=".42" />
          </g>
        </g>
        <g className="final-iceberg-waves" fill="none" stroke="#e3f8fa" strokeWidth="2" opacity=".52">
          <path d="M0 307h104m45 0h87m324 0h83m35 0h42M26 345h117m430 0h147M0 392h83m504 0h110M57 453h96m410 0h122M0 518h120m441 0h159" />
        </g>
        {icebergState === 'etayee' && <g className="final-ice-sparkles" fill="#fff"><circle cx="347" cy="126" r="4"/><circle cx="402" cy="169" r="3"/><circle cx="318" cy="211" r="3"/></g>}
        {icebergState === 'trompeuse' && <g className="final-ice-drops" fill="#e9fbff"><circle className="peak-drop peak-drop-one" cx="350" cy="102" r="4"/><circle className="peak-drop peak-drop-two" cx="365" cy="108" r="3"/><circle className="peak-drop peak-drop-three" cx="358" cy="111" r="3.5"/><circle className="ice-drop-one" cx="290" cy="347" r="5"/><circle className="ice-drop-two" cx="437" cy="382" r="4"/><circle className="ice-drop-three" cx="359" cy="423" r="6"/></g>}
      </svg>
    </div>
  );
}

export default function Screen6Climax() {
  const [session, update] = useSessionStore();
  const [pathways, setPathways] = useState<TransitionPathwayDTO[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [certificate, setCertificate] = useState<CertificateDTO | null>(null);

  useEffect(() => {
    const response = apiClient.getTransitions();
    if (response.success && Array.isArray(response.data)) setPathways(response.data as TransitionPathwayDTO[]);
  }, []);

  const handleGenerate = () => {
    const pathwayId = pathways[selectedIndex]?.id ?? '';
    const response = apiClient.generateCertificate(session.capturedClaimIds, pathwayId);
    if (response.success && response.data) setCertificate(response.data as CertificateDTO);
    update({ selectedPathwayId: pathwayId });
  };

  const handleReplay = () => {
    apiClient.resetSession();
    update({
      currentScreenId: 2,
      screen4SubStep: 'claim1',
      capturedClaimIds: [],
      icebergIndex: 50,
      quizClaimIndex: 0,
      quizUserAnswer: null,
      quizAnswerCorrect: null,
      quizScore: 0,
    });
    setCertificate(null);
  };

  const selected = pathways[selectedIndex];
  const meltIndex = session.icebergIndex;

  return (
    <main className="climax-page">
      <svg className="climax-topography climax-topography-top" viewBox="0 0 230 220" aria-hidden="true"><path d="M-8 2c43 2 50 30 83 27s32-28 63-20 36 30 100 27M-8 24c40 1 51 27 82 24s33-24 62-17 37 27 102 24M-8 49c38 0 51 23 81 20s34-20 61-14 39 23 103 21M-8 74c36-1 50 19 80 16s35-17 60-11 40 19 102 17M-8 101c33-2 50 15 79 12s36-14 59-8 42 15 100 13" /></svg>
      <header className="climax-header"><h1>Caméra de la Vérité</h1></header>

      <section className="climax-content">
        <div className="climax-complete-badge"><span><Check size={23} strokeWidth={3} /></span><b>5/5</b><i>·</i> Défi terminé</div>
        <h2 className="climax-finished-title">Votre parcours<br />est terminé.</h2>

        <div className="climax-summary-card">
          <BookOpen className="climax-book-icon" size={62} strokeWidth={1.35} />
          <div><h3>Cinq affirmations examinées</h3><p>Sources, preuves et contexte aident à mieux comprendre.</p><small>Votre score : {session.quizScore} / 5 bonnes réponses</small></div>
        </div>

        <FinalIceberg meltIndex={meltIndex} />
        <p className="climax-iceberg-caption">{meltIndex > 50 ? 'Les réponses incorrectes ont fait fondre l’iceberg.' : 'Les bonnes réponses ont renforcé l’iceberg.'}</p>

        <button type="button" className="replay-button" onClick={handleReplay}>Rejouer</button>

        <details className="climax-explore">
          <summary>Explorer les chemins vers 2050 <ChevronDown size={20} /></summary>
          {pathways.length > 0 && (
            <div className="pathway-controls">
              <label htmlFor="pathway-range">Choisissez une trajectoire</label>
              <input id="pathway-range" type="range" min={0} max={pathways.length - 1} value={selectedIndex} onChange={(event) => setSelectedIndex(Number(event.target.value))} aria-label="Curseur Transitions 2050" />
              {selected && <div className="pathway-card"><b>{selected.title}</b><p>{selected.tagline}</p><small>Hypothèses : {selected.keyAssumptions}</small><small>Mix énergétique : {selected.energyMix}</small><small>{selected.feasibilityContext}</small></div>}
              <button type="button" className="certificate-button" onClick={handleGenerate}>Générer mon certificat</button>
              {certificate && <div className="certificate-card"><b>{certificate.recipientTitle}</b><p>Affirmations vérifiées : {certificate.verifiedClaimsCount}</p><p>{certificate.shareableSummaryText}</p></div>}
            </div>
          )}
        </details>
      </section>
      <svg className="climax-topography climax-topography-bottom" viewBox="0 0 260 210" aria-hidden="true"><path d="M-8 206c36-48 52-40 89-66s17-53 55-70 61-11 127-62M-8 187c34-40 52-34 83-55s21-47 57-62 63-11 131-58M-8 166c31-34 50-29 77-46s24-40 59-54 64-10 135-53M-8 144c28-27 48-24 71-37s27-32 61-44 65-9 139-49" /></svg>
    </main>
  );
}
