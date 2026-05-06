const fs = require('fs');

const files = [
  "src/components/ui/Lanyard.tsx",
  "src/components/ui/hero-parallax.tsx",
  "src/components/sections/Services.tsx",
  "src/components/sections/Skills.tsx",
  "src/components/sections/Hero.tsx",
  "src/components/sections/Projects.tsx",
  "src/components/sections/Experience.tsx",
  "src/components/sections/Education.tsx",
  "src/components/sections/ContactCTA.tsx",
  "src/components/sections/About.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace import
  content = content.replace(/import\s+\{\s*portfolioData\s*\}\s*from\s+["']@\/lib\/data["'];?/, 'import { useLanguage } from "@/context/LanguageContext";');
  
  // Inject hook
  const componentMatch = content.match(/export (?:default )?function ([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/);
  if (componentMatch) {
    // Check if we already injected
    if (!content.includes('const { data: portfolioData')) {
      const insertPos = componentMatch.index + componentMatch[0].length;
      content = content.slice(0, insertPos) + '\n  const { data: portfolioData, t } = useLanguage();' + content.slice(insertPos);
    }
  } else {
    // Maybe an arrow function: export const Lanyard = () => {
    const arrowMatch = content.match(/export const ([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*\{/);
    if (arrowMatch && !content.includes('const { data: portfolioData')) {
      const insertPos = arrowMatch.index + arrowMatch[0].length;
      content = content.slice(0, insertPos) + '\n  const { data: portfolioData, t } = useLanguage();' + content.slice(insertPos);
    }
  }
  
  fs.writeFileSync(file, content);
}

// Extract Footer from page.tsx to Footer.tsx
const pageContent = fs.readFileSync("src/app/page.tsx", "utf8");
const footerRegex = /{\/\* Footer \*\/}[\s\S]*?(?=<\/main>|<\/>)/;
const footerMatch = pageContent.match(footerRegex);

if (footerMatch) {
  let footerCode = footerMatch[0];
  // Create Footer.tsx
  const footerTsx = `"use client";
import { Github, Linkedin, Instagram, Heart, Coffee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { data: portfolioData, t } = useLanguage();
  return (
    ${footerCode}
  );
}`;
  fs.writeFileSync("src/components/sections/Footer.tsx", footerTsx);
  
  // Update page.tsx
  let newPageContent = pageContent.replace(footerMatch[0], "<Footer />\n      ");
  newPageContent = newPageContent.replace(/import \{\s*portfolioData\s*\} from "@\/lib\/data";\n/, "");
  newPageContent = newPageContent.replace(/import \{\s*Github,\s*Linkedin,\s*Instagram,\s*Heart,\s*Coffee\s*\} from "lucide-react";\n/, "");
  newPageContent = "import Footer from \"@/components/sections/Footer\";\n" + newPageContent;
  
  fs.writeFileSync("src/app/page.tsx", newPageContent);
}

console.log("Done updating files!");
