import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { SITE } from "@/content/site";
import { OFFICES } from "@/content/offices";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Rana Transport",
    "Rana Transports Nadiad",
    "transport company Gujarat",
    "truck transport Ahmedabad",
    "road freight India",
    "dumper transport",
    "heavy commercial vehicle transport",
    "Delhi Mumbai Industrial Corridor logistics",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/brand/rana-logo-og.jpg", width: 1850, height: 850, alt: "Rana Transport & Logistics" }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", images: ["/brand/rana-logo-og.jpg"] },
  icons: {
    icon: [
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/apple-icon.png",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: ["Rana Transports", "Dinesh Transport"],
  slogan: SITE.tagline,
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/brand/icon-512.png`,
  image: `${SITE.url}/brand/rana-logo-og.jpg`,
  telephone: SITE.phone,
  email: SITE.email,
  areaServed: { "@type": "Country", name: "India" },
  founder: { "@type": "Person", name: "Dinesh Vasantlal Rana" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Salun Bazaar, Rana Chowk",
    addressLocality: "Nadiad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  department: OFFICES.filter((o) => !o.isHQ).map((o) => ({
    "@type": "LocalBusiness",
    name: `${SITE.name} — ${o.label}`,
    address: { "@type": "PostalAddress", streetAddress: o.address, addressCountry: "IN" },
    telephone: SITE.phone,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-svh">
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingContact />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
