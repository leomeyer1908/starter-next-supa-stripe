import Link from "next/link";

export default function CancelledPage() {
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">No charge</h1>
      <p>Your checkout was cancelled. You can try again any time.</p>
      <div className="space-x-4">
        <Link className="underline" href="/subscribe">Back to subscribe</Link>
        <Link className="underline" href="/">Home</Link>
      </div>
    </main>
  );
}

