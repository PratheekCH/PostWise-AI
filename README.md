# PostWise-AI - AI Social Media Content Calendar Generator

An AI-powered Social Media Content Calendar Generator built with **Node.js, Express, MongoDB (Mongoose), and React + Vite**.

---

## Features

- **Brand Profiles**: Configure brand identity, industry, target audience, tone of voice, and posting goals.
- **AI Content Calendar Generation**: Automatically generates 30 days of platform-tailored social media posts (Instagram, LinkedIn, X).
- **Platform-Specific Content Rules**:
  - **Instagram**: Conversational tone, emojis, and clear Call-To-Action (CTA).
  - **LinkedIn**: Professional and value-focused.
  - **X**: Concise and punchy.
- **OpenAI API Integration + Mock Mode**: Uses OpenAI (`gpt-4o-mini`) for structured JSON generation. Automatically falls back to built-in smart mock mode if `OPENAI_API_KEY` is not provided.
- **Single-Post Regeneration**: Regenerate individual posts while preserving brand tone and platform context.
- **Post Rescheduling**: Drag-and-drop or date update endpoint.
- **Calendar Exports**: Instant JSON and CSV backend downloads for scheduling tools.

---

## Backend API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/me` - Get current user profile

### Brand Profile Management
- `POST /api/brands` - Create new brand profile
- `GET /api/brands` - List all user brand profiles
- `GET /api/brands/:id` - Get specific brand profile
- `PUT /api/brands/:id` - Update brand profile

### Calendar Management & AI Generation
- `POST /api/calendars/generate` - Generate 30-day post calendar (`{ "brandId": "...", "startDate": "2026-10-01" }`)
- `GET /api/calendars` - List user calendars
- `GET /api/calendars/:id` - Get calendar detail with posts
- `GET /api/calendars/:id/export/json` - Download calendar as JSON
- `GET /api/calendars/:id/export/csv` - Download calendar as CSV

### Post Operations
- `PUT /api/posts/:id` - Edit post content
- `POST /api/posts/:id/regenerate` - Regenerate single post content with AI
- `PATCH /api/posts/:id/reschedule` - Reschedule post date (`{ "date": "2026-10-15" }`)

### System Health
- `GET /api/health` - Check backend server & database status

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional: operates in memory fallback mode if local MongoDB is not running)

### Setup & Run Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *Server runs at `http://localhost:5000`*

### Setup & Run Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   *App runs at `http://localhost:3000`*