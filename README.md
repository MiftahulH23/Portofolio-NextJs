# Miftahul Huda — Portfolio

Personal portfolio built with Next.js 16, Tailwind CSS v4, Motion, React Three Fiber, cmdk and Resend.
Production: https://miftahulhuda.vercel.app

The site has two ways in:

- **`/`: Kota Neon.** An interactive night city that visitors explore by bicycle. W/↑ rides, S/↓ brakes, A/D steers, Shift sprints, Space rings the bell, and touch screens get on-screen buttons. Six gates open the profile, skills, experience, projects, education and contact cards (again on every pass), and eight two-sided billboards show information from the content files. A minimap, a route bar and a green arrow lead to the next gate.
- **`/ringkas`: the compact version.** The same information as a dark bento page with a contact form, case studies and a ⌘K palette. It is meant for recruiters, search engines and devices without WebGL.

### How the city is built

- `src/world/`: pure TypeScript with no React or three. It covers the city layout, the road graph, bike physics, collision, left-lane traffic, pedestrians, gates, billboards, the minimap and a small store, and it is unit-tested in Node.
- `src/components/world/`: React Three Fiber renderers that draw that state each frame. Building geometry is merged, billboards and signs are canvas textures, bloom runs only on the high tier, and the world drops to a low tier automatically when the frame rate falls.
- `src/components/hud/`: the accessible DOM layer (intro, route bar, info card, minimap, touch controls). The world chunk loads only after "Start exploring".

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
| `node scripts/world-shot.mjs <url> <prefix> [x,z,heading …]` | Screenshots the city from a running dev server, teleporting to each spot |
| `node scripts/intro-bg.mjs` | Re-renders `public/world/intro-bg.jpg` from the running dev server |

The teleport hook `window.__world.tp(x, z, heading)` exists in development, and in production builds made with `NEXT_PUBLIC_E2E=1`, which the e2e config sets. It is never present in a normal production build.

## Environment

See `.env.example`. `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are required for the contact form. Set the same variables in Vercel → Project Settings → Environment Variables (Production + Preview).

## Editing content

All text lives in `src/content/`:
- `en.ts`: English content (projects, experience, services…)
- `id.ts`: Indonesian overrides
- `ui.ts`: interface strings for both languages

Optional fields (`cvUrl`, `certifications`, a project's `caseStudy` fields and `gallery`) render only when filled in, so leave them empty rather than writing placeholders. Put the CV at `public/cv/Miftahul-Huda-CV.pdf` and set `personal.cvUrl` to `/cv/Miftahul-Huda-CV.pdf`. Put screenshots in `public/projects/<slug>/`. `npm run test` checks that every referenced file exists.

## Deploy

Pushing to `main` deploys production on Vercel. Other branches get preview deployments.
