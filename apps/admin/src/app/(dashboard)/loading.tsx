export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="border-border border-t-primary mx-auto h-12 w-12 animate-spin rounded-full border-4" />
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    </div>
  );
}
