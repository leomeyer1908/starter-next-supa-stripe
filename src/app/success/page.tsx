import Link from "next/link";
import { getStripe } from "@/lib/stripe";

type Props = { searchParams: { session_id?: string } };

export default async function SuccessPage({ searchParams }: Props) {
  const sessionId = searchParams?.session_id;
  // Optional: look up the session for debugging/demo
  let amount: string | null = null;
  if (sessionId) {
    try {
      const stripe = getStripe();
      const s = await stripe.checkout.sessions.retrieve(sessionId);
      if (s.amount_total) amount = `$${(s.amount_total / 100).toFixed(2)} ${s.currency?.toUpperCase()}`;
    } catch {
      // ignore in demo; page still loads
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Thanks!</h1>
      <p>Payment completed{amount ? ` for ${amount}` : ""}.</p>
      {sessionId && (
        <p className="text-sm text-gray-500">
          Session: <code>{sessionId}</code>
        </p>
      )}
      <div className="space-x-4">
        <Link className="underline" href="/protected">Go to your account</Link>
        <Link className="underline" href="/">Home</Link>
      </div>
    </main>
  );
}

