'use client';

import { useState, useEffect } from 'react';
import { useExperience } from '@/hooks/useContent';
import { Save, Plus, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react';

export default function ExperienceManager() {
  const { experience, mutate, isLoading } = useExperience();
  const [localExp, setLocalExp] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (experience) setLocalExp([...experience]);
  }, [experience]);

  const handleSave = async (item: any) => {
    setIsSaving(true);
    try {
      const isNew = !item.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) mutate();
    } finally {
      setIsSaving(false);
    }
  };

  const addExp = () => {
    setLocalExp([{ 
      company: 'New Company', 
      role: 'Role', 
      location: 'Location', 
      start_date: 'Start', 
      end_date: 'Present', 
      is_current: true, 
      description: '', 
      sort_order: localExp.length 
    }, ...localExp]);
  };

  if (isLoading) return <div className="p-8 text-gray-500 font-mono">LOADING EXPERIENCE...</div>;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Work Experience</h1>
          <p className="text-gray-400 mt-1">Manage your career timeline and key responsibilities.</p>
        </div>
        <button onClick={addExp} className="bg-brand-purple px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {localExp.map((exp, i) => (
          <div key={exp.id || i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input 
                  type="text" value={exp.company} 
                  onChange={e => {
                    const next = [...localExp];
                    next[i].company = e.target.value;
                    setLocalExp(next);
                  }}
                  className="w-full bg-transparent text-2xl font-bold outline-none border-b border-transparent focus:border-brand-purple/50"
                  placeholder="Company Name"
                />
                <input 
                  type="text" value={exp.role} 
                  onChange={e => {
                    const next = [...localExp];
                    next[i].role = e.target.value;
                    setLocalExp(next);
                  }}
                  className="w-full bg-transparent text-lg text-gray-400 outline-none"
                  placeholder="Job Role"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                  <input type="text" value={exp.start_date} onChange={e => { const n = [...localExp]; n[i].start_date = e.target.value; setLocalExp(n); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                  <input type="text" value={exp.end_date} onChange={e => { const n = [...localExp]; n[i].end_date = e.target.value; setLocalExp(n); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button 
                onClick={() => handleSave(exp)}
                className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
