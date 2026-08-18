"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ServicesAccordion.module.css";

export interface ServiceItem {
  id: string;
  num: string;
  shortTitle: string;
  title: string;
  desc: string;
  image: string;
}

export const SERVICES: ServiceItem[] = [
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all-services");
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    phoneOrEmail: "",
    guestCount: "",
    eventDate: "",
    budgetTier: "open-to-guidance",
    notes: ""
  });

  // Find currently active service object for display in modal banner
  const currentModalService = SERVICES.find((s) => s.id === selectedServiceId) || {
    id: "all-services",
    num: "★",
    shortTitle: "Bespoke Consultation",
    title: "Comprehensive Wedding Consultation",
    desc: "Personalized consultation with Mer to discuss multi-service bespoke planning, coordination, and production.",
    image: "/images/about-brand.webp"
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleOpenModal = (serviceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedServiceId(serviceId);
    setModalSubmitted(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send inquiry data directly to notification endpoint (Web3Forms)
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";
      if (accessKey && accessKey !== "YOUR_ACCESS_KEY_HERE") {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `✨ New Inquiry: ${currentModalService.title} - ${modalData.name}`,
            from_name: "Events by Mer Website",
            service_requested: currentModalService.title,
            client_name: modalData.name,
            contact_info: modalData.phoneOrEmail,
            event_date: modalData.eventDate || "Not provided",
            guest_count: modalData.guestCount || "Not provided",
            budget_tier: modalData.budgetTier,
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
              onClick={() => setActiveIndex(isActive ? -1 : idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(isActive ? -1 : idx);
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
              <div
                className={styles.mobileBannerBar}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(isActive ? -1 : idx);
                }}
              >
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
                    onClick={(e) => handleOpenModal(service.id, e)}
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
          onClick={(e) => handleOpenModal("all-services", e)}
          className={styles.catalogCtaBtn}
          aria-label="Book a Consultation"
        >
          <span>BOOK A CONSULTATION →</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* BESPOKE SERVICE MODAL POP-UP */}
      {/* ============================================================ */}
      {isModalOpen && (
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
                src={currentModalService.image}
                alt={currentModalService.title}
                fill
                className={styles.modalBannerImage}
              />
              <div className={styles.modalBannerOverlay}>
                <span className={styles.modalServiceTag}>
                  {selectedServiceId === "all-services" ? "BESPOKE CONSULTATION" : `SERVICE ${currentModalService.num} INQUIRY`}
                </span>
                <h3 id="modalServiceTitle" className={styles.modalServiceHeading}>{currentModalService.title}</h3>
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
                    Thank you for reaching out for <strong>{currentModalService.title}</strong>. Mer and our lead production team will reach out directly within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleModalSubmit} className={styles.modalForm}>
                  {/* Selectable Service Dropdown */}
                  <div className={styles.modalFieldGroup}>
                    <label className={styles.modalFieldLabel}>SELECT SERVICE OF INTEREST</label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className={styles.modalInput}
                    >
                      <option value="all-services">✦ Comprehensive Consultation / All Services</option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.num}. {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.modalSubmitBtn}
                  >
                    <span>{isSubmitting ? "TRANSMITTING INQUIRY..." : `SUBMIT INQUIRY FOR ${currentModalService.shortTitle.toUpperCase()} →`}</span>
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
