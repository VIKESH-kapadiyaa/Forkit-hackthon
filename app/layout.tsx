import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/glassmorphism/NavBar';
import SmoothScroll from '@/components/SmoothScroll';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "O'F00D — VeriFood Community",
  description: 'AI-Powered Food Verification, Spoilage Detection & Community Trust Platform powered by Foodoscope',
  keywords: ['food verification', 'spoilage detection', 'food safety', 'AI analysis', 'refund claims'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrains.variable} font-[family-name:var(--font-outfit)] min-h-screen bg-[#e2e5b3] pb-28 md:pb-0`}>
        <SmoothScroll />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
