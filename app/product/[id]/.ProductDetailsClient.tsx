"use client";

import React from "react";
import { useCart } from "../../../components/CartContext";

export default function ProductDetailsClient({ product }: { product: any }) {
  // ✅ تم تغيير setIsOpen إلى setIsCartOpen ليتطابق مع الـ Context العالمي
  const { addToCart, setIsCartOpen } = useCart(); 

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* القسم الأيمن: صورة المنتج */}
      <div className="border border-white/10 bg-white/[0.01] rounded-3xl p-8 flex items-center justify-center group backdrop-blur-sm overflow-hidden relative">
        <div className="absolute top-4 left-4 text-[9px] text-[#00F5FF]">// IMAGE_NODE_SECURE</div>
        <img
          src={product.image}
          alt={product.name}
          className="max-h-[400px] object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* القسم الأيسر: التفاصيل والزر */}
      <div className="flex flex-col justify-center space-y-6">
        <div>
          <span className="text-[10px] tracking-widest text-[#00F5FF]">// PRODUCT_DETAILS_LOADED</span>
          <h1 className="text-3xl font-black mt-1 text-white font-sans">{product.name}</h1>
          <p className="text-2xl font-mono text-[#00F5FF] font-bold mt-3">${product.price}</p>
        </div>

        <div className="border-t border-b border-white/5 py-4">
          <p className="text-xs text-[#8A8A93] leading-relaxed font-sans text-right">
            {product.description || "لا يوجد وصف إضافي لهذا العتاد السيبراني."}
          </p>
        </div>

        {/* زر الإضافة الذكي */}
        <button
          onClick={() => {
            addToCart(product);
            setIsCartOpen(true); // 🔥 السلة الجانبية رح تفتح فوراً وسلايد من اليمين بوجه الزبون!
          }}
          className="w-full py-4 bg-[#00F5FF] text-black font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 shadow-[0_0_20px_rgba(0,245,255,0.15)]"
        >
          ADD_TO_CART // +
        </button>
      </div>
    </div>
  );
}