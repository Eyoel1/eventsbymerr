"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./VerticalServices.module.css";

interface ServiceItem {
  id: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  desc: React.ReactNode;
  details: React.ReactNode[];
  image: string;
  themeColor: string; // Background sand/cream hex
  soundThemeIdx: number; // mapped sound group
  particleThemeIdx: number; // mapped canvas particle theme
}

const SERVICES: ServiceItem[] = [
  {
    id: "wedding-planning",
    title: (
      <>
        <span className="en">Wedding Planning & Coordination</span>
        <span className="am">የሰርግ እቅድ እና አስተባባሪነት</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Flawless Orchestration from Concept to Vows</span>
        <span className="am">ከሀሳብ እስከ ቃለ መሀላ እንከን የለሽ አስተባባሪነት</span>
      </>
    ),
    desc: (
      <>
        <span className="en">From budgeting to venue layout and timeline orchestration, we handle every microscopic logistical detail. We align premium partners across Ethiopia to execute your wedding with absolute poise.</span>
        <span className="am">ከበጀት ጀምሮ እስከ ስፍራው አቀማመጥ እና የጊዜ ሰሌዳ እቅድ እያንዳንዱን ረቂቅ የሎጅስቲክስ ዝርዝር እንከባከባለን። የእርስዎን ሰርግ በተሟላ ውበት ለመተግበር የኢትዮጵያን ምርጥ አጋሮችን እናስተባብራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Timeline & Schedule Curation</span>
          <span className="am">የጊዜ ሰሌዳ እና የፕሮግራም አወቃቀር</span>
        </>
      ),
      (
        <>
          <span className="en">Vendor Coordination & Liaisons</span>
          <span className="am">የአቅራቢዎች አስተባባሪነት እና ግንኙነት</span>
        </>
      ),
      (
        <>
          <span className="en">Traditional Ceremony Management</span>
          <span className="am">በባህላዊ ስነ-ስርዓቶች ላይ ድጋፍ መስጠት</span>
        </>
      ),
      (
        <>
          <span className="en">On-Site Day-Of Management</span>
          <span className="am">በዝግጅቱ እለት በቦታው ላይ ሆኖ መምራት</span>
        </>
      )
    ],
    image: "/images/service_wedding_planning.jpg",
    themeColor: "#FDFBF8", // Alabaster Warm White
    soundThemeIdx: 0, // Wedding loop
    particleThemeIdx: 0 // Rose petals
  },
  {
    id: "wedding-design",
    title: (
      <>
        <span className="en">Luxury Wedding Design</span>
        <span className="am">የቅንጦት ሰርግ ዲዛይን</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Visual Masterpieces Tailored to Your Legacy</span>
        <span className="am">የእርስዎን ታሪክ የሚገልጹ የእይታ ድንቅ ስራዎች</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Art direction that tells your love story through space. We conceptualize grand stage sets, custom furniture layouts, and curated light fixtures to produce a bespoke, high-luxury wedding aesthetic.</span>
        <span className="am">የፍቅር ታሪክዎን በቦታው ላይ የሚገልጽ የስነ-ጥበብ አቅጣጫ። የተለየ እና ከፍተኛ ደረጃ ያለው የሰርግ ውበት ለመፍጠር ታላላቅ የመድረክ ንድፎችን፣ ልዩ የቤት እቃዎች አቀማመጥን እና የተመረጡ የብርሃን መብራቶችን እናዘጋጃለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Bespoke Scenic Set Design</span>
          <span className="am">ልዩ የመድረክ እና ትዕይንት ንድፍ</span>
        </>
      ),
      (
        <>
          <span className="en">Table Decor & Custom Linens</span>
          <span className="am">የማዕድ አቀማመጥ እና ልዩ የጨርቃ ጨርቅ</span>
        </>
      ),
      (
        <>
          <span className="en">Color Palette Orchestration</span>
          <span className="am">የቀለማት ቅንጅት እና ውህደት</span>
        </>
      ),
      (
        <>
          <span className="en">Atmospheric Lighting Concept</span>
          <span className="am">የከባቢ አየር ብርሃን ፈጠራ</span>
        </>
      )
    ],
    image: "/images/service_wedding_design.jpg",
    themeColor: "#F5EFE6", // Sand Gold
    soundThemeIdx: 0,
    particleThemeIdx: 0
  },
  {
    id: "event-styling",
    title: (
      <>
        <span className="en">Event Styling & Florals</span>
        <span className="am">የክስተት ማስጌጥ እና አበባዎች</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Atmospheric Textures and Floral Artistry</span>
        <span className="am">የከባቢ አየር ውበት እና የአበባ ጥበብ</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Creating sensory spatial experiences. We style fine-art setups utilizing draped premium fabrics, contemporary architectural lines, and sculpted artisanal floral structures.</span>
        <span className="am">ስሜትን የሚኮረኩሩ የቦታ ተሞክሮዎችን መፍጠር። ደረጃቸውን የጠበቁ ጨርቆችን፣ ዘመናዊ የስነ-ህንጻ መስመሮችን እና ጥበብ የተሞላባቸውን የአበባ ቅርጾችን በመጠቀም ልዩ ንድፎችን እናዘጋጃለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Artisanal Floral Sculptures</span>
          <span className="am">ጥበብ የተሞላባቸው የአበባ ቅርጾች</span>
        </>
      ),
      (
        <>
          <span className="en">Venue Draping & Styling</span>
          <span className="am">የአዳራሽ ጨርቃጨርቅ አደራደር</span>
        </>
      ),
      (
        <>
          <span className="en">Custom Accessory Selection</span>
          <span className="am">ልዩ የማስጌጫ መለዋወጫዎች ምርጫ</span>
        </>
      ),
      (
        <>
          <span className="en">Sensory Experience Curation</span>
          <span className="am">ስሜት አነቃቂ የልምድ ንድፍ</span>
        </>
      )
    ],
    image: "/images/service_event_styling.jpg",
    themeColor: "#FAF6F0", // Cream
    soundThemeIdx: 2, // Styling loop
    particleThemeIdx: 2 // Spotlights
  },
  {
    id: "event-production",
    title: (
      <>
        <span className="en">Event Production</span>
        <span className="am">የክስተት ፕሮዳክሽን (አዘገጃጀት)</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Structural AV, Staging & Safety</span>
        <span className="am">የመድረክ መዋቅር፣ ድምፅና ብርሃን</span>
      </>
    ),
    desc: (
      <>
        <span className="en">The technical scaffolding of modern events. We direct massive truss setups, acoustic sound design, and custom staging structures to ensure perfect, flawless technical execution.</span>
        <span className="am">የዘመናዊ ዝግጅቶች ቴክኒካዊ መሰረት። ፍጹም እና እንከን የለሽ ቴክኒካዊ አፈፃፀምን ለማረጋገጥ ታላላቅ የመድረክ መዋቅሮችን፣ የድምፅ ንድፍን እና የብርሃን ስርዓቶችን እንመራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Truss & AV Technical Setup</span>
          <span className="am">የAV እና መዋቅራዊ ቴክኒክ ዝግጅት</span>
        </>
      ),
      (
        <>
          <span className="en">Acoustic Sound Design</span>
          <span className="am">የድምፅ ጥራት እና አኮስቲክስ ንድፍ</span>
        </>
      ),
      (
        <>
          <span className="en">Structural Stage Fabrication</span>
          <span className="am">የመድረክ መዋቅር ግንባታ</span>
        </>
      ),
      (
        <>
          <span className="en">Load-In & Rigging Supervision</span>
          <span className="am">የመሳሪያዎች አቀማመጥና ደህንነት ቁጥጥር</span>
        </>
      )
    ],
    image: "/images/service_event_production.jpg",
    themeColor: "#FDFBF8",
    soundThemeIdx: 3, // Production loop
    particleThemeIdx: 3 // Camera concentric lines
  },
  {
    id: "private-celebrations",
    title: (
      <>
        <span className="en">Private Celebrations</span>
        <span className="am">የግል በዓላት እና ክስተቶች</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Timeless Banquets and Birthday Soirées</span>
        <span className="am">ዘላለማዊ የራት ግብዣዎች እና የልደት በዓላት</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Bespoke hosting for private clients. We direct high-end birthday dinners, anniversaries, and social galas with private chef setups, curated menu cards, and tailored ambiance.</span>
        <span className="am">ለግል ደንበኞች የተዘጋጀ መስተንግዶ። ከፍተኛ ደረጃ ያላቸውን የልደት እራት ግብዣዎችን፣ አመታዊ በዓላትን እና ማህበራዊ መሰባሰቢያዎችን ከግል ሼፍ ዝግጅት፣ ከተመረጡ የምግብ ዝርዝር ካርዶች እና ልዩ ከባቢ አየር ጋር እንመራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Gourmet Menu Curation</span>
          <span className="am">ልዩ የምግብ ዝርዝር ዝግጅት</span>
        </>
      ),
      (
        <>
          <span className="en">Milestone Dinner Styling</span>
          <span className="am">የእራት ግብዣ ልዩ አቀማመጥ ንድፍ</span>
        </>
      ),
      (
        <>
          <span className="en">Ambiance & Audio Orchestration</span>
          <span className="am">የድምፅና የሙዚቃ ከባቢ አየር አደራደር</span>
        </>
      ),
      (
        <>
          <span className="en">Custom Guest Invitations</span>
          <span className="am">...ልዩ የክብር እንግዶች ጥሪ ካርድ</span>
        </>
      )
    ],
    image: "/images/service_floral_design.jpg",
    themeColor: "#F5EFE6",
    soundThemeIdx: 1, // Celebration loop
    particleThemeIdx: 1 // Shimmer dust
  },
  {
    id: "engagements",
    title: (
      <>
        <span className="en">Engagement Parties</span>
        <span className="am">የእጮኝነት በዓል ዝግጅት</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Aesthetic Foundations of Your Journey</span>
        <span className="am">የእርስዎ ረጅም ጉዞ ውብ ጅማሬ</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Marking your union's formal announcement. We combine traditional Ethiopian engagement customs with modern luxury design accents to host the perfect formal family introduction.</span>
        <span className="am">የህብረትዎን መደበኛ ማስታወቂያ ማክበር። ፍጹም የሆነውን የቤተሰብ ትውውቅ ለማዘጋጀት ባህላዊ የኢትዮጵያ የስነ-ስርዓት ልማዶችን ከዘመናዊ የቅንጦት ዲዛይን ጋር እናዋህዳለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Traditional Custom Integration</span>
          <span className="am">በባህላዊ ስርዓቶች ላይ እውቀትና ውህደት</span>
        </>
      ),
      (
        <>
          <span className="en">Inter-Family Liaison Support</span>
          <span className="am">የሁለቱ ቤተሰቦች ትውውቅ ድጋፍ</span>
        </>
      ),
      (
        <>
          <span className="en">Intimate Ceremony Styling</span>
          <span className="am">የጠበቀ ስነ-ስርዓት ልዩ አቀማመጥ</span>
        </>
      ),
      (
        <>
          <span className="en">Bespoke Gift Package Design</span>
          <span className="am">ልዩ የስጦታ ፓኬጆች ንድፍ</span>
        </>
      )
    ],
    image: "/images/service_floral_design.jpg",
    themeColor: "#FAF6F0",
    soundThemeIdx: 1,
    particleThemeIdx: 1
  },
  {
    id: "bridal-shower",
    title: (
      <>
        <span className="en">Bridal Shower Styling</span>
        <span className="am">የሙሽራዋ ሽኝት ማስጌጥ</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Chic Celebrations for the Bride-to-Be</span>
        <span className="am">ለሙሽሪት የተዘጋጀ ውብ መሰናዶ</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Celebrating the bride's transition with pure elegance. We design chic pre-wedding showers featuring gorgeous photo frames, custom dessert bars, and elegant gift backdrops.</span>
        <span className="am">የሙሽሪት ሽግግርን በንጹህ ውበት ማክበር። ቆንጆ የፎቶ ክፈፎችን፣ ልዩ ጣፋጭ ምግቦችን እና ውብ የስጦታ ዳራዎችን ያካተቱ የሙሽራ ሽኝት ዝግጅቶችን እንነድፋለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Theme & Styling Concept</span>
          <span className="am">የጭብጥ እና የማስጌጥ ሀሳብ</span>
        </>
      ),
      (
        <>
          <span className="en">Premium Dessert Displays</span>
          <span className="am">ምርጥ የጣፋጭ ማቅረቢያዎች</span>
        </>
      ),
      (
        <>
          <span className="en">Chic Backdrop Setups</span>
          <span className="am">ውብ እና ዘመናዊ የፎቶ ዳራዎች</span>
        </>
      ),
      (
        <>
          <span className="en">Bespoke Keepsake Favors</span>
          <span className="am">የማስታወሻ ስጦታዎች አዘጋጅቶ ማቅረብ</span>
        </>
      )
    ],
    image: "/images/service_wedding_planning.jpg",
    themeColor: "#F5EFE6",
    soundThemeIdx: 3,
    particleThemeIdx: 2 // Spotlights
  },
  {
    id: "photography",
    title: (
      <>
        <span className="en">Photography Production</span>
        <span className="am">የፎቶግራፍ ፕሮዳክሽን</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Bespoke Art Direction for Fine-Art Imagery</span>
        <span className="am">ለጥበብ ፎቶግራፍ ልዩ አቅጣጫ</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Preserving moments with editorial aesthetic. We partner with elite fine-art photographers, directing visual compositions and lighting to capture authentic portraiture.</span>
        <span className="am">ቅጽበቶችን በሚያምር ውበት መጠበቅ። እውነተኛ ስሜቶችን ለመቅረጽ የፎቶ ጥንቅር እና ብርሃንን በመምራት ከከፍተኛ የጥበብ ፎቶግራፍ አንሺዎች ጋር እንሰራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Artistic Shotlist Creation</span>
          <span className="am">የተመረጡ የፎቶዎች ዝርዝር ማዘጋጀት</span>
        </>
      ),
      (
        <>
          <span className="en">Editorial Portrait Direction</span>
          <span className="am">ለፎቶዎቹ ልዩ አቀማመጥ መምራት</span>
        </>
      ),
      (
        <>
          <span className="en">Scenic Light Consultation</span>
          <span className="am">የብርሃንና የጥላ አጠቃቀም ምክር</span>
        </>
      ),
      (
        <>
          <span className="en">Premium Photo Album Design</span>
          <span className="am">ልዩ የፎቶ አልበም ንድፍ</span>
        </>
      )
    ],
    image: "/images/production_luxury.jpg",
    themeColor: "#F5EFE6",
    soundThemeIdx: 3,
    particleThemeIdx: 2 // Spotlights
  },
  {
    id: "videography",
    title: (
      <>
        <span className="en">Videography Production</span>
        <span className="am">የቪዲዮግራፍ ፕሮዳክሽን</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Cinematic Event Documentaries</span>
        <span className="am">ሲኒማቲክ የክስተት ፊልሞች</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Producing breathtaking digital films. We oversee professional documentary and cinema camera crews, audio feeds, and editing directions to deliver high-end cinematic captures.</span>
        <span className="am">ልብ የሚነኩ ዲጂታል ፊልሞችን ማዘጋጀት። ከፍተኛ ደረጃ ያላቸውን የሲኒማ ምስሎችን ለማቅረብ ባለሙያ የፊልም ሰራተኞችን፣ የድምጽ ቀረጻዎችን እና የአስተያየት ሂደቶችን እንቆጣጠራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Gimbal & Drone Art Direction</span>
          <span className="am">የድሮን እና የካሜራ አቅጣጫ ጥበብ</span>
        </>
      ),
      (
        <>
          <span className="en">Raw Audio Feed Management</span>
          <span className="am">የድምፅ ቀረጻ ጥራት ቁጥጥር</span>
        </>
      ),
      (
        <>
          <span className="en">Storyboarding & Pace Layout</span>
          <span className="am">የፊልም ታሪክ ቅደም ተከተል ማስተካከል</span>
        </>
      ),
      (
        <>
          <span className="en">Cinematic Video Editing Review</span>
          <span className="am">የሲኒማ ቪዲዮ አርትኦት ግምገማ</span>
        </>
      )
    ],
    image: "/images/service_event_production.jpg",
    themeColor: "#FAF6F0",
    soundThemeIdx: 3,
    particleThemeIdx: 3
  },
  {
    id: "social-media",
    title: (
      <>
        <span className="en">Social Media Event Coverage</span>
        <span className="am">የማህበራዊ ሚዲያ ቀጥታ ሽፋን</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Real-Time Digital Visual Curation</span>
        <span className="am">በቀጥታ የማህበራዊ ሚዲያ ምስል ዝግጅት</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Ensuring instant digital footprints. We create immediate vertical content, behind-the-scenes reels, and high-fidelity event stories tailored for digital aesthetics.</span>
        <span className="am">ፈጣን ዲጂታል ተደራሽነትን ማረጋገጥ። ለማህበራዊ ሚዲያ ተደራሽነት የተዘጋጁ አጫጭር ቪዲዮዎችን፣ ከትዕይንት በስተጀርባ ያሉ ቀረጻዎችን እና ከፍተኛ ጥራት ያላቸውን የታሪክ ምስሎችን እንፈጥራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Live Vertical Reels Editing</span>
          <span className="am">የአጫጭር ቪዲዮዎች (Reels) አርትኦት</span>
        </>
      ),
      (
        <>
          <span className="en">Aesthetic Behind-the-Scenes Capture</span>
          <span className="am">ከትዕይንት በስተጀርባ ያሉ ቀረጻዎች</span>
        </>
      ),
      (
        <>
          <span className="en">Digital Story Layout Design</span>
          <span className="am">የዲጂታል ታሪክ አቀማመጥ ንድፍ</span>
        </>
      ),
      (
        <>
          <span className="en">Immediate Content Output</span>
          <span className="am">ፈጣን የይዘት ስርጭት</span>
        </>
      )
    ],
    image: "/images/service_floral_design.jpg",
    themeColor: "#FDFBF8",
    soundThemeIdx: 3,
    particleThemeIdx: 2
  },
  {
    id: "vendor-management",
    title: (
      <>
        <span className="en">Vendor Management</span>
        <span className="am">የአቅራቢዎች አስተዳደር</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Curating a Elite Team of Collaborators</span>
        <span className="am">ምርጥ የባለሙያዎች ቡድንን ማደራጀት</span>
      </>
    ),
    desc: (
      <>
        <span className="en">Aligning a network of Addis Ababa's finest. We coordinate caterers, florists, performers, and technical crews, managing all contracts and deliverables seamlessly.</span>
        <span className="am">የአዲስ አበባ ምርጦችን ማስተባበር። ሁሉንም ውሎች እና አቅርቦቶች በተሳካ ሁኔታ በመቆጣጠር የምግብ አቅራቢዎችን፣ የአበባ ባለሙያዎችን፣ ተዋናዮችን እና የቴክኒክ ሰራተኞችን እናስተባብራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Contract Review & Negotiation</span>
          <span className="am">የውሎች ግምገማ እና ድርድር</span>
        </>
      ),
      (
        <>
          <span className="en">Deliverable Tracking Systems</span>
          <span className="am">የአቅርቦቶች ቁጥጥር ስርዓት</span>
        </>
      ),
      (
        <>
          <span className="en">Schedule Alignment Meetings</span>
          <span className="am">የፕሮግራም ስምምነት ስብሰባዎች</span>
        </>
      ),
      (
        <>
          <span className="en">Post-Event Vendor Audits</span>
          <span className="am">ከዝግጅቱ በኋላ የአገልግሎት ግምገማ</span>
        </>
      )
    ],
    image: "/images/service_event_styling.jpg",
    themeColor: "#F5EFE6",
    soundThemeIdx: 2,
    particleThemeIdx: 3
  },
  {
    id: "timeline-logistics",
    title: (
      <>
        <span className="en">Timeline & Logistics Management</span>
        <span className="am">የጊዜ ሰሌዳ እና የሎጅስቲክስ አስተዳደር</span>
      </>
    ),
    subtitle: (
      <>
        <span className="en">Microscopic Chronological Coordination</span>
        <span className="am">እጅግ በጣም ጥንቃቄ የተሞላበት የጊዜ ቅንጅት</span>
      </>
    ),
    desc: (
      <>
        <span className="en">We construct minute-by-minute master logs. We choreograph arrival sequences, load-ins, production cues, guest movements, and load-outs down to the second.</span>
        <span className="am">የእያንዳንዱን ደቂቃ ዝርዝር መዝገብ እናዘጋጃለን። የእንግዶችን እንቅስቃሴ፣ የመሳሪያዎች መጫንና ማውረድን፣ እና የፕሮግራሞችን ፍሰት እስከ ሰከንዶች ድረስ በጥንቃቄ እንመራለን።</span>
      </>
    ),
    details: [
      (
        <>
          <span className="en">Minute-by-Minute Master Log</span>
          <span className="am">የእያንዳንዱ ደቂቃ ማስተር መዝገብ</span>
        </>
      ),
      (
        <>
          <span className="en">Setup & Load-in Timeline</span>
          <span className="am">የመሳሪያዎች ዝግጅትና ጭነት የጊዜ ሰሌዳ</span>
        </>
      ),
      (
        <>
          <span className="en">Crowd Flow Coordination</span>
          <span className="am">የሰዎች ፍሰትና አቅጣጫ አስተባባሪነት</span>
        </>
      ),
      (
        <>
          <span className="en">Security & Safety Coordination</span>
          <span className="am">የደህንነት እና የጥበቃ አስተባባሪነት</span>
        </>
      )
    ],
    image: "/images/service_wedding_design.jpg",
    themeColor: "#FAF6F0",
    soundThemeIdx: 2,
    particleThemeIdx: 3
  }
];

