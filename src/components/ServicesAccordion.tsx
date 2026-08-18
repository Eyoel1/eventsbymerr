"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ServicesAccordion.module.css";

interface ServiceItem {
  id: string;
  num: string;
  shortTitle: string;
  title: string;
  desc: string;
  image: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "wedding-planning",
    num: "01",
    shortTitle: "Full-Wedding Planning",
    title: "Full-Wedding Planning & Coordination",
    desc: "Comprehensive end-to-end guidance from conceptualization to execution. We orchestrate vendors, timelines, guest logistics, and day-of management with uncompromising precision.",
    image: "/images/user_photos/service_ethiopian_ceremony.webp"
  },
  {
    id: "vendor-sourcing",
    num: "02",
    shortTitle: "Vendor Sourcing",
    title: "Vendor Sourcing & Management",
    desc: "Curating Addis Ababa’s finest artisans, florists, caterers, and lighting crews. We negotiate contracts, manage deliverable timelines, and ensure synchronized teamwork.",
    image: "/images/user_photos/service_planner_desk.webp"
  },
  {
    id: "budget-planning",
    num: "03",
    shortTitle: "Budget Planning",
    title: "Budget Planning & Management",
    desc: "Transparent financial planning and strategic resource allocation. We maximize your investment while securing the highest standards of luxury and elegance.",
    image: "/images/user_photos/service_timeline_sheets.webp"
  },
  {
    id: "timeline-logistics",
    num: "04",
    shortTitle: "Timeline Logistics",
    title: "Timeline & Logistics Management",
    desc: "Microscopic master run-of-show schedules. We choreograph morning preparations, ceremonial entrances, stage transitions, and load-ins down to the second.",
    image: "/images/user_photos/service_corset_dress.webp"
  },
  {
    id: "event-styling",
    num: "05",
    shortTitle: "Event Styling",
    title: "Event Styling & Design",
    desc: "Bespoke aesthetic styling, luxury floral installations, bespoke table scapes, and atmospheric mood creation tailored to your unique heritage and vision.",
    image: "/images/user_photos/service_reception_tables.webp"
  },
  {
    id: "photography-videography",
    num: "06",
    shortTitle: "Photo & Video",
    title: "Wedding Photography & Videography",
    desc: "Timeless cinematic visual storytelling. We capture genuine emotional moments, intricate cultural couture, and ballroom elegance in editorial publication quality.",
    image: "/images/user_photos/service_camera_shoes.webp"
  }
];

