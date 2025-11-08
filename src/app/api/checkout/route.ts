import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!priceId) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_STRIPE_PRICE_ID in .env" },
      { status: 500 }
    );
  }

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // or "payment" for one-time
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cancelled`,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}

