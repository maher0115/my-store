"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { useCart } from "./CartContext"; // 👈 استيراد جيران بنفس المجلد

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter(); 
  
  // 🛡️ هذا هو السطر الوحيد والنهائي للـ useCart! احذف أي سطر آخر يستدعي useCart في الملف.
  const { cart, addToCart, decreaseQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["ALL_NODES", "HARDWARE", "SOFTWARE", "CYBER_GEAR"];
  const cartCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const totalPrice = cart ? cart.reduce((total, item) => total + (item.price * item.quantity), 0) : 0;

  // ... باقي كود الـ Return والـ JSX مثل ما هو بدون أي تعديل

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* 📐 LOGO (LEFT) */}
            <Link href="/" className="text-xl font-black tracking-widest text-white hover:text-[#00F5FF] transition-colors duration-300 font-sans flex-shrink-0">
              MATJARI<span className="text-[#00F5FF]">.</span>
            </Link>

            {/* 🔍 SEARCH & FILTER (CENTER) */}
            <div className="flex-1 max-w-xl relative hidden md:block font-mono">
              <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-[#00F5FF]/40 transition-all">
                <span className="text-[#4A4A52] text-xs mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Search product... // SEARCH_NODE"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-[#4A4A52] focus:outline-none"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md transition-all ${
                    showFilters ? "bg-[#00F5FF] text-black" : "bg-white/5 text-[#8A8A93] hover:text-white"
                  }`}
                >
                  FILTER
                </button>
              </div>

              {/* CATEGORIES */}
              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0C] border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-lg">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setShowFilters(false); }}
                        className="text-[10px] px-2.5 py-1 rounded-md border border-white/5 text-[#8A8A93] hover:text-white"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 👤 PROFILE, CLERK & CART BUTTON (RIGHT) */}
            <div className="flex items-center gap-6 flex-shrink-0 font-mono">
              
              <Link href="/profile" className="text-xs text-[#8A8A93] hover:text-white transition-colors">
                Profile
              </Link>
              
              {isLoaded && isSignedIn ? (
                <UserButton />
              ) : (
                isLoaded && !isSignedIn && (
                  <SignInButton mode="modal">
                    <button className="text-xs bg-white text-black font-bold px-4 py-2 rounded-xl hover:bg-[#00F5FF] transition-all">
                      LOGIN
                    </button>
                  </SignInButton>
                )
              )}

              {/* 🛒 كبسة السلة الذكية - بتفتح السلايدر الجانبي هون */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-white/[0.02] border border-white/10 rounded-xl hover:border-[#00F5FF]/40 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-sm">🛒</span>
                <span className="text-xs text-[#8A8A93] hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#00F5FF] text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_#00F5FF]">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>
      </nav>

      {/* 🛑 القائمة الجانبية المنسدلة للسلة (CART DRAWER OVERLAY) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* خلفية معتمة عند الضغط عليها تقفل السلة */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          {/* جسم السلة الجانبي */}
          <div className="relative w-full max-w-md bg-[#0A0A0C] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl font-mono text-white animate-fade-in animate-slide-in">
            
            {/* الهيدر */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-black tracking-widest text-[#00F5FF]">// YOUR_CART_NODE ({cartCount})</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-xs text-[#8A8A93] hover:text-white">
                [ CLOSE ✕ ]
              </button>
            </div>

            {/* قائمة المنتجات المضافة */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-xs text-[#4A4A52] text-center pt-20">// CART_IS_EMPTY</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate text-white">{item.name}</h4>
                      <p className="text-[10px] text-[#00F5FF] font-sans mt-0.5">${item.price}</p>
                    </div>
                    
                    {/* أزرار التحكم بالكمية (+ / -) */}
                    <div className="flex items-center bg-white/5 rounded-md border border-white/5">
                      <button onClick={() => decreaseQuantity(item.id)} className="px-2 py-0.5 text-xs text-[#8A8A93] hover:text-white">-</button>
                      <span className="px-2 text-[11px] font-bold text-white">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="px-2 py-0.5 text-xs text-[#8A8A93] hover:text-white">+</button>
                    </div>

                    {/* زر حذف المنتج نهائياً */}
                    <button onClick={() => removeFromCart(item.id)} className="text-xs hover:text-red-400 transition-colors p-1" title="Remove item">
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* الفوتر والإجمالي وزر التشيك أوت */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A8A93]">TOTAL_PRICE:</span>
                <span className="text-[#00F5FF] font-sans font-black text-sm">${totalPrice}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="w-full py-3 bg-[#00F5FF] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                PROCEED TO CHECKOUT // 🚀
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}