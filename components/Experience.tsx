'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperience, useEducation } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export type ExperienceItem = {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  technologies: string[];
  current: number;
  sort_order: number;
};

export type EducationItem = {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  description: string;
  sort_order: number;
};

type TimelineItemProps = {
  id: number;
  type: 'experience' | 'education';
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  current?: number;
  technologies?: string[];
  sort_order: number;
};

export default function Experience({ 
  experience: initialExperience, 
  education: initialEducation 
}: { 
  experience?: ExperienceItem[]; 
  education?: EducationItem[]; 
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { experience: fetchedExperience } = useExperience();
  const { education: fetchedEducation } = useEducation();

  const experience = Array.isArray(fetchedExperience) && fetchedExperience.length > 0 ? fetchedExperience : (Array.isArray(initialExperience) ? initialExperience : []);
  const education = Array.isArray(fetchedEducation) && fetchedEducation.length > 0 ? fetchedEducation : (Array.isArray(initialEducation) ? initialEducation : []);

  const timelineItems: TimelineItemProps[] = [
    ...experience.map((e: any) => ({ 
      ...e, 
      type: 'experience' as const,
      company: e.company,
      position: e.role
    })),
    ...education.map((e: any) => ({
      ...e,
      type: 'education' as const,
      company: e.institution,
      position: `${e.degree}${e.field_of_study ? ' in ' + e.field_of_study : ''}`
    }))
  ].sort((a: any, b: any) => a.sort_order - b.sort_order);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Cinematic upward entrance
      gsap.utils.toArray('.journey-card').forEach((item: any) => {
        gsap.from(item, {
          opacity: 0,
          y: 40,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
      
      // Animate sticky title natively
      gsap.from('.journey-title', {
        opacity: 0,
        x: -30,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.journey-title',
          start: 'top 80%',
          toggleActions: "play none none reverse"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [timelineItems]);

  return (
    <section id="experience" className="pt-24 md:pt-32 pb-16 relative bg-[#0a0c12] scroll-mt-28 overflow-hidden" ref={containerRef}>
      {/* Cinematic Glowing Background Aura */}
      <div className="absolute top-1/4 left-[-10%] w-[50vw] h-[50vw] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* Left Column: Asymmetrical Sticky Layout */}
        <div className="w-full lg:w-4/12 relative">
           <div className="sticky top-40 journey-title">
             <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-brand-purple font-semibold mb-4 flex items-center gap-3">
               <span className="w-6 h-px bg-brand-purple/50 hidden md:block"></span>
               03 / Journey
             </p>
             <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-white tracking-tight leading-[1.05]">
               The Path<br/>
               <span className="text-[#a7adbd]">So Far</span>
             </h2>
             <p className="text-[#a7adbd] mt-6 text-[15px] max-w-sm font-medium leading-relaxed">
               A detailed chronology of my technical evolution, engineering roles, and academic foundation.
             </p>
           </div>
        </div>

        {/* Right Column: Professional Journey Cards */}
        <div className="w-full lg:w-8/12 flex flex-col gap-16 lg:mt-32 pb-12">
          {timelineItems.map((item, i) => {
            const uid = `${item.type}-${item.id}`;
            let parsedDescription = [];
            
            // Parse descriptions array if necessary
            try {
              if (item.description.startsWith('[')) {
                parsedDescription = JSON.parse(item.description);
              } else {
                parsedDescription = [item.description];
              }
            } catch (e) {
              parsedDescription = [item.description];
            }
            
            return (
              <div key={uid} className="journey-card group relative pl-8 md:pl-12 border-l border-white/10 hover:border-brand-purple transition-colors duration-700 py-1">
                
                {/* Visual Glowing Ring */}
                <div className="absolute left-[-5px] top-6 w-2 h-2 rounded-full bg-[#0a0c12] border-[2px] border-white/20 group-hover:border-brand-purple group-hover:bg-brand-purple group-hover:shadow-[0_0_15px_rgba(104,66,189,0.8)] transition-all duration-500 shadow-[0_0_0_6px_#0a0c12]"></div>
                
                {/* Year Badge & Type */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <span className="text-[11px] md:text-xs font-mono tracking-widest font-semibold text-white/80 bg-white/[0.03] px-4 py-1.5 rounded-full w-max border border-white/10 transition-colors group-hover:border-brand-purple/30 group-hover:bg-brand-purple/5">
                    {item.start_date} — {item.current ? 'Present' : item.end_date}
                  </span>
                  {item.type === 'education' && (
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Education</span>
                  )}
                </div>

                {/* Role / Degree */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-2 transition-colors duration-500 tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-purple/80">
                  {item.position}
                </h3>
                
                {/* Company / Institution */}
                <h4 className="text-lg md:text-xl text-[#a7adbd] font-medium mb-6 flex items-center gap-3">
                  {item.company}
                  {item.current === 1 && <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse shadow-[0_0_10px_rgba(104,66,189,0.5)]"></span>}
                </h4>

                {/* Description (List or Paragraph) */}
                <div className="text-[#a7adbd] text-[15px] leading-relaxed max-w-2xl space-y-3 mb-8 font-medium">
                  {parsedDescription.map((desc: string, idx: number) => (
                    <p key={idx} className="relative pl-0">
                      {desc}
                    </p>
                  ))}
                </div>

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-6">
                    {item.technologies.map(t => (
                      <span key={t} className="px-3.5 py-1.5 bg-white/[0.02] border border-white/[0.08] group-hover:border-white/20 transition-all duration-300 rounded-lg text-[11px] font-semibold text-white/70 uppercase tracking-[0.15em] hover:bg-brand-purple/10 hover:text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
