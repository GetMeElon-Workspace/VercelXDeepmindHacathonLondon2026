# Workload Plan: 3.5-Hour Sprint

> **Start:** ~13:10 UTC | **Deadline:** ~16:30 UTC
> **Total Time:** 3h 20m of build time
> **Strategy:** Parallelize with subagents (Antigravity, opencode, Gemini CLI)

---

## Timeline Overview

```
13:10 ──────── 14:00 ──────── 15:00 ──────── 16:00 ──── 16:30
  │               │               │               │        │
  ├─ WL1 (40m) ──┤               │               │        │
  │               ├─ WL2 (45m) ──┤               │        │
  │               ├─ WL3 (50m) ──┼──┤            │        │
  │               │               │  ├─ WL4 (35m)┤        │
  │               │               │  │            ├ WL5 (30m)
  │               │               │  │            ├ WL6 (30m)
  │               │               │  │            │        │
13:10            14:00           15:00           16:00    16:30
```

**Parallelization:** WL2 + WL3 can run in parallel (different subagents). WL5 + WL6 can overlap.

---

## WL1: Foundation & Scaffold
**⏱ Time:** 40 min (13:10 → 13:50)
**📊 Complexity:** 3/10
**🔧 Owner:** You (main terminal)
**🔗 Depends on:** Nothing
**🚫 Blocks:** Everything else

### Tasks
- [ ] `npx -y create-next-app@latest ./` — scaffold Next.js app with App Router + TypeScript
- [ ] Install dependencies:
  ```bash
  npm install ai @ai-sdk/google @supabase/supabase-js reactflow zustand zod uuid
  ```
- [ ] Set up project structure:
  ```
  src/
    app/
      page.tsx              # Main app page (canvas + chat)
      api/
        generate/route.ts   # Server route for Gemini streamObject
      layout.tsx
    components/
      Canvas.tsx            # React Flow wrapper
      ChatPanel.tsx         # Chat input + messages
      ProposalNode.tsx      # Custom node with Accept/Reject
      BaseNode.tsx          # Custom node for existing model data
      InspectPanel.tsx      # QA side panel
    lib/
      schema.ts             # Zod schema (NodeProposalSchema)
      supabase.ts           # Supabase client init
      store.ts              # Zustand store for node/edge state
      seed-data.ts          # Pre-seeded Plant A model
    styles/
      globals.css           # Global styles + dark theme
  ```
- [ ] Create `.env.local` with:
  ```
  GOOGLE_GENERATIVE_AI_API_KEY=<your-key>
  NEXT_PUBLIC_SUPABASE_URL=<url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
  ```
- [ ] Verify `npm run dev` starts cleanly

### Definition of Done
App scaffolded, all deps installed, project structure created, dev server running.

---

## WL2: React Flow Canvas + Seed Data
**⏱ Time:** 45 min (13:50 → 14:35)
**📊 Complexity:** 5/10
**🔧 Owner:** Subagent A (opencode / Antigravity)
**🔗 Depends on:** WL1
**🚫 Blocks:** WL4

### Tasks
- [ ] Create `seed-data.ts` — define Plant A base model:
  - 5-8 nodes: Feedstock Input → Reactor → Heat Exchanger → Product Output → Cost Summary
  - Edges connecting them in a logical flow
  - Each node has `{label, value}` data pairs (e.g., "Feed Rate: 1000 kg/hr")
- [ ] Build `BaseNode.tsx` — styled custom React Flow node:
  - Dark card with subtle border
  - Title bar with node type badge (calc / physics / financial)
  - Data rows showing label-value pairs
  - Subtle hover effect
- [ ] Build `Canvas.tsx` — React Flow wrapper:
  - Load seed data as initial nodes/edges
  - Custom node types registered (`base`, `proposal`)
  - Dark background with dot grid
  - Minimap + controls
