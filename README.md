# Branch Support Dashboard - Frontend

A real-time customer support platform built with React and Tailwind CSS, designed to handle high-volume customer inquiries with intelligent prioritization and seamless multi-agent workflows.

## Overview

This frontend application is part of Branch's CS Messaging Web App assignment. It provides support agents with a comprehensive dashboard to view, filter, and respond to customer messages efficiently. The design and color scheme are directly inspired by Branch's production website to ensure brand consistency and familiarity.

**Color Palette** (from Branch's brand):
- Primary Blue: `#4FCDFF`
- Secondary Blue: `#3bb8e6`
- Dark Text: `#333333`
- Gray: `#6c757d`

## Features

### Message Management
- View all customer messages with conversation history
- Reply to customer inquiries as logged-in agent
- Resolve tickets to close conversations
- Assign/unassign tickets to specific agents

### Intelligent Prioritization
- Automatic urgency scoring (Critical/High/Medium/Low)
- Color-coded urgency indicators throughout UI
- Sort by urgency or timestamp
- Critical issues (loan approvals, disbursements) automatically flagged

### Real-Time Updates
- Auto-polling every 10 seconds for new messages
- Desktop browser notifications for incoming messages
- Live status indicator with pause/resume control
- Visual counter for new unread messages

### Customer Intelligence
- Comprehensive customer profile modal showing:
    - Total, open, and resolved message counts
    - Average urgency score with trend analysis
    - Interaction timeline (first/last contact)
    - Resolution rate calculation
- Accessible from any ticket view

### Canned Messages
- 8 pre-built response templates for common scenarios
- Searchable template library
- One-click insertion into reply box
- Copy-to-clipboard functionality

### Search & Filtering
- Real-time search across message content and customer IDs
- Filter by status: All, Open, Resolved
- Sort by urgency or time
- Instant client-side results

### Responsive Design
- Full mobile, tablet, and desktop support
- Collapsible sidebars on mobile
- Touch-optimized controls
- Adaptive 3-panel layout on desktop

## Tech Stack

- **React 18.x** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Fetch API** - HTTP requests

## Project Structure

```
src/
├── components/
│   ├── AgentNamePrompt.jsx       # Initial agent login screen
│   ├── TicketList.jsx            # Sidebar with ticket list and search
│   ├── TicketDetail.jsx          # Main ticket view with replies
│   ├── MetadataPanel.jsx         # Right sidebar with ticket info
│   ├── CannedMessages.jsx        # Template selection modal
│   └── CustomerInfoModal.jsx     # Customer profile overlay
├── pages/
│   └── Dashboard.jsx             # Main dashboard container
├── services/
│   └── api.js                    # Centralized API layer
├── App.jsx                       # Root component with routing
└── main.jsx                      # Entry point
```

## Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Backend API running (default: `http://localhost:5000`)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd support-dashboard-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment configuration
```bash
# Create .env file in root directory
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
```

4. Start development server
```bash
npm run dev
```

Application will open at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Note**: Vite requires the `VITE_` prefix for client-side environment variables.

## Backend Integration

All API calls are handled through `src/services/api.js`. The application expects the following endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/messages` | GET | Fetch tickets (supports `?status=`, `?sort=`, `?search=`) |
| `/api/messages/:id/reply` | POST | Send agent reply (body: `{agent_name, reply}`) |
| `/api/messages/:id/resolve` | POST | Mark ticket as resolved |
| `/api/messages/:id/assign` | POST | Assign ticket (body: `{agent_name}`) |
| `/api/messages/:id/unassign` | POST | Remove assignment |
| `/api/customers/:id` | GET | Get customer profile data |

### Data Transformation

The API service transforms backend urgency numbers to labels:
- `5` → Critical
- `4` → High
- `3` → Medium
- `1-2` → Low

## Assignment Requirements Coverage

### ✅ Core Requirements Met

1. **Messaging Web Application**: Complete React-based dashboard with agent interface
2. **Multi-Agent Support**: Session-based agent identification with assignment system
3. **CSV Data Storage**: Backend integration assumes messages from CSV are in database
4. **Urgency Detection**: Automatic prioritization with color-coded indicators
5. **Search Functionality**: Real-time search over messages and customer IDs
6. **Customer Information**: Dedicated modal with comprehensive profile data
7. **Canned Messages**: 8 pre-configured templates with search
8. **Real-Time Updates**: 10-second polling with browser notifications

## Key Implementation Details

### Agent Session Management
- Agent name captured on first visit via modal
- Stored in `sessionStorage` for persistence
- No complex authentication required
- Logout clears session and returns to login

### Real-Time Polling Strategy
- Configurable 10-second interval
- Tracks `lastUpdate` timestamp to detect new messages
- Shows visual "refreshing" indicator during polls
- Desktop notifications with browser permission
- Pausable for focused work

### Urgency-Based Sorting
- Backend provides 1-5 numeric urgency score
- Frontend maps to semantic labels with colors
- Default sort puts Critical/High tickets at top
- Visual hierarchy: Red → Orange → Yellow → Green

### Responsive Behavior
- Desktop: 3-column layout (list | detail | metadata)
- Tablet: 2-column with collapsible metadata
- Mobile: Single-column with slide-out panels
- Touch-optimized buttons and tap targets

## Design Decisions

### Brand Consistency
The UI design, color scheme, and visual language are directly inspired by Branch's production website (branch.co) to ensure:
- Familiar experience for Branch team members
- Consistent brand identity
- Professional polish matching production standards
- Color psychology aligned with Branch's fintech positioning

### Component Architecture
- Separation of concerns: Each component has single responsibility
- Props-based communication between components
- Centralized state management in Dashboard.jsx
- Reusable UI patterns across components

### Performance Optimizations
- Client-side filtering for instant results
- Conditional rendering to minimize DOM updates
- Lazy loading for modals (rendered only when open)
- Efficient re-renders with proper dependency arrays

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires JavaScript and LocalStorage/SessionStorage enabled.

## Development

### Available Scripts

```bash
npm run dev          # Start dev server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Features

1. **New API Endpoint**: Add method to `src/services/api.js`
2. **New Component**: Create in `src/components/` with clear props interface
3. **New Page**: Add to `src/pages/` and update routing in App.jsx
4. **Styling**: Use Tailwind utilities, avoid custom CSS

## Known Constraints

- No authentication system (agent name only)
- Polling-based updates (not WebSockets)
- Text messages only (no attachments)
- No offline support
- Single-language (English)

## Future Enhancements

If extended beyond assignment scope:
- WebSocket integration for true real-time updates
- File attachment support
- Advanced search with filters and date ranges
- Agent performance analytics
- Ticket categorization/tagging
- Bulk operations
- Internal agent notes

---

**Developed for Branch's Software Engineer Intern Assignment**  
**December 2025**