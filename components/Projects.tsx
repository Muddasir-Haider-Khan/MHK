'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

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

export default function Projects({ initialProjects }: { initialProjects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
  }, [initialProjects]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  return (
    <section id="work" className="py-32 bg-[#080808] relative z-10" ref={containerRef}>
      <div className="px-4 md:px-12 mb-24 flex justify-between items-end max-w-7xl mx-auto">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-mono">02 / Portfolio</p>
          <h2 className="text-6xl md:text-8xl font-display font-bold text-white">Selected<br/>Works</h2>
        </div>
      </div>
      
      <div className="space-y-40 px-4 md:px-12 max-w-7xl mx-auto">
        {initialProjects.map((proj, i) => {
          const isOdd = i % 2 !== 0;
          return (
            <div key={proj.id} className="project-card group grid md:grid-cols-2 gap-12 items-center">
              <div 
                onClick={() => setSelectedProject(proj)}
                className={`relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer project-image-container border border-white/5 ${isOdd ? 'order-2' : 'order-2 md:order-1'}`}
              >
                <img 
                  src={proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'}
                  alt={proj.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-sm font-mono text-white/80">Click to explore →</span>
                </div>
              </div>
              <div className={`${isOdd ? 'order-1 md:text-right' : 'order-1 md:order-2'}`}>
                <h3 
                  onClick={() => setSelectedProject(proj)}
                  className="text-4xl md:text-5xl font-display font-bold mb-4 text-white group-hover:text-brand-purple transition-colors cursor-pointer"
                >
                  {proj.title}
                </h3>
                <p className={`text-gray-400 mb-6 max-w-md ${isOdd ? 'ml-auto' : ''}`}>{proj.description}</p>
                <div className={`flex flex-wrap gap-2 ${isOdd ? 'justify-end' : ''}`}>
                  {proj.technologies?.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-brand-purple font-mono">
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
      >
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
          onClick={() => setSelectedProject(null)}
        />
        
        {selectedProject && (
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto p-8 md:p-12 transform transition-transform duration-500 scale-100">
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              className="w-full aspect-video object-cover rounded-xl mb-8 border border-white/5" 
              src={selectedProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070'} 
              alt={selectedProject.title} 
            />
            <h3 className="text-3xl font-display font-bold mb-2 text-white">{selectedProject.title}</h3>
            <p className="text-brand-purple text-sm mb-6 font-mono">{selectedProject.role}</p>
            <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-line">{selectedProject.long_description || selectedProject.description}</p>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-sm font-mono text-gray-500 mb-1">Outcome</p>
              <p className="text-white">{selectedProject.outcome}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedProject.technologies?.map(t => (
                <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-brand-purple font-mono">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {selectedProject.link && (
                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-brand-purple hover:bg-brand-accent transition-colors rounded-full text-white font-bold text-sm">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {selectedProject.github_link && (
                <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-white font-bold text-sm">
                  <Github className="w-4 h-4" /> Source
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
