# TODOS

## Planned Work

### [P1] Add Playwright E2E Suite for AI Streaming
* **What:** Add a Playwright E2E suite to mock the Gemini API and verify the canvas renders partial state without crashing.
* **Why:** We are skipping tests to focus on the 3.5h hackathon demo, but a reliable test suite is critical before launching this tool to actual financial analysts.
* **Pros:** Prevents regressions in the fragile `streamObject` → Zustand → React Flow pipeline.
* **Cons:** Time investment to mock streams correctly.
* **Context:** We opted to rely on a manual QA safety net for the hackathon. This TODO ensures we don't forget to stabilize the product later.
* **Depends on:** Completing the hackathon demo.

### [P2] Mobile Responsive Layout
* **What:** Add a responsive mobile layout where the sidebar collapses into a bottom sheet, and the React Flow canvas supports touch panning.
* **Why:** We skipped responsive design to focus entirely on the desktop presentation for the sprint. If this tool gains traction, users might want to view models on iPads or phones.
* **Pros:** Expands usability to executives checking models on the go.
* **Cons:** React Flow on small touch screens can be complex to interact with.
* **Context:** Designed as a desktop-first visualization tool.
* **Depends on:** Completing the hackathon demo.