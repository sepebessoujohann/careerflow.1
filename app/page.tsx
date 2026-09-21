import Link from 'next/link';

const features = [
  'Création de CV étape par étape',
  'Assistant IA pour améliorer votre profil',
  'Lettre de motivation automatique',
  'CV public avec QR Code',
  'Outils PDF & traduction',
  'Dashboard de carrière intelligent'
];

export default function HomePage() {
  return (
    <main>
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
              C
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">CareerFlow</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link href="#features">Fonctionnalités</Link>
            <Link href="#pricing">Tarifs</Link>
            <Link href="/sign-in">Connexion</Link>
          </nav>

          <Link
            href="/sign-up"
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
          >
            Créer mon CV
          </Link>
        </div>
      </header>

      <section className="container-shell py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Nouveau
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Créez, améliorez et gérez vos documents professionnels.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              CareerFlow aide les étudiants, professionnels et recruteurs à produire des CV,
              lettres de motivation, documents de carrière et outils de gestion intelligents.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-600"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="#features"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300"
              >
                Découvrir les fonctionnalités
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <span>✓ 1 CV instantané</span>
              <span>✓ IA d’assistance</span>
              <span>✓ PDF exportable</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Aperçu</p>
                  <h2 className="text-xl font-bold text-slate-900">CV professionnel</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  En ligne
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    JD
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Jean Dupont</p>
                    <p className="text-sm text-slate-500">Développeur Full Stack</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Expérience</p>
                    <p className="mt-1 font-semibold">4 ans</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Compétences</p>
                    <p className="mt-1 font-semibold">Next.js • React</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profil</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Développeur orienté produit, passionné par la performance, l’expérience utilisateur
                    et la création de produits utilisables dès le premier lancement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-900 py-20 text-white">
        <div className="container-shell">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Fonctionnalités</p>
            <h2 className="mt-3 text-3xl font-bold">Tout ce qu’il faut pour votre carrière</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-soft">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-xl">✓</div>
                <p className="font-semibold text-white">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="container-shell py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Tarifs</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Des plans pensés pour grandir</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: 'Free', price: '0', description: 'Pour commencer', points: ['1 CV', 'Modèles de base', 'Export simple'] },
            { name: 'Pro', price: '2 500', description: 'Pour aller plus loin', points: ['CV premium', 'IA d’amélioration', 'Lettre de motivation'], highlight: true },
            { name: 'Business', price: 'Sur devis', description: 'Pour les recruteurs', points: ['Espace entreprise', 'Offres & candidats', 'Analytics'] }
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-6 shadow-soft ${plan.highlight ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}
            >
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-slate-600">{plan.description}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="mb-1 text-sm text-slate-500">FCFA / mois</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.points.map((point) => (
                  <li key={point}>✓ {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
