import type { Metadata } from "next";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { SeedProvider } from "@/components/layout/seed-provider";

const display = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Detective Data — Investigate. Think. Solve.",
  description:
    "An educational detective game that teaches computational thinking, data literacy, pattern recognition, logical reasoning, and decision making.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
        <SeedProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-72px)]">{children}</main>
          <Toaster position="top-center" richColors closeButton />
        </SeedProvider>
      </body>
    </html>
  );
}
