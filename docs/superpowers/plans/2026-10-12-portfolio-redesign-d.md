# Portfolio Redesign D "Command Center" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current cream-themed portfolio with design D: a dark bento grid with a draggable React Three Fiber stack cube, a ⌘K command palette, per-project case-study pages and a working contact form (Resend), bilingual EN/ID.

**Architecture:** Next.js 16 App Router. Typed content lives in `src/content/*` and reaches client components through `LanguageContext` (EN/ID, localStorage). The home page is a server component that composes client "bento cards" inside a 12-column CSS grid. It fetches GitHub contributions on the server (revalidated daily). The contact form calls a Server Action, which delegates to a pure, unit-tested `handleContact` service. Three.js loads only on desktop, when the card scrolls into view, and when WebGL exists. Otherwise a CSS-3D cube renders.

**Tech Stack:** Next.js 16.1, React 19.2, TypeScript 5, Tailwind CSS v4, `motion` 12 (`motion/react`), `@react-three/fiber` 9 + `@react-three/drei` 10 + `three` 0.180, `lenis` 1.3, `cmdk` 1.1, `resend` 6, `zod` 4, Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-redesign-design.md`. Mockup: https://claude.ai/artifact/QTjDHQgoQEgyVJaTispwd6 (page "Round 2", frames *D — Command Center*, *D — Case study*, *D — Command palette*).

## Global Constraints

- Work on branch `feat/redesign-d`. **Never `git push`** (it triggers a Vercel deploy). Commit after every task.
- Every task ends green: `npm run lint && npm run test && npm run build`.
- Colors: bg `#09090B`, card `#131316`, border `#232328`, text `#F4F4F5`, muted `#A1A1AA`, accent lime `#A3E635`. Fonts: Bricolage Grotesque (display/body) + Geist Mono, via `next/font/google`.
- Animation library: `motion` only (`import … from "motion/react"`). `framer-motion` gets removed.
- **Never invent content.** Certificates, case-study facts, metrics and CV are optional fields. When empty, the section or button is not rendered. No `[placeholder]` text may ever reach the UI.
- All user-visible strings come from `src/content/ui.ts` (EN + ID). `UiStrings` typing forces both languages to have identical keys.
- Respect `prefers-reduced-motion`: no entrance animations, no Lenis, no WebGL. CSS animations get neutralised globally.
- Below 900px (`bento:` breakpoint) every card is one column with auto height. WebGL is never used below 900px.
- `/temacoffe` and `/temahospital` keep their look. Change only their `framer-motion` import to `motion/react`.
- Contact form: no auto-reply. `from: "Portfolio <onboarding@resend.dev>"`, `to: CONTACT_TO_EMAIL` (default `miftahulh942@gmail.com`), `replyTo` = sender. Rate limit: 3 submissions / 10 minutes / IP.
- Site URL default: `https://miftahulhuda.vercel.app` (`NEXT_PUBLIC_SITE_URL` overrides).
- Secrets live only in `.env.local` (already filled: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `GITHUB_TOKEN`). Never print their values.

## Review Focus

1. **localStorage unavailable** (Safari private mode, blocked storage): the language toggle must still work in memory and never crash. Pinned in Task 2.
2. **Hostile contact input:** a name with `\r\n`, or HTML in the message. The email subject must stay on one line and the HTML body must be escaped. Pinned in Task 8.
3. **Double-clicking "Send message"**: exactly one Server Action call. Pinned in Task 8.
4. **Unknown case-study slug** (`/projects/nope`): a real 404, not a crash or an empty page. Pinned in Task 11 (e2e).
5. **WebGL unavailable or context creation failing** on a desktop browser: the CSS cube renders instead of a blank card. Pinned in Task 6.

---

## File map

```
eslint.config.mjs                         (rewrite, Task 1)
vitest.config.mts, vitest.setup.ts        (Task 1)
playwright.config.ts, e2e/smoke.spec.ts   (Task 11)
.env.example                              (Task 1)
src/app/layout.tsx                        (Task 3 fonts, Task 11 metadata)
src/app/globals.css                       (Task 2 trim, Task 3 rewrite)
src/app/(portfolio)/layout.tsx            (Task 2, 3, 9)
src/app/(portfolio)/page.tsx              (Task 2 placeholder, 5, 6, 7, 8, 11)
src/app/(portfolio)/projects/[slug]/page.tsx (Task 10)
src/app/actions/contact.ts                (Task 8)
src/app/sitemap.ts, src/app/robots.ts     (Task 11)
src/content/{types,en,id,ui,index}.ts     (Task 2)
src/context/LanguageContext.tsx           (Task 2 rewrite)
src/lib/{utils,format,events,site,github,rate-limit,contact-schema,contact-service,resend-sender}.ts
src/hooks/{useLocalTime,useCanUseWebGL}.ts
src/components/icons.tsx
src/components/layout/{Header,Footer,SmoothScroll}.tsx
src/components/bento/*.tsx
src/components/three/{StackCube,StackCubeCss}.tsx
src/components/contact/ContactForm.tsx
src/components/command/CommandPalette.tsx
src/components/case-study/*.tsx
src/components/ui/TiltCard.tsx            (rewrite, Task 5)
src/test/render.tsx                       (Task 2)
```

---

### Task 1: Tooling — ESLint fix, Vitest, env example

**Files:**
- Modify: `eslint.config.mjs`, `package.json`, `.gitignore`
- Create: `vitest.config.mts`, `vitest.setup.ts`, `src/lib/utils.test.ts`, `.env.example`

**Interfaces:**
- Produces: `npm run test` (Vitest, jsdom, `src/**/*.test.{ts,tsx}`). The setup file mocks `matchMedia`, `IntersectionObserver`, `ResizeObserver` and `Element.prototype.scrollIntoView`.

- [ ] **Step 1: Confirm lint is broken**

Run: `npm run lint`
Expected: crash with `TypeError: Converting circular structure to JSON`.

- [ ] **Step 2: Rewrite `eslint.config.mjs`**

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "inject_translations.js",
    "update_lang.js",
  ]),
]);
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: it runs. Errors are allowed in files that Task 2 deletes (`src/components/sections/*`, `src/components/ui/*`). Note them, but do not fix them. If an error appears in a file that survives (`src/app/(templates)/*`, `src/lib/utils.ts`, `src/context/*`), fix it minimally.

- [ ] **Step 4: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 5: Create `vitest.config.mts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
```

- [ ] **Step 6: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// Plain functions (not vi.fn) so vi.restoreAllMocks() in tests can never wipe them.
const noop = () => {};
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    dispatchEvent: () => false,
  }),
});

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
Element.prototype.scrollIntoView = noop;
```

- [ ] **Step 7: Write a sanity test `src/lib/utils.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
});
```

- [ ] **Step 8: Add scripts to `package.json`**

In `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 9: Run tests**

Run: `npm run test`
Expected: 1 passed.

- [ ] **Step 10: Create `.env.example` and un-ignore it**

`.env.example`:

```
# Contact form (required in production)
RESEND_API_KEY=
CONTACT_TO_EMAIL=miftahulh942@gmail.com

# GitHub contribution graph (optional; falls back to a static pattern)
GITHUB_TOKEN=

# Absolute site URL for metadata/sitemap (optional)
NEXT_PUBLIC_SITE_URL=https://miftahulhuda.vercel.app

# Test only: "1" makes the contact action succeed without sending email
# CONTACT_DRY_RUN=1
```

Append to `.gitignore`, directly under the existing `.env*` line:

```
!.env.example
```

Run: `git check-ignore .env.example; echo "exit=$?"`
Expected: `exit=1` (meaning the file is not ignored).

- [ ] **Step 11: Commit**

```bash
git add eslint.config.mjs vitest.config.mts vitest.setup.ts src/lib/utils.test.ts package.json package-lock.json .env.example .gitignore
git commit -m "chore: fix eslint flat config, add vitest and env example"
```

---

### Task 2: Typed content model, new LanguageContext, dead-code removal

**Files:**
- Create: `src/content/types.ts`, `src/content/en.ts`, `src/content/id.ts`, `src/content/ui.ts`, `src/content/index.ts`, `src/content/content.test.ts`, `src/context/LanguageContext.test.tsx`, `src/lib/format.ts`, `src/lib/format.test.ts`, `src/test/render.tsx`
- Rewrite: `src/context/LanguageContext.tsx`, `src/app/(portfolio)/layout.tsx`, `src/app/(portfolio)/page.tsx`
- Modify: `src/app/(templates)/temacoffe/page.tsx:2`, `src/app/(templates)/temahospital/page.tsx:2`, `src/app/globals.css:2`
- Delete: `src/lib/data.ts`, `src/lib/animations.ts`, `src/components/sections/` (whole folder), `src/components/MobileNav.tsx`, `src/components/ScrollToTopButton.tsx`, `src/hooks/useMediaQuery.ts`, `inject_translations.js`, `update_lang.js`, and in `src/components/ui/`: `AbstractShape.tsx CursorSpotlight.tsx GeometricArt.tsx Globe.tsx GridBackground.tsx Lanyard.tsx ScrollProgress.tsx TiltCard.tsx aurora-background.tsx background-beams.tsx background-ripple-effect.tsx badge.tsx button.tsx card.tsx flip-words.tsx glowing-effect.tsx hero-parallax.tsx infinite-moving-cards.tsx text-generate-effect.tsx typewriter-effect.tsx`

**Interfaces:**
- Produces:
  - `type Lang = "en" | "id"`, `PortfolioContent`, `Project`, `CaseStudy`, `ArchNode`, `Service`, `Experience`, `Certification`, `ProcessStep`, `SkillGroup`, `Template` (all from `@/content`)
  - `getContent(lang: Lang): PortfolioContent`, `getProject(lang: Lang, slug: string): Project | undefined`, `getUi(lang: Lang): UiStrings`, `type UiStrings`
  - `useLanguage(): { lang: Lang; setLang(l: Lang): void; toggleLanguage(): void; content: PortfolioContent; ui: UiStrings }` and `LanguageProvider`
  - `fmt(template: string, vars: Record<string, string | number>): string`, `pad(n: number): string` ("01"), `hostOf(url?: string): string`
  - `renderWithLanguage(el: React.ReactElement)` test helper

- [ ] **Step 1: Write `src/content/types.ts`**

```ts
export type Lang = "en" | "id";

export interface ArchNode {
  label: string;
  title: string;
  detail: string;
}

export interface CaseStudy {
  timeline?: string;
  team?: string;
  problem?: { headline: string; body: string };
  responsibilities?: string[];
  architecture?: ArchNode[];
  features?: { title: string; detail: string }[];
  challenges?: { problem: string; solution: string }[];
  results?: { value: string; label: string }[];
}

export interface Project {
  slug: string;
  title: string;
  role: string;
  description: string;
  image: string;
  gallery?: { src: string; alt: string }[];
  technologies: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  caseStudy?: CaseStudy;
}

export interface Service {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  achievements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Template {
  title: string;
  description: string;
  link: string;
}

export interface PortfolioContent {
  personal: {
    name: string;
    headline: string;
    tagline: { lead: string; highlight: string; tail: string };
    summary: string;
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    timezone: string;
    timezoneLabel: string;
    githubLogin: string;
    cvUrl?: string;
    socials: { github: string; linkedin: string; instagram: string };
  };
  education: {
    institution: string;
    degree: string;
    gpa: number;
    gpaMax: number;
    duration: string;
  };
  services: Service[];
  experience: Experience[];
  projects: Project[];
  templates: Template[];
  skills: SkillGroup[];
  cubeFaces: string[];
  process: ProcessStep[];
  certifications: Certification[];
}
```

- [ ] **Step 2: Write `src/content/en.ts`** (text copied from the old `src/lib/data.ts`)

```ts
import type { PortfolioContent } from "./types";

export const en: PortfolioContent = {
  personal: {
    name: "Miftahul Huda",
    headline: "Full-Stack Web Developer",
    tagline: {
      lead: "Full-stack developer crafting",
      highlight: "secure, fast web systems",
      tail: "— from campus platforms to banking-grade internal tools.",
    },
    summary:
      "A Full-Stack Web Developer with adaptive skills across modern technologies. I have professional experience designing secure and user-friendly system architectures — from academic projects to corporate applications in the banking industry.",
    email: "miftahulh942@gmail.com",
    phone: "+62 822-5220-9655",
    whatsapp: "https://wa.me/6282252209655",
    location: "Riau, Indonesia",
    timezone: "Asia/Jakarta",
    timezoneLabel: "UTC+7",
    githubLogin: "MiftahulH23",
    socials: {
      github: "https://github.com/MiftahulH23",
      linkedin: "https://linkedin.com/in/miftahulhuda23",
      instagram: "https://instagram.com/miftahulhuda23_",
    },
  },
  education: {
    institution: "Politeknik Caltex Riau",
    degree: "Applied Bachelor of Information Systems",
    gpa: 3.8,
    gpaMax: 4,
    duration: "Sep 2021 — Oct 2025",
  },
  services: [
    {
      number: "01",
      title: "Frontend Development",
      description:
        "Building pixel-perfect, responsive interfaces with React.js, Next.js, and modern CSS frameworks. Every UI is crafted for performance and accessibility.",
      tags: ["React.js", "Next.js", "TailwindCSS", "TypeScript"],
    },
    {
      number: "02",
      title: "Backend Development",
      description:
        "Designing scalable server-side architectures with Laravel, Node.js, and Express. RESTful APIs, database design, and secure authentication flows.",
      tags: ["Laravel", "Node.js", "Express.js", "MySQL"],
    },
    {
      number: "03",
      title: "Full-Stack Solutions",
      description:
        "End-to-end product development from database schema to polished UI. I bridge the gap between design and engineering to ship complete, production-ready apps.",
      tags: ["Full-Stack", "System Design", "API Integration", "Deployment"],
    },
    {
      number: "04",
      title: "Mobile Development",
      description:
        "Building native and cross-platform mobile applications with smooth animations and robust performance for both iOS and Android.",
      tags: ["Flutter", "React Native", "Swift"],
    },
  ],
  experience: [
    {
      company: "Politeknik Caltex Riau",
      position: "Laboratory Teaching Assistant",
      duration: "Mar 2026 — Present",
      achievements: [
        "Assisted lecturers in conducting practical laboratory sessions for Programming, Project Management, and Software Engineering courses.",
        "Evaluated laboratory reports and provided regular feedback on student assignments to ensure learning standards were met.",
        "Mentored students directly in the laboratory to help them understand technical concepts and troubleshoot programming tasks.",
      ],
    },
    {
      company: "PT Bank Riau Kepri Syariah",
      position: "Web Developer Intern",
      duration: "Feb 2024 — Jun 2024",
      achievements: [
        "Designed and developed a web-based attendance system from scratch for internal training participants using Laravel & MySQL.",
        "Improved user experience by implementing a responsive and intuitive interface with TailwindCSS.",
        "Translated business requirements from the Human Resource Management (HRM) division into effective functional features for training management.",
        "Ensured optimal application performance across devices (desktop & mobile) through thorough testing and code optimization.",
      ],
    },
  ],
  projects: [
    {
      slug: "sipresma",
      title: "Student Achievement Information System",
      role: "Full-Stack Developer",
      image: "/thumbnails/sistem-informasi-prestasi-mahasiswa.png",
      github: "https://github.com/MiftahulH23/sistem-informasi-prestasi-mahasiswa",
      demo: "https://sipresma.pocari.id/",
      description:
        "An integrated information system to manage and document student achievements — from competition proposal submissions to final achievement records.",
      technologies: ["Laravel", "Inertia.js", "React.js", "TailwindCSS", "Shadcn/UI", "MySQL"],
      featured: true,
      caseStudy: {
        architecture: [
          { label: "client", title: "React + Inertia.js", detail: "Shadcn/UI · TailwindCSS" },
          { label: "server", title: "Laravel", detail: "PHP application layer" },
          { label: "database", title: "MySQL", detail: "Relational data store" },
        ],
        features: [
          { title: "Competition proposal submission", detail: "Students submit proposals before joining a competition." },
          { title: "Achievement records", detail: "Final achievements are documented in one place." },
        ],
      },
    },
    {
      slug: "lps",
      title: "Waste Management Institution System",
      role: "Full-Stack Developer",
      image: "/thumbnails/sistem-lembaga-pengelola-sampah-(lps).png",
      github: "https://github.com/MiftahulH23/LembagaPengelolaSampah",
      demo: "https://silepaspku.pocari.id/",
      description:
        "A web application to help waste management institutions manage resident data, monthly fees, and waste collection records.",
      technologies: ["Laravel", "Inertia.js", "React.js", "TypeScript", "TailwindCSS", "Shadcn/UI"],
      featured: false,
      caseStudy: {
        architecture: [
          { label: "client", title: "React + Inertia.js", detail: "TypeScript · Shadcn/UI · TailwindCSS" },
          { label: "server", title: "Laravel", detail: "PHP application layer" },
        ],
        features: [
          { title: "Resident data", detail: "Manage resident records in one place." },
          { title: "Monthly fees", detail: "Track monthly fee payments." },
          { title: "Waste collection records", detail: "Log waste collection activity." },
        ],
      },
    },
    {
      slug: "indogrosir-scm",
      title: "Supply Chain Dashboard & Website Redesign",
      role: "Full-Stack Developer",
      image: "/thumbnails/dashboard-supply-chain-&-redesign-website.png",
      github: "https://github.com/hibatillah/indogrosir-scm",
      description:
        "An academic project focused on website redesign and SCM dashboard development to improve user experience and operational efficiency.",
      technologies: ["C#", ".NET", "JavaScript", "HTML", "CSS", "TailwindCSS"],
      featured: false,
      caseStudy: {
        architecture: [
          { label: "client", title: "JavaScript · HTML · CSS", detail: "TailwindCSS" },
          { label: "server", title: "C# / .NET", detail: "Application layer" },
        ],
        features: [
          { title: "Website redesign", detail: "A refreshed interface focused on user experience." },
          { title: "SCM dashboard", detail: "Operational supply-chain data at a glance." },
        ],
      },
    },
    {
      slug: "esteh-scm",
      title: "Supply Chain Management — Es Teh Indonesia",
      role: "Full-Stack Developer",
      image: "/thumbnails/supply-chain-management-system---es-teh-indonesia.png",
      github: "https://github.com/MiftahulH23/Capstone",
      description:
        "A supply chain management system to help partners and central management handle demand requests, inventory, and product distribution.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
      featured: false,
      caseStudy: {
        architecture: [
          { label: "client", title: "React.js", detail: "Single-page application" },
          { label: "server", title: "Node.js + Express.js", detail: "REST API" },
          { label: "database", title: "MongoDB", detail: "Document data store" },
        ],
        features: [
          { title: "Demand requests", detail: "Partners request stock from central management." },
          { title: "Inventory", detail: "Track stock levels." },
          { title: "Product distribution", detail: "Coordinate deliveries to partners." },
        ],
      },
    },
  ],
  templates: [
    {
      title: "Mabro Coffee",
      description: "A premium coffee shop landing page with an elegant, modern, and clean editorial design.",
      link: "/temacoffe",
    },
    {
      title: "Mabro Hospital",
      description: "A healthcare landing page with a complex, organic layout and sophisticated dark sections.",
      link: "/temahospital",
    },
  ],
  skills: [
    { group: "Front-End", items: ["React.js", "Next.js", "JavaScript", "TypeScript", "Inertia.js", "HTML5", "CSS3", "TailwindCSS"] },
    { group: "Back-End", items: ["PHP", "Laravel", "Node.js", "Express.js", "C#", ".NET", "RESTful API"] },
    { group: "Database", items: ["MySQL", "PostgreSQL", "MongoDB"] },
    { group: "Tools & Others", items: ["Git", "GitHub", "Postman", "Figma"] },
  ],
  cubeFaces: ["React", "Laravel", "Next.js", "Node.js", "TypeScript", "MySQL"],
  process: [
    { title: "Discover", description: "Understand the business goal, users and constraints." },
    { title: "Design", description: "Data model, architecture and UI flow before code." },
    { title: "Build", description: "Iterative sprints with clean, tested, reviewed code." },
    { title: "Ship", description: "Deploy, monitor and hand over with documentation." },
  ],
  certifications: [],
};
```

