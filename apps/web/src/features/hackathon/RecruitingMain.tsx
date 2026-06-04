"use client";

import type { Hackathon } from "@core/types/hackathon";
import { Body, Heading } from "@ui/components/server";
import { Button } from "@ui/components/client";
import { formatDateTime } from "./utils";
import { InfoRow, Panel, PanelHeader } from "./shared";

interface RecruitingMainProps {
  hackathon: Hackathon;
  onRegister: () => Promise<void>;
  onCancelRegistration: () => Promise<void>;
  isRegistered: boolean;
}

export function RecruitingMain({
  hackathon,
  onRegister,
  onCancelRegistration,
  isRegistered,
}: RecruitingMainProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
      <Panel>
        <PanelHeader
          eyebrow="참가 신청"
          title="현재 학기 활동 부원이라면 누구나 신청할 수 있습니다"
        />
        <Body size="m" className="text-text-subtle mt-2">
          참가 신청이 끝나면 해커톤 시작 전까지 행사 안내와 준비 공지가 이
          페이지에 표시됩니다.
        </Body>
        <div className="mt-6 flex flex-wrap gap-3">
          {isRegistered ? (
            <>
              <Button variant="secondary" size="medium" disabled>
                신청 완료
              </Button>
              <Button
                variant="tertiary"
                size="medium"
                onClick={() => void onCancelRegistration().catch(() => {})}
              >
                신청 취소
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="medium"
              onClick={() => void onRegister().catch(() => {})}
            >
              참가 신청
            </Button>
          )}
        </div>
      </Panel>

      <Panel>
        <Heading size="xxs" className="text-text-basic mb-2">
          모집 기간
        </Heading>
        <InfoRow
          label="시작"
          value={formatDateTime(
            hackathon.recruit_starts_at ?? hackathon.starts_at,
          )}
        />
        <InfoRow
          label="마감"
          value={formatDateTime(
            hackathon.recruit_ends_at ?? hackathon.starts_at,
          )}
        />
        <InfoRow
          label="참가 상태"
          value={isRegistered ? "신청 완료" : "신청 가능"}
        />
      </Panel>
    </section>
  );
}
