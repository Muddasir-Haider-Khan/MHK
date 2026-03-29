'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Github, ArrowUpRight, Brain, Cloud, Shield, BookOpen, Layers, Code2 } from 'lucide-react';
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

const projectIcons = [Brain, Cloud, Shield, BookOpen, Layers, Code2, Brain, Cloud];

export default function Projects({ initialProjects }: { initialProjects?: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects: fetchedProjects } = useProjects();

  const projects = useMemo(() => {
    if (Array.isArray(fetchedProjects) && fetchedProjects.length > 0) return fetchedProjects;
    if (Array.isArray(initialProjects) && initialProjects.length > 0) return initialProjects;
    return [];
  }, [fetchedProjects, initialProjects]);

  // Limit to max 5 projects for accordion
  const displayProjects = useMemo(() => projects.slice(0, 5), [projects]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  useEffect(() => {
    if (displayProjects.length === 0) return;
    let ctx = gsap.context(() => {
      gsap.from('.projects-accordion-container > div', {
        opacity: 0,
        y: 0,
        scale: 0.98,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [displayProjects]);

  return (
    <section id="work" className="pt-24 pb-16 relative overflow-hidden bg-transparent scroll-mt-28" ref={containerRef}>
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

      {/* Grid Lines (same as Skills) */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 px-12 z-0 opacity-[0.05]">
        <div className="border-l border-[#a7adbd]"></div>
        <div className="border-l border-[#a7adbd]"></div>
        <div className="border-l border-[#a7adbd]"></div>
        <div className="border-l border-r border-[#a7adbd]"></div>
      </div>


      {/* Section Header */}
      <div className="px-6 md:px-12 mb-16 max-w-7xl mx-auto relative z-10">
        <h2 className="text-mobile-title md:text-8xl font-display font-bold text-[#1a1f2b] tracking-tighter leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
          Selected <span className="text-brand-purple italic">Artifacts</span>
        </h2>
      </div>

      {/* Accordion Layout — Single Frame */}
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-12 relative z-10 flex flex-col lg:flex-row h-[120vh] lg:h-[70vh] gap-4 md:gap-5 pb-8 items-stretch projects-accordion-container overflow-hidden">
        {displayProjects.map((proj: Project, index: number) => {
          const isActive = activeProject === index;
          const IconComponent = projectIcons[index % projectIcons.length];

          return (
            <div
              key={proj.id}
              onMouseEnter={() => setActiveProject(index)}
              onClick={() => setSelectedProject(proj)}
              className="group relative overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer shadow-[0_20px_40px_rgba(104,66,189,0.06)] bg-[#0d0f14] min-w-[70px] lg:min-w-[80px]"
              style={{ flex: isActive ? 10 : 1 }}
            >
              {/* Project Image Background */}
              <img 
                src={proj.image} 
                alt={proj.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-out ${isActive ? 'opacity-60 scale-105' : 'opacity-20 scale-100'}`}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/60 to-[#0a0c12]/30" />

              {/* Active Content - Shows when expanded */}
              <div className={`absolute inset-0 p-8 md:p-12 flex flex-col transition-all duration-700 ${isActive ? 'opacity-100 delay-300 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                {/* Top: Number + Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 bg-brand-purple/15 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    <IconComponent className="w-7 h-7 text-brand-purple" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-tight">{proj.title}</h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm line-clamp-2">{proj.description}</p>
                </div>

                {/* Tech Stack */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.technologies?.slice(0, 5).map(tech => (
                      <span key={tech} className="px-3 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-bold text-white/70 uppercase tracking-[0.2em]">{tech}</span>
                    ))}
                  </div>
                  
                  {/* Role & Outcome */}
                  {proj.role && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono text-brand-purple font-bold tracking-[0.3em] uppercase">Role</p>
                      <p className="text-white/50 text-xs leading-relaxed">{proj.role}</p>
                    </div>
                  )}
                  {proj.outcome && (
                    <div className="space-y-2 mt-3">
                      <p className="text-[10px] font-mono text-brand-purple font-bold tracking-[0.3em] uppercase">Outcome</p>
                      <p className="text-white/50 text-xs leading-relaxed">{proj.outcome}</p>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xl text-brand-purple hover:bg-brand-purple hover:text-white transition-all duration-500 group-hover:scale-110">
                    <ArrowUpRight className="w-7 h-7" />
                  </div>
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">View Case Study</span>
                </div>
              </div>

              {/* Collapsed State - Shows when panel is narrow */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-0 delay-0' : 'opacity-100 delay-300'}`}>
                <div className="lg:-rotate-90 origin-center flex flex-col items-center gap-4">
                  <span className="text-white/20 font-display font-bold text-2xl">{(index + 1).toString().padStart(2, '0')}</span>
                  <IconComponent className="w-5 h-5 text-brand-purple/40 group-hover:text-brand-purple transition-colors" />
                  <h3 className="text-white/20 font-display font-bold text-[11px] md:text-xs uppercase tracking-[0.5em] whitespace-nowrap group-hover:text-brand-purple/60 transition-colors">
                    {proj.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal (preserved from original) */}
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
