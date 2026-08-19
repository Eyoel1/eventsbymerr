"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";

const Signature = dynamic(() => import("@/components/Signature"), { ssr: false });
const ServicesAccordion = dynamic(() => import("@/components/ServicesAccordion"), { ssr: false });

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "Full-Wedding Planning & Coordination",
    date: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
            subject: `✨ New Inquiry: ${formData.eventType} - ${formData.name}`,
            from_name: "Events by Mer Website",
            client_name: formData.name,
            client_email: formData.email,
            event_type: formData.eventType,
            event_date: formData.date || "Not provided",
            details: formData.message
          })
        });
      }
    } catch {
      // Ignore network errors in local dev
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          eventType: "Full-Wedding Planning & Coordination",
          date: "",
          message: ""
        });
      }, 2500);
    }
  };

  return (
    <main className={styles.main}>

      {/* Floating Header - Centered Logo Split Header */}
      <header className={styles.header} role="banner">
        <nav className={`${styles.navLinks} ${styles.navLeft}`} aria-label="Primary Navigation Left">
          <a href="#home" className={styles.navLink} aria-label="Navigate to Home">
            <span>Home</span>
          </a>
          <a href="#services" className={styles.navLink} aria-label="Navigate to Services Catalog">
            <span>Services</span>
          </a>
        </nav>

        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Image
              src="/images/logo.webp"
              alt="Events by Mer Brand Logo Emblem"
              width={40}
              height={40}
              priority
              className={styles.logoImage}
            />
          </div>
          <span className={styles.logoText}>Events by Mer</span>
        </div>
        
        <nav className={`${styles.navLinks} ${styles.navRight}`} aria-label="Primary Navigation Right">
          <a href="#about" className={styles.navLink} aria-label="Navigate to About Us">
            <span>About</span>
          </a>
          <a href="#contact" className={styles.headerInquireBtn} aria-label="Navigate to Inquiry and Contact">
            <span>INQUIRE</span>
          </a>
        </nav>

        {/* Mobile Header Controls (Hamburger Menu Button) */}
        <div className={styles.mobileHeaderControls}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuToggle}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobileNavCurtain"
          >
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.openTop : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.openBottom : ""}`} />
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay Curtain */}
      <div id="mobileNavCurtain" className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.showMenu : ""}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
        <div className={styles.mobileMenuHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Image src="/images/logo.webp" alt="Events by Mer Logo" width={34} height={34} className={styles.logoImage} />
            </div>
            <span className={styles.logoText}>Events by Mer</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className={styles.closeMenuBtn} aria-label="Close Navigation Menu">✕</button>
        </div>

        <nav className={styles.mobileNavBody} aria-label="Mobile Menu Navigation">
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink} aria-label="Home">
            <span className={styles.mobileNavNum}>01</span>
            <span>Home</span>
          </a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink} aria-label="Services Catalog">
            <span className={styles.mobileNavNum}>02</span>
            <span>Services Catalog</span>
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink} aria-label="About Us">
            <span className={styles.mobileNavNum}>03</span>
            <span>About Us</span>
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink} aria-label="Inquire and Contact">
            <span className={styles.mobileNavNum}>04</span>
            <span>Inquire / Contact</span>
          </a>
        </nav>

        <div className={styles.mobileMenuFooter}>
          <div className={styles.mobileMenuContactInfo}>
            <span>Addis Ababa, Ethiopia</span>
            <a href="tel:+251953525354" className={styles.mobileMenuPhone}>+251 953 525 354</a>
            <a href="mailto:contact@eventsbymer.com" className={styles.mobileMenuEmail}>contact@eventsbymer.com</a>
          </div>
          <div className={styles.mobileMenuSocials}>
            <a href="https://www.instagram.com/events_by_mer_?utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href="https://www.tiktok.com/@eventsbymer?_r=1&_t=ZS-991EPfKiOAx" target="_blank" rel="noopener noreferrer">TikTok ↗</a>
          </div>
        </div>
      </div>

      {/* Section 1: Hero Section */}
      <section id="home" className={styles.heroSection} aria-label="Hero Introduction">
        <div className={styles.heroBackground} />
        <svg className={styles.heroArchSvg} viewBox="0 0 800 1000" aria-hidden="true" role="presentation">
          <path d="M 120 1000 V 420 A 280 280 0 0 1 680 420 V 1000" className={styles.heroArchMainPath} />
          <path d="M 160 1000 V 435 A 240 240 0 0 1 640 435 V 1000" className={styles.heroArchInnerPath} />
          <line x1="360" y1="120" x2="440" y2="120" className={styles.heroArchCrownLine} />
          <circle cx="400" cy="120" r="4" className={styles.heroArchCrownDot} />
        </svg>
        <div className={styles.heroContent}>
          <span className={styles.heroMotto}>WEDDING PLANNING & EVENT PRODUCTION</span>
          
          <Signature delay={400} />
          
          <h1 className="srOnly">Events by Mer — Luxury Wedding Planning & Event Production Addis Ababa</h1>
          
          <p className={styles.heroSubTitle}>DESIGNED WITH PURPOSE. PRODUCED WITH EXCELLENCE.</p>

          <a href="#services" className={styles.heroBtn} aria-label="Explore Our Services Catalog">
            <span>EXPLORE SERVICES</span>
          </a>
        </div>
      </section>

      {/* Section 2: Services Section (Immediately After Hero) */}
      <section id="services" className={styles.servicesSectionWrapper} aria-labelledby="servicesHeadingTitle">
        <ServicesAccordion />
      </section>

      {/* Section 3: About Section (After Services) */}
      <section id="about" className={styles.aboutSection} aria-labelledby="aboutHeadingTitle">
        <div className={styles.aboutContainer}>
          <div className={styles.aboutHeading}>
            <span className={styles.aboutTag}>ABOUT EVENTS BY MER</span>
            <h2 id="aboutHeadingTitle" className={styles.aboutTitle}>Intentional Design. Flawless Execution.</h2>
          </div>

          <div className={styles.aboutLayout}>
            {/* Left Side: Luxury Image Collage with Offset Frame */}
            <div className={styles.aboutImagePanel}>
              <div className={styles.aboutImageFrame} />
              <div className={styles.aboutImageWrapper}>
                <Image
                  src="/images/about-brand.webp"
                  alt="Events by Mer Brand Emblem"
                  fill
                  sizes="(max-width: 991px) 100vw, 40vw"
                  className={styles.aboutImage}
                />
              </div>
            </div>

            {/* Right Side: Narrative Text & Quotes */}
            <div className={styles.aboutTextPanel}>
              <div className={styles.aboutNarrative}>
                <div className={styles.aboutTextEn}>
                  <span className={styles.dropcap}>A</span>t Events by Mer, we believe every celebration deserves to be intentional, beautifully executed, and uniquely personal. From the first concept to final orchestration, we manage every detail with creativity, precision, and poise. Our team combines thoughtful planning and high-quality production to deliver seamless events that leave lasting impressions across Ethiopia.
                </div>
              </div>

              <div className={styles.editorialDivider} />

              <div className={styles.aboutQuotesGrid}>
                <div className={styles.quoteBlock}>
                  <div className={styles.quoteTitle}>
                    <span>VISION</span>
                  </div>
                  <div className={styles.quoteHeadline}>
                    To create celebrations you’ll never want to forget.
                  </div>
                  <div className={styles.quoteText}>
                    We envision weddings that feel unmistakably yours — beautifully designed, deeply personal, and filled with moments that stay with you long after the last guest leaves.
                  </div>
                </div>

                <div className={styles.quoteBlock}>
                  <div className={styles.quoteTitle}>
                    <span>MISSION</span>
                  </div>
                  <div className={styles.quoteHeadline}>
                    To turn your vision into an experience worth remembering.
                  </div>
                  <div className={styles.quoteText}>
                    From the first idea to the final detail, we thoughtfully plan, design, and produce every element of your celebration — creating an atmosphere that feels effortless, intentional, and entirely you.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Contact & Inquiry Section */}
      <section id="contact" className={styles.contactAndFooterSection} aria-labelledby="contactHeadingTitle">
        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <div className={styles.contactHeader}>
              <span className={styles.contactTag}>INQUIRY</span>
              <h2 id="contactHeadingTitle" className={styles.contactTitle}>Let’s Begin Designing</h2>
              <p className={styles.contactDesc}>
                Whether planning a timeless luxury wedding, private celebration, or high-end event production 
                in Addis Ababa and across Ethiopia, we are here to execute your vision with absolute precision.
              </p>
            </div>

            <div className={styles.contactDetailsCard}>
              <div className={styles.contactBlock}>
                <span className={styles.contactBlockLabel}>✦ LOCATION</span>
                <span className={styles.contactBlockValue}>Addis Ababa, Ethiopia</span>
                <span className={styles.contactBlockSub}>Available across Ethiopia & for destination celebrations</span>
              </div>

              <div className={styles.contactDivider} />

              <div className={styles.contactBlock}>
                <span className={styles.contactBlockLabel}>✦ DIRECT PHONE & WHATSAPP</span>
                <a href="tel:+251953525354" className={styles.contactPhoneLink}>
                  +251 953 525 354
                </a>
                <span className={styles.contactBlockSub}>Direct call or WhatsApp concierge</span>
              </div>

              <div className={styles.contactDivider} />

              <div className={styles.contactBlock}>
                <span className={styles.contactBlockLabel}>✦ BUSINESS & WEDDING INQUIRIES</span>
                <a href="mailto:contact@eventsbymer.com" className={styles.contactEmailLink}>
                  contact@eventsbymer.com
                </a>
                <span className={styles.contactBlockSub}>Personalized response within 24 business hours</span>
              </div>

              <div className={styles.contactDivider} />

              <div className={styles.contactBlock}>
                <span className={styles.contactBlockLabel}>✦ SOCIAL PORTFOLIO</span>
                <div className={styles.contactSocialsRow}>
                  <a
                    href="https://www.instagram.com/events_by_mer_?utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactSocialPill}
                    aria-label="Events by Mer Instagram"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@eventsbymer?_r=1&_t=ZS-991EPfKiOAx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactSocialPill}
                    aria-label="Events by Mer TikTok"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.36 0 .7.07 1.01.19V9.48a6.34 6.34 0 0 0-1.01-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.16 8.16 0 0 0 4.76 1.52V7.13a4.83 4.83 0 0 1-1-.44z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            {formSubmitted ? (
              <div className={styles.staggeredCard} style={{ textAlign: "center", padding: "60px 40px" }}>
                <div className={styles.cardIcon} style={{ fontSize: "36px", marginBottom: "10px" }}>✦</div>
                <h3 className={styles.cardTitle}>Inquiry Sent</h3>
                <p className={styles.cardText}>
                  Thank you for reaching out to Events by Mer. We will review your details and contact you personally within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="eventType" className={styles.label}>Event Service of Interest</label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="Full-Wedding Planning & Coordination">01. Full-Wedding Planning & Coordination</option>
                    <option value="Wedding Photography & Videography">06. Wedding Photography & Videography</option>
                    <option value="Both Wedding Planning & Photography">✦ Both Wedding Planning & Photography</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="date" className={styles.label}>Proposed Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Event Vision / Details</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your celebration, estimated guest count, venue preferences..."
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  <span>{isSubmitting ? "TRANSMITTING..." : "SEND INQUIRY"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Luxury Brand Footer */}
      <footer className={styles.luxuryFooter} aria-label="Site Footer">
        <div className={styles.footerTopRow}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogoContainer}>
              <Image
                src="/images/logo.webp"
                alt="Events by Mer Logo"
                width={36}
                height={36}
                className={styles.footerLogoImage}
              />
              <span className={styles.footerBrandName}>Events by Mer</span>
            </div>
            <p className={styles.footerMotto}>Intentional Design · Flawless Execution</p>
          </div>

          <div className={styles.footerSocials}>
            <a
              href="https://www.instagram.com/events_by_mer_?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerSocialPill}
              aria-label="Events by Mer Instagram"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@eventsbymer?_r=1&_t=ZS-991EPfKiOAx"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerSocialPill}
              aria-label="Events by Mer TikTok"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.36 0 .7.07 1.01.19V9.48a6.34 6.34 0 0 0-1.01-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.16 8.16 0 0 0 4.76 1.52V7.13a4.83 4.83 0 0 1-1-.44z"/>
              </svg>
              <span>TikTok</span>
            </a>
          </div>

          <nav className={styles.footerNav} aria-label="Footer Navigation">
            <a href="#home" className={styles.footerNavLink}>Home</a>
            <a href="#services" className={styles.footerNavLink}>Services</a>
            <a href="#about" className={styles.footerNavLink}>About</a>
            <a href="#contact" className={styles.footerNavLink}>Inquiry</a>
          </nav>
        </div>

        <div className={styles.footerDivider} />

        <div className={styles.footerBottomRow}>
          <span className={styles.footerLocation}>
            Addis Ababa, Ethiopia · <a href="tel:+251953525354" className={styles.footerPhoneLink}>+251 953 525 354</a>
          </span>
          <span className={styles.footerCopyright}>© {new Date().getFullYear()} Events by Mer. All rights reserved.</span>
          <a href="#home" className={styles.backToTopBtn} aria-label="Back to Top">
            <span>Back to Top ↑</span>
          </a>
        </div>
      </footer>

    </main>
  );
}
