import { auth } from "@/auth";
import Link from "next/link";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="p-8">
        <p>You must sign in first.</p>
        <Link className="underline" href="/signin">Go to sign in</Link>
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-2">Protected</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

