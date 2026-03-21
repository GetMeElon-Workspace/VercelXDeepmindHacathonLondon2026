# Hackathon Plan: Vercel x Deepmind Hackathon

> **Statement:** Statement Three — AI Applications
> **Demo Length:** 3 minutes (live)
> **Deadline:** ~16:30 UTC, 2026-03-21
> **Stack:** Next.js + Vercel AI SDK + Gemini 3.1 Pro + Supabase + React Flow

---

## Judging Criteria & How We Win

### What Judges Care About
1. **Innovation** — Is this a novel use of Gemini / Vercel AI SDK?
2. **Technical Execution** — Does it actually work? Is it well-built?
3. **UX / Visual Impact** — Does it look impressive in 3 minutes?
4. **Practical Value** — Could someone actually use this?

### Our Strengths Per Criterion
| Criterion | Our Edge |
|---|---|
| **Innovation** | Node-based visual modeling with AI — nobody does "Miro for Spreadsheets." `streamObject` for structured node generation is a sophisticated use of the AI SDK. |
| **Technical Execution** | Real Supabase persistence, real Gemini integration, Zod-validated structured output, branching logic. Not smoke and mirrors. |
| **UX / Visual** | React Flow with animated node spawning, Accept/Reject UX, dark theme, smooth transitions. Instantly demo-able. |
| **Practical Value** | QA feature with Full Model vs. Inputs Tab. Traceability via rationale + source links. Solves a real problem for industrial analysts. |

---

## What to Build vs. What to Skip

### 🟢 MUST BUILD (Demo-Critical)
These are non-negotiable for the 3-minute demo:

1. **React Flow canvas with pre-seeded Plant A model** (~5-8 nodes, styled, dark theme)
2. **Chat panel** — simple input box wired to Vercel AI SDK
3. **AI node generation** — `streamObject` → Gemini → spawn pending nodes on canvas
4. **Accept/Reject UI** — buttons on pending nodes, accept = merge + wire edge, reject = fade out
5. **Basic animations** — pending pulse, accept glow, reject fade, edge draw

### 🟡 SHOULD BUILD (Differentiators)
These separate us from other entries. Build if time allows:

6. **QA Inspect Mode** — side panel showing input vs. output data
7. **Inputs Tab view** — copy-pasteable table of just input assumptions
8. **Rationale display** — markdown rationale + source links on each node (expandable)

### 🔴 SKIP (Post-Hackathon)
Do not attempt these today:

- Supabase real-time subscriptions (use local state + write on Accept)
- Multi-branch management UI (just show one branch creation)
- Export to CSV/JSON
- User authentication
- Mobile responsiveness
- Multiple model types (just Plant A)

---

## Demo Narrative (3 Minutes)

### The Hook (0:00–0:20)
> "Financial analysts spend their lives in Excel. When they want to explore a new scenario — like building a plant in France instead of the US — they copy a spreadsheet, manually research local prices, and pray they didn't miss anything. We built something better."

**Screen:** App loads. Beautiful dark-themed React Flow canvas with Plant A model. Nodes are clean, connected, data-rich.

### The Magic (0:20–1:30)
> "Watch this. I'll ask Gemini to branch this model for France."

**Action:** Type "Branch this model for France" in the chat panel.

**Screen:** AI streams back proposals. New nodes appear one-by-one with a pulsing amber border. Each node shows French-specific data — EU electricity prices, local feedstock costs, adjusted heat efficiency.

> "Gemini analyzed the base model, identified the gaps, researched localized data, and proposed these values — with full rationale for each one."

### The Trust Layer (1:30–2:30)
> "But here's the thing — we don't blindly trust AI with financial models. Every proposal requires human approval."

**Action:** Click "Accept" on one node → it merges with a green glow, edge draws itself. Click "Reject" on another → it fades away.

> "And for teams that want to audit everything, we have QA mode."

**Action:** Open Inspect Mode → show input vs. output side-by-side. Switch to "Inputs Tab" → show the simplified, copy-pasteable view.

> "Low-trust users can grab just the inputs and verify them in their own spreadsheet. High-trust users get the full model."

### The Close (2:30–3:00)
> "Every value is traceable. Every decision is auditable. This is Miro for financial models — powered by Gemini 3.1 Pro."

**Screen:** Final beauty shot of the complete graph with accepted nodes wired in.

---

## Pre-Demo Checklist

- [ ] App deployed to Vercel (live URL working)
- [ ] Plant A model pre-seeded and rendering correctly
- [ ] "Branch for France" prompt tested end-to-end with Gemini
- [ ] Accept/Reject flow working smoothly
- [ ] QA mode functional (even if basic)
- [ ] Backup: pre-recorded video of the full demo flow
- [ ] Backup: seeded "completed France branch" in case AI is slow live
- [ ] Browser positioned, font size readable, dark theme on

---

## Key Gotchas to Watch

| Gotcha | Prevention |
|---|---|
| Gemini API latency during live demo | Pre-warm the API with a test call 1 min before demo. Have a pre-seeded fallback branch. |
| `streamObject` returns partial/malformed data | Zod validation is our safety net. Show graceful error UI if it fails. |
| React Flow layout breaks with new nodes | Pre-calculate positions for proposed nodes (offset from parent). Don't rely on auto-layout. |
| Supabase cold start | Skip real-time. Use local state. Write to Supabase silently on Accept. |
| Running out of time on features | Follow the priority tiers strictly. Ship the 🟢 MUST list first. |
