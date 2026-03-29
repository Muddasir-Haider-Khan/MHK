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
    <section id="contact" className="min-h-[90vh] flex flex-col justify-center items-center px-4 md:px-12 relative overflow-hidden bg-[#0a0c12]" ref={contactRef}>
      <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

      {/* Minimalist Grid Line Scaffold (Desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-20">
         <div className="border-l border-white/10"></div>
         <div className="border-l border-white/10"></div>
         <div className="border-l border-white/10"></div>
         <div className="border-l border-r border-white/10"></div>
      </div>
      
      <div className="relative z-10 w-full py-16 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 justify-between">
        {/* Left column: Title & Info */}
        <div className="flex-1 max-w-xl md:sticky md:top-40 self-start">
          <h2 className="opacity-0 text-6xl md:text-[6rem] font-display font-bold leading-none mb-4 contact-title text-white tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
            Let's<br/><span className="text-brand-purple">Connect.</span>
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
              className="group w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(104,66,189,0.3)] hover:bg-brand-purple/10 transition-all duration-500 ease-[cubic-bezier(0.17,0.67,0.21,1)] transform hover:-translate-y-2"
            >
              <link.icon className="w-8 h-8 md:w-10 md:h-10 text-white/70 group-hover:text-white transition-colors duration-500" strokeWidth={2.5} />
            </a>
          ))}
        </div>
      </div>
      
      <footer className="w-full px-6 md:px-12 pb-8 pt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-widest font-mono text-center md:text-left z-10 text-[#a7adbd] font-bold">
        <span>&copy; {new Date().getFullYear()} {profile.name || 'MHK'} — AI Engineer</span>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          <span>Local Time: <span className="text-white">{time}</span></span>
          <span className="opacity-60">Based in {profile.location || 'Islamabad, Pakistan'}</span>
        </div>
      </footer>
    </section>
  );
}
