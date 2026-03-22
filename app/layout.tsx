import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "Muddasir Haider Khan | Top AI Engineer & Freelancer in Islamabad",
  description: "Muddasir Haider Khan is a Top AI Engineer and the best freelance software developer in Islamabad, Rawalpindi, and Pakistan. Hire Muddasir for custom machine learning, SaaS, and AI development globally.",
  keywords: "Muddasir Haider Khan, muddasir haider, top ai engineer, best ai engineer in the world, freelance software developer islamabad, freelancer rawalpindi, best ai developer pakistan, saas software engineer",
  alternates: {
    canonical: "https://portfolio-eta-blue-72.vercel.app"
  },
  openGraph: {
    title: "Muddasir Haider Khan | Top AI Engineer & Freelance Software Developer",
    description: "Hire Muddasir Haider Khan, the best freelance AI engineer and SaaS developer in Islamabad/Rawalpindi for global custom software solutions.",
    url: "https://portfolio-eta-blue-72.vercel.app",
    siteName: "Muddasir Haider Khan Portfolio",
    type: "profile",
    firstName: "Muddasir",
    lastName: "Haider Khan",
    username: "muddasirhaider048"
  }
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
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050505] text-white overflow-x-hidden selection:bg-brand-purple selection:text-white min-h-full flex flex-col font-sans">
        {/* Global Noise */}
        <div 
          className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay" 
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
        ></div>
        
        <Navbar />
        {children}

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muddasir Haider Khan",
              url: "https://portfolio-eta-blue-72.vercel.app",
              jobTitle: "Top AI Engineer & Freelance Software Developer",
              description: "Muddasir Haider Khan is the top AI engineer and freelance software developer based in Islamabad and Rawalpindi, Pakistan. He builds cutting-edge SaaS platforms and machine learning systems for global clients.",
              address: {
                "@type": "PostalAddress",
                "addressLocality": "Islamabad",
                "addressRegion": "Rawalpindi",
                "addressCountry": "PK"
              },
              sameAs: [
                "https://www.linkedin.com/in/muddasir-haider-khan/",
                "https://github.com/muddasir-haider"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
