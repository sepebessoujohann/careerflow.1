"use client";

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const initialContent = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    title: '',
  },
  summary: '',
  experience: '',
  education: '',
  skills: '',
  projects: '',
};

export default function NewResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState('Mon CV');
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: string, value: string) {
    setContent((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [field]: value,
      },
    }));
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
        throw new Error(payload.message || 'Erreur lors de la création du CV.');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Créer</p>
            <h1 className="text-3xl font-black text-slate-900">Nouveau CV</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Titre du CV</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Ex: CV Développeur Full Stack"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Prénom</label>
                <input
                  value={content.personalInfo.firstName}
                  onChange={(event) => handleChange('firstName', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nom</label>
                <input
                  value={content.personalInfo.lastName}
                  onChange={(event) => handleChange('lastName', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="jean@exemple.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Téléphone</label>
                <input
                  value={content.personalInfo.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="+221 77 000 00 00"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Ville</label>
                <input
                  value={content.personalInfo.city}
                  onChange={(event) => handleChange('city', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Dakar"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Pays</label>
                <input
                  value={content.personalInfo.country}
                  onChange={(event) => handleChange('country', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                  placeholder="Sénégal"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Titre professionnel</label>
              <input
                value={content.personalInfo.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Développeur Full Stack"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Profil</label>
              <textarea
                value={content.summary}
                onChange={(event) => setContent((current) => ({ ...current, summary: event.target.value }))}
                rows={5}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Décrivez votre profil professionnel..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Expérience</label>
              <textarea
                value={content.experience}
                onChange={(event) => setContent((current) => ({ ...current, experience: event.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Entreprise, poste, missions, résultats..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Formation</label>
              <textarea
                value={content.education}
                onChange={(event) => setContent((current) => ({ ...current, education: event.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Diplôme, université, dates, spécialité..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Compétences</label>
              <textarea
                value={content.skills}
                onChange={(event) => setContent((current) => ({ ...current, skills: event.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="React, Next.js, TypeScript, Gestion de projet..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Projets</label>
              <textarea
                value={content.projects}
                onChange={(event) => setContent((current) => ({ ...current, projects: event.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500"
                placeholder="Projet 1, technologies, impact..."
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
            <h2 className="text-xl font-bold text-slate-900">Aperçu</h2>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CV</p>
              <div className="mt-4">
                <p className="text-lg font-black text-slate-900">
                  {content.personalInfo.firstName || 'Prénom'} {content.personalInfo.lastName || 'Nom'}
                </p>
                <p className="text-sm text-slate-600">{content.personalInfo.title || 'Titre professionnel'}</p>
                <div className="mt-4 text-sm text-slate-600">
                  <p>{content.personalInfo.email || 'email@example.com'}</p>
                  <p>{content.personalInfo.phone || '+221 00 000 00 00'}</p>
                  <p>{content.personalInfo.city || 'Ville'}, {content.personalInfo.country || 'Pays'}</p>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-3">
                  <p className="font-semibold text-slate-800">Profil</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {content.summary || 'Votre résumé professionnel apparaîtra ici.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
