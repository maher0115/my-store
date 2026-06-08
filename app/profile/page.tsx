"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // حالات كود التحقق OTP
  const [showOtpField, setShowOtpField] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("user_phone");
    const savedAddress = localStorage.getItem("user_address");
    if (savedPhone) {
      setPhone(savedPhone);
      setIsVerified(true); // إذا محفوظ سابقاً نعتبره مفعّل
    }
    if (savedAddress) setAddress(savedAddress);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // 🛡️ دالة فحص رقم الهاتف اللبناني بالملّيمتر
  const validateLebanesePhone = (num: string) => {
    const cleanNum = num.replace(/[\s-]/g, ""); // تنظيف الفراغات
    // فحص البادئات اللبنانية الشهيرة للموبايل والمكونة من 8 أرقام
    const regex = /^(03|70|71|76|78|79|81)\d{6}$/;
    return regex.test(cleanNum);
  };

  // 🚀 خطوة 1: بدء التحقق وإرسال الكود
  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateLebanesePhone(phone)) {
      setMessage("ERROR // رقم الهاتف اللبناني غير صحيح! يجب أن يتكون من 8 أرقام ويبدأ بـ (70,71,76,78,79,81,03)");
      return;
    }

    // توليد كود تحقق عشوائي من 4 أرقام (أو تثبيته للتيست بـ 1234)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setShowOtpField(true);
    
    // تنبيه العميل بالكود (محاكاة لإرسال الـ SMS)
    alert(`🤖 [CYBER_GATEWAY] كود التحقق المرسل لهاتفك هو: ${code}`);
  };

  // 🔑 خطوة 2: تأكيد الكود وحفظ البيانات النهائية
  const handleConfirmOtp = () => {
    if (userOtp === generatedOtp || userOtp === "1234") { // دعم كود طوارئ 1234 للتيست
      setIsVerified(true);
      setShowOtpField(false);
      
      setIsSaving(true);
      try {
        localStorage.setItem("user_phone", phone);
        localStorage.setItem("user_address", address);
        setMessage("SUCCESS // تم التحقق من هاتف اللبناني وحفظ البيانات بنجاح! 💾");
      } catch (err) {
        setMessage("ERROR // فشل في الحفظ المحلي.");
      } finally {
        setIsSaving(false);
      }
    } else {
      setMessage("ERROR // كود التحقق الذي أدخلته خاطئ! أعد المحاولة.");
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="h-screen bg-[#0A0A0C] flex items-center justify-center font-mono text-[#00F5FF]">
        // LOADING_SECURE_PROFILE...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white font-mono pb-20 pt-28">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6">
        <div className="border border-white/5 bg-white/[0.01] rounded-3xl p-8 backdrop-blur-sm relative">
          <div className="absolute top-4 left-4 text-[8px] text-[#00F5FF]">// SECURE_PHONE_VALIDATION_NODE</div>
          
          <h2 className="text-xl font-black uppercase tracking-wider mb-6">إعدادات الحساب والتوصيل الآمن</h2>

          <div className="space-y-3 mb-8 bg-white/[0.02] p-4 rounded-xl border border-white/5 text-xs">
            <p className="text-[#8A8A93]">الاسم: <span className="text-white font-sans font-bold">{user?.fullName}</span></p>
            <p className="text-[#8A8A93]">البريد الإلكتروني: <span className="text-white font-bold">{user?.primaryEmailAddress?.emailAddress}</span></p>
          </div>

          <form onSubmit={handleStartVerification} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase text-[#8A8A93] tracking-widest mb-2 flex justify-between">
                <span>رقم الهاتف اللبناني (*)</span>
                {isVerified && <span className="text-emerald-400">// VERIFIED ✓</span>}
              </label>
              <input
                type="tel"
                required
                disabled={showOtpField}
                placeholder="مثال: 71123456"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setIsVerified(false); // إعادة التفعيل إذا غير الرقم
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-[#4A4A52] focus:outline-none focus:border-[#00F5FF]/50 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#8A8A93] tracking-widest mb-2">عنوان التوصيل بالتفصيل (*)</label>
              <textarea
                required
                placeholder="المدينة، الشارع، البناية..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-[#4A4A52] focus:outline-none focus:border-[#00F5FF]/50 resize-none"
              />
            </div>

            {message && (
              <p className={`text-[11px] font-bold ${message.startsWith("SUCCESS") ? "text-emerald-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            {/* 🔑 حقل إدخال الـ OTP عند تفعيله آلياً */}
            {showOtpField && (
              <div className="bg-[#00F5FF]/5 border border-[#00F5FF]/20 p-4 rounded-2xl space-y-3 animate-fade-in">
                <label className="block text-[10px] uppercase text-[#00F5FF] tracking-widest">أدخل كود التحقق المتكون من 4 أرقام:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="X X X X"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-center font-bold tracking-widest text-white focus:outline-none focus:border-[#00F5FF]"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmOtp}
                    className="px-6 bg-[#00F5FF] text-black font-bold text-xs rounded-xl hover:bg-white transition-colors"
                  >
                    تأكيد الكود
                  </button>
                </div>
              </div>
            )}

            {!showOtpField && (
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-white text-black font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-[#00F5FF] transition-all duration-300"
              >
                {isVerified ? "UPDATE_AND_SAVE // 💾" : "VERIFY_PHONE_NUMBER // 🛡️"}
              </button>
            )}
          </form>

        </div>
      </div>
    </main>
  );
}