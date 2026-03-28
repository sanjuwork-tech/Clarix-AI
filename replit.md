# FinAI CA — Brand Website + AI Platform

## Project Overview
FinAI CA is a professional brand website and functional AI-powered platform built for Bhargavi (BCom/CA professional), targeting India's CA community. The platform showcases and delivers AI services for the CA journey: exam diagnostics, tax filing, audit assistance, and compliance tracking.

**Design aesthetic:** Navy/gold premium fintech with CA/AI themed doodles and framer-motion animations.

---

## Artifacts

### 1. CA AI Brand Website (`artifacts/ca-ai-brand`)
- React + Vite frontend
- Route `/` — Full brand site with sections: Hero, Problem, Services, Market Insights, How It Works, About, Testimonials, Survey CTA, Footer
- Route `/diagnostic` — Full CA Diagnostic Tool (multi-step form + AI SSE streaming report)
- Floating CA/AI SVG doodles sitewide (calculator, brain AI, chart, document, gear)

### 2. API Server (`artifacts/api-server`)
- Express server on port 8080
- Routes: `GET /api/healthz`, `POST /api/survey`, `POST /api/diagnostic/analyze` (SSE streaming), `GET /api/diagnostic/:id`
- Uses OpenAI via Replit AI Integration proxy (env vars auto-set)
- Connected to PostgreSQL database via Drizzle ORM

---

## Database Schema (PostgreSQL)

### `surveys` table
Stores user survey submissions from the CTA section.
- `id`, `name`, `age`, `gender`, `qualification`, `qualification_other`, `services` (text[]), `experience`, `ideas`, `created_at`

### `diagnostics` table  
Stores CA exam diagnostic submissions and AI-generated reports.
- `id`, `name`, `email`, `exam_level`, `attempt_number`, `subjects_json` (JSON string), `weak_areas` (text[]), `study_hours`, `report` (AI-generated markdown), `created_at`

---

## Key Libraries & Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Animations | Framer Motion |
| Forms | react-hook-form + Zod |
| Routing | Wouter |
| Backend | Express 5 + TypeScript |
| AI | OpenAI GPT (via Replit AI Integration proxy) |
| Database | PostgreSQL + Drizzle ORM |
| API Spec | OpenAPI 3.1 (Orval codegen) |

---

## AI Integration

The diagnostic tool uses Replit's built-in OpenAI integration:
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — auto-provisioned
- `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-provisioned
- Model: `gpt-5.2` with streaming enabled
- SSE endpoint: `POST /api/diagnostic/analyze`
- Response: Server-Sent Events with `data: {"content":"..."}` chunks and `data: {"done":true,"id":123}` on completion

---

## Important Files

```
artifacts/
  ca-ai-brand/src/
    App.tsx                    — Router (/ and /diagnostic routes)
    pages/
      home.tsx                 — Brand website homepage
      diagnostic.tsx           — CA Diagnostic Tool (multi-step, AI streaming)
    components/
      Navbar.tsx               — Nav with CA Diagnostic link
      Survey.tsx               — 3-step survey modal (saves to DB via POST /api/survey)
      CaDoodles.tsx            — SVG doodle components (CalculatorDoodle, BrainAIDoodle, etc.)
  api-server/src/
    routes/
      index.ts                 — Router assembly
      health.ts                — GET /healthz
      survey.ts                — POST /survey
      diagnostic.ts            — POST /diagnostic/analyze (SSE), GET /diagnostic/:id

lib/
  api-spec/openapi.yaml        — API spec (source of truth)
  api-zod/src/generated/       — Generated Zod schemas
  api-client-react/            — Generated React Query hooks
  db/src/schema/
    surveys.ts                 — surveys table schema
    diagnostics.ts             — diagnostics table schema
    index.ts                   — exports both
  integrations-openai-ai-server/ — OpenAI client for server use
```

---

## Brand Details

- **Brand name:** FinAI CA
- **Logo:** "F" in gold square
- **Color system:**
  - Primary: gold `rgb(212,175,55)` (`--primary`)
  - Secondary / Background: dark navy (`--secondary`, `--background`)
  - Text on dark: white/white-alpha
- **Founder:** Bhargavi — BCom + CA

---

## Development

```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start brand website
pnpm --filter @workspace/ca-ai-brand run dev

# Push DB schema changes
pnpm --filter @workspace/db run push

# Regenerate API types after openapi.yaml changes
pnpm --filter @workspace/api-spec run codegen
```