- [ ] **Step 3: Write `src/content/id.ts`**

```ts
import { en } from "./en";
import type { PortfolioContent, Project } from "./types";

function withProject(index: number, patch: Partial<Project>): Project {
  const base = en.projects[index];
  return {
    ...base,
    ...patch,
    caseStudy: patch.caseStudy ? { ...base.caseStudy, ...patch.caseStudy } : base.caseStudy,
  };
}

export const id: PortfolioContent = {
  ...en,
  personal: {
    ...en.personal,
    headline: "Full-Stack Web Developer",
    tagline: {
      lead: "Full-stack developer yang membangun",
      highlight: "sistem web yang aman dan cepat",
      tail: "— dari platform kampus hingga aplikasi internal kelas perbankan.",
    },
    summary:
      "Seorang Full-Stack Web Developer yang adaptif terhadap teknologi modern. Saya memiliki pengalaman profesional dalam merancang arsitektur sistem yang aman dan mudah digunakan — mulai dari proyek akademik hingga aplikasi korporat di industri perbankan.",
  },
  education: { ...en.education, degree: "Sarjana Terapan Sistem Informasi" },
  services: [
    {
      ...en.services[0],
      title: "Pengembangan Frontend",
      description:
        "Membangun antarmuka yang responsif dan sempurna (pixel-perfect) menggunakan React.js, Next.js, dan framework CSS modern. Setiap UI dibuat dengan mengutamakan performa dan aksesibilitas.",
    },
    {
      ...en.services[1],
      title: "Pengembangan Backend",
      description:
        "Merancang arsitektur server-side yang skalabel dengan Laravel, Node.js, dan Express. Termasuk RESTful API, perancangan database, dan alur autentikasi yang aman.",
    },
    {
      ...en.services[2],
      title: "Solusi Full-Stack",
      description:
        "Pengembangan produk end-to-end mulai dari skema database hingga UI yang dipoles. Saya menjembatani desain dan teknis untuk meluncurkan aplikasi yang siap rilis.",
    },
    {
      ...en.services[3],
      title: "Pengembangan Mobile",
      description:
        "Membangun aplikasi seluler native dan cross-platform dengan animasi yang mulus dan performa tangguh untuk iOS maupun Android.",
    },
  ],
  experience: [
    {
      ...en.experience[0],
      position: "Asisten Praktikum Laboratorium",
      duration: "Mar 2026 — Sekarang",
      achievements: [
        "Membantu dosen dalam pelaksanaan praktikum untuk mata kuliah Pemrograman, Manajemen Proyek, dan Rekayasa Perangkat Lunak.",
        "Mengevaluasi laporan praktikum dan memberikan umpan balik rutin pada tugas mahasiswa untuk memastikan standar pembelajaran terpenuhi.",
        "Membimbing mahasiswa secara langsung di laboratorium untuk membantu mereka memahami konsep teknis dan memecahkan masalah pemrograman.",
      ],
    },
    {
      ...en.experience[1],
      achievements: [
        "Merancang dan mengembangkan sistem absensi berbasis web dari awal untuk peserta pelatihan internal menggunakan Laravel & MySQL.",
        "Meningkatkan pengalaman pengguna dengan mengimplementasikan antarmuka yang responsif dan intuitif menggunakan TailwindCSS.",
        "Menerjemahkan kebutuhan bisnis dari divisi Human Resource Management (HRM) menjadi fitur fungsional yang efektif untuk manajemen pelatihan.",
        "Memastikan performa aplikasi optimal di berbagai perangkat (desktop & seluler) melalui pengujian dan optimasi kode yang menyeluruh.",
      ],
    },
  ],
  projects: [
    withProject(0, {
      title: "Sistem Informasi Prestasi Mahasiswa",
      description:
        "Sistem informasi terintegrasi untuk mengelola dan mendokumentasikan prestasi mahasiswa — mulai dari pengajuan proposal lomba hingga pencatatan prestasi akhir.",
      caseStudy: {
        features: [
          { title: "Pengajuan proposal lomba", detail: "Mahasiswa mengajukan proposal sebelum mengikuti lomba." },
          { title: "Pencatatan prestasi", detail: "Prestasi akhir terdokumentasi di satu tempat." },
        ],
      },
    }),
    withProject(1, {
      title: "Sistem Lembaga Pengelola Sampah",
      description:
        "Aplikasi web untuk membantu lembaga pengelola sampah mengelola data warga, iuran bulanan, dan catatan pengangkutan sampah.",
      caseStudy: {
        features: [
          { title: "Data warga", detail: "Kelola data warga di satu tempat." },
          { title: "Iuran bulanan", detail: "Pantau pembayaran iuran bulanan." },
          { title: "Catatan pengangkutan", detail: "Catat aktivitas pengangkutan sampah." },
        ],
      },
    }),
    withProject(2, {
      description:
        "Proyek akademik yang berfokus pada desain ulang website dan pengembangan dashboard SCM untuk meningkatkan pengalaman pengguna dan efisiensi operasional.",
      caseStudy: {
        features: [
          { title: "Desain ulang website", detail: "Antarmuka baru yang berfokus pada pengalaman pengguna." },
          { title: "Dashboard SCM", detail: "Data operasional rantai pasok dalam satu tampilan." },
        ],
      },
    }),
    withProject(3, {
      title: "Manajemen Rantai Pasok — Es Teh Indonesia",
      description:
        "Sistem manajemen rantai pasok untuk membantu mitra dan manajemen pusat menangani permintaan, inventaris, dan distribusi produk.",
      caseStudy: {
        features: [
          { title: "Permintaan stok", detail: "Mitra mengajukan permintaan stok ke manajemen pusat." },
          { title: "Inventaris", detail: "Pantau tingkat stok." },
          { title: "Distribusi produk", detail: "Koordinasi pengiriman ke mitra." },
        ],
      },
    }),
  ],
  templates: [
    {
      ...en.templates[0],
      description: "Landing page kedai kopi premium dengan desain editorial yang elegan, modern, dan bersih.",
    },
    {
      ...en.templates[1],
      description: "Landing page fasilitas kesehatan dengan tata letak organik yang kompleks dan bagian gelap yang elegan.",
    },
  ],
  process: [
    { title: "Discover", description: "Memahami tujuan bisnis, pengguna, dan batasannya." },
    { title: "Design", description: "Model data, arsitektur, dan alur UI sebelum menulis kode." },
    { title: "Build", description: "Sprint iteratif dengan kode yang bersih, teruji, dan di-review." },
    { title: "Ship", description: "Deploy, monitoring, dan serah terima beserta dokumentasi." },
  ],
};
```

- [ ] **Step 4: Write `src/content/ui.ts`**

```ts
export const uiEn = {
  nav: {
    work: "/work",
    about: "/about",
    stack: "/stack",
    contact: "/contact",
    search: "Search",
    resume: "Resume",
    hire: "Hire me",
    menu: "Open menu",
    closeMenu: "Close menu",
    switchLang: "Switch language to Indonesian",
    langLabel: "EN · ID",
    primary: "Primary",
  },
  intro: {
    aria: "Introduction",
    status: "Available for freelance & full-time",
    explore: "Explore work",
    github: "GitHub",
    downloadCv: "Download CV",
  },
  cube: { file: "stack.glb", drag: "drag ↻", aria: "Rotating 3D cube showing my tech stack" },
  location: { label: "based in", remote: "remote friendly", local: "local time" },
  gpa: { label: "GPA", aria: "GPA {value} out of {max}" },
  experience: { label: "experience" },
  stack: { aria: "Tech stack" },
  services: {
    kicker: "// what I do",
    heading: "Services",
    sub: "From a single landing page to a complete system — designed, built and deployed.",
  },
  featured: { kicker: "featured · {n}", readCase: "Read case study →", live: "Open live demo" },
  projects: { label: "more projects" },
  process: { kicker: "// how I work", heading: "From idea to production" },
  terminal: {
    aria: "Terminal summary",
    command: "npx hire-miftahul --now",
    skills: "✔ resolving skills ......... {n} found",
    projects: "✔ loading projects ........ {n} shipped",
    availability: "✔ checking availability ... open",
    ready: "→ ready. say hi at {email}",
  },
  contributions: {
    live: "live via GitHub API",
    sample: "sample activity",
    heading: "Shipping code, consistently.",
    total: "{n} contributions in the last year",
    aria: "GitHub contribution graph",
  },
  education: { label: "education" },
  certs: { label: "certifications", verify: "Verify ↗" },
  contact: {
    kicker: "// contact · usually replies within 24h",
    heading1: "Let's build",
    heading2: "something real.",
    cvPdf: "Download CV (PDF)",
    form: {
      name: "Name",
      namePh: "Your name",
      email: "Email",
      emailPh: "you@company.com",
      topicLabel: "I'm reaching out about",
      topics: {
        freelance: "Freelance project",
        fulltime: "Full-time role",
        collaboration: "Collaboration",
        hi: "Just saying hi",
      },
      message: "Message",
      messagePh: "Tell me about your project, timeline and budget…",
      privacy: "Protected by spam filter · no newsletter, ever",
      send: "Send message",
      sending: "Sending…",
      successTitle: "Message sent, {name}.",
      successBody: "Thanks for reaching out — I'll reply to {email} within 24 hours.",
      again: "Send another",
      honeypot: "Company",
      errors: {
        name_invalid: "Please enter your name (2–80 characters).",
        email_invalid: "Please enter a valid email address.",
        topic_invalid: "Please choose a topic.",
        message_invalid: "Message should be 10–2000 characters.",
        rate_limited: "Too many messages. Please try again in a few minutes.",
        send_failed: "Something went wrong while sending. Please email me directly.",
        not_configured: "The contact form is not configured yet. Please email me directly.",
      },
    },
  },
  palette: {
    label: "Command palette",
    placeholder: "Type a command or search…",
    empty: "No results.",
    groups: { navigation: "Navigation", projects: "Projects", actions: "Actions" },
    goWork: "Go to Work",
    goServices: "Go to Services",
    goExperience: "Go to Experience",
    goContact: "Go to Contact",
    caseStudy: "Case study: {title}",
    template: "Template: {name}",
    copyEmail: "Copy email address",
    copied: "Email copied",
    downloadCv: "Download CV (PDF)",
    switchLang: "Switch language: English / Indonesia",
    openGithub: "Open GitHub profile",
    openLinkedin: "Open LinkedIn profile",
    hint: "↑↓ navigate · ↵ open · esc close",
  },
  caseStudy: {
    back: "Back to work",
    kicker: "// case study",
    role: "role",
    timeline: "timeline",
    stack: "stack",
    team: "team",
    live: "Live ↗",
    source: "Source",
    problem: "the problem",
    myRole: "my role",
    architecture: "architecture",
    archHeading: "How it fits together",
    features: "key features",
    challenges: "challenges & solutions",
    problemLabel: "- problem:",
    solutionLabel: "+ solution:",
    results: "results",
    gallery: "gallery",
    next: "next project · {n}",
    screenshotAlt: "Screenshot of {title}",
  },
  footer: { rights: "© {year} Miftahul Huda", built: "Next.js · React Three Fiber · Motion" },
};

export type UiStrings = typeof uiEn;

export const uiId: UiStrings = {
  nav: {
    work: "/karya",
    about: "/tentang",
    stack: "/stack",
    contact: "/kontak",
    search: "Cari",
    resume: "CV",
    hire: "Rekrut saya",
    menu: "Buka menu",
    closeMenu: "Tutup menu",
    switchLang: "Ganti bahasa ke Inggris",
    langLabel: "ID · EN",
    primary: "Utama",
  },
  intro: {
    aria: "Perkenalan",
    status: "Terbuka untuk freelance & full-time",
    explore: "Lihat karya",
    github: "GitHub",
    downloadCv: "Unduh CV",
  },
  cube: { file: "stack.glb", drag: "geser ↻", aria: "Kubus 3D berputar berisi tech stack saya" },
  location: { label: "berbasis di", remote: "bisa remote", local: "waktu lokal" },
  gpa: { label: "IPK", aria: "IPK {value} dari {max}" },
  experience: { label: "pengalaman" },
  stack: { aria: "Tech stack" },
  services: {
    kicker: "// yang saya kerjakan",
    heading: "Layanan",
    sub: "Dari satu landing page hingga sistem lengkap — dirancang, dibangun, dan di-deploy.",
  },
  featured: { kicker: "unggulan · {n}", readCase: "Baca studi kasus →", live: "Buka demo" },
  projects: { label: "proyek lainnya" },
  process: { kicker: "// cara saya bekerja", heading: "Dari ide sampai production" },
  terminal: {
    aria: "Ringkasan terminal",
    command: "npx hire-miftahul --now",
    skills: "✔ memuat skill ............ {n} ditemukan",
    projects: "✔ memuat proyek ........... {n} rilis",
    availability: "✔ cek ketersediaan ........ tersedia",
    ready: "→ siap. sapa saya di {email}",
  },
  contributions: {
    live: "langsung dari GitHub API",
    sample: "contoh aktivitas",
    heading: "Konsisten menulis kode.",
    total: "{n} kontribusi dalam setahun terakhir",
    aria: "Grafik kontribusi GitHub",
  },
  education: { label: "pendidikan" },
  certs: { label: "sertifikasi", verify: "Verifikasi ↗" },
  contact: {
    kicker: "// kontak · biasanya dibalas dalam 24 jam",
    heading1: "Mari bangun",
    heading2: "sesuatu yang nyata.",
    cvPdf: "Unduh CV (PDF)",
    form: {
      name: "Nama",
      namePh: "Nama Anda",
      email: "Email",
      emailPh: "anda@perusahaan.com",
      topicLabel: "Saya menghubungi tentang",
      topics: {
        freelance: "Proyek freelance",
        fulltime: "Posisi full-time",
        collaboration: "Kolaborasi",
        hi: "Sekadar menyapa",
      },
      message: "Pesan",
      messagePh: "Ceritakan proyek, timeline, dan budget Anda…",
      privacy: "Dilindungi filter spam · tanpa newsletter",
      send: "Kirim pesan",
      sending: "Mengirim…",
      successTitle: "Pesan terkirim, {name}.",
      successBody: "Terima kasih — saya akan membalas ke {email} dalam 24 jam.",
      again: "Kirim lagi",
      honeypot: "Perusahaan",
      errors: {
        name_invalid: "Masukkan nama Anda (2–80 karakter).",
        email_invalid: "Masukkan alamat email yang valid.",
        topic_invalid: "Pilih salah satu topik.",
        message_invalid: "Pesan harus 10–2000 karakter.",
        rate_limited: "Terlalu banyak pesan. Coba lagi beberapa menit lagi.",
        send_failed: "Terjadi kesalahan saat mengirim. Silakan email saya langsung.",
        not_configured: "Form kontak belum dikonfigurasi. Silakan email saya langsung.",
      },
    },
  },
  palette: {
    label: "Command palette",
    placeholder: "Ketik perintah atau cari…",
    empty: "Tidak ada hasil.",
    groups: { navigation: "Navigasi", projects: "Proyek", actions: "Aksi" },
    goWork: "Ke bagian Karya",
    goServices: "Ke bagian Layanan",
    goExperience: "Ke bagian Pengalaman",
    goContact: "Ke bagian Kontak",
    caseStudy: "Studi kasus: {title}",
    template: "Template: {name}",
    copyEmail: "Salin alamat email",
    copied: "Email disalin",
    downloadCv: "Unduh CV (PDF)",
    switchLang: "Ganti bahasa: Indonesia / English",
    openGithub: "Buka profil GitHub",
    openLinkedin: "Buka profil LinkedIn",
    hint: "↑↓ pilih · ↵ buka · esc tutup",
  },
  caseStudy: {
    back: "Kembali ke karya",
    kicker: "// studi kasus",
    role: "peran",
    timeline: "waktu",
    stack: "stack",
    team: "tim",
    live: "Live ↗",
    source: "Kode",
    problem: "masalahnya",
    myRole: "peran saya",
    architecture: "arsitektur",
    archHeading: "Bagaimana semuanya terhubung",
    features: "fitur utama",
    challenges: "tantangan & solusi",
    problemLabel: "- masalah:",
    solutionLabel: "+ solusi:",
    results: "hasil",
    gallery: "galeri",
    next: "proyek berikutnya · {n}",
    screenshotAlt: "Tangkapan layar {title}",
  },
  footer: { rights: "© {year} Miftahul Huda", built: "Next.js · React Three Fiber · Motion" },
};
```

- [ ] **Step 5: Write `src/content/index.ts`**

```ts
import { en } from "./en";
import { id } from "./id";
import { uiEn, uiId, type UiStrings } from "./ui";
import type { Lang, PortfolioContent, Project } from "./types";

export * from "./types";
export type { UiStrings } from "./ui";

export function getContent(lang: Lang): PortfolioContent {
  return lang === "id" ? id : en;
}

export function getUi(lang: Lang): UiStrings {
  return lang === "id" ? uiId : uiEn;
}

export function getProject(lang: Lang, slug: string): Project | undefined {
  return getContent(lang).projects.find((p) => p.slug === slug);
}
```

