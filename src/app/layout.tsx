import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F4ECE1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://eventsbymer.com"),
  title: {
    default: "Events by Mer | Luxury Wedding & Event Planning Addis Ababa",
    template: "%s | Events by Mer",
  },
  description:
    "Events by Mer is Ethiopia's premier luxury wedding planning, event styling, and production house in Addis Ababa. Bespoke design, vendor curation, and flawless execution.",
  keywords: [
    "Luxury Wedding Planner Ethiopia",
    "Addis Ababa Event Planning",
    "Ethiopian Luxury Weddings",
    "Event Production Addis Ababa",
    "Wedding Styling and Floral Design Ethiopia",
    "Events by Mer",
  ],
  authors: [{ name: "Events by Mer" }],
  creator: "Events by Mer",
  publisher: "Events by Mer",
  alternates: {
    canonical: "https://eventsbymer.com",
  },
  openGraph: {
    title: "Events by Mer | Luxury Wedding & Event Planning Addis Ababa",
    description:
      "Premier luxury event planning and high-fashion wedding production in Addis Ababa, Ethiopia. Designed with purpose. Produced with excellence.",
    url: "https://eventsbymer.com",
    siteName: "Events by Mer",
    images: [
      {
        url: "/images/user_photos/service_ethiopian_ceremony.jpg",
        width: 1200,
        height: 630,
        alt: "Events by Mer Luxury Wedding Production",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events by Mer | Luxury Wedding & Event Planning Addis Ababa",
    description:
      "Premier luxury event planning and high-fashion wedding production in Addis Ababa, Ethiopia.",
    images: ["/images/user_photos/service_ethiopian_ceremony.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventPlanningService",
  name: "Events by Mer",
  description:
    "Premier luxury wedding planning, styling, and event production house in Addis Ababa, Ethiopia.",
  url: "https://eventsbymer.com",
  logo: "https://eventsbymer.com/icon.png",
  image: "https://eventsbymer.com/images/about-brand.webp",
  telephone: "+251911000000",
  email: "contact@eventsbymer.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bole Subcity",
    addressLocality: "Addis Ababa",
    addressCountry: "ET",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.010793,
    longitude: 38.761253,
  },
  areaServed: {
    "@type": "Country",
    name: "Ethiopia",
  },
  priceRange: "$$$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${pinyonScript.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (let name of names) caches.delete(name);
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
