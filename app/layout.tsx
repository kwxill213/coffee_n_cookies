import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coffee n Cookies - Уютное кафе с домашней атмосферой",
  description: "Насладитесь великолепным кофе и свежеиспеченным печеньем в нашем уютном кафе. Каждый глоток и кусочек создают особую атмосферу комфорта и вкуса.",
  keywords: ["кофе", "печенье", "кафе", "уютное место", "горячие напитки"],
  openGraph: {
    title: "Coffee n Cookies - Уютное кафе",
    description: "Насладитесь великолепным кофе и свежеиспеченным печеньем",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-coffee-50 text-coffee-800`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
