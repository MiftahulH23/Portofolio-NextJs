# Portfolio Redesign — Desain D "Command Center"

- **Tanggal:** 2026-10-12
- **Status:** Disetujui (2026-10-12)
- **Production:** https://miftahulhuda.vercel.app
- **Input konten:** `docs/content-input.md`
- **Mockup:** https://claude.ai/artifact/QTjDHQgoQEgyVJaTispwd6 (halaman "Round 2": frame *D — Command Center*, *D — Case study*, *D — Command palette*)

## 1. Tujuan

Mengganti tampilan portfolio saat ini (tema terang krem) dengan desain D: **bento grid gelap, aksen lime, elemen 3D interaktif, dan animasi**. Tujuannya meyakinkan perekrut dan klien bahwa Miftahul adalah programmer yang kuat secara teknis.

**Kriteria sukses**
- Tampilan sesuai mockup D di desktop (≥1280px) dan rapi di HP (≤390px).
- Kubus 3D tech stack interaktif (bisa di-drag) memakai React Three Fiber.
- Form kontak benar-benar mengirim email ke `miftahulh942@gmail.com`.
- Setiap proyek punya halaman case study `/projects/[slug]`.
- Command palette ⌘K / Ctrl+K berfungsi.
- Bilingual EN/ID tetap berjalan untuk semua konten baru.
- Lighthouse (mobile) **Performance ≥ 85**, **Accessibility ≥ 95**, **SEO ≥ 95**.
- `npm run lint`, `npm run test`, `npm run build` hijau.
- Menghormati `prefers-reduced-motion` (animasi berat dan 3D dimatikan atau disederhanakan).

**Di luar scope:** blog, testimoni, auto-reply email, CMS, dark/light toggle (desain D hanya gelap), redesign halaman template `/temacoffe` & `/temahospital`.

## 2. Keputusan teknis

| Area | Keputusan | Alasan |
|---|---|---|
| Framework | Next.js 16 App Router (tetap), Turbopack | Sudah dipakai |
| Styling | Tailwind CSS v4, token warna di `globals.css` (`@theme`) | Sudah dipakai |
| Font | `next/font/google`: **Bricolage Grotesque** (display/body) + **Geist Mono** (mono) | Sesuai mockup; tanpa layout shift |
| Animasi | **`motion`** (`motion/react`) saja; hapus `framer-motion` (library yang sama, dobel) | Satu sumber, bundle lebih kecil |
| Smooth scroll | **Lenis** (`lenis/react`), mati saat reduced-motion | Nuansa premium |
| 3D | **@react-three/fiber + @react-three/drei** (sudah ada), di-load `next/dynamic` `ssr:false` hanya saat terlihat | Performa |
| Command palette | **cmdk** | Aksesibel, keyboard-first, ringan |
| Form & email | **Server Action + Resend** + **zod** (validasi client & server) | Tanpa API route terpisah, gratis 3.000 email/bulan |
| Data GitHub | GitHub GraphQL API (contribution calendar) di server, `revalidate: 86400`; fallback pola statis bila token tidak ada | Grafik kontribusi asli |
| i18n | Tetap `LanguageContext` client (EN default, simpan di `localStorage`) | Scope kecil; SEO cukup EN |
| Test | **Vitest + Testing Library** (unit/komponen), **Playwright** (smoke e2e, Chromium) | Bisa diverifikasi tanpa ditunggui |
| Lint | Ganti `eslint.config.mjs` ke flat config native `eslint-config-next` (saat ini crash) | Perbaikan bug |

## 3. Struktur halaman

### 3.1 Home `/`, urutan bento (12 kolom, baris 150px, gap 16px)

