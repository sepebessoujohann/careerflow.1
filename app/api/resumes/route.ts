import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ResumeDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/sign-in');
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!resume) {
    redirect('/dashboard');
  }

  const content = (resume.content as Record<string, any>) || {};
  const personalInfo = content.personalInfo || {};

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">CV</p>
            <h1 className="text-3xl font-black text-slate-900">{resume.title}</h1>
          </div>

          <Link href="/dashboard/cv" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:border-slate-300">
            Retour
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-6 border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-black text-slate-900">
              {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
            </h2>
            <p className="mt-2 text-lg text-brand-600">{personalInfo.title || 'Titre professionnel'}</p>
            <p className="mt-2 text-sm text-slate-500">
              {personalInfo.email || 'email@example.com'} • {personalInfo.phone || '+221 00 000 00 00'} • {personalInfo.city || 'Ville'}
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-bold text-slate-800">Profil</h3>
              <p className="mt-2 text-slate-600">{resume.summary || content.summary || 'Aucun résumé disponible.'}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Expérience</h3>
              <p className="mt-2 whitespace-pre-line text-slate-600">{content.experience || 'Aucune expérience renseignée.'}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Formation</h3>
              <p className="mt-2 whitespace-pre-line text-slate-600">{content.education || 'Aucune formation renseignée.'}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Compétences</h3>
              <p className="mt-2 whitespace-pre-line text-slate-600">{content.skills || 'Aucune compétence renseignée.'}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Projets</h3>
              <p className="mt-2 whitespace-pre-line text-slate-600">{content.projects || 'Aucun projet renseigné.'}</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
