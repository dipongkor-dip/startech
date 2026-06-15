export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-4 border-dashed border-primary/40 animate-spin" />
        <p className="text-base font-medium">Loading...</p>
      </div>
    </div>
  );
}
