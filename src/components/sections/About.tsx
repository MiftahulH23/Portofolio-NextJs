"use client";
import { portfolioData } from "@/lib/data";
import { motion } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Mail,
  Phone,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

export default function About() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="about"
      className="py-20 w-full bg-neutral-50/50 dark:bg-neutral-900/30 border-y border-neutral-200 dark:border-white/5"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          {/* Kolom Kiri */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-blue-500">/</span> Tentang Saya
              </h2>

              <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg mb-8">
                <p>
                  Halo! Saya{" "}
                  <span className="text-neutral-900 dark:text-white font-semibold">
                    {portfolioData.personalInfo.name}
                  </span>
                  .
                </p>
                <p>{portfolioData.personalInfo.summary}</p>
              </div>
            </div>

            {/* Kontak */}
            <div className="mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-neutral-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Siap untuk Peluang Baru
              </h3>

              <div className="flex flex-col gap-3">
                {/* Email Card - Fix background & text color */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-colors shadow-sm">
                  <div className="p-2 bg-blue-500/10 rounded-md text-blue-600 dark:text-blue-500">
                    <Mail size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-neutral-500">Email</p>
                    <a
                      href={`mailto:${portfolioData.personalInfo.email}`}
                      className="text-sm text-neutral-800 dark:text-neutral-200 hover:text-blue-500 transition-colors"
                    >
                      {portfolioData.personalInfo.email}
                    </a>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-green-500/50 transition-colors shadow-sm">
                  <div className="p-2 bg-green-500/10 rounded-md text-green-600 dark:text-green-500">
                    <Phone size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs text-neutral-500">Phone / WhatsApp</p>
                    <a
                      href={`https://wa.me/${portfolioData.personalInfo.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      className="text-sm text-neutral-800 dark:text-neutral-200 hover:text-green-500 transition-colors"
                    >
                      {portfolioData.personalInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Stats Cards - Fix bg & text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: GraduationCap,
                title: "Lulusan",
                subtitle: portfolioData.education.institution,
                meta: `GPA: ${portfolioData.education.gpa}`,
                color: "text-blue-500",
                bgMeta: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
              },
              {
                icon: Briefcase,
                title: "Pengalaman",
                subtitle: "Internship di Bank Riau Kepri Syariah",
                meta: "Full-Stack Implementation",
                color: "text-green-500",
                bgMeta: "text-neutral-500",
              },
              {
                icon: MapPin,
                title: "Lokasi",
                subtitle: "Riau, Indonesia",
                meta: "Remote / On-site",
                color: "text-red-500",
                bgMeta: "text-neutral-500",
              },
              {
                icon: Code,
                title: "Fokus Utama",
                subtitle: "Web Development",
                meta: "Laravel & React Ecosystem",
                color: "text-purple-500",
                bgMeta: "text-neutral-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-colors group shadow-sm"
              >
                <item.icon
                  className={`w-8 h-8 ${item.color} mb-3 group-hover:scale-110 transition-transform`}
                />
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {item.subtitle}
                </p>
                <p
                  className={`text-xs mt-2 ${item.bgMeta.includes("bg-") ? `inline-block px-2 py-1 rounded font-mono ${item.bgMeta}` : item.bgMeta}`}
                >
                  {item.meta}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
