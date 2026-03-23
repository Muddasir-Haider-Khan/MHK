'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

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
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <a href="#" className="text-xl font-display font-bold tracking-tighter hover-magnetic">MHK.</a>
        
        <div className="hidden md:flex gap-8 items-center bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
          <a href="#story" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Story</a>
          <a href="#skills" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Skills</a>
          <a href="#work" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Work</a>
          <a href="#experience" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Journey</a>
          <a href="#process" className="text-sm font-medium hover:text-gray-300 transition-colors link-hover">Process</a>
        </div>
        
        <a href="#contact" className="hidden md:block px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors hover-magnetic">
          Let's Talk
        </a>

        <button 
          className="md:hidden text-white hover-magnetic"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-[#050505]/98 z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500 md:hidden text-white ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
        <a href="#story" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Story</a>
        <a href="#skills" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
        <a href="#work" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
        <a href="#experience" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Journey</a>
        <a href="#process" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Process</a>
        <a href="#contact" className="text-2xl font-display mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Connect</a>
      </div>
    </>
  );
}
