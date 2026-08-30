"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Signature from "@/components/Signature";
import styles from "./packages.module.css";

interface PackageData {
  id: string;
  num: string;
  title: { en: string; am: string };
  features: { en: string[]; am: string[] };
}

const PACKAGES: PackageData[] = [
  {
    id: "exclusive",
    num: "01",
    title: {
      en: "Exclusive",
      am: "Exclusive"
    },
    features: {
      am: [
        "በFull Wedding Planning ፓኬጅ ውስጥ የተካተቱ ሁሉም አገልግሎቶች",
        "ያልተገደበ የዕቅድና የምክር ድጋፍ",
        "ሙሉ የሠርግ ዕቅድ",
        "የግል የሠርግ ጽንሰ-ሀሳብ (Wedding Concept)",
        "የሠርግ ዲዛይን አቅጣጫ መስጠት",
        "የበጀት አስተዳደር",
        "Premium Vendor ፍለጋና ምርጫ",
        "የVendor ድርድርና የውል አስተዳደር",
        "የእንግዶች ዝርዝርና RSVP አስተዳደር",
        "የዲኮርና አጠቃላይ ዲዛይን ዕቅድ",
        "Floor Plan — የእንግዶች መቀመጫ ዕቅድ",
        "ከሀገር ውጭ ለሚመጡ እንግዶች የማረፊያ ቦታ ማስተባበር",
        "የተመደበ የሠርግ ቀን ቡድን",
        "VIP እንግዶችንና ቤተሰብን ማስተባበር",
        "የሙሽራ የድንገተኛ ጊዜ መሣሪያ ሳጥን ( Emergency kit)",
        "ልዩ ዲጂታል የእንግዶች ፎቶ ጋለሪ",
        "በአዳራሹ የCharging Station አገልግሎት",
        "ለእንግዶች የዳንስ ስሊፐር",
        "ልዩ የሠርግ አክሰሰሪዎች — Bride Fan፣ Customized Glasses ወዘተ",
        "ከሠርጉ በፊት ወይም በኋላ ከሚደረጉ ዝግጅቶች ሁለቱን ሙሉ በሙሉ ማስተባበር (ሽምግልና፣ መልስ፣ Engagement ወዘተ)"
      ],
      en: [
        "Includes All Services from the Full Wedding Planning Package",
        "Unlimited Planning & Consultation Support",
        "Full Wedding Planning",
        "Personalized Wedding Concept",
        "Wedding Design Direction",
        "Budget Management",
        "Premium Vendor Search & Selection",
        "Vendor Negotiation & Contract Management",
        "Guest List & RSVP Management",
        "Decor & Overall Design Planning",
        "Floor Plan — Guest Seating Plan",
        "Accommodation Coordination for Out-of-Country / Diaspora Guests",
        "Dedicated Wedding Day Team",
        "VIP Guests & Family Coordination",
        "Bridal Emergency Kit",
        "Special Digital Guest Photo Gallery",
        "In-Hall Charging Station Service",
        "Dance Slippers for Guests",
        "Special Wedding Accessories — Bride Fan, Customized Glasses, etc.",
        "Full Coordination for Two Pre/Post-Wedding Events (Shimglina, Mels, Engagement, etc.)"
      ]
    }
  },
  {
    id: "full-wedding-planning",
    num: "02",
    title: {
      en: "Full wedding planning",
      am: "Full wedding planning"
    },
    features: {
      am: [
        "በWedding Day Coordination ፓኬጅ ውስጥ የተካተቱ ሁሉም አገልግሎቶች",
        "የግል የሠርግ ዕቅድ ዝርዝር (Planning Checklist)",
        "ዋና የሠርግ የጊዜ ሰሌዳ ማዘጋጀት",
        "የሠርግ በጀት ዕቅድ ማዘጋጀት",
        "ተስማሚ የአገልግሎት ሰጪዎችን መፈለግና ማማረጥ",
        "ከVendors ጋር ድርድርና ማስተባበር",
        "የVendor ውልና የክፍያ መርሃ ግብር ክትትል",
        "የሠርጉን አጠቃላይ ዲዛይን ማማከር",
        "የቅድመ-ሠርግ ፎቶ ቀረጻ ማስተባበር",
        "የሠርግ ልምምድ (Rehearsal) ማስተባበር",
        "የሠርጉ ዕለት ዝርዝር መርሃ ግብር ማዘጋጀት",
        "የሰርጉ ቀን የተመደቡ የማስተባበሪያ ባለሙያዎች",
        "የሠርጉ ቀን የተሟላ ማስተባበር"
      ],
      en: [
        "All Services Included in the Wedding Day Coordination Package",
        "Personalized Wedding Planning Checklist",
        "Master Wedding Timeline Preparation",
        "Wedding Budget Plan Preparation",
        "Sourcing & Selecting Suitable Vendors",
        "Vendor Negotiations & Coordination",
        "Vendor Contract & Payment Schedule Follow-up",
        "Overall Wedding Design Consultation",
        "Pre-Wedding Photoshoot Coordination",
        "Wedding Rehearsal Coordination",
        "Wedding Day Detailed Schedule Preparation",
        "Dedicated Coordination Professionals on the Wedding Day",
        "Complete Wedding Day Coordination"
      ]
    }
  },
  {
    id: "wedding-day-coordination",
    num: "03",
    title: {
      en: "Wedding day Coordination",
      am: "Wedding day Coordination"
    },
    features: {
      am: [
        "የሠርጉ ዕለት የጊዜ ሰሌዳ ማዘጋጀት",
        "ከአገልግሎት ሰጪዎች (Vendors) ጋር የመጨረሻ ማረጋገጫና ማስተባበር",
        "የሙሽራና የሠርግ ቡድን ማስተባበር",
        "የሙሽራ ቤተሰብ ኮሚቴ ማስተባበር",
        "የሠርጉ ሥነ-ሥርዓት ልምምድ (Rehearsal) ማስተባበር",
        "የእንግዶች መቀበያና የአስተናጋጆች (Ushers) ማስተባበር",
        "የመስተንግዶ ፕሮግራም ማስተባበር",
        "የጥንዶቹ የግል የዕለቱ ጊዜ ሰሌዳ",
        "የአገልግሎት ሰጪዎችን መጨረሻ ሂደት ማስተባበር",
        "የሠርጉ ቀን የድንገተኛ ጊዜ መሣሪያ ሳጥን (Emergency Kit)",
        "የሠርጉ ቀን የተመደቡ የማስተባበሪያ ባለሙያዎች"
      ],
      en: [
        "Wedding Day Timeline Preparation",
        "Final Confirmation & Coordination with Vendors",
        "Bride & Wedding Party Coordination",
        "Bride Family Committee Coordination",
        "Wedding Ceremony Rehearsal Coordination",
        "Guest Reception & Ushers Coordination",
        "Hospitality / Catering Program Coordination",
        "Couple's Personal Schedule for the Day",
        "Final Process Coordination for Service Providers",
        "Wedding Day Emergency Kit",
        "Dedicated Coordination Professionals on the Wedding Day"
      ]
    }
  }
];

