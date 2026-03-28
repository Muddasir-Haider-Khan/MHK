'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanSearch, Layers, Code2, Rocket, FolderCheck, Clock, Cpu } from 'lucide-react';
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
  const philosophyRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  const { profile } = useProfile();
  const { settings: fetchedSettings } = useSiteSettings();

  const philosophy = profile?.philosophy || initialPhilosophy;
  const settings = fetchedSettings || initialSettings || {};

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Process animation
      if (processRef.current) {
        ScrollTrigger.create({
          trigger: processRef.current,
          start: 'top 70%',
          onEnter: () => {
            gsap.fromTo('.process-step', 
              { opacity: 0, y: 50, scale: 0.9, rotation: -5 },
              { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1, stagger: 0.15, ease: "elastic.out(1, 0.8)" }
            );
            gsap.fromTo('.process-connector',
              { strokeDashoffset: 100 },
              { strokeDashoffset: 0, duration: 1.2, stagger: 0.25, delay: 0.6, ease: "power2.inOut" }
            );
          },
          once: true
        });
        
        // Tilt effect
        document.querySelectorAll('.process-step').forEach((card: any) => {
          card.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, {
              rotationY: x * 10,
              rotationX: -y * 10,
              transformPerspective: 800,
              duration: 0.4,
              ease: "power2.out"
            });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
          });
        });
      }

      // Philosophy animation
      if (philosophyRef.current) {
        ScrollTrigger.create({
          trigger: philosophyRef.current,
          start: 'top 60%',
          onEnter: () => {
            gsap.fromTo('.philosophy-text', 
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 1.8, ease: "power3.out" }
            );
          },
          once: true
        });
      }

      // Trust Counters animation
      if (trustRef.current) {
        ScrollTrigger.create({
          trigger: trustRef.current,
          start: 'top 70%',
          onEnter: () => {
            document.querySelectorAll('.trust-counter').forEach((counter: any, i) => {
              gsap.fromTo(counter, 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: "back.out(1.5)" }
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ========== 6. THINKING PROCESS ========== */}
      <section id="process" className="py-32 bg-[#ecf0ff] relative overflow-hidden" ref={processRef}>
        <div className="absolute top-1/3 right-0 w-[30vw] h-[30vw] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[20vw] h-[20vw] bg-blue-300/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Minimalist Grid Line Scaffold (Desktop) */}
        <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.08]">
           <div className="border-l border-[#a7adbd]"></div>
           <div className="border-l border-[#a7adbd]"></div>
           <div className="border-l border-[#a7adbd]"></div>
           <div className="border-l border-r border-[#a7adbd]"></div>
        </div>

        <div className="px-4 md:px-12 mb-20 max-w-7xl mx-auto relative z-10">
          <p className="text-sm uppercase tracking-widest text-[#4f5d6d] font-bold mb-8 font-mono">04 / Method</p>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
            How I <span className="text-brand-purple italic">Think</span>
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Animated connectors (desktop) */}
            <svg className="hidden md:block absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 z-0 opacity-40" preserveAspectRatio="none">
              <line x1="12.5%" y1="50%" x2="37.5%" y2="50%" stroke="url(#connector-grad)" strokeWidth="2" className="process-connector" strokeDasharray="100" strokeDashoffset="0" />
              <line x1="37.5%" y1="50%" x2="62.5%" y2="50%" stroke="url(#connector-grad)" strokeWidth="2" className="process-connector" strokeDasharray="100" strokeDashoffset="0" />
              <line x1="62.5%" y1="50%" x2="87.5%" y2="50%" stroke="url(#connector-grad)" strokeWidth="2" className="process-connector" strokeDasharray="100" strokeDashoffset="0" />
              <defs>
                <linearGradient id="connector-grad">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Premium Glassmorphic Cards */}
            <div className="process-step group relative p-8 md:p-10 rounded-[2.5rem] bg-[#ffffff]/60 saturate-150 backdrop-blur-3xl border border-[#ffffff] shadow-[0_8px_30px_rgba(104,66,189,0.04)] hover:shadow-[0_20px_60px_rgba(104,66,189,0.1)] transition-all duration-700 ease-[cubic-bezier(0.17,0.67,0.21,1)] hover:-translate-y-4 overflow-hidden">
              <span className="absolute -bottom-6 -right-6 text-[10rem] font-display font-black text-brand-purple/[0.03] group-hover:text-brand-purple/[0.08] transition-colors duration-700 pointer-events-none z-0 tracking-tighter">1</span>
              
              <div className="relative z-10 flex items-center justify-between mb-12">
                <div className="w-16 h-16 rounded-full bg-[#f5f6ff] group-hover:bg-brand-purple transition-all duration-500 flex items-center justify-center border border-[#e1e8fc] group-hover:border-transparent group-hover:scale-110 shadow-sm">
                   <ScanSearch className="w-7 h-7 text-[#a7adbd] group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="w-12 h-px bg-[#a7adbd]/30 group-hover:bg-brand-purple/50 transition-colors duration-500 hidden lg:block"></div>
              </div>

              <h3 className="text-2xl font-display font-bold text-[#292f3b] mb-4 relative z-10 tracking-tight">Problem</h3>
              <p className="text-[#4f5d6d] text-sm leading-relaxed relative z-10 font-medium">Deep dive into the core challenge. Understanding data, requirements, and hidden patterns.</p>
            </div>
            
            <div className="process-step group relative p-8 md:p-10 rounded-[2.5rem] bg-[#ffffff]/60 saturate-150 backdrop-blur-3xl border border-[#ffffff] shadow-[0_8px_30px_rgba(104,66,189,0.04)] hover:shadow-[0_20px_60px_rgba(104,66,189,0.1)] transition-all duration-700 ease-[cubic-bezier(0.17,0.67,0.21,1)] hover:-translate-y-4 overflow-hidden">
              <span className="absolute -bottom-6 -right-6 text-[10rem] font-display font-black text-brand-purple/[0.03] group-hover:text-brand-purple/[0.08] transition-colors duration-700 pointer-events-none z-0 tracking-tighter">2</span>
              
              <div className="relative z-10 flex items-center justify-between mb-12">
                <div className="w-16 h-16 rounded-full bg-[#f5f6ff] group-hover:bg-brand-purple transition-all duration-500 flex items-center justify-center border border-[#e1e8fc] group-hover:border-transparent group-hover:scale-110 shadow-sm">
                   <Layers className="w-7 h-7 text-[#a7adbd] group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="w-12 h-px bg-[#a7adbd]/30 group-hover:bg-brand-purple/50 transition-colors duration-500 hidden lg:block"></div>
              </div>

              <h3 className="text-2xl font-display font-bold text-[#292f3b] mb-4 relative z-10 tracking-tight">Architecture</h3>
              <p className="text-[#4f5d6d] text-sm leading-relaxed relative z-10 font-medium">Selecting the right models, tech stack, and designing for scalability from day one.</p>
            </div>
            
            <div className="process-step group relative p-8 md:p-10 rounded-[2.5rem] bg-[#ffffff]/60 saturate-150 backdrop-blur-3xl border border-[#ffffff] shadow-[0_8px_30px_rgba(104,66,189,0.04)] hover:shadow-[0_20px_60px_rgba(104,66,189,0.1)] transition-all duration-700 ease-[cubic-bezier(0.17,0.67,0.21,1)] hover:-translate-y-4 overflow-hidden">
              <span className="absolute -bottom-6 -right-6 text-[10rem] font-display font-black text-brand-purple/[0.03] group-hover:text-brand-purple/[0.08] transition-colors duration-700 pointer-events-none z-0 tracking-tighter">3</span>
              
              <div className="relative z-10 flex items-center justify-between mb-12">
                <div className="w-16 h-16 rounded-full bg-[#f5f6ff] group-hover:bg-brand-purple transition-all duration-500 flex items-center justify-center border border-[#e1e8fc] group-hover:border-transparent group-hover:scale-110 shadow-sm">
                   <Code2 className="w-7 h-7 text-[#a7adbd] group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="w-12 h-px bg-[#a7adbd]/30 group-hover:bg-brand-purple/50 transition-colors duration-500 hidden lg:block"></div>
              </div>

              <h3 className="text-2xl font-display font-bold text-[#292f3b] mb-4 relative z-10 tracking-tight">Build</h3>
              <p className="text-[#4f5d6d] text-sm leading-relaxed relative z-10 font-medium">Clean, efficient code. Blending backend logic with stunning frontend interactivity.</p>
            </div>
            
            <div className="process-step group relative p-8 md:p-10 rounded-[2.5rem] bg-[#ffffff]/60 saturate-150 backdrop-blur-3xl border border-[#ffffff] shadow-[0_8px_30px_rgba(104,66,189,0.04)] hover:shadow-[0_20px_60px_rgba(104,66,189,0.1)] transition-all duration-700 ease-[cubic-bezier(0.17,0.67,0.21,1)] hover:-translate-y-4 overflow-hidden">
              <span className="absolute -bottom-6 -right-6 text-[10rem] font-display font-black text-brand-purple/[0.03] group-hover:text-brand-purple/[0.08] transition-colors duration-700 pointer-events-none z-0 tracking-tighter">4</span>
              
              <div className="relative z-10 flex items-center justify-between mb-12">
                <div className="w-16 h-16 rounded-full bg-[#f5f6ff] group-hover:bg-brand-purple transition-all duration-500 flex items-center justify-center border border-[#e1e8fc] group-hover:border-transparent group-hover:scale-110 shadow-sm">
                   <Rocket className="w-7 h-7 text-[#a7adbd] group-hover:text-white transition-colors duration-500" />
                </div>
              </div>

              <h3 className="text-2xl font-display font-bold text-[#292f3b] mb-4 relative z-10 tracking-tight">Optimize</h3>
              <p className="text-[#4f5d6d] text-sm leading-relaxed relative z-10 font-medium">Performance tuning, testing, CI/CD pipelines, and real-world validation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 7. PERSONAL PHILOSOPHY ========== */}
      <section id="philosophy" className="py-40 bg-[#f5f6ff] flex items-center justify-center relative px-6 md:px-12" ref={philosophyRef}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"></div>
        <blockquote className="philosophy-text opacity-0 text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-display font-bold text-center leading-[1.1] max-w-5xl relative z-10 text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
          <span className="absolute -top-8 -left-4 md:-top-16 md:-left-12 text-[#292f3b]/5 text-8xl md:text-[12rem] pointer-events-none">"</span>
          <span>{philosophy || 'I build systems that run quietly for years.'}</span>
          <span className="absolute -bottom-16 -right-4 md:-bottom-32 md:-right-12 text-[#292f3b]/5 text-8xl md:text-[12rem] rotate-180 pointer-events-none">"</span>
        </blockquote>
      </section>

      <div className="w-full h-px bg-[#a7adbd] opacity-20 max-w-7xl mx-auto"></div>

      {/* ========== 8. TRUST SECTION ========== */}
      <section id="trust" className="py-40 bg-[#f5f6ff] relative overflow-hidden" ref={trustRef}>
        <div className="absolute top-1/4 left-0 w-[30vw] h-[30vw] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[25vw] h-[25vw] bg-blue-300/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
              Impact at a <span className="text-brand-purple italic">Glance</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-24 md:gap-8 w-full relative">
            
            {/* Massive Background Text Elements */}
            <div className="absolute inset-0 pointer-events-none flex justify-between items-center z-0 overflow-hidden hidden lg:flex">
              <span className="text-[18rem] font-display font-bold text-brand-purple/[0.02] -ml-20 tracking-tighter">25+</span>
              <span className="text-[18rem] font-display font-bold text-brand-purple/[0.02] tracking-tighter">04+</span>
              <span className="text-[18rem] font-display font-bold text-brand-purple/[0.02] -mr-20 tracking-tighter">40+</span>
            </div>

            <div className="trust-counter flex-1 flex flex-col items-center justify-center relative z-10 group w-full">
              <div className="w-full flex flex-col items-center justify-center py-10 border border-transparent hover:border-[#a7adbd]/20 rounded-[3rem] transition-all duration-700 hover:bg-[#ffffff]/50 backdrop-blur-xl hover:shadow-[0_20px_40px_rgba(104,66,189,0.04)]">
                <span className="counter-value text-7xl md:text-8xl lg:text-9xl font-display font-medium text-[#292f3b] tracking-tighter group-hover:text-brand-purple transition-colors duration-500 mb-6" data-target={settings?.projects_completed || "25"}>0</span>
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-[#4f5d6d]">Projects Delivered</p>
                <p className="text-[#a7adbd] text-xs mt-3 font-mono">Web / AI / SaaS</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-[#a7adbd]/30 to-transparent"></div>

            <div className="trust-counter flex-1 flex flex-col items-center justify-center relative z-10 group w-full">
              <div className="w-full flex flex-col items-center justify-center py-10 border border-transparent hover:border-[#a7adbd]/20 rounded-[3rem] transition-all duration-700 hover:bg-[#ffffff]/50 backdrop-blur-xl hover:shadow-[0_20px_40px_rgba(104,66,189,0.04)]">
                <span className="counter-value text-7xl md:text-8xl lg:text-9xl font-display font-medium text-[#292f3b] tracking-tighter group-hover:text-brand-purple transition-colors duration-500 mb-6" data-target={settings?.years_experience || "4"}>0</span>
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-[#4f5d6d]">Years Experience</p>
                <p className="text-[#a7adbd] text-xs mt-3 font-mono">Continuous Shipping</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-[#a7adbd]/30 to-transparent"></div>

            <div className="trust-counter flex-1 flex flex-col items-center justify-center relative z-10 group w-full">
              <div className="w-full flex flex-col items-center justify-center py-10 border border-transparent hover:border-[#a7adbd]/20 rounded-[3rem] transition-all duration-700 hover:bg-[#ffffff]/50 backdrop-blur-xl hover:shadow-[0_20px_40px_rgba(104,66,189,0.04)]">
                <span className="counter-value text-7xl md:text-8xl lg:text-9xl font-display font-medium text-[#292f3b] tracking-tighter group-hover:text-brand-purple transition-colors duration-500 mb-6" data-target={settings?.technologies_used || "40"}>0</span>
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-[#4f5d6d]">Core Tech</p>
                <p className="text-[#a7adbd] text-xs mt-3 font-mono">Mastered Stack</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
