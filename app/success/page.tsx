"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  
  // 🧹 تفريغ السلة تلقائياً بعد نجاح الطلب
  useEffect(() => {
    localStorage.removeItem("cyber_cart");
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center font-mono p-4 relative overflow-hidden">
      
      {/* خلفية مضيئة خفيفة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F5FF]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center bg-white/[0.01] border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-md max-w-lg w-full">
        
        {/* أيقونة النجاح */}
        <div className="w-20 h-20 bg-[#00F5FF]/10 border border-[#00F5FF]/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_#00F5FF80]">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black tracking-widest text-[#00F5FF] mb-2 uppercase">
          // ORDER_SUCCESSFUL
        </h1>
        
        <p className="text-[#8A8A93] text-sm md:text-base mb-8 leading-relaxed">
          تم استلام طلبك بنجاح! فريقنا رح يتواصل معك قريباً لتأكيد الشحن والتوصيل. شكراً لتسوقك من MATJARI.
        </p>

        {/* زر العودة للمتجر */}
        <Link 
          href="/" 
          onClick={() => window.location.href = "/"} 
          className="w-full py-4 bg-[#00F5FF] text-black font-black text-xs md:text-sm uppercase tracking-widest rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_15px_#00F5FF50]"
        >
          RETURN TO MAIN_FRAME // 🏠
        </Link>
        
      </div>
    </div>
  );
}