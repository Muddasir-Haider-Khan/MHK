'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Github, ArrowUpRight, Loader2 } from 'lucide-react';
import { useProjects } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export type Project = {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  image: string;
  technologies: string[];
  role?: string;
  outcome?: string;
  link?: string;
  github_link?: string;
  featured: number;
  sort_order: number;
};

export default function Projects({ initialProjects }: { initialProjects?: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects: fetchedProjects } = useProjects();

  const projects = useMemo(() => {
    if (Array.isArray(fetchedProjects) && fetchedProjects.length > 0) return fetchedProjects;
    if (Array.isArray(initialProjects) && initialProjects.length > 0) return initialProjects;
    return [];
  }, [fetchedProjects, initialProjects]);

  useEffect(() => {
    if (projects.length === 0) return;

    let ctx = gsap.context(() => {
      gsap.fromTo('.project-card', 
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: '.projects-grid',
            start: "top 95%",
            once: true,
          }
        }
      );

      const magnets = document.querySelectorAll('.magnetic-btn');
      magnets.forEach((btn) => {
        btn.addEventListener('mousemove', (e: any) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [projects]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  return (
    <section id="work" className="pt-32 pb-40 bg-transparent relative z-10 scroll-mt-28" ref={containerRef}>
      {/* Dynamic Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
      
      {/* Grid Header */}
      <div className="px-6 md:px-12 mb-20 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
           <span className="h-[1px] w-12 bg-brand-purple/40"></span>
           <p className="text-sm uppercase tracking-[0.4em] text-brand-purple font-bold font-mono">02 / Portfolio Showcase</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
           <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-[#1a1f2b] tracking-tighter leading-[0.85]" style={{ letterSpacing: '-0.05em' }}>
            Selected <br/><span className="text-brand-purple italic font-medium">Artifacts</span>
          </h2>
          <div className="max-w-md space-y-6">
            <p className="text-[#4f5d6d] text-xl leading-relaxed font-medium">
              High-performance digital products engineered at the intersection of <span className="text-[#1a1f2b] font-bold underline decoration-brand-purple/20 underline-offset-4">design & intelligence</span>.
            </p>
            <div className="flex gap-8 items-center pt-2">
               <div className="flex flex-col">
                  <span className="text-4xl font-display font-bold text-[#1a1f2b]">12+</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#a7adbd] font-bold">Deployments</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-4xl font-display font-bold text-[#1a1f2b]">99%</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#a7adbd] font-bold">Accuracy</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bento Grid - Stabilized Layout */}
      <div className="projects-grid max-w-[1440px] w-full mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 auto-rows-fr">
        {projects.length > 0 ? (
          projects.map((proj: Project, index: number) => {
            // Tier 1: Hero & Tall
            let gridClass = "md:col-span-4 min-h-[450px]";
            if (index === 0) gridClass = "md:col-span-8 md:row-span-2 min-h-[600px]";
            else if (index === 1) gridClass = "md:col-span-4 md:row-span-2 min-h-[600px]";
            // Tier 2: Medium
            else if (index === 2) gridClass = "md:col-span-6 min-h-[400px]";
            else if (index === 3) gridClass = "md:col-span-6 min-h-[400px]";
            // Tier 3: Supporting
            else gridClass = "md:col-span-4 min-h-[400px]";
            
            return (
              <div 
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className={`project-card translate-y-12 opacity-0 group relative overflow-hidden rounded-[3rem] bg-[#0d0f14] cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_100px_rgba(139,92,246,0.2)] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] border border-white/5 ${gridClass}`}
              >
                <img src={proj.image} alt={proj.title} className="absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ease-out group-hover:scale-105 group-hover:brightness-50" />
                
                {/* Enhanced mask for perfect readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/40 to-transparent opacity-90 transition-opacity duration-700" />
                
                <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end z-20">
                   <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {proj.technologies?.slice(0, 3).map(tech => (
                            <span key={tech} className="px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-bold text-white uppercase tracking-[0.3em]">{tech}</span>
                          ))}
                      </div>
                      <div className="flex items-end justify-between gap-6">
                          <div className="space-y-4">
                             <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tighter leading-[0.9] opacity-100">{proj.title}</h3>
                             <p className="text-white/40 text-sm font-medium line-clamp-2 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 hidden md:block">{proj.description}</p>
                          </div>
                          <div className="magnetic-btn w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xl text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform md:translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-700 scale-90 group-hover:scale-100">
                             <ArrowUpRight className="w-8 h-8" />
                          </div>
                      </div>
                   </div>
                </div>
                <div className="absolute top-10 right-10 text-white/10 font-display font-bold text-4xl group-hover:text-white/20 transition-colors">{(index + 1).toString().padStart(2, '0')}</div>
              </div>
            );
          })
        ) : null}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog">
          <div className="absolute inset-0 bg-[#0a0c10]/85 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setSelectedProject(null)} />
          <div className="relative bg-[#ffffff] shadow-[0_50px_100px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] text-[#1a1f2b]">
            <button onClick={() => setSelectedProject(null)} className="fixed top-8 right-8 z-[110] text-[#1a1f2b] bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl hover:rotate-90 transition-all border border-[#1a1f2b]/5"><X className="w-6 h-6" /></button>
            <div className="relative h-[50vh] min-h-[400px]">
                <img className="w-full h-full object-cover" src={selectedProject.image} alt={selectedProject.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent-to-black/20" />
                <div className="absolute bottom-12 left-12 right-12">
                   <h3 className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-tight drop-shadow-sm">{selectedProject.title}</h3>
                </div>
            </div>
            <div className="p-12 md:p-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-12">
                <p className="text-2xl text-[#4f5d6d] leading-relaxed font-medium">{selectedProject.long_description || selectedProject.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <p className="text-xs font-mono text-brand-purple font-bold tracking-[0.3em] uppercase underline decoration-2 underline-offset-8">THE CHALLENGE</p>
                      <p className="text-[#4f5d6d] text-lg leading-relaxed">{selectedProject.role || "Designing a solution that balances complex logic with intuitive UX."}</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-xs font-mono text-brand-purple font-bold tracking-[0.3em] uppercase underline decoration-2 underline-offset-8">THE OUTCOME</p>
                      <p className="text-[#4f5d6d] text-lg leading-relaxed">{selectedProject.outcome || "Delivered a high-performance system with seamless scalability."}</p>
                   </div>
                </div>
              </div>
              <div className="space-y-10">
                 <div className="bg-[#f5f6ff] rounded-[2.5rem] p-10 border border-[#1a1f2b]/5">
                    <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#a7adbd] mb-6 uppercase">STACK & TOOLS</p>
                    <div className="flex flex-wrap gap-3">{selectedProject.technologies?.map(tech => (
                      <span key={tech} className="px-4 py-2 bg-white rounded-full text-[10px] font-bold text-[#1a1f2b] shadow-sm border border-[#1a1f2b]/5">{tech}</span>
                    ))}</div>
                 </div>
                 <div className="flex flex-col gap-4">
                    {selectedProject.link && (<a href={selectedProject.link} target="_blank" className="w-full py-6 bg-[#1a1f2b] text-white rounded-full font-bold text-center hover:bg-brand-purple hover:scale-[1.02] transition-all shadow-xl">Explore Live Product</a>)}
                    {selectedProject.github_link && (<a href={selectedProject.github_link} target="_blank" className="w-full py-6 border-2 border-[#1a1f2b] text-[#1a1f2b] rounded-full font-bold text-center hover:bg-[#f5f6ff] transition-all">Review Code</a>)}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
