"use client";

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const defaultContent = {
  personalInfo: { firstName: '', lastName: '', email: '', phone: '', city: '', country: '', title: '', website: '', linkedin: '' },
  summary: '',
  experience: [{ company: '', position: '', period: '', description: '' }],
  education: [{ institution: '', degree: '', period: '', description: '' }],
  skills: '',
  projects: [{ name: '', description: '', link: '' }],
  languages: '',
};

export default function NewResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState('Mon CV');
  const [template, setTemplate] = useState('classic');
  const [content, setContent] = useState(defaultContent);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setSectionValue(section: 'summary' | 'skills' | 'languages', value: string) {
    setContent((current) => ({ ...current, [section]: value }));
  }

  function updateArrayItem(key: 'experience' | 'education' | 'projects', index: number, field: string, value: string) {
    setContent((current) => {
      const next = [...current[key]];
      next[index] = { ...next[index], [field]: value };
      return { ...current, [key]: next };
    });
  }

  function addItem(key: 'experience' | 'education' | 'projects') {
    const item = key === 'experience' ? { company: '', position: '', period: '', description: '' } : key === 'education' ? { institution: '', degree: '', period: '', description: '' } : { name: '', description: '', link: '' };
    setContent((current) => ({ ...current, [key]: [...current[key], item] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/resumes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, template, summary: content.summary, content }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Impossible de créer le CV.');
      router.push('/dashboard/cv');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-500';
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6"><p className="text-sm text-slate-500">Créer</p><h1 className="text-3xl font-black text-slate-900">Nouveau CV</h1></div>
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-2 block text-sm font-medium text-slate-700">Titre du CV</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required /></div>
              <div><label className="mb-2 block text-sm font-medium text-slate-700">Modèle</label><select value={template} onChange={(e) => setTemplate(e.target.value)} className={inputClass}><option value="classic">Classique</option><option value="modern">Moderne</option><option value="minimal">Minimaliste</option></select></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(['firstName','lastName','email','phone','city','country','website','linkedin'] as const).map((field) => <div key={field}><label className="mb-2 block text-sm font-medium text-slate-700">{field}</label><input type={field === 'email' ? 'email' : 'text'} value={content.personalInfo[field]} onChange={(e) => setContent((c) => ({ ...c, personalInfo: { ...c.personalInfo, [field]: e.target.value } }))} className={inputClass} /></div>)}
            </div>
            <div><label className="mb-2 block text-sm font-medium text-slate-700">Titre professionnel</label><input value={content.personalInfo.title} onChange={(e) => setContent((c) => ({ ...c, personalInfo: { ...c.personalInfo, title: e.target.value } }))} className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-medium text-slate-700">Profil</label><textarea value={content.summary} onChange={(e) => setSectionValue('summary', e.target.value)} rows={4} className={inputClass} /></div>
            {(['experience','education','projects'] as const).map((key) => <section key={key} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><h2 className="text-lg font-bold capitalize text-slate-900">{key}</h2><button type="button" onClick={() => addItem(key)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">+ Ajouter</button></div>{content[key].map((item, index) => <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">{Object.keys(item).map((field) => field === 'description' ? <textarea key={field} value={item[field as keyof typeof item]} onChange={(e) => updateArrayItem(key, index, field, e.target.value)} rows={3} className={inputClass} placeholder={field} /> : <input key={field} value={item[field as keyof typeof item]} onChange={(e) => updateArrayItem(key, index, field, e.target.value)} className={inputClass} placeholder={field} />)}</div>)}</section>)}
            <div><label className="mb-2 block text-sm font-medium text-slate-700">Compétences</label><textarea value={content.skills} onChange={(e) => setSectionValue('skills', e.target.value)} rows={3} className={inputClass} /></div>
            <div><label className="mb-2 block text-sm font-medium text-slate-700">Langues</label><textarea value={content.languages} onChange={(e) => setSectionValue('languages', e.target.value)} rows={2} className={inputClass} /></div>
            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button disabled={isSubmitting} className="w-full rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">{isSubmitting ? 'Enregistrement...' : 'Enregistrer le CV'}</button>
          </div>
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><h2 className="text-xl font-bold text-slate-900">Aperçu live</h2><div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">{template}</p><p className="mt-2 text-xl font-black text-slate-900">{content.personalInfo.firstName || 'Prénom'} {content.personalInfo.lastName || 'Nom'}</p><p className="text-sm text-slate-600">{content.personalInfo.title || 'Titre professionnel'}</p><p className="mt-4 text-sm text-slate-600">{content.summary || 'Votre résumé apparaîtra ici.'}</p></div></aside>
        </form>
      </div>
    </main>
  );
}