- [ ] **Step 6: Write the failing content-integrity test `src/content/content.test.ts`**

```ts
// @vitest-environment node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getContent, getProject, getUi } from "./index";

const en = getContent("en");
const id = getContent("id");
const publicPath = (p: string) => join(process.cwd(), "public", decodeURI(p));

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

describe("content integrity", () => {
  it("en and id expose the same projects in the same order", () => {
    expect(id.projects.map((p) => p.slug)).toEqual(en.projects.map((p) => p.slug));
    id.projects.forEach((p, i) => {
      expect(p.image).toBe(en.projects[i].image);
      expect(p.technologies).toEqual(en.projects[i].technologies);
    });
  });

  it("slugs are unique kebab-case", () => {
    const slugs = en.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
  });

  it("exactly one project is featured", () => {
    expect(en.projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it("every referenced public file exists", () => {
    for (const p of en.projects) {
      expect(existsSync(publicPath(p.image)), p.image).toBe(true);
      for (const g of p.gallery ?? []) expect(existsSync(publicPath(g.src)), g.src).toBe(true);
    }
    if (en.personal.cvUrl) expect(existsSync(publicPath(en.personal.cvUrl))).toBe(true);
  });

  it("list lengths match between languages", () => {
    expect(id.services).toHaveLength(en.services.length);
    expect(id.experience).toHaveLength(en.experience.length);
    expect(id.process).toHaveLength(en.process.length);
    expect(id.certifications).toHaveLength(en.certifications.length);
  });

  it("ui strings have identical keys in both languages", () => {
    expect(keyPaths(getUi("id")).sort()).toEqual(keyPaths(getUi("en")).sort());
  });

  it("no placeholder brackets leak into content", () => {
    const text = JSON.stringify([en, id, getUi("en"), getUi("id")]);
    expect(text).not.toMatch(/\[[A-Z][^\]]*\]/);
  });

  it("getProject finds by slug", () => {
    expect(getProject("id", "sipresma")?.title).toBe("Sistem Informasi Prestasi Mahasiswa");
    expect(getProject("en", "nope")).toBeUndefined();
  });
});
```

- [ ] **Step 7: Run it**

Run: `npx vitest run src/content`
Expected: PASS. All content files exist from Steps 1–5. If "every referenced public file exists" fails, a thumbnail path is wrong. Check `ls public/thumbnails` and fix the path in `en.ts`.

- [ ] **Step 8: Write `src/lib/format.ts` with test `src/lib/format.test.ts`**

Test first:

```ts
import { describe, expect, it } from "vitest";
import { fmt, hostOf, pad } from "./format";

describe("fmt", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(fmt("Hi {name}, {n} new", { name: "Ana", n: 3 })).toBe("Hi Ana, 3 new");
    expect(fmt("{missing}", {})).toBe("{missing}");
  });
});
describe("pad", () => {
  it("pads to two digits", () => {
    expect(pad(1)).toBe("01");
    expect(pad(12)).toBe("12");
  });
});
describe("hostOf", () => {
  it("returns the host or empty string", () => {
    expect(hostOf("https://sipresma.pocari.id/")).toBe("sipresma.pocari.id");
    expect(hostOf(undefined)).toBe("");
    expect(hostOf("not a url")).toBe("");
  });
});
```

Run: `npx vitest run src/lib/format.test.ts`. Expected: FAIL (module not found).

Implementation:

```ts
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}
```

Run again. Expected: PASS.

- [ ] **Step 9: Write the failing LanguageContext test `src/context/LanguageContext.test.tsx`**

```tsx
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext";

function Probe() {
  const { lang, ui, content, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="nav">{ui.nav.work}</span>
      <span data-testid="degree">{content.education.degree}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
}

afterEach(() => vi.restoreAllMocks());

describe("LanguageProvider", () => {
  it("defaults to English", () => {
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("nav")).toHaveTextContent("/work");
  });

  it("toggles to Indonesian, persists, and sets <html lang>", async () => {
    render(<LanguageProvider><Probe /></LanguageProvider>);
    await userEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("nav")).toHaveTextContent("/karya");
    expect(screen.getByTestId("degree")).toHaveTextContent("Sarjana Terapan Sistem Informasi");
    expect(window.localStorage.getItem("portfolio-lang")).toBe("id");
    expect(document.documentElement.lang).toBe("id");
  });

  it("reads a stored language", () => {
    window.localStorage.setItem("portfolio-lang", "id");
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("id");
  });

  it("still toggles when localStorage throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<LanguageProvider><Probe /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "toggle" }));
    });
    expect(screen.getByTestId("lang")).toHaveTextContent("id");
    await userEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });
});
```

Run: `npx vitest run src/context`. Expected: FAIL (the old context imports the deleted shape).

- [ ] **Step 10: Rewrite `src/context/LanguageContext.tsx`**

```tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { getContent, getUi, type Lang, type PortfolioContent, type UiStrings } from "@/content";

const STORAGE_KEY = "portfolio-lang";
const CHANGE_EVENT = "portfolio:lang-change";

// Used only when localStorage is unavailable (private mode, blocked storage).
let memoryLang: Lang | null = null;

function readLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") return stored;
  } catch {
    // storage blocked: fall through to memory
  }
  return memoryLang ?? "en";
}

function writeLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
    memoryLang = null;
  } catch {
    memoryLang = lang;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLanguage: () => void;
  content: PortfolioContent;
  ui: UiStrings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);
  const toggleLanguage = useCallback(() => writeLang(lang === "en" ? "id" : "en"), [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLanguage, content: getContent(lang), ui: getUi(lang) }),
    [lang, setLang, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
```

Run: `npx vitest run src/context`. Expected: PASS (4 tests).

- [ ] **Step 11: Create the test helper `src/test/render.tsx`**

```tsx
import { render } from "@testing-library/react";
import { LanguageProvider } from "@/context/LanguageContext";

export function renderWithLanguage(el: React.ReactElement) {
  return render(<LanguageProvider>{el}</LanguageProvider>);
}
```

- [ ] **Step 12: Delete dead code**

```bash
git rm -r src/components/sections src/components/MobileNav.tsx src/components/ScrollToTopButton.tsx src/hooks/useMediaQuery.ts src/lib/data.ts src/lib/animations.ts inject_translations.js update_lang.js
cd src/components/ui && git rm AbstractShape.tsx CursorSpotlight.tsx GeometricArt.tsx Globe.tsx GridBackground.tsx Lanyard.tsx ScrollProgress.tsx TiltCard.tsx aurora-background.tsx background-beams.tsx background-ripple-effect.tsx badge.tsx button.tsx card.tsx flip-words.tsx glowing-effect.tsx hero-parallax.tsx infinite-moving-cards.tsx text-generate-effect.tsx typewriter-effect.tsx && cd ../../..
```

- [ ] **Step 13: Replace the portfolio layout and page with minimal versions**

`src/app/(portfolio)/layout.tsx`:

```tsx
import { LanguageProvider } from "@/context/LanguageContext";

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
```

`src/app/(portfolio)/page.tsx` (temporary until Task 5):

```tsx
export default function Home() {
  return <main className="p-8">Miftahul Huda</main>;
}
```

- [ ] **Step 14: Switch the templates to `motion/react`**

In both `src/app/(templates)/temacoffe/page.tsx` and `src/app/(templates)/temahospital/page.tsx`, replace
`import { motion } from "framer-motion";` with `import { motion } from "motion/react";`.

In `src/app/globals.css`, delete the line `@import "tw-animate-css";`.

- [ ] **Step 15: Remove unused dependencies**

Run: `grep -rnE "framer-motion|three-globe|react-fast-marquee|react-type-animation|next-themes|class-variance-authority|@radix-ui/react-slot|tw-animate-css" src || echo "none"`
Expected: `none`.

```bash
npm uninstall framer-motion three-globe react-fast-marquee react-type-animation next-themes class-variance-authority @radix-ui/react-slot tw-animate-css
```

- [ ] **Step 16: Full gate**

Run: `npm run lint && npm run test && npm run build`
Expected: all green. The build lists routes `/`, `/temacoffe`, `/temahospital`.

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "refactor: typed bilingual content model, new language context, remove dead code"
```

---

### Task 3: Theme, fonts, layout shell (Header, Footer, Lenis, BentoGrid/BentoCard)

**Files:**
- Rewrite: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(portfolio)/layout.tsx`
- Create: `src/lib/events.ts`, `src/components/icons.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Header.test.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/SmoothScroll.tsx`, `src/components/bento/BentoGrid.tsx`, `src/components/bento/BentoCard.tsx`, `src/components/bento/BentoCard.test.tsx`

**Interfaces:**
- Consumes: `useLanguage`, `fmt`
- Produces:
  - Tailwind tokens: `bg-ink-950 / -900 / -850 / -800 / -700 / -600 / -500 / -400 / -300 / -200 / -50`, `text-lime`, `bg-lime`, `text-danger`, `font-display`, `font-mono`, breakpoint `bento:` (900px), animations `animate-marquee animate-shimmer animate-float animate-caret animate-flow animate-spin-slow animate-cube animate-type`
  - `OPEN_PALETTE_EVENT: string`, `openCommandPalette(): void` (`@/lib/events`)
  - `GithubIcon`, `LinkedinIcon` (`@/components/icons`, props `React.SVGProps<SVGSVGElement>`)
  - `<BentoGrid>{children}</BentoGrid>`
  - `<BentoCard cols={3|4|5|6|7|8|12} rows={1|2|3|4} id? className? delay? aria-label?>`, plus `bentoSpan(cols, rows): string` for grid children that are not cards

- [ ] **Step 1: Rewrite `src/app/globals.css`**

Keep the template tokens (`/temacoffe` uses `text-primary`) and add the D theme:

```css
@import "tailwindcss";

/* Legacy tokens used by the /temacoffe and /temahospital templates */
:root {
  --background: #f8f6f0;
  --foreground: #1a1a1a;
  --primary: #f4a261;
  --secondary: #2a9d8f;
  --accent: #e76f51;
  --muted-foreground: #666666;
  --border: #e0dcd0;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}

@theme {
  --font-display: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;

  --breakpoint-bento: 56.25rem;

  --color-ink-950: #09090b;
  --color-ink-900: #0e0e11;
  --color-ink-850: #131316;
  --color-ink-800: #1a1a1e;
  --color-ink-700: #232328;
  --color-ink-600: #27272a;
  --color-ink-500: #3f3f46;
  --color-ink-400: #71717a;
  --color-ink-300: #a1a1aa;
  --color-ink-200: #d4d4d8;
  --color-ink-50: #f4f4f5;
  --color-lime: #a3e635;
  --color-danger: #f87171;

  --animate-marquee: marquee 28s linear infinite;
  --animate-shimmer: shimmer 3s ease-in-out infinite;
  --animate-float: float 6s ease-in-out infinite;
  --animate-caret: caret 1s step-end infinite;
  --animate-flow: flow 1s linear infinite;
  --animate-spin-slow: spin-slow 18s linear infinite;
  --animate-cube: cube 12s linear infinite;
  --animate-type: type 1.4s steps(24) 0.4s both;

  @keyframes marquee { to { transform: translateX(-50%); } }
  @keyframes shimmer { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  @keyframes caret { 50% { opacity: 0; } }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes flow { to { background-position: 24px 0; } }
  @keyframes cube {
    from { transform: rotateX(-22deg) rotateY(0deg); }
    to { transform: rotateX(-22deg) rotateY(360deg); }
  }
  @keyframes type { from { width: 0; } to { width: var(--type-ch, 24ch); } }
}

html:has(.theme-d) {
  background: var(--color-ink-950);
  color-scheme: dark;
}

.theme-d ::selection {
  background: rgb(163 230 53 / 0.35);
  color: var(--color-ink-50);
}

.theme-d :focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .theme-d *,
  .theme-d *::before,
  .theme-d *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Rewrite `src/app/layout.tsx` (fonts only; Task 11 adds metadata)**

```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Miftahul Huda — Full-Stack Developer",
  description:
    "Portfolio of Miftahul Huda, a Full-Stack Web Developer building secure, fast web systems with Laravel, React and Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create `src/lib/events.ts`**

```ts
export const OPEN_PALETTE_EVENT = "portfolio:open-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
```

- [ ] **Step 4: Create `src/components/icons.tsx`**

```tsx
type IconProps = React.SVGProps<SVGSVGElement>;

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
```

- [ ] **Step 5: Write the failing BentoCard test `src/components/bento/BentoCard.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BentoCard, bentoSpan } from "./BentoCard";

describe("BentoCard", () => {
  it("renders children inside a labelled section with span classes", () => {
    render(
      <BentoCard cols={8} rows={3} id="intro" aria-label="Intro">
        hello
      </BentoCard>,
    );
    const section = screen.getByRole("region", { name: "Intro" });
    expect(section).toHaveTextContent("hello");
    expect(section).toHaveAttribute("id", "intro");
    expect(section.className).toContain("bento:col-span-8");
    expect(section.className).toContain("bento:row-span-3");
  });

  it("bentoSpan returns static class names", () => {
    expect(bentoSpan(12, 1)).toBe("bento:col-span-12 bento:row-span-1");
  });
});
```

Run: `npx vitest run src/components/bento`. Expected: FAIL (module not found).

- [ ] **Step 6: Create `src/components/bento/BentoCard.tsx` and `BentoGrid.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const COLS = {
  3: "bento:col-span-3",
  4: "bento:col-span-4",
  5: "bento:col-span-5",
  6: "bento:col-span-6",
  7: "bento:col-span-7",
  8: "bento:col-span-8",
  12: "bento:col-span-12",
} as const;

const ROWS = {
  1: "bento:row-span-1",
  2: "bento:row-span-2",
  3: "bento:row-span-3",
  4: "bento:row-span-4",
} as const;

export type BentoCols = keyof typeof COLS;
export type BentoRows = keyof typeof ROWS;

export function bentoSpan(cols: BentoCols, rows: BentoRows): string {
  return `${COLS[cols]} ${ROWS[rows]}`;
}

interface BentoCardProps {
  cols: BentoCols;
  rows: BentoRows;
  id?: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  "aria-label"?: string;
}

export function BentoCard({ cols, rows, id, className, delay = 0, children, ...rest }: BentoCardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      aria-label={rest["aria-label"]}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn(
        "relative min-h-[220px] scroll-mt-24 overflow-hidden rounded-3xl border border-ink-700 bg-ink-850 p-7",
        "transition-[translate,border-color] duration-500 hover:-translate-y-1 hover:border-ink-500 bento:min-h-0",
        bentoSpan(cols, rows),
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
```

`src/components/bento/BentoGrid.tsx`:

```tsx
export function BentoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 bento:auto-rows-[150px] bento:grid-cols-12">{children}</div>;
}
```

Run: `npx vitest run src/components/bento`. Expected: PASS.

- [ ] **Step 7: Write the failing Header test `src/components/layout/Header.test.tsx`**

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { OPEN_PALETTE_EVENT } from "@/lib/events";
import { Header } from "./Header";

