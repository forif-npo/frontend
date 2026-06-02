"use client";

import { useParams } from "next/navigation";
import { SubmissionDetailMain } from "@/features/hackathon";

export default function SubmissionDetailPage() {
  const params = useParams<{ submissionId: string }>();
  const submissionId = Number(params.submissionId);

  return <SubmissionDetailMain submissionId={submissionId} />;
}
