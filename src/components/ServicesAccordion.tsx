"use client";

import React, { useState } from "react";
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
    shortTitle: "Full-Service Planning",
    title: "Full-Service Wedding Planning & Coordination",
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
    id: "event-production",
    num: "06",
    shortTitle: "Event Production",
    title: "Event Production Management",
    desc: "Technical staging, architectural lighting, acoustics, and structural installations engineered for flawless performance and immersive atmosphere.",
    image: "/images/user_photos/service_lace_dress.webp"
  },
  {
    id: "photography-videography",
    num: "07",
    shortTitle: "Photo & Video",
    title: "Wedding Photography & Videography",
    desc: "Timeless cinematic visual storytelling. We capture genuine emotional moments, intricate cultural couture, and ballroom elegance in editorial publication quality.",
    image: "/images/user_photos/service_camera_shoes.webp"
  }
];

export default function ServicesAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

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

              {/* Vertical Title when collapsed on desktop */}
              <div className={styles.panelVerticalTitle}>
                <span className={styles.verticalNum}>{service.num}</span>
                <span className={styles.verticalText}>{service.shortTitle}</span>
              </div>

              {/* Full Expanded Overlay Content */}
              <div className={styles.panelOverlay}>
                <div className={styles.panelFullContent}>
                  <span className={styles.panelCounter}>SERVICE {service.num} / 07</span>
                  <h3 className={styles.panelHeading}>{service.title}</h3>
                  <div className={styles.panelDivider} />
                  <p className={styles.panelDescription}>{service.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
