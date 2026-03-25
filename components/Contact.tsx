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
    { id: 'vsco', label: 'VSCO', icon: ExternalLink, url: profile.vsco, color: 'hover:bg-white hover:text-black' },
    { id: 'cal', label: 'Book a Call', icon: Calendar, url: profile.cal_link, color: 'hover:bg-brand-purple' },
  ].filter(link => link.url);

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center items-center px-4 md:px-12 relative overflow-hidden" ref={contactRef}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-brand-accent/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-5xl w-full">
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-mono">05 / What's Next?</p>

        <h2 className="opacity-0 text-5xl md:text-[8vw] font-display font-bold text-center leading-none mb-16 contact-title text-white">
          Let's<br/><span className="gradient-text-animated italic">Connect</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 z-20 max-w-4xl mx-auto">
          {socialLinks.map((link) => (
            <a 
              key={link.id}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`group flex flex-col items-center justify-center gap-3 p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm transition-all duration-500 ${link.color} hover:border-transparent hover:scale-105 active:scale-95`}
            >
              <link.icon className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
      
      <footer className="absolute bottom-8 w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 uppercase tracking-widest font-mono text-center md:text-left z-10">
        <span>&copy; {new Date().getFullYear()} {profile.name || 'MHK'} — AI Engineer</span>
        <div className="flex gap-6">
          <span>Local Time: <span className="text-white">{time}</span></span>
          <span className="hidden md:block">Based in {profile.location || 'Islamabad'}</span>
        </div>
      </footer>
    </section>
  );
}
