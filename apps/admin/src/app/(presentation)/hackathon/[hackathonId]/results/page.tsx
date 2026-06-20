import { PresentationScreen } from "@/features/hackathon-results/components/presentation-screen";

interface PageProps {
  params: Promise<{ hackathonId: string }>;
}

export default async function ResultsPresentationPage({ params }: PageProps) {
  const { hackathonId: hackathonIdParam } = await params;
  const hackathonId = Number(hackathonIdParam);

  if (Number.isNaN(hackathonId)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        유효하지 않은 해커톤 ID입니다.
      </main>
    );
  }

  return <PresentationScreen hackathonId={hackathonId} />;
}
