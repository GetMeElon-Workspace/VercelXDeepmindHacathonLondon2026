<p align="center">
  <img src="https://img.shields.io/badge/Vercel_x_DeepMind-Hackathon_2026-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Hackathon Badge" />
  <img src="https://img.shields.io/badge/Gemini_3.1_Pro-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini Badge" />
  <img src="https://img.shields.io/badge/Next.js_14-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge" />
</p>

<h1 align="center">
  🔬 Gemini Modeling Agent
</h1>

<h3 align="center">
  <em>Miro for Financial Models — powered by Gemini 3.1 Pro</em>
</h3>

<p align="center">
  An interactive, node-based visual canvas that turns messy spreadsheet models into<br/>
  explorable, branchable, AI-augmented graphs — with full human-in-the-loop approval.
</p>

---

## ✨ The Problem

Financial modeling for industrial plants (chemicals, energy, manufacturing) relies on **messy spreadsheets with cascading data gaps**. When an analyst branches a model to a new scenario — say, _"build this plant in France instead of the US"_ — missing values break everything. There's no good way to:

- 📊 **Visualize** the flow of data through a model
- 🌿 **Branch** a scenario without copy-pasting entire spreadsheets
- 🤖 **Fill gaps** intelligently with AI
- 🔍 **Audit** every AI-generated value back to its source

## 💡 The Solution

An **Unreal Engine Blueprints-style** interactive canvas where:

1. A base industrial model is displayed as a connected **node graph**
2. Users chat with **Gemini 3.1 Pro** to branch scenarios (_"Branch for France"_)
3. AI proposes missing data as **new nodes** with rationale + source links
4. Users **Accept ✓** or **Reject ✗** each proposal before it merges
5. **QA Inspect Mode** lets any stakeholder audit inputs vs. outputs

> _"Every value is traceable. Every decision is auditable."_

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
│                                                  │
│  ┌──────────────┐    ┌────────────────────────┐  │
│  │  Chat Panel   │    │   React Flow Canvas    │  │
│  │  (Vercel AI)  │───▶│   (Nodes + Edges)      │  │
│  │               │    │   [Accept] [Reject]    │  │
│  └──────┬───────┘    └──────────┬─────────────┘  │
│         │                       │                │
│         ▼                       ▼                │
│  ┌──────────────────────────────────────────┐    │
│  │         Server Actions / API Routes       │    │
│  │    streamObject → NodeProposalSchema      │    │
│  └──────────────────┬───────────────────────┘    │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │       Supabase        │
          │  ┌─────┐ ┌─────────┐ │
          │  │Nodes│ │Branches │ │
          │  │Edges│ │Realtime │ │
          │  └─────┘ └─────────┘ │
          └───────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Server actions, streaming, deployment |
| **AI** | Vercel AI SDK + Gemini 3.1 Pro | `streamObject` for structured node proposals |
| **Visualization** | React Flow | Interactive node-based canvas |
| **State** | Zustand | Lightweight global state for nodes/edges |
| **Validation** | Zod | Schema validation for AI-generated proposals |
| **Database** | Supabase (Postgres + Realtime) | Model persistence and branching |
| **Styling** | Tailwind CSS + Custom CSS | Dark theme, glassmorphism, micro-animations |
| **Deployment** | Vercel | Edge-optimized hosting |

---

## 🧠 AI Integration

### How It Works

The AI pipeline uses Vercel AI SDK's `streamObject` to get **structured, Zod-validated JSON** from Gemini — not raw text.

```typescript
// Zod schema enforces structure on every AI response
const NodeProposalSchema = z.object({
  proposals: z.array(z.object({
    id: z.string(),
    title: z.string(),                              // e.g. "Heat Balance (FR)"
    type: z.enum(['calc', 'physics', 'financial']),
    data: z.array(z.object({
      label: z.string(),                             // e.g. "Efficiency"
      value: z.string(),                             // e.g. "85%"
    })),
    rationale: z.string(),                           // Markdown explanation
    sourceLinks: z.array(z.string()).optional(),     // URLs for auditability
  })),
});
```

