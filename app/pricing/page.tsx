import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Abonnements</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">Choisissez le plan qui vous convient</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: 'Free', price: '0', description: 'Pour commencer sans pression', features: ['1 CV', 'Modèles de base', 'Téléchargement standard'] },
            { name: 'Pro', price: '2 500', description: 'Pour aller plus loin dans votre recherche', features: ['CV premium', 'IA d’amélioration', 'Lettre de motivation'], highlight: true },
            { name: 'Business', price: 'Sur devis', description: 'Pour recruteurs et entreprises', features: ['Équipe', 'Candidats', 'Offres & suivi'] }
          ].map((plan) => (
            <div key={plan.name} className={`rounded-3xl border p-6 ${plan.highlight ? 'border-brand-500 bg-brand-50 shadow-soft' : 'border-slate-200 bg-white'}`}>
              <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
              <p className="mt-2 text-slate-600">{plan.description}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="mb-1 text-sm text-slate-500">FCFA/mois</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="mt-8 inline-block w-full rounded-xl bg-brand-500 px-4 py-3 text-center font-semibold text-white hover:bg-brand-600">
                Choisir ce plan
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
