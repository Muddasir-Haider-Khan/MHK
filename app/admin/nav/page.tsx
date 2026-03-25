'use client';

import { useState } from 'react';
import { useNav } from '@/hooks/useContent';
import { Plus, Edit2, Trash2, Save, X, ExternalLink } from 'lucide-react';

export default function NavigationManager() {
  const { navItems, isLoading, mutate } = useNav();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    url: '',
    order_index: 0,
    is_active: true,
    is_cta_button: false,
    open_in_new_tab: false
  });

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setFormData({
      id: '',
      label: '',
      url: '/',
      order_index: navItems ? navItems.length + 1 : 1,
      is_active: true,
      is_cta_button: false,
      open_in_new_tab: false
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    const isNew = isCreating;
    const optimisticData = isNew 
      ? [...(navItems || []), { ...formData, id: 'temp-id' }] 
      : (navItems || []).map((i: any) => i.id === formData.id ? formData : i);
      
    mutate(optimisticData, false);
    setEditingId(null);
    setIsCreating(false);

    try {
      const res = await fetch('/api/admin/nav', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        mutate();
      } else {
        mutate(); // Revert on failure
      }
    } catch {
      mutate();
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    mutate((navItems || []).filter((i: any) => i.id !== id), false);
    
    try {
      const res = await fetch(`/api/admin/nav?id=${id}`, { method: 'DELETE' });
      if (res.ok) mutate();
      else mutate();
    } catch {
      mutate();
    }
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-white/5 rounded-2xl"></div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Navigation</h1>
          <p className="text-gray-400 mt-1">Manage the primary website header menu and CTA buttons.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          disabled={isCreating || editingId !== null}
          className="flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/[0.02] text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div className="col-span-3">Label</div>
          <div className="col-span-4">URL</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Create Form Row */}
        {isCreating && (
          <div className="p-4 border-b border-white/10 bg-brand-purple/5">
            <EditFormRow 
              formData={formData} 
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={cancelEdit}
            />
          </div>
        )}

        {/* Existing Items */}
        {navItems && navItems.length > 0 ? (
          <div className="divide-y divide-white/5">
            {navItems.map((item: any) => (
              <div key={item.id}>
                {editingId === item.id ? (
                  <div className="p-4 bg-white/5">
                    <EditFormRow 
                      formData={formData} 
                      setFormData={setFormData}
                      onSave={handleSave}
                      onCancel={cancelEdit}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                    <div className="col-span-3 font-medium flex items-center gap-2">
                      {item.label}
                      {item.open_in_new_tab && <ExternalLink className="w-3 h-3 text-gray-500" />}
                    </div>
                    <div className="col-span-4 text-sm text-gray-400 font-mono truncate">{item.url}</div>
                    <div className="col-span-2 text-center">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${item.is_cta_button ? 'bg-white text-black font-bold' : 'bg-white/10 text-gray-300'}`}>
                        {item.is_cta_button ? 'CTA Button' : 'Link'}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className={`w-2.5 h-2.5 rounded-full mx-auto ${item.is_active ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isCreating && (
            <div className="p-12 text-center text-gray-500">
              No navigation items found. Click "Add Link" to create one.
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EditFormRow({ formData, setFormData, onSave, onCancel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Label</label>
          <input 
            type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-purple outline-none"
            placeholder="e.g., About Us" autoFocus
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">URL / Anchor</label>
          <input 
            type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-purple outline-none"
            placeholder="e.g., /about or #skills"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.is_cta_button} onChange={e => setFormData({...formData, is_cta_button: e.target.checked})} className="rounded bg-black/50 border-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-gray-900" />
          <span className="text-sm">Style as CTA Button</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.open_in_new_tab} onChange={e => setFormData({...formData, open_in_new_tab: e.target.checked})} className="rounded bg-black/50 border-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-gray-900" />
          <span className="text-sm">Open in new tab</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded bg-black/50 border-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-gray-900" />
          <span className="text-sm">Active (Visible)</span>
        </label>

        <div className="flex-1 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Cancel
          </button>
          <button onClick={onSave} className="flex items-center gap-2 bg-brand-purple hover:bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Link
          </button>
        </div>
      </div>
    </div>
  );
}
