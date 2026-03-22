'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, User, Folder, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ skills: 0, projects: 0, experience: 0 });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/all');
      const data = await res.json();
      setStats({
        skills: data.skills?.length || 0,
        projects: data.projects?.length || 0,
        experience: data.experience?.length || 0
      });
    } catch {
      console.error("Failed to load dashboard data");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
        <form onSubmit={handleLogin} className="w-full max-w-md p-8 glass-card border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md text-center">
          <h1 className="text-3xl font-bold mb-2 font-display">MHK<span className="text-brand-purple">.</span></h1>
          <p className="text-gray-400 mb-8">Admin Dashboard</p>
          
          <div className="mb-4 text-left">
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-purple" 
              value={username} 
              onChange={v => setUsername(v.target.value)} 
            />
          </div>
          <div className="mb-8 text-left">
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-purple" 
              value={password} 
              onChange={v => setPassword(v.target.value)} 
            />
          </div>
          
          <button type="submit" className="w-full py-3 bg-brand-purple hover:bg-brand-accent transition-colors rounded-lg font-bold">
            Sign In
          </button>
          
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold font-display">MHK<span className="text-brand-purple">.</span> Admin</h2>
        </div>
        <nav className="flex-1 py-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-brand-purple/10 border-l-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-brand-purple/10 border-l-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <User className="w-5 h-5" /> Profile
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full text-left px-6 py-3 flex items-center gap-3 transition-colors ${activeTab === 'projects' ? 'bg-brand-purple/10 border-l-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Folder className="w-5 h-5" /> Projects (CRUD via API coming soon)
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 p-8 w-full">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-display">Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, Next.js Admin</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 border border-white/10 bg-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div><p className="text-2xl font-bold">{stats.skills}</p><p className="text-gray-400 text-xs">Skills Built</p></div>
              </div>
              <div className="glass-card p-6 border border-white/10 bg-white/5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                  <Folder className="w-6 h-6 text-brand-accent" />
                </div>
                <div><p className="text-2xl font-bold">{stats.projects}</p><p className="text-gray-400 text-xs">Projects Migrated</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && <div><h1 className="text-3xl font-bold font-display mb-4">Profile API Placeholder</h1><p className="text-gray-400">Implement React forms pointing to `/api/profile`.</p></div>}
        {activeTab === 'projects' && <div><h1 className="text-3xl font-bold font-display mb-4">Projects Placeholder</h1><p className="text-gray-400">Implement React crud views pointing to `/api/projects`.</p></div>}
      </main>
    </div>
  );
}
