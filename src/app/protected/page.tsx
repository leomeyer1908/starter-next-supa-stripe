import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import ManageBillingButton from "@/components/ManageBillingButton";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="p-8">
        <p>You must sign in.</p>
        <Link className="underline" href="/signin">Go to sign in</Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-2">Protected</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(session, null, 2)}</pre>

	  <ManageBillingButton />
    </main>
  );
}

