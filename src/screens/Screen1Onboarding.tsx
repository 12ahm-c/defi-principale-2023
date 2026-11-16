import { useSessionStore } from '@/state/session-store';
import apiClient from '@/services/api-client';
import '@/styles/onboarding.css';

function IcebergArtwork() {
  return (
    <svg className="onboarding-art" viewBox="0 0 720 500" role="img" aria-label="Un iceberg visible au-dessus et sous la mer">
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8fc7df"/><stop offset="1" stopColor="#c9e2eb"/></linearGradient>
        <linearGradient id="iceTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b9e2f1"/><stop offset=".55" stopColor="#6caed0"/><stop offset="1" stopColor="#e8f6f8"/></linearGradient>
        <linearGradient id="iceBelow" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#17658d"/><stop offset=".48" stopColor="#4c9dc1"/><stop offset="1" stopColor="#d2edf2"/></linearGradient>
        <clipPath id="underwater"><rect x="0" y="230" width="720" height="270"/></clipPath>
      </defs>
      <path d="M0 227 Q90 214 170 228 T340 225 T530 229 T720 222 V500 H0Z" fill="url(#sea)" opacity=".92"/>
      <path d="M0 230 Q90 223 180 230 T360 228 T540 231 T720 226" fill="none" stroke="#f6ffff" strokeWidth="4" opacity=".9"/>
      <path d="M0 220 L40 200 78 205 118 171 162 191 205 165 250 197 296 182 336 218Z" fill="#d8eaf0"/>
      <path d="M404 219 L446 188 478 201 515 168 557 194 595 175 636 205 680 191 720 215Z" fill="#d8eaf0"/>
      <path d="M263 228 L294 179 316 167 335 119 360 91 383 136 407 160 434 228Z" fill="url(#iceTop)"/>
      <path d="M360 91 L350 175 335 228 263 228Z" fill="#5da6cb" opacity=".75"/>
      <path d="M360 91 L383 136 407 160 434 228 360 228Z" fill="#f3fbfb" opacity=".92"/>
      <g clipPath="url(#underwater)">
        <path d="M263 225 L360 231 434 225 414 317 380 388 361 462 338 433 307 365 280 306Z" fill="url(#iceBelow)"/>
        <path d="M360 231 L360 453 338 433 307 365 280 306Z" fill="#125b84" opacity=".55"/>
        <path d="M360 231 L434 225 414 317 380 388Z" fill="#d7f0f3" opacity=".45"/>
      </g>
      <g fill="none" stroke="#0b2343" strokeWidth="6" strokeLinecap="round">
        <path d="M219 156V123q0-14 14-14h30"/><path d="M457 109h30q14 0 14 14v33"/>
        <path d="M219 337v34q0 14 14 14h30"/><path d="M457 385h30q14 0 14-14v-34"/>
      </g>
    </svg>
  );
}

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="47" fill="#eef8f8" stroke="#0b2343" strokeWidth="4"/>
      <path d="M15 60h90a45 45 0 0 1-90 0Z" fill="#19688f"/>
      <path d="M25 60 44 38l8 10 9-24 27 36Z" fill="#75b8d4"/>
      <path d="m52 48 9-24 9 19-8-4-5 10Z" fill="#fff"/>
      <path d="M60 65 76 82 64 101 46 79 38 65Z" fill="#4c98b8" opacity=".9"/>
      <circle cx="89" cy="30" r="4" fill="#fff"/>
      <circle cx="60" cy="60" r="54" fill="none" stroke="#0b2343" strokeWidth="2" strokeDasharray="125 18 60 130" transform="rotate(-30 60 60)"/>
    </svg>
  );
}

export default function Screen1Onboarding() {
  const [, update] = useSessionStore();

  return (
    <main className="onboarding-page">
      <svg className="topography topography-top" viewBox="0 0 230 260" aria-hidden="true">
        <path d="M-50 26C16-24 44 59 98 27S148-26 226 5M-42 52C16 5 42 85 96 53S153 1 222 31M-42 82C21 36 43 111 91 83S157 30 226 57M-36 111C20 68 37 141 87 114S157 61 225 87M-30 145C15 103 46 168 79 146S148 95 222 116M-34 183C4 143 36 194 69 176S136 130 211 146M-44 223C0 183 23 230 58 210S116 172 196 178"/>
      </svg>
      <svg className="topography topography-bottom" viewBox="0 0 270 300" aria-hidden="true">
        <path d="M13 303C10 231 49 225 86 197s-9-67 45-94 74-4 129-56M-4 286c2-62 45-62 78-90s-6-69 47-91 83-4 139-56M-6 253c5-47 41-50 69-73s-3-64 48-84 88 0 137-52M-7 220c7-39 34-42 57-59s-1-57 48-74 89 3 132-47M-7 187c9-30 28-32 45-45s3-48 49-63 87 8 124-40"/>
      </svg>

      <section className="onboarding-content">
        <header className="brand-lockup">
          <BrandMark />
          <p>Caméra de la Vérité</p>
        </header>
        <div className="intro-copy">
          <h1>Une affirmation<br />à la fois.</h1>
          <p>Examinez les sources, les preuves<br className="desktop-break" /> et le contexte des idées sur le climat.</p>
        </div>
        <div className="artwork-wrap"><IcebergArtwork /></div>
        <button
          type="button"
          onClick={() => {
            apiClient.resetSession();
            update({
              currentScreenId: 2,
              activeClaimId: 'claim-renewables-01',
              quizClaimIndex: 0,
              quizUserAnswer: null,
              quizAnswerCorrect: null,
              quizScore: 0,
              capturedClaimIds: [],
              icebergIndex: 50,
            });
          }}
          className="start-button"
        >
          Commencer
        </button>
        <p className="privacy-note">Sans compte <span>•</span> Sans collecte de données</p>
      </section>
    </main>
  );
}
