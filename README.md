# Sterling & Co. Tax Advisors - Premium Multi-Page Website

A luxury fintech web platform built for **Sterling & Co. Tax Advisors**, a private client wealth preservation and corporate tax consultancy firm.

## Brand Design System
- **Midnight Navy** (`#0B1426`, `#070D18`): Deep institutional trust and authority.
- **Antique Gold** (`#C9A24B`, `#DFC07A`, `#96752C`): Dynastic wealth, precision, and sovereign excellence.
- **Warm Ivory** (`#F7F3EA`): High-clarity typography and contrast.
- **Emerald Accent** (`#1F7A66`, `#289E84`): Compliance clearance and verified tax savings metrics.
- **Typography**:
  - Headings: *Playfair Display* (Editorial luxury serif)
  - Body Text: *Inter* (Legibility and modern fintech clarity)
- **Visual Texture**: Custom SVG procedural grain overlay, glassmorphic cards (`backdrop-filter: blur(16px)`), thin gold borders (`rgba(201, 162, 75, 0.28)`), and glowing ambient radial meshes.
- **Theme Modes (White Mode & Midnight Dark Mode)**:
  - **White Mode (Default)**: Pristine warm ivory/alabaster surfaces (`#FDFBF7`), frosted white cards (`rgba(255, 255, 255, 0.92)`), deep royal imperial violet headings (`#4C1D95`), rich antique gold accents (`#B38938`), and dark slate body text (`#475569`).
  - **Midnight Navy Mode**: Deep navy backdrops (`#0B1426`, `#070D18`), glowing antique gold borders, and luminous amethyst violet headings (`#DDD6FE`).
  - **Persistent Theme Switcher**: Instant Sun/Moon toggle button positioned on the sticky navbar across every page and in the mobile menu, with zero-flash `<head>` execution and `localStorage` persistence.

---

## Pages & Structure

### 1. `index.html` — HOME (11 Sections)
1. **Cinematic Hero**: Split-text headline animation, institutional gold badge, trust stats ($480M+ saved, 99.8% compliance rate, 28+ years heritage), and dual magnetic CTAs.
2. **Trust Bar Marquee**: Infinite smooth marquee showcasing global capital partners and family offices.
3. **About Preview**: Clip-path curtain wipe image reveal, founder quote, and key mandate features.
4. **Core Services Grid**: 3D hover tilt cards with gold top borders, practice metrics, and direct links.
5. **Why Choose Us**: Animated GSAP number counters displaying cumulative savings and compliance records.
6. **Our Process**: 4-stage methodology with pinned horizontal scroll on desktop and responsive stack on mobile.
7. **Interactive Tax Calculator Widget**: Multi-regime income tax and strategic savings estimator with income slider, deduction toggles, and live comparative liability bars.
8. **Industries We Serve**: Dedicated cards for Family Offices, Tech Unicorns, Real Estate Conglomerates, Private Equity, Expatriates, and Healthcare Groups.
9. **Testimonials Slider**: Rotating client testimonials with star ratings, executive avatars, prev/next arrows, and pagination dots.
10. **Latest Blog Posts**: Editorial insights with read times, category badges, and direct links.
11. **CTA Banner & Luxury Footer**: High-impact consultation card, 4-column footer, and executive newsletter subscription form.

### 2. `about.html` — ABOUT (8 Sections)
1. **Hero**: Split-text header and heritage badge.
2. **Our Story**: Foundational history from 1998 London/Manhattan inception to $14.2B in managed client asset structures.
3. **Mission & Vision**: Split glassmorphism cards detailing fiduciary philosophy and global horizon.
4. **Core Values**: Discretion, Forensic Rigor, Proactive Foresight, and Uncompromising Ethics.
5. **Leadership & Partners**: Senior partners (Alistair Sterling, Claire Beauchamp, David Thorne, Mei-Ling Zhou) with credentials, bios, and direct contact icons.
6. **Milestones Timeline**: Interactive vertical timeline tracking global expansion from 1998 to 2026.
7. **Certifications & Accreditations**: AICPA, Chambers HNW Band 1, STEP Worldwide, and ISO 27001 seals.
8. **Strategic CTA Banner & Footer**.

