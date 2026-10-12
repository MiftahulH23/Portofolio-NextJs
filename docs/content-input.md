# Content Input: diisi oleh Miftahul

Isi bagian yang ingin ditampilkan di website. **Bagian yang dibiarkan kosong tidak akan tampil**, jadi tidak ada placeholder yang muncul di website.
Tulis dalam Bahasa Inggris. Versi Indonesia opsional dan boleh diisi di bawah setiap bagian (`ID:`). Kalau kosong, versi ID akan saya terjemahkan dari teks Inggris.

File gambar dan CV ditaruh di folder berikut (buat foldernya kalau belum ada):

| File | Lokasi |
|---|---|
| CV (PDF) | `public/cv/Miftahul-Huda-CV.pdf` |
| Cover proyek (1 per proyek, lebar ≥1600px) | `public/projects/<slug>/cover.png` |
| Screenshot tambahan (0–3 per proyek) | `public/projects/<slug>/1.png`, `2.png`, `3.png` |

Slug proyek: `sipresma` · `lps` · `indogrosir-scm` · `esteh-scm`

---

## 1. Certifications

Salin blok ini untuk setiap sertifikat.

```
- name:
  issuer:
  year:
  url:            # link verifikasi (opsional)
```

---

## 2. Case studies

Isi sebanyak yang Anda bisa. Semua field opsional.

### 2.1 sipresma: Student Achievement Information System

```
timeline:          # contoh: Feb 2025 — Jul 2025
team:              # contoh: solo / tim 3 orang (opsional)

problem_headline:  # 1 kalimat: apa yang bermasalah sebelum sistem ini ada
problem_body:      # 2–4 kalimat: bagaimana proses lama berjalan, siapa yang terdampak

responsibilities:  # apa yang Anda kerjakan sendiri
  -
  -
  -

architecture:      # komponen utama sistem (sudah terisi, koreksi bila salah)
  - client:   React + Inertia.js (Shadcn/UI, TailwindCSS)
  - server:   Laravel
  - database: MySQL
  - other:          # contoh: storage file, email, deploy di mana

features:          # fitur utama + 1 kalimat penjelasan
  - Competition proposal submission:
  - Achievement records:
  -
  -

challenges:        # masalah teknis tersulit dan cara Anda menyelesaikannya
  - problem:
    solution:
  - problem:
    solution:

results:           # angka/hasil nyata saja; kosongkan jika tidak ada
  - value:           label:
  - value:           label:
  - value:           label:
```

### 2.2 lps: Waste Management Institution System

```
timeline:
team:
problem_headline:
problem_body:
responsibilities:
  -
architecture:
  - client:   React + Inertia.js + TypeScript (Shadcn/UI, TailwindCSS)
  - server:   Laravel
  - database:
features:
  - Resident data management:
  - Monthly fees:
  - Waste collection records:
challenges:
  - problem:
    solution:
results:
  - value:           label:
```

### 2.3 indogrosir-scm: Supply Chain Dashboard & Website Redesign

```
timeline:
team:
problem_headline:
problem_body:
responsibilities:
  -
architecture:
  - client:   JavaScript, HTML, CSS, TailwindCSS
  - server:   C# / .NET
  - database:
features:
  -
challenges:
  - problem:
    solution:
results:
  - value:           label:
```

### 2.4 esteh-scm: Supply Chain Management, Es Teh Indonesia

```
timeline:
team:
problem_headline:
problem_body:
responsibilities:
  -
architecture:
  - client:   React.js
  - server:   Node.js + Express.js
  - database: MongoDB
features:
  - Demand requests:
  - Inventory:
  - Product distribution:
challenges:
  - problem:
    solution:
results:
  - value:           label:
```

---

## 3. Lain-lain (opsional)

```
currently_learning:   # contoh: WebGPU, Go (untuk kartu kecil di home)
featured_project:     # slug proyek unggulan (default: sipresma)
```
