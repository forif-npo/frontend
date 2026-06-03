import type { Hackathon } from "@core/types/hackathon";
import { Heading } from "@ui/components/server";
import { InfoRow, Notice, Panel, PanelHeader } from "./shared";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function WaitingStartMain({ hackathon }: { hackathon: Hackathon }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
      <Panel>
        <PanelHeader eyebrow="모집 마감" title="참가 신청이 마감되었습니다" />
        <p className="text-body-m text-text-subtle mt-2">
          해커톤이 시작되면 이 페이지에서 팀을 만들거나 다른 팀에 가입 신청할 수
          있습니다.
        </p>
        <div className="mt-4">
          <Notice
            title="참가자 명단 확인"
            body="운영진이 참가자와 staff 계정을 기준으로 권한을 확인합니다."
          />
          <Notice
            title="팀 구성은 시작 후 진행"
            body="시작 이후 팀 모집 영역이 열리고 팀장 승인으로 팀이 구성됩니다."
          />
          <Notice
            title="제출은 팀 단위"
            body="팀장이 GitHub, 배포 URL, 발표자료를 구조화해서 제출합니다."
          />
        </div>
      </Panel>

      <Panel>
        <Heading size="xxs" className="text-text-basic mb-2">
          시작 전 준비
        </Heading>
        <InfoRow label="참가 등록" value="완료" />
        <InfoRow label="팀 구성" value="시작 전" />
        <InfoRow label="제출" value="시작 후 가능" />
        <InfoRow label="평가" value="심사중 상태에서 가능" />
      </Panel>
    </section>
  );
}
