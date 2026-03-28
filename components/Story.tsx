'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useProfile } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Story({ narrativeRaw }: { narrativeRaw?: string }) {
  const storyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    let sentences = [
      "Hello there.",
      "I see you're looking for something specific.",
      "Something that solves a problem...",
      "...and looks good doing it.",
      "I build with precision.",
      "Every line of code has a purpose."
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
      const narrativeEl = textRef.current;
      if (!narrativeEl) return;

      const scrollDistance = sentences.length * 80; // 80vh per sentence

      const storyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top top",
          end: `+=${scrollDistance}%`,
          scrub: 0.5,
          pin: true,
        }
      });

      sentences.forEach((sentence, i) => {
        if (i > 0) {
          storyTimeline.to(narrativeEl, { opacity: 0, duration: 0.3 });
        }
        storyTimeline.to(narrativeEl, { text: sentence, duration: 0.01, ease: "none" })
          .to(narrativeEl, { opacity: 1, duration: 0.5 })
          .to(narrativeEl, { opacity: 1, duration: 0.8 }); // hold
      });

      storyTimeline.to(narrativeEl, { opacity: 0, duration: 0.5 });
    }, storyRef);

    return () => ctx.revert();
  }, [narrativeRaw]);

  return (
    <section id="story" className="relative" ref={storyRef}>
      <div className="h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <h2 
            ref={textRef}
            className="text-4xl md:text-7xl font-display font-medium leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-[#292f3b] via-[#292f3b] to-brand-purple tracking-tighter" style={{ letterSpacing: '-0.04em' }}
          >
          </h2>
        </div>
      </div>
    </section>
  );
}