- [ ] Wire into `page.tsx` — render canvas taking ~70% of screen width
- [ ] Style with dark theme (`globals.css`):
  - Background: `#0a0a0f` or similar deep dark
  - Node cards: glassmorphism with subtle borders
  - Accent colors: amber/gold for pending, green for accepted, muted red for rejected
  - Inter or similar modern font from Google Fonts

### Definition of Done
Opening the app shows a beautiful dark-themed canvas with Plant A model rendered as connected, styled nodes.

---

## WL3: AI Integration (Gemini + Vercel AI SDK)
**⏱ Time:** 50 min (13:50 → 14:40)
**📊 Complexity:** 7/10
**🔧 Owner:** Subagent B (Gemini CLI / you)
**🔗 Depends on:** WL1
**🚫 Blocks:** WL4

### Tasks
- [ ] Create `schema.ts`:
  ```typescript
  import { z } from 'zod';

  export const NodeProposalSchema = z.object({
    proposals: z.array(z.object({
      id: z.string(),
      title: z.string(),
      type: z.enum(['calc', 'physics', 'financial']),
      data: z.array(z.object({
        label: z.string(),
        value: z.string(),
      })),
      rationale: z.string(),
      sourceLinks: z.array(z.string()).optional(),
    }))
  });
  ```
- [ ] Create `api/generate/route.ts`:
  - Accept POST with `{ prompt, baseModelContext }`
  - Use `streamObject` from Vercel AI SDK with `google` provider + `gemini-3.1-pro`
  - Pass the system prompt (from full-plan.md) + user prompt + serialized base model
  - Stream back the `NodeProposalSchema` response
- [ ] Build `ChatPanel.tsx`:
  - Simple input box at bottom
  - Message bubbles for user + AI status
  - On submit: POST to `/api/generate` with the prompt
  - Show loading state while streaming
  - On receiving proposals: dispatch to Zustand store
- [ ] Create `store.ts` (Zustand):
  - `nodes: Node[]`, `edges: Edge[]`
  - `addProposalNodes(proposals)` — convert AI proposals to React Flow nodes with `status: pending`
  - `acceptNode(id)` — change status to `active`, create edge
  - `rejectNode(id)` — remove node from state
  - `getBaseModelContext()` — serialize current active nodes for AI prompt

### Definition of Done
Typing "Branch this model for France" in the chat triggers Gemini, streams structured proposals, and the proposals are available in the Zustand store.

---

## WL4: Accept/Reject UI + Graph Wiring
**⏱ Time:** 35 min (14:40 → 15:15)
**📊 Complexity:** 6/10
**🔧 Owner:** You / Subagent
**🔗 Depends on:** WL2 + WL3
**🚫 Blocks:** WL5

### Tasks
- [ ] Build `ProposalNode.tsx` — custom React Flow node for pending proposals:
  - Amber/gold pulsing border (CSS animation)
  - Title + type badge
  - Expandable data rows + rationale text (markdown rendered)
  - Source links as clickable pills
  - **[✓ Accept]** button (green) — calls `store.acceptNode(id)`
  - **[✗ Reject]** button (red/muted) — calls `store.rejectNode(id)`
- [ ] Wire accept logic:
  - On accept: border transitions from amber → green, edge draws to logical parent node
  - Position accepted node in the graph (auto-offset from parent)
  - Optionally write to Supabase (if time; otherwise skip — local state is fine)
- [ ] Wire reject logic:
  - On reject: node fades out (opacity transition), then removed from state
- [ ] Animate edge creation:
  - Use React Flow's `animated` edge prop for a flowing animation on new edges
- [ ] Integration test:
  - Full flow: type prompt → proposals appear → accept one → reject one → graph is correct

### Definition of Done
End-to-end flow works: chat → AI proposals appear as pulsing nodes → Accept merges with animation → Reject fades out.

---

## WL5: QA Feature (Inspect Mode + Inputs Tab)
**⏱ Time:** 30 min (15:15 → 15:45)
**📊 Complexity:** 4/10
**🔧 Owner:** Subagent
**🔗 Depends on:** WL4
**🚫 Blocks:** Nothing (nice-to-have layer)

