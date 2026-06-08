"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

export default function CartSidebar(): React.ReactNode {
  const { cart, isOpen, setIsOpen, removeFromCart, cartTotal } = useCart() as any;
  const router = useRouter();
  const { isSignedIn } = useUser(); // استدعاء حالة تسجيل الدخول

  // حساب المجموع بشكل آمن تماماً سواء كان دالة أو رقماً لمنع تجمد الصفحة
  const getDisplayTotal = () => {
    if (typeof cartTotal === "function") {
      return (cartTotal() || 0).toFixed(2);
    }
    return (Number(cartTotal) || 0).toFixed(2);
  };

  // فنكشن الدفع الذكي 🧠
  const handleSmartCheckout = () => {
    // 1. فحص إذا العميل مسجل دخول
    if (!isSignedIn) {
      alert("الرجاء تسجيل الدخول أولاً لإتمام الطلب!");
      return;
    }

    // 2. فحص الداتا اللبنانية بالذاكرة
    const savedPhone = localStorage.getItem("user_phone");
    const savedAddress = localStorage.getItem("user_address");

    if (!savedPhone || !savedAddress) {
      alert("يجب تعبئة رقم الهاتف اللبناني وعنوان التوصيل لإتمام الطلب!");
      setIsOpen(false); // نسكر السلة
      router.push("/profile"); // التوجيه التلقائي للبروفايل
      return;
    }

    // 3. التوجيه لصفحة الفاتورة إذا كل شي تمام
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          
          {/* الخلفية المغبشة ورا السلة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* جسم السلة الجانبية */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0C] border-l border-white/10 p-8 flex flex-col justify-between text-white font-mono shadow-[-10px_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* الجزء العلوي */}
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-sm tracking-widest font-bold">// YOUR CART ({cart?.length || 0})</h3>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-xs text-[#8A8A93] hover:text-[#00F5FF] p-2"
                >
                  [ CLOSE ]
                </button>
              </div>

              {/* قائمة المنتجات */}
              <div className="mt-8 space-y-6 overflow-y-auto max-h-[65vh] pr-2">
                {!cart || cart.length === 0 ? (
                  <p className="text-xs text-[#8A8A93] text-center pt-20">CART IS EMPTY_</p>
                ) : (
                  cart.map((item: any) => {
                    // تأمين جلب المعرف سواء كان id أو _id من السلة
                    const itemId = item.id || item._id;
                    return (
                      <div key={itemId} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <p className="text-[10px] text-[#8A8A93] mt-1">${item.price} x {item.quantity}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(itemId)} 
                          className="text-[10px] text-red-400 hover:text-red-500 p-2 font-bold"
                        >
                          REMOVE
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* الجزء السفلي */}
            <div className="border-t border-white/10 pt-6 bg-[#0A0A0C]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs text-[#8A8A93]">TOTAL_</span>
                <span className="text-base font-bold text-[#00F5FF]">${getDisplayTotal()}</span>
              </div>
              
              {/* زر التوصيل والتشيك أوت الذكي */}
              <button 
                onClick={handleSmartCheckout}
                className="w-full py-4 bg-[#00F5FF] text-black font-bold text-xs tracking-widest uppercase rounded-full hover:bg-white transition-colors duration-300 shadow-[0_0_25px_rgba(0,245,255,0.2)]"
              >
                PROCEED TO CHECKOUT →
              </button>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}