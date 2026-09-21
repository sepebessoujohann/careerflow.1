'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600 print:hidden"
    >
      Imprimer / Enregistrer en PDF
    </button>
  );
}
