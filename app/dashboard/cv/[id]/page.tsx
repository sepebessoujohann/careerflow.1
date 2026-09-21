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
    redirect('/dashboard/cv');
  }

  const content = (resume.content as Record<string, any>) || {};
  const personalInfo = content.personalInfo || {};
  const experience = Array.isArray(content.experience) ? content.experience : [];
  const education = Array.isArray(content.education) ? content.education : [];
  const projects = Array.isArray(content.projects) ? content.projects : [];

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
              <div className="mt-3 space-y-3">
                {experience.length === 0 ? (
                  <p className="text-slate-600">Aucune expérience renseignée.</p>
                ) : (
                  experience.map((item: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">{item.position || 'Poste'}</p>
                      <p className="text-sm text-slate-500">{item.company || 'Entreprise'} • {item.period || 'Période'}</p>
                      <p className="mt-2 whitespace-pre-line text-slate-600">{item.description || 'Aucune description.'}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Formation</h3>
              <div className="mt-3 space-y-3">
                {education.length === 0 ? (
                  <p className="text-slate-600">Aucune formation renseignée.</p>
                ) : (
                  education.map((item: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">{item.degree || 'Diplôme'}</p>
                      <p className="text-sm text-slate-500">{item.institution || 'Établissement'} • {item.period || 'Période'}</p>
                      <p className="mt-2 text-slate-600">{item.description || 'Aucune description.'}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Compétences</h3>
              <p className="mt-2 whitespace-pre-line text-slate-600">{content.skills || 'Aucune compétence renseignée.'}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Projets</h3>
              <div className="mt-3 space-y-3">
                {projects.length === 0 ? (
                  <p className="text-slate-600">Aucun projet renseigné.</p>
                ) : (
                  projects.map((item: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">{item.name || 'Projet'}</p>
                      <p className="mt-2 text-slate-600">{item.description || 'Description indisponible.'}</p>
                      {item.link ? <a href={item.link} className="mt-2 inline-block text-brand-600" target="_blank" rel="noreferrer">Voir le projet</a> : null}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-800">Langues</h3>
              <p className="mt-2 text-slate-600">{content.languages || 'Aucune langue renseignée.'}</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