export default function PackagesPage() {
  const [lang, setLang] = useState<"en" | "am">("en");

  return (
    <main className={styles.portalMain}>
      {/* Floating Header */}
      <header className={styles.portalHeader}>
        <Link href="/" className={styles.brandHomeLink}>
          <Image
            src="/images/logo.webp"
            alt="Events by Mer Emblem"
            width={38}
            height={38}
            className={styles.brandLogoImage}
            priority
          />
          <span className={styles.brandName}>Events by Mer</span>
        </Link>

        <div className={styles.headerActions}>
          {/* Language Switcher */}
          <div className={styles.langSwitcher} role="group" aria-label="Language Toggle">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`${styles.langBtn} ${lang === "en" ? styles.activeLang : ""}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("am")}
              className={`${styles.langBtn} ${lang === "am" ? styles.activeLang : ""}`}
            >
              አማርኛ
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.portalHero}>
        <svg className={styles.heroArchSvg} viewBox="0 0 800 1000" aria-hidden="true" role="presentation">
          <path d="M 120 1000 V 420 A 280 280 0 0 1 680 420 V 1000" className={styles.heroArchMainPath} />
          <path d="M 160 1000 V 435 A 240 240 0 0 1 640 435 V 1000" className={styles.heroArchInnerPath} />
        </svg>

        <div className={styles.heroContent}>
          <span className={styles.portalBadge}>
            {lang === "en" ? "WEDDING PACKAGES" : "የሠርግ ፓኬጆች"}
          </span>

          <div className={styles.signatureWrapper}>
            <Signature />
          </div>
        </div>
      </section>

      {/* 3-Column Luxury Packages Grid */}
      <section className={styles.packagesGridSection}>
        <div className={styles.packagesGrid}>
          {PACKAGES.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={styles.packageCard}
              >
                <div>
                  <div className={styles.cardHeader}>
                    <span className={styles.packageNum}>TIER {pkg.num}</span>
                    <h2 className={styles.packageTitle}>{pkg.title[lang]}</h2>
                  </div>

                  <ul className={styles.featuresList}>
                    {pkg.features[lang].map((item, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <span className={styles.checkIcon}>✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
