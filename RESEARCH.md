# Research log

This file records what I had to learn while building JobTrack, where I looked, what did not work and what I learned. I update it as I go, day by day.

Tools I used while learning, including AI assistants, are described in [AI.md](AI.md).

## How I evaluate sources

- I prefer official documentation (Next.js, MongoDB, GitHub, TypeScript, Express) over blog posts, because it matches the current version of each tool.
- I check which version a tutorial is written for. Many examples online are for older versions of Next.js or Express.
- When a fix works, I still check the docs to understand why it works before keeping it.

## Day 1 — 08.11.2026 · Next.js 15 + TypeScript setup

**What I needed to learn and why**

- How to create a Next.js 15 project with TypeScript and the App Router, because this is the JobTrack frontend.
- How GitHub decides whether a commit counts on the contribution graph, because I wanted my daily progress to be visible.

**What did not work**

- I accidentally saved my email in `git config user.name` instead of `user.email`. Running the command again with the correct value fixed it, because `git config` simply overwrites the old value.
- VS Code showed error `ts(2882)` on `import "./globals.css"`: "Cannot find module or type declarations for side-effect import". The app still ran, but the editor marked it as an error.

**What I learned**

- `npx create-next-app@15` pins the major version. Using `@latest` would install a newer major version.
- Commits only count on the GitHub graph if they reach the default branch and the commit email is linked to my account. I used my GitHub `noreply` address so my personal email is not public.
- The `ts(2882)` error comes from TypeScript checking side-effect imports (`noUncheckedSideEffectImports`). TypeScript did not know what a `.css` file is, so I added `global.d.ts` with `declare module "*.css";` to declare that CSS imports are allowed.

**Sources**

- create-next-app CLI: https://nextjs.org/docs/app/api-reference/cli/create-next-app
- Setting your commit email address: https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address
- TypeScript `noUncheckedSideEffectImports`: https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports

## Day 2 — 09.11.2026 · Express + MongoDB backend

**What I needed to learn and why**

- How to structure a small Express server and connect it to MongoDB Atlas with Mongoose, because JobTrack needs to store applications.
- How to keep the database password out of a public repository.

**What did not work**

- At first I could not find "Database Access" in MongoDB Atlas. I was on the Organization level, but database users are managed inside a Project, so I had to open the project first.
- My first connection string still had the angle brackets from the template (`<username>:<password>`). The `< >` are placeholders and must be removed.

**What I learned**

- A simple backend structure: `index.js` loads environment variables, connects to the database and only then starts the server; `server.js` creates the Express app and routes; `db/initMongoDB.js` handles the connection.
- The parts of a MongoDB connection string: protocol, `username:password`, cluster host and database name.
- `.env` holds secrets and is listed in `.gitignore`. `.env.example` shows which variables are needed, without real values.
- I created a separate database user only for JobTrack, so this project does not share credentials with my other projects.
- A `GET /api/health` route is a simple way to check that the server is alive. It will be useful later for deployment and CI.
- The API runs on port 4000 so it does not clash with Next.js on port 3000.

**Sources**

- MongoDB connection string format: https://www.mongodb.com/docs/manual/reference/connection-string/
- Express "Hello world" example: https://expressjs.com/en/starter/hello-world.html
- dotenv: https://github.com/motdotla/dotenv

## Day 3 — 11.11.2026 · Application model and CRUD API

**What I needed to learn and why**

- How to describe a job application in MongoDB with a Mongoose schema, because the whole app is built around this data.
- How to build CRUD routes in Express and which HTTP methods and status codes to use.
- How to handle errors so the API returns clear messages instead of crashing.

**What did not work**

- I ran `npm run dev` from the project root instead of the `backend` folder and got `ENOENT: no such file or directory ... package.json`. npm looks for `package.json` in the current folder, so I learned to check where I am with `pwd` before running commands.
- I made a typo in a file name (`applicationsConroller.js`). The router imported `applicationsController.js`, so the import would fail. I renamed the file to match the import exactly.

**What I learned**

- A Mongoose schema defines fields, types and rules (`required`, `enum`, `default`, `trim`). Validation runs on create, and on update only with `runValidators: true`.
- `timestamps: true` adds `createdAt` and `updatedAt` automatically.
- I split the code into model, controller and router so each file has one job.
- In Express 5, errors thrown in `async` route handlers are passed to the error-handling middleware automatically, so I do not need a `try/catch` wrapper in every controller.
- I return `400` for client mistakes (invalid JSON, `ValidationError`, `CastError` for a malformed id), `404` when a document does not exist, `201` after creating and `204` after deleting.

