import type { VerificationCardDTO } from '@/types/verification.types';

interface Props {
  card: VerificationCardDTO;
}

export default function VerificationCard({ card }: Props) {
  return (
    <div className="verification-card bg-white rounded-xl shadow p-4 space-y-3 text-sm">
      <section>
        <h3 className="font-semibold text-verite-deep">Source</h3>
        <p className="text-gray-700">{card.source.entity}</p>
        <p className="text-gray-500 text-xs">{card.source.documentTitle} — {card.source.publicationDate}</p>
        <a href={card.source.officialUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs underline">
          {card.source.officialUrl}
        </a>
      </section>
      <section>
        <h3 className="font-semibold text-verite-deep">Ce que nous avons trouvé</h3>
        <p className="text-gray-700 italic">« {card.whatWeFound.findingQuote} »</p>
        <p className="text-gray-500 text-xs">{card.whatWeFound.exactReference}</p>
        {card.whatWeFound.directLink && (
          <a href={card.whatWeFound.directLink} target="_blank" rel="noreferrer" className="text-blue-600 text-xs underline">
            Lien direct
          </a>
        )}
      </section>
      <section>
        <h3 className="font-semibold text-verite-deep">Contexte & Limites</h3>
        <p className="text-gray-700 text-xs">Période: {card.contextAndLimits.period}</p>
        <p className="text-gray-700 text-xs">Portée: {card.contextAndLimits.geographicScope}</p>
        <p className="text-gray-700 text-xs">Scénario: {card.contextAndLimits.scenarioOrModel}</p>
        <p className="text-gray-700 text-xs">Confiance: {card.contextAndLimits.confidenceLevel}</p>
      </section>
      <section>
        <h3 className="font-semibold text-verite-deep">Ce que nous ne savons pas</h3>
        <p className="text-gray-700 text-xs">{card.whatWeDoNotKnow}</p>
      </section>
      {card.neutralFallbackTriggered && (
        <div className="bg-gray-100 rounded p-2 text-xs text-gray-600">
          Nous n'avons pas pu vérifier cette formulation à partir des sources présentées.
        </div>
      )}
    </div>
  );
}
