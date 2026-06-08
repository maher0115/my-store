"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation"; // 1. الاستدعاء فوق طبيعي

// مصفوفة البيانات برة الدالة عادي لأنها مش Hook
const productsData = [
  { id: "buds-1", name: "QUANTUM BUDS", price: 189, category: "AUDIO", size: "col-span-3 row-span-2", desc: "Next-gen acoustic drivers with neural noise cancellation." },
  { id: "watch-1", name: "NEO CHRONO", price: 349, category: "WEARABLES", size: "col-span-3 row-span-1", desc: "Biometric holographic tracking." },
  { id: "gear-1", name: "CYBER LINK", price: 89, category: "GEAR", size: "col-span-3 row-span-1", desc: "Superconducting multi-port node." },
  { id: "vision-1", name: "APEX GLASSES", price: 599, category: "VISION", size: "col-span-6 row-span-1", desc: "Retinal AR projection overlay." }
];

type BentoGridProps = {
  activeCategory: string;
};

export default function BentoGrid({ activeCategory }: BentoGridProps): React.ReactNode {
  // 2. المكاااان الصح: الـ Hooks لازم تعيش جوا الدالة الرئيسية بالظبط هنا!
  const { addToCart } = useCart();
  const router = useRouter(); 

  const fadeInVariant: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.3 } }
  };

  const filteredProducts = activeCategory === "ALL" 
    ? productsData 
    : productsData.filter(p => p.category === activeCategory);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 selection:bg-transparent">
      <motion.div layout className="grid grid-cols-6 gap-6 auto-rows-[220px]">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => router.push(`/product/${product.id}`)}
              className={`${product.size} relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between overflow-hidden group hover:border-[#00F5FF]/30 transition-colors duration-500 cursor-pointer`}
            >
              <div className="absolute -inset-px bg-gradient-to-br from-[#00F5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-[9px] tracking-widest text-[#8A8A93] font-mono">// {product.category}</span>
                  <h3 className="text-lg font-black tracking-tight mt-1 text-white">{product.name}</h3>
                </div>
                <span className="text-xs font-bold text-[#00F5FF] font-mono">${product.price}</span>
              </div>

              <p className="text-xs text-[#8A8A93] leading-relaxed max-w-xs z-10 font-sans">
                {product.desc}
              </p>

              <div className="flex justify-between items-center z-10 mt-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // منع انتقال الصفحة عند الضغط على الزر نفسه
                    e.preventDefault();
                    addToCart({ id: product.id, name: product.name, price: product.price });
                  }}
                  className="text-[10px] tracking-wider bg-white/5 border border-white/10 px-4 py-2 rounded-full group-hover:bg-[#00F5FF] group-hover:text-black transition-all duration-300 font-mono font-bold relative z-30"
                >
                  + ADD TO CART
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}