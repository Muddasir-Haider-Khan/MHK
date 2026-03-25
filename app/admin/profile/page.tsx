'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useContent';
import { Save, User, MapPin, Mail, Phone, Linkedin, AlignLeft, Sparkles, Brain } from 'lucide-react';

export default function ProfileManager() {
  const { profile, mutate, isLoading } = useProfile();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        narrative: Array.isArray(profile.narrative) 
          ? profile.narrative 
          : JSON.parse(profile.narrative || '[]')
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        mutate();
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to update profile.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An error occurred during save.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  const updateNarrative = (index: number, val: string) => {
    const newNarrative = [...formData.narrative];
    newNarrative[index] = val;
    setFormData({ ...formData, narrative: newNarrative });
  };

  const addNarrative = () => {
    setFormData({ ...formData, narrative: [...formData.narrative, ""] });
  };

  const removeNarrative = (index: number) => {
    const newNarrative = formData.narrative.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, narrative: newNarrative });
  };

  if (isLoading || !formData) return <div className="p-8 text-gray-500 font-mono">LOADING PROFILE DATA...</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Profile Management</h1>
          <p className="text-gray-400 mt-1">Manage your professional bio, contact details, and core narrative.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple/80 px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}

      {/* Core Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-brand-purple" /> Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Professional Role</label>
            <input 
              type="text" 
              value={formData.role || ''} 
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <input 
              type="text" 
              value={formData.location || ''} 
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input 
              type="email" 
              value={formData.email || ''} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* About / Summary */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-brand-purple" /> Professional Summary
        </h2>
        <textarea 
          rows={4}
          value={formData.summary || ''} 
          onChange={e => setFormData({...formData, summary: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all resize-none"
          placeholder="Brief overview of your expertise..."
        />
      </div>

      {/* Narrative (Sentences) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-purple" /> Interactive Narrative
          </h2>
          <button 
            onClick={addNarrative}
            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          >
            + Add Sentence
          </button>
        </div>
        <p className="text-sm text-gray-400">These sentences animate sequentially on the Story section.</p>
        <div className="space-y-3">
          {formData.narrative.map((sentence: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input 
                type="text" 
                value={sentence} 
                onChange={e => updateNarrative(i, e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all"
              />
              <button 
                onClick={() => removeNarrative(i)}
                className="px-3 text-gray-500 hover:text-red-400 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-purple" /> Philosophy / Process
        </h2>
        <textarea 
          rows={3}
          value={formData.philosophy || ''} 
          onChange={e => setFormData({...formData, philosophy: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-purple/50 outline-none transition-all resize-none"
          placeholder="Describe your design or development philosophy..."
        />
      </div>
    </div>
  );
}
