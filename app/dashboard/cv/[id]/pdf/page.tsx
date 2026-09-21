import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrintButton } from '@/components/print-button';

const templates = {
  classic: { panel: '#0f172a', accent: '#2563eb', bg: '#ffffff', text: '#0f172a', muted: '#475569' },
  modern: { panel: '#1d4ed8', accent: '#93c5fd', bg: '#f8fbff', text: '#0f172a', muted: '#475569' },
  minimal: { panel: '#f8fafc', accent: '#111827', bg: '#ffffff', text: '#111827', muted: '#6b7280' },
} as const;

function safe(value: unknown, fallback: string) {
  return String(value || fallback)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function ResumePdfPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/sign-in');

  const resume = await prisma.resume.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!resume) redirect('/dashboard/cv');

  const content = (resume.content as Record<string, any>) || {};
  const personalInfo = content.personalInfo || {};
  const experience = Array.isArray(content.experience) ? content.experience : [];
  const education = Array.isArray(content.education) ? content.education : [];
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const theme = templates[resume.template as keyof typeof templates] || templates.classic;

  return (
    <main className="min-h-screen bg-slate-100 p-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <h1 className="text-2xl font-black text-slate-900">Aperçu PDF — {resume.template}</h1>
          <PrintButton />
        </div>

        <article
          className="mx-auto min-h-[1123px] max-w-[794px] p-10"
          style={{ background: theme.bg, color: theme.text }}
        >
          <header className="rounded-xl p-6 text-white" style={{ background: theme.panel }}>
            <h2 className="text-3xl font-black">{safe(personalInfo.firstName, 'Prénom')} {safe(personalInfo.lastName, 'Nom')}</h2>
            <p className="mt-2 font-semibold">{safe(personalInfo.title, 'Titre professionnel')}</p>
            <p className="mt-2 text-sm">
              {safe(personalInfo.email, 'email@example.com')} · {safe(personalInfo.phone, '+221 00 000 00 00')} · {safe(personalInfo.city, 'Ville')}
            </p>
          </header>

          <section className="mt-6">
            <h3 className="text-lg font-bold" style={{ color: theme.panel }}>Profil</h3>
            <p className="mt-2 whitespace-pre-line text-sm">{safe(resume.summary || content.summary, 'Aucun résumé.')}</p>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-bold" style={{ color: theme.panel }}>Expérience</h3>
            {experience.length ? experience.map((item: any, index: number) => (
              <div key={index} className="mt-3 text-sm">
                <p className="font-semibold">{safe(item.position, 'Poste')} — {safe(item.company, 'Entreprise')}</p>
                <p className="text-xs" style={{ color: theme.muted }}>{safe(item.period, 'Période')}</p>
                <p className="mt-1 whitespace-pre-line">{safe(item.description, '')}</p>
              </div>
            )) : <p className="mt-2 text-sm">Aucune expérience renseignée.</p>}
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-bold" style={{ color: theme.panel }}>Formation</h3>
            {education.length ? education.map((item: any, index: number) => (
              <div key={index} className="mt-3 text-sm">
                <p className="font-semibold">{safe(item.degree, 'Diplôme')} — {safe(item.institution, 'Établissement')}</p>
                <p className="text-xs" style={{ color: theme.muted }}>{safe(item.period, 'Période')}</p>
                <p className="mt-1 whitespace-pre-line">{safe(item.description, '')}</p>
              </div>
            )) : <p className="mt-2 text-sm">Aucune formation renseignée.</p>}
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-bold" style={{ color: theme.panel }}>Compétences</h3>
            <p className="mt-2 whitespace-pre-line text-sm">{safe(content.skills, 'Aucune compétence renseignée.')}</p>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-bold" style={{ color: theme.panel }}>Projets</h3>
            {projects.length ? projects.map((item: any, index: number) => (
              <div key={index} className="mt-3 text-sm">
                <p className="font-semibold">{safe(item.name, 'Projet')}</p>
                <p className="mt-1 whitespace-pre-line">{safe(item.description, '')}</p>
              </div>
            )) : <p className="mt-2 text-sm">Aucun projet renseigné.</p>}
          </section>
        </article>
      </div>
    </main>
  );
}
