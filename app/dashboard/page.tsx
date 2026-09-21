import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div>
            <p className="text-sm text-slate-500">Tableau de bord</p>
            <h1 className="text-2xl font-bold text-slate-900">Bonjour, Jean</h1>
          </div>

          <Link href="/pricing" className="rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600">
            Passer en Pro
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm text-slate-500">CV actifs</p>
            <p className="mt-3 text-3xl font-black text-slate-900">03</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm text-slate-500">Documents</p>
            <p className="mt-3 text-3xl font-black text-slate-900">12</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm text-slate-500">Abonnement</p>
            <p className="mt-3 text-3xl font-black text-slate-900">Free</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Mes CV</h2>
              <button className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600">
                Nouveau CV
              </button>
            </div>

            <div className="space-y-4">
              {['CV Développeur', 'CV Ingénierie', 'CV Étudiant'].map((cv) => (
                <div key={cv} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{cv}</p>
                    <p className="text-sm text-slate-500">Dernière modification : aujourd’hui</p>
                  </div>
                  <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                    Ouvrir
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900">Statut</h2>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>✓ Création de CV</li>
              <li>✓ Aperçu en direct</li>
              <li>✓ Export PDF</li>
              <li>✓ Modèles disponibles</li>
              <li>○ IA améliorations</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
