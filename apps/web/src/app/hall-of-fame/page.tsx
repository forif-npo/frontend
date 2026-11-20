import type { Metadata } from "next";
import { Button } from "@ui/components/client";
import { Link, PageState } from "@ui/components/server";
import { PageHeader } from "@/components/PageHeader";
import { getHallOfFameEntries } from "@/features/hall-of-fame/api";
import { HallOfFameListView } from "@/features/hall-of-fame/HallOfFameListView";

export const metadata: Metadata = {
  title: "명예의 전당 | FORIF",
  description:
    "FORIF와 함께 성장하며 의미 있는 발자취를 남긴 구성원들의 이야기입니다.",
};

export default async function HallOfFamePage() {
  let entries;

  try {
    entries = await getHallOfFameEntries();
  } catch {
    return (
      <PageState
        eyebrow="명예의 전당"
        title="명예의 전당을 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
        actions={
          <Link href="/hall-of-fame">
            <Button variant="primary">다시 시도</Button>
          </Link>
        }
      />
    );
  }

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[{ label: "홈", href: "/" }, { label: "명예의 전당" }]}
        title="명예의 전당"
        description="FORIF와 함께 성장하며 의미 있는 발자취를 남긴 구성원들의 이야기입니다."
      />
      <HallOfFameListView entries={entries} />
    </main>
  );
}
