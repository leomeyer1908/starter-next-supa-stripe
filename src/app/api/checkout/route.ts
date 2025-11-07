// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // or "payment" if one-time
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cancelled`,
    // optionally: customer_email, client_reference_id, metadata, etc.
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}

