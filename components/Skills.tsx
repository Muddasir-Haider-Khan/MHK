'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as Icons from 'lucide-react';
import { useSkills } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
  description: string;
  icon?: string;
};

const toPascalCase = (str: string) => 
  str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  if (!name) return <Icons.Zap className={className} />;
  const pascalName = toPascalCase(name);
  const IconComponent = (Icons as any)[pascalName];
  if (!IconComponent) return <Icons.Code2 className={className} />;
  return <IconComponent className={className} />;
};

const categoryIcons: Record<string, string> = {
  'Frontend': 'monitor', 'Backend': 'server', 'Database': 'database',
  'DevOps': 'cloud', 'AI/ML': 'brain', 'Tools': 'wrench',
  'Mobile': 'smartphone', 'Design': 'palette', 'Languages': 'code-2'
};

const skillIconsMap: Record<string, string> = {
  'React': 'atom', 'React.js': 'atom', 'Next.js': 'triangle', 'Vue': 'hexagon', 'Vue.js': 'hexagon',
  'HTML': 'file-code', 'HTML5': 'file-code', 'CSS': 'paintbrush', 'CSS3': 'paintbrush', 
  'Tailwind': 'wind', 'Tailwind CSS': 'wind', 'JavaScript': 'braces', 'TypeScript': 'file-type',
  'Framer Motion': 'sparkles',
  'Node.js': 'hexagon', 'Express': 'route', 'Express.js': 'route', 'Django': 'shield',
  'FastAPI': 'zap', 'REST API': 'plug', 'GraphQL': 'share-2',
  'Python': 'terminal', 'Java': 'coffee', 'C++': 'cpu', 'Go': 'arrow-right',
  'MongoDB': 'database', 'PostgreSQL': 'database', 'MySQL': 'database', 'Redis': 'hard-drive',
  'Supabase': 'zap',
  'Docker': 'container', 'AWS': 'cloud', 'Vercel': 'triangle',
  'Machine Learning': 'brain', 'OpenAI': 'bot', 'NLP': 'message-square'
};

export default function Skills({ initialSkills }: { initialSkills?: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { skills: fetchedSkills, isLoading } = useSkills();

  const skills = Array.isArray(fetchedSkills) ? fetchedSkills : (Array.isArray(initialSkills) ? initialSkills : []);

  const categories = (skills || []).reduce((acc: any, skill: any) => {
    if (!skill || !skill.category) return acc;
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray('.skill-category-section').forEach((section: any) => {
        const cards = section.querySelectorAll('.skill-card');
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          scale: 0.9,
          duration: 0.5,
          stagger: 0.06,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [initialSkills]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSkill) {
        setSelectedSkill(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedSkill]);

  return (
    <section id="skills" className="py-40 relative overflow-hidden bg-[#ecf0ff]" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[25vw] h-[25vw] bg-blue-300/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Minimalist Grid Line Scaffold (Desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.08]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>

      <div className="px-4 md:px-12 mb-20 max-w-7xl mx-auto relative z-10">
        <p className="text-sm uppercase tracking-widest text-[#4f5d6d] font-bold mb-8 font-mono">01 / Capabilities</p>
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
          The Engine <span className="text-brand-purple italic">Behind</span>
        </h2>
        <p className="text-[#4f5d6d] text-lg max-w-xl font-medium">
          Technologies and tools I use to bring ideas to life — from concept to deployment.
        </p>
      </div>

      <div className="skills-universe relative px-4 md:px-12 max-w-7xl mx-auto z-10">
        {(Object.entries(categories) as [string, Skill[]][]).map(([catName, catSkills]) => {
          const catIconName = categoryIcons[catName] || 'zap';
          return (
            <div key={catName} className="skill-category-section mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#ffffff] shadow-[0_10px_20px_rgba(104,66,189,0.04)] flex items-center justify-center">
                  <DynamicIcon name={catIconName} className="w-5 h-5 text-brand-purple" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#292f3b]">{catName}</h3>
                <span className="text-xs text-[#455363] bg-[#d6e4f7] font-bold px-3 py-1 rounded-full">{catSkills.length} skills</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {catSkills.map((skill: Skill) => {
                  const level = skill.level || 80;
                  const circumference = 2 * Math.PI * 28;
                  const offset = circumference - (level / 100) * circumference;
                  const lucideIconMap = skillIconsMap[skill.name] || 'code-2';
                  
                  return (
                    <div 
                      key={skill.id} 
                      className="skill-card group relative p-6 rounded-2xl bg-[#ffffff] shadow-[0_20px_40px_rgba(104,66,189,0.06)] border-0 overflow-hidden cursor-pointer hover:shadow-[0_20px_40px_rgba(104,66,189,0.12)] transition-shadow focus-visible"
                      onClick={() => setSelectedSkill(skill)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedSkill(skill);
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative w-16 h-16 mb-4">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(104,66,189,0.08)" strokeWidth="3"/>
                            <circle 
                              cx="32" cy="32" r="28" fill="none" stroke="url(#skillGrad)" strokeWidth="3"
                              strokeDasharray={circumference} strokeDashoffset={offset}
                              strokeLinecap="round" className="transition-all duration-1000"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                            <DynamicIcon name={lucideIconMap} className="w-5 h-5" />
                          </span>
                        </div>
                        <p className="font-bold text-sm text-[#292f3b] group-hover:text-brand-purple transition-colors">{skill.name}</p>
                        <span className="text-xs text-[#4f5d6d] mt-1 font-bold tracking-wider font-mono">{level}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <svg className="absolute w-0 h-0"><defs>
        <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#6366f1"/>
        </linearGradient>
      </defs></svg>

      {/* Detail Panel Desktop/Mobile Overlay */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#a7adbd]/20 shadow-[0_-20px_40px_rgba(104,66,189,0.05)] p-8 z-50 transition-transform duration-500 ${selectedSkill ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto">
          {selectedSkill && (
             <div className="flex justify-between items-start">
               <div className="flex-1">
                 <h3 className="text-2xl font-display font-bold text-[#292f3b]">{selectedSkill.name}</h3>
                 <p className="text-brand-purple text-sm mt-1 font-bold">{selectedSkill.category}</p>
                 <p className="text-[#4f5d6d] mt-4 max-w-3xl leading-relaxed">{selectedSkill.description || `Professional-grade expertise in ${selectedSkill.name}.`}</p>
                 
                 <div className="mt-6 bg-[#ecf0ff] rounded-full h-2 overflow-hidden max-w-xl">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-purple to-blue-400 rounded-full transition-all duration-1000"
                      style={{ width: `${selectedSkill.level}%` }}
                    ></div>
                 </div>
               </div>
               <button onClick={() => setSelectedSkill(null)} className="text-[#a7adbd] hover:text-[#292f3b] bg-[#f5f6ff] p-2 rounded-full transition-colors" aria-label="Close skill details">
                 <Icons.X className="w-5 h-5" />
               </button>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
