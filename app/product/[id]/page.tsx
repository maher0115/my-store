import React from "react";
import { client } from "../../../sanity/lib/client";
import Navbar from "../../../components/Navbar"; 
import ProductDetailsClient from "./ProductDetailsClient";

// 1. دالة سحب منتج واحد محدد بالـ ID من Sanity
async function getSingleProduct(id: string) {
  const query = `*[_type == "product" && _id == $id][0] {
    "id": _id,
    name,
    price,
    description,
    "image": image.asset->url
  }`;
  
  const product = await client.fetch(query, { id });
  return product;
}

// 2. السيرفر كومبوننت الرئيسي
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // فك التشفير عن الـ id القادم من الرابط
  const { id } = await params;
  const product = await getSingleProduct(id);

  // إذا الزبون دخل آيدي مش موجود بالـ Sanity أصلاً
  if (!product) {
    return (
      <div className="h-screen bg-[#0A0A0C] flex flex-col items-center justify-center font-mono text-white">
        <p className="text-xs text-red-500">// ERROR_404: PRODUCT_NOT_FOUND</p>
        <p className="text-[10px] text-[#8A8A93] mt-2">المنتج غير موجود أو تم حذفه من لوحة التحكم.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white font-mono pb-20">
      {/* الهيدر */}
      <Navbar />
      
      {/* عرض تفاصيل المنتج الحقيقية */}
      <ProductDetailsClient product={product} />
    </main>
  );
}