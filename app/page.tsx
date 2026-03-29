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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6ff] text-brand-purple font-mono font-bold tracking-widest">
        INITIALIZING DATABASE CONNECTION...
      </div>
    );
  }

  return (
    <main className="relative z-10 bg-[#f5f6ff]">
      <Hero profile={data.profile} />
      <Skills initialSkills={data.skills} />
      <Projects initialProjects={data.projects} />
      <Story narrativeRaw={data.profile.narrative} />
      {/* <Experience experience={data.experience} education={data.education} /> */}
      {/* <Process philosophy={data.profile.philosophy} settings={data.settings} /> */}
      <Contact profile={data.profile} />
    </main>
  );
}
