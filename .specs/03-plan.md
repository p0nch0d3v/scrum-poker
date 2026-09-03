# Implementation Plan: Scrum Poker App

## 1. System Architecture
- **Backend:** Go REST API (Gin) for authentication and session initialization; `gorilla/websocket` for real-time room communication.
- **Frontend:** Angular (Standalone components) utilizing Angular Signals for reactive state management.
- **Persistence:** PostgreSQL for saving user data, session state, and final consensus results.
- **State Management:** In-memory thread-safe maps (`sync.RWMutex`) in Go for active room state, now tied to an authenticated User ID.

## 2. Database Schema (PostgreSQL)
*Table: `users`* -> *New addition for authentication*
- `id` (UUID, Primary Key)
- `google_id` (Varchar, Unique, Not Null)
- `email` (Varchar, Unique, Not Null)
- `display_name` (Varchar, Not Null)
- `created_at` (Timestamp)

*Table: `rooms`* (Renamed from `room` to be clearer in context)
- `id` (UUID, Primary Key)
- `name` (Varchar, not null)
- `serie_id` (Int, Foreign Key -> `serieline.Id`)
- `password` (Varchar, optional)

*Table: `serieline`* (Renamed from `serie` to be clearer in context)
- `id` (Int, Primary Key)
- `name` (Varchar, not null)
- `values_sequence` (Varchar, not null)
- `value` (Varchar, not null)
*Note: `serie_id` in `rooms` references `serieline.id`*

*Table: `user_sessions`* -> *New addition to map user to room*
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `users.id`)
- `room_id` (UUID, Foreign Key -> `rooms.id`)
- `is_facilitator` (Boolean)
- `joined_at` (Timestamp)

*Table: `sessions`*
- `id` (UUID, Primary Key)
- `persisted_at` (Timestamp)
- `created_by_user_id` (UUID, Foreign Key -> `users.id`)
- `room_id` (UUID, Foreign Key -> `rooms.id`)

*Table: `session_results`*
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key -> `sessions.id`)
- `topic_name` (Varchar, optional)
- `agreed_points` (Varchar - string to support "?" or "☕")
- `recorded_at` (Timestamp)

## 3. Backend Structure (Go)
The Go backend will follow standard project layout conventions.

*   `cmd/api/main.go`: Application entry point, Gin router setup, and DB connection pooling. This must now include middleware for JWT/session validation.
*   **`internal/auth/`**: New service directory to handle Google OAuth flow, JWT generation, and validation.
*   `internal/models/`: Go structs for database schemas and WebSocket JSON payloads.
*   `internal/handlers/`: Gin HTTP handlers (e.g., `Login`, `CreateSession`, `UpdateRoomState`).
*   `internal/ws/`: WebSocket logic.
    *   `ws/hub.go`: Manages active rooms and authenticated user connections. Must use `sync.RWMutex`.
    *   `ws/client.go`: Represents a single connected user and their WebSocket connection.
*   `internal/store/`: PostgreSQL interactions (CRUD for users, rooms, sessions) using standard `database/sql` or `pgx`.

## 4. Frontend Structure (Angular)
The Angular application will use Standalone Components and Signals.

*   **Routing:**
    *   `/` -> `LoginComponent` (Handle Google SSO initiation).
    *   `/dashboard` -> `RoomListComponent` (List of rooms).
    *   `/room/:id` -> `RoomComponent` (The main poker table, which now requires the user to be logged in).
*   **Components:**
    *   `AuthComponent`: Manages the Google login flow.
    *   `RoomComponent`: Manages the board, participant list, and Facilitator controls.
    *   `ParticipantListComponent`: Displays the authenticated user's profile and other participants' status.
*   **Services:**
    *   `AuthService`: Wraps the native browser Google APIs. Handles login/token storage.
    *   `WebSocketService`: Uses the authenticated `user_id` during connection. Handles reconnections.
    *   `PokerStateService`: Uses Angular Signals to hold the current room state.

## 5. WebSocket Event Contract (High-Level)
All WebSocket messages will follow a standard JSON envelope: `{"type": "string", "payload": object}`

*   **Client -> Server Events:**
    *   `JOIN_ROOM`: payload contains `userId` and `roomId`. (Anonymous join is deprecated).
    *   `SUBMIT_VOTE`: payload contains the `cardValue`.
    *   `REVEAL_VOTES`: (Facilitator only) triggers the reveal phase.
    *   `RESET_BOARD`: (Facilitator only) clears votes.
*   **Server -> Client Events:**
    *   `ROOM_STATE_UPDATED`: Sends the list of logged-in users.

## 6. Infrastructure
- Standard local development using `go run` and `ng serve`.
- A generic local PostgreSQL instance is assumed running on `:5432`.