'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Linkedin, Mail, Instagram } from 'lucide-react';

export default function Hero({ profile }: { profile?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple entry animation
    gsap.fromTo(
      ".hero-3d-text",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }
    );
    gsap.fromTo(
      ".hero-tagline-pill",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center relative px-4 overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      
      <div className="text-center relative z-20">
        <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-400 mb-4 opacity-100">
          {profile?.tagline || 'Based in Islamabad'}
        </p>
        
        <div className="hero-3d-wrapper" style={{ perspective: '800px' }}>
          <h1 className="hero-title font-display font-bold text-[22vw] md:text-[18vw] leading-[0.85] tracking-tighter" style={{ transformStyle: 'preserve-3d' }}>
            <div className="overflow-hidden">
              <span className="block hero-3d-text text-white filter drop-shadow-[0_4px_20px_rgba(139,92,246,0.12)]">
                {profile?.name ? profile.name.split(' ').map((w: string) => w[0]).join('').toUpperCase() : 'MHK'}
              </span>
            </div>
            {/* Hidden SR-only explicit full name for rank density */}
            <span className="sr-only">Muddasir Haider Khan - Top Freelancer in Pakistan</span>
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 overflow-hidden">
          <div className="hero-tagline-pill bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
            <h2 className="text-sm md:text-lg text-gray-300">{profile?.title || 'Top AI Engineer'}</h2>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent scroll-line"></div>
      </div>
    </section>
  );
}
