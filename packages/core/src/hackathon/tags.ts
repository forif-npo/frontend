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
  "기타",
] as const;

export const HACKATHON_TECH_STACK_LIMIT = 4;

export type HackathonTechStack = (typeof HACKATHON_TECH_STACK_OPTIONS)[number];

export function isHackathonTechStack(
  value: string,
): value is HackathonTechStack {
  return HACKATHON_TECH_STACK_OPTIONS.includes(value as HackathonTechStack);
}
