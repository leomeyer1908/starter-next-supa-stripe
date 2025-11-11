// src/app/api/portal/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const stripe = getStripe();
  const returnUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // ensure we have (or recover) a customer id
  let user = await prisma.user.findUnique({ where: { email } });
  let customerId = user?.stripeCustomerId;

  if (!customerId) {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0];
    if (!customer) {
      return NextResponse.json(
        { error: "No billing profile yet. Complete checkout first." },
        { status: 400 }
      );
    }
    customerId = customer.id;
    await prisma.user.update({ where: { email }, data: { stripeCustomerId: customerId } });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID || undefined,
  });

  return NextResponse.json({ url: portal.url });
}

