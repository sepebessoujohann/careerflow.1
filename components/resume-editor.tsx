'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  title: string;
  website: string;
  linkedin: string;
};

type ExperienceItem = {
  company: string;
  position: string;
  period: string;
  description: string;
};

type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  description: string;
};

type ProjectItem = {
  name: string;
  description: string;
  link: string;
};

type ResumeContent = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string;
  projects: ProjectItem[];
  languages: string;
};

type ResumeRecord = {
  id: string;
  title: string;
  summary: string | null;
  template: string;
  content: Record<string, any> | null;
  updatedAt: string;
};

const defaultPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  title: '',
  website: '',
  linkedin: '',
};

const defaultExperience = (): ExperienceItem => ({
  company: '',
  position: '',
  period: '',
  description: '',
});

const defaultEducation = (): EducationItem => ({
  institution: '',
  degree: '',
  period: '',
  description: '',
});

const defaultProject = (): ProjectItem => ({
  name: '',
  description: '',
  link: '',
});

function normalizeContent(raw: Record<string, any> | null | undefined): ResumeContent {
  const safeContent = raw ?? {};

  return {
    personalInfo: {
      ...defaultPersonalInfo,
      ...(safeContent.personalInfo ?? {}),
    },
    summary: typeof safeContent.summary === 'string' ? safeContent.summary : '',
    experience: Array.isArray(safeContent.experience) && safeContent.experience.length > 0
      ? safeContent.experience.map((item: any) => ({
          company: item?.company ?? '',
          position: item?.position ?? '',
          period: item?.period ?? '',
          description: item?.description ?? '',
        }))
      : [defaultExperience()],
    education: Array.isArray(safeContent.education) && safeContent.education.length > 0
      ? safeContent.education.map((item: any) => ({
          institution: item?.institution ?? '',
          degree: item?.degree ?? '',
          period: item?.period ?? '',
          description: item?.description ?? '',
        }))
      : [defaultEducation()],
    skills: typeof safeContent.skills === 'string' ? safeContent.skills : '',
    projects: Array.isArray(safeContent.projects) && safeContent.projects.length > 0
      ? safeContent.projects.map((item: any) => ({
          name: item?.name ?? '',
          description: item?.description ?? '',
          link: item?.link ?? '',
        }))
      : [defaultProject()],
    languages: typeof safeContent.languages === 'string' ? safeContent.languages : '',
  };
}

