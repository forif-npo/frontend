export const HACKATHON_TECH_STACK_OPTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Vite",
  "Spring Boot",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Supabase",
  "OpenAI API",
  "ChatGPT",
  "Vercel",
  "GitHub",
] as const;

export const HACKATHON_TECH_STACK_LIMIT = 4;

export type HackathonTechStack = (typeof HACKATHON_TECH_STACK_OPTIONS)[number];

export function normalizeHackathonTechStack(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function canonicalizeHackathonTechStack(value: string) {
  const normalized = normalizeHackathonTechStack(value);
  return (
    HACKATHON_TECH_STACK_OPTIONS.find(
      (option) => normalizeHackathonTechStack(option) === normalized,
    ) ?? value.trim().replace(/\s+/g, " ")
  );
}

export function isHackathonTechStack(
  value: string,
): value is HackathonTechStack {
  return HACKATHON_TECH_STACK_OPTIONS.some(
    (option) =>
      normalizeHackathonTechStack(option) ===
      normalizeHackathonTechStack(value),
  );
}
