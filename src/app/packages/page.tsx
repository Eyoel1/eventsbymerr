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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PackageData>(PACKAGES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    contact: "",
    weddingDate: "",
    guestCount: "",
    notes: ""
  });

  const handleOpenModal = (pkg: PackageData) => {
    setSelectedPkg(pkg);
    setModalSubmitted(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalSubmitted(false);
    setModalData({
      name: "",
      contact: "",
      weddingDate: "",
      guestCount: "",
      notes: ""
    });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "630abce7-e18b-4de9-8b81-87c984494fa0";
      if (accessKey) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `💎 Package Inquiry: ${selectedPkg.title.en} - ${modalData.name}`,
            from_name: "Events by Mer Client Portal",
            package_name: selectedPkg.title.en,
            client_name: modalData.name,
            client_contact: modalData.contact,
            wedding_date: modalData.weddingDate || "Not provided",
            guest_count: modalData.guestCount || "Not provided",
            notes: modalData.notes || "None"
          })
        });
      }
    } catch {
      // Ignore network errors in local dev
    } finally {
      setIsSubmitting(false);
      setModalSubmitted(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2600);
    }
  };

  const generateWhatsAppUrl = (pkg: PackageData) => {
    const text = encodeURIComponent(
      `Hello Mer, I am reviewing your packages on eventsbymer.com/packages and would like to inquire about the "${pkg.title.en}" package for my wedding.`
    );
    return `https://wa.me/251953525354?text=${text}`;
  };

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

          <a
            href="https://wa.me/251953525354"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappHeaderBtn}
          >
            <span>WhatsApp Concierge</span>
          </a>
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

          <h1 className={styles.portalHeading}>
            {lang === "en" ? "Curated Wedding Planning Collections" : "የተሟሉ የሠርግ ዕቅድና ዝግጅት ፓኬጆች"}
          </h1>

          <p className={styles.portalSubtext}>
            {lang === "en"
              ? "Designed with intention, precision, and elegance. Review our packages below and inquire directly with Mer and our team."
              : "በጥንቃቄ እና በከፍተኛ ጥራት የተዘጋጁ የሠርግ ፓኬጆች። ከታች ያሉትን አማራጮች በመመልከት ለሠርግዎ ተስማሚ የሆነውን ይምረጡ።"}
          </p>
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

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.inquirePackageBtn}
                    onClick={() => handleOpenModal(pkg)}
                  >
                    <span>
                      {lang === "en"
                        ? `INQUIRE THIS PACKAGE →`
                        : `ይህንን ፓኬጅ ያማክሩ →`}
                    </span>
                  </button>

                  <a
                    href={generateWhatsAppUrl(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappQuickBtn}
                  >
                    <span>💬 WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Concierge Banner */}
      <section className={styles.customConciergeBanner}>
        <div className={styles.conciergeText}>
          <span className={styles.conciergeTag}>
            {lang === "en" ? "NEED BESPOKE CUSTOMIZATION?" : "ልዩና የተለየ ጥያቄ አለዎት?"}
          </span>
          <h3 className={styles.conciergeTitle}>
            {lang === "en"
              ? "Every wedding has a unique story. Let's tailor a bespoke proposal."
              : "እያንዳንዱ ሠርግ የራሱ የሆነ ውበት አለው። ለእርስዎ ልዩ የሆነ ዕቅድ እናዘጋጃለን።"}
          </h3>
          <p className={styles.conciergeDesc}>
            {lang === "en"
              ? "Direct phone and WhatsApp consultations are available directly with Mer for customized destination weddings and multi-day celebrations."
              : "ከሀገር ውጭ ለሚደረጉ ሠርጎች ወይም ለየት ላሉ ዝግጅቶች በቀጥታ በስልክ ወይም በዋትስአፕ ያማክሩን።"}
          </p>
        </div>

        <div className={styles.conciergeActions}>
          <a href="tel:+251953525354" className={styles.conciergeCallBtn}>
            📞 +251 953 525 354
          </a>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={handleCloseModal}
              aria-label="Close Modal"
            >
              ✕
            </button>

            <div className={styles.modalHeader}>
              <span className={styles.modalTag}>
                {lang === "en" ? "DIRECT INQUIRY" : "የፓኬጅ ማማከሪያ"}
              </span>
              <h3 className={styles.modalTitle}>
                {selectedPkg.title[lang]}
              </h3>
            </div>

            {modalSubmitted ? (
              <div className={styles.modalSuccessState}>
                <div style={{ fontSize: "36px", marginBottom: "12px", color: "var(--color-bronze)" }}>✦</div>
                <h4 className={styles.modalSuccessTitle}>
                  {lang === "en" ? "Inquiry Confirmed" : "መልዕክትዎ ደርሶናል"}
                </h4>
                <p className={styles.modalSuccessText}>
                  {lang === "en"
                    ? `Thank you for inquiring about ${selectedPkg.title.en}. Mer will review your wedding date and reach out personally within 24 hours.`
                    : `ስለ ${selectedPkg.title.am} ላቀረቡት ጥያቄ እናመሰግናለን። በ24 ሰዓታት ውስጥ በግል እንደውልልዎታለን።`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className={styles.modalForm}>
                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>
                    {lang === "en" ? "YOUR NAME / COUPLE'S NAMES" : "የእርስዎ ወይም የጥንዶቹ ስም"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "en" ? "e.g. Meron & Michael" : "ሙሉ ስም ያስገቡ"}
                    value={modalData.name}
                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>
                    {lang === "en" ? "PHONE / WHATSAPP / EMAIL" : "ስልክ ቁጥር ወይም ኢሜይል"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+251 9... / email@example.com"
                    value={modalData.contact}
                    onChange={(e) => setModalData({ ...modalData, contact: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>
                    {lang === "en" ? "PROPOSED WEDDING DATE" : "የሠርጉ ቀን"}
                  </label>
                  <input
                    type="date"
                    value={modalData.weddingDate}
                    onChange={(e) => setModalData({ ...modalData, weddingDate: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>
                    {lang === "en" ? "ESTIMATED GUEST COUNT" : "የእንግዶች ብዛት"}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === "en" ? "e.g. 350 Guests" : "ለምሳሌ፡ 350 እንግዶች"}
                    value={modalData.guestCount}
                    onChange={(e) => setModalData({ ...modalData, guestCount: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.modalFieldGroup}>
                  <label className={styles.modalFieldLabel}>
                    {lang === "en" ? "VISION & NOTES" : "ተጨማሪ ማስታወሻ ወይም ጥያቄ"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={lang === "en" ? "Share any venue, timing, or special requests..." : "ስለ ሠርጉ ዝግጅት ማወቅ የሚፈልጉትን ይፃፉልን..."}
                    value={modalData.notes}
                    onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                    className={styles.modalTextarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.modalSubmitBtn}
                >
                  <span>
                    {isSubmitting
                      ? lang === "en" ? "TRANSMITTING..." : "በመላክ ላይ..."
                      : lang === "en" ? "SUBMIT INQUIRY" : "ጥያቄውን ይላኩ"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
