interface Props {
  onConfirm?: () => void;
}

export default function OcrDisclaimer({ onConfirm }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 flex items-center justify-between gap-2">
      <span>La détection de texte ne préjuge pas de la vérité scientifique de l'allégation.</span>
      {onConfirm && (
        <button
          type="button"
          onClick={onConfirm}
          className="px-2 py-1 bg-white border rounded text-gray-700 hover:bg-gray-100"
        >
          Confirmer le texte
        </button>
      )}
    </div>
  );
}