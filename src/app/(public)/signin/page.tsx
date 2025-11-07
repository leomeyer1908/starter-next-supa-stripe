"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <input
        className="border rounded w-full p-2 mb-3"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <button
        className="rounded bg-black text-white px-4 py-2"
        onClick={() => signIn("email", { email })}
      >
        Email me a magic link
      </button>
    </div>
  );
}