**How I tested**

- I tested every endpoint manually with `curl`: create, list, get by id, update the status, delete.
- I also tested error cases: a request without `company` (400), an invalid id (400).
- Next step: automate these checks with tests and run them in GitHub Actions.

**Sources**

- Express error handling: https://expressjs.com/en/guide/error-handling.html
- Mongoose validation: https://mongoosejs.com/docs/validation.html
- HTTP response status codes (MDN): https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

## Day 4 — 11.11.2026 · Applications page and form

**What I needed to learn and why**

- How to build a form with Formik and validate it with Yup, because users must not save an application without a company or position.
- When a component in the Next.js App Router has to be a Client Component.

**What I learned**

- Components in the App Router are Server Components by default. Anything that uses state, events or form libraries needs `'use client'` at the top of the file.
- Formik keeps the form values and handles submit; Yup describes the rules (`required`, `url`, `oneOf`). Formik shows the Yup error message for each field with `ErrorMessage`.
- `as const` on the statuses array lets TypeScript build an exact union type (`'applied' | 'interview' | 'offer' | 'rejected'`) that matches the backend enum.
- I built the UI first with local state (`useState`) to check that the form and list work before connecting the API. The data disappears on page refresh, which is expected at this stage.
- `npm run lint` runs ESLint. I will use the same command later in GitHub Actions.

**How I tested**

- Submitting an empty form shows errors for company and position.
- An invalid link shows a URL error; an empty link is allowed.
- A valid form adds a card to the top of the list and resets the form.

**Sources**

- Formik overview: https://formik.org/docs/overview
- Yup: https://github.com/jquense/yup
- Next.js `'use client'` directive: https://nextjs.org/docs/app/api-reference/directives/use-client

## Day 5 — 12.11.2026 · Connecting the frontend to the API

**What I needed to learn and why**

- How to load and save data from the Express API in Next.js, so applications are stored in MongoDB and survive a page refresh.
- How to filter applications by status.
- How to pass the API URL to the frontend without hard-coding it.

**What did not work**

- After connecting the frontend, the page showed both "Could not save the application" and "Could not load applications". The backend terminal said `MongoDB connected` and `Server is running on port 4000`, but `http://localhost:4000/api/health` in the browser returned "This site can't be reached".
- The log message was misleading. In Express 5, the `app.listen` callback is also called when the server fails to start, with the error as its first argument. My callback ignored that argument and printed "Server is running" anyway.
- The most likely cause was that port 4000 was still taken by an old server process from an earlier session. I could not confirm which process it was, but after freeing the port and restarting, the API responded.
- Fix: the `app.listen` callback now checks the `error` argument, logs `Server failed to start` with the reason and exits. I freed the port with `lsof -ti :4000 | xargs kill -9` and restarted the backend.
- Lesson: a success message in the log is not proof that something works. I now check the health endpoint directly instead of trusting the log.

**What I learned**

- TanStack Query separates reading data (`useQuery`) from changing data (`useMutation`). It handles loading and error states and caches the results.
- The `queryKey` works like a label for cached data. Putting the status filter into the key (`['applications', statusFilter]`) makes the query run again automatically when the filter changes.
- After creating an application I call `invalidateQueries`, so the list is fetched again and shows the new item.
- I filter on the server (`GET /api/applications?status=interview`) instead of in the browser, so the frontend only receives the data it needs. The backend checks the value against the list of statuses before using it in the query.
- In Next.js, only environment variables that start with `NEXT_PUBLIC_` are available in browser code. I use `NEXT_PUBLIC_API_URL` in `.env.local`.
- The default Next.js `.gitignore` ignores every `.env*` file, which would also hide `.env.example`. I added `!.env.example` so the template is committed while `.env.local` stays private.
- The form now waits for the server: the button is disabled while saving, and the form is only reset after a successful save, so no input is lost if the request fails.

**How I tested**

- Added an application and refreshed the page: it is still there and also visible in MongoDB Atlas (Browse Collections).
- Filtered by `interview` and back to `all`.
- Stopped the backend and refreshed the page: the error message is shown after TanStack Query's automatic retries.
- `npm run lint` passes.

**Sources**

- TanStack Query quick start: https://tanstack.com/query/latest/docs/framework/react/quick-start
- Next.js environment variables: https://nextjs.org/docs/app/guides/environment-variables
- Axios instance: https://axios-http.com/docs/instance
- Express 5 migration guide (`app.listen` changes): https://expressjs.com/en/guide/migrating-5.html

