import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, XCircle } from 'lucide-react';
import { useSessionStore } from '@/state/session-store';
import apiClient from '@/services/api-client';
import type { ClaimDTO } from '@/types/claim.types';
import '@/styles/quiz.css';

interface VerifyData {
  evaluation: string;
  evaluationLabelFr: string;
  reasonFr: string;
  ahaInsightFr?: string;
  verificationCard: ClaimDTO['verificationCard'];
}

function GameIceberg({ meltIndex, change, mode }: { meltIndex: number; change: 'melt' | 'restore' | null; mode: 'waiting' | 'correct' | 'wrong' }) {
  const melted = `${Math.max(0, Math.min(60, 60 - meltIndex * 0.6))}%`;
  const waiting = mode === 'waiting';
  return (
    <div className={`game-iceberg-wrap${waiting ? ' game-iceberg-waiting' : ' game-iceberg-result'}`}>
      <div className={`game-iceberg${change ? ` iceberg-changing iceberg-${change}` : ''}${mode !== 'waiting' ? ` iceberg-result-${mode}` : ''}`} aria-label={`Niveau de fonte ${meltIndex} pour cent`}>
        <svg viewBox="0 0 440 280" aria-hidden="true">
          <defs>
            <linearGradient id="game-ocean" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dff0f2"/><stop offset=".2" stopColor="#4c9dbb"/><stop offset="1" stopColor="#1c5577"/></linearGradient>
            <linearGradient id="game-ice" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".5" stopColor="#83c3dc"/><stop offset="1" stopColor="#e9f9fa"/></linearGradient>
            <clipPath id="game-underwater"><rect y="145" width="440" height="135" /></clipPath>
          </defs>
          <rect width="440" height="145" fill="#fbfaf6" />
          <path d="M0 131 42 98 79 116 119 82 156 119 197 96 229 139ZM270 139 302 111 341 125 371 91 407 119 440 104v41H270Z" fill="#d9e9ec" />
          <rect y="145" width="440" height="135" fill="url(#game-ocean)" />
          <path d="M0 145h440" stroke="#f7ffff" strokeWidth="4" />
          <path d="M145 145 169 111 187 96 205 62 222 27 244 63 262 96 284 112 310 145Z" fill="url(#game-ice)" />
          <path d="m222 27 22 36 18 33 22 16 26 33h-88Z" fill="#fff" opacity=".82" />
          <path d="m145 145 165 0-17 46-26 38-48 49-37-37-27-43-10-31Z" fill="url(#game-ice)" clipPath="url(#game-underwater)" />
          <path d="m145 145 77 0v133l-37-37-27-43-10-31Z" fill="#28749a" opacity=".68" clipPath="url(#game-underwater)" />
          <g className="iceberg-waves" fill="none" stroke="#d7f3f6" strokeWidth="2" opacity=".38"><path d="M13 171h78m32 0h38m208 0h62M36 199h84m233 0h77M4 238h56m325 0h50" /></g>
        </svg>
        <div className="iceberg-melt-mask" style={{ clipPath: `inset(${melted} 0 0)` }} />
        {(change === 'melt' || mode === 'wrong') && <><i className="iceberg-drop iceberg-drop-one" /><i className="iceberg-drop iceberg-drop-two" /><i className="iceberg-drop iceberg-drop-three" /></>}
        {(change === 'restore' || mode === 'correct') && <><i className="iceberg-spark iceberg-spark-one" /><i className="iceberg-spark iceberg-spark-two" /><i className="iceberg-spark iceberg-spark-three" /></>}
      </div>
      <p>{waiting ? 'L’iceberg attend le résultat.' : mode === 'correct' ? 'L’iceberg se renforce.' : 'L’iceberg fond.'}</p>
    </div>
  );
}

function MountainMark() {
  return <svg className="scan-brand-mark" viewBox="0 0 80 54" aria-hidden="true"><path d="M6 47 27 21l10 10L50 5l24 42Z" fill="#173b5c"/><path d="m37 31 13-26 12 23-10-7-8 12Z" fill="#eaf7f8"/></svg>;
}

