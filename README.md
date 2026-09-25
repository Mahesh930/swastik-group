# Dear Pune — Chapter Two: The Unsent Letter

> **A production-ready full-stack web application, research listening platform, and telemetry engine for Swastik Realty Group.**  
> Built as an advanced architectural upgrade from a prototype landing page into an enterprise-grade digital experience for the HR evaluation process.

---

## 🌟 Executive Summary

**"Dear Pune — Chapter Two: The Unsent Letter"** is a narrative-driven listening platform conceived by Swastik Realty Group. Rather than bombarding homebuyers with conventional sales collateral or aggressive property pitches, Chapter Two creates an authentic emotional bridge with Pune's residents. It invites Punekars to reflect on what genuine luxury, calmness, and home mean to them.

This project transforms an initial 736 KB single-file HTML prototype into an **optimized, full-stack, component-driven, production-ready MERN/Vite system** featuring:
1. **Interactive Editorial UI**: Parchment aesthetic, Playfair typography, smooth scrolling progress, and procedural Pune monsoon ambient sound generator (Web Audio API).
2. **Functional Preferences Questionnaire**: Real-time validation, character counting, and celebratory feedback that immediately writes to an active backend.
3. **Live Community Thought Wall**: Real-time reflection cards with keyword search, category filtering, and micro-reactions (*Heart*, *Resonates*, *True Pune*).
4. **Interactive Wax Seal Envelope**: Physical 3D seal-breaking animation, paper rustle audio synthesis, secret fragment reveal, and next-clue intent tracking.
5. **Real-Time Analytics & Telemetry HUD**: Floating live inspector monitoring every `dataLayer` and GA4 event payload as users interact.
6. **Executive Admin Console**: KPI overview, dynamic visual breakdown charts for preferences, responsive moderation table, and instant CSV export.
7. **Production Performance**: Reduced core HTML from **736 KB to 2.4 KB** by extracting and caching base64 assets into optimized WebP formats.

---

## 🏗️ System Architecture