## Day 6 — 13.11.2026 · Follow-up list and monthly statistics

**What I needed to learn and why**

- How to turn stored applications into useful output: who I should contact today and how close I am to my goal of 30 applications per month. This is the main "actionable output" of the app.
- How to design this logic so it is easy to test later in CI.

**What I learned**

- I put the business rules into pure functions (`needsFollowUp` and `buildSummary` in `backend/src/utils/summary.js`). They take data and a date and return a result, without touching the database. The date is a parameter (`now`), so tests can use a fixed date and always get the same result.
- Follow-up rules I chose: an application needs a follow-up if its follow-up date is today or in the past, or if it has no follow-up date, is still `applied` and was sent 7 or more days ago. `offer` and `rejected` never need a follow-up.
- Route order matters in Express. `GET /applications/summary` must be registered before `GET /applications/:id`, otherwise Express treats `summary` as an id.
- `.lean()` in Mongoose returns plain JavaScript objects, which is faster for read-only data.
- Mongoose saves an empty string for a `Date` field as `null`, so an empty optional date from the form does not break validation.
- Query keys can be hierarchical. Both the list (`['applications', 'list', status]`) and the summary (`['applications', 'summary']`) start with `'applications'`, so one `invalidateQueries({ queryKey: ['applications'] })` refreshes the list, the statistics and the follow-ups together.
- Limitation: "today" is calculated in the server's time zone. This is fine for the UK in winter (UTC), but a real product would need the user's time zone.

**How I tested**

- `curl http://localhost:4000/api/applications/summary` returns the month, goal, counts by status and the follow-up list.
- An application sent 10 days ago with no follow-up date appears in "Follow up today".
- An application with today's follow-up date appears; a `rejected` one with today's date does not.
- Clicking "Followed up" moves the next follow-up 7 days ahead and removes it from today's list.
- The monthly counter and progress bar update after adding an application.
- `npm run lint` passes.

**Sources**

- Express routing (route order and parameters): https://expressjs.com/en/guide/routing.html
- TanStack Query invalidation from mutations: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
- Mongoose lean: https://mongoosejs.com/docs/tutorials/lean.html

## Day 7 — 14.11.2026 · Unit tests

**What I needed to learn and why**

- How to test my follow-up and statistics logic automatically, so I do not have to re-check it by hand after every change.

**What I learned**

- Node.js has a built-in test runner (`node:test`) and assertion module (`node:assert/strict`), so I did not need to install a testing library for unit tests. `node --test` finds files ending in `.test.js`.
- Because `needsFollowUp` and `buildSummary` take the current date as a parameter, each test passes a fixed date (`2026-11-14`). The tests give the same result on any day and on any computer.
- I used dates with a fixed time in UTC (`T12:00:00Z`) so the tests do not depend on the time zone of the machine that runs them.
- The tests cover the main rules: 7+ days without a reply, a follow-up date of today, a rejected application, and counting only the current month.

**How I tested**

- `npm test` in the `backend` folder: 5 tests pass, 0 fail.

**Sources**

- Node.js test runner: https://nodejs.org/api/test.html
- Node.js assert: https://nodejs.org/api/assert.html

## Day 8 — 15.11.2026 · GitHub Actions (CI) and deployment

**What I needed to learn and why**

- GitHub Actions was completely new to me. I wanted every push to be checked automatically, not only on my laptop, because this is a basic DevOps practice.
- How to deploy a project where the frontend and backend live in one repository but on two different platforms.

**What did not work**

- After deploying the frontend, I first copied the address of a single Vercel deployment (`jobtrack-<id>-<team>.vercel.app`). These deployment URLs can be protected by Vercel login, so other people might not see the app. I switched to the project's production domain and checked it in an incognito window, where it opened without a login.
- On Render I first opened the root URL of the API and got `{"message":"Route not found"}`. This was actually correct: there is no route for `/`, only for `/api/...`. Opening `/api/health` returned `{"status":"ok"}`.
- When I opened the live demo in an incognito window, I saw all my test applications. Without accounts, everyone with the link shared one list. I decided this was not acceptable for a public demo and added authentication the next day.

**What I learned about CI**