### 3. `services.html` — SERVICES (10 Sections)
1. **Hero**: Architectural overview of multilateral tax practices.
2. **Advisory Philosophy**: Legal defensibility and strategic capital compounding.
3. **Private Wealth & Dynastic Filing**: GRATs, FLPs, and generational transfer mitigation.
4. **Corporate Tax, GST & OECD Pillar Two**: Substance carve-outs, R&D credits, and GloBE rules.
5. **Audit Defense & Controversy Forensics**: IRS/HMRC tribunal representation and penalty abatement.
6. **M&A Tax Structuring & Due Diligence**: Section 1202 QSBS exclusion and basis step-up modeling.
7. **Cross-Border Treaties & Expatriation**: 68 double tax treaties and Swiss/Dubai relocation.
8. **Tiered Retainer Pricing**: Private Client, Growth Corporate, and Sovereign Enterprise tiers with interactive Monthly vs. Annual (20% discount) switcher.
9. **Interactive FAQ Accordion**: Expandable questions with real-time keyword search filter.
10. **Practice Consultation CTA Banner & Footer**.

### 4. `blog.html` — TAX INTELLIGENCE & INSIGHTS (9 Sections)
1. **Hero**: Real-time insight search bar.
2. **Featured Spotlight Post**: In-depth analysis on OECD Pillar Two global minimum tax.
3. **Category Filter Tabs**: Interactive switching between Corporate, Wealth, Cross-Border, and Compliance.
4. **Dynamic Post Grid**: Filterable articles with metadata and read times.
5. **Tax Deadlines Calendar**: Filterable calendar widget organized by month.
6. **Downloadable Whitepapers**: Technical PDF guides with instant toast confirmation.
7. **Private Intelligence Newsletter**: Subscription module with instant feedback.
8. **Popular Editorial Briefings**: Top read articles list.
9. **Advisory CTA Banner & Footer**.

### 5. `contact.html` — CONTACT & INTAKE (9 Sections)
1. **Hero**: 2-hour partner response guarantee under attorney-client privilege.
2. **Live World Clocks**: Real-time clocks for New York (EST), London (GMT), Zurich (CET), Singapore (SGT), and Dubai (GST).
3. **Confidential Intake Form**: Multi-step fields with real-time validation, service picker, asset bracket, and drag-and-drop 256-bit vault file upload simulation.
4. **Emergency Controversy Desk**: Direct partner telephone hotline for active audits.
5. **Book-a-Consultation Scheduler**: Date picker, time slot selector, advisor selector, and confirmation flow.
6. **Global Offices Grid**: Contact details for New York, London, Zurich, Singapore, and Dubai.
7. **Interactive Dark SVG World Map**: Clickable global hubs and flight routes.
8. **Intake & NDA FAQ Accordion**.
9. **Social & Terminal Links + Final CTA Banner & Footer**.

### 6. `login.html` — CLIENT VAULT (Unique Split-Screen Architecture)
- **Left Showcase**: Deep midnight gradient canvas with floating 3D fintech badges (256-Bit Vault Enclave, Real-Time Projections, Audit Defense Shield), managing trustee testimonial, and SOC 2 security badges.
- **Right Glass Card**: 3D card flip between **Client Sign In** and **Vault Registration**.
  - Show / Hide password toggle with SVG icon.
  - Real-time password entropy & strength meter.
  - Client classification selector (Individual vs. Corporate).
  - Google Workspace & Microsoft Enterprise SSO buttons.
  - Forgot password modal trigger.
  - Return to Main Site navigation link.

---

## Animation & Interaction Engine
- **Lenis Smooth Scroll**: Buttery smooth momentum scrolling synchronized with GSAP ticker.
- **GSAP 3 & ScrollTrigger**: Choreographed scroll-driven reveals, parallax elements, and scrub animations.
- **Custom Text Splitter**: Custom recursive text node parser that animates words and lines with staggered masks while preserving inline HTML formatting and gradient accents.
- **Clip-Path Image Reveal**: Upward curtain wipes and subtle scaling on entrance.
- **Custom Cursor & Magnetic Physics**: Smooth lerping gold ring, trailing dot, and magnetic pull on buttons.
- **Page Transitions**: Fullscreen gold-logo curtain wipe between page navigations.
- **Initial Preloader**: Monogram pulse and percentage counter with session caching.

---

## How to View
Open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox). All dependencies (Lenis, GSAP, Google Fonts) load reliably via CDN with zero build steps or package installations required.
