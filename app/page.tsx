import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import { getPortfolioData } from '@/lib/data';

export const revalidate = 60; // ISR

export default async function Home() {
  const data = await getPortfolioData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-brand-purple font-mono">
        INITIALIZING DATABASE CONNECTION...
      </div>
    );
  }

  return (
    <main className="relative z-10 bg-[#050505]">
      <Hero profile={data.profile} />
      <Story narrativeRaw={data.profile.narrative} />
      <Skills initialSkills={data.skills} />
      <Projects initialProjects={data.projects} />
      <Experience experience={data.experience} education={data.education} />
      <Process philosophy={data.profile.philosophy} settings={data.settings} />
      <Contact profile={data.profile} />
    </main>
  );
}
