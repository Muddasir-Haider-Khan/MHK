'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ profile }: { profile: any }) {
  const contactRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>('00:00');

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

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center items-center px-4 md:px-12 relative overflow-hidden" ref={contactRef}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-brand-accent/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-mono">05 / What's Next?</p>

        <h2 className="opacity-0 text-5xl md:text-[8vw] font-display font-bold text-center leading-none mb-12 contact-title text-white">
          Let's<br/><span className="gradient-text-animated italic">Connect</span>
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center z-20">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} 
               className="flex items-center gap-3 px-6 py-4 border border-white/20 rounded-full hover:bg-[#EA4335] hover:border-[#EA4335] text-white transition-all duration-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
              <span>Gmail</span>
            </a>
          )}
          
          <a href="https://wa.me/923352767961" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 px-8 py-4 border border-white/20 rounded-full hover:bg-[#25D366] hover:border-[#25D366] text-white hover:text-black transition-all duration-500 font-bold">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </a>
          
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 px-6 py-4 border border-white/20 rounded-full hover:bg-[#1DA1F2] hover:border-[#1DA1F2] text-white transition-all duration-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              <span>Twitter</span>
            </a>
          )}
          
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 px-6 py-4 border border-white/20 rounded-full hover:bg-[#0A66C2] hover:border-[#0A66C2] text-white transition-all duration-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </div>
      
      <footer className="absolute bottom-8 w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600 uppercase tracking-widest font-mono text-center md:text-left">
        <span>&copy; {new Date().getFullYear()} MHK — Crafted with precision</span>
        <span>Local Time: <span>{time}</span></span>
      </footer>
    </section>
  );
}
