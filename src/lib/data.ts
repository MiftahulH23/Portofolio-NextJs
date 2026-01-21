export const portfolioData = {
  personalInfo: {
    name: "Miftahul Huda",
    headline: "Full-Stack Web Developer",
    summary:
      "Pengembang web dengan kemampuan Full-Stack yang adaptif terhadap berbagai teknologi modern. Memiliki pengalaman profesional dalam merancang arsitektur sistem yang aman dan user-friendly, mulai dari proyek akademis hingga aplikasi korporat di industri perbankan",
    email: "miftahulh942@gmail.com",
    phone: "+6282252209655",
    linkedin: "https://linkedin.com/in/miftahulhuda23",
    github: "https://github.com/MiftahulH23",
    instagram: "https://instagram.com/miftahulhuda23_",
  },
  education: {
    institution: "Politekenik Caltex Riau",
    degree: "Sarjana Terapan Sistem Informasi",
    gpa: "3.80/4.00",
    duration: "Sep 2021 - Oct 2025",
  },
  workExperience: [
    {
      company: "PT Bank Riau Kepri Syariah",
      position: "Web Developer Intern",
      duration: "Feb 2024 - Jun 2024",
      achievements: [
        "Berhasil merancang dan mengembangkan sistem absensi berbasis web dari nol untuk peserta pelatihan internal menggunakan Laravel & MySQL.",
        "Meningkatkan pengalaman pengguna dengan mengimplementasikan antarmuka yang responsif dan intuitif menggunakan TailwindCSS.",
        "Menerjemahkan kebutuhan bisnis dari analisis bagian Manajemen Sumber Daya Insani (MSDI) menjadi fitur fungsional yang efektif untuk manajemen pelatihan.",
        "Memastikan performa optimal aplikasi di berbagai perangkat (desktop & mobile) melalui pengujian dan optimasi kode.",
      ],
    },
  ],
  projects: [
    {
      title: "Sistem Informasi Prestasi Mahasiswa",
      role: "Full-Stack Developer",
      image: "/thumbnails/sistem-informasi-prestasi-mahasiswa.png",
      github:
        "https://github.com/MiftahulH23/sistem-informasi-prestasi-mahasiswa",
      demo: "https://sipresma.pocari.id/",
      description:
        "Sistem informasi terintegrasi untuk mengelola dan mendokumentasikan prestasi mahasiswa, mulai dari pengajuan proposal lomba hingga pencatatan pencapaian.",
      technologies: [
        "Laravel",
        "Inertia.js",
        "React.js (JSX)",
        "TailwindCSS",
        "Shadcn/UI",
        "MySQL",
      ],
    },
    {
      title: "Sistem Lembaga Pengelola Sampah (LPS)",
      role: "Full-Stack Developer",
      image: "/thumbnails/sistem-lembaga-pengelola-sampah-(lps).png",
      github: "https://github.com/MiftahulH23/LembagaPengelolaSampah",
      demo: "https://silepaspku.pocari.id/",
      description:
        "Aplikasi berbasis web untuk membantu LPS dalam manajemen data warga, iuran bulanan, dan pencatatan pengambilan sampah.",
      technologies: [
        "Laravel",
        "Inertia.js",
        "React.js (TSX)",
        "TypeScript",
        "TailwindCSS",
        "Shadcn/UI",
      ],
    },
    {
      title: "Dashboard Supply Chain & Redesign Website",
      role: "Full-Stack Developer",
      image: "/thumbnails/dashboard-supply-chain-&-redesign-website.png",
      github: "https://github.com/hibatillah/indogrosir-scm",
      demo: "https://github.com/hibatillah/indogrosir-scm",
      description:
        "Proyek akademis berfokus pada perancangan ulang website dan pengembangan dashboard SCM untuk meningkatkan pengalaman pengguna serta efisiensi operasional.",
      technologies: ["C#", ".Net", "JavaScript", "HTML", "CSS", "TailwindCSS"],
    },
    {
      title: "Supply Chain Management System - Es Teh Indonesia",
      role: "Full-Stack Developer",
      image:
        "/thumbnails/supply-chain-management-system---es-teh-indonesia.png",
      github: "https://github.com/MiftahulH23/Capstone",
      demo: "https://github.com/MiftahulH23/Capstone",
      description:
        "Sistem manajemen rantai pasok untuk membantu mitra dan manajemen pusat dalam mengelola proses permintaan, stok, dan distribusi produk.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
    },
  ],
  skills: {
    "Front-End": [
      { name: "React.js", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      {
        name: "JavaScript",
        icon: "https://cdn.simpleicons.org/javascript/F7DF1E",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.simpleicons.org/typescript/3178C6",
      },
      {
        name: "Inertia.js",
        icon: "https://cdn.simpleicons.org/inertia/9553E9",
      },
      { name: "HTML5", icon: "https://cdn.simpleicons.org/html5/E34F26" },
      // FIX: Ganti CSS3 pakai Devicon
      {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        name: "TailwindCSS",
        icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      },
    ],
    "Back-End": [
      { name: "PHP", icon: "https://cdn.simpleicons.org/php/777BB4" },
      { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
      { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
      {
        name: "Express.js",
        icon: "https://cdn.simpleicons.org/express/000000/white",
      },
      // FIX: Ganti C# pakai Devicon
      {
        name: "C#",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      },
      { name: ".NET", icon: "https://cdn.simpleicons.org/dotnet/512BD4" },
      // FIX: Ganti RESTful API pakai icon ilustrasi berwarna
      {
        name: "RESTful API",
        icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-api-web-development-flaticons-lineal-color-flat-icons-2.png",
      },
    ],
    Database: [
      { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
      {
        name: "PostgreSQL",
        icon: "https://cdn.simpleicons.org/postgresql/4169E1",
      },
      { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
    ],
    "Tools & Lainnya": [
      { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
      { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
      // FIX: Ganti Manual Testing pakai icon ilustrasi berwarna
      {
        name: "Manual Testing",
        icon: "https://img.icons8.com/?size=100&id=gVFxgvqeu7IV&format=png&color=000000",
      },
    ],
  },
};
