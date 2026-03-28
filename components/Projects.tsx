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
  const { projects: fetchedProjects, isLoading } = useProjects();

  const projects = Array.isArray(fetchedProjects) ? fetchedProjects : (Array.isArray(initialProjects) ? initialProjects : []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animate project accordion items
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

  // Lock body scroll when modal is open + cleanup on unmount
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  // Close on Escape key
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
    <section id="work" className="py-32 bg-[#f5f6ff] relative z-10" ref={containerRef}>
      <div className="absolute top-[10%] left-0 w-[40vw] h-[40vw] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Minimalist Grid Line Scaffold (Desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.08]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>

      <div className="px-4 md:px-12 mb-24 flex justify-between items-end max-w-7xl mx-auto relative z-10">
        <div>
          <p className="text-sm uppercase tracking-widest text-[#4f5d6d] font-bold mb-8 font-mono">02 / Portfolio</p>
          <h2 className="text-6xl md:text-8xl font-display font-bold text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
            Selected<br/>Works
          </h2>
        </div>
      </div>
      
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-12 relative z-10 flex flex-col lg:flex-row h-[120vh] lg:h-[75vh] gap-3 md:gap-4 pb-24 items-stretch accordion-container overflow-hidden">
          {projects.map((proj: Project, index: number) => {
            const isActive = (activeProject || projects[0])?.id === proj.id;
            
            return (
              <div 
                key={proj.id}
                onMouseEnter={() => setActiveProject(proj)}
                onClick={() => setSelectedProject(proj)}
                className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer shadow-[0_20px_40px_rgba(104,66,189,0.08)] bg-[#1a1f2b]`}
                style={{ flex: isActive ? 10 : 1 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-[#f5f6ff] animate-pulse -z-10"></div>
                <img 
                  src={proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'}
                  alt={proj.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ease-out ${isActive ? 'scale-100 filter' : 'scale-110 filter blur-[2px] grayscale-[0.8]'}`}
                />
                
                {/* Dark Overlays */}
                <div className={`absolute inset-0 bg-[#292f3b] transition-opacity duration-700 ${isActive ? 'opacity-10' : 'opacity-60 group-hover:opacity-40'}`}></div>
                <div className={`absolute inset-0 bg-gradient-to-t from-[#1a1f2b] via-[#1a1f2b]/30 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-90' : 'opacity-80'}`}></div>
                
                {/* Content Container (Active) */}
                <div className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 transition-all duration-700 flex flex-col justify-end w-full whitespace-normal min-w-[300px] ${isActive ? 'opacity-100 delay-200 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                   <p className="text-white/80 text-xs md:text-sm font-medium mb-3 uppercase tracking-[0.2em] font-mono">
                     {proj.technologies?.slice(0,3).join(" • ")}
                   </p>
                   <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter mb-6 leading-none">
                     {proj.title}
                   </h3>
                   <div className="flex justify-between items-end w-full">
                     <p className="text-white/70 max-w-lg hidden lg:block text-lg line-clamp-2 leading-relaxed">
                       {proj.description}
                     </p>
                     <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-2xl ml-auto group-hover/btn:bg-white transition-colors duration-500 text-white">
                       <ExternalLink className="w-6 h-6" />
                     </div>
                   </div>
                </div>

                {/* Vertical Title (Inactive) */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-0 delay-0' : 'opacity-100 delay-300'}`}>
                   <h3 className="lg:-rotate-90 origin-center text-white font-display font-bold text-xl md:text-3xl uppercase tracking-widest whitespace-nowrap opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                     {proj.title}
                   </h3>
                </div>

              </div>
            );
          })}
        </div>

      {/* Project Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${selectedProject ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label={selectedProject ? `Project details: ${selectedProject.title}` : undefined}
      >
        <div 
          className="absolute inset-0 bg-[#ffffff]/80 backdrop-blur-md cursor-pointer" 
          onClick={() => setSelectedProject(null)}
        />
        
        {selectedProject && (
          <div className="relative bg-[#ffffff] shadow-[0_40px_80px_rgba(104,66,189,0.12)] rounded-3xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-transform duration-500 scale-100 border-0">
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-6 right-6 z-10 text-[#4f5d6d] hover:text-[#292f3b] bg-white/90 shadow p-3 rounded-full transition-colors backdrop-blur-sm"
              aria-label="Close project details"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              className="w-full aspect-[16/9] object-cover" 
              src={selectedProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'} 
              alt={selectedProject.title} 
            />
            <div className="p-8 md:p-16 relative">
              <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

              <h3 className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#292f3b] relative z-10">{selectedProject.title}</h3>
              <p className="text-brand-purple text-lg mb-8 font-mono font-bold relative z-10">{selectedProject.role}</p>
              <p className="text-[#4f5d6d] text-lg leading-relaxed mb-8 whitespace-pre-line relative z-10">{selectedProject.long_description || selectedProject.description}</p>
              
              <div className="bg-[#f5f6ff] rounded-2xl p-6 mb-8 relative z-10 shadow-[0_10px_20px_rgba(104,66,189,0.02)]">
                <p className="text-sm font-mono text-[#a7adbd] font-bold tracking-wider mb-2">Outcome</p>
                <p className="text-[#292f3b] font-medium leading-relaxed">{selectedProject.outcome}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                {selectedProject.technologies?.map(t => (
                  <span key={t} className="px-4 py-1.5 bg-[#d6e4f7] rounded-full text-[10px] text-[#455363] font-bold tracking-wider font-mono">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 relative z-10">
                {selectedProject.link && (
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 bg-brand-purple hover:bg-brand-purple/90 transition-colors rounded-full text-white font-bold text-sm shadow-[0_10px_20px_rgba(104,66,189,0.2)]">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {selectedProject.github_link && (
                  <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 bg-[#ffffff] shadow-[0_10px_20px_rgba(104,66,189,0.06)] hover:shadow-[0_10px_20px_rgba(104,66,189,0.12)] transition-shadow rounded-full text-[#4f5d6d] hover:text-brand-purple font-bold text-sm">
                    <Github className="w-4 h-4" /> Source
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