| # | Kartu | Span (kolom × baris) | Isi & animasi |
|---|---|---|---|
| 1 | Intro | 8 × 3 | Status "Available" (ping), nama + headline, CTA *Explore work*, *GitHub*, *Download CV*. Teks reveal per kata. |
| 2 | Stack Cube 3D | 4 × 3 | Kubus R3F 6 sisi (React, Laravel, Next.js, Node.js, TypeScript, MySQL), auto-rotate, drag dengan OrbitControls (zoom & pan mati), 2 cincin orbit. |
| 3 | Lokasi | 3 × 2 | Riau, Indonesia · UTC+7 · jam lokal live; radar sweep. |
| 4 | GPA | 3 × 2 | Ring progress 3.80/4.00, angka count-up saat terlihat. |
| 5 | Experience | 6 × 2 | 2 entri dari `workExperience`. |
| 6 | Marquee stack | 12 × 1 | Loop infinite, pause saat hover. |
| 7 | Heading Services | 12 × 1 | Judul section (bukan kartu). |
| 8–11 | Services | 3 × 2 masing-masing | 4 layanan dari data; ikon kubus wireframe kecil berputar. |
| 12 | Featured project | 8 × 4 | Proyek `featured: true`; jendela browser mengambang + tilt mengikuti kursor; link *Read case study*. |
| 13 | More projects | 4 × 4 | 3 proyek lain → link ke case study. |
| 14 | Process | 12 × 2 | 4 langkah; garis tergambar & titik menyala saat di-scroll. |
| 15 | Terminal | 6 × 3 | Mengetik `npx hire-miftahul --now` + output (angka dihitung dari data: jumlah skill, jumlah proyek). |
| 16 | GitHub contributions | 6 × 3 | Grid 20×7 minggu terakhir dari API; shimmer. |
| 17 | Education | 5 × 2 | Dari `education`. |
| 18 | Certifications | 7 × 2 | Dari `certifications`; **kartu disembunyikan bila data kosong** (Education melebar 12). |
| 19 | Contact | 12 × 4 | Kiri: panel lime (heading, email, Download CV, sosial). Kanan: form kontak. |

- **Header** (sticky, blur): logo `miftahul.dev`, nav `/work /about /stack /contact` (anchor), tombol Search ⌘K, EN·ID, Resume, *Hire me*.
- **Footer:** © tahun berjalan.
- **Mobile (<900px):** semua kartu 1 kolom dengan tinggi auto. Kubus 3D diganti versi CSS 3D ringan (tanpa WebGL). Nav pindah ke menu sheet.
- **Masuk viewport:** kartu muncul bertahap (fade + translateY 32px, stagger 60ms) via `motion` `whileInView`, `once: true`.
- **Hover kartu:** naik 4px dan border lebih terang. Kartu proyek mendapat tilt 3D ringan mengikuti kursor (maks 6°).

### 3.2 Case study `/projects/[slug]`

Statis via `generateStaticParams`, dengan `generateMetadata` per proyek. Urutan section mengikuti mockup:
1. Back link + nomor proyek (`01 / 04`)
2. Hero: judul, deskripsi, meta (role, timeline, stack, tombol Live/Source)
3. Screenshot utama mengambang (parallax ringan)
4. Problem (7 kolom) + My role (5 kolom)
5. Architecture: diagram node (client → server → database) dengan garis putus-putus beranimasi
6. Key features + Challenges & solutions (gaya terminal diff)
7. Results (3 angka)
8. Gallery screenshot
9. Next project (melingkar ke proyek pertama)

**Setiap field case study opsional:** section yang datanya kosong tidak dirender, jadi placeholder `[…]` tidak pernah tampil di production. Proyek tanpa data `caseStudy` tetap punya halaman versi ringkas (hero, screenshot, stack, link).

### 3.3 Command palette

Dibuka dengan `⌘K` / `Ctrl+K` atau tombol Search, ditutup dengan `Esc`. Isinya tiga grup:
- **Navigation:** Work, Services, Experience, Contact (scroll ke anchor; dari halaman lain: navigasi ke `/#id`).
- **Projects:** semua proyek → `/projects/[slug]`. Template Coffee & Hospital → `/temacoffe`, `/temahospital`.
- **Actions:** Copy email (toast "Copied"), Download CV, Switch language, Open GitHub, Open LinkedIn.

Fokus terkunci di dalam dialog (focus trap), dan tombol Search punya label aksesibel.

### 3.4 Form kontak

- **Field:** `name` (wajib, 2–80 karakter), `email` (wajib, valid), `topic` (enum: freelance | fulltime | collaboration | hi), `message` (wajib, 10–2000 karakter), `company` (**honeypot**, disembunyikan; kalau terisi → pura-pura sukses, tidak dikirim).
- **Server Action `sendContact`** (`src/app/actions/contact.ts`):
  1. Validasi zod (skema yang sama dipakai di client).
  2. Rate limit in-memory per IP: 3 kiriman / 10 menit. Kalau terlampaui → error "Too many requests".
  3. Kirim lewat Resend: `from: "Portfolio <onboarding@resend.dev>"`, `to: CONTACT_TO_EMAIL`, `replyTo: email`, subject `[Portfolio] {topic} — {name}`, isi teks + HTML sederhana.
  4. Kembalikan `{ ok: true }` atau `{ ok: false, error }`.
