"use client";

import type { Hackathon } from "@core/types/hackathon";
import { Heading } from "@ui/components/server";
import { Button } from "@ui/components/client";
import Link from "next/link";
import { InfoRow, Panel, PanelHeader } from "./shared";

interface EndedMainProps {
  hackathon: Hackathon;
  submissionCount: number;
  awardCount: number;
}

export function EndedMain({
  hackathon,
  submissionCount,
  awardCount,
}: EndedMainProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
      <Panel>
        <PanelHeader eyebrow="종료" title="해커톤이 종료되었습니다" />
        <p className="text-body-m text-text-subtle mt-2">
          제출된 결과물은 아카이브에서 확인할 수 있고, 수상팀은 결과 발표 후
          함께 표시됩니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/hackathon/archive">
            <Button variant="primary" size="medium">
              아카이브 보기
            </Button>
          </Link>
        </div>
      </Panel>

      <Panel>
        <Heading size="xxs" className="text-text-basic mb-2">
          결과 요약
        </Heading>
        <InfoRow label="해커톤" value={hackathon.title} />
        <InfoRow label="제출작" value={`${submissionCount}개`} />
        <InfoRow label="수상팀" value={`${awardCount}팀`} />
      </Panel>
    </section>
  );
}
