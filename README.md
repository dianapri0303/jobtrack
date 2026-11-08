# JobTrack

JobTrack is a job application tracker that keeps vacancies, recruiters and follow-ups in one place, with monthly statistics and a goal of 30 applications per month.

> Status: in active development

## Features

- [ ] Add and edit job applications (company, position, link, date, status)
- [ ] Filter by status and search
- [ ] Recruiter contacts and follow-up dates
- [ ] Monthly stats dashboard with a 30-applications goal
- [ ] Authentication
- [ ] Follow-up reminders
- [ ] Export to CSV

## Tech stack

**Frontend:** Next.js 15 (App Router), TypeScript, TanStack Query, Zustand, Formik + Yup, CSS Modules

**Backend:** Node.js, Express, MongoDB (Mongoose)

**Deploy:** Vercel (frontend), Render (backend)

## Project structure

```
jobtrack/
├── frontend/   # Next.js app
└── backend/    # Express API (coming soon)
```

## Getting started

```bash
git clone https://github.com/dianapri0303/jobtrack.git
cd jobtrack/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Author

Diana Prihozhyna — [GitHub](https://github.com/dianapri0303)