# 🚀 Hackathon Agent Workflow Guide

> **Time Remaining:** ~1h 49m (deadline ~16:30 UTC)
> **Stack:** Next.js App Router + Vercel AI SDK + Gemini 3 Flash Preview + React Flow + Zustand
> **Strategy:** Fix foundation → parallel agents → merge → polish → deploy

---

## 📁 Worktree Layout

```
/Users/dan/Public/Hackathon Deepmind/           ← HUB (Branch: main)
├── wl2-canvas/                                  ← Agent A (Branch: feat/wl2-canvas)
└── wl3-ai-stream/                               ← Agent B (Branch: feat/wl3-ai-stream)
```

All three folders share the same git repo. Changes committed in one branch stay isolated until you merge.

---

## 🚨 Status: WL1 Foundation Is Incomplete

The commit says "WL1 done" but these are **still missing**:

| Missing | Why It Matters |
|---|---|
| `next`, `react`, `react-dom` not in `package.json` | App cannot start |
| No `next.config.js` / `tsconfig.json` | Next.js won't compile |
| No `layout.tsx` / `page.tsx` in `src/app/` | No pages to render |
| All `.tsx` / `.ts` files are 0 bytes | Nothing is built yet |
| `.env` uses `GEMINI_API_KEY` | Vercel AI SDK expects `GOOGLE_GENERATIVE_AI_API_KEY` |
| `.env` is tracked by git | Secrets should be in `.env.local` (gitignored) |
| `src/styles/globals.css` is empty | No dark theme |

---

## ✅ Step-by-Step Execution

### Phase 0: Fix WL1 Foundation (~15 min) — In the HUB

> **Where:** `/Users/dan/Public/Hackathon Deepmind/`
> **Who:** You or your current agent (Antigravity)

1. **Install Next.js + React:**
   ```bash
   npm install next react react-dom @types/react @types/react-dom typescript
   ```

2. **Add scripts to `package.json`:**
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start"
   }
   ```

3. **Create `next.config.js`** and **`tsconfig.json`** (Next.js auto-generates tsconfig on first `npm run dev` if missing)

4. **Fix the API key — rename and move:**
   ```bash
   mv .env .env.local
   ```
   Then edit `.env.local`:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyDYhkkqduENJ1_wp49N4UY2eUMKjha-eco
   ```

5. **Create `src/app/layout.tsx`** — HTML shell with Inter font, dark body background

6. **Create `src/app/page.tsx`** — split layout (70% canvas left, 30% chat right)

7. **Create `src/styles/globals.css`** — dark theme variables, base resets

8. **Verify:** `npm run dev` → `http://localhost:3000` renders without errors

9. **Commit & push:**
   ```bash
   git add -A && git commit -m "fix: complete WL1 foundation (Next.js scaffold)"
   git push origin main
   ```

---

### Phase 1: Spawn Parallel Agents (~45 min)

After WL1 is committed, pull the foundation into both worktrees:

#### Agent A — Canvas Builder

```bash
cd "/Users/dan/Public/Hackathon Deepmind/wl2-canvas"
git merge main
```

**Prompt for Agent A:**
> Read `workload-plan.md` and complete all tasks under **WL2: React Flow Canvas + Seed Data**. You are in a git worktree on branch `feat/wl2-canvas`. Build:
> - `src/lib/seed-data.ts` — Plant A base model (5-8 nodes with edges)
> - `src/components/BaseNode.tsx` — dark styled custom React Flow node
> - `src/components/Canvas.tsx` — React Flow wrapper with seed data, dark dot grid, minimap
> - Wire canvas into `src/app/page.tsx` (left 70%)
> - Dark theme styles in `src/styles/globals.css`
>
> Do NOT touch AI routes, ChatPanel, or the Zustand store. When done, commit.

#### Agent B — AI Integration Builder

```bash
cd "/Users/dan/Public/Hackathon Deepmind/wl3-ai-stream"
git merge main
```

**Prompt for Agent B:**
> Read `workload-plan.md` and complete all tasks under **WL3: AI Integration**. You are in a git worktree on branch `feat/wl3-ai-stream`. Build:
> - `src/lib/schema.ts` — Zod `NodeProposalSchema`
> - `src/app/api/generate/route.ts` — POST route using `streamObject` with `@ai-sdk/google` + `gemini-3-flash-preview`
> - `src/lib/store.ts` — Zustand store (nodes, edges, addProposalNodes, acceptNode, rejectNode, getBaseModelContext)
> - `src/components/ChatPanel.tsx` — input box, sends prompt to `/api/generate`, dispatches proposals to store
>
> Do NOT build visual React Flow nodes or the Canvas. When done, commit.

---

### Phase 2: Merge + Build WL4 Accept/Reject (~30 min)

Back in the HUB:

```bash
cd "/Users/dan/Public/Hackathon Deepmind"
git merge feat/wl2-canvas
git merge feat/wl3-ai-stream
```

Resolve any minor conflicts (likely just `page.tsx` imports). Then build:

- **`ProposalNode.tsx`** — amber pulsing border, data rows, Accept/Reject buttons
- **Wire accept logic** — border amber → green, edge draws to parent
- **Wire reject logic** — node fades out, removed from state
- **Integration test** — type prompt → proposals appear → accept one → reject one

---

### Phase 3: Polish + Deploy (~30 min)

- Visual polish (transitions, animations, font sizes)
- Deploy: `npx vercel --prod`
- Seed a pre-completed "France branch" as demo fallback
- Record backup video of full demo flow
- Pre-warm the Gemini API before presenting

---

## ✂️ What to Cut (Given Time Pressure)

| Priority | Item | Decision |
|---|---|---|
| 🔴 | WL5: QA Inspect Mode | **CUT** — not demo-critical |
| 🔴 | Supabase persistence | **CUT** — use local Zustand state only |
| 🔴 | Source links on nodes | **CUT** |
| 🟢 | Canvas + seed data | **NEVER CUT** — first impression |
| 🟢 | AI node generation | **NEVER CUT** — this IS the product |
| 🟢 | Accept/Reject flow | **NEVER CUT** — this IS the demo |

---

## ⚡ Quick Reference

| Key | Value |
|---|---|
| Hub path | `/Users/dan/Public/Hackathon Deepmind/` |
| Agent A path | `/Users/dan/Public/Hackathon Deepmind/wl2-canvas/` |
| Agent B path | `/Users/dan/Public/Hackathon Deepmind/wl3-ai-stream/` |
| Dev server | `npm run dev` → `http://localhost:3000` |
| Deploy | `npx vercel --prod` |
| Env var name | `GOOGLE_GENERATIVE_AI_API_KEY` |
| AI model | `gemini-3-flash-preview` via `@ai-sdk/google` |
| React Flow pkg | `reactflow@^11.11.4` (v11 API) |
