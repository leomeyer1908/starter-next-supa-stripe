"use client";
import { useState } from "react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    try {
      setLoading(true);
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Unable to open billing portal.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
    >
      {loading ? "Opening..." : "Manage billing"}
    </button>
  );
}

