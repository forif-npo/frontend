export const FAQ_TAGS = [
  "동아리소개",
  "스터디",
  "지원",
  "회비",
  "활동",
] as const;

export type FaqTag = (typeof FAQ_TAGS)[number];

export const FAQ_TAG_STYLE: Record<
  string,
  { className: string; label?: string }
> = {
  지원: {
    className: "bg-blue-50 border-blue-200 text-blue-700 px-3 py-0.5",
  },
  스터디: {
    className: "bg-green-50 border-green-200 text-green-700 px-3 py-0.5",
  },
  행사: {
    className: "bg-red-50 border-red-200 text-red-700 px-3 py-0.5",
  },
  기타: {
    className: "bg-gray-50 border-gray-200 text-gray-700 px-3 py-0.5",
  },
};

export const getFaqTagClassName = (tag: string) => {
  return FAQ_TAG_STYLE[tag] ?? "border-gray-40 bg-gray-0 text-gray-90";
};
