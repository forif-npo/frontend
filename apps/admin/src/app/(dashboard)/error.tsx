"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-destructive text-2xl font-bold">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded px-4 py-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
