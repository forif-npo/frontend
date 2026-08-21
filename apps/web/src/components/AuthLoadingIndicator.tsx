import { LoaderCircle } from "@repo/assets/icons/lucide";

interface AuthLoadingIndicatorProps {
  message: string;
}

export function AuthLoadingIndicator({ message }: AuthLoadingIndicatorProps) {
  return (
    <main
      className="flex min-h-[calc(100vh-64px)] items-center justify-center md:min-h-[calc(100vh-80px)]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle
          className="text-icon-primary h-10 w-10 animate-spin"
          aria-hidden="true"
        />
        <p className="text-text-basic text-[17px] font-medium">{message}</p>
      </div>
    </main>
  );
}
