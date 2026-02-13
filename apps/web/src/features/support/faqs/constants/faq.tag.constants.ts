export const FAQ_TAGS = [
  "동아리소개",
  "스터디",
  "지원",
  "회비",
  "활동",
] as const;

export type FaqTag = (typeof FAQ_TAGS)[number];

export const FAQ_TAG_STYLE: Record<string, string> = {
  동아리소개: "border-blue-40 bg-blue-5 text-blue-90",
  스터디: "border-green-40 bg-green-5 text-green-90",
  지원: "border-purple-40 bg-purple-5 text-purple-90",
  회비: "border-red-40 bg-red-5 text-red-90",
  활동: "border-cyan-40 bg-cyan-5 text-cyan-90",
};

export const getFaqTagClassName = (tag: string) => {
  return FAQ_TAG_STYLE[tag] ?? "border-gray-40 bg-gray-0 text-gray-90";
};
