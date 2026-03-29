'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Instagram, Calendar } from 'lucide-react';
import { useNav, useSiteSettings, useProfile } from '@/hooks/useContent';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { navItems, isLoading } = useNav();
  const { settings } = useSiteSettings();
  const { profile } = useProfile();

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
        {/* iOS Frosted Base Navbar Bar - hidden on mobile purely, or we can just rely on the pill container */}
        <a href="#" className="text-xl md:text-2xl font-display font-bold tracking-tighter hover:text-brand-purple transition-all duration-300 transform hover:scale-105 active:scale-95" style={{ letterSpacing: '-0.04em' }}>
          {settings?.site_name || 'MHK.'}
        </a>
        
        {/* Pill-shaped Glassmorphism */}
        <div className="hidden md:flex gap-10 items-center bg-[#ffffff]/60 saturate-200 backdrop-blur-3xl px-12 py-3.5 rounded-full shadow-[0_10px_30px_rgba(104,66,189,0.06)] border border-[#ffffff] overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_rgba(104,66,189,0.1)]">
          {isLoading ? (
            <div className="flex gap-8"><span className="w-12 h-4 bg-[#e1e8fc] animate-pulse rounded"></span><span className="w-12 h-4 bg-[#e1e8fc] animate-pulse rounded"></span></div>
          ) : Array.isArray(navItems) && navItems.length > 0 ? (
            navItems.filter((i: any) => i && !i.is_cta_button).map((item: any) => (
              <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="text-[13px] font-bold text-[#4f5d6d] hover:text-[#292f3b] transition-all duration-300 tracking-widest uppercase hover:-translate-y-0.5">
                {item.label}
              </a>
            ))
          ) : (
            // Fallback before seed
            <>
              <a href="#story" className="text-[13px] font-bold text-[#4f5d6d] hover:text-[#292f3b] transition-all duration-300 tracking-widest uppercase hover:-translate-y-0.5">Story</a>
              <a href="#skills" className="text-[13px] font-bold text-[#4f5d6d] hover:text-[#292f3b] transition-all duration-300 tracking-widest uppercase hover:-translate-y-0.5">Skills</a>
              <a href="#work" className="text-[13px] font-bold text-[#4f5d6d] hover:text-[#292f3b] transition-all duration-300 tracking-widest uppercase hover:-translate-y-0.5">Work</a>
              <a href="#experience" className="text-[13px] font-bold text-[#4f5d6d] hover:text-[#292f3b] transition-all duration-300 tracking-widest uppercase hover:-translate-y-0.5">Journey</a>
              <a href="#process" className="text-[13px] font-bold text-[#4f5d6d] hover:text-[#292f3b] transition-all duration-300 tracking-widest uppercase hover:-translate-y-0.5">Process</a>
            </>
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Social Icons */}
          <a href={profile?.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : '#'} target="_blank" rel="noreferrer" title="WhatsApp" className="w-11 h-11 rounded-full bg-[#ffffff]/60 saturate-200 backdrop-blur-3xl flex items-center justify-center border border-[#ffffff] shadow-[0_5px_15px_rgba(104,66,189,0.06)] hover:bg-[#25D366] hover:border-transparent hover:text-white text-[#4b5563] transition-all duration-300 ease-[cubic-bezier(0.17,0.67,0.21,1)] transform hover:scale-110">
             <Phone className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </a>
          <a href={profile?.instagram || '#'} target="_blank" rel="noreferrer" title="Instagram" className="w-11 h-11 rounded-full bg-[#ffffff]/60 saturate-200 backdrop-blur-3xl flex items-center justify-center border border-[#ffffff] shadow-[0_5px_15px_rgba(104,66,189,0.06)] hover:bg-[#bc1888] hover:border-transparent hover:text-white text-[#4b5563] transition-all duration-300 ease-[cubic-bezier(0.17,0.67,0.21,1)] transform hover:scale-110 mr-2">
             <Instagram className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </a>
          
          {isLoading ? (
            <div className="hidden md:block w-32 h-11 bg-[#e1e8fc] animate-pulse rounded-full shadow-[0_10px_20px_rgba(104,66,189,0.08)]"></div>
          ) : Array.isArray(navItems) && navItems.filter((i: any) => i?.is_cta_button).length > 0 ? (
            navItems.filter((i: any) => i?.is_cta_button).map((item: any) => (
              <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-[#292f3b] text-[#ffffff] font-bold tracking-widest uppercase text-[12px] rounded-full shadow-[0_10px_30px_rgba(104,66,189,0.15)] hover:bg-brand-purple hover:shadow-[0_15px_40px_rgba(104,66,189,0.3)] transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.21,1)] transform hover:scale-105 active:scale-95">
                <span>{item.label}</span>
              </a>
            ))
          ) : (
            <a href={profile?.cal_link || '#contact'} className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-[#292f3b] text-[#ffffff] font-bold tracking-widest uppercase text-[12px] rounded-full shadow-[0_10px_30px_rgba(104,66,189,0.15)] hover:bg-brand-purple hover:shadow-[0_15px_40px_rgba(104,66,189,0.3)] transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.21,1)] transform hover:scale-105 active:scale-95">
              <Calendar className="w-4 h-4" />
              <span>Book Call</span>
            </a>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2 mr-1">
          <a href={profile?.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : '#'} target="_blank" rel="noreferrer" title="WhatsApp" className="w-10 h-10 rounded-full bg-white/60 saturate-200 backdrop-blur-3xl flex items-center justify-center border border-white shadow-[0_5px_15px_rgba(104,66,189,0.06)] text-[#4b5563] active:scale-90 transition-all">
             <Phone className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </a>
          <a href={profile?.instagram || '#'} target="_blank" rel="noreferrer" title="Instagram" className="w-10 h-10 rounded-full bg-white/60 saturate-200 backdrop-blur-3xl flex items-center justify-center border border-white shadow-[0_5px_15px_rgba(104,66,189,0.06)] text-[#4b5563] active:scale-90 transition-all">
             <Instagram className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </a>
        </div>

        <button 
          className="md:hidden text-[#292f3b] hover:text-brand-purple transition-all duration-300 active:scale-90"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 glass-menu z-[100] flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.17,0.67,0.21,1)] text-[#292f3b] ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button 
          className="absolute top-6 right-6 text-[#292f3b] hover:text-brand-purple transition-transform duration-500 hover:rotate-90 active:scale-90"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation menu"
        >
          <X className="w-10 h-10" />
        </button>
        {Array.isArray(navItems) && navItems.length > 0 ? (
          navItems.map((item: any) => (
            <a key={item.id} href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="text-4xl font-display font-medium tracking-tighter hover:text-brand-purple transition-colors" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))
        ) : (
          <>
            <a href="#story" className="mobile-nav-link text-5xl font-display font-medium hover:text-brand-purple transition-all tracking-tighter" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>Story</a>
            <a href="#skills" className="mobile-nav-link text-5xl font-display font-medium hover:text-brand-purple transition-all tracking-tighter" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
            <a href="#work" className="mobile-nav-link text-5xl font-display font-medium hover:text-brand-purple transition-all tracking-tighter" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>Work</a>
            <a href="#experience" className="mobile-nav-link text-5xl font-display font-medium hover:text-brand-purple transition-all tracking-tighter" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>Journey</a>
            <a href="#process" className="mobile-nav-link text-5xl font-display font-medium hover:text-brand-purple transition-all tracking-tighter" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>Process</a>
            <a href="#contact" className="mobile-nav-link text-5xl font-display font-bold text-brand-purple mt-8" style={{ letterSpacing: '-0.04em' }} onClick={() => setIsMobileMenuOpen(false)}>Connect</a>
          </>
        )}
      </div>
    </>
  );
}
