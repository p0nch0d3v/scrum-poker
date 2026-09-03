# Product Specification: Scrum Poker App

## 1. Overview
A real-time, web-based planning poker application designed for Agile development teams to estimate story points synchronously. The application emphasizes low-latency updates, secure blind voting, and seamless user authentication via Google SSO.

## 2. Core Actors
- **Facilitator (Scrum Master):** An authenticated user who creates the session, manages the voting lifecycle (Reveal, Reset), and acts as the room host.
- **Participant:** An authenticated user who joins an active session, submits votes, and views the revealed results.
- **User:** The end-user who logs into the application using Google SSO to gain a unique `user_id`.

## 3. User Journeys & Acceptance Criteria

### Epic 1: User Identity & Authentication
- **User Sign-in:** Users must be able to log into the application using Google SSO. The system must validate the token and store a unique `user_id` and associated display name.
- **Auth Flow:** The backend must expose REST endpoints for initiating the OAuth flow and handling the callback exchange.
- **Authorization:** All actions (Join, Create, Vote) must be performed by an authenticated user.

### Epic 2: Session Management
- **Create Session:** An authenticated Facilitator (Scrum Master) creates a new poker room, setting the name and serie (Fibonacci or shirt), and receives a shareable link/ID.
- **Join Session:** An authenticated Participant joins an active room by providing a display name.
- **Active Roster:** All authenticated users in the room see a real-time list of connected participants. If a user disconnects, their name is removed or marked inactive.

### Epic 3: The Voting Lifecycle
- **Room Creation**
  - User creates a new room, setting the name, and the serie (fibonacci or shirt).
- **Voting Phase:** 
  - Participants see a standard Fibonacci deck (1, 2, 3, 5, 8, 13, 21, ?, ☕).
  - When a participant selects a card, all other clients see that their status has changed to "Voted" (UI shows a facedown card).
  - **Security Constraint:** The actual point value must remain mathematically hidden from the client state of all other users until the reveal phase.
- **Change Vote:** A participant can change their card selection as long as the session is still in the "Voting Phase".
- **Reveal Phase:** 
  - Only the Facilitator can trigger the "Reveal" action.
  - Upon reveal, all client UIs update simultaneously to show the selected cards.
  - The system automatically calculates and displays the average score.
- **Next Round:** The Facilitator can reset the board, clearing all current votes and returning the session to the "Voting Phase".

### Epic 4: Persistence
- **Consensus Saving:** After a reveal, the Facilitator can optionally save the agreed-upon story points for the current topic to the PostgreSQL database for basic session record-keeping.

## 4. Non-Goals (Strict Boundaries)
*Agents must not implement the following features. Do not add infrastructure or UI components to support these:*
- **NO Third-Party Integrations:** Do not generate webhooks or OAuth flows for Jira, Azure DevOps, or GitHub issues.
- **NO Custom Decks:** Stick strictly to the standard Agile Fibonacci sequence. Do not build UI for users to configure their own card values.
- **NO Historical Analytics:** We are not building a dashboard to track team velocity over time. Persistence is limited to the raw results of a single session.