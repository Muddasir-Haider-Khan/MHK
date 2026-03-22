import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, locations } from '@/lib/seo-data';
import Navbar from '@/components/Navbar';

// Force static generation for all programmatic routes
export const dynamic = 'force-static';
// Generate pages on-demand if they weren't generated at build time
export const dynamicParams = true;

type Props = {
  params: Promise<{ service: string; location: string }>;
};

// Generate exactly 140 static routes (10 services x 14 locations)
export function generateStaticParams() {
  const paths: { service: string; location: string }[] = [];

  for (const service of services) {
    for (const location of locations) {
      paths.push({
        service: service.slug,
        location: location.slug,
      });
    }
  }

  return paths;
}

// Generate highly optimized schema and metadata for each combination
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params object in Next.js 15
  const resolvedParams = await params;
  const service = services.find((s) => s.slug === resolvedParams.service);
  const location = locations.find((l) => l.slug === resolvedParams.location);

  if (!service || !location) {
    return { title: 'Service Not Found' };
  }

  const baseKeyword = `${service.name} in ${location.name}`;
  const title = `Top ${baseKeyword} | Expert Freelancer | MHK`;
  const description = `Looking for the best ${baseKeyword}? I build custom, scalable software, AI, and SaaS solutions for businesses targeting ${location.name}. Hire an expert freelancer today.`;

  return {
    title,
    description,
    keywords: `${service.slug}, ${service.name}, ${location.name}, freelance ${service.slug} ${location.name}, best ${service.slug} company ${location.name}`,
    alternates: {
      canonical: `https://portfolio-eta-blue-72.vercel.app/services/${service.slug}/${location.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://portfolio-eta-blue-72.vercel.app/services/${service.slug}/${location.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function ProgrammaticServicePage({ params }: Props) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;
  const service = services.find((s) => s.slug === resolvedParams.service);
  const location = locations.find((l) => l.slug === resolvedParams.location);

  if (!service || !location) {
    notFound();
  }

  const baseKeyword = `${service.name} in ${location.name}`;

  // Structured Data (JSON-LD) tailored for local/niche SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "provider": {
      "@type": "Person",
      "name": "Muddasir Haider Khan",
      "jobTitle": "Freelance Software Engineer & AI Expert",
      "url": "https://portfolio-eta-blue-72.vercel.app"
    },
    "areaServed": {
      "@type": "Place",
      "name": location.name
    },
    "description": `Professional ${service.name} specifically crafted for clients in ${location.name}. High-performance, scalable MVP and enterprise AI solutions.`
  };

  return (
    <main className="relative z-10 bg-[#050505] min-h-screen text-white pt-32 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-brand-purple uppercase tracking-widest text-sm font-semibold mb-4">
          Software & AI Solutions &gt; {location.name}
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
          Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-accent">{service.name}</span> in {location.name}
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed mb-12">
          Are you looking to build or scale a digital product for the <strong className="text-white">{location.name}</strong> market? 
          From intelligent Machine Learning models to high-conversion SaaS applications, I specialize in delivering end-to-end <strong>{service.name}</strong> tailored to your unique business needs.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-4 font-display">Why Hire Me for {service.name}?</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-2">✔ <span className="text-gray-300">Production-ready code architecture</span></li>
              <li className="flex gap-2">✔ <span className="text-gray-300">Fast delivery with modern tech (Next.js, AI APIs)</span></li>
              <li className="flex gap-2">✔ <span className="text-gray-300">Affordable freelance rates vs. costly agencies</span></li>
              <li className="flex gap-2">✔ <span className="text-gray-300">Specifically targeting and understanding {location.name}</span></li>
            </ul>
          </div>
          <div className="glass-card p-8 bg-brand-purple/5 border-brand-purple/20">
            <h3 className="text-xl font-bold mb-4 font-display">Ready to build?</h3>
            <p className="text-gray-300 mb-6">Let's discuss how we can implement world-class software for your business.</p>
            <a 
              href="https://wa.me/923352767961" 
              className="inline-block px-8 py-4 bg-brand-purple hover:bg-brand-accent transition-colors rounded-full font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            >
              Contact Me on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
