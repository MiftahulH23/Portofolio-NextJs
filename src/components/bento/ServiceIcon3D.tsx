import { Layers, Monitor, Server, Smartphone, type LucideIcon } from "lucide-react";
import type { ServiceIcon } from "@/content";

const ICONS: Record<ServiceIcon, LucideIcon> = { frontend: Monitor, backend: Server, fullstack: Layers, mobile: Smartphone };

/** The service's glyph in its card's gate colour. */
export function ServiceIcon3D({ icon }: { icon: ServiceIcon }) {
  const Icon = ICONS[icon];
  return (
    <span data-service-icon={icon} aria-hidden="true" className="grid size-11 place-items-center rounded-lg bg-white/[.05] text-[var(--gate)]">
      <Icon className="size-6" strokeWidth={1.8} />
    </span>
  );
}
