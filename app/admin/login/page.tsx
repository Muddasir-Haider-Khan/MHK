'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Redirect to dashboard (middleware will allow it now)
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-brand-purple/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      
      <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md p-8 glass-card border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md text-center">
        <h1 className="text-3xl font-bold mb-2 font-display">MHK<span className="text-brand-purple">.</span></h1>
        <p className="text-gray-400 mb-8">Admin Login</p>
        
        <div className="mb-4 text-left">
          <label htmlFor="admin-username" className="block text-sm text-gray-400 mb-1">Username</label>
          <input 
            id="admin-username"
            type="text" 
            autoComplete="username"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-purple transition-colors placeholder:text-gray-500" 
            value={username} 
            onChange={v => setUsername(v.target.value)} 
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-8 text-left">
          <label htmlFor="admin-password" className="block text-sm text-gray-400 mb-1">Password</label>
          <input 
            id="admin-password"
            type="password" 
            autoComplete="current-password"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-purple transition-colors placeholder:text-gray-500" 
            value={password} 
            onChange={v => setPassword(v.target.value)} 
            placeholder="Password"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 bg-brand-purple hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-bold"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
}
