import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "100人の村シミュレーター | Global Village 100",
  description: "世界人口の統計データを「100人の村」として可視化する教育用Webアプリ。データを入力すると、100人のアイコンが色分けされ、世界をより身近に感じることができます。",
  keywords: ["統計", "世界人口", "100人の村", "教育", "可視化"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
