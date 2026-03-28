'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only show on desktop devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0)`,
        transition: 'transform 0.1s cubic-bezier(0.17, 0.67, 0.21, 1)' // Extremely tight tracking
      }}
    >
      <div 
        className={`w-full h-full border border-brand-purple rounded-full flex items-center justify-center transition-all duration-300 ease-out transform ${
          isPointer ? 'scale-150 bg-white border-transparent' : 'scale-100 bg-transparent'
        }`}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isPointer ? 'bg-black scale-0' : 'bg-brand-purple scale-100'}`} />
      </div>
    </div>
  );
}
