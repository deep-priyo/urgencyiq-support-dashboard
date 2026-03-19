# UrgencyIQ Support Dashboard — Frontend

A modern React dashboard for managing AI-prioritized customer support tickets.  
This interface connects to the **UrgencyIQ Support API** and enables support teams to monitor, prioritize, and resolve customer issues efficiently.

The system automatically ranks incoming messages using **AI urgency detection**, helping agents focus on the most critical problems first.

---

## Overview

UrgencyIQ is an AI-powered support ticket intelligence platform designed to help organizations process high-volume customer inquiries more effectively.

This frontend dashboard provides:

• Real-time ticket monitoring  
• AI-driven urgency prioritization  
• Multi-agent ticket workflows  
• Customer insight panels  
• Rapid response tools for support teams

It integrates directly with the **UrgencyIQ Support API backend**, which performs urgency scoring using a hybrid **LLM + heuristic analysis system**.

---

## Key Features

### Ticket Management
- View all incoming support tickets
- Reply to customer messages
- Assign tickets to agents
- Resolve and close tickets
- Track conversation history

### AI-Powered Prioritization
- Tickets ranked automatically by urgency
- Color-coded urgency indicators
- Sort by urgency or time
- Critical issues automatically surfaced

### Real-Time Updates
- Automatic polling for new tickets
- Desktop notifications for incoming messages
- Live refresh status indicator
- Visual counter for unread messages

### LLM Assistant Control (New)
- Toggle the LLM assistant on/off directly from the dashboard header
- State auto-loads on page open and persists via the backend API
- No code changes required in the backend to switch modes

### Customer Insights
Detailed customer profile modal including:

- total interactions
- open vs resolved tickets
- urgency trends
- first and last contact timestamps
- overall engagement metrics

### Response Templates
Built-in **canned response library** for faster replies:

- searchable templates
- one-click insertion
- clipboard copy support
- customizable responses

### Search & Filtering
Agents can quickly find tickets using:

- full text search
- customer ID filtering
- urgency sorting
- status filters (Open / Resolved)

---

## Tech Stack

Frontend is built using modern web tooling:

- **React 18** — UI framework
- **Vite** — fast development build system
- **Tailwind CSS** — utility-first styling
- **Lucide React** — icon library
- **Fetch API** — backend communication

---

## Project Structure

```
src/
├── components/
│   ├── AgentNamePrompt.jsx
│   ├── TicketList.jsx
│   ├── TicketDetail.jsx
│   ├── MetadataPanel.jsx
│   ├── CannedMessages.jsx
│   └── CustomerInfoModal.jsx
├── pages/
│   └── Dashboard.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```

---

## Setup Instructions

### Prerequisites

- Node.js v16+
- npm or yarn
- UrgencyIQ backend API running locally

---

### Installation

Clone the repository

```bash
git clone <repository-url>
cd urgencyiq-support-dashboard
```

Install dependencies

```bash
npm install
```

Create environment configuration

```bash
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
```

Start the development server

```bash
npm run dev
```

The dashboard will open at:

```
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000
```

Vite requires all frontend environment variables to start with the `VITE_` prefix.

---

## Backend Integration

The dashboard communicates with the **UrgencyIQ Support API**.

Expected endpoints include:

| Endpoint | Method | Purpose |
|--------|--------|--------|
| `/api/messages` | GET | Retrieve support tickets |
| `/api/messages/:id/reply` | POST | Send agent reply |
| `/api/messages/:id/resolve` | POST | Resolve ticket |
| `/api/messages/:id/assign` | POST | Assign ticket |
| `/api/messages/:id/unassign` | POST | Remove assignment |
| `/api/customers/:id` | GET | Customer profile data |
| `/api/get/llm` | GET | Read current LLM usage flag (`{ use_llm: boolean }`) |
| `/api/set/llm` | POST | Update LLM usage flag with body `{ use_llm: boolean }` |

---

## Urgency Levels

Tickets are categorized based on backend urgency scores:

| Score | Level |
|------|------|
| 5 | Critical |
| 4 | High |
| 3 | Medium |
| 1-2 | Low |

Critical tickets appear at the top of the dashboard to ensure rapid response.

---

## Development

Available commands:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## LLM Assistant Toggle — How It Works

You can control whether the system leverages the LLM for enhanced assistance without touching any backend code:

1. Open the dashboard. In the top header, next to the Wi‑Fi Live/Pause button, there is an `LLM` pill with a brain icon.
2. The toggle automatically initializes to the current server setting by calling `GET /api/get/llm`.
3. Clicking the toggle updates the setting by calling `POST /api/set/llm` with `{ use_llm: true | false }`.
4. The button is temporarily disabled until the initial state is fetched to prevent accidental flips.

This workflow makes it easy to switch between LLM-assisted and non‑LLM modes at runtime—no redeploys or manual edits required.

---

## Future Enhancements

Possible improvements for the platform:

- WebSocket real-time updates
- file attachment support
- ticket tagging and categorization
- analytics dashboards
- AI suggested replies
- internal agent notes
- SLA tracking and alerts

---

## Project Goal

UrgencyIQ demonstrates how **AI can enhance traditional support systems** by automatically detecting urgency, prioritizing incoming tickets, and enabling teams to respond faster to critical issues.

This project serves as a **portfolio demonstration of full-stack AI system design**, combining a React dashboard with an intelligent backend API.

---

Built as part of the **UrgencyIQ AI Support Platform**  
