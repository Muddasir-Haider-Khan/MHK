import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { roles, locations } from '@/lib/seo-data';
import Navbar from '@/components/Navbar';

export const dynamic = 'force-static';
export const dynamicParams = true;

type Props = {
  params: Promise<{ role: string; location: string }>;
};

// Generate exactly 112 static routes (8 roles x 14 locations)
export function generateStaticParams() {
  const paths: { role: string; location: string }[] = [];

  for (const role of roles) {
    for (const location of locations) {
      paths.push({
        role: role.slug,
        location: location.slug,
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const role = roles.find((r) => r.slug === resolvedParams.role);
  const location = locations.find((l) => l.slug === resolvedParams.location);

  if (!role || !location) {
    return { title: 'Role Not Found' };
  }

  const baseKeyword = `Hire ${role.name} in ${location.name}`;
  const title = `${baseKeyword} | Freelance Expert | MHK`;
  const description = `Looking to ${baseKeyword.toLowerCase()}? Hire an expert freelance ${role.name} specializing in Next.js, AI, and SaaS architectures targeting the ${location.name} market. Connect today.`;

  return {
    title,
    description,
    keywords: `hire ${role.slug} ${location.name}, freelance ${role.slug} ${location.name}, remote ${role.slug} ${location.name}, top ${role.slug} pakistan`,
    alternates: {
      canonical: `https://portfolio-eta-blue-72.vercel.app/hire/${role.slug}/${location.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://portfolio-eta-blue-72.vercel.app/hire/${role.slug}/${location.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function ProgrammaticHirePage({ params }: Props) {
  const resolvedParams = await params;
  const role = roles.find((r) => r.slug === resolvedParams.role);
  const location = locations.find((l) => l.slug === resolvedParams.location);

  if (!role || !location) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Muddasir Haider Khan",
      "jobTitle": role.name,
      "url": "https://portfolio-eta-blue-72.vercel.app",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "alumniOf": "Self-Taught & Documented Projects"
    }
  };

  return (
    <main className="relative z-10 bg-[#050505] min-h-screen text-white pt-32 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-brand-accent uppercase tracking-widest text-sm font-semibold mb-4">
          Looking for talent in {location.name}?
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
          Hire Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-purple">{role.name}</span> in {location.name}
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed mb-12">
          Stop wasting money on slow agencies. I am an independent, highly skilled <strong>{role.name}</strong> ready to build 
          production-grade software tailored for <strong>{location.name}</strong>. I write clean code, architect scalable systems, and ship extremely fast.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <a 
            href="https://wa.me/923352767961" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-accent hover:bg-brand-purple transition-colors rounded-full font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            WhatsApp Me
          </a>
          <a 
            href="/" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 hover:bg-white/5 transition-colors rounded-full font-medium"
          >
            View My Portfolio
          </a>
        </div>
      </div>
    </main>
  );
}
