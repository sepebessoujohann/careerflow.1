import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/sign-in');
  const resumeCount = await prisma.resume.count({ where: { userId: session.user.id } });
  return (
    <main className="min-h-screen bg-slate-100 p-6"><div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"><div><p className="text-sm text-slate-500">Tableau de bord</p><h1 className="text-2xl font-bold text-slate-900">Bonjour, {session.user?.name || 'utilisateur'}</h1></div><div className="flex gap-3"><Link href="/dashboard/cv" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700">Mes CV</Link><Link href="/pricing" className="rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white">Passer en Pro</Link></div></header>
      <div className="grid gap-6 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">CV actifs</p><p className="mt-3 text-3xl font-black text-slate-900">{resumeCount}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Documents</p><p className="mt-3 text-3xl font-black text-slate-900">0</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Abonnement</p><p className="mt-3 text-3xl font-black text-slate-900">Free</p></div></div>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Commencer</h2><Link href="/dashboard/cv/new" className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">Nouveau CV</Link></div><p className="mt-4 text-slate-600">Créez votre premier CV professionnel et choisissez un modèle adapté à votre profil.</p></div>
    </div></main>
  );
}
