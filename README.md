# Mandarin Lab

Mandarin Lab is a Chinese learning web app that creates smart, structured sentence breakdowns to help learners understand Chinese grammar, vocabulary, and real-world usage. The project is under active development, with more advanced learning tools planned.

## Features

### Current
- Sentence analysis
- Token-by-token sentence breakdown (role, pinyin, meaning, notes)
- Saved sentences for review

### Planned
- Dictionary
- AI tutor
- Spaced repetition flashcards (SRS)

## Demo

### Sentence Analysis
![Sentence Analysis](./frontend/src/assets/sentencebreakdown.png)

Break down sentences into structured, learner-focused components.

### Token Breakdown
![Sentence Breakdown](./frontend/src/assets/tokenbreakdown.png)

Inspect individual tokens to study grammar roles, pinyin, and usage.

## Roadmap

Planned features and improvements:
- Song lyrics database with grammar and vocabulary breakdowns
- Interactive grammar exercises
- Structured daily lessons
- Real-time voice conversation practice
- Typing practice (pinyin and characters)

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database & Auth: Supabase (PostgreSQL + Google OAuth)
- AI: Google Gemini

## Development and Running Locally

### Prerequisites

- Node.js (LTS recommended)
- npm
- A Supabase account (for database and authentication)
- A Google Cloud project (for Google OAuth)
- A Gemini API key (for sentence analysis)

### 1. Clone the repository
```bash
git clone https://github.com/vnt1c/mandarin-lab.git
cd mandarin-lab
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment variables

Backend (`/backend/.env`)
```env
NODE_ENV=development
PORT=4000

GEMINI_API_KEY=

SUPABASE_URL=
SUPABASE_ANON_KEY=

FRONTEND_ORIGIN=http://localhost:5173
```

Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:4000

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 4. Supabase setup

* Create a Supabase project
* Enable Google OAuth in Supabase Auth
* Set the Site URL to `http://localhost:5173`
* Add a redirect URL that matches your frontend auth callback route

### 5. Run the application

Start the backend server
```bash
cd backend
npm run dev
```

Start the frontend development server
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Notes

* Sentence analysis will not work without a valid `GEMINI_API_KEY`.
* Saved sentences and authentication depend on correct Supabase configuration and policies.
* This project is intended for learning and portfolio use and is not yet production-hardened.
