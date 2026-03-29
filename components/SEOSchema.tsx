import React from 'react';

export default function SEOSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      // WebSite Schema (Sitelinks)
      {
        "@type": "WebSite",
        "@id": "https://devaiconsultants.com/#website",
        "url": "https://devaiconsultants.com",
        "name": "Muddasir Haider Khan | DevAI Consultants",
        "description": "Top AI Engineer, Web Designer, and n8n Workflow Automation Expert.",
        "publisher": {
          "@id": "https://devaiconsultants.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://devaiconsultants.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      // Organization / Enterprise Schema
      {
        "@type": "Organization",
        "@id": "https://devaiconsultants.com/#organization",
        "name": "DevAI Consultants",
        "url": "https://devaiconsultants.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://devaiconsultants.com/og-image.jpg"
        },
        "sameAs": [
          "https://www.linkedin.com/in/muddasir-haider-khan/",
          "https://github.com/muddasir-haider"
        ]
      },
      // Person / Creator Schema (Crucial for entity claiming)
      {
        "@type": "Person",
        "@id": "https://devaiconsultants.com/#person",
        "name": "Muddasir Haider Khan",
        "jobTitle": [
          "AI Engineer",
          "Web Designer",
          "eCommerce Website Designer",
          "n8n Workflow Designer"
        ],
        "worksFor": {
          "@id": "https://devaiconsultants.com/#organization"
        },
        "url": "https://devaiconsultants.com",
        "sameAs": [
          "https://www.linkedin.com/in/muddasir-haider-khan/",
          "https://github.com/muddasir-haider"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Islamabad",
          "addressCountry": "PK"
        },
        "alumniOf": "Paradigm Academy"
      },
      // ProfessionalService Schema (For local & global agency ranking)
      {
        "@type": "ProfessionalService",
        "@id": "https://devaiconsultants.com/#service",
        "name": "DevAI Consultants by Muddasir Haider Khan",
        "description": "Premium Web Design, AI Engineering, eCommerce Development, and n8n Automation workflows globally.",
        "url": "https://devaiconsultants.com",
        "founder": {
          "@id": "https://devaiconsultants.com/#person"
        },
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 33.6844,
            "longitude": 73.0479
          },
          "geoRadius": "5000000" // Indicating global reach
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
