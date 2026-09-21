import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
            C
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Connexion</h1>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="vous@exemple.com" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-600">
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Pas encore de compte ?{' '}
          <Link href="/sign-up" className="font-semibold text-brand-600">Créer un compte</Link>
        </div>
      </div>
    </main>
  );
}
