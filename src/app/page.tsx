"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";

const Signature = dynamic(() => import("@/components/Signature"), { ssr: false });
const VerticalServices = dynamic(() => import("@/components/VerticalServices"), { ssr: false });

const CORE_VALUES = [
  {
    num: "01",
    titleEn: "Excellence",
    titleAm: "የላቀ ብቃት",
    descEn: "Uncompromising dedication to setting the highest benchmarks in quality.",
    descAm: "በጥራት ላይ ድርድር የሌለው ቁርጠኝነት እና ከፍተኛ ደረጃዎችን ማስመዝገብ።"
  },
  {
    num: "02",
    titleEn: "Creativity",
    titleAm: "ፈጠራ",
    descEn: "Transforming raw concepts into imaginative visual masterpieces.",
    descAm: "ጥሬ የሆኑ ሀሳቦችን ወደ ማራኪ የእይታ ድንቅ ስራዎች መለወጥ።"
  },
  {
    num: "03",
    titleEn: "Attention to Detail",
    titleAm: "ለዝርዝር ነገሮች ትኩረት",
    descEn: "Intentionally orchestrating micro-moments that make up the grand design.",
    descAm: "ታላቁን ዲዛይን የሚገነቡ ጥቃቅን ጊዜያቶችን ሆን ብሎ በጥንቃቄ መምራት።"
  },
  {
    num: "04",
    titleEn: "Professionalism",
    titleAm: "ሙያዊ ብቃት",
    descEn: "Calm, confident execution under pressure from launch to tear-down.",
    descAm: "ከተጀመረበት ጊዜ አንስቶ እስከ ማጠናቀቂያው ድረስ ጫናዎችን በእርጋታ እና በልበ ሙሉነት መወጣት።"
  },
  {
    num: "05",
    titleEn: "Innovation",
    titleAm: "ፈጠራና ዘመናዊነት",
    descEn: "Pioneering modern visual event staging and production solutions.",
    descAm: "አዳዲስ እና ዘመናዊ የዝግጅት መድረክ እና የእይታ ፕሮዳክሽን መፍትሄዎችን መፍጠር።"
  },
  {
    num: "06",
    titleEn: "Integrity",
    titleAm: "ታማኝነት",
    descEn: "Earning absolute trust through transparency, consistency, and respect.",
    descAm: "በግልጽነት፣ ወጥነት ባለው አሰራር እና በአክብሮት ሙሉ እምነትን ማትረፍ።"
  }
];

