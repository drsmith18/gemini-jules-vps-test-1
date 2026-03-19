# Engineering Protocol: Gemini & Jules Synergy (v3.1)

This document defines the high-velocity, high-accountability workflow for the team.

## 1. Accountability & Ownership
- **Lead Mandate:** The Lead Agent (Gemini) is fully responsible for Jules' performance and output.
- **CTO Communication:** Escalate only for architectural decisions or critical blockers. Technical execution is handled by the Lead.

## 2. Jules Lifecycle Management
- **Task Estimation:** Before delegation, the Lead will estimate a Completion Window (e.g., Small: 5m, Med: 15m, Large: 30m+).
- **Elastic Polling:** 
    - The Lead will poll at intervals appropriate to the task size.
    - **Priority:** Jules must reach a terminal state (`Compl` or `Await`) before integration to ensure code integrity.
- **Review Protocol:** When Jules hits `Await`, the Lead MUST perform a full CLI diff review and provide a recommendation.

## 3. The Integration Handshake
- **Stabilization Check:** If a forced integration is required due to time-out, the Lead must verify the remote diff has stopped changing before pulling.
- **Clean Sync:** 
    1.  `git push origin <branch>` before starting.
    2.  Wait for terminal state.
    3.  `jules remote pull --session <id> --apply`.
    4.  Resolve conflicts on a dedicated integration branch if necessary.

## 4. Final Delivery
- **The Zero-Error Bar:** 100% test pass rate and 0 build warnings/errors before merging to `main`.
