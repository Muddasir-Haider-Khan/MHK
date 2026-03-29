import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import RealtimeProvider from "@/components/RealtimeProvider";
import SmoothScrolling from "@/components/SmoothScrolling";
import Cursor from "@/components/Cursor";
import SEOSchema from "@/components/SEOSchema";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Muddasir Haider Khan | AI Engineer & Web Designer", template: "%s | DevAI Consultants" },
  description: "Muddasir Haider Khan is a globally recognized AI Engineer, Web Designer, eCommerce Website Designer, and n8n Workflow Automation Expert based in Pakistan. Hire DevAI Consultants for custom scalable software.",
  keywords: ["Muddasir Haider Khan", "muddasir haider", "AI Engineer", "Web Designer", "eCommerce Website Designer", "n8n Workflow Designer", "DevAI Consultants", "hire best ai engineer", "Top freelance software developer Islamababad"],
  authors: [{ name: "Muddasir Haider Khan" }],
  creator: "Muddasir Haider Khan - DevAI Consultants",
  alternates: {
    canonical: "https://devaiconsultants.com"
  },
  openGraph: {
    title: "Muddasir Haider Khan | Top AI Engineer & Web Designer",
    description: "Muddasir Haider Khan is a globally recognized AI Engineer, Web Designer, eCommerce Website Designer, and n8n Workflow Automation Expert based in Pakistan. Hire DevAI Consultants.",
    url: "https://devaiconsultants.com",
    siteName: "Muddasir Haider Khan | DevAI-Consultants",
    type: "profile",
    firstName: "Muddasir",
    lastName: "Haider Khan",
    username: "muddasirhaider048",
    images: [{ url: "https://devaiconsultants.com/og-image.jpg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Muddasir Haider Khan | AI Engineer & Web Designer",
    description: "Hire Muddasir Haider Khan (DevAI Consultants) for custom AI Engineering, eCommerce, and n8n workflow design.",
    creator: "@muddasirhaider048" // Assuming this is close based on GitHub/IG handles
  },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          * { cursor: none !important; } /* Global custom cursor override */
          a, button, [role="button"], input, select, textarea { cursor: none !important; }
        `}} />
        <SEOSchema />
      </head>
      <body className="bg-[#f5f6ff] text-[#292f3b] overflow-x-hidden selection:bg-brand-purple selection:text-[#f8f0ff] min-h-full flex flex-col font-sans">
        <SmoothScrolling>
          <Cursor />
          {/* Global Noise — extremely subtle */}
          <div className="noise-overlay opacity-30" aria-hidden="true" />
          <RealtimeProvider />
          
          <Navbar />
          {children}
          <Analytics />
        </SmoothScrolling>
      </body>
    </html>
  );
}
