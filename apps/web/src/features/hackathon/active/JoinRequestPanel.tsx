import type { JoinRequest } from "@core/types/hackathon";
import { Body, Label } from "@ui/components/server";
import { Button } from "@ui/components/client";

export function JoinRequestPanel({
  requests,
  submitting,
  onApprove,
  onReject,
}: {
  requests: JoinRequest[];
  submitting: boolean;
  onApprove: (requestId: number) => Promise<void>;
  onReject: (requestId: number) => Promise<void>;
}) {
  return (
    <div className="border-divider-gray-light mb-4 border-t pt-4">
      <Label size="s" className="text-text-basic mb-2 block font-bold">
        가입 신청
      </Label>
      {requests.length === 0 ? (
        <Body size="s" className="text-text-subtle">
          대기 중인 가입 신청이 없습니다.
        </Body>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((request) => (
            <div
              key={request.join_request_id}
              className="border-border-gray-light rounded-2 flex flex-col gap-3 border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Label size="s" className="text-text-basic font-bold">
                  {request.user_name}
                </Label>
                {request.message && (
                  <Body size="s" className="text-text-subtle mt-1">
                    {request.message}
                  </Body>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="x-small"
                  disabled={submitting}
                  onClick={() => void onApprove(request.join_request_id)}
                >
                  승인
                </Button>
                <Button
                  variant="tertiary"
                  size="x-small"
                  disabled={submitting}
                  onClick={() => void onReject(request.join_request_id)}
                >
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