export function ResumeEditor({ initialResume }: { initialResume: ResumeRecord }) {
  const [title, setTitle] = useState(initialResume.title ?? 'Mon CV');
  const [template, setTemplate] = useState(initialResume.template ?? 'classic');
  const [summary, setSummary] = useState(initialResume.summary ?? '');
  const [content, setContent] = useState<ResumeContent>(() => normalizeContent(initialResume.content));
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');
  const firstRender = useRef(true);

  const persist = async () => {
    try {
      setIsSaving(true);
      setError('');

      const payload = {
        title,
        template,
        summary,
        content: {
          ...content,
          summary,
        },
      };

      const response = await fetch(`/api/resumes/${initialResume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? 'Erreur de sauvegarde du CV');
      }

      setSaveMessage('Sauvegardé automatiquement');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      void persist();
    }, 600);

    return () => clearTimeout(timeout);
  }, [title, template, summary, content]);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setContent((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [field]: value,
      },
    }));
  };

  const addItem = (key: 'experience' | 'education' | 'projects') => {
    setContent((current) => ({
      ...current,
      [key]: [...current[key], key === 'experience' ? defaultExperience() : key === 'education' ? defaultEducation() : defaultProject()],
    }));
  };

  const updateItem = (
    key: 'experience' | 'education' | 'projects',
    index: number,
    field: string,
    value: string
  ) => {
    setContent((current) => {
      const next = [...current[key]];
      next[index] = {
        ...next[index],
        [field]: value,
      };

      return {
        ...current,
        [key]: next,
      };
    });
  };

  const previewName = `${content.personalInfo.firstName || 'Prénom'} ${content.personalInfo.lastName || 'Nom'}`.trim();

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">CV</p>
            <h1 className="text-3xl font-black text-slate-900">Édition du CV</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/cv" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:border-slate-300">
              Retour
            </Link>
            <Link href={`/dashboard/cv/${initialResume.id}/pdf`} className="rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600">
              Aperçu PDF
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Titre du CV</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Modèle</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Prénom</label>
                <input
                  value={content.personalInfo.firstName}
                  onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
                <input
                  value={content.personalInfo.lastName}
                  onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  value={content.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Téléphone</label>
                <input
                  value={content.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Ville</label>
                <input
                  value={content.personalInfo.city}
                  onChange={(e) => updatePersonalInfo('city', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Pays</label>
                <input
                  value={content.personalInfo.country}
                  onChange={(e) => updatePersonalInfo('country', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Titre professionnel</label>
                <input
                  value={content.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Site web</label>
                <input
                  value={content.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">LinkedIn</label>
                <input
                  value={content.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Résumé</label>
              <textarea
                rows={5}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setContent((current) => ({ ...current, summary: e.target.value }));
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
              />
            </div>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Expérience</h2>
                <button type="button" onClick={() => addItem('experience')} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  + Ajouter
                </button>
              </div>

              {content.experience.map((item, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={item.position}
                      onChange={(e) => updateItem('experience', index, 'position', e.target.value)}
                      placeholder="Poste"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    />
                    <input
                      value={item.company}
                      onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                      placeholder="Entreprise"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    />
                  </div>
                  <input
                    value={item.period}
                    onChange={(e) => updateItem('experience', index, 'period', e.target.value)}
                    placeholder="Période"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => updateItem('experience', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
              ))}
            </section>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Formation</h2>
                <button type="button" onClick={() => addItem('education')} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  + Ajouter
                </button>
              </div>

              {content.education.map((item, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={item.degree}
                      onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                      placeholder="Diplôme"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    />
                    <input
                      value={item.institution}
                      onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                      placeholder="Établissement"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    />
                  </div>
                  <input
                    value={item.period}
                    onChange={(e) => updateItem('education', index, 'period', e.target.value)}
                    placeholder="Période"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => updateItem('education', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
              ))}
            </section>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Compétences</label>
              <textarea
                rows={4}
                value={content.skills}
                onChange={(e) => setContent((current) => ({ ...current, skills: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
              />
            </div>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Projets</h2>
                <button type="button" onClick={() => addItem('projects')} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  + Ajouter
                </button>
              </div>

              {content.projects.map((item, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                    placeholder="Nom du projet"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                  <input
                    value={item.link}
                    onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                    placeholder="Lien"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
              ))}
            </section>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Langues</label>
              <textarea
                rows={3}
                value={content.languages}
                onChange={(e) => setContent((current) => ({ ...current, languages: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="text-sm text-slate-500">
                {isSaving ? 'Sauvegarde...' : saveMessage || 'Modifications enregistrées localement'}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900">Aperçu</h2>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 border-b border-slate-200 pb-4">
                <h3 className="text-2xl font-black text-slate-900">{previewName || 'Votre nom'}</h3>
                <p className="mt-1 text-sm text-brand-600">{content.personalInfo.title || 'Titre professionnel'}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {content.personalInfo.email || 'email@example.com'} • {content.personalInfo.phone || '+221 00 000 00 00'}
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-bold text-slate-800">Profil</p>
                  <p className="mt-1 whitespace-pre-line">{summary || 'Aucun résumé.'}</p>
                </div>

                <div>
                  <p className="font-bold text-slate-800">Expérience</p>
                  {content.experience.map((item, index) => (
                    <div key={index} className="mt-2">
                      <p className="font-semibold">{item.position || 'Poste'}</p>
                      <p className="text-slate-500">{item.company || 'Entreprise'} • {item.period || 'Période'}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-bold text-slate-800">Compétences</p>
                  <p className="mt-1 whitespace-pre-line">{content.skills || 'Aucune compétence renseignée.'}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
'}  
{