import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ study_id: string }>;
};

export default async function LegacyStudyApplyPage({ params }: Props) {
  const { study_id } = await params;
  redirect(`/studies/apply?study_id=${study_id}`);
}
