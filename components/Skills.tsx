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

const skillIconsMap: Record<string, string> = {
  'React': 'atom', 'React.js': 'atom', 'Next.js': 'triangle', 'Vue': 'hexagon', 'Vue.js': 'hexagon',
  'HTML': 'file-code', 'HTML5': 'file-code', 'CSS': 'paintbrush', 'CSS3': 'paintbrush', 
  'Tailwind': 'wind', 'Tailwind CSS': 'wind', 'JavaScript': 'braces', 'TypeScript': 'file-type',
  'Framer Motion': 'sparkles', 'GSAP': 'zap', 'Three.js': 'box',
  'Node.js': 'hexagon', 'Express': 'route', 'Express.js': 'route', 'Django': 'shield',
  'FastAPI': 'zap', 'REST API': 'plug', 'GraphQL': 'share-2',
  'Python': 'terminal', 'Java': 'coffee', 'C++': 'cpu', 'Go': 'arrow-right',
  'MongoDB': 'database', 'PostgreSQL': 'database', 'MySQL': 'database', 'Redis': 'hard-drive',
  'Supabase': 'zap', 'Prisma': 'pentagon',
  'Docker': 'container', 'AWS': 'cloud', 'Vercel': 'triangle', 'GitHub Actions': 'activity',
  'Machine Learning': 'brain', 'Deep Learning': 'brain-circuit', 'Computer Vision': 'eye', 'OpenAI': 'bot', 'NLP': 'message-square'
};

const pillarInfo: Record<string, { icon: string; description: string }> = {
  'Intelligence': { icon: 'brain', description: 'AI, Machine Learning, and NLP Orchestration.' },
  'Visuals': { icon: 'monitor', description: 'Editorial Design and Kinetic Interfaces.' },
  'Engine': { icon: 'server', description: 'High-Performance Backends & Database Systems.' },
  'Systems': { icon: 'cloud', description: 'Cloud Infrastructure and Hybrid Mobile Apps.' },
  'Tools': { icon: 'wrench', description: 'Architecture & Optimization Workflow.' }
};

export default function Skills({ initialSkills }: { initialSkills?: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { skills: fetchedSkills } = useSkills();
  const [activePillar, setActivePillar] = useState<string>('Intelligence');

  const skills = Array.isArray(fetchedSkills) ? fetchedSkills : (Array.isArray(initialSkills) ? initialSkills : []);

  useEffect(() => {
    if (skills.length > 0 && !activePillar) {
      // Find the first category from actual skills and map to pillar
      const firstSkill = skills[0];
      const pillar = categoryToPillar[firstSkill.category] || 'Intelligence';
      setActivePillar(pillar);
    }
  }, [skills]);

  const categoryToPillar: Record<string, string> = {
    'AI/ML': 'Intelligence',
    'Frontend': 'Visuals',
    'Design': 'Visuals',
    'Backend': 'Engine',
    'Database': 'Engine',
    'Languages': 'Engine',
    'DevOps': 'Systems',
    'Mobile': 'Systems',
    'Tools': 'Tools'
  };

  const pillars = (skills || []).reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    const pillarName = categoryToPillar[skill.category] || 'Intelligence';
    if (!acc[pillarName]) acc[pillarName] = [];
    acc[pillarName].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const pillarNames = Object.keys(pillarInfo);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.skills-accordion-container > div', {
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [skills]);

  return (
    <section id="skills" className="pt-24 pb-16 relative overflow-hidden bg-transparent scroll-mt-28" ref={containerRef}>
      <div className="absolute top-[10%] right-0 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 px-12 z-0 opacity-[0.05]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>

      <div className="px-6 md:px-12 mb-16 max-w-7xl mx-auto relative z-10">
        <h2 className="text-mobile-title md:text-8xl font-display font-bold text-[#292f3b] tracking-tighter leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
           Technical&nbsp;<span className="text-brand-purple italic" style={{ letterSpacing: '-0.01em' }}>Arsenal</span>
        </h2>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-12 relative z-10 flex flex-col lg:flex-row h-[120vh] lg:h-[70vh] gap-4 md:gap-5 pb-8 items-stretch skills-accordion-container overflow-hidden">
        {pillarNames.map((pillarName) => {
          const isActive = activePillar === pillarName;
          const info = pillarInfo[pillarName];
          const pillarSkills = (pillars[pillarName] || []).sort((a: Skill, b: Skill) => b.level - a.level);

          return (
            <div
              key={pillarName}
              onMouseEnter={() => setActivePillar(pillarName)}
              className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer shadow-[0_20px_40px_rgba(104,66,189,0.06)] bg-[#ffffff] border border-[#a7adbd]/10 min-w-[70px] lg:min-w-[80px]`}
              style={{ flex: isActive ? 10 : 1 }}
            >
              <div className={`absolute inset-0 p-8 md:p-12 flex flex-col transition-all duration-700 ${isActive ? 'opacity-100 delay-300 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className="mb-6">
                   <div className="w-14 h-14 bg-brand-purple/10 rounded-2xl flex items-center justify-center mb-6">
                      <DynamicIcon name={info.icon} className="w-7 h-7 text-brand-purple" />
                   </div>
                   <h3 className="text-3xl md:text-4xl font-display font-bold text-[#292f3b] mb-1">{pillarName}</h3>
                   <p className="text-[#4f5d6d] text-sm font-medium leading-relaxed max-w-sm">{info.description}</p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 lg:space-y-6 pr-2">
                   {pillarSkills.map((skill: Skill) => (
                     <div key={skill.id} className="w-full">
                       <div className="flex justify-between items-end mb-1.5">
                         <div className="flex items-center gap-2">
                            <span className="text-brand-purple"><DynamicIcon name={skillIconsMap[skill.name] || 'code-2'} className="w-3.5 h-3.5" /></span>
                            <span className="text-[11px] font-bold text-[#292f3b] uppercase tracking-wider">{skill.name}</span>
                         </div>
                         <span className="text-[10px] font-mono font-bold text-[#a7adbd]">{skill.level}%</span>
                       </div>
                       <div className="w-full h-1 bg-[#f5f6ff] rounded-full overflow-hidden">
                         <div
                           className="h-full bg-gradient-to-r from-brand-purple to-indigo-400 rounded-full transition-all duration-[1.5s]"
                           style={{ width: isActive ? `${skill.level}%` : '0%' }}
                         />
                       </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-0 delay-0' : 'opacity-100 delay-300'}`}>
                 <div className="lg:-rotate-90 origin-center flex flex-col items-center gap-4">
                   <DynamicIcon name={info.icon} className="w-5 h-5 text-brand-purple/40 group-hover:text-brand-purple transition-colors" />
                   <h3 className="text-[#292f3b]/30 font-display font-bold text-[11px] md:text-xs uppercase tracking-[0.5em] whitespace-nowrap group-hover:text-brand-purple/60 transition-colors">
                     {pillarName}
                   </h3>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
