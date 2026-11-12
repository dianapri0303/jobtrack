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

## Next

- Follow-up list ("who to contact today") and monthly statistics with a goal of 30 applications.
- GitHub Actions to run lint and tests on every push. This is new for me, and I will document how I learn it here.