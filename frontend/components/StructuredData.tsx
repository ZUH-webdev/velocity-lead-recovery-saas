export default function StructuredData() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Velocity',
    url: 'https://velocity-ai.site',
    logo: 'https://velocity-ai.site/velocity-logo.webp',
    founder: {
      '@type': 'Person',
      name: 'Zain Ul Hassan',
      jobTitle: 'Founder',
      url: 'https://velocity-ai.site/about',
      sameAs: [
        'https://zainulhassan.site',
        'https://www.linkedin.com/in/zain-ul-hassan-dev',
        'https://github.com/ZUH-webdev',
        'https://www.upwork.com/freelancers/~01143c0f702d75da0d',
      ],
    },
    // add LinkedIn/X/Twitter URLs here once finalized
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
  );
}
