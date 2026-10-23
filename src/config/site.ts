export interface SiteConfig {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  contact: {
    phone: string;
    phoneFormatted: string;
    whatsapp: string;
    email: string;
    salesEmail: string;
    supportEmail: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      full: string;
    };
    hours: string;
    googleMapsEmbed: string;
  };
  stats: {
    label: string;
    value: string;
    suffix?: string;
    numericValue: number;
    description: string;
  }[];
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    youtube: string;
  };
  nav: {
    title: string;
    href: string;
    badge?: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "PdVolts Industries",
  shortName: "PdVolts",
  legalName: "PdVolts Precision Polymers & Cables Ltd.",
  tagline: "Engineered Precision in Industrial Wires, Cables & Advanced Polymers",
  description: "Global manufacturer and exporter of heavy-duty electrical wires, industrial cables, PVC insulated conductors, and custom engineered plastic components for automotive, power, and OEM infrastructure.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  contact: {
    phone: "+1 (800) 555-8658",
    phoneFormatted: "+1-800-555-VOLT",
    whatsapp: "+12125550199",
    email: "info@pdvolts.com",
    salesEmail: "sales@pdvolts.com",
    supportEmail: "support@pdvolts.com",
    address: {
      street: "4500 Industrial Parkway, Sector 9",
      city: "Houston",
      state: "TX",
      zip: "75001",
      country: "United States",
      full: "4500 Industrial Parkway, Sector 9, Houston, TX 75001, USA",
    },
    hours: "Mon - Fri: 8:00 AM - 6:00 PM CST | Sat: 9:00 AM - 1:00 PM CST",
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3464.38531998492!2d-95.3698!3d29.7604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDQ1JzM3LjQiTiA5NcKwMjInMTEuMyJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
  },
  stats: [
    {
      label: "Years in Operation",
      value: "28+",
      numericValue: 28,
      description: "Dedicated to precision manufacturing excellence since 1998",
    },
    {
      label: "Annual Production",
      value: "85,000",
      suffix: " MT",
      numericValue: 85000,
      description: "Metric tons of wires, cables, and polymer components extruded annually",
    },
    {
      label: "Global Enterprise Clients",
      value: "1,450+",
      numericValue: 1450,
      description: "Serving EPC contractors, automotive tiers, and OEMs worldwide",
    },
    {
      label: "Countries Served",
      value: "45+",
      numericValue: 45,
      description: "International distribution networks and direct exports",
    },
    {
      label: "Certified Products",
      value: "500+",
      numericValue: 500,
      description: "UL, CE, RoHS, and ISO certified wire & plastic formulations",
    },
  ],
  social: {
    linkedin: "https://www.linkedin.com/company/pdvolts-industrial",
    twitter: "https://twitter.com/pdvolts",
    facebook: "https://facebook.com/pdvolts",
    youtube: "https://youtube.com/@pdvolts",
  },
  nav: [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Products", href: "/products" },
    { title: "Industries", href: "/industries" },
    { title: "Manufacturing", href: "/manufacturing" },
    { title: "Quality & Certs", href: "/quality" },
    { title: "Gallery", href: "/gallery" },
    { title: "Downloads", href: "/downloads" },
    { title: "Careers", href: "/careers" },
    { title: "News & Insights", href: "/blog" },
    { title: "FAQ", href: "/faq" },
    { title: "Contact", href: "/contact" },
  ],
};
