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
      // Animate project list items
      gsap.from('.project-list-container > div', {
        opacity: 0,
        x: -40,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });
      
      // Animate image container
      gsap.from('.lg\\:col-span-7', {
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "power3.out",
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
      
        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 lg:gap-20 min-h-[60vh] pb-24 items-center">
          
          {/* Left Side: Editorial Project List */}
          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-10 w-full project-list-container">
            {projects.map((proj: Project, index: number) => {
              const isActive = (activeProject || projects[0])?.id === proj.id;
              
              return (
                <div 
                  key={proj.id}
                  onMouseEnter={() => setActiveProject(proj)}
                  onClick={() => setSelectedProject(proj)}
                  className={`group flex items-center gap-6 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.21,1)] ${isActive ? 'opacity-100 translate-x-4' : 'opacity-30 hover:opacity-60'}`}
                >
                  <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#a7adbd] hidden sm:block">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#292f3b] whitespace-nowrap overflow-hidden text-ellipsis transition-colors hover:text-brand-purple">
                    {proj.title}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Right Side: Dynamic Cinematic Preview */}
          <div 
            className="lg:col-span-7 relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(104,66,189,0.15)] group cursor-pointer" 
            onClick={() => { if(activeProject || projects[0]) setSelectedProject(activeProject || projects[0]) }}
          >
            {projects.map((proj: Project) => {
              const isActive = (activeProject || projects[0])?.id === proj.id;
              return (
                <div 
                  key={`img-${proj.id}`}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.17,0.67,0.21,1)] ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <div className="absolute inset-0 bg-[#f5f6ff] animate-pulse -z-10"></div>
                  <img 
                    src={proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'}
                    alt={proj.title}
                    className={`w-full h-full object-cover transition-all duration-[2s] ease-out ${isActive ? 'scale-100 group-hover:scale-105 filter' : 'scale-110 filter blur-sm grayscale'}`}
                  />
                </div>
              );
            })}
            
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#292f3b]/80 via-transparent to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Hover Reveal Meta Data */}
            <div className="absolute bottom-10 left-10 right-10 z-30 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0 pointer-events-none">
              <div>
                <p className="text-white/90 text-sm font-medium mb-3 uppercase tracking-widest font-mono">
                  {(activeProject || projects[0])?.technologies?.slice(0,3).join(" • ")}
                </p>
                <span className="text-white font-display text-2xl font-bold tracking-tight">Click To Explore</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

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
