import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ResumeListPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/sign-in');
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">CV</p>
            <h1 className="text-3xl font-black text-slate-900">Mes CV</h1>
          </div>

          <Link href="/dashboard/cv/new" className="rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600">
            Nouveau CV
          </Link>
        </header>

        <div className="grid gap-5">
          {resumes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft">
              <h2 className="text-xl font-bold text-slate-800">Aucun CV pour le moment</h2>
              <p className="mt-2 text-slate-600">Créez votre premier curriculum vitae professionnel.</p>
            </div>
          ) : (
            resumes.map((resume) => (
              <div key={resume.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{resume.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Modifié le {new Date(resume.updatedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/dashboard/cv/${resume.id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">
                      Ouvrir
                    </Link>
                    <Link href={`/dashboard/cv/${resume.id}/pdf`} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                      PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
