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
