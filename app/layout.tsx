import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import { Loader } from "@/components/loader"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { CustomScrollbar } from "@/components/custom-scrollbar"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "NexlyDevs Development studio, shipped with care", template: "%s · NexlyDevs" },
  description: "NexlyDevs is a micro development studio building websites, software, and Android apps for specific industries.",
}

const BOOTSTRAP_SCRIPT = `
(function(){
  var root = document.documentElement;
  try {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    var isDark;
    if (saved === 'dark') isDark = true;
    else if (saved === 'light') isDark = false;
    else {
      try { isDark = window.matchMedia('(prefers-color-scheme: dark)').matches; }
      catch(e) { isDark = false; }
    }
    root.classList.toggle('dark', isDark);
  } catch(e) {}
  root.classList.add('is-loading');
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  } catch(e) {}
})();
`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: 'html, html body { overflow: auto !important; }' }} />
        </noscript>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <Loader />
          <CustomScrollbar />
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:border focus:border-border">
            Skip to content
          </a>
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}