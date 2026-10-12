// Kept free of zod so client components can render topic chips without pulling the validator into the initial bundle.
export const TOPICS = ["freelance", "fulltime", "collaboration", "hi"] as const;
export type Topic = (typeof TOPICS)[number];
