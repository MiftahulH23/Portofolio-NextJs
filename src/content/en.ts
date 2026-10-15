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
  highlightStack: ["Laravel", "React.js", "Next.js", "TypeScript", "Node.js", "Inertia.js", "TailwindCSS", "MySQL"],
  process: [
    { title: "Discover", description: "Understand the business goal, users and constraints." },
    { title: "Design", description: "Data model, architecture and UI flow before code." },
    { title: "Build", description: "Iterative sprints with clean, tested, reviewed code." },
    { title: "Ship", description: "Deploy, monitor and hand over with documentation." },
  ],
  certifications: [],
};
