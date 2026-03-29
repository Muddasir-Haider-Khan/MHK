'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfile } from '@/hooks/useContent';
import { Mail, Phone, Linkedin, Instagram, Facebook, Calendar, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ profile: initialProfile }: { profile?: any }) {
  const contactRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>('00:00');
  const { profile: fetchedProfile } = useProfile();
  const profile = fetchedProfile || initialProfile || {};

  useEffect(() => {
    // Clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Animation
    let ctx = gsap.context(() => {
      if (contactRef.current) {
        ScrollTrigger.create({
          trigger: contactRef.current,
          start: 'top 60%',
          onEnter: () => {
            gsap.fromTo('.contact-title', 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
            );
          },
          once: true
        });
      }
    });

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const socialLinks = [
    { id: 'email', label: 'Email', icon: Mail, url: profile.email ? `mailto:${profile.email}` : null },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, url: profile.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : null },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, url: profile.linkedin },
    { id: 'instagram', label: 'Instagram', icon: Instagram, url: profile.instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook, url: profile.facebook },
    { id: 'vsco', label: 'VSCO', icon: ExternalLink, url: profile.vsco },
    { id: 'cal', label: 'Book Call', icon: Calendar, url: profile.cal_link },
  ].filter(link => link.url);

  return (
    <section id="contact" className="min-h-[90vh] flex flex-col justify-center items-center px-4 md:px-12 relative overflow-hidden bg-[#ecf0ff]" ref={contactRef}>
      <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Minimalist Grid Line Scaffold (Desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.08]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>
      
      <div className="relative z-10 w-full py-16 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 justify-between">
        {/* Left column: Title & Info */}
        <div className="flex-1 max-w-xl md:sticky md:top-40 self-start">
          <h2 className="opacity-0 text-6xl md:text-[6rem] font-display font-bold leading-none mb-4 contact-title text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
            Let's<br/><span className="text-brand-purple italic">Connect.</span>
          </h2>
        </div>

        {/* Right column: Editorial Icon Dock */}
        <div className="flex-1 flex flex-wrap content-start gap-6 w-full z-20">
          {socialLinks.map((link) => (
            <a 
              key={link.id}
              href={link.url} 
              target="_blank" 
              title={link.label}
              rel="noopener noreferrer"
              className="group w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-[#ffffff]/80 backdrop-blur-xl border border-[#ffffff] shadow-[0_10px_30px_rgba(104,66,189,0.08)] hover:shadow-[0_20px_40px_rgba(104,66,189,0.2)] hover:bg-brand-purple transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.21,1)] transform hover:-translate-y-2"
            >
              <link.icon className="w-8 h-8 md:w-10 md:h-10 text-[#a7adbd] group-hover:text-white transition-colors duration-500" />
            </a>
          ))}
        </div>
      </div>
      
      <footer className="w-full px-6 md:px-12 pb-8 pt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-widest font-mono text-center md:text-left z-10 text-[#4f5d6d] font-bold">
        <span>&copy; {new Date().getFullYear()} {profile.name || 'MHK'} — AI Engineer</span>
        <div className="flex gap-6">
          <span>Local Time: <span className="text-brand-purple">{time}</span></span>
          <span className="hidden md:block">Based in {profile.location || 'Islamabad'}</span>
        </div>
      </footer>
    </section>
  );
}
