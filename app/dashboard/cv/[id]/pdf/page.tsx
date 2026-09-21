import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ResumePdfPage({ params }: { params: { id: string } }) {
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

  const templateStyles = {
    classic: {
      panel: '#0f172a',
      accent: '#2563eb',
      bg: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
    },
    modern: {
      panel: '#1d4ed8',
      accent: '#93c5fd',
      bg: '#f8fbff',
      text: '#0f172a',
      muted: '#475569',
    },
    minimal: {
      panel: '#f8fafc',
      accent: '#111827',
      bg: '#ffffff',
      text: '#111827',
      muted: '#6b7280',
    },
  };

  const theme = templateStyles[(resume.template as keyof typeof templateStyles) || 'classic'];

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${resume.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: ${theme.text};
            background: ${theme.bg};
            margin: 0;
            padding: 0;
          }
          .page {
            width: 794px;
            min-height: 1123px;
            padding: 36px 42px;
            box-sizing: border-box;
            background: ${theme.bg};
          }
          .header {
            background: ${theme.panel};
            color: white;
            padding: 20px 24px;
            border-radius: 14px;
            margin-bottom: 18px;
          }
          h1 { margin: 0; font-size: 28px; }
          h2 { font-size: 18px; margin: 0 0 10px; color: ${theme.panel}; }
          p { margin: 6px 0; line-height: 1.5; }
          .meta { color: ${theme.muted}; font-size: 13px; }
          .section { margin-top: 20px; }
          .item { margin-top: 12px; }
          .accent { color: ${theme.accent}; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>${personalInfo.firstName || 'Prénom'} ${personalInfo.lastName || 'Nom'}</h1>
            <p><strong>${personalInfo.title || 'Titre professionnel'}</strong></p>
            <p>${personalInfo.email || 'email@example.com'} • ${personalInfo.phone || '+221 00 000 00 00'} • ${personalInfo.city || 'Ville'}</p>
          </div>

          <div class="section">
            <h2>Profil</h2>
            <p>${resume.summary || content.summary || 'Aucun résumé.'}</p>
          </div>

          <div class="section">
            <h2>Expérience</h2>
            ${experience.map((item: any) => `
              <div class="item">
                <p><strong>${item.position || 'Poste'}</strong> — ${item.company || 'Entreprise'}</p>
                <p class="meta">${item.period || 'Période'}</p>
                <p>${item.description || ''}</p>
              </div>
            `).join('') || '<p>Aucune expérience renseignée.</p>'}
          </div>

          <div class="section">
            <h2>Formation</h2>
            ${education.map((item: any) => `
              <div class="item">
                <p><strong>${item.degree || 'Diplôme'}</strong> — ${item.institution || 'Établissement'}</p>
                <p class="meta">${item.period || 'Période'}</p>
                <p>${item.description || ''}</p>
              </div>
            `).join('') || '<p>Aucune formation renseignée.</p>'}
          </div>

          <div class="section">
            <h2>Compétences</h2>
            <p>${content.skills || 'Aucune compétence renseignée.'}</p>
          </div>

          <div class="section">
            <h2>Projets</h2>
            ${projects.map((item: any) => `
              <div class="item">
                <p><strong>${item.name || 'Projet'}</strong></p>
                <p>${item.description || ''}</p>
              </div>
            `).join('') || '<p>Aucun projet renseigné.</p>'}
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">Aperçu PDF</h1>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
          >
            Imprimer / Enregistrer en PDF
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </main>
  );
}
