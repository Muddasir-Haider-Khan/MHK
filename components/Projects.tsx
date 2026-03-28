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
  const { projects: fetchedProjects, isLoading } = useProjects();

  const projects = Array.isArray(fetchedProjects) ? fetchedProjects : (Array.isArray(initialProjects) ? initialProjects : []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray('.project-card').forEach((card: any) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
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
      
      <div className="space-y-40 px-4 md:px-12 max-w-7xl mx-auto relative z-10">
        {projects.map((proj: Project, i: number) => {
          const isOdd = i % 2 !== 0;
          return (
            <div key={proj.id} className="project-card group grid md:grid-cols-2 gap-12 items-center">
              <div 
                onClick={() => setSelectedProject(proj)}
                className={`relative overflow-hidden aspect-[4/3] cursor-pointer project-image-container rounded-3xl shadow-[0_20px_40px_rgba(104,66,189,0.06)] hover:shadow-[0_20px_40px_rgba(104,66,189,0.12)] transition-shadow ${isOdd ? 'order-2' : 'order-1'}`}
              >
                <img 
                  src={proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'}
                  alt={proj.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <span className="text-sm font-mono text-[#4f5d6d] font-bold tracking-wider">Click to explore →</span>
                </div>
              </div>
              <div className={`${isOdd ? 'order-1 md:text-right md:pr-12' : 'order-2 md:pl-12'}`}>
                <h3 
                  onClick={() => setSelectedProject(proj)}
                  className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#292f3b] group-hover:text-brand-purple transition-colors cursor-pointer"
                >
                  {proj.title}
                </h3>
                <p className={`text-[#4f5d6d] text-lg font-medium mb-8 max-w-md ${isOdd ? 'ml-auto' : ''}`}>{proj.description}</p>
                <div className={`flex flex-wrap gap-2 ${isOdd ? 'justify-end' : ''}`}>
                  {proj.technologies?.map(t => (
                    <span key={t} className="px-4 py-1.5 bg-[#d6e4f7] rounded-full text-[10px] text-[#455363] font-bold tracking-wider font-mono">
                      {t}
                    </span>
                  ))}
                </div>
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
