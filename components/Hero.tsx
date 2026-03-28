'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHero } from '@/hooks/useContent';

export default function Hero({ profile }: { profile?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hero, isLoading } = useHero('home');

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
      className="min-h-screen flex flex-col justify-center items-center relative px-4 overflow-hidden bg-[#f5f6ff]"
    >
      {/* Mesh Gradients / Tonal Layers */}
      <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] translate-x-1/2 translate-y-1/2 w-[50vw] h-[50vw] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Scaffold minimal lines */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.15]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>

      <div className="text-center relative z-20 w-full max-w-7xl mx-auto">
        <p className="text-xs md:text-sm uppercase tracking-[0.15em] text-[#4f5d6d] font-bold mb-6">
          {isLoading ? <span className="inline-block w-40 h-4 bg-[#e1e8fc] animate-pulse rounded"></span> : (hero?.badge_text || profile?.tagline || 'Based in Islamabad')}
        </p>
        
        <div className="hero-3d-wrapper" style={{ perspective: '800px' }}>
          <h1 className="hero-title font-display font-bold text-[22vw] md:text-[18vw] leading-[0.85] tracking-tighter" style={{ transformStyle: 'preserve-3d', letterSpacing: '-0.04em' }}>
            <div className="overflow-hidden">
              <span className="block hero-3d-text text-[#292f3b] filter drop-shadow-[0_20px_40px_rgba(104,66,189,0.08)]">
                {isLoading ? <span className="inline-block w-64 h-32 md:h-48 bg-[#e1e8fc] animate-pulse rounded-3xl mt-4"></span> : (hero?.heading || (profile?.name ? profile.name.split(' ').map((w: string) => w[0]).join('').toUpperCase() : 'MHK'))}
              </span>
            </div>
            <span className="sr-only">{hero?.heading || 'Muddasir Haider Khan - Top Freelancer in Pakistan'}</span>
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 overflow-hidden">
          <div className="hero-tagline-pill bg-white/90 border-0 shadow-[0_20px_40px_rgba(104,66,189,0.06)] px-8 py-3 rounded-full backdrop-blur-md">
            <h2 className="text-sm md:text-lg text-[#4f5d6d] font-medium">
              {isLoading ? <span className="inline-block w-32 h-4 bg-[#e1e8fc] animate-pulse rounded"></span> : (hero?.subheading || profile?.title || 'Top AI Engineer')}
            </h2>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#a7adbd]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#a7adbd] to-transparent scroll-line"></div>
      </div>
    </section>
  );
}
