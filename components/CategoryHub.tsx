"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const categories = [
  { id: 1, name: "ALL", icon: "🌐" }, // ضفنا خيار عرض الكل لراحة الزبون
  { id: 2, name: "AUDIO", icon: "🎧" },
  { id: 3, name: "WEARABLES", icon: "⌚" },
  { id: 4, name: "GEAR", icon: "🔌" },
  { id: 5, name: "VISION", icon: "🕶️" },
  { id: 6, name: "SETUPS", icon: "🖥️" },
];

type CategoryHubProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

export default function CategoryHub({ activeCategory, setActiveCategory }: CategoryHubProps): React.ReactNode {
  const circlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    circlesRef.current.forEach((circle) => {
      if (!circle) return;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = circle.getBoundingClientRect();
        const circleX = rect.left + rect.width / 2;
        const circleY = rect.top + rect.height / 2;
        const distanceX = e.clientX - circleX;
        const distanceY = e.clientY - circleY;

        if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
          gsap.to(circle, {
            x: distanceX * 0.4, y: distanceY * 0.4, scale: 1.1,
            borderColor: "#00F5FF", boxShadow: "0 0 20px rgba(0, 245, 255, 0.2)",
            duration: 0.3, ease: "power2.out",
          });
        } else {
          gsap.to(circle, {
            x: 0, y: 0, scale: 1,
            borderColor: "rgba(255, 255, 255, 0.1)", boxShadow: "none",
            duration: 0.5, ease: "elastic.out(1, 0.3)",
          });
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    });
  }, []);

  return (
    <section className="w-full py-20 flex flex-col items-center justify-center bg-[#0A0A0C]">
      <h2 className="text-xs tracking-[0.3em] text-[#8A8A93] mb-12 uppercase font-mono">
        // SELECT CATEGORY TO FILTER ({activeCategory})
      </h2>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 max-w-6xl px-4">
        {categories.map((cat, index) => {
          const isActive = activeCategory === cat.name;
          return (
            <div
              key={cat.id}
              ref={(el) => { if (el) circlesRef.current[index] = el; }}
              onClick={() => setActiveCategory(cat.name)} // تغيير الفلتر عند الضغط
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              {/* إذا كانت الدائرة نشطة بنعطيها لون فوسفوري ثابت */}
              <div className={`w-24 h-24 rounded-full border flex items-center justify-center text-3xl transition-all duration-300 ${
                isActive 
                  ? "border-[#00F5FF] bg-[#00F5FF]/10 shadow-[0_0_25px_rgba(0,245,255,0.3)]" 
                  : "border-white/10 bg-white/[0.02] group-hover:bg-white/[0.05]"
              }`}>
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
              </div>
              
              <span className={`mt-4 text-[10px] tracking-[0.2em] font-bold font-mono transition-colors duration-300 ${
                isActive ? "text-[#00F5FF]" : "text-[#8A8A93] group-hover:text-[#00F5FF]"
              }`}>
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}