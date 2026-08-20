import React from "react";

interface SoftwareAppJsonLdProps {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  price?: string;
  priceCurrency?: string;
  ratingValue?: number;
  reviewCount?: number;
}

export function SoftwareAppJsonLd({
  name,
  description,
  url,
  applicationCategory,
  operatingSystem,
  price = "0",
  priceCurrency = "USD",
  ratingValue = 4.8,
  reviewCount = 1,
}: SoftwareAppJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  imageUrl?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  imageUrl,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Creator by Amusemac",
      url: "https://creator-amusemac.vercel.app",
    },
    image: imageUrl ? [imageUrl] : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  step: { name: string; text: string }[];
}

export function HowToJsonLd({ name, description, step }: HowToJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: step.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: s.text,
        },
      ],
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
