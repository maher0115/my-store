"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // أنيميشن سينمائي أول ما الموقع يفتح (Fade in + Move up)
    const tl = gsap.timeline();
    
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 100, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }
    );

    tl.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.6" // يبدأ قبل ما ينتهي أنيميشن النص بشوي
    );
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-[#0A0A0C] px-4 pt-20 overflow-hidden">
      
      {/* النص الصغير العلوي المشوق */}
      <span className="text-[10px] tracking-[0.4em] text-[#8A8A93] uppercase font-mono mb-4 animate-pulse">
        * THE FUTURE OF TECH. UNBOXED. *
      </span>

      {/* النص الخلفي العملاق والشرير */}
      <div className="relative w-full max-w-7xl text-center select-none pointer-events-none">
        <h2 className="text-[12vw] font-black tracking-tighter text-white/[0.03] leading-none uppercase font-sans absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          MATJARI
        </h2>
        
        {/* النص الأساسي الأمامي */}
        <h1 
          ref={textRef}
          className="text-4xl md:text-7xl font-extrabold tracking-tight text-white uppercase text-center relative z-10 max-w-4xl leading-[1.1]"
        >
          ACCESS THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00F5FF]">UNSEEN</span> LAYER.
        </h1>
      </div>

      {/* زر الحركة (Call to Action) الفخم المحاط بالنيون */}
      <div className="mt-12 relative z-20">
        <button
          ref={buttonRef}
          className="px-8 py-4 bg-black border border-[#00F5FF]/30 rounded-full text-xs tracking-[0.2em] font-bold uppercase text-white hover:text-black hover:bg-[#00F5FF] transition-all duration-300 shadow-[0_0_20px_rgba(0,245,255,0.1)] hover:shadow-[0_0_35px_rgba(0,245,255,0.4)] font-mono"
        >
          EXPLORE THE DROP
        </button>
      </div>

      {/* تأثير إضاءة نيون خفيف بالخلفية للمود السيبراني */}
      <div className="absolute w-[500px] h-[500px] bg-[#00F5FF]/5 rounded-full blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
    </section>
  );
}