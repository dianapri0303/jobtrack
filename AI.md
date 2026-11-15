# AI usage

This file describes which AI tools I used while building JobTrack, what I used them for, where they were wrong or not helpful, and how I checked their output.

## Tools I used

- **Claude (Anthropic)** in a chat, throughout the whole project.

## What I used it for

- **Planning:** breaking the project into small daily steps so I could commit working code every day before the deadline.
- **Learning:** explanations of new concepts in simple language — CRUD and HTTP status codes, TanStack Query, Formik and Yup, environment variables, GitHub Actions and deployment.
- **Code drafts:** first versions of components, routes, the CI workflow and config files. I copied them into the project step by step, ran them and tested them myself.
- **Debugging:** explaining error messages (`ENOENT`, `ts(2882)`) and suggesting what to check first.
- **Documentation:** drafting parts of RESEARCH.md and this file from what actually happened during each day. I reviewed and edited the text.

## Where the AI was wrong or not helpful

1. **A bug in the server start code.** The first version of `server.js` ignored the `error` argument of the `app.listen` callback. In Express 5 this callback is also called when the server fails to start, so the log said "Server is running on port 4000" while nothing was listening. I noticed because `/api/health` did not open in the browser. We fixed the callback to log the error and exit. This taught me not to trust a success message without checking the endpoint myself.
2. **An ambiguous instruction.** I was told to insert a section "above **What I learned** in Day 3", but every day in RESEARCH.md has that heading, so the text ended up in Day 1 and one section was duplicated. After that I asked for complete files to replace instead of fragments to insert.
3. **A command without enough context.** An instruction to run `cd ..` did not say which terminal to use. I ran it in the wrong one and ended up outside the project folder. Now I check where I am with `pwd` before running commands.
4. **Reading text from a screenshot.** When the AI copied my database password from a screenshot, some characters could be confused (for example `l` and `I`). It warned me about this, and I compared the value with the original before using it.

## How I checked the AI's output

- I ran every change locally before committing and tested it by hand: API endpoints with `curl`, the UI in the browser.
- I checked the health endpoint directly instead of trusting log messages.
- I wrote unit tests for the main business logic and run them in GitHub Actions on every push, together with lint and a production build.
- I compared explanations with the official documentation listed in RESEARCH.md.
- When I did not understand a piece of code, I asked follow-up questions until I could explain it in my own words.

## What I learned about working with AI

- AI is very useful for learning and for getting started quickly, but its code still needs to be run, tested and understood.
- Clear, complete instructions matter in both directions: asking for whole files instead of fragments and checking which folder I am in saved me from several mistakes.
- Verifying in the real environment (the browser, the health endpoint, CI) is what actually proves that something works.