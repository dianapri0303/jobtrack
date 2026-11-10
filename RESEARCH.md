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

## Next

- Mongoose model for job applications and CRUD routes.
- GitHub Actions to run lint and tests on every push. This is new for me, and I will document how I learn it here.