export default function Home() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeValue, setActiveValue] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "wedding",
    date: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        eventType: "wedding",
        date: "",
        message: ""
      });
    }, 2000);
  };

  return (
    <main className={styles.main}>

      {/* Floating Header - Centered Logo Split Header (Classic Editorial) */}
      <header className={styles.header}>
        <nav className={`${styles.navLinks} ${styles.navLeft}`}>
          <a href="#home" className={styles.navLink}>
            <span>Home</span>
          </a>
          <a href="#about" className={styles.navLink}>
            <span>About</span>
          </a>
          <a href="#values" className={styles.navLink}>
            <span>Values</span>
          </a>
        </nav>

        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Image
              src="/images/logo.jpg"
              alt="Events by Mer Logo"
              width={40}
              height={40}
              className={styles.logoImage}
            />
          </div>
          <span className={styles.logoText}>Events by Mer</span>
        </div>
        
        <nav className={`${styles.navLinks} ${styles.navRight}`}>
          <a href="#services" className={styles.navLink}>
            <span>Services</span>
          </a>
          <a href="#contact" className={styles.navLink}>
            <span>Inquiry</span>
          </a>
        </nav>

        {/* Mobile Header Controls (Hamburger Menu Button) */}
        <div className={styles.mobileHeaderControls}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuToggle}
            aria-label="Toggle Navigation Menu"
          >
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.openTop : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.openBottom : ""}`} />
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay Curtain */}
      <div className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.showMenu : ""}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Image src="/images/logo.jpg" alt="Events by Mer Logo" width={34} height={34} className={styles.logoImage} />
            </div>
            <span className={styles.logoText}>Events by Mer</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className={styles.closeMenuBtn} aria-label="Close Menu">✕</button>
        </div>

        <nav className={styles.mobileNavBody}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
            <span className={styles.mobileNavNum}>01</span>
            <span className="en">Home</span>
            <span className="am">መነሻ</span>
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
            <span className={styles.mobileNavNum}>02</span>
            <span className="en">About Us</span>
            <span className="am">ስለ እኛ</span>
          </a>
          <a href="#values" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
            <span className={styles.mobileNavNum}>03</span>
            <span className="en">Core Values</span>
            <span className="am">እሴቶቻችን</span>
          </a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
            <span className={styles.mobileNavNum}>04</span>
            <span className="en">Services Catalog</span>
            <span className="am">አገልግሎቶች</span>
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={styles.mobileNavLink}>
            <span className={styles.mobileNavNum}>05</span>
            <span className="en">Inquire / Contact</span>
            <span className="am">ያግኙን</span>
          </a>
        </nav>

        <div className={styles.mobileMenuFooter}>
          <span>Addis Ababa, Ethiopia</span>
          <span>info@eventsbymer.com</span>
        </div>
      </div>

      <section id="home" className={styles.heroSection}>
        <div className={styles.heroBackground} />
        <svg className={styles.heroRingSvg} viewBox="0 0 1200 1200" aria-hidden="true">
          <circle cx="600" cy="600" r="580" className={styles.heroRingCircle} />
        </svg>
        <div className={styles.heroContent}>
          <span className={`${styles.heroMotto} en`}>WEDDING PLANNING & EVENT PRODUCTION</span>
          <span className={`${styles.heroMotto} am`}>የሰርግ ዝግጅት እና የክስተት ፕሮዳክሽን</span>
          
          <Signature delay={400} />
          
          <h1 className={styles.heroTitle} style={{ display: "none" }}>Events by Mer</h1>
          
          <p className={`${styles.heroSubTitle} en`}>DESIGNED WITH PURPOSE. PRODUCED WITH EXCELLENCE.</p>
          <p className={`${styles.heroSubTitle} am`}>በዓላማ የተነደፈ። በብቃት የተከናወነ።</p>

          <a href="#services" className={styles.heroBtn}>
            <span className="en">EXPLORE SERVICES</span>
            <span className="am">አገልግሎቶችን ይመልከቱ</span>
          </a>
        </div>

        <a href="#about" className={styles.heroScroll}>
          <span className="en">SCROLL</span>
          <span className="am">ወደ ታች ይውረዱ</span>
          <div className={styles.scrollLine} />
        </a>
      </section>

      {/* About Section - Editorial Collage Layout */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutHeading}>
            <span className={`${styles.aboutTag} en`}>ABOUT EVENTS BY MER</span>
            <span className={`${styles.aboutTag} am`}>ስለ Events by Mer</span>
            <h2 className={`${styles.aboutTitle} en`}>Intentional Design. Flawless Execution.</h2>
            <h2 className={`${styles.aboutTitle} am`}>በዓላማ የተመራ ንድፍ። እንከን የለሽ አፈፃፀም።</h2>
          </div>

          <div className={styles.aboutLayout}>
            {/* Left Side: Luxury Image Collage with Offset Frame */}
            <div className={styles.aboutImagePanel}>
              <div className={styles.aboutImageFrame} />
              <div className={styles.aboutImageWrapper}>
                <Image
                  src="/images/about-brand.jpg"
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
                <div className={`${styles.aboutTextEn} en`}>
                  <span className={styles.dropcap}>A</span>t Events by Mer, we believe every celebration deserves to be intentional, beautifully executed, and uniquely personal. From the first concept to final orchestration, we manage every detail with creativity, precision, and poise. Our team combines thoughtful planning and high-quality production to deliver seamless events that leave lasting impressions across Ethiopia.
                </div>
                <div className={`${styles.aboutTextAm} am`}>
                  <span className={styles.dropcap}>በ</span>ኢቨንትስ ባይ መር፣ ማንኛውም ዝግጅት በዓላማ የተመራ፣ ውብ እና ለእርስዎ የሚስማማ ልዩ መሆን አለበት ብለን እናምናለን። ከመጀመሪያው ሀሳብ እስከ ፍጻሜው፣ እያንዳንዱን ዝርዝር በፈጠራ፣ በግልጽነት እና በሙያዊ ብቃት እንመራለን። ቡድናችን ጥንቃቄ የተሞላበት እቅድ፣ አስደናቂ ዲዛይን እና ጥራት ያለው ፕሮዳክሽን በማጣመር በኢትዮጵያ ዘላቂ ትዝታ የሚተዉ እንከን የለሽ ክስተቶችን ያዘጋጃል።
                </div>
              </div>

              <div className={styles.editorialDivider} />

              <div className={styles.aboutQuotesGrid}>
                <div className={styles.quoteBlock}>
                  <div className={styles.quoteTitle}>
                    <span className="en">Our Vision</span>
                    <span className="am">ራዕያችን</span>
                  </div>
                  <div className={styles.quoteText}>
                    <span className="en">“To become Ethiopia’s leading luxury event planning and production company, recognized for creating timeless experiences.”</span>
                    <span className="am">“በኢትዮጵያ ዘላለማዊ ትዝታዎችን በመፍጠር እና የላቀ ጥራትን በማስመዝገብ ግንባር ቀደም የቅንጦት የሰርግ እና የክስተት አዘጋጅ መሆን።”</span>
                  </div>
                </div>

                <div className={styles.quoteBlock}>
                  <div className={styles.quoteTitle}>
                    <span className="en">Our Mission</span>
                    <span className="am">ተልዕኳችን</span>
                  </div>
                  <div className={styles.quoteText}>
                    <span className="en">“To create exceptional events through innovative planning, refined design, and flawless production while delivering an experience that exceeds expectations.”</span>
                    <span className="am">“በፈጠራ እቅድ፣ በተመረጠ ዲዛይን እና እንከን የለሽ ፕሮዳክሽን በመታገዝ የደንበኞቻችንን እምነት እና እርካታ የሚያረጋግጡ ልዩ ዝግጅቶችን መፍጠር።”</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Interactive Reveal Accordion */}
      <section id="values" className={styles.valuesSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.valuesHeaderBlock}>
            <span className={`${styles.aboutTag} en`}>CORE VALUES</span>
            <span className={`${styles.aboutTag} am`}>መሰረታዊ እሴቶቻችን</span>
            <h3 className={styles.valuesHeader}>
              <span className="en">Designed with Purpose. Produced with Excellence.</span>
              <span className="am">በዓላማ የተነደፈ። በብቃት የተከናወነ።</span>
            </h3>
          </div>
          
          <div className={styles.accordionContainer}>
            {CORE_VALUES.map((val, idx) => {
              const isOpen = activeValue === idx;
              return (
                <div 
                  key={idx}
                  className={`${styles.accordionItem} ${isOpen ? styles.accordionOpen : ""}`}
                  onMouseEnter={() => setActiveValue(idx)}
                >
                  <div className={styles.accordionHeader}>
                    <span className={styles.accordionNum}>{val.num}</span>
                    <h4 className={styles.accordionTitle}>
                      <span className="en">{val.titleEn}</span>
                      <span className="am">{val.titleAm}</span>
                    </h4>
                    <span className={styles.accordionCross}>{isOpen ? "—" : "+"}</span>
                  </div>
                  <div className={styles.accordionContent}>
                    <p className={`${styles.accordionText} en`}>{val.descEn}</p>
                    <p className={`${styles.accordionText} am`}>{val.descAm}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.servicesSectionWrapper}>
        <VerticalServices onIndexChange={setActiveSlideIndex} />
      </section>

      {/* Combined Contact & Footer Section for Perfect Snap */}
      <section id="contact" className={styles.contactAndFooterSection}>
        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <div className={styles.contactHeader}>
              <span className={`${styles.contactTag} en`}>INQUIRY</span>
              <span className={`${styles.contactTag} am`}>የጥያቄ ፎርም</span>
              
              <h2 className={`${styles.contactTitle} en`}>Let’s Begin Designing</h2>
              <h2 className={`${styles.contactTitle} am`}>አብረን እንንደፍ</h2>
              
              <p className={`${styles.contactDesc} en`}>
                Whether planning a timeless luxury wedding, private celebration, or high-end event production 
                in Addis Ababa and across Ethiopia, we are here to execute your vision with absolute precision.
              </p>
              <p className={`${styles.contactDesc} am`}>
                የቅንጦት ሰርግ፣ የግል ዝግጅት ወይም ከፍተኛ ደረጃ የክስተት ፕሮዳክሽን በአዲስ አበባ እና በኢትዮጵያ ለማዘጋጀት ሲያስቡ፣ የእርስዎን ራዕይ በጥንቃቄ ለመተግበር እዚህ ነን።
              </p>
            </div>

            <div className={styles.infoDetails}>
              <div className={styles.infoItem}>
                <span className={`${styles.infoLabel} en`}>LOCATION</span>
                <span className={`${styles.infoLabel} am`}>አድራሻ</span>
                <span className={styles.infoValue}>Addis Ababa, Ethiopia</span>
              </div>
              <div className={styles.infoItem}>
                <span className={`${styles.infoLabel} en`}>BUSINESS ENQUIRIES</span>
                <span className={`${styles.infoLabel} am`}>የንግድ ጥያቄዎች</span>
                <span className={styles.infoValue}>contact@eventsbymer.com</span>
              </div>
            </div>
          </div>

          <div>
            {formSubmitted ? (
              <div className={styles.staggeredCard} style={{ textAlign: "center", padding: "60px 40px" }}>
                <div className={styles.cardIcon} style={{ fontSize: "36px", marginBottom: "10px" }}>✦</div>
                <h3 className={styles.cardTitle}>
                  <span className="en">Inquiry Sent</span>
                  <span className="am">ጥያቄው ተልኳል</span>
                </h3>
                <p className={`${styles.cardText} en`}>
                  Thank you for reaching out to Events by Mer. We will review your details and contact you personally within 24 hours.
                </p>
                <p className={`${styles.cardText} am`}>
                  Events by Merን ስላነጋገሩ እናመሰግናለን። ዝርዝሩን ገምግመን በ24 ሰዓታት ውስጥ በግል እናገኝዎታለን።
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    <span className="en">Name</span>
                    <span className="am">ሙሉ ስም</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="eventType" className={styles.label}>
                      <span>Event Type</span>
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="wedding">Wedding Planning</option>
                      <option value="celebration">Private Celebration</option>
                      <option value="styling">Event Styling</option>
                      <option value="production">Event Production</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.label}>
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    <span>Message & Details</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your vision..."
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <span className="en">Submit Inquiry</span>
                  <span className="am">ጥያቄውን ላክ</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerTop}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <Image
                  src="/images/logo.jpg"
                  alt="Events by Mer Logo"
                  width={52}
                  height={52}
                  style={{ borderRadius: "50%", border: "1px solid rgba(133, 104, 75, 0.2)" }}
                />
                <div>
                  <span className={styles.logoText} style={{ color: "var(--color-bronze)" }}>Events by Mer</span>
                  <p style={{ marginTop: "4px", fontSize: "12px", fontWeight: "300" }}>
                    <span className="en">Luxury Event Planning & Production</span>
                    <span className="am">የቅንጦት የሰርግ እና የክስተት ዝግጅት</span>
                  </p>
                </div>
              </div>
              <p className={`${styles.footerMotto} en`}>Designed with Purpose. Produced with Excellence.</p>
              <p className={`${styles.footerMotto} am`}>በዓላማ የተነደፈ። በብቃት የተከናወነ።</p>
            </div>
            <div className={styles.footerBottom}>
              <p>&copy; {new Date().getFullYear()} Events by Mer. All rights reserved.</p>
              <p>
                <span className="en">Based in Addis Ababa, Ethiopia</span>
                <span className="am">አዲስ አበባ፣ ኢትዮጵያ</span>
              </p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
