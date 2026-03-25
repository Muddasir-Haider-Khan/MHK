'use client';

import { useState, useEffect } from 'react';
import { useHero } from '@/hooks/useContent';
import { Save, AlertCircle } from 'lucide-react';

export default function HeroManager() {
  const { hero, isLoading, mutate } = useHero('home');
  
  const [formData, setFormData] = useState({
    badge_text: '',
    heading: '',
    subheading: '',
    cta_primary_text: '',
    cta_primary_url: '',
    is_active: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync state with DB
  useEffect(() => {
    if (hero && !isLoading) {
      setFormData({
        badge_text: hero.badge_text || '',
        heading: hero.heading || '',
        subheading: hero.subheading || '',
        cta_primary_text: hero.cta_primary_text || '',
        cta_primary_url: hero.cta_primary_url || '',
        is_active: hero.is_active ?? true
      });
    }
  }, [hero, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    // Optimistic update
    mutate(formData, false);

    try {
      const res = await fetch('/api/admin/hero/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSaveStatus('success');
        mutate(formData);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        mutate();
      }
    } catch (err) {
      setSaveStatus('error');
      mutate();
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 bg-white/10 w-1/3 rounded"></div>
      <div className="h-[500px] bg-white/5 rounded-2xl w-full border border-white/10"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight">Hero Section Manager</h1>
        <p className="text-gray-400 mt-1">Edit the main above-the-fold content for the Homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Content Properties</h2>
                  <p className="text-xs text-gray-500 mt-1">Will update live via SSE without refresh.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-300">Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Badge Text (Eyebrow)</label>
                <input 
                  type="text"
                  value={formData.badge_text}
                  onChange={e => setFormData({ ...formData, badge_text: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none transition-colors"
                  placeholder="e.g., Based in Islamabad"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Large Main Heading</label>
                <input 
                  type="text"
                  value={formData.heading}
                  onChange={e => setFormData({ ...formData, heading: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none transition-colors text-2xl font-display font-bold"
                  placeholder="MHK."
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Subheading / Role Title</label>
                <input 
                  type="text"
                  value={formData.subheading}
                  onChange={e => setFormData({ ...formData, subheading: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none transition-colors"
                  placeholder="Top AI Engineer"
                />
              </div>
              
            </div>
            
            <div className="p-6 bg-white-[0.02] border-t border-white/10 flex items-center justify-between">
              <div>
                {saveStatus === 'success' && <span className="text-green-400 text-sm flex items-center gap-2">✓ Saved successfully</span>}
                {saveStatus === 'error' && <span className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Failed to save</span>}
              </div>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Component'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 border-b border-white/10 p-3 text-xs text-gray-400 font-mono text-center flex items-center justify-between">
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
              </div>
              <span>Live Preview</span>
              <div className="w-10"></div>
            </div>
            <div className="p-6 bg-[#050505] min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden text-center zoom-75 origin-top">
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-purple/20 rounded-full blur-[60px] pointer-events-none opacity-50"></div>
              
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 relative z-10">
                {formData.badge_text || 'Eyebrow Text'}
              </p>
              
              <h1 className="font-display font-bold text-6xl leading-[0.85] tracking-tighter text-white relative z-10 mb-4 filter drop-shadow-[0_4px_20px_rgba(139,92,246,0.12)]">
                {formData.heading || 'Heading'}
              </h1>
              
              <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm relative z-10">
                <h2 className="text-xs text-gray-300">{formData.subheading || 'Subheading'}</h2>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