export default function ServicesAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    phoneOrEmail: "",
    guestCount: "",
    eventDate: "",
    budgetTier: "open-to-guidance",
    notes: ""
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalService]);

  const handleOpenModal = (service: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalService(service);
    setModalSubmitted(false);
  };

  const handleCloseModal = () => {
    setModalService(null);
    setModalSubmitted(false);
    setModalData({
      name: "",
      phoneOrEmail: "",
      guestCount: "",
      eventDate: "",
      budgetTier: "open-to-guidance",
      notes: ""
    });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitted(true);
    setTimeout(() => {
      handleCloseModal();
    }, 2400);
  };

  return (
    <div className={styles.servicesSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>WHAT WE OFFER</span>
        <h2 className={styles.sectionTitle}>Our Service Catalog</h2>
        <p className={styles.sectionSub}>
          Bespoke planning, coordination, and production crafted with precision for luxury Ethiopian weddings and milestone celebrations.
        </p>
      </div>

      <div className={styles.fashionAccordion}>
        {SERVICES.map((service, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={service.id}
              tabIndex={0}
              role="button"
              aria-expanded={isActive}
              aria-label={`Service ${service.num}: ${service.title}`}
              className={`${styles.fashionPanel} ${isActive ? styles.active : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(idx);
                }
              }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 991px) 100vw, 35vw"
                  className={styles.panelImage}
                  priority={idx < 2}
                />
              </div>

              {/* Collapsed Vertical Title (Desktop Only) */}
              <div className={styles.panelVerticalTitle}>
                <span className={styles.verticalNum}>{service.num}</span>
                <span className={styles.verticalText}>{service.shortTitle}</span>
              </div>

              {/* Mobile Collapsed/Active Banner Header (Mobile Only) */}
              <div className={styles.mobileBannerBar}>
                <div className={styles.mobileBannerLeft}>
                  <span className={styles.mobileNum}>{service.num}</span>
                  <span className={styles.mobileTitle}>{service.shortTitle}</span>
                </div>
                <span className={styles.mobileToggleIcon}>{isActive ? "—" : "+"}</span>
              </div>

              {/* Full Expanded Overlay Content */}
              <div className={styles.panelOverlay}>
                <div className={styles.panelFullContent}>
                  <span className={styles.panelCounter}>SERVICE {service.num} / 06</span>
                  <h3 className={styles.panelHeading}>{service.title}</h3>
                  <div className={styles.panelDivider} />
                  <p className={styles.panelDescription}>{service.desc}</p>
                  
                  {/* Interactive Pop-up Trigger Button */}
                  <button
                    type="button"
                    className={styles.cardInquireBtn}
                    aria-label={`Inquire about ${service.title}`}
                    onClick={(e) => handleOpenModal(service, e)}
                  >
                    <span>INQUIRE ABOUT THIS SERVICE →</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Catalog Bottom CTA Banner */}
      <div className={styles.catalogCtaBanner}>
        <div className={styles.ctaBannerContent}>
          <span className={styles.ctaSubTag}>BESPOKE EXPERIENCES</span>
          <h3 className={styles.ctaHeading}>Ready to begin crafting your celebration?</h3>
          <p className={styles.ctaDesc}>
            Let’s discuss your vision, dates, and customized services for an unforgettable experience in Addis Ababa.
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => handleOpenModal(SERVICES[0], e)}
          className={styles.catalogCtaBtn}
          aria-label="Book a Consultation"
        >
          <span>BOOK A CONSULTATION →</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* BESPOKE SERVICE MODAL POP-UP */}
      {/* ============================================================ */}
      {modalService && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalServiceTitle"
        >
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Service Photo Banner */}
            <div className={styles.modalHeroBanner}>
              <Image
                src={modalService.image}
                alt={modalService.title}
                fill
                className={styles.modalBannerImage}
              />
              <div className={styles.modalBannerOverlay}>
                <span className={styles.modalServiceTag}>SERVICE {modalService.num} INQUIRY</span>
                <h3 id="modalServiceTitle" className={styles.modalServiceHeading}>{modalService.title}</h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={handleCloseModal}
                aria-label="Close Inquiry Modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <div className={styles.modalBody}>
              {modalSubmitted ? (
                <div className={styles.modalSuccessState}>
                  <div className={styles.successGlowIcon}>✦</div>
                  <h4 className={styles.successTitle}>Inquiry Confirmed</h4>
                  <p className={styles.successText}>
                    Thank you for selecting <strong>{modalService.title}</strong>. Mer and our lead production team will reach out directly within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleModalSubmit} className={styles.modalForm}>
                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>YOUR NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name or couple's names"
                        value={modalData.name}
                        onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                        className={styles.modalInput}
                      />
                    </div>

                    <div className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>PHONE / WHATSAPP / EMAIL</label>
                      <input
                        type="text"
                        required
                        placeholder="+251 ... or email@domain.com"
                        value={modalData.phoneOrEmail}
                        onChange={(e) => setModalData({ ...modalData, phoneOrEmail: e.target.value })}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>

                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>TARGET EVENT DATE</label>
                      <input
                        type="date"
                        value={modalData.eventDate}
                        onChange={(e) => setModalData({ ...modalData, eventDate: e.target.value })}
                        className={styles.modalInput}
                      />
                    </div>

                    <div className={styles.modalFieldGroup}>
                      <label className={styles.modalFieldLabel}>ESTIMATED GUEST COUNT</label>
                      <input
                        type="text"
                        placeholder="e.g. 250 - 500 Guests"
                        value={modalData.guestCount}
                        onChange={(e) => setModalData({ ...modalData, guestCount: e.target.value })}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>

                  <div className={styles.modalFieldGroup}>
                    <label className={styles.modalFieldLabel}>TARGET EVENT BUDGET</label>
                    <select
                      value={modalData.budgetTier}
                      onChange={(e) => setModalData({ ...modalData, budgetTier: e.target.value })}
                      className={styles.modalInput}
                    >
                      <option value="open-to-guidance">Open to guidance / Seeking Mer's Budget Consultation</option>
                      <option value="luxury-standard">Luxury Standard Experience</option>
                      <option value="high-luxury">High-End Luxury & Grand Ballroom</option>
                      <option value="unlimited-bespoke">Unlimited Bespoke & Custom Production</option>
                      <option value="flexible">Flexible / Still determining</option>
                    </select>
                  </div>

                  <div className={styles.modalFieldGroup}>
                    <label className={styles.modalFieldLabel}>VISION & NOTES (OPTIONAL)</label>
                    <textarea
                      rows={3}
                      placeholder="Share details about your desired venue, theme, or timeline preferences..."
                      value={modalData.notes}
                      onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                      className={styles.modalTextarea}
                    />
                  </div>

                  <button type="submit" className={styles.modalSubmitBtn}>
                    <span>SUBMIT INQUIRY FOR {modalService.shortTitle.toUpperCase()} →</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