export default function Screen3ResultFirst() {
  const [session, update] = useSessionStore();
  const [claim, setClaim] = useState<ClaimDTO | null>(null);
  const [result, setResult] = useState<VerifyData | null>(null);
  const [scanning, setScanning] = useState(false);
  const [icebergChange, setIcebergChange] = useState<'melt' | 'restore' | null>(null);
  const [error, setError] = useState('');
  const [retryIndex, setRetryIndex] = useState(0);
  const startedClaimId = useRef('');

  useEffect(() => {
    if (!session.activeClaimId) return;
    const response = apiClient.getClaim(session.activeClaimId);
    if (response.success && response.data) setClaim(response.data as ClaimDTO);
  }, [session.activeClaimId]);

  useEffect(() => {
    if (!claim || session.quizUserAnswer === null || startedClaimId.current === claim.id) return;
    startedClaimId.current = claim.id;
    setScanning(true);

    const analyze = async () => {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 900));
      apiClient.scanClaim(claim.id, claim.rawText);
      const response = apiClient.verifyClaim(claim.id, true, false);
      if (!response.success || !response.data) {
        startedClaimId.current = '';
        setError('Impossible d’analyser cette affirmation. Réessayez.');
        setScanning(false);
        return;
      }

      const verified = response.data as VerifyData;
      const statementIsTrue = verified.evaluation === 'soutenu';
      const answerIsCorrect = session.quizUserAnswer === statementIsTrue;
      const icebergResponse = apiClient.applyQuizAnswer(answerIsCorrect);
      const nextMeltIndex = icebergResponse.success && icebergResponse.data
        ? (icebergResponse.data as { meltIndex: number }).meltIndex
        : session.icebergIndex;

      setIcebergChange(answerIsCorrect ? 'restore' : 'melt');
      update({
        quizAnswerCorrect: answerIsCorrect,
        quizScore: session.quizScore + (answerIsCorrect ? 1 : 0),
        capturedClaimIds: [...session.capturedClaimIds, claim.id],
        icebergIndex: nextMeltIndex,
      });

      await new Promise<void>((resolve) => window.setTimeout(resolve, 1400));
      setResult(verified);
      setIcebergChange(null);
      setScanning(false);
    };

    void analyze();
  }, [claim, session.quizUserAnswer, session.quizScore, session.capturedClaimIds, session.icebergIndex, update, retryIndex]);

  const handleNext = () => {
    if (session.quizClaimIndex >= 4) {
      update({ currentScreenId: 6, quizUserAnswer: null });
      return;
    }
    update({
      currentScreenId: 2,
      quizClaimIndex: session.quizClaimIndex + 1,
      quizUserAnswer: null,
      quizAnswerCorrect: null,
    });
  };

  if (!claim) return <div className="quiz-loading">Préparation de l’analyse…</div>;

  const answerWasCorrect = session.quizAnswerCorrect === true;
  const choiceLabel = session.quizUserAnswer ? 'Vrai' : 'Faux';

  return (
    <main className="quiz-page quiz-scan-page">
      <span className="scan-topography" aria-hidden="true" />
      <header className="quiz-header">
        {!result && <MountainMark />}
        <h1>Caméra de la Vérité</h1>
        {result && <svg className="result-wave-mark" viewBox="0 0 100 20" aria-hidden="true"><path d="M2 10c15-14 29 14 46 0s30-14 50 0" /></svg>}
        <div className="quiz-step-count"><span>{session.quizClaimIndex + 1} / 5</span><b>·</b> {result ? 'Résultat' : 'Analyse'}</div>
        <div className="quiz-progress" aria-label={`Question ${session.quizClaimIndex + 1} sur 5`}>
          {Array.from({ length: 5 }, (_, index) => <i className={index <= session.quizClaimIndex ? 'is-current' : ''} key={index} />)}
        </div>
      </header>

      <section className="quiz-scan-content" aria-busy={scanning}>
        {!result ? (
          <>
            <div className="scan-recorded"><span><Check size={22} strokeWidth={3} /></span>Réponse enregistrée</div>
            <div className="quiz-scan-window">
              <span className="quiz-frame quiz-frame-top-left" /><span className="quiz-frame quiz-frame-top-right" />
              <span className="quiz-frame quiz-frame-bottom-left" /><span className="quiz-frame quiz-frame-bottom-right" />
              <div className="quiz-scan-paper"><span>Affirmation à examiner</span><p>{claim.rawText}</p></div>
              <div className="quiz-scan-line" />
            </div>
            <div className="scan-progress-state" aria-live="polite">{error ? <b className="scan-error-label">Analyse interrompue</b> : <><span className="scan-spinner" /><b>Analyse en cours…</b></>}</div>
            <p className="scan-supporting-copy">Vous avez choisi : {choiceLabel}. La réponse sera révélée après l’analyse.</p>
            <GameIceberg meltIndex={session.icebergIndex} change={icebergChange} mode="waiting" />
            {error && <div className="quiz-error-wrap" role="alert"><p className="quiz-error">{error}</p><button type="button" onClick={() => { setError(''); setRetryIndex((index) => index + 1); }}>Réessayer</button></div>}
          </>
        ) : (
          <>
            <div className={`quiz-outcome ${answerWasCorrect ? 'quiz-outcome-correct' : 'quiz-outcome-wrong'}`}>
              <span className="quiz-outcome-icon">{answerWasCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}</span>
              <div><h2>{answerWasCorrect ? 'Bonne réponse !' : 'Réponse incorrecte'}</h2><p>{answerWasCorrect ? 'Votre réponse correspond à la réponse attendue.' : 'La caméra révèle la réponse correcte.'}</p></div>
            </div>
            <article className="quiz-result-claim">
              <span>Affirmation à examiner</span>
              <p>{claim.rawText}</p>
              <small>Réponse attendue : <b>{result.evaluation === 'soutenu' ? 'Vrai' : 'Faux'}</b> · {result.evaluationLabelFr}</small>
            </article>
            <GameIceberg meltIndex={session.icebergIndex} change={null} mode={answerWasCorrect ? 'correct' : 'wrong'} />
            <details className="quiz-result-details"><summary>Pourquoi cette réponse ?</summary><p>{result.reasonFr}</p>{result.ahaInsightFr && <p>{result.ahaInsightFr}</p>}</details>
            <p className="quiz-score">Votre score : <b>{session.quizScore} / 5</b></p>
            <button className="quiz-reveal-button" type="button" onClick={handleNext}><span>{session.quizClaimIndex >= 4 ? 'Voir mon résultat final' : 'Question suivante'}</span><ArrowRight size={24} /></button>
          </>
        )}
      </section>
    </main>
  );
}