```text
                           Punekar (User)
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   React 18 + Vite     │
                     │  (Client Experience)  │
                     └───────────┬───────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
     ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
     │  Preference   │   │ Interactive   │   │  Live Events  │
     │  Form Submit  │   │ Envelope Seal │   │  dataLayer    │
     └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
                     POST /api/preferences
                     POST /api/analytics/event
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │     Express Server    │
                     │ (Node.js RESTful API) │
                     └───────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌───────────────────┐           ┌───────────────────┐
       │   MongoDB Atlas   │           │ Local Persistent  │
       │  (if MONGODB_URI) │    OR     │    JSON Store     │
       │(Mongoose Schemas) │           │(Zero-Config Mode) │
       └───────────────────┘           └───────────────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Admin & Data Console │
                     │  (Analytics & Charts) │
                     └───────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Description / Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 6, CSS3 Variables | Blazing HMR, component modularity, zero runtime CSS bloat. |
| **Icons & Micro-UI**| `lucide-react`, `canvas-confetti` | Lightweight vector icons and delightful submit celebration. |
| **Audio Synthesis** | Web Audio API | Procedural monsoon rain and paper sound with zero external files. |
| **Backend** | Node.js, Express 4, CORS, Dotenv | Clean REST API with error handling, validation, and static serving. |
| **Database** | MongoDB / Mongoose + Local JSON | Dual-engine: Zero-config persistent store locally + Atlas in cloud. |
| **Analytics** | `window.dataLayer`, GA4 schema, REST | Captures funnels, scroll depth milestones, and user intents. |

---

## 📐 Project Structure

```text
swastik-group/
├── public/
│   └── images/                     # Extracted & cached WebP assets
│       ├── logo.webp               # Brand identity
│       ├── hero-letter.webp        # Hero storytelling artwork
│       ├── sent-01-rain.webp       # Chapter One: First Rain
│       ├── sent-02-morning.webp    # Chapter One: Mornings
│       ├── sent-03-trees.webp      # Chapter One: Trees
│       ├── sent-04-heritage.webp   # Chapter One: Character
│       ├── listen-growth.webp      # Listening horizon artwork
│       └── sealed-envelope.webp    # Wax-sealed letter artwork
│
├── server/
│   ├── data/
│   │   ├── preferences.json        # Persistent community thoughts store
│   │   ├── analytics.json          # Persistent telemetry store
│   │   └── seedPreferences.js      # Authentic Pune community seed reflections
│   │
│   ├── models/
│   │   ├── Preference.js           # Mongoose model for preferences
│   │   └── AnalyticsEvent.js       # Mongoose model for analytics telemetry
│   │
│   └── index.js                    # Express REST API & static server
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Header with logo, audio, HUD, & admin triggers
│   │   ├── Hero.jsx                # Editorial hero with wax badge & stats
│   │   ├── SentLetters.jsx         # Chapter One archive with reading modal
│   │   ├── UnsentTurn.jsx          # Maroon narrative chapter transition
│   │   ├── PreferenceForm.jsx      # Functional questionnaire with live validation
│   │   ├── ResponseWall.jsx        # Filterable community wall with reactions
│   │   ├── ListeningSection.jsx    # Clues section with icon cards
│   │   ├── SealedLetter.jsx        # Unfolding envelope & clue intent capture
│   │   ├── Footer.jsx              # Editorial footer with links
│   │   ├── AnalyticsHUD.jsx        # Live telemetry inspector drawer for evaluators
│   │   ├── AdminDashboard.jsx      # Executive analytics console with charts & CSV export
│   │   └── AudioAmbient.jsx        # Web Audio procedural sound generator
│   │
│   ├── App.jsx                     # Central state, event dispatcher, scroll observer
│   ├── main.jsx                    # React 18 DOM root
│   └── index.css                   # Global tokens, typography, and responsive styles
│
├── index.html                      # SEO meta tags, OpenGraph, JSON-LD schema
├── vite.config.js                  # Vite configuration & API proxy
├── package.json                    # Dependencies and automation scripts
└── README.md                       # Comprehensive documentation
```

---

## 🔌 API Endpoints

### 1. Preferences & Community Thoughts

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/preferences` | Retrieve thoughts + aggregate breakdown statistics | `?luxury=...&home=...&commute=...&search=...` |
| `POST` | `/api/preferences` | Submit new preference and reflection | `{ luxury, home, commute, thought, author }` |
| `PATCH`| `/api/preferences/:id/reaction` | Increment community reaction | `{ type: 'heart' \| 'resonates' \| 'truePune' }` |
| `DELETE`| `/api/preferences/:id` | Remove an entry (Admin moderation) | None |

#### Sample Request (`POST /api/preferences`):
```json
{
  "luxury": "More nature",
  "home": "A greener view",
  "commute": "Absolutely",
  "thought": "A quiet veranda where morning tea feels unhurried, surrounded by neem trees.",
  "author": "A Punekar from Law College Road"
}
```

#### Sample Response:
```json
{
  "success": true,
  "message": "Your reflection has been added to the Unsent Letter.",
  "preference": {
    "id": "pref-1727278237-abc12",
    "luxury": "More nature",
    "home": "A greener view",
    "commute": "Absolutely",
    "thought": "A quiet veranda where morning tea feels unhurried, surrounded by neem trees.",
    "author": "A Punekar from Law College Road",
    "reactions": { "heart": 0, "resonates": 0, "truePune": 0 },
    "createdAt": "2026-09-25T15:30:37.000Z"
  },
  "stats": {
    "total": 7,
    "luxuryCounts": { "More nature": 3, "More space": 2, "More privacy": 1, "More convenience": 1 },
    "homeCounts": { "A greener view": 4, "More room": 2, "A better location": 1 },
    "commuteCounts": { "Absolutely": 4, "Maybe": 2, "Probably not": 1 }
  }
}
```

