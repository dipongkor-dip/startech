import Link from "next/link";

export default function OrderPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-foreground">Order</h1>
      <p className="mt-3 text-muted-foreground">This is the order page for order tracking, status updates, and order details.</p>
      <div className="mt-6">
        <Link href="/" className="text-indigo-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
