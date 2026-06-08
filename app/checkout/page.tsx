"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext"; 
import { useUser } from "@clerk/nextjs"; // سحب بيانات المشتري من Clerk
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const { user, isLoaded: isUserLoaded } = useUser(); // جلب بيانات المستخدم الحالي

  // 📋 حقول الشحن
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔄 الـ Hook السحري: سحب كل معلومات البروفايل المتحقق منها تلقائياً
  useEffect(() => {
    if (isUserLoaded && user) {
      // 1. سحب رقم الهاتف المتحقق منه من Clerk (إذا كان متوفر)
      const verifiedPhone = user.primaryPhoneNumber?.phoneNumber || "";
      
      // 2. سحب تفاصيل العنوان من داتا البروفايل الإضافية (Metadata) في Clerk
      const savedCity = (user.unsafeMetadata?.city as string) || "";
      const savedAddress = (user.unsafeMetadata?.address as string) || "";

      setFormData({
        fullName: user.fullName || user.firstName || "", // الاسم الكامل
        phone: verifiedPhone || (user.unsafeMetadata?.phone as string) || "", // الهاتف
        city: savedCity, // المدينة المخزنة بالبروفايل
        address: savedAddress, // العنوان المخزن بالبروفايل
      });
    }
  }, [user, isUserLoaded]);

  // 🛡️ حساب الحسابات بأمان
  const cartTotal = cart ? cart.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
  const deliveryFee = cartTotal > 0 ? 5 : 0; 
  const totalPrice = cartTotal + deliveryFee;

  // 🔓 دالة الكتابة (تعديل البيانات لو أراد الزبون تغيير عنوان الشحن الحالي)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); 
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
      alert("الرجاء ملء جميع الحقول المطلوبة لإتمام الطلب!");
      return;
    }

    setLoading(true);

    let itemsText = "";
    cart.forEach((item) => {
      itemsText += `📦 *${item.name}*\n🔹 الكمية: ${item.quantity} | السعر: $${item.price}\n\n`;
    });

    const userEmail = user?.primaryEmailAddress?.emailAddress || "غير مسجل";

    const telegramMessage = `
🔔 *طلب جديد تم استلامه! // NEW_ORDER_NODE*
----------------------------------
👤 *تفاصيل المشتري:*
• الاسم: ${formData.fullName}
• الإيميل: ${userEmail} 📧
• الهاتف: ${formData.phone}
• المدينة: ${formData.city}
• العنوان: ${formData.address}

🛒 *المنتجات المطلوبة:*
${itemsText}
----------------------------------
💵 *الحساب الإجمالي:*
• *المجموع الكلي: $${totalPrice.toFixed(2)}*
    `;

    try {
      // 🔥 أولاً: حفظ الطلب في قاعدة بيانات Supabase
      const { error: dbError } = await supabase.from("orders").insert([
        {
          customer_name: formData.fullName,
          customer_email: userEmail,
          customer_phone: formData.phone,
          customer_city: formData.city,
          customer_address: formData.address,
          items: cart, 
          total_price: totalPrice,
        },
      ]);

      if (dbError) {
        console.error("Supabase Error:", dbError);
        // بنكمل عادي حتى لو الداتابيز فشلت عشان الزبون ما يعلق
      }

      // ⚡ ثانياً: إرسال الإشعار المعتاد للتليجرام
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramMessage }),
      });

      if (res.ok) {
        router.push("/success");
      } else {
        alert("حدث خطأ أثناء إرسال الطلب، الرجاء المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error(error);
      alert("فشل في معالجة الطلب برمجياً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white pt-28 pb-12 font-mono">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* الفورم الذكي المستورد للبيانات */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-black tracking-widest text-[#00F5FF] mb-6">// SHIPPING_INFO_NODE</h2>
          
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-[11px] text-[#8A8A93] uppercase mb-1">الاسم الكامل / Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F5FF]/40 transition-all"
                placeholder="جاري السحب من البروفايل..."
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#8A8A93] uppercase mb-1">رقم الهاتف / Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F5FF]/40 transition-all"
                placeholder="جاري السحب من البروفايل..."
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#8A8A93] uppercase mb-1">المدينة / City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F5FF]/40 transition-all"
                placeholder="بيروت، صيدا، طرابلس..."
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#8A8A93] uppercase mb-1">العنوان بالتفصيل / Full Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00F5FF]/40 transition-all"
                placeholder="الشارع، البناية، الطابق..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full py-4 bg-[#00F5FF] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all duration-300 disabled:opacity-30 mt-4"
            >
              {loading ? "PROCESSING_NODE... ⏳" : "CONFIRM ORDER // 🛍️"}
            </button>
          </form>
        </div>

        {/* ملخص الفاتورة */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-fit space-y-6">
          <div>
            <h2 className="text-base font-black tracking-widest text-[#00F5FF] mb-4">// ORDER_SUMMARY_NODE</h2>
            
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <p className="text-xs text-[#4A4A52]">// السلة فارغة حالياً</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                      <div className="truncate">
                        <h4 className="font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-[#8A8A93]">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-[#00F5FF] font-sans font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8A8A93]">المجموع الفرعي / Subtotal:</span>
              <span className="font-sans font-bold">${(cartTotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A93]">التوصيل / Delivery:</span>
              <span className="font-sans font-bold">${(deliveryFee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2.5 text-sm">
              <span className="text-white font-bold">المجموع الكلي / Total:</span>
              <span className="text-[#00F5FF] font-sans font-black">${(totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}