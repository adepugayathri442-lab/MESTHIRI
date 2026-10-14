# MESTHIRI (మేస్త్రీ / மேஸ்திரி / मिस्त्री)
> **Flooring Services & Material Marketplace Platform**  
> *Innovation Engineering Capstone Web Application with Real Places API & Worker Registry Integration*

---

## 🌟 Executive Summary

**MESTHIRI** is an architectural construction-tech web platform engineered for a college Innovation Engineering presentation. It unites homeowners, skilled marble and tile craftsmen (Mesthiris), and stone suppliers with transparent benchmark bidding, Indian Standard (**IS 1443**) lippage tolerances, Google Maps Platform Places API business discovery, voluntary worker registration, and an interactive **Floor Visualizer Studio**.

---

## 🏗️ Dual Data Architecture

MESTHIRI implements **both public business listings and registered worker profiles** without fabricating fallback records:

### A. Public Business Listings (`/api/places`)
- Discovers real flooring contractors, marble shops, granite yards, and tile showrooms in Telangana.
- Integrates server-side with **Google Maps Platform Places API** (Text Search New + Legacy fallback).
- API keys are secured on the server and loaded via `process.env.GOOGLE_PLACES_API_KEY`.
- Mandatory Google attribution ("Powered by Google") and backlinks to Google Maps pages.
- Requests only permitted fields (`displayName`, `formattedAddress`, `nationalPhoneNumber`, `websiteUri`, `rating`, `userRatingCount`, `reviews`).
- When the API key is not configured or results are empty: displays honest setup instructions and clear empty states (**Never generates artificial businesses**).

### B. Registered Worker Profiles (`/api/workers`)
- Real flooring craftsmen voluntarily register their name, primary Telangana city, locality, trade skills, experience, contact phone, and portfolio summary.
- Persistent file-based document storage on the server (`src/data/registered_workers.json`) with atomic reads and updates.
- Endpoints:
  - `GET /api/workers?city={city}&category={category}`: Filter registered workers across Telangana.
  - `POST /api/workers`: Register a new craftsman profile (assigns default status: `Registered on MESTHIRI`).
  - `PATCH /api/workers`: Update profile details and submit ID/skills verification requests.
- Honest Empty States: If no workers are registered in a city (e.g. Siddipet or Warangal), displays `"No registered workers found in this area yet"` with an instant `[+ Register as Mesthiri]` action.

---

## 🗺️ Telangana Geographic Coverage

Standardized coverage across 12 Telangana urban centers:
1. **Hyderabad**
2. **Secunderabad**
3. **Warangal**
4. **Nizamabad**
5. **Karimnagar**
6. **Siddipet**
7. **Khammam**
8. **Mahbubnagar**
9. **Ramagundam**
10. **Nalgonda**
11. **Suryapet**
12. **Adilabad**

---

## 🛡️ Truthful 5-Tier Verification Framework

MESTHIRI upholds rigorous data integrity. Badges are granted **only** after corresponding checks are completed and verified:

1. **`Publicly Listed`**: Found in an external business directory (Google Maps). *A Google listing or star rating alone is never treated as proof of individual craftsmanship.*
2. **`Registered on MESTHIRI`**: Craftsman voluntarily submitted their profile and trade details.
3. **`Identity Checked`**: Government ID (Aadhaar / Artisan Trade Registration) reviewed and confirmed by an administrator.
4. **`Skills Verified`**: Practical on-site tool audit (optical laser levels, wet diamond cutter) and joint lippage calibration testing (<1.0mm per IS 1443).
5. **`Business Confirmed`**: Commercial premise, municipal trade license, and GSTIN audited by regional coordinators.

---

## 💎 Material Marketplace & Pricing Compliance

- **Architectural Specifications**: 6 core materials (Italian Marble, Indian Marble, Black Galaxy Granite, Vitrified Tiles, Ceramic Tiles, Terrazzo / Mosaic) with standard thickness (18–20mm calibrated slabs), recommended finishes, and typical applications.
- **Pricing & Stock Rule**: Displays **"Contact supplier for current price and availability"** and **"Contact supplier for current batch stock and availability"**. No fabricated live inventory counts.
- **IS 1443 Wastage Calculator**: Built-in 10% wastage allowance calculation for accurate stone slab billing.
- **Supplier Onboarding Portal**: Intake form for trade-licensed marble and tile depots in Telangana.

---

## 🎨 Architectural Design System

- **Warm Ivory / Cream (`#FBF9F5` / `#F6F2E9`)**: High-contrast, elegant canvas.
- **Deep Charcoal (`#172321`)**: Primary typography and dark architectural sections.
- **Stone Grey (`#6E6B65` / `#E2DDD2`)**: Structural borders and architectural grid motifs.
- **Deep Teal (`#245B50`)**: Primary brand actions and verified status accents.
- **Restrained Amber / Gold (`#C5A66B`)**: Accent highlights, star rating icons, and slider controls.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (Strict Mode Type Safety)
- **UI & Styling**: Tailwind CSS v4 (Architectural Design Tokens)
- **Icons**: Lucide React
- **API Handlers**: Server Route Handlers (`/api/places`, `/api/workers`)
- **Bundler**: Webpack Bundler

---

## 🚀 Setup & Testing Instructions

### 1. Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```bash
# Optional: Set your Google Maps Places API Key to activate live public listings
GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key
```

### 3. Build & Run
```bash
# Build production bundle
npm run build

# Start production server
npx next start -p 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Verification & Testing Checklist
- [x] **Home Hero**: Click city dropdown to test Telangana cities including Hyderabad, Warangal, Nizamabad, and Siddipet.
- [x] **Worker Directory**:
  - Tab 1 (*Registered Workers*): Test truthful empty state for unpopulated cities, click `[+ Register Your Profile]`, submit a registration, and observe the live profile appear with status `Registered on MESTHIRI`.
  - Tab 2 (*Public Directory*): Shows Google Places API configuration notice when key is unconfigured without falling back to fake records.
  - Tab 3 (*Verification Tiers*): Review the 5-tier integrity framework.
- [x] **Worker Dashboard**: Switch to Worker mode to test profile management, KYC identity document submission, and skills audit scheduling.
- [x] **Floor Visualizer**: Verify disclaimer banner: *"Prototype Preview — AI integration not connected"*.
- [x] **Material Marketplace**: Verify pricing guidance: *"Contact supplier for current price and availability"*.
