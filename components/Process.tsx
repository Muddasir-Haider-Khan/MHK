'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanSearch, Layers, Code2, Rocket, FolderCheck, Clock, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Process({ 
  philosophy,
  settings
}: {
  philosophy: string;
  settings: Record<string, string>;
}) {
  const processRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

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
      <section id="process" className="py-32 bg-[#080808] relative overflow-hidden" ref={processRef}>
        <div className="absolute top-1/3 right-0 w-[30vw] h-[30vw] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[20vw] h-[20vw] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="px-4 md:px-12 mb-20 max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-mono">04 / Method</p>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white">How I <span className="gradient-text-animated italic">Think</span></h2>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Animated connectors (desktop) */}
            <svg className="hidden md:block absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 z-0" preserveAspectRatio="none">
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
            
            {/* Cards */}
            <div className="process-step glass-card bg-white/5 border border-white/10 relative z-10 p-8 rounded-3xl group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6">
                <ScanSearch className="w-6 h-6 text-brand-purple" />
              </div>
              <span className="text-7xl font-display font-bold text-white/[0.03] absolute top-4 right-6 pointer-events-none">01</span>
              <h3 className="text-xl font-display font-bold mb-3 text-white relative z-10">Problem</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">Deep dive into the core challenge. Understanding data, requirements, and hidden patterns.</p>
            </div>
            
            <div className="process-step glass-card bg-white/5 border border-white/10 relative z-10 p-8 rounded-3xl group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-brand-purple" />
              </div>
              <span className="text-7xl font-display font-bold text-white/[0.03] absolute top-4 right-6 pointer-events-none">02</span>
              <h3 className="text-xl font-display font-bold mb-3 text-white relative z-10">Architecture</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">Selecting the right models, tech stack, and designing for scalability from day one.</p>
            </div>
            
            <div className="process-step glass-card bg-white/5 border border-white/10 relative z-10 p-8 rounded-3xl group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-brand-purple" />
              </div>
              <span className="text-7xl font-display font-bold text-white/[0.03] absolute top-4 right-6 pointer-events-none">03</span>
              <h3 className="text-xl font-display font-bold mb-3 text-white relative z-10">Build</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">Clean, efficient code. Blending backend logic with stunning frontend interactivity.</p>
            </div>
            
            <div className="process-step glass-card bg-white/5 border border-white/10 relative z-10 p-8 rounded-3xl group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-brand-purple" />
              </div>
              <span className="text-7xl font-display font-bold text-white/[0.03] absolute top-4 right-6 pointer-events-none">04</span>
              <h3 className="text-xl font-display font-bold mb-3 text-white relative z-10">Optimize</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">Performance tuning, testing, CI/CD pipelines, and real-world validation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 7. PERSONAL PHILOSOPHY ========== */}
      <section id="philosophy" className="min-h-[80vh] flex items-center justify-center relative px-4" ref={philosophyRef}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
        <blockquote className="philosophy-text opacity-0 text-4xl md:text-7xl lg:text-8xl font-display font-bold text-center leading-[1.1] max-w-5xl relative z-10 text-white">
          <span className="text-white/10">"</span>
          <span>{philosophy || 'I build systems that run quietly for years.'}</span>
          <span className="text-white/10">"</span>
        </blockquote>
      </section>

      <div className="w-full h-px bg-white/10 max-w-7xl mx-auto"></div>

      {/* ========== 8. TRUST SECTION ========== */}
      <section id="trust" className="py-40 relative overflow-hidden" ref={trustRef}>
        <div className="absolute top-1/4 left-0 w-[30vw] h-[30vw] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[25vw] h-[25vw] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="text-center mb-20 text-white">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-mono">Numbers That Speak</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold">Impact at a <span className="gradient-text-animated italic">Glance</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="trust-counter glass-card p-8 rounded-3xl bg-white/5 border border-white/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 mx-auto flex items-center justify-center mb-6 relative z-10">
                <FolderCheck className="w-8 h-8 text-brand-purple" />
              </div>
              <span className="counter-value text-5xl font-display font-bold text-white relative z-10 block mb-2" data-target={settings?.projects_completed || "25"}>0</span>
              <p className="text-white font-medium relative z-10">Projects Completed</p>
              <p className="text-gray-500 text-xs mt-2 relative z-10">Web apps, APIs & AI systems</p>
            </div>

            <div className="trust-counter glass-card p-8 rounded-3xl bg-white/5 border border-white/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 mx-auto flex items-center justify-center mb-6 relative z-10">
                <Clock className="w-8 h-8 text-brand-purple" />
              </div>
              <span className="counter-value text-5xl font-display font-bold text-white relative z-10 block mb-2" data-target={settings?.years_experience || "4"}>0</span>
              <p className="text-white font-medium relative z-10">Years Experience</p>
              <p className="text-gray-500 text-xs mt-2 relative z-10">Continuous learning & shipping</p>
            </div>

            <div className="trust-counter glass-card p-8 rounded-3xl bg-white/5 border border-white/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 mx-auto flex items-center justify-center mb-6 relative z-10">
                <Cpu className="w-8 h-8 text-brand-purple" />
              </div>
              <span className="counter-value text-5xl font-display font-bold text-white relative z-10 block mb-2" data-target={settings?.technologies_used || "40"}>0</span>
              <p className="text-white font-medium relative z-10">Technologies Mastered</p>
              <p className="text-gray-500 text-xs mt-2 relative z-10">Frontend, Backend & DevOps</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
