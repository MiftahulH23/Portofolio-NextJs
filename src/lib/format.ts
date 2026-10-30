export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** "850 m" under a kilometre, "1.25 km" from there on. */
export function distance(meters: number, locale: string): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`;
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}
