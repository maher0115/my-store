import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "../components/CartContext"; 
import CartSidebar from "../components/CartSidebar"; 
import "./globals.css";

// استيراد الخطوط إذا كنت بتستعملها
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body className={inter.className}>
          <CartProvider>
            
            {/* زرع السلة الجانبية لتظهر فوق كل الصفحات */}
            <CartSidebar /> 
            
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}