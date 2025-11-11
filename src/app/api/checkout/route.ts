// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || undefined;
  if (!email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const stripe = getStripe();

  // ensure customer
  let user = await prisma.user.findUnique({ where: { email } });
  let customerId = user?.stripeCustomerId || null;

  if (!customerId) {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] ?? (await stripe.customers.create({ email }));
    customerId = customer.id;
    await prisma.user.upsert({
      where: { email },
      create: { email, stripeCustomerId: customerId },
      update: { stripeCustomerId: customerId },
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId, // lock to signed-in user
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cancelled`,
    allow_promotion_codes: true,
  });

  return NextResponse.redirect(checkout.url!, { status: 303 });
}

