# Hackathon Brainstorming Notes & Pivot Points

- **Initial Idea:** A financial model that calibrates itself based on new datasets, specifically focusing on mass and heat balances for industrial plants where datasets have gaps.
- **Constraints Identified:** Must fit Vercel x Deepmind Hackathon "Statement Three: AI Applications". Must have a visually impressive 3-minute live demo.
- **Pivot 1 (UI Approach):** Chose a React Flow node-based visualizer ("Miro for Spreadsheets") over a GitHub-like tree view. It demos better and is instantly intuitive.
- **Pivot 2 (AI Guardrails):** The biggest risk is Gemini hallucinating impossible physics to fill gaps. User enforced a hard constraint: **"for any missing data, it has to be approved from the user."** This led to the "Accept/Reject" node design.
- **Pivot 3 (Architecture):** Selected a hybrid architecture combining Vercel AI SDK Generative UI (for the interactive chat and node spawning) with Supabase (to persist the base models and branching state).
- **Pivot 4 (QA / Trust Gradient):** Added a QA feature: anyone can inspect input data and output data. Output has two views — **Full Model** (entire node graph with all values) or **Inputs Tab** (simplified, copy-pasteable input assumptions only). This supports a trust gradient: high-trust users use the full model, low-trust users grab just the inputs and verify in their own spreadsheet.
- **Pivot 5 (Vertical-Agnostic + Traceability):** Broadened scope from chemical engineering to any industrial/financial vertical. Updated the AI system prompt to keep markdown rationale and source links (previously suppressed) so every AI-generated value is traceable for future reporting and audits.
