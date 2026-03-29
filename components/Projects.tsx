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
  const { projects: fetchedProjects } = useProjects();

  const projects = useMemo(() => {
    if (Array.isArray(fetchedProjects) && fetchedProjects.length > 0) return fetchedProjects;
    if (Array.isArray(initialProjects) && initialProjects.length > 0) return initialProjects;
    return [];
  }, [fetchedProjects, initialProjects]);

  // Limit to max 5 projects for accordion
  const displayProjects = useMemo(() => projects.slice(0, 5), [projects]);

  return (
    <section id="work" className="pt-32 md:pt-48 pb-24 relative overflow-visible bg-transparent scroll-mt-28" ref={containerRef}>
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
      <div className="px-6 md:px-12 mb-12 md:mb-16 max-w-7xl mx-auto relative z-10 mt-8 md:mt-12">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-[#1a1f2b] tracking-tighter leading-tight" style={{ letterSpacing: '-0.02em' }}>
          Selected&nbsp;<span className="text-brand-purple">Artifacts</span>
        </h2>
      </div>

      {/* Split-Screen Single Frame Layout */}
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row h-auto lg:h-[55vh] min-h-[450px] gap-8 lg:gap-16 pb-16 items-center justify-between">
        
        {/* Left Column: Vertical List of Project Titles */}
        <div className="w-full lg:w-5/12 order-2 lg:order-1 flex flex-col justify-center gap-6 lg:gap-8">
          {displayProjects.map((proj: Project, index: number) => {
            const isActive = activeProject === index;
            return (
              <div 
                key={proj.id}
                onMouseEnter={() => setActiveProject(index)}
                onClick={() => {
                  if (activeProject === index) {
                    if (proj.link) window.open(proj.link, '_blank');
                  } else {
                    setActiveProject(index);
                  }
                }}
                className={`group flex items-center gap-4 md:gap-6 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'translate-x-2 lg:translate-x-6' : 'hover:translate-x-1 lg:hover:translate-x-2 opacity-60 hover:opacity-100'}`}
              >
                <div className={`text-xs md:text-sm font-mono tracking-[0.2em] font-bold transition-all duration-500 hidden sm:block ${isActive ? 'text-brand-purple shrink-0' : 'text-[#a7adbd]/50 shrink-0'}`}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight transition-all duration-700 leading-tight pr-4 ${isActive ? 'text-[#1a1f2b] scale-100' : 'text-[#1a1f2b]/30 scale-95 origin-left'}`}>
                  {proj.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Project Preview Window */}
        <div className="order-1 lg:order-2 w-full lg:w-6/12 lg:max-w-3xl relative h-[40vh] min-h-[380px] lg:h-full lg:min-h-[500px] rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-[#0a0c12] shadow-[0_20px_50px_rgba(26,31,43,0.15)] group">
          {displayProjects.map((proj: Project, index: number) => {
            const isActive = activeProject === index;
            const IconComponent = projectIcons[index % projectIcons.length];

            return (
              <div 
                key={proj.id} 
                className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'}`}
              >
                {/* Background Image */}
                <img 
                  src={proj.image} 
                  alt={proj.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                
                {/* Overlay to ensure readability */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12]/80 via-[#0a0c12]/20 to-transparent" />
                
                {/* Project Details Panel (Glassmorphic Card inside the frame) */}
                <div className={`absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 lg:inset-x-12 lg:bottom-10 p-5 md:p-6 lg:p-8 bg-[#0a0c12]/50 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl flex flex-col transition-all duration-700 delay-100 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-2xl ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <div className="flex items-center gap-4 mb-4 md:mb-5">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white tracking-tight drop-shadow-md">{proj.title}</h4>
                      <p className="text-[#a7adbd] text-[9px] lg:text-[10px] font-bold mt-1 uppercase tracking-[0.3em] font-mono">{proj.role || "Product Design"}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-lg line-clamp-2 md:mb-6 hidden md:block">
                    {proj.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto flex-wrap gap-4 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies?.slice(0, 3).map(tech => (
                        <span key={tech} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[9px] font-bold text-white uppercase tracking-[0.2em]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    {proj.link ? (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 mt-2 md:mt-0 group/link cursor-pointer">
                         <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em] hidden sm:block group-hover/link:text-white transition-colors duration-300">View Live</span>
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg text-[#1a1f2b] group-hover/link:scale-110 group-hover/link:bg-brand-purple group-hover/link:text-white transition-all duration-500">
                           <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                         </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 mt-2 md:mt-0 opacity-50 select-none">
                         <span className="text-white/50 text-[9px] font-bold uppercase tracking-[0.2em] hidden sm:block">In Development</span>
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-lg text-white">
                           <Code2 className="w-4 h-4 md:w-5 md:h-5" />
                         </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
