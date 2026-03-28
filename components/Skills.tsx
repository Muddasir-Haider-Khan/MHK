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
  'Framer Motion': 'sparkles', 'GSAP': 'zap', 'Three.js': 'box',
  'Node.js': 'hexagon', 'Express': 'route', 'Express.js': 'route', 'Django': 'shield',
  'FastAPI': 'zap', 'REST API': 'plug', 'GraphQL': 'share-2',
  'Python': 'terminal', 'Java': 'coffee', 'C++': 'cpu', 'Go': 'arrow-right',
  'MongoDB': 'database', 'PostgreSQL': 'database', 'MySQL': 'database', 'Redis': 'hard-drive',
  'Supabase': 'zap', 'Prisma': 'pentagon',
  'Docker': 'container', 'AWS': 'cloud', 'Vercel': 'triangle', 'GitHub Actions': 'activity',
  'Machine Learning': 'brain', 'Deep Learning': 'brain-circuit', 'Computer Vision': 'eye', 'OpenAI': 'bot', 'NLP': 'message-square'
};

export default function Skills({ initialSkills }: { initialSkills?: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const skillsDisplayRef = useRef<HTMLDivElement>(null);
  const { skills: fetchedSkills } = useSkills();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  const skills = Array.isArray(fetchedSkills) ? fetchedSkills : (Array.isArray(initialSkills) ? initialSkills : []);
  
  const categoriesMap = (skills || []).reduce((acc: any, skill: any) => {
    if (!skill || !skill.category) return acc;
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryNames = Object.keys(categoriesMap).sort();
  const [activeCategory, setActiveCategory] = useState<string>(categoryNames[0] || 'Frontend');

  // Initial and Category Switch Animations
  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0]);
    }

    let ctx = gsap.context(() => {
      // Entrance for the full section
      gsap.from('.skills-command-center', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });
      
      // Animate skills mapping
      gsap.fromTo('.skill-node', 
        { 
          opacity: 0, 
          scale: 0.8, 
          y: 20 
        }, 
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.05, 
          ease: "back.out(1.4)" 
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, [activeCategory, skills]);

  const activeSkills = categoriesMap[activeCategory] || [];

  return (
    <section id="skills" className="pt-24 pb-12 relative overflow-hidden bg-[#f5f6ff]" ref={containerRef}>
      <div className="absolute top-[10%] right-0 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="px-4 md:px-12 mb-12 max-w-7xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-7xl font-display font-bold text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
           Technical <span className="text-brand-purple italic">Arsenal</span>
        </h2>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-12 relative z-10 lg:h-[70vh] flex flex-col lg:flex-row gap-6 lg:gap-8 pb-12 items-stretch skills-command-center overflow-hidden">
        
        {/* Category Side Rail */}
        <div className="lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:pr-4 no-scrollbar border-b lg:border-b-0 lg:border-r border-[#a7adbd]/10 pb-4 lg:pb-0">
          {categoryNames.map((cat) => {
            const isActive = activeCategory === cat;
            const iconName = categoryIcons[cat] || 'zap';
            
            return (
              <button
                key={cat}
                onMouseEnter={() => setActiveCategory(cat)}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 whitespace-nowrap text-left ${isActive ? 'bg-[#ffffff] shadow-[0_10px_30px_rgba(104,66,189,0.08)] opacity-100 translate-x-3 text-brand-purple' : 'opacity-40 hover:opacity-70 text-[#292f3b]'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-brand-purple/10' : 'bg-[#ecf0ff]'}`}>
                   <DynamicIcon name={iconName} className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-display font-bold">{cat}</span>
                  <span className="text-[10px] uppercase tracking-widest font-mono opacity-60 font-medium">
                    {categoriesMap[cat].length} units
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 relative bg-[#ffffff] rounded-[2.5rem] shadow-[0_20px_60px_rgba(104,66,189,0.04)] border border-[#a7adbd]/10 overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-8 border-b border-[#a7adbd]/5 flex justify-between items-center bg-[#fdfdff]/50 backdrop-blur-sm">
             <div className="flex items-center gap-3">
               <span className="w-3 h-3 rounded-full bg-brand-purple/30 animate-pulse"></span>
               <h3 className="text-xl font-display font-bold text-[#292f3b]">{activeCategory} Distribution</h3>
             </div>
             <div className="flex gap-1.5">
               <div className="w-2 h-2 rounded-full bg-[#ecf0ff]"></div>
               <div className="w-2 h-2 rounded-full bg-[#ecf0ff]"></div>
               <div className="w-2 h-2 rounded-full bg-[#ecf0ff]"></div>
             </div>
          </div>

          {/* Skill Nodes Grid */}
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative" ref={skillsDisplayRef}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {activeSkills.map((skill) => {
                const iconName = skillIconsMap[skill.name] || 'code-2';
                const level = skill.level || 85;
                const circumference = 2 * Math.PI * 28;
                const offset = circumference - (level / 100) * circumference;
                
                return (
                  <div 
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className="skill-node group relative cursor-pointer p-4 md:p-6 rounded-2xl bg-[#ffffff] border border-[#a7adbd]/5 hover:border-brand-purple/20 shadow-sm hover:shadow-[0_15px_30px_rgba(104,66,189,0.06)] transition-all duration-500"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icons.Info className="w-3.5 h-3.5 text-brand-purple" />
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-16 h-16 mb-4">
                        <svg className="w-full h-full -rotate-90 scale-95" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="#f5f6ff" strokeWidth="4"/>
                          <circle 
                            cx="32" cy="32" r="28" fill="none" stroke="url(#arsenalGrad)" strokeWidth="4"
                            strokeDasharray={circumference} strokeDashoffset={offset}
                            strokeLinecap="round" className="transition-all duration-1000"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[#292f3b] group-hover:text-brand-purple transition-all duration-500 group-hover:scale-110">
                          <DynamicIcon name={iconName} className="w-6 h-6" />
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#292f3b] mb-1 group-hover:text-brand-purple transition-colors">{skill.name}</h4>
                      <p className="text-[10px] font-mono font-bold text-[#a7adbd]">{level}% EXPERTISE</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inside-Frame Detail Card (Conditional Overly) */}
          <div className={`absolute inset-0 z-40 bg-[#ffffff]/90 backdrop-blur-xl transition-all duration-700 p-8 md:p-16 flex flex-col items-center justify-center text-center ${selectedSkill ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-8'}`}>
             {selectedSkill && (
               <div className="max-w-xl w-full">
                 <button 
                   onClick={() => setSelectedSkill(null)}
                   className="absolute top-8 right-8 p-3 rounded-full bg-[#f5f6ff] text-[#4f5d6d] hover:bg-brand-purple hover:text-white transition-all shadow-sm"
                 >
                   <Icons.X className="w-5 h-5" />
                 </button>
                 
                 <div className="w-24 h-24 mx-auto bg-brand-purple/10 rounded-[2rem] flex items-center justify-center mb-8">
                   <DynamicIcon name={skillIconsMap[selectedSkill.name] || 'code-2'} className="w-10 h-10 text-brand-purple" />
                 </div>
                 
                 <h3 className="text-3xl md:text-4xl font-display font-bold text-[#292f3b] mb-2">{selectedSkill.name}</h3>
                 <p className="text-xs font-mono font-bold tracking-[0.3em] text-brand-purple uppercase mb-6">{selectedSkill.category}</p>
                 
                 <p className="text-[#4f5d6d] md:text-lg leading-relaxed mb-10">
                   {selectedSkill.description || `Specialized implementation and engineering of high-performance ${selectedSkill.name} solutions for enterprise scale applications.`}
                 </p>
                 
                 <div className="w-full bg-[#f5f6ff] rounded-2xl p-8 text-left">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-xs font-mono font-bold text-[#a7adbd]">MASTERY INDEX</span>
                     <span className="text-sm font-bold text-brand-purple">{selectedSkill.level}%</span>
                   </div>
                   <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                     <div 
                      className="h-full bg-gradient-to-r from-brand-purple to-indigo-400 rounded-full transition-all duration-1000"
                      style={{ width: `${selectedSkill.level}%` }}
                     />
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      <svg className="absolute w-0 h-0"><defs>
        <linearGradient id="arsenalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#4f46e5"/>
        </linearGradient>
      </defs></svg>
    </section>
  );
}
