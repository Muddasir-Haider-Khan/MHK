'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHero } from '@/hooks/useContent';

export default function Hero({ profile }: { profile?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hero, isLoading } = useHero('home');

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Cinematic Blur Reveal for Typography
      gsap.fromTo(
        ".hero-title-blur",
        { y: 40, opacity: 0, filter: 'blur(20px)', scale: 0.95 },
        { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2.2, ease: "power3.out", stagger: 0.2 }
      );
      
      // Secondary pill reveal
      gsap.fromTo(
        ".hero-tagline-pill",
        { y: 30, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, delay: 0.8, ease: "power3.out" }
      );

      // Ambient Mesh breathing
      gsap.fromTo(
        ".hero-mesh",
        { scale: 0.8, opacity: 0 },
        { scale: 1.1, opacity: 1, duration: 4, ease: "power2.out" }
      );
      
      // Continuous ambient floating
      gsap.to(".hero-mesh-1", {
        y: "40px", x: "-30px", rotation: 5, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(".hero-mesh-2", {
        y: "-50px", x: "40px", rotation: -5, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center items-center relative px-4 overflow-hidden bg-[#f5f6ff]"
    >
      {/* Mesh Gradients / Tonal Layers */}
      <div className="hero-mesh hero-mesh-1 absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[70vw] lg:w-[50vw] h-[70vw] lg:h-[50vw] bg-brand-purple/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="hero-mesh hero-mesh-2 absolute bottom-[10%] right-[10%] translate-x-1/2 translate-y-1/2 w-[60vw] lg:w-[40vw] h-[60vw] lg:h-[40vw] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Scaffold minimal lines */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.08]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>

      <div className="text-center relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center">
        <p className="hero-title-blur text-xs md:text-sm uppercase tracking-[0.2em] text-[#4f5d6d] font-bold mb-8">
          {isLoading ? <span className="inline-block w-40 h-4 bg-[#e1e8fc] animate-pulse rounded"></span> : (hero?.badge_text || profile?.tagline || 'Based in Islamabad')}
        </p>
        
        <h1 className="hero-title-blur font-display font-medium text-[20vw] md:text-[16vw] lg:text-[14vw] leading-[0.85] tracking-tighter text-[#292f3b]" style={{ letterSpacing: '-0.04em' }}>
          {isLoading ? (
            <span className="inline-block w-64 h-32 md:h-48 bg-[#e1e8fc] animate-pulse rounded-3xl"></span>
          ) : (
            hero?.heading || (profile?.name ? profile.name.split(' ').map((w: string) => w[0]).join('').toUpperCase() : 'MHK')
          )}
          <span className="sr-only">{hero?.heading || 'Muddasir Haider Khan - Top Freelancer in Pakistan'}</span>
        </h1>
        
        <div className="hero-tagline-pill mt-12 bg-[#ffffff]/60 backdrop-blur-2xl saturate-200 border border-[#ffffff] shadow-[0_20px_40px_rgba(104,66,189,0.06)] px-10 py-4 items-center justify-center rounded-full hover:scale-105 transition-transform duration-500 cursor-pointer">
          <h2 className="text-sm md:text-lg text-[#292f3b] font-bold tracking-tight">
            {isLoading ? <span className="inline-block w-32 h-4 bg-[#e1e8fc] animate-pulse rounded"></span> : (hero?.subheading || profile?.title || 'Top AI Engineer')}
          </h2>
        </div>
      </div>

    </section>
  );
}
