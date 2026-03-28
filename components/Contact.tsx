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
    { id: 'email', label: 'Gmail', icon: Mail, url: profile.email ? `mailto:${profile.email}` : null, color: 'hover:bg-[#EA4335]' },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, url: profile.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : null, color: 'hover:bg-[#25D366]' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, url: profile.linkedin, color: 'hover:bg-[#0A66C2]' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, url: profile.instagram, color: 'hover:bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, url: profile.facebook, color: 'hover:bg-[#1877F2]' },
    { id: 'vsco', label: 'VSCO', icon: ExternalLink, url: profile.vsco, color: 'hover:bg-brand-purple' },
    { id: 'cal', label: 'Book a Call', icon: Calendar, url: profile.cal_link, color: 'hover:bg-[#292f3b]' },
  ].filter(link => link.url);

  return (
    <section id="contact" className="min-h-[80vh] flex flex-col justify-center items-center px-4 md:px-12 relative overflow-hidden bg-[#ecf0ff]" ref={contactRef}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Minimalist Grid Line Scaffold (Desktop) */}
      <div className="absolute inset-0 pointer-events-none hidden md:grid grid-cols-4 gap-4 px-12 z-0 opacity-[0.08]">
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-[#a7adbd]"></div>
         <div className="border-l border-r border-[#a7adbd]"></div>
      </div>
      
      <div className="text-center relative z-10 max-w-5xl w-full py-32">
        <p className="text-sm uppercase tracking-widest text-[#4f5d6d] font-bold mb-8 font-mono">05 / What's Next?</p>

        <h2 className="opacity-0 text-5xl md:text-[8vw] font-display font-bold text-center leading-none mb-16 contact-title text-[#292f3b] tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
          Let's<br/><span className="text-brand-purple italic">Connect</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 z-20 max-w-4xl mx-auto">
          {socialLinks.map((link) => (
            <a 
              key={link.id}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`group flex flex-col items-center justify-center gap-3 p-6 border-0 shadow-[0_20px_40px_rgba(104,66,189,0.06)] rounded-2xl bg-[#ffffff] transition-all duration-500 ${link.color} hover:-translate-y-2`}
            >
              <link.icon className="w-6 h-6 text-brand-purple group-hover:text-white transition-colors duration-500" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#4f5d6d] group-hover:text-white transition-colors duration-500">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
      
      <footer className="w-full px-6 md:px-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-widest font-mono text-center md:text-left z-10 text-[#4f5d6d] font-bold">
        <span>&copy; {new Date().getFullYear()} {profile.name || 'MHK'} — AI Engineer</span>
        <div className="flex gap-6">
          <span>Local Time: <span className="text-brand-purple">{time}</span></span>
          <span className="hidden md:block">Based in {profile.location || 'Islamabad'}</span>
        </div>
      </footer>
    </section>
  );
}
