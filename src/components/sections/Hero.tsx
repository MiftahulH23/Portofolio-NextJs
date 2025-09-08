"use client";

import React from "react";
import { HeroParallax } from "../ui/hero-parallax";
import { portfolioData } from "@/lib/data";

// Mengambil 5 proyek pertama untuk ditampilkan di parallax
const products = portfolioData.projects.slice(0, 5).map(project => ({
  title: project.title,
  link: "#projects", // Link ke section proyek
  thumbnail: `/thumbnails/${project.title.toLowerCase().replace(/\s+/g, '-')}.png`, // Contoh path thumbnail
}));

export default function Hero() {
  return (
    <HeroParallax products={products} />
  );
}