# Lakhnavi Sewa — Premium On-Demand Services Marketplace (SaaS Prototype)

A premium, investor-ready clickable SaaS prototype designed for the localized on-demand services economy in Lucknow, Uttar Pradesh. The platform bridges the gap between service consumers and local hyper-vetted professionals, builders, laborers, and contractors.

Developed with dual-language support (English & Hindi) to cater to all service providers and customers alike.

---

## 1. Product Verticals & Categories

The marketplace organizes its services into six primary pillars:
- **Beauty & Grooming** (Salon at home, styling)
- **Home Repairs & Maintenance** (Plumbing, electrical, carpentry)
- **Cleaning & Pest Control** (Deep cleaning, sanitization)
- **Native Smart Products** (Local tech installations, IoT setups)
- **Indian Labours** (Daily wage workers, structural helpers)
- **Contractors & Builders** (Renovation, construction, project oversight)

---

## 2. Technical Stack

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express (Local REST API server boundary layer)
- **Database**: Mock JSON stores with read/write persistence
- **Icons**: Lucide React
- **Typography**: Inter Sans

---

## 3. Design System & Design Tokens

Conforming to the custom-tailored color values and spacing rules:
- **Primary**: `#5C33F6`
- **Primary Hover**: `#4B29D4`
- **Accent**: `#FF6B6B`
- **Canvas**: `#FFFFFF`
- **Surface**: `#F8F9FC`
- **Surface2**: `#EEF0F8`
- **Ink**: `#1A1A2E`
- **Muted**: `#6E7191`
- **Border**: `#DDE2F0`
- **Spacing**: Strict 8px grid alignment (Tailwind standard spacing mappings)

---

## 4. Repository Structure

```
looksV2/
├── package.json               # Root monorepo configuration & concurrency runner
├── apps/
│   ├── web/                   # Next.js Frontend Application
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   ├── src/
│   │   │   ├── app/           # App Router layout, home, catalog, and dashboard pages
│   │   │   ├── components/    # Navbar, Footer, AppContext (global state)
│   │   │   └── utils/         # Localization and translation dictionaries
│   └── server/                # Node/Express API Simulator
│       ├── package.json
│       ├── src/
│       │   └── index.ts       # Express server routes and entry point
│       └── data/              # Mock JSON schema stores (read/write persisted)
```

---

## 5. Startup & Deployment Protocol

### Local Execution (Concurrently)
To launch both the Express backend (on port 5000) and the Next.js frontend (on port 3000) simultaneously:

1. Clone or navigate to the workspace directory.
2. Run dependency installations:
   ```bash
   npm install
   ```
3. Boot the unified local dev environments:
   ```bash
   npm run dev
   ```
4. Access the web portal locally:
   - Frontend: `http://localhost:3000`
   - Express API Server: `http://localhost:5000`

### Security Key Access
- **Admin Dashboard security password**: `----`

---

## 6. Future Migration Roadmap

1. **Authentication**: Transition to NextAuth.js or Clerk.
2. **Database**: Implement Prisma ORM with PostgreSQL.
3. **Payments**: Integrations for Stripe or Razorpay API gateways.
4. **Geolocation**: Mapbox / Google Maps API integrations for live Lucknow tracking.

---

## 7. Copyright

Design Concept & Product Idea  
© AFZAL EHSAN  
All Rights Reserved.  
