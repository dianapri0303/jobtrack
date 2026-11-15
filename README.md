# JobTrack

[![CI](https://github.com/dianapri0303/jobtrack/actions/workflows/ci.yml/badge.svg)](https://github.com/dianapri0303/jobtrack/actions/workflows/ci.yml)

JobTrack is a small full-stack app that helps me run my job search. I log every application, and the app tells me **who I should follow up with today** and **how close I am to my goal of 30 applications per month**.

- **Live demo:** https://jobtrack-umber-two.vercel.app/applications
- **API health check:** https://jobtrack-api-0u4m.onrender.com/api/health

> The API runs on Render's free plan. After a period without requests the server goes to sleep, so the first request can take up to about a minute.

## Why I built it

I am looking for my first developer role and I send a lot of applications. I used to track them in a spreadsheet and kept forgetting to follow up with recruiters. I wanted a tool that turns a list of applications into clear daily actions, and a project small enough that I fully understand every part of it.

## What it does

**Input:** a job application — company, position, job link, status (`applied`, `interview`, `offer`, `rejected`), date applied and an optional follow-up date.

**Processing:** the API stores applications in MongoDB, calculates monthly statistics and decides which applications need a follow-up.

**Output:**

- **Follow up today** — the applications I should chase today. A "Followed up" button schedules the next reminder in 7 days.
- **Monthly progress** — how many applications I sent this month out of 30, with counts by status.
- **All applications** — a list with a status filter.

**Follow-up rules:** an application needs a follow-up if its follow-up date is today or in the past, or if it has no follow-up date, is still `applied` and was sent 7 or more days ago. Applications with `offer` or `rejected` never need a follow-up.

## Tech stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TanStack Query, Axios, Formik + Yup, CSS Modules
- **Backend:** Node.js, Express 5, MongoDB Atlas with Mongoose
- **Testing and CI:** Node.js built-in test runner, ESLint, GitHub Actions
- **Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## How it works

```
Browser ──► Next.js frontend (Vercel) ──► Express REST API (Render) ──► MongoDB Atlas
```

- The frontend calls the API through a small Axios client (`frontend/src/lib/api.ts`). TanStack Query handles loading and error states, caching and refreshing the data after changes.
- The backend is split into routes, controllers and a Mongoose model.
- The business rules live in pure functions in `backend/src/utils/summary.js` (`needsFollowUp`, `buildSummary`). They do not touch the database and take the current date as a parameter, so they are easy to test.
- The API returns clear JSON errors: `400` for invalid input or ids, `404` for missing applications, `500` for unexpected errors.

## Project structure

```
jobtrack/
├── .github/workflows/ci.yml   # GitHub Actions: tests, lint, build
├── backend/                   # Express API
│   └── src/
│       ├── controllers/       # request handlers
│       ├── db/                # MongoDB connection
│       ├── models/            # Mongoose schema
│       ├── routes/            # API routes
│       ├── utils/             # follow-up and statistics logic + unit tests
│       ├── index.js           # entry point
│       └── server.js          # Express app
├── frontend/                  # Next.js app
│   └── src/
│       ├── app/               # pages
│       ├── components/        # UI components
│       ├── lib/               # API client
│       └── types/             # TypeScript types
├── README.md
├── RESEARCH.md
└── AI.md
```

## Running locally

**Requirements:** Node.js 20 or newer (I used Node.js 24) and a MongoDB connection string (for example, a free MongoDB Atlas cluster).

```bash
git clone https://github.com/dianapri0303/jobtrack.git
cd jobtrack
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `MONGODB_URI` to your connection string, then:

```bash
npm run dev
```

The API runs on http://localhost:4000. Check http://localhost:4000/api/health — it should return `{"status":"ok"}`.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000/applications.

## API

Base URL: `http://localhost:4000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check that the server is running |
| GET | `/applications` | List all applications, newest first. Optional `?status=interview` filter |
| GET | `/applications/summary` | Monthly statistics and today's follow-up list |
| GET | `/applications/:id` | Get one application |
| POST | `/applications` | Create an application (`company` and `position` are required) |
| PATCH | `/applications/:id` | Update an application |
| DELETE | `/applications/:id` | Delete an application |

## Testing

- **Unit tests:** `cd backend && npm test` — tests for the follow-up rules and monthly statistics.
- **Lint:** `cd frontend && npm run lint`
- **CI:** every push and pull request to `main` runs the backend tests, the frontend lint and a production build of the frontend in GitHub Actions.
- **Manual testing:** I tested every API endpoint with `curl` and every screen in the browser, locally and on the deployed version. The details are in [RESEARCH.md](RESEARCH.md).

## Security

- Secrets are only in environment variables. `.env` and `.env.local` are ignored by git; `.env.example` files show which variables are needed.
- The project uses its own MongoDB user with read and write rights only.
- Input is validated in the browser (Yup) and on the server (Mongoose schema). The status filter is checked against the list of allowed values before it is used in a database query.

## What I would improve next

- **Authentication**, so each user only sees their own applications. Right now the demo has one shared list that anyone with the link can see and edit.
- **Restrict CORS** to the frontend domain instead of allowing all origins.
- **API tests** against a test database (for example, Supertest with an in-memory MongoDB) and tests for the React components.
- **Edit and delete in the UI.** The API already supports both.
- **User time zones** for "today", instead of the server time zone.
- **Email reminders** for follow-ups and **CSV export**.
- **Docker** for an easier local setup of the backend.

## Documentation

- [RESEARCH.md](RESEARCH.md) — what I had to learn, where I looked, what did not work and what I learned, day by day.
- [AI.md](AI.md) — which AI tools I used, for what, where they were wrong and how I checked their output.

## Author

Diana Prihozhyna — [GitHub](https://github.com/dianapri0303)