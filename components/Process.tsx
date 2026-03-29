'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanSearch, Layers, Code2, Rocket } from 'lucide-react';
import { useProfile, useSiteSettings } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function Process({ 
  philosophy: initialPhilosophy,
  settings: initialSettings
}: {
  philosophy?: string;
  settings?: Record<string, string>;
}) {
  const processRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  const { profile } = useProfile();
  const { settings: fetchedSettings } = useSiteSettings();

  const philosophy = profile?.philosophy || initialPhilosophy;
  const settings = fetchedSettings || initialSettings || {};

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Process animation - Cinematic Fade-up
      if (processRef.current) {
        ScrollTrigger.create({
          trigger: processRef.current,
          start: 'top 70%',
          onEnter: () => {
             // Connector lines draw animation
             gsap.fromTo('.process-connector',
              { strokeDashoffset: 100 },
              { strokeDashoffset: 0, duration: 2, stagger: 0.3, ease: "power2.inOut" }
            );

            gsap.fromTo('.process-step', 
              { opacity: 0, y: 50, scale: 0.98 },
              { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" }
            );
          },
          once: true
        });

        // Deep 3D Magnetic Hover
        document.querySelectorAll('.process-step').forEach((card: any) => {
          card.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotationY: x * 20,
              rotationX: -y * 20,
              transformPerspective: 1200,
              duration: 0.4,
              ease: "power2.out"
            });
            // Dynamic inner glow
            gsap.to(card.querySelector('.glare'), {
               x: x * 100,
               y: y * 100,
               opacity: 0.15,
               duration: 0.4 
            });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
            gsap.to(card.querySelector('.glare'), { opacity: 0, duration: 0.8 });
          });
        });
      }

      // Massive Typography Counters (Dark Mode)
      if (trustRef.current) {
        ScrollTrigger.create({
          trigger: trustRef.current,
          start: 'top 75%',
          onEnter: () => {
            document.querySelectorAll('.trust-counter').forEach((counter: any, i) => {
              gsap.fromTo(counter, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, delay: i * 0.15, ease: "expo.out" }
              );
            });

            document.querySelectorAll('.counter-value').forEach((el: any) => {
              const target = parseInt(el.dataset.target) || 0;
              const obj = { val: 0 };
              gsap.to(obj, {
                val: target,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = Math.round(obj.val) + '+';
                }
              });
            });
          },
          once: true
        });
      }
    }, [processRef, trustRef]);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ========== 6. THINKING PROCESS ========== */}
      <section id="process" className="pt-24 pb-32 bg-[#0a0c12] relative overflow-hidden" ref={processRef}>
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-brand-purple/10 rounded-full blur-[200px] pointer-events-none -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3"></div>

        <div className="px-6 md:px-12 mb-20 max-w-7xl mx-auto relative z-10 text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#a7adbd] font-semibold mb-4 text-brand-purple">Methodology</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-white tracking-tight">
            How I Think
          </h2>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Dark Glass Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative pb-16">
            
            {/* Desktop Connectors */}
            <svg className="hidden lg:block absolute top-[100px] left-[12.5%] w-[75%] h-4 z-0 opacity-40" preserveAspectRatio="none">
              <line x1="0%" y1="50%" x2="33.3%" y2="50%" stroke="url(#connector-grad-dark)" strokeWidth="2" className="process-connector" strokeDasharray="100" strokeDashoffset="0" />
              <line x1="33.3%" y1="50%" x2="66.6%" y2="50%" stroke="url(#connector-grad-dark)" strokeWidth="2" className="process-connector" strokeDasharray="100" strokeDashoffset="0" />
              <line x1="66.6%" y1="50%" x2="100%" y2="50%" stroke="url(#connector-grad-dark)" strokeWidth="2" className="process-connector" strokeDasharray="100" strokeDashoffset="0" />
              <defs>
                <linearGradient id="connector-grad-dark">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Card 1 */}
            <div className="process-step group flex flex-col p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden relative z-10">
              {/* Fake Glare Pointer */}
              <div className="glare absolute top-0 left-0 w-full h-full bg-gradient-radial from-brand-purple/20 to-transparent opacity-0 pointer-events-none rounded-[2rem] scale-150 transform-gpu"></div>

              <span className="text-[11px] font-mono tracking-widest text-brand-purple mb-8 uppercase font-semibold">Phase 01</span>
              
              <div className="mb-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-brand-purple/50 transition-colors flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                   <ScanSearch className="w-7 h-7 text-white group-hover:text-brand-purple transition-colors" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-purple">Discover</h3>
              <p className="text-[#a7adbd] text-[15px] leading-relaxed font-medium">
                Deep dive into your data, business requirements, and unearthing hidden architectural patterns.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="process-step group flex flex-col p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden relative z-10 lg:mt-8">
              <div className="glare absolute top-0 left-0 w-full h-full bg-gradient-radial from-brand-purple/20 to-transparent opacity-0 pointer-events-none rounded-[2rem] scale-150 transform-gpu"></div>

              <span className="text-[11px] font-mono tracking-widest text-brand-purple mb-8 uppercase font-semibold">Phase 02</span>
              
              <div className="mb-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-brand-purple/50 transition-colors flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                   <Layers className="w-7 h-7 text-white group-hover:text-brand-purple transition-colors" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-purple">Architect</h3>
              <p className="text-[#a7adbd] text-[15px] leading-relaxed font-medium">
                Drafting system design, structured data modeling, and laying robust, scalable foundational blocks.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="process-step group flex flex-col p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden relative z-10 lg:mt-16">
              <div className="glare absolute top-0 left-0 w-full h-full bg-gradient-radial from-brand-purple/20 to-transparent opacity-0 pointer-events-none rounded-[2rem] scale-150 transform-gpu"></div>

              <span className="text-[11px] font-mono tracking-widest text-brand-purple mb-8 uppercase font-semibold">Phase 03</span>
              
              <div className="mb-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-brand-purple/50 transition-colors flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                   <Code2 className="w-7 h-7 text-white group-hover:text-brand-purple transition-colors" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-purple">Engineer</h3>
              <p className="text-[#a7adbd] text-[15px] leading-relaxed font-medium">
                Executing clean, responsive, and highly optimized production-grade code with zero compromises.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="process-step group flex flex-col p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden relative z-10 lg:mt-24">
              <div className="glare absolute top-0 left-0 w-full h-full bg-gradient-radial from-brand-purple/20 to-transparent opacity-0 pointer-events-none rounded-[2rem] scale-150 transform-gpu"></div>

              <span className="text-[11px] font-mono tracking-widest text-brand-purple mb-8 uppercase font-semibold">Phase 04</span>
              
              <div className="mb-8 relative">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-brand-purple/50 transition-colors flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                   <Rocket className="w-7 h-7 text-white group-hover:text-brand-purple transition-colors" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-purple">Deploy</h3>
              <p className="text-[#a7adbd] text-[15px] leading-relaxed font-medium">
                Setting up seamless CI/CD pipelines, live deployment, and meticulous post-launch optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 8. IMPACT SECTION ========== */}
      <section id="trust" className="py-24 bg-[#0a0c12] relative overflow-hidden border-t border-white/5" ref={trustRef}>
        
        {/* Deep Gradient Void */}
        <div className="absolute top-0 right-1/4 w-[50vw] h-[50vw] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight">
              Impact at a Glance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">
            
            <div className="trust-counter flex flex-col items-center justify-center text-center group py-8 relative">
               <div className="relative overflow-hidden mb-4">
                 {/* Massive number in white with opacity */}
                 <span className="counter-value text-7xl md:text-8xl lg:text-9xl font-display font-semibold text-white opacity-90 tracking-tight group-hover:text-brand-purple transition-colors duration-700" data-target={settings?.projects_completed || "25"}>0</span>
               </div>
               <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold text-[#a7adbd] mb-2">Projects Delivered</p>
               <p className="text-white/30 text-sm hidden md:block">End-to-end execution</p>
               
               {/* Minimalist Dark Divider */}
               <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="trust-counter flex flex-col items-center justify-center text-center group py-8 relative">
               <div className="relative overflow-hidden mb-4">
                 <span className="counter-value text-7xl md:text-8xl lg:text-9xl font-display font-semibold text-white opacity-90 tracking-tight group-hover:text-brand-purple transition-colors duration-700" data-target={settings?.years_experience || "4"}>0</span>
               </div>
               <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold text-[#a7adbd] mb-2">Years Experience</p>
               <p className="text-white/30 text-sm hidden md:block">Continuous learning</p>

               {/* Minimalist Dark Divider */}
               <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="trust-counter flex flex-col items-center justify-center text-center group py-8">
               <div className="relative overflow-hidden mb-4">
                 <span className="counter-value text-7xl md:text-8xl lg:text-9xl font-display font-semibold text-white opacity-90 tracking-tight group-hover:text-brand-purple transition-colors duration-700" data-target={settings?.technologies_used || "40"}>0</span>
               </div>
               <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold text-[#a7adbd] mb-2">Core Tech</p>
               <p className="text-white/30 text-sm hidden md:block">Mastered stack</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
