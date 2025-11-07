// src/app/api/webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle events you care about
  switch (event.type) {
    case "checkout.session.completed":
      // TODO: mark user as paid, store subscription id, etc.
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      // TODO: sync subscription status in your DB
      break;
  }

  return NextResponse.json({ received: true });
}

// Important for raw body:
export const config = { api: { bodyParser: false } } as any;

