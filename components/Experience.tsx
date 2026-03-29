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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const { experience: fetchedExperience, isLoading: isExpLoading } = useExperience();
  const { education: fetchedEducation, isLoading: isEduLoading } = useEducation();

  const experience = Array.isArray(fetchedExperience) ? fetchedExperience : (Array.isArray(initialExperience) ? initialExperience : []);
  const education = Array.isArray(fetchedEducation) ? fetchedEducation : (Array.isArray(initialEducation) ? initialEducation : []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
      // Animate items natively
      gsap.utils.toArray('.timeline-item').forEach((item: any, i) => {
        gsap.from(item, {
          opacity: 0,
          x: i % 2 === 0 ? -40 : 40,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // Progress line
      const timelineLine = document.querySelector('.timeline-progress');
      if (timelineLine) {
        gsap.to(timelineLine, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true
          }
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [timelineItems]);

  return (
    <section id="experience" className="pt-8 pb-16 relative bg-transparent scroll-mt-32" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 md:px-12 relative z-10 w-full mb-20">
        <p className="text-sm uppercase tracking-[0.4em] text-brand-purple/60 font-bold mb-8 font-mono">03 / Journey</p>
        <h2 className="text-5xl md:text-8xl font-display font-bold text-[#292f3b] tracking-tighter leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
          The Path<br/>
          <span className="text-brand-purple italic">So Far</span>
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-12 relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#a7adbd]/20 timeline-line">
          <div className="timeline-progress absolute top-0 left-0 w-full bg-brand-purple" style={{ height: '0%' }}></div>
        </div>
        
        <div id="timeline-container" className="space-y-16">
          {timelineItems.map((item, i) => {
            const isLeft = i % 2 === 0;
            const uid = `${item.type}-${item.id}`;
            const isExpanded = expandedItems[uid];
            
            return (
              <div key={uid} className={`timeline-item relative flex w-full md:w-1/2 ${isLeft ? 'md:mr-auto md:pr-12 md:justify-end' : 'md:ml-auto md:pl-12'}`}>
                {/* Visual Dot */}
                <div className={`absolute top-0 w-4 h-4 bg-[#ffffff] border-2 border-brand-purple rounded-full z-10 ${isLeft ? 'left-[-7px] md:right-[-9px] md:left-auto' : 'left-[-7px]'}`}>
                   <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-brand-purple rounded-full animate-ping opacity-50"></div>
                </div>

                {/* Content Card */}
                <div 
                  className={`w-full max-w-sm bg-[#ffffff] shadow-[0_20px_40px_rgba(104,66,189,0.06)] border-0 p-6 rounded-2xl cursor-pointer hover:shadow-[0_20px_40px_rgba(104,66,189,0.12)] transition-shadow focus-visible ${isLeft ? 'md:text-right' : ''}`}
                  onClick={() => toggleExpand(uid)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpand(uid);
                    }
                  }}
                >
                  <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                    <span className="text-xs text-brand-purple font-mono font-bold">
                      {item.start_date} — {item.current ? 'Present' : item.end_date}
                    </span>
                    {item.type === 'education' && (
                      <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full font-bold">Education</span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-[#292f3b] mb-1">{item.position}</h3>
                  <p className="text-[#4f5d6d] text-sm font-medium">{item.company}</p>
                  
                  <div className={`mt-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className={`text-[#4f5d6d] text-sm leading-relaxed ${isLeft ? 'md:text-right' : ''}`}>
                      {item.description}
                    </p>
                    
                    {item.technologies && item.technologies.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mt-4 ${isLeft ? 'md:justify-end' : ''}`}>
                        {item.technologies.map(t => (
                          <span key={t} className="px-2 py-1 bg-[#d6e4f7] rounded-full text-[10px] text-[#455363] font-bold tracking-wider font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-xs text-brand-purple/60 hover:text-brand-purple mt-4 font-bold transition-colors ${isLeft ? 'md:text-right' : ''}`}>
                    {isExpanded ? 'Show less' : 'Click to expand'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