- A workflow is a YAML file in `.github/workflows/`. `on: push` and `on: pull_request` decide when it runs.
- My workflow has two jobs, `backend` and `frontend`. Jobs run in parallel on fresh Ubuntu machines, so a failure in one part is easy to see.
- `working-directory` lets one repository hold two projects: each job runs its commands inside `backend` or `frontend`.
- `actions/checkout` downloads the code and `actions/setup-node` installs Node.js and caches npm packages using the `package-lock.json` file of each project.
- I use `npm ci` instead of `npm install` in CI. It installs exactly the versions from `package-lock.json` and fails if the lock file does not match `package.json`, so the build is reproducible.
- The backend job runs the unit tests. The frontend job runs ESLint and a production build, which also catches TypeScript errors.
- YAML depends on indentation, so I copied the structure carefully and checked the result in the Actions tab.

**What I learned about deployment**

- Render runs the Express API with `backend` as the root directory, `npm ci` to install and `npm start` to run. Render provides its own `PORT`, and my code already reads `process.env.PORT`.
- Vercel runs the Next.js app with `frontend` as the root directory.
- Secrets are not in the repository. I added `MONGODB_URI` in the Render dashboard and `NEXT_PUBLIC_API_URL` in the Vercel dashboard.
- `NEXT_PUBLIC_` variables are added to the frontend code at build time, so after changing one in Vercel I need to redeploy.
- The free Render plan stops the service after a period without requests, so the first request after a break can take up to about a minute.
- The `/api/health` endpoint from Day 2 was useful: it was the first thing I checked after the backend deployed.

**How I tested**

- The first GitHub Actions run passed: backend tests, frontend lint and build.
- On the deployed site, in an incognito window, I loaded the applications page, saw the statistics and the list, and checked that the data comes from MongoDB.

**Sources**

- GitHub Actions: building and testing Node.js: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
- `npm ci`: https://docs.npmjs.com/cli/commands/npm-ci
- Deploy an Express app on Render: https://render.com/docs/deploy-node-express-app
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs

## Day 9 — 16.11.2026 · User accounts and private data

**What I needed to learn and why**

- How to add sign-up and login so that each user only sees their own applications. The public demo showed one shared list, which is not acceptable for personal job-search data.
- How to store passwords safely and how token-based authentication works.

**What I learned**

- Passwords must never be stored as plain text. bcrypt turns a password into a salted hash that cannot be reversed. `bcrypt.compare` checks a login attempt against the hash. I use a cost factor of 10.
- A JWT is signed, not encrypted: anyone can read its payload, but nobody can change it without the secret. So I only put the user id (`sub`) in it, never the password or email, and set it to expire after 7 days.
- An Express middleware (`authenticate`) checks the `Authorization: Bearer <token>` header before every application route and puts the user id on `req.userId`.
- Authorization is more than checking the token. Every query includes `owner: req.userId` (`findOne`, `findOneAndUpdate`, `findOneAndDelete`), so a logged-in user still cannot access another user's application by guessing its id. In that case the API answers `404`, as if the application does not exist.
- The server sets `owner` itself when creating an application and removes `owner` from update requests, so it cannot be changed from the client.
- Login returns the same message for a wrong email and a wrong password, so it does not reveal which emails have accounts.
- A unique index on `email` protects against duplicates. MongoDB reports a duplicate with error code `11000`, which I turn into `409 Conflict`.
- "Fail fast": the server now refuses to start when `JWT_SECRET` is missing, with a clear message, instead of failing later on the first login.
- Deployment order matters. I added `JWT_SECRET` to Render before pushing the new code. Otherwise the automatic deploy would start the new code without the secret and stop immediately.
- On the frontend, an Axios request interceptor adds the token to every request, and a response interceptor sends the user to the login page if the token is no longer valid. On logout I clear the TanStack Query cache, so the next person on the same computer does not see the previous user's data.
- Trade-off: I store the token in `localStorage` because it is simple. An httpOnly cookie would be safer against XSS, and I listed it as the next improvement in the README.
- Applications created before this change have no `owner`, so they are no longer visible to anyone. For a demo this is acceptable; in a real product I would write a migration to assign them to a user.

**How I tested**

- `curl http://localhost:4000/api/applications` without a token returns `401 Not authorized`.
- The applications page redirects to the login page when I am not logged in.
- I registered two accounts. An application added by the first account is not visible to the second, and it is visible again after logging back in as the first.
- A wrong password shows "Invalid email or password". Registering the same email twice shows "Email is already registered". A password shorter than 8 characters is rejected in the form.
- `npm test` and `npm run lint` pass, and the GitHub Actions run is green.
- I repeated the main checks on the deployed site in an incognito window.

**Sources**

- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Introduction to JSON Web Tokens: https://jwt.io/introduction
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken