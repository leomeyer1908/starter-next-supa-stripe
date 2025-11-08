// src/components/Header.tsx (server component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { AuthButtons } from "./AuthButtons";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  return (
    <header className="w-full border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">starter-next-supa-stripe</Link>
        <nav className="flex items-center gap-4">
          <Link className="underline" href="/protected">Protected</Link>
          <span className="text-sm text-gray-600">
            {email ? `Signed in as ${email}` : "Not signed in"}
          </span>
          <AuthButtons />
        </nav>
      </div>
    </header>
  );
}