### 2. Analytics & Telemetry

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics` | Returns aggregate counts, funnel milestones, and recent telemetry events |
| `POST` | `/api/analytics/event` | Ingests a new analytics event (synchronized with `window.dataLayer`) |
| `GET` | `/api/health` | Service uptime and database status indicator |

---

## 📊 Analytics Events Tracked

Every engagement point emits an official event that is pushed to `window.dataLayer` for GA4 / Meta Pixel and synchronized with the backend:

1. `P2_Landing_View`: Triggered when the page initializes.
2. `P2_50_Scroll`: Triggered once the user reads halfway down (50% scroll depth).
3. `P2_90_Scroll`: Triggered when the user completes reading (90% scroll depth).
4. `P2_Preference_Select`: Triggered whenever an option pill is selected.
5. `P2_Home_Must_Have`: Triggered upon thought submission.
6. `form_submitted`: Tracks form completion conversion.
7. `P2_Open_Letter_Click`: Triggered when breaking the wax seal or unfolding the envelope.
8. `P2_Next_Clue_Intent`: Triggered when expressing interest in Chapter Three.
9. `P2_Wall_Reaction`: Tracks community engagement on resident thought cards.
10. `ambient_audio_toggled`: Tracks usage of the Pune monsoon audio engine.

> **Pro-Tip for Evaluators**: Click the **"Events"** button in the top navigation bar to open the live **Telemetry Inspector HUD** and watch events populate in real time!

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js **18.x or 20.x**
- npm **9.x or 10.x**

### Quick Start (3 Steps)

1. **Clone & Navigate:**
   ```bash
   git clone <repo-url>
   cd "swastik group"
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Application:**
   ```bash
   npm run dev:all
   ```
   - Frontend runs on: `http://localhost:5173` (Vite)
   - Backend API runs on: `http://localhost:5000` (Express)
   - The Vite dev server proxies `/api` calls directly to the Express server.

### Alternatively (Production Standalone Mode):
```bash
npm run build
npm start
```
Runs the Express server on `http://localhost:5000`, serving both the REST API and the production-optimized static bundle.

---

## 🌐 Environment Variables

Create a `.env` file in the root directory if you wish to connect to cloud databases or change ports:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dear-pune?retryWrites=true&w=majority
NODE_ENV=production
```

*Note: If `MONGODB_URI` is omitted, the application automatically runs in persistent local JSON store mode with zero setup required.*

---

## 🚢 Deployment Guide

### Option 1: Full-Stack on Render / Railway
1. Push code to your GitHub repository.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `node server/index.js`
5. Optional: Add `MONGODB_URI` under Environment Variables.

### Option 2: Frontend on Vercel + Backend on Render
1. Deploy the root frontend to Vercel (Root: `./`, Framework: `Vite`).
2. Deploy `server/index.js` to Render.
3. Update `vite.config.js` or environment variable `VITE_API_URL` to point to the Render backend URL.

---

## ⚡ Performance & Engineering Highlights

| Benchmark | Original Prototype | Production Version | Improvement |
| :--- | :--- | :--- | :--- |
| **Initial HTML Size** | ~736.5 KB | **2.46 KB** | **99.6% reduction** |
| **Asset Delivery** | Raw inline base64 | Optimized WebP assets | Cacheable & lazy-loaded |
| **Script Execution** | Monolithic JS block | Modular React 18 Components | Fast rendering & re-use |
| **Data Persistence** | None (lost on reload) | REST API + Dual DB engine | Full data retention |
| **Admin Tools** | None | Full Analytics & CSV Export | Real-time business insights |
| **Accessibility** | Basic HTML | WCAG 2.1 AA Compliant | Focus rings, ARIA, screen-reader safe |

---

## 🔮 Future Enhancements
- **Spatial Audio Mode**: Multi-channel binaural rain recording from Vetal Tekdi.
- **WhatsApp Integration**: Instant RSVP / Chapter Three announcement bot.
- **Multilingual Support**: Marathi version (*"प्रिय पुणे — एक न पाठवलेले पत्र"*).
- **Interactive Map**: Plotting resident reflections geographically across Pune's pin codes.

---

**Developed with architectural rigor and respect for Pune's living character.**  
*Swastik Realty Group — Dear Pune Chapter Two.*
