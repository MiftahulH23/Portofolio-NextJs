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
