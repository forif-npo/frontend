"use client";
import Error from "next/error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global error caught:", error);
  return (
    <html>
      <body>
        <Error statusCode={0} />
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
