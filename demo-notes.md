# 🎤 Demo Notes — Quick Reference Card

> **Time Limit:** 3 minutes sharp
> **Keep this open on a second screen or print it out.**

---

## Talk Track

### HOOK — "The Problem" (20 sec)

> "Financial analysts live in Excel. When they want to explore a new scenario — like building a plant in France instead of the US — they copy a spreadsheet, manually research local commodity prices, and hope they didn't miss anything. We built something better."

☝️ **On screen:** App loaded. Dark canvas. Plant A model glowing with 7 connected nodes.

---

### MAGIC — "Watch This" (70 sec)

> "This is Plant A — a methanol production facility on the US Gulf Coast. Every node represents a real piece of the model: feedstock, reactor, heat balance, product output, financials."

> "Now watch. I'll ask Gemini to branch this model for France."

**👉 ACTION:** Type `Branch this model for France` → hit Enter

> *(While loading)* "Gemini is analyzing the base model, identifying data gaps specific to France — commodity prices, carbon regulations, energy costs — and proposing new values."

> *(Nodes appear)* "Look — it found the biggest deltas. Natural gas goes from $2.50 to $10.50 per MMBtu on the European TTF market. It added an EU carbon tax of €90 per tonne that doesn't exist in the US. And it recalculated the financial impact."

☝️ **On screen:** 2-3 new nodes pulsing amber. Data visible. Rationale underneath each one.

---

### TRUST — "Human in the Loop" (60 sec)

> "But we don't blindly trust AI with financial models. Every single proposal requires human approval."

**👉 ACTION:** Click **[✓ Accept]** on one node → watch it merge (green glow, edge draws)

> "Accepted. It's now part of the model."

**👉 ACTION:** Click **[✗ Reject]** on another node → watch it fade

> "Rejected. Gone. The analyst stays in control."

> "And for teams that need full auditability — we have QA mode."

**👉 ACTION:** Click **Inspect** → show input vs. output panel → toggle to **Inputs Tab**

> "Any stakeholder can inspect exactly what went in and what came out. And if they don't trust the full model yet, they can grab just the inputs tab — copy-paste it into their own spreadsheet and verify independently."

☝️ **On screen:** QA panel open. Clean table. Full Model vs Inputs Tab toggle visible.

---

### CLOSE — "The Takeaway" (10 sec)

> "Every value is traceable. Every decision is auditable. This is **Miro for financial models** — powered by Gemini 3 Flash Preview."

☝️ **On screen:** Full canvas. Accepted nodes wired in. Complete, beautiful graph.

---

## Emergency Fallback Plays

| Scenario | What to Do |
|---|---|
| **Gemini is slow / times out** | Say "While that processes..." → switch to pre-seeded France branch → "Here's what the completed branch looks like" |
| **Gemini returns bad data** | Acknowledge: "And this is why Accept/Reject exists — the analyst catches mistakes" → reject the bad node → show the pre-seeded version |
| **App crashes** | Switch to backup video recording immediately. Keep narrating. |
| **React Flow layout is ugly** | The Dagre auto-layout should snap nodes cleanly Top-to-Bottom. If not, drag nodes to better positions live. |
| **Someone asks a hard question** | "Great question — this is a hackathon prototype focused on the UX pattern. The underlying AI can be fine-tuned with domain-specific datasets for production." |

---

## Key Talking Points (If Judges Ask)

### "How is this different from ChatGPT?"
> "ChatGPT gives you text. We give you structured, validated data nodes that integrate into a visual model. Every value is Zod-validated, traceable, and requires human approval before it touches the model."

### "What about hallucination?"
> "That's exactly why we built the Accept/Reject pattern. The AI *proposes*, the human *decides*. Plus our QA mode lets any stakeholder audit the full chain — input data, AI rationale, source links."

### "Could this work for other industries?"
> "Absolutely. The architecture is vertical-agnostic. We demoed methanol, but the same pattern works for any model-driven industry — energy, manufacturing, even financial derivatives. Swap the system prompt and seed data."

### "What's your tech stack?"
> "Next.js on Vercel, Gemini 3 Flash Preview via Vercel AI SDK with `streamObject` for structured output, React Flow for the canvas, and Supabase for persistence and branching."

### "What would you build next?"
> "Three things: multi-user collaboration with real-time Supabase sync, version history across branches, and export to common financial formats like Excel and PDF reports."

---

## Pre-Demo Checklist

- [ ] App deployed and live URL tested
- [ ] Browser clean: dark mode, no bookmarks bar, font size 16px+
- [ ] Pre-warm Gemini API (send a test request 1 min before)
- [ ] Pre-seeded fallback "France branch" ready to switch to
- [ ] Backup video recorded and accessible
- [ ] This notes file open on second screen
- [ ] Water bottle nearby
- [ ] Timer set for 2:45 (15-sec warning)
