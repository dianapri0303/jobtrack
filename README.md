# JobTrack

[![CI](https://github.com/dianapri0303/jobtrack/actions/workflows/ci.yml/badge.svg)](https://github.com/dianapri0303/jobtrack/actions/workflows/ci.yml)

JobTrack is a small full-stack app that helps me run my job search. I log every application, and the app tells me **who I should follow up with today** and **how close I am to my goal of 30 applications per month**. Each user has their own account and only sees their own applications.

- **Live demo:** https://jobtrack-umber-two.vercel.app — create an account with any email and a password of 8+ characters.
- **API health check:** https://jobtrack-api-0u4m.onrender.com/api/health

> The API runs on Render's free plan. After a period without requests the server goes to sleep, so the first request can take up to about a minute.

## Why I built it

I am looking for my first developer role and I send a lot of applications. I used to track them in a spreadsheet and kept forgetting to follow up with recruiters. I wanted a tool that turns a list of applications into clear daily actions, and a project small enough that I fully understand every part of it.

## What it does

**Input:** a job application — company, position, job link, status (`applied`, `interview`, `offer`, `rejected`), date applied and an optional follow-up date.

**Processing:** the API stores applications in MongoDB for the logged-in user, calculates monthly statistics and decides which applications need a follow-up.

**Output:**

- **Follow up today** — the applications I should chase today. A "Followed up" button schedules the next reminder in 7 days.
- **Monthly progress** — how many applications I sent this month out of 30, with counts by status.
- **All applications** — a list with a status filter.

**Follow-up rules:** an application needs a follow-up if its follow-up date is today or in the past, or if it has no follow-up date, is still `applied` and was sent 7 or more days ago. Applications with `offer` or `rejected` never need a follow-up.

## Tech stack

- **Frontend:** Next.js 15 (App Router), TypeScript, TanStack Query, Axios, Formik + Yup, CSS Modules
- **Backend:** Node.js, Express 5, MongoDB Atlas with Mongoose, bcrypt (password hashing), JSON Web Tokens
- **Testing and CI:** Node.js built-in test runner, ESLint, GitHub Actions
- **Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## How it works

```
Browser ──► Next.js frontend (Vercel) ──► Express REST API (Render) ──► MongoDB Atlas
```

- **Accounts:** passwords are hashed with bcrypt. After sign-up or login the API returns a JWT that is valid for 7 days. The frontend sends it in the `Authorization: Bearer <token>` header with every request.
- **Access control:** an `authenticate` middleware protects all `/api/applications` routes. Every database query includes the user id as `owner`, so a user cannot read, change or delete another user's applications, even with a valid id.
- **Frontend:** the API client (`frontend/src/lib/api.ts`) adds the token to each request. TanStack Query handles loading and error states, caching and refreshing the data after changes. The applications page redirects to the login page when there is no token.
- **Business rules:** pure functions in `backend/src/utils/summary.js` (`needsFollowUp`, `buildSummary`). They do not touch the database and take the current date as a parameter, so they are easy to test.
- **Errors:** clear JSON messages — `400` invalid input or id, `401` not logged in or wrong credentials, `404` not found, `409` email already registered, `500` unexpected error.

## Project structure

```
jobtrack/
├── .github/workflows/ci.yml   # GitHub Actions: tests, lint, build
├── backend/                   # Express API
│   └── src/
│       ├── controllers/       # auth and application handlers
│       ├── db/                # MongoDB connection
│       ├── middleware/        # JWT authentication
│       ├── models/            # User and Application schemas
│       ├── routes/            # API routes
│       ├── utils/             # follow-up and statistics logic + unit tests
│       ├── index.js           # entry point
│       └── server.js          # Express app
├── frontend/                  # Next.js app
│   └── src/
│       ├── app/               # pages: home, login, register, applications
│       ├── components/        # UI components
│       ├── lib/               # API client and session helpers
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

Open `.env` and set:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random string. You can generate one with:

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

Then start the API:

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

Open http://localhost:3000, create an account and start adding applications.

## API

Base URL: `http://localhost:4000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Check that the server is running |
| POST | `/auth/register` | — | Create an account (`email`, `password` of 8+ characters). Returns a token |
| POST | `/auth/login` | — | Log in. Returns a token |
| GET | `/applications` | Bearer token | List your applications, newest first. Optional `?status=interview` filter |
| GET | `/applications/summary` | Bearer token | Monthly statistics and today's follow-up list |
| GET | `/applications/:id` | Bearer token | Get one of your applications |
| POST | `/applications` | Bearer token | Create an application (`company` and `position` are required) |
| PATCH | `/applications/:id` | Bearer token | Update one of your applications |
| DELETE | `/applications/:id` | Bearer token | Delete one of your applications |

## Testing

- **Unit tests:** `cd backend && npm test` — tests for the follow-up rules and monthly statistics.
- **Lint:** `cd frontend && npm run lint`
- **CI:** every push and pull request to `main` runs the backend tests, the frontend lint and a production build of the frontend in GitHub Actions.
- **Manual testing:** I tested the API with `curl` and every screen in the browser, locally and on the deployed version, including two accounts to check that users cannot see each other's data. The details are in [RESEARCH.md](RESEARCH.md).

## Security

- Passwords are hashed with bcrypt and never returned by the API.
- Login returns the same error for a wrong email and a wrong password, so it does not reveal which emails are registered.
- JWTs are signed with a secret from an environment variable and expire after 7 days. The server refuses to start if `JWT_SECRET` is missing.
- Every application query is limited to the logged-in user. The `owner` field cannot be changed through the API.
- Secrets are only in environment variables. `.env` and `.env.local` are ignored by git; `.env.example` files show which variables are needed.
- The project uses its own MongoDB user with read and write rights only.
- Input is validated in the browser (Yup) and on the server (Mongoose schema and auth checks).

## What I would improve next

- Store the token in an **httpOnly cookie** instead of `localStorage`, so it cannot be read by JavaScript if the site ever had an XSS problem.
- **Rate limiting** on login and registration to slow down password guessing.
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