### AI Flow

```
User prompt ──▶ Server Action ──▶ Gemini 3.1 Pro (streamObject)
                                         │
                                         ▼
                              Zod-validated proposals
                                         │
                                         ▼
                              Zustand store ──▶ React Flow canvas
                                                     │
                                              ┌──────┴──────┐
                                              ▼             ▼
                                          [Accept]      [Reject]
                                           merge         fade
                                          to graph       away
```

---

## 🔍 QA & Trust Gradient

A core innovation — the **trust gradient** ensures adoption across skeptical organizations:

| View | Who Uses It | What It Shows |
|------|------------|---------------|
| **Full Model** | High-trust users (analysts, engineers) | Entire node graph with all calculated, proposed, and accepted values |
| **Inputs Tab** | Low-trust users (managers, auditors) | Copy-pasteable table of just the input assumptions — take it and verify in your own spreadsheet |

Every AI-generated value includes:
- ✅ **Rationale** — markdown explanation of methodology
- 🔗 **Source links** — URLs backing each proposed value
- 📊 **Status tracking** — `pending` → `active` / `rejected`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Gemini streamObject endpoint
│   ├── layout.tsx                # Root layout (Inter font, dark theme)
│   └── page.tsx                  # Main page: 70% canvas + 30% chat
├── components/
│   ├── BaseNode.tsx              # Base model node (active data)
│   ├── ProposalNode.tsx          # AI-proposed node (Accept/Reject UI)
│   ├── Canvas.tsx                # React Flow canvas with controls
│   ├── ChatPanel.tsx             # Chat interface (Vercel AI SDK)
│   └── InspectPanel.tsx          # QA panel (Full Model + Inputs Tab)
├── lib/
│   ├── schema.ts                 # Zod schema for AI proposals
│   ├── seed-data.ts              # Pre-seeded Plant A model
│   ├── store.ts                  # Zustand global state
│   └── supabase.ts               # Supabase client
└── styles/
    └── globals.css               # Dark theme, animations, glassmorphism
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini 3.1 Pro)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/gemini-modeling-agent.git
cd gemini-modeling-agent

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Add your API key:
# GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the Plant A model on a dark canvas.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Your Gemini 3.1 Pro API key from Google AI Studio |

---

## 🎯 Key Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Node graph over spreadsheet** | Demos better in 3 minutes; instantly intuitive visual metaphor |
| 2 | **All AI data requires user approval** | Prevents hallucinated physics from corrupting financial models |
| 3 | **`streamObject` over `streamText`** | Structured, Zod-validated output — not raw text to parse |
| 4 | **Two QA views (Full Model + Inputs Tab)** | Trust gradient: skeptics can verify independently |
| 5 | **Vertical-agnostic architecture** | Swap the system prompt and seed data for energy, manufacturing, derivatives, etc. |

---

## 🔮 Roadmap

- [ ] **Multi-user collaboration** — real-time Supabase sync for team editing
- [ ] **Version history** — branch comparison and rollback across scenarios  
- [ ] **Export** — to Excel, PDF reports, and CSV
- [ ] **E2E test suite** — Playwright tests for the AI streaming pipeline
- [ ] **Mobile layout** — responsive design with bottom sheet navigation

---

## 🏆 Built For

**Vercel x DeepMind Hackathon 2026** — Statement Three: AI Applications

> _"Turn Excel into an interactive, node-based visual canvas powered by Gemini 3.1 Pro. Instead of just chatting with data, the user chats with an agent that dynamically generates and wires up new nodes with proposed missing data — which the user can formally Accept or Reject to merge into the main model."_

---

<p align="center">
  <sub>Built with 🧪 by <strong>Dan + Tara</strong> · Powered by Gemini 3.1 Pro · Deployed on Vercel</sub>
</p>