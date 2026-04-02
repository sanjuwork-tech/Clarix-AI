# Clarix.AI

**AI-Powered CA Final Exam Diagnostics**

> Know *exactly* why you're failing CA Final. Clarix.AI analyses your weaknesses at the question-type level — mapped to ICAI's own papers — and builds a precision study plan around them.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Forms | react-hook-form |
| Routing | Wouter |
| AI Engine | Mercury 2 (Inception Labs) via Vercel Edge Functions |
| Email | EmailJS (form data backup) |
| Deployment | Vercel |

## 📁 Project Structure

```
Clarix-AI/
├── api/
│   └── diagnostic/
│       └── analyze.ts     ← Vercel Edge Function (Mercury 2 AI)
├── public/
│   ├── favicon.svg        ← Clarix.AI logo
│   └── opengraph.jpg      ← OG image
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css           ← Design system
│   ├── pages/
│   │   ├── home.tsx              ← Brand landing page
│   │   ├── diagnostic.tsx        ← Multi-step diagnostic form + AI report
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ui/
│   ├── hooks/
│   └── lib/
├── index.html
├── vite.config.ts
├── vercel.json
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Local Development

```bash
npm install
npm run dev
```

> **Note:** The AI diagnostic requires the Mercury 2 API key. For local testing with the serverless function:
> 1. Copy `.env.example` to `.env`
> 2. Add your `INCEPTION_API_KEY`
> 3. Use `vercel dev` to run both frontend and serverless functions locally
>    ```bash
>    npm i -g vercel
>    vercel dev
>    ```

### Production Build

```bash
npm run build
npm run preview
```

## ☁️ Vercel Deployment

### 1. Import Repository
Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo

### 2. Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `INCEPTION_API_KEY` | `sk_...` | Mercury 2 API key from Inception Labs |

### 3. Deploy
Click Deploy — Vercel will auto-detect Vite, build the frontend, and deploy the Edge Function at `/api/diagnostic/analyze`.

## 🎨 Design System

- **Primary:** Amber `#D4930A`
- **Background:** Parchment `#FAF8F4`
- **Text:** Charcoal `#1C1917`
- **Fonts:** Space Grotesk (headings), IBM Plex Mono (labels), Lora (emphasis)

## 📧 Email Integration

Form submissions are sent to the owner via [EmailJS](https://www.emailjs.com/) as a backup record. The AI report is generated in real-time via Mercury 2 and displayed on-screen.

## 📄 License

MIT © Clarix.AI
