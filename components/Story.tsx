'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfile } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function Story({ narrativeRaw }: { narrativeRaw?: string }) {
  const storyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    let sentences = [
      "Hello there.",
      "I see you're looking for something specific.",
      "Something that solves a problem...",
      "...and looks perfectly crafted.",
      "I build with precision.",
      "Every architecture has a purpose."
    ];
    
    if (profile?.narrative) {
      try {
        const parsed = typeof profile.narrative === 'string' ? JSON.parse(profile.narrative) : profile.narrative;
        if (Array.isArray(parsed) && parsed.length > 0) sentences = parsed;
      } catch {}
    } else if (narrativeRaw) {
      try {
        const parsed = JSON.parse(narrativeRaw);
        if (Array.isArray(parsed) && parsed.length > 0) sentences = parsed;
      } catch {}
    }

    let ctx = gsap.context(() => {
      const scrollDistance = sentences.length * 25; // 25vh per sentence

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top top",
          end: `+=${scrollDistance}%`,
          scrub: 1,
          pin: true,
        }
      });

      // Initially everything is hidden but the first one will fade in
      const elements = gsap.utils.toArray('.story-sentence') as HTMLElement[];
      
      elements.forEach((el, index) => {
        // Fade in
        tl.fromTo(el, 
          { opacity: 0, filter: 'blur(12px)', y: 20 },
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'power2.out' }
        );
        // Hold
        tl.to(el, { opacity: 1, duration: 0.8 });
        // Fade out
        if (index !== elements.length - 1) {
          tl.to(el, { opacity: 0, filter: 'blur(12px)', y: -20, duration: 1, ease: 'power2.in' });
        } else {
           // Allow the last sentence to stick slightly longer before exiting
          tl.to(el, { opacity: 0, duration: 1.5 });
        }
      });

    }, storyRef);

    return () => ctx.revert();
  }, [narrativeRaw, profile]);

  let displaySentences = [
    "Hello there.",
    "I see you're looking for something specific.",
    "Something that solves a problem...",
    "...and looks perfectly crafted.",
    "I build with precision.",
    "Every architecture has a purpose."
  ];

  if (profile?.narrative) {
    try {
      const parsed = typeof profile.narrative === 'string' ? JSON.parse(profile.narrative) : profile.narrative;
      if (Array.isArray(parsed) && parsed.length > 0) displaySentences = parsed;
    } catch {}
  } else if (narrativeRaw) {
    try {
      const parsed = JSON.parse(narrativeRaw);
      if (Array.isArray(parsed) && parsed.length > 0) displaySentences = parsed;
    } catch {}
  }

  return (
    <section id="story" className="relative bg-transparent" ref={storyRef}>
      <div className="h-screen flex items-center justify-center px-4 relative overflow-hidden" ref={containerRef}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-brand-purple/5 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="max-w-5xl text-center relative z-10 w-full h-full flex items-center justify-center">
          {displaySentences.map((sentence, i) => (
             <h2 
               key={i}
               className="story-sentence absolute w-full text-4xl md:text-7xl lg:text-8xl font-display font-medium leading-[1.1] tracking-tighter text-[#292f3b] drop-shadow-[0_10px_20px_rgba(104,66,189,0.04)] px-4"
               style={{ 
                 letterSpacing: '-0.04em',
                 opacity: 0, 
                 visibility: 'visible'
               }}
             >
               {sentence}
             </h2>
          ))}
        </div>
      </div>
    </section>
  );
}
