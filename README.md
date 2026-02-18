# Foxit Sentinel Pro 🛡️

> **The enterprise-grade, AI-powered agreement orchestrator — now live on Vercel.**

![Foxit Sentinel Pro](https://github.com/user-attachments/assets/b0b43d6c-2c92-48e3-abad-42c79c46edd7)

**[🚀 Live Demo →](https://foxitsentinelpro.vercel.app)**

Foxit Sentinel Pro automates the full lifecycle of high-value legal agreements. It combines intelligent autofill, real-time Foxit PDF processing (HTML→PDF, watermarking, linearization), and an immutable cryptographic audit ledger — all deployed as a serverless application on Vercel.

---

## 🌟 Features

### 1. Intelligent Autofill 🤖

Parses deal context and instantly injects entity details into complex legal templates. Type "Wayne Enterprises" and watch the entire NDA populate — parties, governing law, term, and signatures — in milliseconds.

### 2. Foxit PDF Services Integration 🔒

The core pipeline calls the **Foxit PDF Services API** to:

| Step              | Endpoint                                             | Result                                                  |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| **HTML → PDF**    | `/pdf-services/api/documents/create/pdf-from-html`   | Renders a pixel-perfect legal document                  |
| **Watermarking**  | `/pdf-services/api/pdf-watermark`                    | Stamps `CONFIDENTIAL [ID]` diagonally across every page |
| **Linearization** | `/pdf-services/api/documents/optimize/pdf-linearize` | Optimizes for instant byte-range streaming              |

### 3. Immutable Audit Ledger 📜

Every action — template selection, generation, watermarking, linearization — is cryptographically hashed (SHA-256) and logged in a side-by-side Ledger view. Stakeholders can verify document integrity at any point in time.

### 4. Director Mode 🎬

A self-driving demo mode that runs the entire agreement workflow automatically — filling the form, generating the PDF, applying security overlays, and scrolling to the audit ledger — all recorded as a `.webm` file.

---

## 🛠️ Architecture

```
Browser (React + Vite)
        │
        ▼
Vercel Edge Network
        │
        ├── /api/health     → Serverless health check
        ├── /api/generate   → HTML → PDF via Foxit API
        └── /api/process    → Watermark + Linearize via Foxit API
                │
                ▼
        api/_lib/
          ├── foxitClient.js   (Foxit API client)
          └── templates.js     (NDA, MSA, Offer Letter HTML templates)
```

**Key architectural decision:** All backend logic lives inside `api/_lib/` as plain ES Module JavaScript. This ensures Vercel bundles the dependencies correctly within the serverless function boundary — no TypeScript compilation step required at deploy time.

---

## 💻 Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| **Frontend**   | React 19, Framer Motion, Tailwind CSS              |
| **Backend**    | Node.js, Express (serverless via Vercel Functions) |
| **PDF Engine** | Foxit PDF Services API                             |
| **Build Tool** | Vite                                               |
| **Deployment** | Vercel (Serverless Functions + CDN)                |
| **Icons**      | Lucide React                                       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Foxit Developer Account ([Get credentials →](https://developers.foxit.com))

### Local Development

```bash
# 1. Clone
git clone https://github.com/QuisTech/Foxit-Sentinel-Pro.git
cd Foxit-Sentinel-Pro

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your Foxit credentials:
# FOXIT_CLIENT_ID=your_client_id
# FOXIT_CLIENT_SECRET=your_client_secret
# FOXIT_BASE_URL=https://na1.fusion.foxit.com

# 4. Run (frontend + backend)
npm run dev
```

Frontend runs on `http://localhost:5173`, API on `http://localhost:3001`.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the following environment variables in your Vercel project dashboard:

- `FOXIT_CLIENT_ID`
- `FOXIT_CLIENT_SECRET`
- `FOXIT_BASE_URL`

---

## 📸 Screenshots

|                                           Dashboard                                           |  Audit Ledger  | Mobile Verify |
| :-------------------------------------------------------------------------------------------: | :------------: | :-----------: |
| ![Dashboard](https://github.com/user-attachments/assets/b0b43d6c-2c92-48e3-abad-42c79c46edd7) | _(Ledger Tab)_ | _(QR Verify)_ |

---

## 🔮 Roadmap

- **Public Blockchain Ledger** — Move audit hashes to Polygon/Solana for decentralized proof-of-existence
- **Foxit eSign Integration** — Direct pipeline from linearized PDF into eSign workflows
- **Mobile Verification App** — QR-code scanner for physical document validation
- **Multi-party Signing** — Real-time co-signing with live status tracking

---

## 📄 License

MIT License. Built for the **Foxit Developer Challenge 2026**.
