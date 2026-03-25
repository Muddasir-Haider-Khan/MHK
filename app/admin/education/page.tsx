'use client';

import { useState, useEffect } from 'react';
import { useEducation } from '@/hooks/useContent';
import { Save, Plus, Trash2, GraduationCap } from 'lucide-react';

export default function EducationManager() {
  const { education, mutate, isLoading } = useEducation();
  const [localEdu, setLocalEdu] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (education) setLocalEdu([...education]);
  }, [education]);

  const handleSave = async (item: any) => {
    setIsSaving(true);
    try {
      const isNew = !item.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) mutate();
    } finally {
      setIsSaving(false);
    }
  };

  const addEdu = () => {
    setLocalEdu([{ 
      institution: 'New University', 
      degree: 'Degree', 
      field_of_study: 'Field', 
      location: 'Location', 
      start_date: 'Start', 
      end_date: 'Present', 
      description: '', 
      sort_order: localEdu.length 
    }, ...localEdu]);
  };

  if (isLoading) return <div className="p-8 text-gray-500 font-mono">LOADING EDUCATION...</div>;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Education</h1>
          <p className="text-gray-400 mt-1">Manage your academic background and certifications.</p>
        </div>
        <button onClick={addEdu} className="bg-brand-purple px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="space-y-6">
        {localEdu.map((edu, i) => (
          <div key={edu.id || i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input 
                  type="text" value={edu.institution} 
                  onChange={e => {
                    const next = [...localEdu];
                    next[i].institution = e.target.value;
                    setLocalEdu(next);
                  }}
                  className="w-full bg-transparent text-2xl font-bold outline-none border-b border-transparent focus:border-brand-purple/50"
                  placeholder="Institution Name"
                />
                <input 
                  type="text" value={edu.degree} 
                  onChange={e => {
                    const next = [...localEdu];
                    next[i].degree = e.target.value;
                    setLocalEdu(next);
                  }}
                  className="w-full bg-transparent text-lg text-gray-400 outline-none"
                  placeholder="Degree"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                  <input type="text" value={edu.start_date} onChange={e => { const n = [...localEdu]; n[i].start_date = e.target.value; setLocalEdu(n); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                  <input type="text" value={edu.end_date} onChange={e => { const n = [...localEdu]; n[i].end_date = e.target.value; setLocalEdu(n); }} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button 
                onClick={() => handleSave(edu)}
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
