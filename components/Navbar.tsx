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
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-6 flex justify-between items-center mix-blend-difference text-white">
      <a href="#" className="text-xl font-display font-bold tracking-tighter hover-magnetic">
        {settings?.site_name || 'MHK.'}
      </a>
        
        <div className="hidden md:flex gap-8 items-center bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 overflow-hidden">
          {isLoading ? (
            <div className="flex gap-8"><span className="w-12 h-4 bg-white/10 animate-pulse rounded"></span><span className="w-12 h-4 bg-white/10 animate-pulse rounded"></span></div>
          ) : Array.isArray(navItems) && navItems.length > 0 ? (
            navItems.filter((i: any) => i && !i.is_cta_button).map((item: any) => (
              <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">
                {item.label}
              </a>
            ))
          ) : (
            // Fallback before seed
            <>
              <a href="#story" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Story</a>
              <a href="#skills" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Skills</a>
              <a href="#work" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Work</a>
              <a href="#experience" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Journey</a>
              <a href="#process" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Process</a>
            </>
          )}
        </div>
        
        {isLoading ? (
          <div className="hidden md:block w-32 h-10 bg-white/10 animate-pulse rounded-full"></div>
        ) : Array.isArray(navItems) && navItems.filter((i: any) => i?.is_cta_button).length > 0 ? (
          navItems.filter((i: any) => i?.is_cta_button).map((item: any) => (
            <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="hidden md:block px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors hover-magnetic">
              {item.label}
            </a>
          ))
        ) : (
          <a href="#contact" className="hidden md:block px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors hover-magnetic">
            Let's Talk
          </a>
        )}

        <button 
          className="md:hidden text-white hover-magnetic"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center gap-8 transition-transform duration-500 text-white ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button 
          className="absolute top-6 right-6"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation menu"
        >
          <X className="w-8 h-8" />
        </button>
        {Array.isArray(navItems) && navItems.length > 0 ? (
          navItems.map((item: any) => (
            <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))
        ) : (
          <>
            <a href="#story" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Story</a>
            <a href="#skills" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
            <a href="#work" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
            <a href="#experience" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Journey</a>
            <a href="#process" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
            <a href="#contact" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Connect</a>
          </>
        )}
      </div>
    </>
  );
}
