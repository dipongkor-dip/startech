import Link from "next/link";

export default function DeliveryPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-foreground">Delivery</h1>
      <p className="mt-3 text-muted-foreground">
        This is the delivery page for shipping information, zones, and estimated delivery timelines.
      </p>
      <div className="mt-6">
        <Link href="/" className="text-indigo-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
