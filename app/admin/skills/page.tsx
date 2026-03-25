'use client';

import { useState, useEffect } from 'react';
import { useSkills } from '@/hooks/useContent';
import { Save, Plus, Trash2, Code2, Brain, Monitor, Server, Database, Wrench } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'Frontend': Monitor, 'Backend': Server, 'Database': Database,
  'DevOps': Server, 'AI/ML': Brain, 'Tools': Wrench
};

export default function SkillsManager() {
  const { skills, mutate, isLoading } = useSkills();
  const [localSkills, setLocalSkills] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (skills) setLocalSkills([...skills]);
  }, [skills]);

  const handleSave = async (skill: any) => {
    setIsSaving(true);
    try {
      const isNew = !skill.id;
      const url = isNew ? '/api/admin/skills' : '/api/admin/skills';
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });

      if (res.ok) {
        mutate();
        setStatus({ type: 'success', message: 'Skill saved successfully!' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save skill.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
      mutate();
    } catch {}
  };

  const addSkill = () => {
    const newSkill = { name: 'New Skill', category: 'Frontend', level: 80, icon: 'code-2', sort_order: localSkills.length };
    setLocalSkills([...localSkills, newSkill]);
  };

  if (isLoading) return <div className="p-8 text-gray-500 font-mono">LOADING SKILLS...</div>;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Skills Inventory</h1>
          <p className="text-gray-400 mt-1">Manage technical expertise, proficiency levels, and categorization.</p>
        </div>
        <button 
          onClick={addSkill}
          className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple/80 px-6 py-2.5 rounded-xl font-bold transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localSkills.map((skill, i) => (
          <div key={skill.id || i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <input 
                  type="text" 
                  value={skill.name} 
                  onChange={e => {
                    const next = [...localSkills];
                    next[i].name = e.target.value;
                    setLocalSkills(next);
                  }}
                  className="bg-transparent text-xl font-bold outline-none border-b border-transparent focus:border-brand-purple/50 w-full"
                />
                <div className="flex gap-2 text-xs">
                  <select 
                    value={skill.category}
                    onChange={e => {
                      const next = [...localSkills];
                      next[i].category = e.target.value;
                      setLocalSkills(next);
                    }}
                    className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 outline-none"
                  >
                    {Object.keys(categoryIcons).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input 
                    type="number" 
                    value={skill.level} 
                    onChange={e => {
                      const next = [...localSkills];
                      next[i].level = parseInt(e.target.value);
                      setLocalSkills(next);
                    }}
                    className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-1 outline-none"
                  />
                  <span className="flex items-center">% Proficiency</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleDelete(skill.id)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => handleSave(skill)}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold transition-all"
            >
              Update Skill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
