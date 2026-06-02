import type { Hackathon } from "@core/types/hackathon";
import { Body, Label } from "@ui/components/server";
import { formatDateTime } from "./utils";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-gray-subtler border-border-gray-light rounded-2 flex flex-col gap-1.5 border p-4">
      <Label size="xs" className="text-text-subtle">
        {label}
      </Label>
      <Body size="s" className="text-text-basic break-all font-bold">
        {value}
      </Body>
    </div>
  );
}

export function EventFacts({ hackathon }: { hackathon: Hackathon }) {
  return (
    <div className="bg-surface-white border-border-gray-light rounded-3 mb-6 grid grid-cols-2 gap-3 border p-4 shadow-sm sm:grid-cols-4">
      <Fact label="장소" value={hackathon.location ?? "-"} />
      <Fact
        label="회차"
        value={`${hackathon.held_year}-${hackathon.held_semester} / ${hackathon.event_round}회`}
      />
      <Fact label="시작" value={formatDateTime(hackathon.starts_at)} />
      <Fact label="종료" value={formatDateTime(hackathon.ends_at)} />
    </div>
  );
}
