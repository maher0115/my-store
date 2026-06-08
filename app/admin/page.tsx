"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  total_price: number;
  items: any[];
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 🛡️ ضع إيميلك الخاص هنا لحماية اللوحة ومنع أي شخص آخر من دخولها
  const ADMIN_EMAIL = "32430378@students.liu.edu.lb"; 

  useEffect(() => {
    async function fetchOrders() {
      if (isLoaded && user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center font-mono">
        // LOADING_SECURE_METRICS... ⏳
      </div>
    );
  }

  // 🛑 إذا حاول مستخدم عادي الدخول يتم حظره فوراً
  if (user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-red-500 flex items-center justify-center font-mono text-center p-4">
        ❌ ERROR_403 // ACCESS_DENIED <br /> هذه المنطقة العسكرية مخصصة لمدير الموقع فقط!
      </div>
    );
  }

  // 📊 حساب الإحصائيات رياضياً لايف من الداتابيز
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((o) => o.customer_email)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white pt-24 pb-12 font-mono px-4 md:px-8 relative overflow-hidden">
      
      {/* شبكة الخلفية المضيئة */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* العناوين */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/5 pb-6">
          <div>
            <span className="text-[10px] tracking-widest text-[#00F5FF]">// PLATFORM_INTELLIGENCE_CENTER</span>
            <h1 className="text-2xl md:text-4xl font-black uppercase mt-1 tracking-wider">MATJARI // CONTROL_PANEL</h1>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-xl text-xs text-[#00F5FF]">
            ⚡ LIVE_DATA_FEED: CONNECTED
          </div>
        </div>

        {/* كروت الـ KPIs الأربعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl relative group hover:border-[#00F5FF]/30 transition-all">
            <div className="text-xs text-[#8A8A93] uppercase mb-2">// TOTAL_REVENUE</div>
            <div className="text-2xl font-black text-[#00F5FF] font-sans">${totalRevenue.toFixed(2)}</div>
            <div className="text-[9px] text-emerald-400 mt-2">↑ 100% Gross growth</div>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl relative group hover:border-[#00F5FF]/30 transition-all">
            <div className="text-xs text-[#8A8A93] uppercase mb-2">// TOTAL_ORDERS</div>
            <div className="text-2xl font-black text-white font-sans">{totalOrders}</div>
            <div className="text-[9px] text-[#8A8A93] mt-2">📦 إجمالي العمليات المسجلة</div>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl relative group hover:border-[#00F5FF]/30 transition-all">
            <div className="text-xs text-[#8A8A93] uppercase mb-2">// ACTIVE_CLIENTS</div>
            <div className="text-2xl font-black text-white font-sans">{uniqueCustomers}</div>
            <div className="text-[9px] text-emerald-400 mt-2">👤 زبائن متحقق منهم عبر Clerk</div>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl relative group hover:border-[#00F5FF]/30 transition-all">
            <div className="text-xs text-[#8A8A93] uppercase mb-2">// AVG_ORDER_VALUE</div>
            <div className="text-2xl font-black text-[#00F5FF] font-sans">${avgOrderValue.toFixed(2)}</div>
            <div className="text-[9px] text-[#8A8A93] mt-2">📊 متوسط قيمة الفاتورة الواحدة</div>
          </div>

        </div>

        {/* جدول الطلبيات الأحدث */}
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-black tracking-widest text-[#00F5FF] mb-6">// RECENT_TRANSACTIONS_LOG</h2>
          
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <p className="text-xs text-[#4A4A52] text-center py-8">// لم يتم تسجيل أي طلبات في قاعدة البيانات بعد.</p>
            ) : (
              <table className="w-full text-right md:text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[#8A8A93] uppercase text-[10px] tracking-wider">
                    <th className="pb-4 font-bold text-left">ORDER_ID</th>
                    <th className="pb-4 font-bold text-left">CUSTOMER</th>
                    <th className="pb-4 font-bold text-left">LOCATION</th>
                    <th className="pb-4 font-bold text-left">ITEMS_QTY</th>
                    <th className="pb-4 font-bold text-left">NET_AMOUNT</th>
                    <th className="pb-4 font-bold text-left">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-mono text-[10px] text-gray-500 text-left">#{order.id.slice(0, 8)}</td>
                      <td className="py-4 text-left">
                        <div className="font-bold text-white">{order.customer_name}</div>
                        <div className="text-[10px] text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="py-4 text-left">
                        <div className="text-white">{order.customer_city}</div>
                        <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{order.customer_address}</div>
                      </td>
                      <td className="py-4 font-bold text-white text-left">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} Pcs
                      </td>
                      <td className="py-4 font-sans font-black text-[#00F5FF] text-left">${Number(order.total_price).toFixed(2)}</td>
                      <td className="py-4 text-left">
                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md text-[9px] uppercase tracking-widest">
                          SUCCESS_PAID
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}