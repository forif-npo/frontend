import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getMyStudyApplication,
  type StudyApplicationDetail,
} from "@core/study-application/api";
import { StudyApplicationDetailView } from "./study-application-detail-view";

interface PageProps {
  params: Promise<{ studyId: string }>;
}

export default async function StudyApplicationDetailPage({
  params,
}: PageProps) {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/signin");
  }

  const { studyId } = await params;
  const numericStudyId = Number(studyId);
  if (!Number.isInteger(numericStudyId) || numericStudyId <= 0) {
    redirect("/my?section=study-applications");
  }

  let application: StudyApplicationDetail;
  try {
    application = await getMyStudyApplication(
      numericStudyId,
      session.accessToken,
    );
  } catch {
    // 승인되면 신청서 전용 조회에서 제외된다. 기존 상세 URL을 다시 열어도
    // 운영 중인 스터디 탭으로 자연스럽게 이어지게 한다.
    redirect("/my?section=study-manage");
  }

  return <StudyApplicationDetailView application={application} />;
}
