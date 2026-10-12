# Miftahul Huda — Portfolio

Personal portfolio built with Next.js 16, Tailwind CSS v4, Motion, React Three Fiber, cmdk and Resend.
Production: https://miftahulhuda.vercel.app

## Run locally

    npm install
    cp .env.example .env.local   # then fill in the values
    npm run dev

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run test` | Unit & component tests (Vitest) |
| `npm run test:e2e` | Builds and runs Playwright smoke tests (contact form in dry-run mode) |
| `npm run build` | Production build |

## Environment

See `.env.example`. `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are required for the contact form. `GITHUB_TOKEN` is optional (the graph falls back to a sample pattern). Set the same variables in Vercel → Project Settings → Environment Variables (Production + Preview).

## Editing content

All text lives in `src/content/`:
- `en.ts`: English content (projects, experience, services…)
- `id.ts`: Indonesian overrides
- `ui.ts`: interface strings for both languages

Optional fields (`cvUrl`, `certifications`, a project's `caseStudy` fields and `gallery`) render only when filled in, so leave them empty rather than writing placeholders. Put the CV at `public/cv/Miftahul-Huda-CV.pdf` and set `personal.cvUrl` to `/cv/Miftahul-Huda-CV.pdf`. Put screenshots in `public/projects/<slug>/`. `npm run test` checks that every referenced file exists.

## Deploy

Pushing to `main` deploys production on Vercel. Other branches get preview deployments.
