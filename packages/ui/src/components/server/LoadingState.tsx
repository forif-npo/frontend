import { Spinner } from "./Spinner";

export function LoadingState({
  message = "불러오는 중입니다.",
}: {
  message?: string;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Spinner size="x-large" className="text-primary-50" />
      <p className="text-text-subtle text-[16px]">{message}</p>
    </main>
  );
}
