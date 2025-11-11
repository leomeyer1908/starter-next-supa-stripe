import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function SubscribePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/signin"); // must be signed in

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Subscribe</h1>
      <form action="/api/checkout" method="post">
        <button className="rounded bg-black text-white px-4 py-2">
          Start Checkout
        </button>
      </form>
      <p className="text-sm text-gray-500">You’ll use your account email for billing.</p>
    </main>
  );
}

