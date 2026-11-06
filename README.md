# 🏨 Hotel Al Safa - Luxury Website & Online Booking Management System

> **A high-conversion, modern, and elegant hotel web portal and direct booking system designed for Hotel Al Safa (Dhaka, Bangladesh).**  
> Inspired by the luxury transit hospitality aesthetic of [Hotel D'Palace BD](https://hoteldpalacebd.com/), optimized for international airport transit travelers, Hajj/Umrah pilgrims, tourists, and business executives.

---

## 📸 Brand Identity & Logo
- **Official Hotel Logo**: Processed with clean transparent background (`RGBA`), anti-aliased edge smoothing, and zero white box artifacts. 
  - Central Emblem: [`/public/logo.png`](./public/logo.png) (used in the navbar, booking modal, admin header, and footer).
  - Full Royal Crest: [`/public/logo-full.png`](./public/logo-full.png) (featured prominently on the Hero section).
- **Aesthetic Direction**: Deep Navy (`#0B111E`), Classic Warm Gold (`#D4AF37`), Soft Ivory (`#FDFBF7`), and authentic Bangladeshi payment colors (bKash Pink `#E2136E`, Nagad Orange `#F7941D`).

---

## 🚀 Execution & Phase Progress Tracker

| Phase | Milestone / Feature | Status |
| :--- | :--- | :---: |
| **Phase 1** | **Foundation & Design System Setup** | **Completed** ✅ |
| | • Unified Next.js 15 (App Router) + TypeScript + Tailwind CSS | `[x]` |
| | • Integrated official Hotel Al Safa gold emblem logo in public assets | `[x]` |
| | • SQLite embedded database with Prisma ORM (zero Docker / zero config) | `[x]` |
| | • Pre-populated database seed (`prisma/seed.ts`) with authentic Dhaka transit room categories & BDT prices | `[x]` |
| **Phase 2** | **Public Showcase & Visual Brand Elevation (D'Palace BD Style)** | **Completed** ✅ |
| | • Top bar with direct contact numbers (`+880 1894-782070`), email, address, and 24/7 desk indicator | `[x]` |
| | • Glassmorphism luxury header with brand logo, nav links, and gold "Book Online" CTA | `[x]` |
| | • Immersive Hero section with live **Quick Availability & Booking Bar** (Dates, Guests, Room selector) | `[x]` |
| | • 4 Value Pillars: 5 Mins to Airport, 24/7 Front Desk, Halal Dining & Cafe, Hajj/Pilgrim friendly | `[x]` |
| | • Filterable Rooms & Suites catalog with AC/Non-AC badges, photo zoom, amenity tags, and BDT rates (৳) | `[x]` |
| | • Interactive Room Detail Modal with high-res photo gallery, capacity specs, and amenity matrix | `[x]` |
| | • Hotel Amenities & Facilities showcase (Airport pickup, 24h Hot Water Geyser, Generator power backup) | `[x]` |
| | • On-site Halal Dining & Culinary showcase (Desi breakfast, Kacchi Biryani, 24h room service) | `[x]` |
| | • Strategic Location section with interactive Google Maps embed & distance badges to Airport & Hajj Camp | `[x]` |
| | • Real Guest reviews and 5-star ratings | `[x]` |
| | • Direct WhatsApp floating action button and mobile quick booking pill | `[x]` |
| | • Rich footer with room links, accepted payment gateway badges, and Crafix Tech credit | `[x]` |
| **Phase 3** | **Interactive Guest Booking Engine** | **Completed** ✅ |
| | • Multi-step frictionless checkout modal (`/components/booking-modal.tsx`) | `[x]` |
| | • Dynamic date range & night counter with automatic pricing calculations | `[x]` |
| | • Add-ons selector: Airport Shuttle (+৳1,200), Extra Bed (+৳500/night), Buffet Breakfast (+৳450/person) | `[x]` |
| | • Real-time 5% VAT & Service Surcharge calculation | `[x]` |
| | • Authentic multi-gateway payment selector: **bKash**, **Nagad**, **Cards (SSLCommerz/Visa/Master)**, and **Pay at Hotel** | `[x]` |
| | • Simulated payment confirmation modal with celebration confetti (`canvas-confetti`) | `[x]` |
| | • Instant printable/downloadable booking voucher with reference code (`ALSAFA-XXXXX`) | `[x]` |
| | • Direct WhatsApp notification trigger for guests to confirm with the front desk | `[x]` |
| **Phase 4** | **Admin Operations & Front Desk Portal (`/admin`)** | **Completed** ✅ |
| | • Executive KPI dashboard: Collected Revenue (৳), Active In-House Stays, Confirmed Arrivals | `[x]` |
| | • Real-time reservation records table with search by code, guest name, or phone number | `[x]` |
| | • Instant status lifecycle dropdown: `CONFIRMED` ➔ `CHECKED_IN` ➔ `CHECKED_OUT` ➔ `CANCELLED` | `[x]` |
| | • Payment status editor (`PAID`, `PENDING`, `REFUNDED`) | `[x]` |
| | • Guest reservation details viewer modal (special requests, flight notes, add-ons) | `[x]` |
| | • Room Rates & Pricing Manager: 1-click nightly rate editor with instant live-site updates | `[x]` |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Gold and Dark luxury tokens
- **Icons**: Lucide React
- **Animations & Effects**: Framer Motion, Canvas Confetti
- **Database**: SQLite via Prisma ORM (`prisma/schema.prisma`)
- **Typography**: Playfair Display (Serif headings) & Plus Jakarta Sans / Inter (Modern UI)

---

## 💻 How to Run Locally

### 1. Clone or Open Workspace
```bash
cd /home/zihad/Documents/al-safa
```

### 2. Install Dependencies (if not already installed)
```bash
npm install
```

### 3. Generate Database & Seed Sample Data
```bash
npm run seed
```
This initializes the SQLite database (`prisma/dev.db`) and seeds standard room categories (Couple AC, Couple Non-AC, Super Deluxe, Royal Family Suite, Presidential Suite), sample bookings, and guest reviews.

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser:
- **Public Guest Site**: `http://localhost:3000`
- **Staff & Admin Management Portal**: `http://localhost:3000/admin`

---

## 🗺️ Key Pages & Endpoints

| Route | Description |
| :--- | :--- |
| `/` | Public hotel showcase, interactive booking bar, room cards, dining, amenities, and location map. |
| `/admin` | Centralized front desk operations portal, reservation table, status management, and room rate editor. |
| `/api/rooms` | GET all room categories & PATCH nightly base price / availability. |
| `/api/bookings` | GET all reservations & POST new guest bookings. |
| `/api/bookings/[id]` | PATCH reservation status (`CONFIRMED`, `CHECKED_IN`, etc.) & DELETE reservations. |

---

## 📄 License & Credits
- **Client**: Hotel Al Safa (Dhaka, Bangladesh)
- **Engineered & Designed by**: [Crafix Tech](https://www.crafix.tech/) (hello@crafix.tech)
