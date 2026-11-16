import { useEffect, useState } from 'react';
import { Globe2 } from 'lucide-react';
import { useSessionStore } from '@/state/session-store';
import apiClient from '@/services/api-client';
import type { ClaimDTO } from '@/types/claim.types';
import '@/styles/quiz.css';

const QUIZ_CLAIM_IDS = [
  'claim-renewables-01',
  'claim-inaction-01',
  'claim-tech-save-02',
  'claim-ev-context-01',
  'claim-buildings-insulation-01',
];

function QuizIcebergScene() {
  return (
    <svg className="quiz-question-iceberg" viewBox="0 0 720 410" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="quiz-ocean" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#244f6c"/><stop offset="1" stopColor="#123a5a"/></linearGradient>
        <linearGradient id="quiz-ice" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f5fcfc"/><stop offset=".52" stopColor="#91cde0"/><stop offset="1" stopColor="#d4eef1"/></linearGradient>
        <clipPath id="quiz-underwater"><rect y="210" width="720" height="200"/></clipPath>
      </defs>
      <rect width="720" height="210" fill="#faf9f5"/>
      <path d="M0 194 51 155 91 174 145 130 202 177 247 152 293 196ZM414 196 463 157 505 177 555 135 598 174 648 146 720 188v22H414Z" fill="#d5e7eb"/>
      <path d="M0 203h720" stroke="#fff" strokeWidth="4"/>
      <rect y="210" width="720" height="200" fill="url(#quiz-ocean)"/>
      <path d="M0 210h720" stroke="#e8f9fb" strokeWidth="3"/>
      <path d="M252 210 292 155 322 135 346 83 370 39 399 85 424 128 455 154 493 210Z" fill="url(#quiz-ice)"/>
      <path d="m370 39 9 83-33 88h-94l40-55 30-20 24-52Z" fill="#77b7d1" opacity=".75"/>
      <path d="m370 39 29 46 25 43 31 26 38 56h-123Z" fill="#fff" opacity=".9"/>
      <g clipPath="url(#quiz-underwater)">
        <path d="m252 210 241 0-24 73-39 55-60 69-45-43-44-62-26-52Z" fill="url(#quiz-ice)"/>
        <path d="m252 210 118 0v197l-45-43-44-62-26-52Z" fill="#387b9d" opacity=".75"/>
        <path d="m370 210 123 0-24 73-39 55Z" fill="#ebfafb" opacity=".58"/>
      </g>
      <path d="M0 233h112m54 0h55m387 0h85M31 274h100m420 0h134M0 326h79m558 0h82" stroke="#a4d5e3" strokeWidth="2" opacity=".3"/>
    </svg>
  );
}

export default function Screen2CameraFirst() {
  const [session, update] = useSessionStore();
  const [claims, setClaims] = useState<ClaimDTO[]>([]);

  useEffect(() => {
    const response = apiClient.getClaims();
    if (response.success && Array.isArray(response.data)) {
      const allClaims = response.data as ClaimDTO[];
      setClaims(QUIZ_CLAIM_IDS.map((id) => allClaims.find((claim) => claim.id === id)).filter((claim): claim is ClaimDTO => Boolean(claim)));
    }
  }, []);

  const claim = claims[session.quizClaimIndex];
  const chooseAnswer = (answer: boolean) => {
    if (!claim) return;
    update({
      activeClaimId: claim.id,
      quizUserAnswer: answer,
      quizAnswerCorrect: null,
      currentScreenId: 3,
    });
  };

  if (!claim) return <div className="quiz-loading">Chargement…</div>;

  return (
    <main className="quiz-page quiz-question-page">
      <svg className="quiz-question-contours quiz-contours-left" viewBox="0 0 230 245" aria-hidden="true"><path d="M-12 12C24 10 34 44 73 42s29-24 60-16 43 33 92 30M-12 32c34-1 47 28 81 27s32-20 60-12 43 27 91 25M-12 55c34 0 49 23 81 22s33-17 61-9 45 22 91 20M-12 80c34 1 50 18 81 17s34-13 61-6 46 17 91 16M-12 107c34 2 50 14 81 13s35-10 61-3 47 14 91 13M-12 135c34 4 50 10 81 9s35-7 61-1 47 10 91 10" /></svg>
      <svg className="quiz-question-contours quiz-contours-right" viewBox="0 0 230 245" aria-hidden="true"><path d="M242 12c-36-2-46 32-85 30s-29-24-60-16-43 33-92 30M242 32c-34-1-47 28-81 27s-32-20-60-12-43 27-91 25M242 55c-34 0-49 23-81 22s-33-17-61-9-45 22-91 20M242 80c-34 1-50 18-81 17s-34-13-61-6-46 17-91 16M242 107c-34 2-50 14-81 13s-35-10-61-3-47 14-91 13" /></svg>
      <span className="quiz-sun" aria-hidden="true" />
      <header className="quiz-header">
        <h1>Caméra de la Vérité</h1>
        <div className="quiz-step-count"><span>{session.quizClaimIndex + 1} / 5</span><b>·</b> Affirmation</div>
        <div className="quiz-progress" aria-label={`Question ${session.quizClaimIndex + 1} sur 5`}>
          {QUIZ_CLAIM_IDS.map((id, index) => <i className={index <= session.quizClaimIndex ? 'is-current' : ''} key={id} />)}
        </div>
      </header>

      <section className="quiz-question">
        <h2>À vous de trancher</h2>
        <span className="quiz-title-underline" />
        <article className="quiz-claim-card">
          <Globe2 className="quiz-claim-globe" size={54} strokeWidth={1.35} />
          <span className="quiz-claim-label">Affirmation à examiner</span>
          <p>{claim.rawText}</p>
        </article>
        <p className="quiz-answer-question">Cette affirmation est-elle vraie ou fausse&nbsp;?</p>
        <div className="quiz-answer-buttons">
          <button className="quiz-answer quiz-answer-true" type="button" onClick={() => chooseAnswer(true)}>Vrai</button>
          <button className="quiz-answer quiz-answer-false" type="button" onClick={() => chooseAnswer(false)}>Faux</button>
        </div>
      </section>
      <QuizIcebergScene />
      <p className="quiz-iceberg-caption">L’iceberg évolue au fil de vos réponses.</p>
    </main>
  );
}
