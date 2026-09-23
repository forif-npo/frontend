"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { CLUB_RULE_REVISIONS, CURRENT_RULE_REVISION_ID } from "@/constants/club-rule";
import { Select } from "@ui/components/client";
import { PageHeader } from "@/components/PageHeader";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const getRuleChapterNavItems = (content: string) =>
  content.split("\n").flatMap((line) => {
    const chapterMatch = line.match(/^# (\d+)장 .+$/);

    return chapterMatch
      ? [{ id: Number(chapterMatch[1]), label: line.replace(/^# /, "") }]
      : [];
  });

const getPreviousNonEmptyLine = (lines: string[], lineIndex: number) => {
  for (let index = lineIndex - 1; index >= 0; index -= 1) {
    const line = lines[index].trimStart();

    if (line !== "") return line;
  }

  return "";
};

const getNextNonEmptyLine = (lines: string[], lineIndex: number) => {
  for (let index = lineIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trimStart();

    if (line !== "") return line;
  }

  return "";
};

export default function RulePage() {
  const [selectedRevisionId, setSelectedRevisionId] = useState(
    CURRENT_RULE_REVISION_ID,
  );
  const selectedRevision =
    CLUB_RULE_REVISIONS.find(
      (revision) => revision.id === selectedRevisionId,
    ) ?? CLUB_RULE_REVISIONS[0];
  const ruleChapterNavItems = getRuleChapterNavItems(selectedRevision.content);
  const ruleChapterIds = ruleChapterNavItems.map(({ id }) => String(id));
  const activeChapterId = useScrollSpy(ruleChapterIds, { offset: 140 });
  const ruleLines = selectedRevision.content.split("\n");

  const scrollToChapter = (chapter: number) => {
    const section = document.getElementById(String(chapter));

    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - 112,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="max-w-main mx-auto w-full px-4 py-10 lg:px-0">
      <PageHeader
        breadcrumbs={[
          { label: "홈", href: "/" },
          { label: "동아리", href: "/club" },
          { label: "회칙" },
        ]}
        title="회칙"
        description="모든 포리프 행사 및 활동은 회칙에 근거합니다."
        action={
          <div className="w-full sm:w-64">
            <Select
              id="club-rule-revision"
              size="sm"
              value={selectedRevision.id}
              onChange={setSelectedRevisionId}
              placeholder="개정판 선택"
              options={CLUB_RULE_REVISIONS.map((revision) => ({
                value: revision.id,
                label: `${revision.revisionDate}. ${revision.amendmentType}`,
              }))}
              dropdownAlign="right"
            />
          </div>
        }
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="prose prose-sm min-w-0 max-w-none flex-1">
          {ruleLines.map((line, i) => {
            const trimmed = line.trimStart();
            const previousNonEmptyLine = getPreviousNonEmptyLine(ruleLines, i);
            const nextNonEmptyLine = getNextNonEmptyLine(ruleLines, i);
            const isFirstArticleInChapter =
              trimmed.startsWith("## ") &&
              previousNonEmptyLine.startsWith("# ");
            const isBlankBeforeFirstArticle =
              trimmed === "" &&
              previousNonEmptyLine.startsWith("# ") &&
              nextNonEmptyLine.startsWith("## ");

            if (trimmed.startsWith("# ")) {
              const chapterMatch = trimmed.match(/^# (\d+)장/);
              const chapterNum = chapterMatch
                ? Number(chapterMatch[1])
                : undefined;
              return (
                <h2
                  key={i}
                  id={chapterNum ? String(chapterNum) : undefined}
                  className={`mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900 ${
                    i === 0 ? "mt-0" : "mt-12"
                  }`}
                >
                  {trimmed.replace(/^# /, "")}
                </h2>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3
                  key={i}
                  className={`mb-2 text-lg font-semibold text-gray-800 ${
                    isFirstArticleInChapter ? "mt-4" : "mt-6"
                  }`}
                >
                  {trimmed.replace(/^## /, "")}
                </h3>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h4
                  key={i}
                  className="mb-2 mt-4 text-base font-semibold text-gray-700"
                >
                  {trimmed.replace(/^### /, "")}
                </h4>
              );
            }
            if (isBlankBeforeFirstArticle) return null;
            if (trimmed === "") return <div key={i} className="h-2" />;
            if (trimmed.match(/^\d+\./)) {
              return (
                <p
                  key={i}
                  className="my-1 pl-4 text-base leading-7 text-gray-700"
                >
                  {trimmed}
                </p>
              );
            }
            return (
              <p key={i} className="my-1 text-base leading-7 text-gray-700">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* 스크롤 시 화면 상단 120px에 목차를 고정한다. 스터디 상세 목차(StudyDetailNavigation)와 같은 값. */}
        <div className="sticky top-[120px] hidden h-fit w-[160px] shrink-0 self-start md:block">
          <div className="flex gap-3">
            <div className="my-7 w-[3px] rounded bg-gray-200" />
            <div className="flex flex-col gap-1">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                회칙 목록
              </p>
              {ruleChapterNavItems.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToChapter(id)}
                  className={`relative rounded-sm py-0.5 pl-3 text-left text-sm font-medium transition-colors ${
                    activeChapterId === String(id)
                      ? "text-text-primary"
                      : "text-text-subtle hover:text-text-basic"
                  }`}
                >
                  {activeChapterId === String(id) && (
                    <motion.span
                      layoutId="rule-active-chapter"
                      className="bg-primary-50 absolute bottom-1 left-0 top-1 w-[3px] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                    />
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