interface VerticalServicesProps {
  onIndexChange: (index: number) => void;
}

export default function VerticalServices({ onIndexChange }: VerticalServicesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Trigger index change handler for parent component (sound sync)
  useEffect(() => {
    onIndexChange(SERVICES[activeIndex].soundThemeIdx);
  }, [activeIndex, onIndexChange]);

  // Set up intersection observer to detect the active service section in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px", // triggers when card occupies center of viewport
      threshold: 0.2
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute("data-index") || "0", 10);
          setActiveIndex(idx);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className={styles.servicesSection}>

      <div className={styles.container}>
        <div className={styles.stagePanel}>
          {SERVICES.map((service, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                data-index={idx}
                className={`${styles.slideCard} ${
                  isActive ? styles.growing : styles.shrinking
                }`}
              >
                <div className={styles.cardContent}>
                  {/* Header: Counter, Subtitle and Title */}
                  <div className={styles.cardHeader}>
                    <span className={styles.mainSectionOfferTag}>
                      WHAT WE OFFER
                    </span>
                    <span className={styles.cardCounter}>
                      SERVICE {idx < 9 ? `0${idx + 1}` : idx + 1} / 12
                    </span>
                    <span className={styles.cardSubtitle}>
                      {service.subtitle}
                    </span>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                  </div>

                  <div className={styles.detailsDivider} />

                  {/* Footer Description */}
                  <div className={styles.cardInfoBody}>
                    <div className={styles.cardDesc}>{service.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