### Tasks
- [ ] Build `InspectPanel.tsx` — slide-in side panel:
  - Triggered by "Inspect" button on toolbar or on individual nodes
  - **Input section:** shows all base model values that were sent to the AI
  - **Output section:** shows the AI-proposed values (accepted + pending)
  - Side-by-side layout with clear visual diff (base value → proposed value)
- [ ] Build **Inputs Tab** toggle:
  - A tab/toggle at the top of the inspect panel: `Full Model | Inputs Tab`
  - **Full Model:** shows the entire graph data including rationale + source links
  - **Inputs Tab:** shows a clean, minimal table of input assumptions only
    - Columns: Parameter | Base Value | Proposed Value | Status
    - Copy-pasteable (select all + copy works cleanly)
- [ ] Style the panel:
  - Slide from right, darkened backdrop on canvas
  - Clean table styling, monospace values for numbers
  - "Copy All" button for Inputs Tab

### Definition of Done
Clicking Inspect opens a panel showing inputs vs. outputs. Switching to Inputs Tab shows a clean, copy-pasteable table.

---

## WL6: Polish, Deploy & Demo Prep
**⏱ Time:** 30 min (15:45 → 16:15, buffer to 16:30)
**📊 Complexity:** 4/10
**🔧 Owner:** You
**🔗 Depends on:** WL4 (minimum) or WL5 (ideal)
**🚫 Blocks:** Nothing

### Tasks
- [ ] **Visual polish:**
  - Verify dark theme looks great on projector/screen share
  - Ensure fonts are loaded (Inter from Google Fonts)
  - Check node card sizes are readable
  - Smooth all transitions (300ms ease for node state changes)
  - Add a subtle gradient or glow behind the canvas
- [ ] **Deploy to Vercel:**
  ```bash
  npx vercel --prod
  ```
  - Verify live URL works end-to-end
  - Test the demo flow on the live deployment
- [ ] **Seed the safety net:**
  - Create a pre-completed "France branch" in local state / Supabase
  - If AI is slow or fails during live demo, can switch to this branch instantly
- [ ] **Record backup video:**
  - Screen-record the full 3-minute demo flow
  - Save as backup in case of live demo failure
- [ ] **Demo prep:**
  - Write down the talk track (see hackathon-sprint-plan.md demo narrative)
  - Set up browser: dark mode, no bookmarks bar, font size 16px+
  - Pre-warm the Gemini API with a test call
  - Close all other apps

### Definition of Done
App deployed. Demo rehearsed. Backup video recorded. Ready to present.

---

## Subagent Assignment Summary

| Workload | Who | Tool | Parallelizable? |
|---|---|---|---|
| WL1: Foundation | You (main) | Terminal | No — must go first |
| WL2: Canvas + Seed | Subagent A | Antigravity / opencode | ✅ Parallel with WL3 |
| WL3: AI Integration | Subagent B | Gemini CLI / you | ✅ Parallel with WL2 |
| WL4: Accept/Reject | You / Subagent | Either | Sequential after WL2+3 |
| WL5: QA Feature | Subagent | Antigravity | ✅ Parallel with WL6 |
| WL6: Polish + Deploy | You | Terminal + Vercel | ✅ Parallel with WL5 |

---

## Cut Line

If running behind schedule, cut in this order (bottom = cut first):

1. 🔴 **CUT:** Export to CSV/JSON from QA panel
2. 🔴 **CUT:** Source links display on nodes (keep rationale, skip links)
3. 🟡 **CUT:** Inputs Tab in QA (ship Full Model view only)
4. 🟡 **CUT:** QA Inspect Mode entirely (focus on Accept/Reject flow)
5. 🟢 **NEVER CUT:** Accept/Reject flow — this IS the demo
6. 🟢 **NEVER CUT:** AI node generation — this IS the product
7. 🟢 **NEVER CUT:** Beautiful canvas with base model — this is the first impression
