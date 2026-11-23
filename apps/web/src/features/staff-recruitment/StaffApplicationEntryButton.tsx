"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertModal, Button } from "@ui/components/client";
import { getMyStaffApplication } from "./api";
import { getStaffApplicationErrorInfo } from "./application-error";
import { DuplicateStaffApplicationModal } from "./DuplicateStaffApplicationModal";

export function StaffApplicationEntryButton({
  recruitmentId,
}: {
  recruitmentId: number;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openApplication = async () => {
    if (checking) return;
    setChecking(true);
    try {
      await getMyStaffApplication(recruitmentId);
      setDuplicate(true);
    } catch (reason) {
      const info = await getStaffApplicationErrorInfo(reason);
      if (info.code === "FOR155-404") {
        router.push(`/club/recruit/${recruitmentId}/apply`);
      } else {
        setError(info.message);
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <Button
        className="mt-5 w-full"
        disabled={checking}
        onClick={() => void openApplication()}
      >
        {checking ? "지원 여부 확인 중..." : "지원서 작성"}
      </Button>
      <DuplicateStaffApplicationModal
        isOpen={duplicate}
        onClose={() =>
          router.push(
            `/my?section=staff-applications&recruitment_id=${recruitmentId}`,
          )
        }
      />
      <AlertModal
        isOpen={error !== null}
        description={error ?? ""}
        descriptionClassName="w-full text-center"
        onClose={() => setError(null)}
        onConfirm={() => setError(null)}
        showCancelButton={false}
      />
    </>
  );
}
