# Repository Constitution: Scrum Poker App

## 1. Tech Stack & Toolchain
Agents and developers must strictly adhere to the following stack:
- **Backend:** Go (Golang) with the Gin Gonic web framework.
- **Frontend:** Angular 
- **Database:** PostgreSQL
- **Real-Time Engine:** WebSockets (via `gorilla/websocket`)
- **Package Manager:** `go mod` for backend; `pnpm` ONLY for frontend.
- **Infrastructure:** Docker Compose and 'Dev Container' for local development. Docker containerization for the API, Frontend, and Database is reserved strictly for production environments.

## 2. Architectural Boundaries: Real-Time & State
- **Real-Time First:** All session state changes (user joined, user left, card selected, votes revealed) must be broadcasted via WebSockets immediately. Do not rely on client-side polling.
- **User Identity:** All sessions must be tied to an authenticated User ID. Anonymous joins are forbidden.
- **Concurrency & Ephemeral State:** Active voting state must be held in memory using Go concurrency-safe structures (e.g., `sync.RWMutex` maps) or a fast cache. Only persist the final consensus or story point results to PostgreSQL.
- **Blind Voting Security:** The backend must never broadcast the actual value of a user's selected card to other clients over the WebSocket until the Scrum Master triggers the "Reveal" event. Broadcast a generic `{"status": "voted"}` payload instead to prevent vote anchoring.

## 3. Coding Standards & Quality Gates
- **Go Idioms & Errors:** Explicit error handling is mandatory. Do not swallow errors using `_` unless explicitly documented why. All code must pass `gofmt` and `golangci-lint`.
- **Contracts:** REST API and WebSocket event payloads must map strictly to Go `structs` with explicit `json` struct tags. No arbitrary `map[string]interface{}` payloads.
- **Frontend State:** Angular components must remain stateless where possible. Use centralized state management (Signals or RxJS) to handle the WebSocket data stream. No `any` types in TypeScript.

## 4. Agent Behavior & SDD Workflow
- **No Vibe Coding:** Do not implement features without referencing `plan.md` and `tasks.md`.
- **Mandatory Authentication:** The system must implement Google SSO for user login before any session can be created.
- **Task Isolation:** Only modify files explicitly required for the current task. 
- **Testing & Mocking:** When generating tests for WebSocket handlers or database interactions, rely on Go `interfaces` to mock the client connections and data layers to ensure isolated unit testing.