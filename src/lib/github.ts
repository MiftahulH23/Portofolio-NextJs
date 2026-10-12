export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
  source: "github" | "fallback";
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

export function levelFor(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

interface RawDay {
  date: string;
  contributionCount: number;
}

export function parseCalendar(json: unknown, weeks = 20): Contributions | null {
  const calendar = (json as {
    data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions: number; weeks: { contributionDays: RawDay[] }[] } } } };
  } | null)?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar || !Array.isArray(calendar.weeks)) return null;

  const raw = calendar.weeks.slice(-weeks).flatMap((w) => w.contributionDays);
  const max = Math.max(0, ...raw.map((d) => d.contributionCount));
  return {
    total: calendar.totalContributions,
    days: raw.map((d) => ({ date: d.date, count: d.contributionCount, level: levelFor(d.contributionCount, max) })),
    source: "github",
  };
}

export function fallbackContributions(weeks = 20): Contributions {
  const days: ContributionDay[] = Array.from({ length: weeks * 7 }, (_, i) => {
    const level = ((i * 11 + Math.floor(i / 7) * 3) % 5) as 0 | 1 | 2 | 3 | 4;
    return { date: "", count: level, level };
  });
  return { total: 0, days, source: "fallback" };
}

export async function getContributions(login: string, weeks = 20): Promise<Contributions> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return fallbackContributions(weeks);
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    } as RequestInit);
    if (!res.ok) return fallbackContributions(weeks);
    return parseCalendar(await res.json(), weeks) ?? fallbackContributions(weeks);
  } catch (error) {
    console.error("[github] contributions fetch failed", error);
    return fallbackContributions(weeks);
  }
}
