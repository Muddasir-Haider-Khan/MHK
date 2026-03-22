'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as Icons from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
  description: string;
  icon?: string;
};

// Map lowercase/kebab to PascalCase for lucide-react
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
  // Frontend
  'React': 'atom', 'React.js': 'atom', 'Next.js': 'triangle', 'Vue': 'hexagon', 'Vue.js': 'hexagon',
  'HTML': 'file-code', 'HTML5': 'file-code', 'CSS': 'paintbrush', 'CSS3': 'paintbrush', 
  'Tailwind': 'wind', 'Tailwind CSS': 'wind', 'JavaScript': 'braces', 'TypeScript': 'file-type',
  'Framer Motion': 'sparkles',
  // Backend
  'Node.js': 'hexagon', 'Express': 'route', 'Express.js': 'route', 'Django': 'shield',
  'FastAPI': 'zap', 'REST API': 'plug', 'GraphQL': 'share-2',
  // Languages
  'Python': 'terminal', 'Java': 'coffee', 'C++': 'cpu', 'Go': 'arrow-right',
  // Database
  'MongoDB': 'database', 'PostgreSQL': 'database', 'MySQL': 'database', 'Redis': 'hard-drive',
  'Supabase': 'zap',
  // DevOps
  'Docker': 'container', 'AWS': 'cloud', 'Vercel': 'triangle',
  // AI/ML
  'Machine Learning': 'brain', 'OpenAI': 'bot', 'NLP': 'message-square'
};

export default function Skills({ initialSkills }: { initialSkills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Group by category
  const categories = initialSkills.reduce((acc, skill) => {
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

  return (
    <section id="skills" className="py-40 relative overflow-hidden" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[25vw] h-[25vw] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="px-4 md:px-12 mb-20 max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-mono">01 / Capabilities</p>
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">
          The Engine <span className="gradient-text-animated italic">Behind</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-xl">
          Technologies and tools I use to bring ideas to life — from concept to deployment.
        </p>
      </div>

      <div className="skills-universe relative px-4 md:px-12 max-w-7xl mx-auto">
        {Object.entries(categories).map(([catName, catSkills]) => {
          const catIconName = categoryIcons[catName] || 'zap';
          return (
            <div key={catName} className="skill-category-section mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <DynamicIcon name={catIconName} className="w-5 h-5 text-brand-purple" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white/80">{catName}</h3>
                <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full">{catSkills.length} skills</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {catSkills.map((skill) => {
                  const level = skill.level || 80;
                  const circumference = 2 * Math.PI * 28;
                  const offset = circumference - (level / 100) * circumference;
                  const lucideIconMap = skillIconsMap[skill.name] || 'code-2';
                  
                  return (
                    <div 
                      key={skill.id} 
                      className="skill-card group relative p-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-brand-purple/50 transition-colors"
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative w-16 h-16 mb-4">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="3"/>
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
                        <p className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{skill.name}</p>
                        <span className="text-xs text-gray-500 mt-1">{level}%</span>
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
      <div className={`fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 p-8 z-50 transition-transform duration-500 ${selectedSkill ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto">
          {selectedSkill && (
             <div className="flex justify-between items-start">
               <div className="flex-1">
                 <h3 className="text-2xl font-display font-bold">{selectedSkill.name}</h3>
                 <p className="text-brand-purple text-sm mt-1">{selectedSkill.category}</p>
                 <p className="text-gray-300 mt-4 max-w-3xl leading-relaxed">{selectedSkill.description || `Professional-grade expertise in ${selectedSkill.name}.`}</p>
                 
                 <div className="mt-6 bg-white/5 rounded-full h-2 overflow-hidden max-w-xl">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-purple to-brand-accent rounded-full transition-all duration-1000"
                      style={{ width: `${selectedSkill.level}%` }}
                    ></div>
                 </div>
               </div>
               <button onClick={() => setSelectedSkill(null)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                 <Icons.X className="w-5 h-5" />
               </button>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
