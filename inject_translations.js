const fs = require('fs');

const replaces = {
  "src/components/sections/Hero.tsx": [
    ["Available for work", "{t.hero.available}"],
    ["Let&apos;s build", "{t.hero.letsBuild}"],
    [">something<", ">{t.hero.something}<"],
    ["Send Email", "{t.hero.sendEmail}"],
    ["Book a Call", "{t.hero.bookCall}"],
    [">Scroll<", ">{t.hero.scroll}<"]
  ],
  "src/components/sections/About.tsx": [
    ["01 — About Me", "01 — {t.about.title}"],
    [">ABOUT<", ">ABOUT<"]
  ],
  "src/components/sections/Skills.tsx": [
    ["02 — My Skills", "02 — {t.skills.title}"],
  ],
  "src/components/sections/Services.tsx": [
    ["03 — What I Do", "03 — {t.services.title}"],
  ],
  "src/components/sections/Experience.tsx": [
    ["05 — Experience", "05 — {t.experience.title}"],
  ],
  "src/components/sections/Projects.tsx": [
    ["06 — Projects", "06 — {t.projects.title}"],
    [">Featured<", ">{t.projects.featured}<"]
  ],
  "src/components/sections/ContactCTA.tsx": [
    ["07 — Let&apos;s Talk", "07 — {t.contact.title}"],
    ["Let&apos;s work", "{t.contact.heading.split(' ')[0]} {t.contact.heading.split(' ')[1] || ''}"],
    ["together<", "{t.contact.heading.split(' ').slice(2).join(' ')}<"],
    ["Have a project in mind or looking for a developer to join your team?\\n          I&apos;d love to hear from you.", "{t.contact.desc}"]
  ],
  "src/components/sections/Header.tsx": [
    ['{ name: "Home", href: "#home" }', '{ name: t.nav.home, href: "#home" }'],
    ['{ name: "About", href: "#about" }', '{ name: t.nav.about, href: "#about" }'],
    ['{ name: "Services", href: "#services" }', '{ name: t.nav.services, href: "#services" }'],
    ['{ name: "Experience", href: "#experience" }', '{ name: t.nav.experience, href: "#experience" }'],
    ['{ name: "Projects", href: "#projects" }', '{ name: t.nav.projects, href: "#projects" }']
  ]
};

for (const [file, rules] of Object.entries(replaces)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of rules) {
      content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
  }
}

// MobileNav
if (fs.existsSync("src/components/MobileNav.tsx")) {
  let content = fs.readFileSync("src/components/MobileNav.tsx", "utf8");
  content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useLanguage } from "@/context/LanguageContext";');
  content = content.replace('const navItems = [', '/* navItems moved inside component */');
  content = content.replace('export function MobileNav() {', `export function MobileNav() {\n  const { t } = useLanguage();\n  const navItems = [\n    { name: t.nav.home, href: "#home" },\n    { name: t.nav.skills, href: "#skills" },\n    { name: t.nav.education, href: "#education" },\n    { name: t.nav.experience, href: "#experience" },\n    { name: t.nav.projects, href: "#projects" },\n  ];`);
  
  fs.writeFileSync("src/components/MobileNav.tsx", content);
}

console.log("Translations injected!");
