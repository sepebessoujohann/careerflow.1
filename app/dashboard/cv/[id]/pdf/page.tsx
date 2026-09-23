import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrintButton } from '@/components/print-button';

const templates = {
  classic: { panel: '#0f172a', accent: '#2563eb', bg: '#ffffff', text: '#0f172a', muted: '#475569' },
  modern: { panel: '#1d4ed8', accent: '#1d4ed8', bg: '#f8fbff', text: '#0f172a', muted: '#475569' },
  minimal: { panel: '#f8fafc', accent: '#111827', bg: '#ffffff', text: '#111827', muted: '#6b7280' },
} as const;

function value(input: unknown, fallback = '') {
  return typeof input === 'string' && input.trim() ? input : fallback;
}

export default async function ResumePdfPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/sign-in');

  const resume = await prisma.resume.findFirst({ where: { id: params.id, userId: session.user.id } });
  if (!resume) redirect('/dashboard/cv');

  const content = (resume.content as Record<string, any>) || {};
  const personal = content.personalInfo || {};
  const experience = Array.isArray(content.experience) ? content.experience : [];
  const education = Array.isArray(content.education) ? content.education : [];
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const theme = templates[resume.template as keyof typeof templates] || templates.classic;

  return (
    <main className="pdf-shell min-h-screen bg-slate-100 p-6 sm:p-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl print:max-w-none">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div><p className="text-sm text-slate-500">Aperçu</p><h1 className="text-2xl font-black text-slate-900">{resume.title}</h1></div>
          <PrintButton />
        </div>

        <article className="pdf-page mx-auto min-h-[1123px] max-w-[794px] bg-white p-10 shadow-xl print:min-h-0 print:max-w-none print:p-[18mm] print:shadow-none" style={{ background: theme.bg, color: theme.text }}>
          <header className={`rounded-xl p-6 ${resume.template === 'minimal' ? 'border border-slate-200' : 'text-white'}`} style={{ background: theme.panel }}>
            <h2 className="text-3xl font-black">{value(personal.firstName, 'Prénom')} {value(personal.lastName, 'Nom')}</h2>
            <p className="mt-2 font-semibold">{value(personal.title, 'Titre professionnel')}</p>
            <p className={`mt-2 text-sm ${resume.template === 'minimal' ? 'text-slate-600' : ''}`}>{[personal.email, personal.phone, personal.city, personal.country].filter(Boolean).join(' · ') || 'Coordonnées'}</p>
          </header>

          <section className="pdf-section"><h3 style={{ color: theme.accent }}>Profil</h3><p className="whitespace-pre-line">{value(resume.summary || content.summary, 'Aucun résumé.')}</p></section>
          <section className="pdf-section"><h3 style={{ color: theme.accent }}>Expérience</h3>{experience.length ? experience.map((item: any, index: number) => <div className="pdf-entry" key={index}><p className="font-semibold">{value(item.position, 'Poste')} — {value(item.company, 'Entreprise')}</p><p className="text-xs" style={{ color: theme.muted }}>{value(item.period, 'Période')}</p><p className="mt-1 whitespace-pre-line">{item.description || ''}</p></div>) : <p>Aucune expérience renseignée.</p>}</section>
          <section className="pdf-section"><h3 style={{ color: theme.accent }}>Formation</h3>{education.length ? education.map((item: any, index: number) => <div className="pdf-entry" key={index}><p className="font-semibold">{value(item.degree, 'Diplôme')} — {value(item.institution, 'Établissement')}</p><p className="text-xs" style={{ color: theme.muted }}>{value(item.period, 'Période')}</p><p className="mt-1 whitespace-pre-line">{item.description || ''}</p></div>) : <p>Aucune formation renseignée.</p>}</section>
          <section className="pdf-section"><h3 style={{ color: theme.accent }}>Compétences</h3><p className="whitespace-pre-line">{value(content.skills, 'Aucune compétence renseignée.')}</p></section>
          <section className="pdf-section"><h3 style={{ color: theme.accent }}>Projets</h3>{projects.length ? projects.map((item: any, index: number) => <div className="pdf-entry" key={index}><p className="font-semibold">{value(item.name, 'Projet')}</p><p className="whitespace-pre-line">{item.description || ''}</p>{item.link ? <p className="text-xs" style={{ color: theme.muted }}>{item.link}</p> : null}</div>) : <p>Aucun projet renseigné.</p>}</section>
          <section className="pdf-section"><h3 style={{ color: theme.accent }}>Langues</h3><p className="whitespace-pre-line">{value(content.languages, 'Aucune langue renseignée.')}</p></section>
        </article>
      </div>
    </main>
  );
}
