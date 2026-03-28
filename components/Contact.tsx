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
      
      <div className="relative z-10 w-full py-32 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 justify-between">
        
        {/* Left column: Title & Info */}
        <div className="flex-1 max-w-xl md:sticky md:top-40 self-start">
          <p className="text-sm uppercase tracking-widest text-[#4f5d6d] font-bold mb-8 font-mono">05 / What's Next?</p>

          <h2 className="opacity-0 text-6xl md:text-[6rem] font-display font-bold leading-none mb-8 contact-title text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
            Let's<br/><span className="text-brand-purple italic">Connect.</span>
          </h2>
          
          <p className="text-[#4f5d6d] text-xl md:text-2xl font-medium max-w-md leading-relaxed mb-12">
            Have an idea? Ready to scale? Drop me a line to explore collaboration opportunities.
          </p>
        </div>

        {/* Right column: Editorial Social Links List */}
        <div className="flex-1 flex flex-col w-full z-20">
          <div className="border-t border-[#a7adbd]/20 w-full"></div>
          {socialLinks.map((link) => (
            <a 
              key={link.id}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between py-10 md:py-12 border-b border-[#a7adbd]/20 hover:border-brand-purple transition-colors duration-500 w-full"
            >
              <div className="flex items-center gap-6 md:gap-10 mb-6 sm:mb-0">
                <span className="text-lg md:text-xl font-mono text-[#a7adbd] group-hover:text-brand-purple transition-colors duration-500 font-bold tracking-widest">
                  {String(socialLinks.indexOf(link) + 1).padStart(2, '0')}
                </span>
                <span className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-[#292f3b] group-hover:text-brand-purple transition-colors duration-500 tracking-tighter hover:italic">
                  {link.label}
                </span>
              </div>
              <div className="w-16 h-16 rounded-full border border-[#a7adbd]/30 flex items-baseline justify-center items-center group-hover:bg-brand-purple group-hover:border-brand-purple group-hover:shadow-[0_10px_30px_rgba(104,66,189,0.3)] transition-all duration-500 transform sm:translate-x-0 group-hover:-rotate-12 group-hover:scale-110 shrink-0 ml-14 sm:ml-0">
                <link.icon className="w-6 h-6 text-[#4f5d6d] group-hover:text-white transition-colors duration-500" />
              </div>
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
