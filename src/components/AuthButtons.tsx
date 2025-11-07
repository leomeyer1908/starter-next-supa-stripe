"use client";
import { signIn as signInClient, signOut as signOutClient } from "next-auth/react";
import { useState } from "react";

export function AuthButtons() {
  const [email, setEmail] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        className="border rounded px-2 py-1"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="rounded bg-black text-white px-3 py-1"
        onClick={() => signInClient("email", { email })}
      >
        Send magic link
      </button>
      <button
        className="rounded border px-3 py-1"
        onClick={() => signOutClient()}
      >
        Sign out
      </button>
    </div>
  );
}

