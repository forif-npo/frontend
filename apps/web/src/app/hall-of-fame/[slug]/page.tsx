import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@ui/components/server";
import { getHallOfFameEntry } from "@/features/hall-of-fame/api";
import { HallOfFameDetailView } from "@/features/hall-of-fame/HallOfFameDetailView";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getHallOfFameEntry(slug);

  if (!entry) return { title: "명예의 전당 | FORIF" };

  return {
    title: `${entry.member_name} | FORIF 명예의 전당`,
    description:
      entry.headline ??
      `${entry.semester_label} FORIF 명예의 전당에 소개된 ${entry.member_name}님의 이야기입니다.`,
  };
}

export default async function HallOfFameDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getHallOfFameEntry(slug);

  if (!entry) notFound();

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "명예의 전당", href: "/hall-of-fame" },
            { label: entry.member_name },
          ]}
        />
      </div>
      <HallOfFameDetailView entry={entry} />
    </main>
  );
}
