'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, MessageSquare, 
  Users, HelpCircle, DollarSign, BarChart, Settings, Navigation,
  Menu, X, LogOut, Megaphone, User, Briefcase, GraduationCap, Code2
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Profile (Bio)', icon: User, href: '/admin/profile' },
    { label: 'Hero Sections', icon: ImageIcon, href: '/admin/hero' },
    { label: 'Skills', icon: Code2, href: '/admin/skills' },
    { label: 'Experience', icon: Briefcase, href: '/admin/experience' },
    { label: 'Education', icon: GraduationCap, href: '/admin/education' },
    { label: 'Projects', icon: ImageIcon, href: '/admin/projects' },
    { label: 'Navigation', icon: Navigation, href: '/admin/nav' },
    { label: 'Site Settings', icon: Settings, href: '/admin/settings' },
    // Secondary Items
    { label: 'Blog / Posts', icon: FileText, href: '/admin/posts' },
    { label: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
    { label: 'Team', icon: Users, href: '/admin/team' },
    { label: 'FAQs', icon: HelpCircle, href: '/admin/faqs' },
    { label: 'Pricing', icon: DollarSign, href: '/admin/pricing' },
    { label: 'Stats', icon: BarChart, href: '/admin/stats' },
    { label: 'Gallery', icon: ImageIcon, href: '/admin/gallery' },
    { label: 'Announcements', icon: Megaphone, href: '/admin/announcements' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-[#0a0a0a] border-b border-white/10 z-50 flex items-center justify-between px-4">
        <span className="font-display font-bold">MHK Admin</span>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col
        transition-transform duration-300 z-50 overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <span className="font-display font-bold text-xl tracking-tighter text-brand-purple">MHK. Admin</span>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 pb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors
                  ${isActive 
                    ? 'bg-brand-purple/20 text-brand-purple' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-16 md:pt-0 p-4 md:p-8 overflow-y-auto max-h-screen relative">
        {/* Live Indicator */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-gray-300">Live Sync Active</span>
        </div>
        
        {children}
      </main>
    </div>
  );
}
