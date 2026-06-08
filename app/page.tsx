import React from "react";
import { client } from "../sanity/lib/client"; // تأكد من مسار السانيتي عندك
import Navbar from "../components/Navbar"; 
import Link from "next/link";

// 1. دالة جلب كل المنتجات من Sanity للرئيسية
async function getAllProducts() {
  const query = `*[_type == "product"] {
    "id": _id,
    name,
    price,
    description,
    "image": image.asset->url
  }`;
  const products = await client.fetch(query);
  return products;
}

// 2. الصفحة الرئيسية
export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white font-mono pb-20 pt-28">
      {/* الهيدر */}
      <Navbar />

      {/* شبكة عرض المنتجات السيبرانية */}
      <div className="w-full px-8 md:px-12">
        <div className="mb-10">
          <span className="text-[10px] tracking-widest text-[#00F5FF]">// SYSTEM_ONLINE // MARKETPLACE_LOADED</span>
          <h1 className="text-2xl font-black mt-1 text-white uppercase tracking-wider">القطع المتوفرة</h1>
        </div>

        {/* عرض الكروت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id}
              className="group border border-white/5 bg-white/[0.01] rounded-2xl p-5 flex flex-col justify-between hover:border-[#00F5FF]/30 hover:bg-white/[0.02] transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-[8px] text-[#8A8A93] group-hover:text-[#00F5FF] transition-colors">// NODE_{product.id.slice(0,4)}</div>
              
              <div className="h-48 w-full flex items-center justify-center p-4 bg-white/[0.01] rounded-xl border border-white/5 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-bold text-white truncate font-sans">{product.name}</h3>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-[#8A8A93] group-hover:text-white transition-colors">VIEW_DETAILS →</span>
                  <span className="text-xs font-bold text-[#00F5FF]">${product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}