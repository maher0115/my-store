import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramMessage } = body;

    const TELEGRAM_TOKEN = "8832714254:AAFXXYLxnRaCfmNCct19gt7ibKHblQfqdsk"; 
    const CHAT_ID = "6738473984"; 

    // استخدام رابط تيليجرام الرسمي والمباشر (الأكثر استقراراً)
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    // تنظيف النص لضمان عدم رفض تيليجرام له
    const cleanMessage = telegramMessage.replace(/<[^>]*>?/gm, '');

    const telegramRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: cleanMessage,
      }),
    });

    // 🛡️ قراءة الرد كنص أولاً، لمنع كراش الـ JSON إذا كان هناك حجب أو صفحة خطأ
    const responseText = await telegramRes.text();
    console.log("الرد الخام من السيرفر:", responseText);

    if (!telegramRes.ok) {
      return NextResponse.json({ 
        error: "فشل الإرسال. تأكد من تشغيل VPN إذا كنت على Localhost." 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API_TELEGRAM_ERROR:", error);
    return NextResponse.json({ 
      error: "انقطع الاتصال بتيليجرام (قم بتشغيل VPN على الكمبيوتر)" 
    }, { status: 500 });
  }
}