- **UI:** state idle → sending (tombol disabled + spinner) → success (pesan "Message sent, {nama}.", tombol *Send another*) / error (pesan di bawah form, `role="alert"`). Semua teks dua bahasa.
- Kalau `RESEND_API_KEY` tidak ada (dev), action mengembalikan error yang jelas dan mencatat log di server. Tidak crash.

## 4. Model data

`src/lib/data.ts` dipecah menjadi:

```
src/content/
  types.ts        # tipe PortfolioContent, Project, CaseStudy, Certification, dll.
  en.ts           # konten EN
  id.ts           # konten ID (override teks; data non-teks diambil dari en)
  ui.ts           # string UI (translations) en/id
  index.ts        # getContent(lang)
```

Tipe baru/perubahan:

```ts
type Project = {
  slug: string;              // "sipresma", "lps", "indogrosir-scm", "esteh-scm"
  title: string; role: string; description: string;
  image: string;             // /projects/<slug>/cover.png
  gallery?: { src: string; alt: string }[];
  technologies: string[];
  github?: string; demo?: string;
  featured: boolean;
  caseStudy?: {
    timeline?: string;
    problem?: { headline: string; body: string };
    responsibilities?: string[];
    architecture?: { label: string; title: string; detail: string }[]; // node diagram
    features?: { title: string; detail: string }[];
    challenges?: { problem: string; solution: string }[];
    results?: { value: string; label: string }[];
  };
};
type Certification = { name: string; issuer: string; year: string; url?: string };
type ProcessStep = { title: string; description: string };
// personalInfo + cvUrl: "/cv/Miftahul-Huda-CV.pdf", location, timezone
```

Test integritas memastikan `en` dan `id` punya struktur dan jumlah item yang sama, setiap `slug` unik, dan setiap path gambar ada di `public/`.

## 5. Struktur file (target)

```
src/app/
  layout.tsx                 # font, metadata dasar, <body> gelap
  (portfolio)/layout.tsx     # LanguageProvider, Lenis, Header, CommandPalette, Toaster
  (portfolio)/page.tsx       # Home bento
  (portfolio)/projects/[slug]/page.tsx
  (templates)/...            # tidak diubah
  actions/contact.ts
  sitemap.ts, robots.ts
src/components/
  layout/   Header.tsx, MobileMenu.tsx, Footer.tsx, SmoothScroll.tsx
  bento/    BentoGrid.tsx, BentoCard.tsx, IntroCard.tsx, LocationCard.tsx, GpaCard.tsx,
            ExperienceCard.tsx, StackMarquee.tsx, ServicesSection.tsx, FeaturedProject.tsx,
            ProjectList.tsx, ProcessCard.tsx, TerminalCard.tsx, ContributionsCard.tsx,
            EducationCard.tsx, CertificationsCard.tsx, ContactSection.tsx
  three/    StackCube.tsx (R3F), StackCubeCss.tsx (fallback), LazyCanvas.tsx
  case-study/ CaseHero.tsx, ArchitectureDiagram.tsx, ... (satu per section)
  command/  CommandPalette.tsx
  contact/  ContactForm.tsx
  ui/       button.tsx (dipertahankan bila masih dipakai), TiltCard.tsx (refactor)
src/content/   (lihat §4)
src/lib/   utils.ts, github.ts (fetch contributions), rate-limit.ts, contact-schema.ts
src/hooks/ useReducedMotion.ts, useLocalTime.ts
```

**Dihapus:** `inject_translations.js`, `update_lang.js`, komponen section lama (`src/components/sections/*`), `src/components/MobileNav.tsx`, `src/components/ScrollToTopButton.tsx`, `src/hooks/useMediaQuery.ts` (diganti CSS breakpoint), `src/lib/data.ts` (pindah ke `src/content/`), komponen UI yang tidak terpakai (AbstractShape, aurora-background, background-beams, background-ripple-effect, badge, card, flip-words, Globe, glowing-effect, GridBackground, hero-parallax, infinite-moving-cards, Lanyard, text-generate-effect, typewriter-effect, GeometricArt, CursorSpotlight, ScrollProgress), serta dependency `framer-motion`, `three-globe`, `react-fast-marquee`, `react-type-animation`, `next-themes` (bila sudah tidak ada import). README diganti dengan dokumentasi project (cara run, env, cara menambah proyek).

## 6. Performa & aksesibilitas

