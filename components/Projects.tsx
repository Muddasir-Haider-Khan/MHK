'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Github } from 'lucide-react';
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { projects: fetchedProjects } = useProjects();

  const projects = Array.isArray(fetchedProjects) ? fetchedProjects : (Array.isArray(initialProjects) ? initialProjects : []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.accordion-container > div', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <section id="work" className="pt-8 pb-16 bg-[#f5f6ff] relative z-10 scroll-mt-28" ref={containerRef}>
      <div className="absolute top-[10%] left-0 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 px-12 z-0 opacity-[0.05]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>

      <div className="px-4 md:px-12 mb-2 max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-7xl font-display font-bold text-[#292f3b] tracking-tighter leading-[1.1]" style={{ letterSpacing: '-0.04em' }}>
          Selected <span className="text-brand-purple italic">Works</span>
        </h2>
      </div>
      
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-12 relative z-10 flex flex-col lg:flex-row h-[120vh] lg:h-[75vh] gap-3 md:gap-4 pb-8 items-stretch accordion-container overflow-hidden mt-2">
        {projects.map((proj: Project) => {
          const isActive = (activeProject || projects[0])?.id === proj.id;
          
          return (
            <div 
              key={proj.id}
              onMouseEnter={() => setActiveProject(proj)}
              onClick={() => setSelectedProject(proj)}
              className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer shadow-[0_20px_40px_rgba(104,66,189,0.06)] bg-[#1a1f2b] border border-[#a7adbd]/5`}
              style={{ flex: isActive ? 5 : 1 }}
            >
              {/* Image */}
              <img 
                src={proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'}
                alt={proj.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ease-out ${isActive ? 'scale-100 outline-none' : 'scale-110 blur-[1px] grayscale opacity-40 group-hover:opacity-60'}`}
              />
              
              {/* Overlays */}
              <div className={`absolute inset-0 bg-gradient-to-t from-[#1a1f2b] via-[#1a1f2b]/40 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-90' : 'opacity-40'}`}></div>
              
              {/* Active Content */}
              <div className={`absolute bottom-0 left-0 right-0 p-8 transition-all duration-700 flex flex-col justify-end w-full z-30 ${isActive ? 'opacity-100 delay-200 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                 <p className="text-brand-purple text-[10px] font-bold mb-2 uppercase tracking-[0.3em] font-mono">
                   {proj.technologies?.slice(0,3).join(" • ")}
                 </p>
                 <h3 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tighter mb-4 leading-tight">
                   {proj.title}
                 </h3>
                 <div className="flex justify-between items-end w-full gap-4">
                   <p className="text-white/60 max-w-sm hidden lg:block text-sm leading-relaxed">
                     {proj.description}
                   </p>
                   <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xl ml-auto text-brand-purple">
                     <ExternalLink className="w-5 h-5" />
                   </div>
                 </div>
              </div>

              {/* Inactive Label */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none z-20 ${isActive ? 'opacity-0 delay-0' : 'opacity-100 delay-300'}`}>
                 <h3 className="lg:-rotate-90 origin-center text-white font-display font-bold text-xs uppercase tracking-[0.4em] whitespace-nowrap group-hover:text-brand-purple transition-colors duration-500 opacity-40 group-hover:opacity-100">
                   {proj.title}
                 </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-[#0a0c10]/80 backdrop-blur-xl" onClick={() => setSelectedProject(null)} />
          
          <div className="relative bg-[#ffffff] shadow-2xl rounded-[2.5rem] max-w-5xl w-full max-h-full overflow-y-auto animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-6 right-6 z-20 text-[#4f5d6d] hover:text-[#292f3b] bg-white p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              className="w-full aspect-video object-cover" 
              src={selectedProject.image} 
              alt={selectedProject.title} 
            />
            <div className="p-8 md:p-16">
              <h3 className="text-4xl md:text-6xl font-display font-bold mb-4 text-[#292f3b]">{selectedProject.title}</h3>
              <p className="text-brand-purple text-xl mb-8 font-mono font-bold">{selectedProject.role}</p>
              <p className="text-[#4f5d6d] text-lg leading-relaxed mb-8">{selectedProject.long_description || selectedProject.description}</p>
              
              <div className="bg-[#f5f6ff] rounded-3xl p-8 mb-10">
                <p className="text-xs font-mono text-[#a7adbd] font-bold tracking-wider mb-3">OUTCOME</p>
                <p className="text-[#292f3b] font-medium text-lg leading-relaxed">{selectedProject.outcome}</p>
              </div>
              
              <div className="flex gap-4">
                {selectedProject.link && (
                  <a href={selectedProject.link} target="_blank" className="px-10 py-5 bg-brand-purple rounded-full text-white font-bold shadow-xl hover:scale-105 transition-transform">
                    Live Demo
                  </a>
                )}
                {selectedProject.github_link && (
                  <a href={selectedProject.github_link} target="_blank" className="px-10 py-5 bg-[#ffffff] border border-[#a7adbd]/20 rounded-full text-[#4f5d6d] font-bold hover:bg-brand-purple hover:text-white transition-all shadow-lg">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
