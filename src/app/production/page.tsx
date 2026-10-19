"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Signature from "@/components/Signature";
import styles from "./production.module.css";

interface DeliverableItem {
  en: string;
  am: string;
}

interface ProductionSection {
  title: { en: string; am: string };
  icon: string;
  items: DeliverableItem[];
}

const PRODUCTION_SECTIONS: ProductionSection[] = [
  {
    title: {
      en: "Landscape",
      am: "ላንድስኬፕ (Landscape)"
    },
    icon: "📸",
    items: [
      {
        en: "2 Laminated Albums — 40x60 and 30x45",
        am: "2 ሌሚኔትድ አልበሞች — 40x60 እና 30x45"
      },
      {
        en: "Short Cinematic Highlight Video",
        am: "አጭር ሲኒማቲክ ቪዲዮ (Highlight Reel)"
      },
      {
        en: "MDF Board — 60x90",
        am: "MDF ቦርድ — 60x90"
      },
      {
        en: "300 Custom Thank You Cards",
        am: "300 የተዘጋጁ የምስጋና ካርዶች"
      }
    ]
  },
  {
    title: {
      en: "Wedding Day",
      am: "የሠርጉ ዕለት ፕሮዳክሽን (Wedding Day)"
    },
    icon: "🎥",
    items: [
      {
        en: "1 Luxury Album — 30x90",
        am: "1 የቅንጦት አልበም — 30x90"
      },
      {
        en: "Long and Short Version Video (Feature Film & Reel)",
        am: "ሙሉ እና አጭር የቪዲዮ እትሞች (Long & Short)"
      },
      {
        en: "High-Resolution Photography — Including Soft Copy",
        am: "ሙሉ ፎቶግራፍ — ከሶፍት ኮፒ ጋር (Including Soft Copy)"
      },
      {
        en: "1 Bespoke Guest Signing Book",
        am: "1 የእንግዶች መፈረሚያ ደብተር"
      },
      {
        en: "MDF Board — 50x80",
        am: "MDF ቦርድ — 50x80"
      },
      {
        en: "Dedicated Content Creator (Reels & Behind-The-Scenes)",
        am: "የማህበራዊ ሚዲያ ይዘት ፈጣሪ (Content Creator)"
      }
    ]
  }
];

export default function ProductionPage() {
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
            {lang === "en" ? "PRODUCTION COLLECTION" : "የፕሮዳክሽን ስብስብ"}
          </span>

          <div className={styles.signatureWrapper}>
            <Signature />
          </div>
        </div>
      </section>

      {/* Master Wedding Production Package Section */}
      <section className={styles.productionSection}>
        <div className={styles.masterCard}>
          <div className={styles.cardMainHeader}>
            <span className={styles.packageTagline}>
              {lang === "en" ? "PHOTO & CINEMATIC VIDEO" : "የፎቶ እና ሲኒማቲክ ቪዲዮ"}
            </span>
            <h1 className={styles.packageMainTitle}>
              {lang === "en" ? "Wedding Production Package" : "የሠርግ ፕሮዳክሽን ፓኬጅ"}
            </h1>
          </div>

          <div className={styles.sectionsGrid}>
            {PRODUCTION_SECTIONS.map((section, sIdx) => (
              <div key={sIdx} className={styles.productionSubSection}>
                <div className={styles.subSectionHeader}>
                  <span className={styles.subSectionIcon}>{section.icon}</span>
                  <h2 className={styles.subSectionTitle}>{section.title[lang]}</h2>
                </div>

                <ul className={styles.featuresList}>
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className={styles.featureItem}>
                      <span className={styles.checkIcon}>✦</span>
                      <span>{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
