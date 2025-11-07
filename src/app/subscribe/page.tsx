"use client";

export default function SubscribePage() {
  const checkout = async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Subscribe</h1>
      <button
        onClick={checkout}
        className="rounded-xl px-4 py-2 bg-black text-white"
      >
        Start Checkout
      </button>
    </main>
  );
}

