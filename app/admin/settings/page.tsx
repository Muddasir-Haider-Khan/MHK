'use client';

import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useContent';
import { Save, AlertCircle } from 'lucide-react';

export default function SiteSettingsManager() {
  const { settings, isLoading, mutate } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    site_name: 'MHK.',
    primary_color: '#8b5cf6',
    secondary_color: '#ffffff',
    meta_title_suffix: ' | MHK',
    contact_email: 'hello@muddasir.dev'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync form with loaded data
  useEffect(() => {
    if (settings && !isLoading) {
      setFormData({
        site_name: settings.site_name || '',
        primary_color: settings.primary_color || '#8b5cf6',
        secondary_color: settings.secondary_color || '#ffffff',
        meta_title_suffix: settings.meta_title_suffix || ' | MHK',
        contact_email: settings.contact_email || ''
      });
    }
  }, [settings, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    // Optimistic update
    mutate(formData, false);

    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSaveStatus('success');
        mutate(formData); // Revalidate cleanly
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        mutate(); // Revert
      }
    } catch (err) {
      setSaveStatus('error');
      mutate(); // Revert
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 bg-white/10 w-1/3 rounded"></div>
      <div className="h-[400px] bg-white/5 rounded-2xl w-full border border-white/10"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight">Site Settings</h1>
        <p className="text-gray-400 mt-1">Manage global brand tokens, meta information, and globals.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* General */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2">General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Site Name</label>
                <input 
                  type="text"
                  value={formData.site_name}
                  onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none transition-colors"
                  placeholder="E.g., MHK."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                <input 
                  type="email"
                  value={formData.contact_email}
                  onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none transition-colors"
                  placeholder="hello@company.com"
                />
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2">Appearance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Primary Color (Hex)</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="color"
                    value={formData.primary_color}
                    onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-12 h-12 bg-transparent border-none cursor-pointer p-0"
                  />
                  <input 
                    type="text"
                    value={formData.primary_color}
                    onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Secondary Color (Hex)</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="color"
                    value={formData.secondary_color}
                    onChange={e => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-12 h-12 bg-transparent border-none cursor-pointer p-0"
                  />
                  <input 
                    type="text"
                    value={formData.secondary_color}
                    onChange={e => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-b border-white/10 pb-2">SEO Globals</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Global Meta Title Suffix</label>
                <input 
                  type="text"
                  value={formData.meta_title_suffix}
                  onChange={e => setFormData({ ...formData, meta_title_suffix: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-purple outline-none transition-colors"
                  placeholder=" | MHK"
                />
                <p className="text-xs text-gray-500 mt-2">Appended to individual page titles automatically.</p>
              </div>
            </div>
          </section>

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
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
