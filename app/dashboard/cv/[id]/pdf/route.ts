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

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${resume.title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }
          h1 { font-size: 28px; margin-bottom: 12px; }
          h2 { font-size: 18px; margin-top: 24px; margin-bottom: 8px; }
          p { margin: 6px 0; line-height: 1.5; }
          .meta { color: #475569; font-size: 13px; }
          .section { margin-top: 24px; }
          .card { margin-top: 8px; }
        </style>
      </head>
      <body>
        <h1>${personalInfo.firstName || 'Prénom'} ${personalInfo.lastName || 'Nom'}</h1>
        <p><strong>${personalInfo.title || 'Titre professionnel'}</strong></p>
        <p class="meta">${personalInfo.email || 'email@example.com'} • ${personalInfo.phone || '+221 00 000 00 00'} • ${personalInfo.city || 'Ville'}</p>

        <div class="section">
          <h2>Profil</h2>
          <p>${resume.summary || content.summary || 'Aucun résumé.'}</p>
        </div>

        <div class="section">
          <h2>Expérience</h2>
          ${experience.map((item: any) => `
            <div class="card">
              <p><strong>${item.position || 'Poste'}</strong> — ${item.company || 'Entreprise'}</p>
              <p class="meta">${item.period || 'Période'}</p>
              <p>${item.description || ''}</p>
            </div>
          `).join('') || '<p>Aucune expérience renseignée.</p>'}
        </div>

        <div class="section">
          <h2>Formation</h2>
          ${education.map((item: any) => `
            <div class="card">
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
            <div class="card">
              <p><strong>${item.name || 'Projet'}</strong></p>
              <p>${item.description || ''}</p>
            </div>
          `).join('') || '<p>Aucun projet renseigné.</p>'}
        </div>
      </body>
    </html>
  `;

  return (
    <div className="hidden" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