describe("Header", () => {
  it("renders primary nav links pointing at home anchors", () => {
    renderWithLanguage(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.querySelector('a[href="/#work"]')).toHaveTextContent("/work");
    expect(nav.querySelector('a[href="/#contact"]')).toHaveTextContent("/contact");
  });

  it("switches language", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getAllByRole("button", { name: "Switch language to Indonesian" })[0]);
    expect(screen.getByRole("navigation", { name: "Utama" })).toHaveTextContent("/karya");
  });

  it("search button dispatches the open-palette event", async () => {
    const spy = vi.fn();
    window.addEventListener(OPEN_PALETTE_EVENT, spy);
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getAllByRole("button", { name: /search/i })[0]);
    expect(spy).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_PALETTE_EVENT, spy);
  });

  it("hides the resume link when no CV is configured", () => {
    renderWithLanguage(<Header />);
    expect(screen.queryByRole("link", { name: /resume/i })).not.toBeInTheDocument();
  });

  it("toggles the mobile menu", async () => {
    renderWithLanguage(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/layout`. Expected: FAIL.

- [ ] **Step 8: Create `src/components/layout/Header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Menu, Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { openCommandPalette } from "@/lib/events";

const pill =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-ink-600 bg-ink-850 px-3.5 font-mono text-[13px] text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50";

export function Header() {
  const { ui, content, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const cv = content.personal.cvUrl;
  const links = [
    { href: "/#work", label: ui.nav.work },
    { href: "/#about", label: ui.nav.about },
    { href: "/#stack", label: ui.nav.stack },
    { href: "/#contact", label: ui.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink-950/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1312px] items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <Link href="/" className="text-[22px] font-extrabold tracking-[-0.03em]">
          miftahul<span className="text-lime">.dev</span>
        </Link>

        <nav aria-label={ui.nav.primary} className="hidden gap-7 font-mono text-[13px] bento:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink-300 transition-colors hover:text-ink-50">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 bento:flex">
          <button type="button" onClick={openCommandPalette} className={pill} aria-keyshortcuts="Control+K Meta+K">
            <Search className="size-[15px]" aria-hidden="true" />
            {ui.nav.search}
            <kbd className="rounded-md border border-ink-500 px-1.5 py-0.5 text-ink-200">⌘K</kbd>
          </button>
          <button type="button" onClick={toggleLanguage} aria-label={ui.nav.switchLang} className={pill}>
            {ui.nav.langLabel}
          </button>
          {cv && (
            <a href={cv} download className={`${pill} font-display text-[15px] font-semibold`}>
              <Download className="size-4" aria-hidden="true" />
              {ui.nav.resume}
            </a>
          )}
          <Link href="/#contact" className="inline-flex min-h-11 items-center rounded-xl bg-lime px-[18px] text-[15px] font-bold text-ink-950">
            {ui.nav.hire}
          </Link>
        </div>

        <div className="flex items-center gap-2 bento:hidden">
          <button type="button" onClick={openCommandPalette} className={pill} aria-label={ui.nav.search}>
            <Search className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={toggleLanguage} aria-label={ui.nav.switchLang} className={pill}>
            {ui.nav.langLabel}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.nav.closeMenu : ui.nav.menu}
            className={pill}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-ink-700 bg-ink-950 px-4 pb-6 pt-2 bento:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-ink-700 font-mono text-base text-ink-200">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            {cv && (
              <a href={cv} download className={pill}>
                <Download className="size-4" aria-hidden="true" />
                {ui.nav.resume}
              </a>
            )}
            <Link href="/#contact" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-xl bg-lime px-[18px] font-bold text-ink-950">
              {ui.nav.hire}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
```

Run: `npx vitest run src/components/layout`. Expected: PASS (5 tests).

- [ ] **Step 9: Create `src/components/layout/Footer.tsx` and `SmoothScroll.tsx`, then install Lenis**

```bash
npm install lenis
```

`Footer.tsx`:

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";

export function Footer() {
  const { ui } = useLanguage();
  return (
    <footer className="mx-auto flex max-w-[1312px] flex-wrap justify-between gap-3 px-4 pb-10 pt-7 font-mono text-xs text-ink-300 sm:px-8">
      <span>{fmt(ui.footer.rights, { year: new Date().getFullYear() })}</span>
      <span>{ui.footer.built}</span>
    </footer>
  );
}
```

`SmoothScroll.tsx`:

```tsx
"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -96 } }}>
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 10: Wire the portfolio layout**

`src/app/(portfolio)/layout.tsx`:

```tsx
import { LanguageProvider } from "@/context/LanguageContext";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LanguageProvider>
      <SmoothScroll>
        <div className="theme-d min-h-screen bg-ink-950 font-display text-ink-50">
          <Header />
          {children}
          <Footer />
        </div>
      </SmoothScroll>
    </LanguageProvider>
  );
}
```

- [ ] **Step 11: Full gate and visual sanity check**

Run: `npm run lint && npm run test && npm run build`
Expected: green.

Then run `npm run dev`, open http://localhost:3000, and check: the page is dark, the header shows `miftahul.dev`, and the fonts are Bricolage and Geist Mono. Open http://localhost:3000/temacoffe and check that it still looks like the cream template. Stop the dev server.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: dark theme tokens, fonts, header/footer, lenis, bento grid primitives"
```

---

### Task 4: Bento cards, part 1 (Intro, Location, GPA, Experience, Marquee, Services)

**Files:**
- Create: `src/hooks/useLocalTime.ts`, `src/hooks/useLocalTime.test.ts`, `src/components/bento/CountUp.tsx`, `src/components/bento/WireCube.tsx`, `src/components/bento/IntroCard.tsx`, `src/components/bento/LocationCard.tsx`, `src/components/bento/GpaCard.tsx`, `src/components/bento/ExperienceCard.tsx`, `src/components/bento/StackMarquee.tsx`, `src/components/bento/ServicesSection.tsx`, `src/components/bento/cards-part1.test.tsx`

**Interfaces:**
- Consumes: `BentoCard`, `bentoSpan`, `useLanguage`, `fmt`, `GithubIcon`
- Produces: `formatTime(date: Date, timeZone: string): string`, `useLocalTime(timeZone: string): string` ("" on the server), `<CountUp value decimals? duration? />`, `<WireCube speed? />`, and the components `IntroCard`, `LocationCard`, `GpaCard`, `ExperienceCard` (id `about`), `StackMarquee` (id `stack`), `ServicesSection` (a fragment of the heading plus 4 cards, id `services`). None of them take props.

- [ ] **Step 1: Write the failing test `src/hooks/useLocalTime.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { formatTime } from "./useLocalTime";

describe("formatTime", () => {
  it("formats 24h time in the given zone", () => {
    expect(formatTime(new Date("2026-10-12T03:05:00Z"), "Asia/Jakarta")).toBe("10:05");
    expect(formatTime(new Date("2026-10-12T17:30:00Z"), "Asia/Jakarta")).toBe("00:30");
  });
});
```

Run: `npx vitest run src/hooks`. Expected: FAIL.

- [ ] **Step 2: Implement `src/hooks/useLocalTime.ts`**

```ts
"use client";

import { useSyncExternalStore } from "react";

export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(date);
}

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

export function useLocalTime(timeZone: string): string {
  return useSyncExternalStore(
    subscribe,
    () => formatTime(new Date(), timeZone),
    () => "",
  );
}
```

Run: `npx vitest run src/hooks`. Expected: PASS.

- [ ] **Step 3: Create `CountUp.tsx` and `WireCube.tsx`**

`src/components/bento/CountUp.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  value: number;
  decimals?: number;
  duration?: number;
}

/** Renders the final value (SSR/no-JS safe), then counts up from 0 once visible. */
export function CountUp({ value, decimals = 0, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, decimals, duration]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}
```

`src/components/bento/WireCube.tsx`:

```tsx
const FACES = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)"];

export function WireCube({ speed = 10 }: { speed?: number }) {
  return (
    <div aria-hidden="true" className="size-11 [perspective:300px]">
      <div className="relative size-full animate-cube [transform-style:preserve-3d]" style={{ animationDuration: `${speed}s` }}>
        {FACES.map((t) => (
          <span key={t} className="absolute inset-0 border-[1.5px] border-lime" style={{ transform: `${t} translateZ(22px)` }} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write the failing card tests `src/components/bento/cards-part1.test.tsx`**

```tsx
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { IntroCard } from "./IntroCard";
import { GpaCard } from "./GpaCard";
import { ExperienceCard } from "./ExperienceCard";
import { StackMarquee } from "./StackMarquee";
import { ServicesSection } from "./ServicesSection";
import { LocationCard } from "./LocationCard";

describe("bento cards part 1", () => {
  it("IntroCard shows the name as h1, CTAs, and no CV link when cvUrl is unset", () => {
    renderWithLanguage(<IntroCard />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Miftahul Huda");
    expect(screen.getByRole("link", { name: /explore work/i })).toHaveAttribute("href", "/#work");
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/MiftahulH23");
    expect(screen.queryByRole("link", { name: /download cv/i })).not.toBeInTheDocument();
  });

  it("GpaCard exposes an accessible GPA label", () => {
    renderWithLanguage(<GpaCard />);
    expect(screen.getByRole("img", { name: "GPA 3.80 out of 4.00" })).toBeInTheDocument();
    expect(screen.getByText("3.80")).toBeInTheDocument();
  });

  it("ExperienceCard lists both roles and has the about anchor", () => {
    renderWithLanguage(<ExperienceCard />);
    expect(screen.getByText("Laboratory Teaching Assistant")).toBeInTheDocument();
    expect(screen.getByText("PT Bank Riau Kepri Syariah")).toBeInTheDocument();
    expect(document.getElementById("about")).not.toBeNull();
  });

  it("StackMarquee lists every skill once for screen readers", () => {
    renderWithLanguage(<StackMarquee />);
    const list = screen.getByRole("list", { name: "Tech stack" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(22);
    expect(within(list).getByText("Laravel")).toBeInTheDocument();
  });

  it("ServicesSection renders the heading and four services", () => {
    renderWithLanguage(<ServicesSection />);
    expect(screen.getByRole("heading", { level: 2, name: "Services" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText("Mobile Development")).toBeInTheDocument();
  });

  it("LocationCard shows the location", () => {
    renderWithLanguage(<LocationCard />);
    expect(screen.getByText("Riau, Indonesia")).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/bento/cards-part1.test.tsx`. Expected: FAIL.

- [ ] **Step 5: Implement `IntroCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GithubIcon } from "@/components/icons";
import { BentoCard } from "./BentoCard";

const ghost = "inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] border border-ink-500 px-[22px] font-semibold transition-colors hover:border-ink-300";

export function IntroCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();
  const p = content.personal;
  const words = p.name.split(" ");

  return (
    <BentoCard cols={8} rows={3} aria-label={ui.intro.aria} className="flex flex-col justify-between gap-8 p-8 bento:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-lime" />
          <span className="relative size-2.5 rounded-full bg-lime" />
        </span>
        <span className="font-mono text-[13px] text-ink-200">
          {ui.intro.status} · {p.location}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        <h1 className="text-[clamp(52px,6.4vw,96px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
          <span className="animate-caret text-lime" aria-hidden="true">
            _
          </span>
        </h1>
        <p className="max-w-[620px] text-[21px] leading-[1.45] text-ink-300">
          {p.tagline.lead} <span className="text-ink-50">{p.tagline.highlight}</span> {p.tagline.tail}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/#work" className="inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] bg-ink-50 px-6 font-bold text-ink-950">
          {ui.intro.explore}
          <ArrowUpRight className="size-[18px]" aria-hidden="true" />
        </Link>
        <a href={p.socials.github} target="_blank" rel="noreferrer" className={ghost}>
          <GithubIcon className="size-[18px]" />
          {ui.intro.github}
        </a>
        {p.cvUrl && (
          <a href={p.cvUrl} download className={ghost}>
            <Download className="size-[18px]" aria-hidden="true" />
            {ui.intro.downloadCv}
          </a>
        )}
      </div>
    </BentoCard>
  );
}
```

- [ ] **Step 6: Implement `LocationCard.tsx` and `GpaCard.tsx`**

`LocationCard.tsx`:

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useLocalTime } from "@/hooks/useLocalTime";
import { BentoCard } from "./BentoCard";

export function LocationCard() {
  const { content, ui } = useLanguage();
  const p = content.personal;
  const time = useLocalTime(p.timezone);

  return (
    <BentoCard cols={3} rows={2} delay={0.1} className="flex flex-col justify-between">
      <span className="font-mono text-xs text-ink-300">{ui.location.label}</span>
      <div aria-hidden="true" className="absolute -right-10 -top-10 size-[180px] overflow-hidden rounded-full border border-ink-600">
        <div className="absolute inset-0 animate-spin-slow [animation-duration:6s]">
          <div className="absolute left-1/2 top-0 h-1/2 w-1/2 bg-[conic-gradient(from_0deg_at_0%_100%,rgba(163,230,53,0)_0deg,rgba(163,230,53,.28)_80deg,rgba(163,230,53,0)_90deg)]" />
        </div>
        <span className="absolute left-[48%] top-[58%] size-2 rounded-full bg-lime" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[30px] font-bold tracking-[-0.02em]">{p.location}</span>
        <span className="font-mono text-[13px] text-ink-300">
          {p.timezoneLabel} · {time ? `${time} ${ui.location.local}` : ui.location.remote}
        </span>
      </div>
    </BentoCard>
  );
}
```

`GpaCard.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";
import { CountUp } from "./CountUp";

const R = 48;
const C = 2 * Math.PI * R;

export function GpaCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();
  const { gpa, gpaMax, institution } = content.education;
  const offset = C * (1 - gpa / gpaMax);
  const label = fmt(ui.gpa.aria, { value: gpa.toFixed(2), max: gpaMax.toFixed(2) });

  return (
    <BentoCard cols={3} rows={2} delay={0.15} className="flex items-center gap-5">
      <div role="img" aria-label={label} className="relative size-[120px] shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#27272A" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#A3E635"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduce ? false : { strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: offset }}
            style={reduce ? { strokeDashoffset: offset } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </svg>
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[26px] font-extrabold">
          <CountUp value={gpa} decimals={2} />
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xl font-bold">{ui.gpa.label}</span>
        <span className="text-sm leading-snug text-ink-300">{institution}</span>
      </div>
    </BentoCard>
  );
}
```

- [ ] **Step 7: Implement `ExperienceCard.tsx`, `StackMarquee.tsx`, `ServicesSection.tsx`**

`ExperienceCard.tsx`:

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";

export function ExperienceCard() {
  const { content, ui } = useLanguage();
  return (
    <BentoCard cols={6} rows={2} id="about" delay={0.2} className="flex flex-col gap-[18px]">
      <span className="font-mono text-xs text-ink-300">{ui.experience.label}</span>
      <ol className="flex flex-col gap-[18px]">
        {content.experience.map((e, i) => (
          <li key={e.company + e.position} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn("mt-[7px] size-2.5 shrink-0 rounded-full", i === 0 ? "bg-lime" : "border-2 border-ink-400")}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[19px] font-bold">{e.position}</span>
              <span className="text-[15px] text-ink-300">{e.company}</span>
            </div>
            <span className="font-mono text-xs text-ink-300">{e.duration}</span>
          </li>
        ))}
      </ol>
    </BentoCard>
  );
}
```

`StackMarquee.tsx`:

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BentoCard } from "./BentoCard";

export function StackMarquee() {
  const { content, ui } = useLanguage();
  const items = content.skills.flatMap((g) => g.items);

  return (
    <BentoCard cols={12} rows={1} id="stack" delay={0.25} className="flex min-h-24 items-center p-0">
      <ul aria-label={ui.stack.aria} className="sr-only">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee gap-14 whitespace-nowrap pl-7 text-[34px] font-bold tracking-[-0.02em] text-ink-500 hover:[animation-play-state:paused]"
      >
        {[...items, ...items].map((s, i) => (
          <span key={i} className="inline-flex items-center gap-14">
            {s}
            <span className="text-[22px] text-lime">✦</span>
          </span>
        ))}
      </div>
    </BentoCard>
  );
}
```

`ServicesSection.tsx`:

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BentoCard, bentoSpan } from "./BentoCard";
import { WireCube } from "./WireCube";

export function ServicesSection() {
  const { content, ui } = useLanguage();
  return (
    <>
      <div id="services" className={`flex scroll-mt-24 flex-wrap items-end justify-between gap-4 px-1 pb-2 pt-10 bento:pt-0 ${bentoSpan(12, 1)}`}>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[13px] text-lime">{ui.services.kicker}</span>
          <h2 className="text-[52px] font-extrabold leading-none tracking-[-0.04em]">{ui.services.heading}</h2>
        </div>
        <p className="max-w-[420px] text-[17px] text-ink-300">{ui.services.sub}</p>
      </div>
      {content.services.map((s, i) => (
        <BentoCard key={s.number} cols={3} rows={2} delay={i * 0.06} className="flex flex-col gap-3.5">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[13px] text-ink-300">{s.number}</span>
            <WireCube speed={9 + i * 2} />
          </div>
          <h3 className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">{s.title}</h3>
          <p className="flex-1 text-sm leading-normal text-ink-300">{s.description}</p>
          <span className="font-mono text-[11px] text-ink-200">{s.tags.join(" · ")}</span>
        </BentoCard>
      ))}
    </>
  );
}
```

- [ ] **Step 8: Run tests**

Run: `npx vitest run src/components/bento src/hooks`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: intro, location, gpa, experience, marquee and services bento cards"
```

---

### Task 5: Bento cards, part 2 (Featured, Projects, Process, Terminal, Education, Certifications) and Home assembly

**Files:**
- Create: `src/components/ui/TiltCard.tsx`, `src/components/bento/BrowserBar.tsx`, `src/components/bento/FeaturedProject.tsx`, `src/components/bento/ProjectList.tsx`, `src/components/bento/ProcessCard.tsx`, `src/components/bento/TerminalCard.tsx`, `src/components/bento/EducationRow.tsx`, `src/components/bento/cards-part2.test.tsx`
- Rewrite: `src/app/(portfolio)/page.tsx`

**Interfaces:**
- Consumes: the Task 4 cards, `BentoGrid`, `BentoCard`, `fmt`, `pad`, `hostOf`, `useLanguage`
- Produces: `<TiltCard max? className?>`, `<BrowserBar url />`, and `FeaturedProject` (id `work`), `ProjectList`, `ProcessCard`, `TerminalCard`, `EducationRow` (renders `EducationCard` plus `CertificationsCard`). `EducationRow` also exports `EducationCard({ wide })` and `CertificationsCard({ certifications })` for tests.

- [ ] **Step 1: Write the failing tests `src/components/bento/cards-part2.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { LanguageProvider } from "@/context/LanguageContext";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectList } from "./ProjectList";
import { ProcessCard } from "./ProcessCard";
import { TerminalCard } from "./TerminalCard";
import { CertificationsCard, EducationCard } from "./EducationRow";

describe("bento cards part 2", () => {
  it("FeaturedProject links to its case study and live demo", () => {
    renderWithLanguage(<FeaturedProject />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Student Achievement Information System");
    expect(screen.getByRole("link", { name: /read case study/i })).toHaveAttribute("href", "/projects/sipresma");
    expect(screen.getByRole("link", { name: "Open live demo" })).toHaveAttribute("href", "https://sipresma.pocari.id/");
    expect(document.getElementById("work")).not.toBeNull();
  });

  it("ProjectList shows only non-featured projects with case-study links", () => {
    renderWithLanguage(<ProjectList />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/projects/lps", "/projects/indogrosir-scm", "/projects/esteh-scm"]);
  });

  it("ProcessCard renders four ordered steps", () => {
    renderWithLanguage(<ProcessCard />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Ship")).toBeInTheDocument();
  });

  it("TerminalCard computes counts from content", () => {
    renderWithLanguage(<TerminalCard />);
    expect(screen.getByText(/22 found/)).toBeInTheDocument();
    expect(screen.getByText(/4 shipped/)).toBeInTheDocument();
    expect(screen.getByText(/miftahulh942@gmail\.com/)).toBeInTheDocument();
  });

  it("CertificationsCard renders nothing when the list is empty", () => {
    const { container } = render(
      <LanguageProvider>
        <CertificationsCard certifications={[]} />
      </LanguageProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("CertificationsCard renders verify links only when a url exists", () => {
    renderWithLanguage(
      <CertificationsCard
        certifications={[
          { name: "Cert A", issuer: "Org", year: "2025", url: "https://example.com/a" },
          { name: "Cert B", issuer: "Org", year: "2024" },
        ]}
      />,
    );
    expect(screen.getByText("Cert A").closest("a")).toHaveAttribute("href", "https://example.com/a");
    expect(screen.getByText("Cert B").closest("a")).toBeNull();
    expect(screen.getAllByText("Verify ↗")).toHaveLength(1);
  });

  it("EducationCard spans 12 columns when wide", () => {
    renderWithLanguage(<EducationCard wide />);
    expect(screen.getByText("Politeknik Caltex Riau").closest("section")?.className).toContain("bento:col-span-12");
  });
});
```

Run: `npx vitest run src/components/bento/cards-part2.test.tsx`. Expected: FAIL.

- [ ] **Step 2: Implement `src/components/ui/TiltCard.tsx` and `src/components/bento/BrowserBar.tsx`**

```tsx
"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
}

export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 150, damping: 18 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  }

  function onPointerLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

`BrowserBar.tsx`:

```tsx
export function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex h-[30px] shrink-0 items-center gap-1.5 border-b border-ink-500/60 px-3">
      <span className="size-[9px] rounded-full bg-ink-500" />
      <span className="size-[9px] rounded-full bg-ink-500" />
      <span className="size-[9px] rounded-full bg-ink-500" />
      {url && <span className="ml-2.5 font-mono text-[11px] text-ink-300">{url}</span>}
    </div>
  );
}
```

- [ ] **Step 3: Implement `FeaturedProject.tsx` and `ProjectList.tsx`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt, hostOf, pad } from "@/lib/format";
import { TiltCard } from "@/components/ui/TiltCard";
import { BentoCard } from "./BentoCard";
import { BrowserBar } from "./BrowserBar";

export function FeaturedProject() {
  const { content, ui } = useLanguage();
  const project = content.projects.find((p) => p.featured) ?? content.projects[0];
  const index = content.projects.indexOf(project) + 1;

  return (
    <BentoCard cols={8} rows={4} id="work" className="flex flex-col gap-5 p-8 bento:p-9">
      <div className="flex items-start justify-between gap-3">
        <div className="flex max-w-[560px] flex-col gap-2">
          <span className="font-mono text-xs text-lime">{fmt(ui.featured.kicker, { n: pad(index) })}</span>
          <h2 className="text-[clamp(28px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{project.title}</h2>
        </div>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            aria-label={ui.featured.live}
            className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-lime text-ink-950"
          >
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </a>
        )}
      </div>

      <TiltCard className="flex min-h-[260px] flex-1 items-center justify-center rounded-[18px] border border-ink-700 bg-ink-900 p-6">
        <div className="w-[82%] animate-float overflow-hidden rounded-xl border border-ink-500/60 bg-[#1C1C21] shadow-[0_40px_80px_rgba(0,0,0,.55)]">
          <BrowserBar url={hostOf(project.demo)} />
          <div className="relative aspect-[16/10]">
            <Image
              src={project.image}
              alt={fmt(ui.caseStudy.screenshotAlt, { title: project.title })}
              fill
              sizes="(min-width: 900px) 600px, 90vw"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </TiltCard>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-200">
        {project.technologies.map((t) => (
          <span key={t} className="rounded-full bg-[#1C1C21] px-3 py-1.5">
            {t}
          </span>
        ))}
        <Link href={`/projects/${project.slug}`} className="ml-auto font-display text-base font-bold text-lime">
          {ui.featured.readCase}
        </Link>
      </div>
    </BentoCard>
  );
}
```

`ProjectList.tsx`:

```tsx
"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { BentoCard } from "./BentoCard";

export function ProjectList() {
  const { content, ui } = useLanguage();
  const others = content.projects.filter((p) => !p.featured);

  return (
    <BentoCard cols={4} rows={4} delay={0.05} className="flex flex-col gap-3">
      <span className="font-mono text-xs text-ink-300">{ui.projects.label}</span>
      {others.map((p) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="flex flex-1 flex-col justify-between gap-2.5 rounded-2xl border border-ink-600 bg-ink-800 p-5 transition-colors hover:border-ink-500"
        >
          <span className="flex justify-between gap-3">
            <span className="font-mono text-xs text-lime">{pad(content.projects.indexOf(p) + 1)}</span>
            <ArrowUpRight className="size-4 text-ink-300" aria-hidden="true" />
          </span>
          <span className="text-[19px] font-bold leading-tight">{p.title}</span>
          <span className="font-mono text-xs text-ink-300">{p.technologies.slice(0, 3).join(" · ")}</span>
        </Link>
      ))}
    </BentoCard>
  );
}
```

- [ ] **Step 4: Implement `ProcessCard.tsx` and `TerminalCard.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { BentoCard } from "./BentoCard";

export function ProcessCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();

  return (
    <BentoCard cols={12} rows={2} className="flex flex-col gap-6 p-8 bento:p-9">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs text-lime">{ui.process.kicker}</span>
        <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">{ui.process.heading}</h2>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-1.5 top-1.5 hidden h-0.5 bg-ink-600 bento:block" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-1.5 top-1.5 hidden h-0.5 origin-left bg-lime bento:block"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
        />
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 bento:grid-cols-4">
          {content.process.map((s, i) => (
            <li key={s.title} className="relative flex flex-col gap-2.5 pt-8">
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-0 size-3.5 rounded-full border-2 border-lime"
                initial={reduce ? false : { backgroundColor: "#09090B" }}
                whileInView={{ backgroundColor: "#A3E635" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.35 }}
              />
              <span className="font-mono text-xs text-ink-300">{pad(i + 1)}</span>
              <span className="text-[21px] font-extrabold">{s.title}</span>
              <span className="text-sm leading-normal text-ink-300">{s.description}</span>
            </li>
          ))}
        </ol>
      </div>
    </BentoCard>
  );
}
```

`TerminalCard.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";

export function TerminalCard() {
  const { content, ui } = useLanguage();
  const reduce = useReducedMotion();
  const skills = content.skills.reduce((n, g) => n + g.items.length, 0);
  const lines = [
    fmt(ui.terminal.skills, { n: skills }),
    fmt(ui.terminal.projects, { n: content.projects.length }),
    ui.terminal.availability,
    fmt(ui.terminal.ready, { email: content.personal.email }),
  ];

  return (
    <BentoCard cols={6} rows={3} aria-label={ui.terminal.aria} className="bg-[#050506] font-mono text-[15px] leading-[1.9] text-ink-200">
      <div aria-hidden="true" className="mb-[18px] flex gap-[7px]">
        <span className="size-[11px] rounded-full bg-[#FF5F57]" />
        <span className="size-[11px] rounded-full bg-[#FEBC2E]" />
        <span className="size-[11px] rounded-full bg-[#28C840]" />
      </div>
      <div className="flex gap-2.5 whitespace-nowrap">
        <span className="text-lime" aria-hidden="true">❯</span>
        <span
          className="inline-block animate-type overflow-hidden"
          style={{ "--type-ch": `${ui.terminal.command.length}ch` } as React.CSSProperties}
        >
          {ui.terminal.command}
        </span>
        <span aria-hidden="true" className="h-5 w-[9px] animate-caret self-center bg-ink-50" />
      </div>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          className={i === lines.length - 1 ? "text-ink-50" : "text-ink-300"}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 + i * 0.35, duration: 0.4 }}
        >
          {line}
        </motion.p>
      ))}
    </BentoCard>
  );
}
```

- [ ] **Step 5: Implement `EducationRow.tsx`**

```tsx
"use client";

import { Award, GraduationCap } from "lucide-react";
import type { Certification } from "@/content";
import { useLanguage } from "@/context/LanguageContext";
import { BentoCard } from "./BentoCard";

export function EducationCard({ wide }: { wide: boolean }) {
  const { content, ui } = useLanguage();
  const e = content.education;
  return (
    <BentoCard cols={wide ? 12 : 5} rows={2} id="education" className="flex flex-col justify-between gap-3.5">
      <span className="font-mono text-xs text-ink-300">{ui.education.label}</span>
      <div className="flex items-center gap-[18px]">
        <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-[18px] border border-ink-500 bg-[#1C1C21] text-lime">
          <GraduationCap className="size-[30px]" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[21px] font-extrabold">{e.institution}</span>
          <span className="text-[15px] text-ink-300">{e.degree}</span>
        </div>
      </div>
      <div className="flex justify-between gap-3 border-t border-ink-600 pt-3.5 font-mono text-[13px] text-ink-200">
        <span>{e.duration}</span>
        <span className="text-lime">
          {ui.gpa.label} {e.gpa.toFixed(2)}
        </span>
      </div>
    </BentoCard>
  );
}

export function CertificationsCard({ certifications }: { certifications: Certification[] }) {
  const { ui } = useLanguage();
  if (certifications.length === 0) return null;
  const row = "flex items-center gap-3.5 rounded-[14px] border border-ink-600 bg-ink-800 px-3.5 py-3";

  return (
    <BentoCard cols={7} rows={2} id="certs" className="flex flex-col gap-2.5 overflow-y-auto">
      <span className="font-mono text-xs text-ink-300">{ui.certs.label}</span>
      {certifications.map((c) => {
        const body = (
          <>
            <span aria-hidden="true" className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-lime text-ink-950">
              <Award className="size-[18px]" />
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-base font-bold">{c.name}</span>
              <span className="text-[13px] text-ink-300">
                {c.issuer} · {c.year}
              </span>
            </span>
            {c.url && <span className="font-mono text-xs text-ink-200">{ui.certs.verify}</span>}
          </>
        );
        return c.url ? (
          <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className={`${row} transition-colors hover:border-ink-500`}>
            {body}
          </a>
        ) : (
          <div key={c.name} className={row}>
            {body}
          </div>
        );
      })}
    </BentoCard>
  );
}

export function EducationRow() {
  const { content } = useLanguage();
  const certs = content.certifications;
  return (
    <>
      <EducationCard wide={certs.length === 0} />
      <CertificationsCard certifications={certs} />
    </>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/components/bento`
Expected: PASS.

- [ ] **Step 7: Assemble `src/app/(portfolio)/page.tsx`**

```tsx
import { BentoGrid } from "@/components/bento/BentoGrid";
import { EducationRow } from "@/components/bento/EducationRow";
import { ExperienceCard } from "@/components/bento/ExperienceCard";
import { FeaturedProject } from "@/components/bento/FeaturedProject";
import { GpaCard } from "@/components/bento/GpaCard";
import { IntroCard } from "@/components/bento/IntroCard";
import { LocationCard } from "@/components/bento/LocationCard";
import { ProcessCard } from "@/components/bento/ProcessCard";
import { ProjectList } from "@/components/bento/ProjectList";
import { ServicesSection } from "@/components/bento/ServicesSection";
import { StackMarquee } from "@/components/bento/StackMarquee";
import { TerminalCard } from "@/components/bento/TerminalCard";

export default function Home() {
  return (
    <main id="top" className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <BentoGrid>
        <IntroCard />
        {/* Task 6: <StackCubeCard /> */}
        <LocationCard />
        <GpaCard />
        <ExperienceCard />
        <StackMarquee />
        <ServicesSection />
        <FeaturedProject />
        <ProjectList />
        <ProcessCard />
        <TerminalCard />
        {/* Task 7: <ContributionsCard data={contributions} /> */}
        <EducationRow />
        {/* Task 8: <ContactSection /> */}
      </BentoGrid>
    </main>
  );
}
```

- [ ] **Step 8: Full gate and visual check**

Run: `npm run lint && npm run test && npm run build`
Expected: green.

Run `npm run dev` and compare http://localhost:3000 at 1440px with the mockup frame *D — Command Center*. Check that the card order and spans match and that nothing is clipped. Then switch DevTools to 390px and check that the cards stack in one column with no horizontal scroll. Stop the server.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: featured/projects/process/terminal/education cards and home bento assembly"
```

---

### Task 6: 3D stack cube (R3F) with CSS fallback

**Files:**
- Create: `src/hooks/useCanUseWebGL.ts`, `src/hooks/useCanUseWebGL.test.ts`, `src/components/three/StackCube.tsx`, `src/components/three/StackCubeCss.tsx`, `src/components/bento/StackCubeCard.tsx`, `src/components/bento/StackCubeCard.test.tsx`
- Modify: `src/app/(portfolio)/page.tsx` (replace the Task 6 comment)

**Interfaces:**
- Consumes: `BentoCard`, `useLanguage`, `content.cubeFaces: string[]`
- Produces: `detectWebGL(): boolean`, `useCanUseWebGL(): boolean` (false on the server, below 900px, under reduced motion, or without WebGL), `<StackCubeCss faces: string[] />`, default export `StackCube({ faces: string[]; active: boolean })`, `StackCubeCard`

- [ ] **Step 1: Write the failing test `src/hooks/useCanUseWebGL.test.ts`**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { detectWebGL } from "./useCanUseWebGL";

afterEach(() => vi.restoreAllMocks());

describe("detectWebGL", () => {
  it("is false when no context can be created", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(detectWebGL()).toBe(false);
  });

  it("is false when context creation throws", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("GPU blocked");
    });
    expect(detectWebGL()).toBe(false);
  });

  it("is true when a webgl context exists", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as RenderingContext);
    expect(detectWebGL()).toBe(true);
  });
});
```

Run: `npx vitest run src/hooks/useCanUseWebGL.test.ts`. Expected: FAIL.

- [ ] **Step 2: Implement `src/hooks/useCanUseWebGL.ts`**

```ts
"use client";

import { useSyncExternalStore } from "react";

const WIDE = "(min-width: 900px)";
const REDUCE = "(prefers-reduced-motion: reduce)";
let cachedWebGL: boolean | null = null;

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function snapshot(): boolean {
  if (!window.matchMedia(WIDE).matches || window.matchMedia(REDUCE).matches) return false;
  if (cachedWebGL === null) cachedWebGL = detectWebGL();
  return cachedWebGL;
}

function subscribe(callback: () => void) {
  const wide = window.matchMedia(WIDE);
  const reduce = window.matchMedia(REDUCE);
  wide.addEventListener("change", callback);
  reduce.addEventListener("change", callback);
  return () => {
    wide.removeEventListener("change", callback);
    reduce.removeEventListener("change", callback);
  };
}

export function useCanUseWebGL(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
```

Run: `npx vitest run src/hooks/useCanUseWebGL.test.ts`. Expected: PASS.

- [ ] **Step 3: Implement `src/components/three/StackCubeCss.tsx`**

```tsx
const TRANSFORMS = [
  "rotateY(0deg)",
  "rotateY(90deg)",
  "rotateY(180deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];

export function StackCubeCss({ faces }: { faces: string[] }) {
  return (
    <div className="flex size-full items-center justify-center [perspective:900px]">
      <div className="relative size-[170px] animate-cube [transform-style:preserve-3d]">
        {faces.slice(0, 6).map((label, i) => (
          <div
            key={label}
            className={
              i === 0
                ? "absolute inset-0 flex items-center justify-center border border-lime bg-lime font-mono text-[17px] font-medium text-ink-950"
                : "absolute inset-0 flex items-center justify-center border border-ink-500 bg-[rgba(24,24,28,0.86)] font-mono text-[17px] font-medium text-ink-50"
            }
            style={{ transform: `${TRANSFORMS[i]} translateZ(85px)` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement `src/components/three/StackCube.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CanvasTexture, type Mesh, MeshStandardMaterial, SRGBColorSpace } from "three";

const ACCENT = "#A3E635";

function faceTexture(label: string, accent: boolean, fontFamily: string): CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = accent ? ACCENT : "#18181C";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = accent ? ACCENT : "#3F3F46";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, size - 12, size - 12);
    ctx.fillStyle = accent ? "#09090B" : "#F4F4F5";
    ctx.font = `500 64px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Cube({ faces, fontFamily }: { faces: string[]; fontFamily: string }) {
  const ref = useRef<Mesh>(null);
  const materials = useMemo(
    () =>
      faces.slice(0, 6).map(
        (label, i) => new MeshStandardMaterial({ map: faceTexture(label, i === 0, fontFamily), roughness: 0.35, metalness: 0.1 }),
      ),
    [faces, fontFamily],
  );

  useEffect(
    () => () => {
      for (const m of materials) {
        m.map?.dispose();
        m.dispose();
      }
    },
    [materials],
  );

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  return (
    <mesh ref={ref} rotation={[-0.35, 0.6, 0]} material={materials}>
      <boxGeometry args={[1.8, 1.8, 1.8]} />
    </mesh>
  );
}

export default function StackCube({ faces, active }: { faces: string[]; active: boolean }) {
  const [fontFamily, setFontFamily] = useState("monospace");

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
      setFontFamily(family || "monospace");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Cube faces={faces} fontFamily={fontFamily} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />
    </Canvas>
  );
}
```

- [ ] **Step 5: Write the failing card test `src/components/bento/StackCubeCard.test.tsx`**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

vi.mock("@/hooks/useCanUseWebGL", () => ({ useCanUseWebGL: () => false, detectWebGL: () => false }));

import { StackCubeCard } from "./StackCubeCard";

describe("StackCubeCard", () => {
  it("renders the CSS cube with all six faces when WebGL is not usable", () => {
    renderWithLanguage(<StackCubeCard />);
    expect(screen.getByRole("img", { name: "Rotating 3D cube showing my tech stack" })).toBeInTheDocument();
    for (const face of ["React", "Laravel", "Next.js", "Node.js", "TypeScript", "MySQL"]) {
      expect(screen.getByText(face)).toBeInTheDocument();
    }
    expect(screen.queryByText("drag ↻")).not.toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/bento/StackCubeCard.test.tsx`. Expected: FAIL.

- [ ] **Step 6: Implement `src/components/bento/StackCubeCard.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { useCanUseWebGL } from "@/hooks/useCanUseWebGL";
import { StackCubeCss } from "@/components/three/StackCubeCss";
import { BentoCard } from "./BentoCard";

const StackCube = dynamic(() => import("@/components/three/StackCube"), { ssr: false, loading: () => null });

export function StackCubeCard() {
  const { content, ui } = useLanguage();
  const webgl = useCanUseWebGL();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "200px" });
  const visible = useInView(ref);

  return (
    <BentoCard cols={4} rows={3} delay={0.1} className="flex items-center justify-center bg-ink-900">
      <span className="absolute left-6 top-[22px] font-mono text-xs text-ink-300">{ui.cube.file}</span>
      {webgl && <span className="absolute bottom-[22px] right-6 font-mono text-xs text-ink-300">{ui.cube.drag}</span>}
      <div aria-hidden="true" className="absolute size-[330px] animate-spin-slow rounded-full border border-dashed border-ink-500">
        <span className="absolute -top-[5px] left-1/2 size-2.5 rounded-full bg-lime shadow-[0_0_16px_#A3E635]" />
      </div>
      <div aria-hidden="true" className="absolute size-[250px] animate-spin-slow rounded-full border border-ink-600 [animation-direction:reverse] [animation-duration:11s]">
        <span className="absolute -bottom-1 left-[30%] size-2 rounded-full bg-ink-50" />
      </div>
      <div ref={ref} role="img" aria-label={ui.cube.aria} className="relative z-10 size-[260px] cursor-grab active:cursor-grabbing">
        {webgl && seen ? <StackCube faces={content.cubeFaces} active={visible} /> : <StackCubeCss faces={content.cubeFaces} />}
      </div>
    </BentoCard>
  );
}
```

Run: `npx vitest run src/components/bento/StackCubeCard.test.tsx`. Expected: PASS.

- [ ] **Step 7: Add the card to the home page**

In `src/app/(portfolio)/page.tsx`, add `import { StackCubeCard } from "@/components/bento/StackCubeCard";` and replace `{/* Task 6: <StackCubeCard /> */}` with `<StackCubeCard />`.

- [ ] **Step 8: Full gate and manual 3D check**

Run: `npm run lint && npm run test && npm run build`
Expected: green.

Run `npm run dev` and check at 1440px:
- The cube renders with text on its faces and rotates.
- Dragging rotates it, and the mouse wheel over the cube still scrolls the page.

At 390px the CSS cube should show instead. In DevTools → Rendering, emulate `prefers-reduced-motion: reduce` and check that the CSS cube appears and stays still.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: draggable R3F stack cube with lazy loading and CSS fallback"
```

---

### Task 7: GitHub contributions (server fetch and card)

**Files:**
- Create: `src/lib/github.ts`, `src/lib/github.test.ts`, `src/components/bento/ContributionsCard.tsx`, `src/components/bento/ContributionsCard.test.tsx`
- Modify: `src/app/(portfolio)/page.tsx`

**Interfaces:**
- Produces:
  - `interface ContributionDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }`
  - `interface Contributions { total: number; days: ContributionDay[]; source: "github" | "fallback" }`
  - `levelFor(count: number, max: number): 0|1|2|3|4`
  - `parseCalendar(json: unknown, weeks?: number): Contributions | null`
  - `fallbackContributions(weeks?: number): Contributions`
  - `getContributions(login: string, weeks?: number): Promise<Contributions>` (never throws)
  - `<ContributionsCard data: Contributions login: string />`

- [ ] **Step 1: Write the failing tests `src/lib/github.test.ts`**

```ts
// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { fallbackContributions, getContributions, levelFor, parseCalendar } from "./github";

function sample(weeks: number) {
  return {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 401,
            weeks: Array.from({ length: weeks }, (_, w) => ({
              contributionDays: Array.from({ length: 7 }, (_, d) => ({
                date: `2026-01-${String(((w * 7 + d) % 28) + 1).padStart(2, "0")}`,
                contributionCount: (w + d) % 5,
              })),
            })),
          },
        },
      },
    },
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("levelFor", () => {
  it("maps counts to 0..4 relative to max", () => {
    expect(levelFor(0, 10)).toBe(0);
    expect(levelFor(1, 10)).toBe(1);
    expect(levelFor(5, 10)).toBe(2);
    expect(levelFor(7, 10)).toBe(3);
    expect(levelFor(10, 10)).toBe(4);
    expect(levelFor(3, 0)).toBe(0);
  });
});

describe("parseCalendar", () => {
  it("keeps the last N weeks and the yearly total", () => {
    const r = parseCalendar(sample(53), 20);
    expect(r?.total).toBe(401);
    expect(r?.days).toHaveLength(140);
    expect(r?.source).toBe("github");
  });

  it("returns null for error payloads", () => {
    expect(parseCalendar({ errors: [{ message: "Bad credentials" }] })).toBeNull();
    expect(parseCalendar(null)).toBeNull();
  });
});

describe("fallbackContributions", () => {
  it("is deterministic with 140 days", () => {
    const a = fallbackContributions();
    expect(a.days).toHaveLength(140);
    expect(a.source).toBe("fallback");
    expect(fallbackContributions()).toEqual(a);
  });
});

describe("getContributions", () => {
  it("falls back without a token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect((await getContributions("x")).source).toBe("fallback");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("falls back when fetch rejects", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await getContributions("x")).source).toBe("fallback");
  });

  it("parses a successful response", async () => {
    vi.stubEnv("GITHUB_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => sample(30) }));
    const r = await getContributions("x");
    expect(r.source).toBe("github");
    expect(r.total).toBe(401);
  });
});
```

Run: `npx vitest run src/lib/github.test.ts`. Expected: FAIL.

- [ ] **Step 2: Implement `src/lib/github.ts`**

```ts
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
  source: "github" | "fallback";
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export function levelFor(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

interface RawDay {
  date: string;
  contributionCount: number;
}

export function parseCalendar(json: unknown, weeks = 20): Contributions | null {
  const calendar = (json as {
    data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions: number; weeks: { contributionDays: RawDay[] }[] } } } };
  } | null)?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar || !Array.isArray(calendar.weeks)) return null;

  const raw = calendar.weeks.slice(-weeks).flatMap((w) => w.contributionDays);
  const max = Math.max(0, ...raw.map((d) => d.contributionCount));
  return {
    total: calendar.totalContributions,
    days: raw.map((d) => ({ date: d.date, count: d.contributionCount, level: levelFor(d.contributionCount, max) })),
    source: "github",
  };
}

export function fallbackContributions(weeks = 20): Contributions {
  const days: ContributionDay[] = Array.from({ length: weeks * 7 }, (_, i) => {
    const level = ((i * 11 + Math.floor(i / 7) * 3) % 5) as 0 | 1 | 2 | 3 | 4;
    return { date: "", count: level, level };
  });
  return { total: 0, days, source: "fallback" };
}

export async function getContributions(login: string, weeks = 20): Promise<Contributions> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return fallbackContributions(weeks);
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    } as RequestInit);
    if (!res.ok) return fallbackContributions(weeks);
    return parseCalendar(await res.json(), weeks) ?? fallbackContributions(weeks);
  } catch (error) {
    console.error("[github] contributions fetch failed", error);
    return fallbackContributions(weeks);
  }
}
```

Run: `npx vitest run src/lib/github.test.ts`. Expected: PASS.

- [ ] **Step 3: Write the failing card test `src/components/bento/ContributionsCard.test.tsx`**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { fallbackContributions } from "@/lib/github";
import { ContributionsCard } from "./ContributionsCard";

describe("ContributionsCard", () => {
  it("shows the total and live label for GitHub data", () => {
    renderWithLanguage(<ContributionsCard login="MiftahulH23" data={{ ...fallbackContributions(), total: 401, source: "github" }} />);
    expect(screen.getByText("401 contributions in the last year")).toBeInTheDocument();
    expect(screen.getByText("live via GitHub API")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "github.com/MiftahulH23" })).toHaveAttribute("href", "https://github.com/MiftahulH23");
  });

  it("labels fallback data as sample and hides the total", () => {
    renderWithLanguage(<ContributionsCard login="MiftahulH23" data={fallbackContributions()} />);
    expect(screen.getByText("sample activity")).toBeInTheDocument();
    expect(screen.queryByText(/contributions in the last year/)).not.toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/bento/ContributionsCard.test.tsx`. Expected: FAIL.

- [ ] **Step 4: Implement `src/components/bento/ContributionsCard.tsx`**

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Contributions } from "@/lib/github";
import { fmt } from "@/lib/format";
import { BentoCard } from "./BentoCard";

const LEVEL_BG = ["bg-[#1C1C21]", "bg-[#26331A]", "bg-[#3F5B1F]", "bg-[#6B9B2A]", "bg-lime"] as const;

export function ContributionsCard({ data, login }: { data: Contributions; login: string }) {
  const { ui } = useLanguage();
  const live = data.source === "github";

  return (
    <BentoCard cols={6} rows={3} delay={0.05} className="flex flex-col justify-between gap-[18px]">
      <div className="flex flex-wrap justify-between gap-3 font-mono text-xs text-ink-300">
        <a href={`https://github.com/${login}`} target="_blank" rel="noreferrer" className="hover:text-ink-50">
          github.com/{login}
        </a>
        <span>{live ? ui.contributions.live : ui.contributions.sample}</span>
      </div>
      <div role="img" aria-label={ui.contributions.aria} className="grid grid-flow-col grid-rows-7 gap-[5px]">
        {data.days.map((d, i) => (
          <span
            key={d.date || i}
            title={d.date ? `${d.date}: ${d.count}` : undefined}
            className={`aspect-square rounded-[4px] ${LEVEL_BG[d.level]} ${d.level > 0 ? "animate-shimmer" : ""}`}
            style={d.level > 0 ? { animationDelay: `${((i * 37) % 30) / 10}s` } : undefined}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[26px] font-bold tracking-[-0.02em]">{ui.contributions.heading}</span>
        {live && <span className="font-mono text-xs text-ink-300">{fmt(ui.contributions.total, { n: data.total })}</span>}
      </div>
    </BentoCard>
  );
}
```

Run: `npx vitest run src/components/bento/ContributionsCard.test.tsx`. Expected: PASS.

- [ ] **Step 5: Fetch on the server in `src/app/(portfolio)/page.tsx`**

Replace the whole file with:

```tsx
import { BentoGrid } from "@/components/bento/BentoGrid";
import { ContributionsCard } from "@/components/bento/ContributionsCard";
import { EducationRow } from "@/components/bento/EducationRow";
import { ExperienceCard } from "@/components/bento/ExperienceCard";
import { FeaturedProject } from "@/components/bento/FeaturedProject";
import { GpaCard } from "@/components/bento/GpaCard";
import { IntroCard } from "@/components/bento/IntroCard";
import { LocationCard } from "@/components/bento/LocationCard";
import { ProcessCard } from "@/components/bento/ProcessCard";
import { ProjectList } from "@/components/bento/ProjectList";
import { ServicesSection } from "@/components/bento/ServicesSection";
import { StackCubeCard } from "@/components/bento/StackCubeCard";
import { StackMarquee } from "@/components/bento/StackMarquee";
import { TerminalCard } from "@/components/bento/TerminalCard";
import { getContent } from "@/content";
import { getContributions } from "@/lib/github";

export const revalidate = 86400;

export default async function Home() {
  const c = getContent("en");
  const login = c.personal.githubLogin;
  const contributions = await getContributions(login);

  return (
    <main id="top" className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <BentoGrid>
        <IntroCard />
        <StackCubeCard />
        <LocationCard />
        <GpaCard />
        <ExperienceCard />
        <StackMarquee />
        <ServicesSection />
        <FeaturedProject />
        <ProjectList />
        <ProcessCard />
        <TerminalCard />
        <ContributionsCard data={contributions} login={login} />
        <EducationRow />
        {/* Task 8: <ContactSection /> */}
      </BentoGrid>
    </main>
  );
}
```

- [ ] **Step 6: Full gate**

Run: `npm run lint && npm run test && npm run build`
Expected: green. The build uses the real `GITHUB_TOKEN` from `.env.local`. Run `npm run dev` and check that the card says "live via GitHub API" with a total.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: GitHub contribution graph fetched on the server with fallback"
```

---

### Task 8: Contact form (zod, rate limit, Resend server action)

**Files:**
- Create: `src/lib/contact-schema.ts`, `src/lib/contact-schema.test.ts`, `src/lib/rate-limit.ts`, `src/lib/rate-limit.test.ts`, `src/lib/contact-service.ts`, `src/lib/contact-service.test.ts`, `src/lib/resend-sender.ts`, `src/app/actions/contact.ts`, `src/components/contact/ContactForm.tsx`, `src/components/contact/ContactForm.test.tsx`, `src/components/bento/ContactSection.tsx`
- Modify: `src/app/(portfolio)/page.tsx`

**Interfaces:**
- Produces:
  - `TOPICS = ["freelance","fulltime","collaboration","hi"] as const`, `type Topic`, `contactSchema`, `type ContactInput`, `type ContactErrorCode = "name_invalid"|"email_invalid"|"topic_invalid"|"message_invalid"|"rate_limited"|"send_failed"|"not_configured"`, `type ContactResult = { ok: true } | { ok: false; error: ContactErrorCode }`, `validateContact(input: unknown): { ok: true; data: ContactInput } | { ok: false; error: ContactErrorCode }`
  - `createRateLimiter({ limit, windowMs, now? }): RateLimiter` with `check(key: string): boolean`
  - `interface OutgoingEmail { to; replyTo; subject; text; html }`, `buildEmail(data: ContactInput, to: string): OutgoingEmail`, `escapeHtml(s: string): string`, `handleContact(input: unknown, deps: ContactDeps): Promise<ContactResult>`
  - `createResendSender(apiKey: string): (m: OutgoingEmail) => Promise<void>`
  - Server action `sendContact(input: unknown): Promise<ContactResult>`
  - `<ContactForm />`, `<ContactSection />` (id `contact`)

- [ ] **Step 1: Install dependencies**

```bash
npm install zod resend
```

- [ ] **Step 2: Write the failing tests `src/lib/contact-schema.test.ts` and `src/lib/rate-limit.test.ts`**

```ts
// contact-schema.test.ts
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { validateContact } from "./contact-schema";

const good = { name: "Ana Putri", email: "ana@example.com", topic: "freelance", message: "I need a dashboard built.", company: "" };

describe("validateContact", () => {
  it("accepts and trims a valid payload", () => {
    const r = validateContact({ ...good, name: "  Ana Putri  " });
    expect(r).toEqual({ ok: true, data: { ...good, name: "Ana Putri" } });
  });

  it.each([
    [{ name: "A" }, "name_invalid"],
    [{ email: "nope" }, "email_invalid"],
    [{ topic: "spam" }, "topic_invalid"],
    [{ message: "short" }, "message_invalid"],
    [{ message: "x".repeat(2001) }, "message_invalid"],
  ])("rejects %o with %s", (patch, code) => {
    expect(validateContact({ ...good, ...patch })).toEqual({ ok: false, error: code });
  });

  it("reports the first invalid field in form order", () => {
    expect(validateContact({ ...good, name: "", email: "bad" })).toEqual({ ok: false, error: "name_invalid" });
  });
});
```

```ts
// rate-limit.test.ts
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows `limit` hits per window per key, then blocks until the window passes", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    expect([rl.check("a"), rl.check("a"), rl.check("a"), rl.check("a")]).toEqual([true, true, true, false]);
    expect(rl.check("b")).toBe(true);
    t = 1001;
    expect(rl.check("a")).toBe(true);
  });
});
```

Run: `npx vitest run src/lib/contact-schema.test.ts src/lib/rate-limit.test.ts`. Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/contact-schema.ts` and `src/lib/rate-limit.ts`**

```ts
import { z } from "zod";

export const TOPICS = ["freelance", "fulltime", "collaboration", "hi"] as const;
export type Topic = (typeof TOPICS)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(200).pipe(z.email()),
  topic: z.enum(TOPICS),
  message: z.string().trim().min(10).max(2000),
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactErrorCode =
  | "name_invalid"
  | "email_invalid"
  | "topic_invalid"
  | "message_invalid"
  | "rate_limited"
  | "send_failed"
  | "not_configured";

export type ContactResult = { ok: true } | { ok: false; error: ContactErrorCode };

const FIELD_ORDER = ["name", "email", "topic", "message"] as const;
const FIELD_ERROR: Record<(typeof FIELD_ORDER)[number], ContactErrorCode> = {
  name: "name_invalid",
  email: "email_invalid",
  topic: "topic_invalid",
  message: "message_invalid",
};

export function validateContact(
  input: unknown,
): { ok: true; data: ContactInput } | { ok: false; error: ContactErrorCode } {
  const result = contactSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const bad = new Set(result.error.issues.map((i) => String(i.path[0])));
  const field = FIELD_ORDER.find((f) => bad.has(f)) ?? "message";
  return { ok: false, error: FIELD_ERROR[field] };
}
```

```ts
export interface RateLimiter {
  check(key: string): boolean;
}

export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
  };
}
```

Run the two tests. Expected: PASS.

- [ ] **Step 4: Write the failing service test `src/lib/contact-service.test.ts`**

```ts
// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { buildEmail, escapeHtml, handleContact } from "./contact-service";
import { createRateLimiter } from "./rate-limit";

const good = { name: "Ana Putri", email: "ana@example.com", topic: "freelance", message: "I need a dashboard built.", company: "" };
const deps = (over: Partial<Parameters<typeof handleContact>[1]> = {}) => ({
  ip: "1.1.1.1",
  limiter: createRateLimiter({ limit: 3, windowMs: 60_000 }),
  send: vi.fn().mockResolvedValue(undefined),
  toEmail: "owner@example.com",
  ...over,
});

describe("handleContact", () => {
  it("sends a valid message to the owner with reply-to set", async () => {
    const d = deps();
    expect(await handleContact(good, d)).toEqual({ ok: true });
    expect(d.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "owner@example.com", replyTo: "ana@example.com", subject: "[Portfolio] Freelance project — Ana Putri" }),
    );
  });

  it("returns validation errors without sending", async () => {
    const d = deps();
    expect(await handleContact({ ...good, email: "x" }, d)).toEqual({ ok: false, error: "email_invalid" });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const d = deps();
    expect(await handleContact({ ...good, company: "Spam Inc" }, d)).toEqual({ ok: true });
    expect(d.send).not.toHaveBeenCalled();
  });

  it("rate limits per ip", async () => {
    const d = deps({ limiter: createRateLimiter({ limit: 1, windowMs: 60_000 }) });
    await handleContact(good, d);
    expect(await handleContact(good, d)).toEqual({ ok: false, error: "rate_limited" });
  });

  it("reports not_configured when no sender exists", async () => {
    expect(await handleContact(good, deps({ send: null }))).toEqual({ ok: false, error: "not_configured" });
  });

  it("reports send_failed when the provider throws", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const d = deps({ send: vi.fn().mockRejectedValue(new Error("boom")) });
    expect(await handleContact(good, d)).toEqual({ ok: false, error: "send_failed" });
    spy.mockRestore();
  });
});

describe("buildEmail", () => {
  it("keeps the subject on one line and escapes html", () => {
    const mail = buildEmail(
      { name: "Eve\r\nBcc: x@y.z", email: "eve@example.com", topic: "hi", message: "<script>alert(1)</script> & more", company: "" },
      "owner@example.com",
    );
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;");
    expect(mail.text).toContain("<script>alert(1)</script>");
  });

  it("escapeHtml covers the five special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});
```

Run: `npx vitest run src/lib/contact-service.test.ts`. Expected: FAIL.

- [ ] **Step 5: Implement `src/lib/contact-service.ts` and `src/lib/resend-sender.ts`**

```ts
import { validateContact, type ContactInput, type ContactResult, type Topic } from "./contact-schema";
import type { RateLimiter } from "./rate-limit";

export interface OutgoingEmail {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export interface ContactDeps {
  ip: string;
  limiter: RateLimiter;
  send: ((mail: OutgoingEmail) => Promise<void>) | null;
  toEmail: string;
}

const TOPIC_LABELS: Record<Topic, string> = {
  freelance: "Freelance project",
  fulltime: "Full-time role",
  collaboration: "Collaboration",
  hi: "Just saying hi",
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildEmail(data: ContactInput, to: string): OutgoingEmail {
  const topic = TOPIC_LABELS[data.topic];
  const text = `Name: ${data.name}\nEmail: ${data.email}\nTopic: ${topic}\n\n${data.message}`;
  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.5">
<p><strong>Name:</strong> ${escapeHtml(data.name)}<br><strong>Email:</strong> ${escapeHtml(data.email)}<br><strong>Topic:</strong> ${escapeHtml(topic)}</p>
<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
</div>`;
  return { to, replyTo: oneLine(data.email), subject: oneLine(`[Portfolio] ${topic} — ${data.name}`), text, html };
}

export async function handleContact(input: unknown, deps: ContactDeps): Promise<ContactResult> {
  const valid = validateContact(input);
  if (!valid.ok) return valid;
  if (valid.data.company && valid.data.company.trim() !== "") return { ok: true };
  if (!deps.limiter.check(deps.ip)) return { ok: false, error: "rate_limited" };
  if (!deps.send) return { ok: false, error: "not_configured" };
  try {
    await deps.send(buildEmail(valid.data, deps.toEmail));
    return { ok: true };
  } catch (error) {
    console.error("[contact] send failed", error);
    return { ok: false, error: "send_failed" };
  }
}
```

```ts
// src/lib/resend-sender.ts
import { Resend } from "resend";
import type { OutgoingEmail } from "./contact-service";

export function createResendSender(apiKey: string) {
  const resend = new Resend(apiKey);
  return async (mail: OutgoingEmail) => {
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  };
}
```

Run: `npx vitest run src/lib`. Expected: PASS.

- [ ] **Step 6: Implement the server action `src/app/actions/contact.ts`**

```ts
"use server";

import { headers } from "next/headers";
import type { ContactResult } from "@/lib/contact-schema";
import { handleContact } from "@/lib/contact-service";
import { createRateLimiter } from "@/lib/rate-limit";
import { createResendSender } from "@/lib/resend-sender";

const limiter = createRateLimiter({ limit: 3, windowMs: 10 * 60 * 1000 });

export async function sendContact(input: unknown): Promise<ContactResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const dryRun = process.env.CONTACT_DRY_RUN === "1";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !dryRun) console.error("[contact] RESEND_API_KEY is not set");
  const send = dryRun ? async () => {} : apiKey ? createResendSender(apiKey) : null;
  return handleContact(input, {
    ip,
    limiter,
    send,
    toEmail: process.env.CONTACT_TO_EMAIL || "miftahulh942@gmail.com",
  });
}
```

- [ ] **Step 7: Write the failing form test `src/components/contact/ContactForm.test.tsx`**

```tsx
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";

const sendContact = vi.fn();
vi.mock("@/app/actions/contact", () => ({ sendContact: (...args: unknown[]) => sendContact(...args) }));

import { ContactForm } from "./ContactForm";

async function fill() {
  await userEvent.type(screen.getByLabelText("Name"), "Ana Putri");
  await userEvent.type(screen.getByLabelText("Email"), "ana@example.com");
  await userEvent.type(screen.getByLabelText("Message"), "I need a dashboard built.");
}

beforeEach(() => sendContact.mockReset());

describe("ContactForm", () => {
  it("submits and shows the success state", async () => {
    sendContact.mockResolvedValue({ ok: true });
    renderWithLanguage(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: "Full-time role" }));
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText("Message sent, Ana.")).toBeInTheDocument();
    expect(sendContact).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Ana Putri", email: "ana@example.com", topic: "fulltime", company: "" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Send another" }));
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("validates on the client without calling the action", async () => {
    renderWithLanguage(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Name"), "Ana");
    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    await userEvent.type(screen.getByLabelText("Message"), "long enough message");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter a valid email address.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(sendContact).not.toHaveBeenCalled();
  });

  it("shows server errors", async () => {
    sendContact.mockResolvedValue({ ok: false, error: "rate_limited" });
    renderWithLanguage(<ContactForm />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many messages");
  });

  it("calls the action exactly once on a double click", async () => {
    let resolve: (v: unknown) => void = () => {};
    sendContact.mockImplementation(() => new Promise((r) => (resolve = r)));
    renderWithLanguage(<ContactForm />);
    await fill();
    const button = screen.getByRole("button", { name: /send message/i });
    await userEvent.dblClick(button);
    expect(sendContact).toHaveBeenCalledTimes(1);
    resolve({ ok: true });
    await waitFor(() => expect(screen.getByText("Message sent, Ana.")).toBeInTheDocument());
  });
});
```

Run: `npx vitest run src/components/contact`. Expected: FAIL.

- [ ] **Step 8: Implement `src/components/contact/ContactForm.tsx`**

```tsx
"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { sendContact } from "@/app/actions/contact";
import { useLanguage } from "@/context/LanguageContext";
import { TOPICS, validateContact, type ContactErrorCode, type Topic } from "@/lib/contact-schema";
import { fmt } from "@/lib/format";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "success"; name: string; email: string } | { kind: "error"; code: ContactErrorCode };

const field =
  "min-h-[50px] rounded-xl border bg-ink-900 px-4 font-display text-base text-ink-50 placeholder:text-ink-400 outline-none focus-visible:border-lime";

export function ContactForm() {
  const { ui } = useLanguage();
  const f = ui.contact.form;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState<Topic>("freelance");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const inFlight = useRef(false);

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setTopic("freelance");
    setCompany("");
    setStatus({ kind: "idle" });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const payload = { name, email, topic, message, company };
    const local = validateContact(payload);
    if (!local.ok) {
      setStatus({ kind: "error", code: local.error });
      return;
    }
    inFlight.current = true;
    startTransition(async () => {
      try {
        const res = await sendContact(payload);
        setStatus(res.ok ? { kind: "success", name: local.data.name, email: local.data.email } : { kind: "error", code: res.error });
      } catch {
        setStatus({ kind: "error", code: "send_failed" });
      } finally {
        inFlight.current = false;
      }
    });
  }

  if (status.kind === "success") {
    return (
      <div role="status" className="flex flex-1 flex-col items-start justify-center gap-4">
        <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-lime text-ink-950">
          <Check className="size-[30px]" strokeWidth={2.6} />
        </span>
        <span className="text-[34px] font-extrabold tracking-[-0.03em]">{fmt(f.successTitle, { name: status.name.split(" ")[0] })}</span>
        <span className="max-w-[440px] text-[17px] leading-normal text-ink-300">{fmt(f.successBody, { email: status.email })}</span>
        <button type="button" onClick={reset} className="min-h-11 rounded-xl border border-ink-500 px-[18px] text-sm font-semibold">
          {f.again}
        </button>
      </div>
    );
  }

  const err = status.kind === "error" ? status.code : null;

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex h-full flex-col gap-4">
      <div className="flex flex-wrap gap-3.5">
        <label className="flex min-w-[200px] flex-1 flex-col gap-2 font-mono text-xs text-ink-200">
          {f.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.namePh}
            autoComplete="name"
            aria-invalid={err === "name_invalid"}
            className={cn(field, err === "name_invalid" ? "border-danger" : "border-ink-600")}
          />
        </label>
        <label className="flex min-w-[200px] flex-1 flex-col gap-2 font-mono text-xs text-ink-200">
          {f.email}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={f.emailPh}
            autoComplete="email"
            aria-invalid={err === "email_invalid"}
            className={cn(field, err === "email_invalid" ? "border-danger" : "border-ink-600")}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-mono text-xs text-ink-200">{f.topicLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                topic === t ? "border-lime bg-lime text-ink-950" : "border-ink-500 text-ink-200 hover:border-ink-300",
              )}
            >
              {f.topics[t]}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-1 flex-col gap-2 font-mono text-xs text-ink-200">
        {f.message}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={f.messagePh}
          aria-invalid={err === "message_invalid"}
          className={cn(field, "min-h-[140px] flex-1 resize-y py-3.5 leading-normal", err === "message_invalid" ? "border-danger" : "border-ink-600")}
        />
      </label>

      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          {f.honeypot}
          <input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      {err && (
        <p role="alert" className="font-mono text-[13px] text-danger">
          {f.errors[err]}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-ink-300">{f.privacy}</span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] bg-lime px-[26px] text-base font-bold text-ink-950 disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="size-[18px] animate-spin" aria-hidden="true" />
              {f.sending}
            </>
          ) : (
            <>
              {f.send}
              <Send className="size-[18px]" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
```

Run: `npx vitest run src/components/contact`. Expected: PASS (4 tests).

- [ ] **Step 9: Implement `src/components/bento/ContactSection.tsx` and add it to the page**

```tsx
"use client";

import { Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ContactForm } from "@/components/contact/ContactForm";
import { BentoCard } from "./BentoCard";

export function ContactSection() {
  const { content, ui } = useLanguage();
  const p = content.personal;

  return (
    <BentoCard cols={12} rows={4} id="contact" className="flex flex-wrap p-0">
      <div className="flex min-w-0 flex-[1_1_360px] flex-col justify-between gap-7 bg-lime p-8 text-ink-950 bento:p-10">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[13px]">{ui.contact.kicker}</span>
          <h2 className="text-[clamp(44px,5.4vw,84px)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            {ui.contact.heading1}
            <br />
            {ui.contact.heading2}
          </h2>
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <div className="flex flex-wrap gap-2.5">
            <a href={`mailto:${p.email}`} className="inline-flex min-h-[52px] items-center rounded-[14px] bg-ink-950 px-6 text-[17px] font-bold text-ink-50">
              {p.email}
            </a>
            {p.cvUrl && (
              <a href={p.cvUrl} download className="inline-flex min-h-[52px] items-center gap-2 rounded-[14px] border-2 border-ink-950 px-5 text-[17px] font-bold">
                <Download className="size-[18px]" aria-hidden="true" />
                {ui.contact.cvPdf}
              </a>
            )}
          </div>
          <div className="flex gap-[18px] font-mono text-[13px]">
            <a href={p.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={p.socials.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href={p.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-[1.3_1_440px] flex-col p-8 bento:p-10">
        <ContactForm />
      </div>
    </BentoCard>
  );
}
```

In `src/app/(portfolio)/page.tsx`, import it and replace `{/* Task 8: <ContactSection /> */}` with `<ContactSection />`.

- [ ] **Step 10: Full gate and one real email**

Run: `npm run lint && npm run test && npm run build`
Expected: green.

Run `npm run dev` and submit the form once with your own details. Check that the success message appears and that the email arrives at `miftahulh942@gmail.com` (check spam too). The subject should read `[Portfolio] Freelance project — <name>`, and Reply should go to the sender address. If you get `not_configured`, `.env.local` was not loaded; restart dev.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: contact form with zod validation, rate limit and Resend server action"
```

---

### Task 9: Command palette (⌘K)

**Files:**
- Create: `src/components/command/CommandPalette.tsx`, `src/components/command/CommandPalette.test.tsx`
- Modify: `src/app/(portfolio)/layout.tsx`

**Interfaces:**
- Consumes: `OPEN_PALETTE_EVENT`, `useLanguage`, `fmt`, `next/navigation` (`useRouter`, `usePathname`)
- Produces: `<CommandPalette />`, mounted once in the portfolio layout

- [ ] **Step 1: Install cmdk**

```bash
npm install cmdk
```

- [ ] **Step 2: Write the failing test `src/components/command/CommandPalette.test.tsx`**

```tsx
import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithLanguage } from "@/test/render";
import { openCommandPalette } from "@/lib/events";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }), usePathname: () => "/projects/lps" }));

import { CommandPalette } from "./CommandPalette";

describe("CommandPalette", () => {
  it("opens with Ctrl+K and closes with Escape", async () => {
    renderWithLanguage(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Go to Work")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens from the custom event and filters by typing", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    await userEvent.type(await screen.findByPlaceholderText("Type a command or search…"), "linkedin");
    expect(screen.getByText("Open LinkedIn profile")).toBeInTheDocument();
    expect(screen.queryByText("Go to Work")).not.toBeInTheDocument();
  });

  it("navigates to a section from another page via the router", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    await userEvent.click(await screen.findByText("Go to Contact"));
    expect(push).toHaveBeenCalledWith("/#contact");
  });

  it("lists case studies and templates", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    expect(await screen.findByText("Case study: Waste Management Institution System")).toBeInTheDocument();
    expect(screen.getByText("Template: Mabro Coffee")).toBeInTheDocument();
    expect(screen.queryByText("Download CV (PDF)")).not.toBeInTheDocument();
  });

  it("switches language", async () => {
    renderWithLanguage(<CommandPalette />);
    act(() => openCommandPalette());
    await userEvent.click(await screen.findByText("Switch language: English / Indonesia"));
    act(() => openCommandPalette());
    expect(await screen.findByText("Ke bagian Karya")).toBeInTheDocument();
  });
});
```

Run: `npx vitest run src/components/command`. Expected: FAIL.

- [ ] **Step 3: Implement `src/components/command/CommandPalette.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { OPEN_PALETTE_EVENT } from "@/lib/events";
import { fmt } from "@/lib/format";

const GROUP =
  "py-1.5 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[.08em] [&_[cmdk-group-heading]]:text-ink-300";

function Item({ icon, children, onSelect }: { icon: string; children: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={children}
      onSelect={onSelect}
      className="flex min-h-12 cursor-pointer items-center gap-3.5 rounded-xl px-3 text-base font-semibold data-[selected=true]:bg-ink-800"
    >
      <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-[9px] border border-ink-600 bg-ink-800 font-mono text-[13px] text-ink-200">
        {icon}
      </span>
      {children}
    </Command.Item>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { content, ui, toggleLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const p = ui.palette;
  const personal = content.personal;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(t);
  }, [toast]);

  function run(fn: () => void) {
    setOpen(false);
    fn();
  }

  function goSection(id: string) {
    if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else router.push(`/#${id}`);
  }

  function copyEmail() {
    navigator.clipboard
      ?.writeText(personal.email)
      .then(() => setToast(p.copied))
      .catch(() => setToast(personal.email));
  }

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={p.label}
        overlayClassName="fixed inset-0 z-[90] bg-ink-950/60 backdrop-blur-sm"
        contentClassName="theme-d fixed left-1/2 top-[12vh] z-[100] w-[calc(100%-32px)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-[20px] border border-ink-600 bg-ink-850 font-display text-ink-50 shadow-[0_40px_120px_rgba(0,0,0,.7)]"
      >
        <div className="flex items-center gap-3 border-b border-ink-700 px-5 py-4">
          <Search className="size-5 text-ink-300" aria-hidden="true" />
          <Command.Input placeholder={p.placeholder} className="min-h-8 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-ink-400" />
          <kbd className="rounded-md border border-ink-500 px-2 py-0.5 font-mono text-xs text-ink-300">ESC</kbd>
        </div>
        <Command.List className="max-h-[460px] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-10 text-center text-[15px] text-ink-300">{p.empty}</Command.Empty>
          <Command.Group heading={p.groups.navigation} className={GROUP}>
            <Item icon="#" onSelect={() => run(() => goSection("work"))}>{p.goWork}</Item>
            <Item icon="#" onSelect={() => run(() => goSection("services"))}>{p.goServices}</Item>
            <Item icon="#" onSelect={() => run(() => goSection("about"))}>{p.goExperience}</Item>
            <Item icon="#" onSelect={() => run(() => goSection("contact"))}>{p.goContact}</Item>
          </Command.Group>
          <Command.Group heading={p.groups.projects} className={GROUP}>
            {content.projects.map((proj) => (
              <Item key={proj.slug} icon="›" onSelect={() => run(() => router.push(`/projects/${proj.slug}`))}>
                {fmt(p.caseStudy, { title: proj.title })}
              </Item>
            ))}
            {content.templates.map((t) => (
              <Item key={t.link} icon="◇" onSelect={() => run(() => router.push(t.link))}>
                {fmt(p.template, { name: t.title })}
              </Item>
            ))}
          </Command.Group>
          <Command.Group heading={p.groups.actions} className={GROUP}>
            <Item icon="@" onSelect={() => run(copyEmail)}>{p.copyEmail}</Item>
            {personal.cvUrl && (
              <Item icon="↓" onSelect={() => run(() => window.open(personal.cvUrl, "_blank", "noopener"))}>{p.downloadCv}</Item>
            )}
            <Item icon="A" onSelect={() => run(toggleLanguage)}>{p.switchLang}</Item>
            <Item icon="↗" onSelect={() => run(() => window.open(personal.socials.github, "_blank", "noopener"))}>{p.openGithub}</Item>
            <Item icon="↗" onSelect={() => run(() => window.open(personal.socials.linkedin, "_blank", "noopener"))}>{p.openLinkedin}</Item>
          </Command.Group>
        </Command.List>
        <div className="border-t border-ink-700 px-5 py-3 font-mono text-xs text-ink-300">{p.hint}</div>
      </Command.Dialog>
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-xl border border-ink-600 bg-ink-850 px-4 py-3 font-mono text-sm text-ink-50">
          {toast}
        </div>
      )}
    </>
  );
}
```

Run: `npx vitest run src/components/command`. Expected: PASS. If cmdk complains that `ResizeObserver`/`scrollIntoView` is missing, check that `vitest.setup.ts` (Task 1) still defines both.

- [ ] **Step 4: Mount in the layout**

In `src/app/(portfolio)/layout.tsx`, import `CommandPalette` and render `<CommandPalette />` right after `<Footer />`.

- [ ] **Step 5: Full gate and manual check**

Run: `npm run lint && npm run test && npm run build`
Expected: green.

In dev, check the following:
- Ctrl+K opens the palette, and the arrow keys and Enter work.
- "Go to Contact" scrolls smoothly on the home page.
- "Copy email" shows the toast.
- The palette is usable at 390px.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: command palette with navigation, projects and quick actions"
```

