import { NextResponse } from "next/server";

// ✅ سحب آمن للمفاتيح والتوكنز من ملف الـ Environment Variables المستقر بالسيرفر
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: Request) {
  try {
    // استقبال نص الرسالة القادم من صفحة الـ Checkout
    const { telegramMessage } = await req.json();

    // 🛡️ فحص أمني: التأكد من أن السيرفر يحتوي على الـ Tokens المطلوبة قبل إرسال الطلب
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("❌ خطأ أمني: متغيرات التليجرام غير معرفة في ملف .env.local");
      return NextResponse.json(
        { error: "Configuration Error: Missing Environment Variables" },
        { status: 500 }
      );
    }

    // بناء رابط الإرسال الرسمي لتليجرام باستخدام التوكن المشفر
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // إرسال الطلب إلى سيرفرات تليجرام
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown", // لدعم النصوص العريضة والقوائم المرسلة من الكود
      }),
    });

    // التحقق من نجاح العملية
    if (response.ok) {
      return NextResponse.json({ success: true, message: "Order notification sent to Telegram!" });
    } else {
      const errorData = await response.json();
      console.error("Telegram API Refusal:", errorData);
      return NextResponse.json({ error: "Telegram failed to deliver the message" }, { status: 500 });
    }

  } catch (error) {
    console.error("Internal Server Error inside Telegram API Route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}