'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type PersonalInfo = Record<'firstName' | 'lastName' | 'email' | 'phone' | 'city' | 'country' | 'title' | 'website' | 'linkedin', string>;
type Experience = { company: string; position: string; period: string; description: string };
type Education = { institution: string; degree: string; period: string; description: string };
type Project = { name: string; description: string; link: string };
type Content = { personalInfo: PersonalInfo; summary: string; experience: Experience[]; education: Education[]; skills: string; projects: Project[]; languages: string };
type Resume = { id: string; title: string; summary: string | null; template: string; content: Record<string, any> | null; updatedAt: string };

const emptyPersonal: PersonalInfo = { firstName: '', lastName: '', email: '', phone: '', city: '', country: '', title: '', website: '', linkedin: '' };
const emptyExperience = (): Experience => ({ company: '', position: '', period: '', description: '' });
const emptyEducation = (): Education => ({ institution: '', degree: '', period: '', description: '' });
const emptyProject = (): Project => ({ name: '', description: '', link: '' });

function normalize(raw: Record<string, any> | null, summary: string | null): Content {
  const value = raw || {};
  return {
    personalInfo: { ...emptyPersonal, ...(value.personalInfo || {}) },
    summary: typeof value.summary === 'string' ? value.summary : summary || '',
    experience: Array.isArray(value.experience) && value.experience.length ? value.experience : [emptyExperience()],
    education: Array.isArray(value.education) && value.education.length ? value.education : [emptyEducation()],
    skills: typeof value.skills === 'string' ? value.skills : '',
    projects: Array.isArray(value.projects) && value.projects.length ? value.projects : [emptyProject()],
    languages: typeof value.languages === 'string' ? value.languages : '',
  };
}

const input = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500';

