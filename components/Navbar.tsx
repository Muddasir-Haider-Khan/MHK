'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useNav, useSiteSettings } from '@/hooks/useContent';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { navItems, isLoading } = useNav();
  const { settings } = useSiteSettings();

  // Hide navbar on admin, hire, and services pages
  const hiddenRoutes = ['/admin', '/hire', '/services'];
  if (hiddenRoutes.some(route => pathname?.startsWith(route))) return null;

  // Close mobile menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-6 flex justify-between items-center text-[#292f3b]">
        <a href="#" className="text-xl font-display font-bold tracking-tighter hover:text-brand-purple transition-colors">
          {settings?.site_name || 'MHK.'}
        </a>
        
        <div className="hidden md:flex gap-8 items-center bg-[#ffffff]/70 backdrop-blur-xl px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(104,66,189,0.08)] border border-[#ffffff]/20 overflow-hidden">
          {isLoading ? (
            <div className="flex gap-8"><span className="w-12 h-4 bg-[#e1e8fc] animate-pulse rounded"></span><span className="w-12 h-4 bg-[#e1e8fc] animate-pulse rounded"></span></div>
          ) : Array.isArray(navItems) && navItems.length > 0 ? (
            navItems.filter((i: any) => i && !i.is_cta_button).map((item: any) => (
              <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="text-sm font-bold text-[#4f5d6d] hover:text-brand-purple transition-colors">
                {item.label}
              </a>
            ))
          ) : (
            // Fallback before seed
            <>
              <a href="#story" className="text-sm font-bold text-[#4f5d6d] hover:text-brand-purple transition-colors tracking-wide">Story</a>
              <a href="#skills" className="text-sm font-bold text-[#4f5d6d] hover:text-brand-purple transition-colors tracking-wide">Skills</a>
              <a href="#work" className="text-sm font-bold text-[#4f5d6d] hover:text-brand-purple transition-colors tracking-wide">Work</a>
              <a href="#experience" className="text-sm font-bold text-[#4f5d6d] hover:text-brand-purple transition-colors tracking-wide">Journey</a>
              <a href="#process" className="text-sm font-bold text-[#4f5d6d] hover:text-brand-purple transition-colors tracking-wide">Process</a>
            </>
          )}
        </div>
        
        {isLoading ? (
          <div className="hidden md:block w-32 h-10 bg-[#e1e8fc] animate-pulse rounded-full shadow-[0_10px_20px_rgba(104,66,189,0.08)]"></div>
        ) : Array.isArray(navItems) && navItems.filter((i: any) => i?.is_cta_button).length > 0 ? (
          navItems.filter((i: any) => i?.is_cta_button).map((item: any) => (
            <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="hidden md:block px-8 py-3.5 bg-brand-purple text-[#f8f0ff] font-bold tracking-wide rounded-full shadow-[0_10px_20px_rgba(104,66,189,0.2)] hover:bg-brand-purple/90 transition-all hover:-translate-y-1">
              {item.label}
            </a>
          ))
        ) : (
          <a href="#contact" className="hidden md:block px-8 py-3.5 bg-brand-purple text-[#f8f0ff] font-bold tracking-wide rounded-full shadow-[0_10px_20px_rgba(104,66,189,0.2)] hover:bg-brand-purple/90 transition-all hover:-translate-y-1">
            Let's Talk
          </a>
        )}

        <button 
          className="md:hidden text-[#292f3b] hover:text-brand-purple transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#f5f6ff] z-[100] flex flex-col items-center justify-center gap-8 transition-transform duration-500 text-[#292f3b] ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button 
          className="absolute top-6 right-6 text-[#292f3b] hover:text-brand-purple transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation menu"
        >
          <X className="w-8 h-8" />
        </button>
        {Array.isArray(navItems) && navItems.length > 0 ? (
          navItems.map((item: any) => (
            <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))
        ) : (
          <>
            <a href="#story" className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Story</a>
            <a href="#skills" className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
            <a href="#work" className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
            <a href="#experience" className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Journey</a>
            <a href="#process" className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
            <a href="#contact" className="text-3xl font-display font-bold hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Connect</a>
          </>
        )}
      </div>
    </>
  );
}
