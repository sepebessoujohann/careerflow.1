"use client";

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const defaultContent = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    title: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [
    {
      company: '',
      position: '',
      period: '',
      description: '',
    },
  ],
  education: [
    {
      institution: '',
      degree: '',
      period: '',
      description: '',
    },
  ],
  skills: '',
  projects: [
    {
      name: '',
      description: '',
      link: '',
    },
  ],
  languages: '',
};

export default function NewResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState('Mon CV');
  const [content, setContent] = useState(defaultContent);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setSectionValue(section: 'personalInfo' | 'summary' | 'skills' | 'languages', value: string) {
    setContent((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function updateArrayItem<T>(key: 'experience' | 'education' | 'projects', index: number, field: string, value: string) {
    setContent((current) => {
      const next = [...(current[key] as T[])];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return {
        ...current,
        [key]: next,
      };
    });
  }

  function addItem(key: 'experience' | 'education' | 'projects') {
    setContent((current) => {
      const base = key === 'experience' ? { company: '', position: '', period: '', description: '' } : key === 'education' ? { institution: '', degree: '', period: '', description: '' } : { name: '', description: '', link: '' };
      return {
        ...current,
        [key]: [...(current[key] as any[]), base],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          summary: content.summary,
          content,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Impossible de créer le CV.');
      }

      router.push('/dashboard/cv');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Créer</p>
          <h1 className="text-3xl font-black text-slate-900">Nouveau CV</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Titre du CV</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Ex : CV Développeur Full Stack"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Prénom</label>
                <input
                  value={content.personalInfo.firstName}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, firstName: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
                <input
                  value={content.personalInfo.lastName}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, lastName: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, email: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="jean@exemple.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Téléphone</label>
                <input
                  value={content.personalInfo.phone}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, phone: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="+221 77 000 00 00"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Ville</label>
                <input
                  value={content.personalInfo.city}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, city: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Dakar"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Pays</label>
                <input
                  value={content.personalInfo.country}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, country: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Sénégal"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Site / portfolio</label>
                <input
                  value={content.personalInfo.website}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, website: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="portfolio.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">LinkedIn</label>
                <input
                  value={content.personalInfo.linkedin}
                  onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, linkedin: event.target.value } }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="linkedin.com/in/jean"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Titre professionnel</label>
              <input
                value={content.personalInfo.title}
                onChange={(event) => setContent((current) => ({ ...current, personalInfo: { ...current.personalInfo, title: event.target.value } }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Développeur Full Stack"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Profil</label>
              <textarea
                value={content.summary}
                onChange={(event) => setSectionValue('summary', event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Décrivez votre profil professionnel..."
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Expérience</h2>
                <button
                  type="button"
                  onClick={() => addItem('experience')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  + Ajouter
                </button>
              </div>

              {content.experience.map((item: any, index: number) => (
                <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <input
                    value={item.company}
                    onChange={(event) => updateArrayItem('experience', index, 'company', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Entreprise"
                  />
                  <input
                    value={item.position}
                    onChange={(event) => updateArrayItem('experience', index, 'position', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Poste"
                  />
                  <input
                    value={item.period}
                    onChange={(event) => updateArrayItem('experience', index, 'period', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="2022 - 2024"
                  />
                  <textarea
                    value={item.description}
                    onChange={(event) => updateArrayItem('experience', index, 'description', event.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Décrivez les missions et résultats..."
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Formation</h2>
                <button
                  type="button"
                  onClick={() => addItem('education')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  + Ajouter
                </button>
              </div>

              {content.education.map((item: any, index: number) => (
                <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <input
                    value={item.institution}
                    onChange={(event) => updateArrayItem('education', index, 'institution', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Université / École"
                  />
                  <input
                    value={item.degree}
                    onChange={(event) => updateArrayItem('education', index, 'degree', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Diplôme"
                  />
                  <input
                    value={item.period}
                    onChange={(event) => updateArrayItem('education', index, 'period', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="2019 - 2022"
                  />
                  <textarea
                    value={item.description}
                    onChange={(event) => updateArrayItem('education', index, 'description', event.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Détails de la formation..."
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Compétences</label>
              <textarea
                value={content.skills}
                onChange={(event) => setSectionValue('skills', event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="React, Next.js, TypeScript, UI/UX, gestion de projet..."
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Projets</h2>
                <button
                  type="button"
                  onClick={() => addItem('projects')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  + Ajouter
                </button>
              </div>

              {content.projects.map((item: any, index: number) => (
                <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <input
                    value={item.name}
                    onChange={(event) => updateArrayItem('projects', index, 'name', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Nom du projet"
                  />
                  <textarea
                    value={item.description}
                    onChange={(event) => updateArrayItem('projects', index, 'description', event.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="Description du projet..."
                  />
                  <input
                    value={item.link}
                    onChange={(event) => updateArrayItem('projects', index, 'link', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Langues</label>
              <textarea
                value={content.languages}
                onChange={(event) => setSectionValue('languages', event.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Français: bilingue, Anglais: courant..."
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le CV'}
            </button>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900">Aperçu live</h2>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CV</p>
                <p className="mt-2 text-xl font-black text-slate-900">
                  {content.personalInfo.firstName || 'Prénom'} {content.personalInfo.lastName || 'Nom'}
                </p>
                <p className="text-sm text-slate-600">{content.personalInfo.title || 'Titre professionnel'}</p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <p>{content.personalInfo.email || 'email@example.com'}</p>
                <p>{content.personalInfo.phone || '+221 00 000 00 00'}</p>
                <p>{content.personalInfo.city || 'Ville'}, {content.personalInfo.country || 'Pays'}</p>
                <p>{content.personalInfo.website || 'site-web.com'}</p>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-3">
                <p className="font-semibold text-slate-800">Profil</p>
                <p className="mt-2 text-sm text-slate-600">{content.summary || 'Votre résumé apparaîtra ici.'}</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
