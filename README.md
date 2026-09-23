# Mandarin Lab

[![CI](https://github.com/vnt1c/mandarin-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/vnt1c/mandarin-lab/actions/workflows/ci.yml)

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

## Project layout

```
shared/    types and zod schemas used by both sides
backend/   Express API (Gemini + Supabase)
frontend/  React app
```

`shared/schemas/sentence.schema.ts` is the single source of truth for the
sentence-analysis contract. The backend feeds it to Gemini as a response
schema and validates replies against it; the frontend's types in
`shared/types/` are derived from it with `z.infer`, so the two cannot drift.

Both workspaces use `@/` for their own source and `@shared` for the shared
package.

## Development and Running Locally

### Prerequisites

- Node.js (LTS recommended)
- pnpm 10+ (`corepack enable pnpm`)
- A Supabase account (for database and authentication)
- A Google Cloud project (for Google OAuth)
- A Gemini API key (for sentence analysis)

### 1. Clone the repository
```bash
git clone https://github.com/vnt1c/mandarin-lab.git
cd mandarin-lab
```

### 2. Install dependencies

This is a pnpm workspace, so install once from the repository root — it covers
`shared`, `backend`, and `frontend` together.

```bash
pnpm install
```

pnpm blocks a few dependencies' postinstall scripts. That is deliberate and
recorded in `pnpm.ignoredBuiltDependencies`: the build, the typecheck and both
dev servers were verified to work without them.

### 3. Environment variables

Backend (`/backend/.env`)
```env
NODE_ENV=development
PORT=3000

GEMINI_API_KEY=

SUPABASE_URL=
SUPABASE_ANON_KEY=

FRONTEND_ORIGIN=http://localhost:5173
```

Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 4. Supabase setup

* Create a Supabase project
* Enable Google OAuth in Supabase Auth
* Set the Site URL to `http://localhost:5173`
* Add a redirect URL that matches your frontend auth callback route

### 5. Run the application

From the repository root:

```bash
pnpm dev
```

That starts the backend and the frontend together, with each line of output
prefixed by the workspace it came from. To run just one, use `pnpm dev:backend`
or `pnpm dev:frontend`.

Open `http://localhost:5173` in your browser.

Other root scripts: `pnpm typecheck`, `pnpm lint` and `pnpm build`.

## Tests

```bash
pnpm test
```

Vitest, run per workspace. The suites concentrate on the places where a
mistake is expensive rather than chasing coverage:

- **`shared`** — the zod schema, which is the contract Gemini generates
  against, the API validates with, and the frontend derives its types from.
  Includes assertions on the emitted JSON Schema, since the prompt was trimmed
  on the promise that the field descriptions reach the model.
- **`backend`** — sentence validation (the gate in front of a paid API call),
  the Gemini adapter's handling of empty, non-JSON and schema-violating
  responses, the auth middleware, and the error middleware's production
  masking.
- **`frontend`** — the API client's error parsing and auth handling, plus a
  component test for the token chip.

CI runs typecheck, lint, tests and build on every push and pull request.

## Notes

* Sentence analysis will not work without a valid `GEMINI_API_KEY`.
* Saved sentences and authentication depend on correct Supabase configuration and policies.
* This project is intended for learning and portfolio use and is not yet production-hardened.
