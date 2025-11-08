import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Set it in .env (use your *secret* test key, sk_test_...)."
    );
  }
  // Pin your version; keeping as string avoids TS churn between SDK releases.
  return new Stripe(key, { apiVersion: "2025-10-29.clover" as any });
}

