export interface RateLimiter {
  check(key: string): boolean;
}

export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
  };
}
