import { PresentationScreen } from "@/features/hackathon-results/components/presentation-screen";

interface PageProps {
  params: Promise<{ hackathonId: string }>;
}

export default async function ResultsPresentationPage({ params }: PageProps) {
  const { hackathonId: hackathonIdParam } = await params;
  const hackathonId = Number(hackathonIdParam);

  if (Number.isNaN(hackathonId)) {
    return (
      <main className="bg-surface-inverse text-text-subtle-inverse flex min-h-screen items-center justify-center">
        유효하지 않은 해커톤 ID입니다.
      </main>
    );
  }

  return <PresentationScreen hackathonId={hackathonId} />;
}
