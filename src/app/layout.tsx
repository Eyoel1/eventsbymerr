import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Events by Mer | Luxury Event & Wedding Planning Addis Ababa",
  description: "Events by Mer is a premier luxury event planning and production company based in Addis Ababa, Ethiopia. We specialize in designing and producing unforgettable weddings, private celebrations, and elegant styling.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    google: "notranslate",
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
    >
      <body>
        {children}
      </body>
    </html>
  );
}
