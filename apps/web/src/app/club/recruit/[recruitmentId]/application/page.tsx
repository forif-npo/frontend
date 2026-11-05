import { notFound } from "next/navigation";
import { MyStaffApplicationView } from "@/features/staff-recruitment/MyStaffApplicationView";

export default async function MyStaffApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ recruitmentId: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const [{ recruitmentId: rawId }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const recruitmentId = Number(rawId);
  if (!Number.isInteger(recruitmentId) || recruitmentId < 1) notFound();

  return (
    <MyStaffApplicationView
      recruitmentId={recruitmentId}
      submitted={query.submitted === "1"}
    />
  );
}