export function ResumeEditor({ initialResume }: { initialResume: Resume }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialResume.title || 'Mon CV');
  const [template, setTemplate] = useState(initialResume.template || 'classic');
  const [content, setContent] = useState(() => normalize(initialResume.content, initialResume.summary));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const firstRender = useRef(true);

  const save = async () => {
    setSaving(true); setError('');
    try {
      const response = await fetch(`/api/resumes/${initialResume.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, template, summary: content.summary, content }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Échec de la sauvegarde');
      setStatus('Sauvegardé automatiquement');
    } catch (err) { setError(err instanceof Error ? err.message : 'Erreur de sauvegarde'); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setStatus('Modifications en attente...');
    const timer = window.setTimeout(() => void save(), 700);
    return () => window.clearTimeout(timer);
  }, [title, template, content]);

  const updatePersonal = (field: keyof PersonalInfo, value: string) => setContent((c) => ({ ...c, personalInfo: { ...c.personalInfo, [field]: value } }));
  const updateItem = (section: 'experience' | 'education' | 'projects', index: number, field: string, value: string) => setContent((c) => ({ ...c, [section]: c[section].map((item, i) => i === index ? { ...item, [field]: value } : item) }));
  const addItem = (section: 'experience' | 'education' | 'projects') => setContent((c) => ({ ...c, [section]: [...c[section], section === 'experience' ? emptyExperience() : section === 'education' ? emptyEducation() : emptyProject()] }));
  const removeItem = (section: 'experience' | 'education' | 'projects', index: number) => setContent((c) => ({ ...c, [section]: c[section].filter((_, i) => i !== index) }));

  const removeResume = async () => {
    if (!window.confirm('Supprimer définitivement ce CV ?')) return;
    const response = await fetch(`/api/resumes/${initialResume.id}`, { method: 'DELETE' });
    if (response.ok) router.push('/dashboard/cv');
    else setError('Impossible de supprimer le CV.');
  };

  const theme = template === 'modern'
    ? { panel: 'bg-blue-700', accent: 'text-blue-700', paper: 'bg-blue-50' }
    : template === 'minimal'
      ? { panel: 'bg-slate-100 text-slate-900', accent: 'text-slate-900', paper: 'bg-white' }
      : { panel: 'bg-slate-900', accent: 'text-blue-700', paper: 'bg-white' };

  const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">{label}</span><input className={input} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
  const Area = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">{label}</span><textarea className={input} rows={4} value={value} onChange={(e) => onChange(e.target.value)} /></label>;

  return <main className="min-h-screen bg-slate-100 p-6"><div className="mx-auto max-w-7xl">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-slate-500">CV</p><h1 className="text-3xl font-black text-slate-900">Édition du CV</h1></div><div className="flex flex-wrap gap-2"><Link href="/dashboard/cv" className="rounded-xl border bg-white px-4 py-2 font-semibold">Retour</Link><Link href={`/dashboard/cv/${initialResume.id}/pdf`} target="_blank" className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white">Aperçu PDF</Link><button type="button" onClick={() => window.print()} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Exporter PDF</button><button type="button" onClick={() => void removeResume()} className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white">Supprimer</button></div></header>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]"><section className="space-y-6 rounded-3xl border bg-white p-6 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2"><Field label="Titre du CV" value={title} onChange={setTitle} /><label className="block"><span className="mb-1 block text-sm font-medium">Modèle</span><select className={input} value={template} onChange={(e) => setTemplate(e.target.value)}><option value="classic">Classic</option><option value="modern">Modern</option><option value="minimal">Minimal</option></select></label></div>
      <div className="grid gap-4 md:grid-cols-2">{(['firstName','lastName','email','phone','city','country','title','website','linkedin'] as const).map((field) => <Field key={field} label={field} value={content.personalInfo[field]} onChange={(v) => updatePersonal(field, v)} />)}</div>
      <Area label="Résumé" value={content.summary} onChange={(v) => setContent((c) => ({ ...c, summary: v }))} />
      {([['experience', 'Expérience'], ['education', 'Formation'], ['projects', 'Projets']] as const).map(([section, label]) => <section key={section} className="space-y-3 rounded-2xl border bg-slate-50 p-4"><div className="flex justify-between"><h2 className="font-bold">{label}</h2><button type="button" onClick={() => addItem(section)} className="rounded-lg border bg-white px-3 py-1">+ Ajouter</button></div>{content[section].map((item, index) => <div key={index} className="space-y-2 rounded-xl border bg-white p-3">{section === 'experience' && <div className="grid gap-2 md:grid-cols-2"><input className={input} placeholder="Poste" value={item.position} onChange={(e) => updateItem(section,index,'position',e.target.value)} /><input className={input} placeholder="Entreprise" value={item.company} onChange={(e) => updateItem(section,index,'company',e.target.value)} /></div>}{section === 'education' && <div className="grid gap-2 md:grid-cols-2"><input className={input} placeholder="Diplôme" value={item.degree} onChange={(e) => updateItem(section,index,'degree',e.target.value)} /><input className={input} placeholder="Établissement" value={item.institution} onChange={(e) => updateItem(section,index,'institution',e.target.value)} /></div>}{section === 'projects' && <input className={input} placeholder="Nom du projet" value={item.name} onChange={(e) => updateItem(section,index,'name',e.target.value)} />}<input className={input} placeholder="Période ou lien" value={section === 'projects' ? item.link : item.period} onChange={(e) => updateItem(section,index,section === 'projects' ? 'link' : 'period',e.target.value)} /><textarea className={input} rows={3} placeholder="Description" value={item.description} onChange={(e) => updateItem(section,index,'description',e.target.value)} /><button type="button" onClick={() => removeItem(section,index)} className="text-left text-sm text-red-600">Supprimer cet élément</button></div>)}</section>)}
      <div className="grid gap-4 md:grid-cols-2"><Area label="Compétences" value={content.skills} onChange={(v) => setContent((c) => ({ ...c, skills: v }))} /><Area label="Langues" value={content.languages} onChange={(v) => setContent((c) => ({ ...c, languages: v }))} /></div>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<p className="text-sm text-slate-500">{saving ? 'Sauvegarde...' : status || 'Prêt'}</p>
    </section><aside className={`h-fit rounded-3xl border p-5 shadow-soft ${theme.paper}`}><h2 className="mb-4 text-xl font-bold">Aperçu {template}</h2><article className="bg-white p-5 shadow"><header className={`rounded-xl p-5 ${theme.panel}`}><h3 className="text-2xl font-black">{content.personalInfo.firstName || 'Prénom'} {content.personalInfo.lastName || 'Nom'}</h3><p>{content.personalInfo.title || 'Titre professionnel'}</p><p className="mt-2 text-xs">{content.personalInfo.email || 'email@example.com'} · {content.personalInfo.phone || 'Téléphone'}</p></header><h4 className={`mt-5 font-bold ${theme.accent}`}>Profil</h4><p className="mt-1 whitespace-pre-line text-sm">{content.summary || 'Aucun résumé.'}</p><h4 className={`mt-5 font-bold ${theme.accent}`}>Expérience</h4>{content.experience.map((x,i) => <div key={i} className="mt-2 text-sm"><b>{x.position || 'Poste'}</b><p>{x.company || 'Entreprise'} · {x.period || 'Période'}</p></div>)}<h4 className={`mt-5 font-bold ${theme.accent}`}>Compétences</h4><p className="whitespace-pre-line text-sm">{content.skills || 'Aucune compétence.'}</p></article></aside></div>
  </div></main>;
}