---

### Task 10: Case study pages `/projects/[slug]`

**Files:**
- Create: `src/app/(portfolio)/projects/[slug]/page.tsx`, `src/components/case-study/CaseStudyRoute.tsx`, `src/components/case-study/CaseStudyView.tsx`, `src/components/case-study/ArchitectureDiagram.tsx`, `src/components/case-study/CaseSections.tsx`, `src/components/case-study/CaseStudyView.test.tsx`

**Interfaces:**
- Consumes: `getContent`, `getProject`, `Project`, `CaseStudy`, `useLanguage`, `BrowserBar`, `TiltCard`, `fmt`, `pad`, `hostOf`
- Produces:
  - `CaseStudyView({ project: Project; index: number; total: number; next: Project; nextIndex: number })`, a pure view
  - `CaseStudyRoute({ slug: string })`, which resolves the project for the active language

- [ ] **Step 1: Write the failing test `src/components/case-study/CaseStudyView.test.tsx`**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithLanguage } from "@/test/render";
import type { Project } from "@/content";
import { CaseStudyView } from "./CaseStudyView";

const bare: Project = {
  slug: "bare",
  title: "Bare Project",
  role: "Full-Stack Developer",
  description: "Only the basics.",
  image: "/thumbnails/sistem-informasi-prestasi-mahasiswa.png",
  technologies: ["React.js"],
  featured: false,
};