- Canvas R3F hanya di-mount saat kartu masuk viewport (IntersectionObserver). `dpr={[1, 1.5]}`, `frameloop="demand"` saat tidak terlihat, tanpa shadow map.
- Di bawah 900px **atau** reduced-motion: pakai `StackCubeCss` (tanpa WebGL), marquee/terminal/shimmer berhenti, Lenis mati.
- Gambar via `next/image` (AVIF/WebP), cover proyek `priority` hanya untuk featured.
- Ikon skill dari CDN eksternal diganti SVG lokal / `lucide`.
- Kontras teks ≥ 4.5:1 (abu `#A1A1AA` di atas `#131316` lolos). Fokus terlihat (ring lime). Semua kontrol bisa dijangkau keyboard. `aria-label` untuk tombol ikon. `lang` di `<html>` mengikuti bahasa aktif.
- SEO: metadata per halaman, Open Graph, `sitemap.ts`, `robots.ts`, JSON-LD `Person`.

## 7. Environment variables

| Variabel | Wajib | Kegunaan |
|---|---|---|
| `RESEND_API_KEY` | Ya (production) | Kirim email form kontak |
| `CONTACT_TO_EMAIL` | Ya | Penerima, default `miftahulh942@gmail.com`. **Harus sama dengan email akun Resend** selama belum memakai domain sendiri. |
| `GITHUB_TOKEN` | Tidak | Grafik kontribusi asli. Kalau kosong → pola statis. Fine-grained token tanpa permission tambahan cukup. |
| `NEXT_PUBLIC_SITE_URL` | Tidak | URL absolut untuk OG/sitemap; default `https://miftahulhuda.vercel.app`. |

`.env.example` dibuat berisi daftar ini. `.gitignore` saat ini mengabaikan `.env*`, jadi perlu ditambah `!.env.example`. Nilai asli hanya ada di `.env.local` (lokal) dan di **Vercel → Project Settings → Environment Variables** (Production + Preview).

### Deploy

Project sudah terhubung ke Vercel dengan auto-deploy:
- **Push ke `main`** → deploy production.
- **Push ke branch lain** (misalnya `feat/redesign-d`) → deploy preview dengan URL sendiri.

Rencananya, branch `feat/redesign-d` di-push **hanya setelah pemilik setuju**, dicek di URL preview, lalu di-merge ke `main`. `NEXT_PUBLIC_SITE_URL` diisi dengan domain production Vercel.

## 8. Strategi pengujian

- **Unit (Vitest):** skema zod kontak, rate limiter, server action `sendContact` (Resend di-mock: sukses, gagal, honeypot, rate-limit), integritas konten EN/ID, parser data GitHub + fallback, filter command palette.
- **Komponen (Testing Library):** ContactForm (validasi, state sukses/error), CommandPalette (buka dengan Ctrl+K, filter, Esc), section case study tidak dirender saat data kosong.
- **E2E smoke (Playwright, Chromium):** home tampil tanpa error console; navigasi ke case study dan kembali; ⌘K membuka palette; form kontak dengan action di-mock menampilkan sukses; viewport 390px tanpa scroll horizontal.
- **Gate setiap tahap:** `npm run lint && npm run test && npm run build`.

## 9. Rencana kerja (tahapan; detail di implementation plan)

1. Fondasi: branch `feat/redesign-d`, perbaiki ESLint, pasang Vitest/Playwright, font, token warna, hapus kode mati.
2. Model konten baru (`src/content/*`) + test integritas.
3. Layout: Header, MobileMenu, Footer, Lenis, BentoGrid/BentoCard.
4. Kartu bento statis (semua kecuali 3D, GitHub, form).
5. Kubus 3D R3F + fallback CSS + lazy load.
6. GitHub contributions (server) + fallback.
7. Form kontak (schema, action, rate limit, UI).
8. Command palette.
9. Halaman case study.
10. SEO, aksesibilitas, performa (Lighthouse), README, `.env.example`.

Setiap tahap di-commit terpisah. **Tidak ada push** ke remote tanpa izin.

## 10. Risiko

- **Konten case study belum lengkap** → section tersembunyi otomatis; halaman tetap layak tampil.
- **Resend tanpa domain** hanya bisa mengirim ke email pemilik akun → `CONTACT_TO_EMAIL` harus sama dengan email akun Resend.
- **Performa WebGL di HP murah** → fallback CSS di bawah 900px.
- **Next.js 16 + R3F 9 + React 19** → versi sudah kompatibel. Kalau ada konflik peer dependency, kunci versi yang terbukti jalan, dan jangan pakai `--force`.
