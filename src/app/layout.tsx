import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/Toaster";
import { AICounselor } from "@/components/AICounselor";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentoria Hub — Opportunities & Async Courses",
  description:
    "The EdTech platform where students in grades 8–11 discover opportunities and learn at their own pace.",
};

// Set theme before paint to avoid flash.
const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem('mentoria-hub-v1')||'{}');if(s.theme==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <AICounselor />
          <CommandPalette />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
