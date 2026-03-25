'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useContent';
import { Save, Plus, Trash2, ExternalLink, Github, ImageIcon } from 'lucide-react';

export default function ProjectsManager() {
  const { projects, mutate, isLoading } = useProjects();
  const [localProjects, setLocalProjects] = useState<any[]>([]);

  useEffect(() => {
    if (projects) setLocalProjects([...projects]);
  }, [projects]);

  const handleSave = async (item: any) => {
    try {
      const isNew = !item.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) mutate();
    } catch {}
  };

  const handleDelete = async (id: number | string, index: number) => {
    if (!id) {
      const next = [...localProjects];
      next.splice(index, 1);
      setLocalProjects(next);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) mutate();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const addProject = () => {
    setLocalProjects([{ 
      title: 'New Project', 
      description: '', 
      long_description: '',
      image: '', 
      github_link: '', 
      link: '', 
      technologies: [], 
      role: '',
      outcome: '',
      featured: 0,
      sort_order: localProjects.length 
    }, ...localProjects]);
  };

  if (isLoading) return <div className="p-8 text-gray-500 font-mono">LOADING PROJECTS...</div>;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Project Portfolio</h1>
          <p className="text-gray-400 mt-1">Showcase your best work with images, links, and tags.</p>
        </div>
        <button onClick={addProject} className="bg-brand-purple px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {localProjects.map((proj, i) => (
          <div key={proj.id || i} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 relative group">
            <button 
              onClick={() => handleDelete(proj.id, i)}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Project Title</label>
                  <input 
                    type="text" value={proj.title || ''} 
                    onChange={e => {
                      const next = [...localProjects];
                      next[i].title = e.target.value;
                      setLocalProjects(next);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-brand-purple/50 transition-colors"
                    placeholder="e.g. Altertec AI Platform"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Short Description</label>
                  <textarea 
                    value={proj.description || ''} 
                    onChange={e => {
                      const next = [...localProjects];
                      next[i].description = e.target.value;
                      setLocalProjects(next);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 h-24 resize-none outline-none focus:border-brand-purple/50"
                    placeholder="One sentence summary..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Long Narrative</label>
                  <textarea 
                    value={proj.long_description || ''} 
                    onChange={e => {
                      const next = [...localProjects];
                      next[i].long_description = e.target.value;
                      setLocalProjects(next);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 h-40 resize-none outline-none focus:border-brand-purple/50"
                    placeholder="Detailed project breakdown..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Role</label>
                    <input type="text" value={proj.role || ''} onChange={e => { const n = [...localProjects]; n[i].role = e.target.value; setLocalProjects(n); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-purple/50" placeholder="e.g. Lead Designer" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Outcome</label>
                    <input type="text" value={proj.outcome || ''} onChange={e => { const n = [...localProjects]; n[i].outcome = e.target.value; setLocalProjects(n); }} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-purple/50" placeholder="e.g. 20% Growth" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Project Image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                      {proj.image ? <img src={proj.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-gray-600" />}
                    </div>
                    <input type="text" value={proj.image || ''} onChange={e => { const n = [...localProjects]; n[i].image = e.target.value; setLocalProjects(n); }} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-brand-purple/50" placeholder="https://unsplash.com/..." />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-mono">Links</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                      <Github className="w-4 h-4 text-gray-500" />
                      <input type="text" value={proj.github_link || ''} onChange={e => { const n = [...localProjects]; n[i].github_link = e.target.value; setLocalProjects(n); }} className="flex-1 bg-transparent text-xs outline-none" placeholder="GitHub Repository URL" />
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                      <input type="text" value={proj.link || ''} onChange={e => { const n = [...localProjects]; n[i].link = e.target.value; setLocalProjects(n); }} className="flex-1 bg-transparent text-xs outline-none" placeholder="Live Demo URL" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`featured-${i}`}
                      checked={proj.featured === 1}
                      onChange={e => {
                        const next = [...localProjects];
                        next[i].featured = e.target.checked ? 1 : 0;
                        setLocalProjects(next);
                      }}
                      className="w-4 h-4 accent-brand-purple"
                    />
                    <label htmlFor={`featured-${i}`} className="text-xs text-gray-400">Featured Project</label>
                  </div>
                  <button 
                    onClick={() => handleSave(proj)}
                    className="bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white px-8 py-3 rounded-xl border border-brand-purple/20 text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
