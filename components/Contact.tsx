'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfile } from '@/hooks/useContent';
import { Mail, Phone, Linkedin, Instagram, Facebook, Calendar, ExternalLink, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ profile: initialProfile }: { profile?: any }) {
  const contactRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>('00:00');
  const { profile: fetchedProfile } = useProfile();
  const profile = fetchedProfile || initialProfile || {};

  useEffect(() => {
    // Live Clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Dark Pro Exit Animations
    let ctx = gsap.context(() => {
      if (contactRef.current) {
        ScrollTrigger.create({
          trigger: contactRef.current,
          start: 'top 70%',
          onEnter: () => {
            // Massive background text fade
            gsap.fromTo('.bg-massive-text',
              { y: 100, opacity: 0 },
              { y: 0, opacity: 0.03, duration: 1.5, ease: "power3.out" }
            );

            gsap.fromTo('.contact-title', 
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }
            );

            // Staggered Social Icons Entrance
            gsap.fromTo('.social-icon',
              { opacity: 0, y: 30, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 }
            );
          },
          once: true
        });

        // Magnet Effect for huge primary email button
        const mailBtn = document.querySelector('.magnetic-btn');
        if (mailBtn) {
          mailBtn.addEventListener('mousemove', (e: any) => {
            const rect = mailBtn.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(mailBtn, { x: x * 30, y: y * 30, duration: 0.4, ease: "power2.out" });
          });
          mailBtn.addEventListener('mouseleave', () => {
             gsap.to(mailBtn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
          });
        }
      }
    });

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const socialLinks = [
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone, url: profile.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : null },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, url: profile.linkedin },
    { id: 'instagram', label: 'Instagram', icon: Instagram, url: profile.instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook, url: profile.facebook },
    { id: 'vsco', label: 'VSCO', icon: ExternalLink, url: profile.vsco },
    { id: 'cal', label: 'Book Call', icon: Calendar, url: profile.cal_link },
  ].filter(link => link.url);

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-between px-6 md:px-12 relative overflow-hidden bg-[#0a0c12] pt-32 pb-8" ref={contactRef}>
      
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 overflow-hidden mix-blend-screen">
        <h1 className="bg-massive-text text-[15vw] font-display font-black text-white opacity-0 whitespace-nowrap tracking-tighter mix-blend-overlay">
          LET'S CONNECT
        </h1>
      </div>

      {/* Cinematic Glowing Orb */}
      <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-purple/10 rounded-full blur-[200px] pointer-events-none z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center mt-12 md:mt-24">
        
        <p className="contact-title text-sm md:text-base uppercase tracking-[0.4em] font-mono text-[#a7adbd] mb-8 font-semibold">
          <span className="text-brand-purple">///</span> Ready to drop a project?
        </p>

        <h2 className="contact-title text-6xl md:text-[7rem] lg:text-[9rem] font-display font-semibold leading-none mb-16 text-white tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
          Let's<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-purple/80 to-brand-purple">Create Together.</span>
        </h2>

        {/* Primary Giant Call to Action */}
        {profile.email && (
           <a 
             href={`mailto:${profile.email}`} 
             className="contact-title magnetic-btn relative group inline-flex items-center gap-4 px-10 py-6 md:px-14 md:py-8 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-brand-purple/50 transition-colors backdrop-blur-xl mb-24 overflow-hidden"
           >
             <div className="absolute inset-0 bg-brand-purple/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></div>
             
             <Mail className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" strokeWidth={1.5} />
             <span className="text-2xl md:text-4xl lg:text-5xl font-display font-medium text-white relative z-10 tracking-tight">
               {profile.email}
             </span>
             <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-[#a7adbd] group-hover:text-white transition-colors relative z-10" strokeWidth={1.5} />
           </a>
        )}

        {/* Social Dock (Apple-style frosted glass pill) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 p-4 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl z-20">
          {socialLinks.map((link, i) => (
            <a 
              key={link.id}
              href={link.url} 
              target="_blank" 
              title={link.label}
              rel="noopener noreferrer"
              className="social-icon group w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 hover:border-brand-purple/50 hover:bg-brand-purple hover:shadow-[0_0_20px_rgba(104,66,189,0.4)] transition-all duration-500 transform hover:-translate-y-2"
            >
              <link.icon className="w-6 h-6 md:w-7 md:h-7 text-[#a7adbd] group-hover:text-white transition-colors duration-500" strokeWidth={2} />
            </a>
          ))}
        </div>
      </div>
      
      {/* Footer Strip */}
      <footer className="w-full max-w-7xl mx-auto pt-20 flex flex-col md:flex-row items-center justify-between gap-6 text-xs md:text-sm tracking-widest font-mono text-center md:text-left z-10 text-[#a7adbd] border-t border-white/5 mt-auto">
        <span>&copy; {new Date().getFullYear()} {profile.name || 'MHK'} — AI Engineer</span>
        <div className="flex gap-8 items-center">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple"></span>
            </span>
            {time}
          </span>
          <span className="hidden md:block">Based in {profile.location || 'Islamabad'}</span>
        </div>
      </footer>
    </section>
  );
}