const full: Project = {
  ...bare,
  slug: "full",
  title: "Full Project",
  demo: "https://example.com",
  github: "https://github.com/x/y",
  caseStudy: {
    timeline: "Jan — Jun 2025",
    problem: { headline: "Paper forms everywhere", body: "Records were scattered." },
    responsibilities: ["Designed the schema"],
    architecture: [
      { label: "client", title: "React", detail: "SPA" },
      { label: "server", title: "Laravel", detail: "API" },
    ],
    features: [{ title: "Proposals", detail: "Submit online." }],
    challenges: [{ problem: "Slow queries", solution: "Added indexes" }],
    results: [{ value: "120", label: "students onboarded" }],
  },
  gallery: [{ src: "/thumbnails/sistem-informasi-prestasi-mahasiswa.png", alt: "Form" }],
};

describe("CaseStudyView", () => {
  it("renders only hero, screenshot and next link when there is no case-study data", () => {
    renderWithLanguage(<CaseStudyView project={bare} index={2} total={4} next={full} nextIndex={3} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bare Project");
    expect(screen.getByText("02 / 04")).toBeInTheDocument();
    expect(screen.queryByText("the problem")).not.toBeInTheDocument();
    expect(screen.queryByText("architecture")).not.toBeInTheDocument();
    expect(screen.queryByText("timeline")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Live ↗" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Full Project/ })).toHaveAttribute("href", "/projects/full");
  });

  it("renders every section when data exists", () => {
    renderWithLanguage(<CaseStudyView project={full} index={1} total={4} next={bare} nextIndex={2} />);
    for (const text of ["Jan — Jun 2025", "Paper forms everywhere", "Designed the schema", "Laravel", "Proposals", "Added indexes", "students onboarded"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Live ↗" })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByAltText("Form")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to work/i })).toHaveAttribute("href", "/#work");
  });
});
```

Run: `npx vitest run src/components/case-study`. Expected: FAIL.

- [ ] **Step 2: Implement `ArchitectureDiagram.tsx`**

```tsx
import { Fragment } from "react";
import type { ArchNode } from "@/content";
import { cn } from "@/lib/utils";

export function ArchitectureDiagram({ nodes }: { nodes: ArchNode[] }) {
  const middle = Math.floor((nodes.length - 1) / 2);
  return (
    <div className="flex flex-col items-stretch bento:flex-row bento:items-center">
      {nodes.map((n, i) => (
        <Fragment key={n.label + n.title}>
          {i > 0 && (
            <div
              aria-hidden="true"
              className="mx-auto h-10 w-0.5 animate-flow bg-[linear-gradient(180deg,#A3E635_50%,transparent_50%)] bg-[length:2px_12px] bento:mx-0 bento:h-0.5 bento:w-[90px] bento:shrink-0 bento:bg-[linear-gradient(90deg,#A3E635_50%,transparent_50%)] bento:bg-[length:12px_2px]"
            />
          )}
          <div className={cn("flex min-w-0 flex-1 flex-col gap-2 rounded-[18px] border bg-ink-800 p-6", i === middle ? "border-lime" : "border-ink-500")}>
            <span className="font-mono text-xs text-ink-300">{n.label}</span>
            <span className="text-[22px] font-extrabold">{n.title}</span>
            <span className="text-sm text-ink-300">{n.detail}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Implement `CaseSections.tsx`**

```tsx
"use client";

import Image from "next/image";
import type { CaseStudy, Project } from "@/content";
import { useLanguage } from "@/context/LanguageContext";
import { pad } from "@/lib/format";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

const card = "rounded-3xl border border-ink-700 bg-ink-850 p-[30px]";
const kicker = "font-mono text-xs text-lime";

export function CaseSections({ project, caseStudy }: { project: Project; caseStudy: CaseStudy }) {
  const { ui } = useLanguage();
  const c = ui.caseStudy;
  const { problem, responsibilities, architecture, features, challenges, results } = caseStudy;
  const hasProblemRow = Boolean(problem) || Boolean(responsibilities?.length);
  const hasDetailRow = Boolean(features?.length) || Boolean(challenges?.length);

  return (
    <>
      {hasProblemRow && (
        <section className="grid grid-cols-1 gap-4 pt-16 bento:grid-cols-12">
          {problem && (
            <div className={`${card} flex flex-col gap-3.5 bento:col-span-7`}>
              <span className={kicker}>{c.problem}</span>
              <h2 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em]">{problem.headline}</h2>
              <p className="text-[17px] leading-[1.65] text-ink-300">{problem.body}</p>
            </div>
          )}
          {responsibilities?.length ? (
            <div className={`${card} flex flex-col gap-3.5 ${problem ? "bento:col-span-5" : "bento:col-span-12"}`}>
              <span className={kicker}>{c.myRole}</span>
              <ul className="flex flex-col gap-3">
                {responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-base leading-normal">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {architecture?.length ? (
        <section className={`${card} mt-4 flex flex-col gap-8 p-10`}>
          <div className="flex flex-col gap-1.5">
            <span className={kicker}>{c.architecture}</span>
            <h2 className="text-[32px] font-extrabold tracking-[-0.03em]">{c.archHeading}</h2>
          </div>
          <ArchitectureDiagram nodes={architecture} />
        </section>
      ) : null}

      {hasDetailRow && (
        <section className="grid grid-cols-1 gap-4 pt-4 bento:grid-cols-12">
          {features?.length ? (
            <div className={`${card} flex flex-col gap-4 ${challenges?.length ? "bento:col-span-6" : "bento:col-span-12"}`}>
              <span className={kicker}>{c.features}</span>
              <ul className="flex flex-col gap-2.5">
                {features.map((f, i) => (
                  <li key={f.title} className="flex items-start gap-3.5 rounded-[14px] bg-ink-800 p-3.5">
                    <span className="pt-[3px] font-mono text-xs text-lime">{pad(i + 1)}</span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[17px] font-bold">{f.title}</span>
                      <span className="text-sm text-ink-300">{f.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {challenges?.length ? (
            <div className={`${card} flex flex-col gap-4 bg-[#050506] ${features?.length ? "bento:col-span-6" : "bento:col-span-12"}`}>
              <span className={kicker}>{c.challenges}</span>
              <div className="flex flex-col gap-[18px] font-mono text-sm leading-[1.8] text-ink-200">
                {challenges.map((ch) => (
                  <p key={ch.problem}>
                    <span className="text-danger">{c.problemLabel}</span> {ch.problem}
                    <br />
                    <span className="text-lime">{c.solutionLabel}</span> {ch.solution}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      )}

      {results?.length ? (
        <section aria-label={c.results} className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.label} className={`${card} flex flex-col gap-2`}>
              <span className="text-[52px] font-extrabold tracking-[-0.04em] text-lime">{r.value}</span>
              <span className="text-[15px] text-ink-300">{r.label}</span>
            </div>
          ))}
        </section>
      ) : null}

      {project.gallery?.length ? (
        <section aria-label={c.gallery} className="grid grid-cols-1 gap-4 pt-4 bento:grid-cols-2">
          {project.gallery.map((g) => (
            <div key={g.src} className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-ink-700 bg-ink-850">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 900px) 640px, 100vw" className="object-cover object-top" />
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
```

- [ ] **Step 4: Implement `CaseStudyView.tsx` and `CaseStudyRoute.tsx`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/content";
import { useLanguage } from "@/context/LanguageContext";
import { fmt, hostOf, pad } from "@/lib/format";
import { BrowserBar } from "@/components/bento/BrowserBar";
import { TiltCard } from "@/components/ui/TiltCard";
import { CaseSections } from "./CaseSections";

interface Props {
  project: Project;
  index: number;
  total: number;
  next: Project;
  nextIndex: number;
}

export function CaseStudyView({ project, index, total, next, nextIndex }: Props) {
  const { ui } = useLanguage();
  const c = ui.caseStudy;
  const cs = project.caseStudy ?? {};
  const meta = [
    { label: c.role, value: project.role },
    cs.timeline ? { label: c.timeline, value: cs.timeline } : null,
    cs.team ? { label: c.team, value: cs.team } : null,
    { label: c.stack, value: project.technologies.slice(0, 3).join(" · ") },
  ].filter((m): m is { label: string; value: string } => m !== null);

  return (
    <main className="mx-auto max-w-[1312px] px-4 pb-12 sm:px-8">
      <div className="flex items-center justify-between gap-4 py-4">
        <Link href="/#work" className="inline-flex min-h-11 items-center gap-2.5 font-mono text-sm text-ink-200 hover:text-ink-50">
          <ArrowLeft className="size-[18px]" aria-hidden="true" />
          {c.back}
        </Link>
        <span className="font-mono text-[13px] text-ink-300">
          {pad(index)} / {pad(total)}
        </span>
      </div>

      <section className="flex flex-col gap-7 pb-10 pt-8">
        <span className="font-mono text-[13px] text-lime">{c.kicker}</span>
        <h1 className="max-w-[1100px] text-[clamp(44px,7vw,104px)] font-extrabold leading-[0.92] tracking-[-0.05em]">{project.title}</h1>
        <p className="max-w-[760px] text-[22px] leading-normal text-ink-300">{project.description}</p>
        <dl className="grid grid-cols-1 border-y border-ink-600 sm:grid-cols-2 bento:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {meta.map((m) => (
            <div key={m.label} className="flex flex-col gap-1.5 py-5 pr-5 bento:border-l bento:border-ink-600 bento:px-5 bento:first:border-l-0 bento:first:pl-0">
              <dt className="font-mono text-xs text-ink-300">{m.label}</dt>
              <dd className="text-lg font-bold">{m.value}</dd>
            </div>
          ))}
          {(project.demo || project.github) && (
            <div className="flex flex-wrap items-center gap-2.5 py-5 bento:border-l bento:border-ink-600 bento:px-5">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-lime px-4 font-bold text-ink-950">
                  {c.live}
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-ink-500 px-4 font-bold">
                  {c.source}
                </a>
              )}
            </div>
          )}
        </dl>
      </section>

      <TiltCard max={4} className="flex items-center justify-center rounded-[28px] border border-ink-700 bg-ink-900 p-6 bento:p-12">
        <div className="w-full animate-float overflow-hidden rounded-[14px] border border-ink-500/60 bg-[#1C1C21] shadow-[0_50px_100px_rgba(0,0,0,.6)]">
          <BrowserBar url={hostOf(project.demo)} />
          <div className="relative aspect-[16/9]">
            <Image src={project.image} alt={fmt(c.screenshotAlt, { title: project.title })} fill priority sizes="(min-width: 1312px) 1200px, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </TiltCard>

      <CaseSections project={project} caseStudy={cs} />

      <Link href={`/projects/${next.slug}`} className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-lime p-10 text-ink-950">
        <span className="flex flex-col gap-1.5">
          <span className="font-mono text-[13px]">{fmt(c.next, { n: pad(nextIndex) })}</span>
          <span className="text-[clamp(30px,4vw,56px)] font-extrabold leading-none tracking-[-0.04em]">{next.title}</span>
        </span>
        <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-ink-950 text-lime">
          <ArrowRight className="size-6" />
        </span>
      </Link>
    </main>
  );
}
```

`CaseStudyRoute.tsx`:

```tsx
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CaseStudyView } from "./CaseStudyView";

export function CaseStudyRoute({ slug }: { slug: string }) {
  const { content } = useLanguage();
  const projects = content.projects;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const nextI = (i + 1) % projects.length;
  return <CaseStudyView project={projects[i]} index={i + 1} total={projects.length} next={projects[nextI]} nextIndex={nextI + 1} />;
}
```

Run: `npx vitest run src/components/case-study`. Expected: PASS.

- [ ] **Step 5: Create the route `src/app/(portfolio)/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, getProject } from "@/content";
import { CaseStudyRoute } from "@/components/case-study/CaseStudyRoute";

export const dynamicParams = false;

export function generateStaticParams() {
  return getContent("en").projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject("en", slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.title, description: project.description, images: [project.image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProject("en", slug)) notFound();
  return <CaseStudyRoute slug={slug} />;
}
```

- [ ] **Step 6: Full gate and manual check**

Run: `npm run lint && npm run test && npm run build`
Expected: green. The build output lists 4 SSG routes `/projects/[slug]`.

In dev, open `/projects/sipresma` and compare it with the mockup frame *D — Case study*:
- The architecture diagram shows 3 nodes, and the connectors animate.
- The features section is visible, and the problem/role and results sections are hidden (no data yet).
- "Next project" goes to `lps`, and switching to ID translates the page.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: case study pages with optional sections and architecture diagram"
```

---

### Task 11: SEO, e2e smoke tests, Lighthouse, README

**Files:**
- Create: `src/lib/site.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `src/app/layout.tsx`, `src/app/(portfolio)/page.tsx`, `README.md`, `.gitignore`

**Interfaces:**
- Produces: `SITE_URL: string`, `/sitemap.xml`, `/robots.txt`, JSON-LD `Person` on `/`, and `npm run test:e2e`

- [ ] **Step 1: Create `src/lib/site.ts` and update the root metadata**

```ts
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://miftahulhuda.vercel.app").replace(/\/$/, "");
```

In `src/app/layout.tsx`, replace the `metadata` export with:

```tsx
import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";

const description =
  "Portfolio of Miftahul Huda, a Full-Stack Web Developer building secure, fast web systems with Laravel, React and Next.js.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Miftahul Huda — Full-Stack Developer", template: "%s · Miftahul Huda" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "Miftahul Huda", title: "Miftahul Huda — Full-Stack Developer", description },
  twitter: { card: "summary_large_image", title: "Miftahul Huda — Full-Stack Developer", description },
};

export const viewport: Viewport = { themeColor: "#09090B" };
```

(Merge the `Metadata` import with the existing one.)

- [ ] **Step 2: Create `src/app/sitemap.ts` and `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const content = getContent("en");
  return [
    { url: SITE_URL, lastModified: now, priority: 1 },
    ...content.projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...content.templates.map((t) => ({ url: `${SITE_URL}${t.link}`, lastModified: now, priority: 0.4 })),
  ];
}
```

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
```

- [ ] **Step 3: Add JSON-LD to `src/app/(portfolio)/page.tsx`**

The file already defines `const c = getContent("en");` (Task 7). Directly after the `contributions` line, add:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: c.personal.name,
  jobTitle: c.personal.headline,
  email: `mailto:${c.personal.email}`,
  url: SITE_URL,
  sameAs: [c.personal.socials.github, c.personal.socials.linkedin, c.personal.socials.instagram],
  alumniOf: { "@type": "CollegeOrUniversity", name: c.education.institution },
  address: { "@type": "PostalAddress", addressRegion: "Riau", addressCountry: "ID" },
};
```

As the first child of `<main>`:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
```

Add `import { SITE_URL } from "@/lib/site";` to the imports.

- [ ] **Step 4: Install Playwright and write `playwright.config.ts`**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 0,
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure" },
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    timeout: 300_000,
    reuseExistingServer: false,
    env: { ...(process.env as Record<string, string>), CONTACT_DRY_RUN: "1" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

Append to `.gitignore`:

```
/playwright-report/
/test-results/
lighthouse*.json
```

- [ ] **Step 5: Write `e2e/smoke.spec.ts`**

```ts
import { expect, test } from "@playwright/test";

test("home renders without console or page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Miftahul");
  await expect(page.getByRole("heading", { name: "Services", level: 2 })).toBeVisible();
  await page.mouse.wheel(0, 4000);
  await expect(page.locator("#contact")).toBeVisible();
  expect(errors).toEqual([]);
});

test("featured project opens its case study and goes back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /read case study/i }).click();
  await expect(page).toHaveURL(/\/projects\/sipresma$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student Achievement Information System");
  await page.getByRole("link", { name: /back to work/i }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test("unknown case study returns 404", async ({ page }) => {
  const res = await page.goto("/projects/does-not-exist");
  expect(res?.status()).toBe(404);
});

test("command palette opens with Ctrl+K and filters", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.type("linkedin");
  await expect(dialog.getByText("Open LinkedIn profile")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("contact form submits (dry run)", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Message").fill("This is an automated smoke test.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText("Message sent, Test.")).toBeVisible();
});

test("language choice persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch language to Indonesian" }).click();
  await expect(page.getByRole("navigation", { name: "Utama" })).toContainText("/karya");
  await page.reload();
  await expect(page.getByRole("navigation", { name: "Utama" })).toContainText("/karya");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("no horizontal scroll at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/projects/sipresma"]) {
    await page.goto(path);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, path).toBeLessThanOrEqual(390);
  }
});

test("templates still render", async ({ page }) => {
  const res = await page.goto("/temacoffe");
  expect(res?.status()).toBe(200);
  await expect(page.getByText("MabroCoffee").first()).toBeVisible();
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("https://miftahulhuda.vercel.app/projects/sipresma");
  expect((await request.get("/robots.txt")).ok()).toBe(true);
});
```

- [ ] **Step 6: Run the e2e suite**

Run: `npm run test:e2e`
Expected: all 9 pass. If "home renders without console errors" fails on a WebGL warning from headless Chromium, read the message. Only an actual `error`-level message counts. Fix real errors, such as hydration mismatches. Do not filter them out.

- [ ] **Step 7: Lighthouse (mobile)**

```bash
npx next start -p 3100 &
CHROME_PATH="$(node -e "console.log(require('playwright-core').chromium.executablePath())")" npx -y lighthouse@12 http://localhost:3100 --only-categories=performance,accessibility,seo --chrome-flags="--headless=new" --output=json --output-path=./lighthouse-mobile.json --quiet
node -e "const r=require('./lighthouse-mobile.json');for(const [k,v] of Object.entries(r.categories))console.log(k,Math.round(v.score*100))"
```

Expected: performance ≥ 85, accessibility ≥ 95, seo ≥ 95. If a score is below target, open the JSON audits (`r.audits`) with `score < 1` and fix the top items. Typical fixes: add `sizes` to images, check that the WebGL chunk is not loaded on mobile, fix contrast. Rerun. Stop the server afterwards (`kill %1`).

- [ ] **Step 8: Rewrite `README.md`**

```markdown
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
```

- [ ] **Step 9: Final gate**

Run: `npm run lint && npm run test && npm run build && npm run test:e2e`
Expected: everything green.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: SEO metadata, sitemap, JSON-LD, e2e smoke tests and README"
```

- [ ] **Step 11: Hand-off (do NOT push)**

Report to the owner:
- the commit list (`git log --oneline main..HEAD`)
- the test, e2e and Lighthouse results
- what is still waiting on content: CV, certifications, case-study fields, screenshots (`docs/content-input.md`)

Ask for permission to `git push -u origin feat/redesign-d` so that Vercel builds a preview.
