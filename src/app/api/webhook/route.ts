// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, secret);
  } catch (err: any) {
    console.error("Invalid signature:", err.message);
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sess = event.data.object as Stripe.Checkout.Session;

        // 1) Re-fetch session with minimal expansion
        const full = await stripe.checkout.sessions.retrieve(sess.id, {
          expand: ["customer", "subscription"], // keep it shallow
        });

        const email =
          full.customer_details?.email ||
          (typeof full.customer !== "string" ? full.customer?.email ?? undefined : undefined);

        const customerId =
          typeof full.customer === "string" ? full.customer : full.customer?.id;

        // 2) If you need price/sub status, fetch subscription separately
        let priceId: string | null = null;
        let status: string | null = null;
        let subscriptionId: string | null = null;

        if (full.subscription) {
          const sub =
            typeof full.subscription === "string"
              ? await stripe.subscriptions.retrieve(full.subscription, {
                  expand: ["items.data.price"], // shallow expand OK
                })
              : full.subscription;

          subscriptionId = sub.id;
          status = sub.status;
          priceId = sub.items.data[0]?.price?.id ?? null;
        }

        if (email && customerId) {
          await prisma.user.upsert({
            where: { email },
            create: {
              email,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              planStatus: status ?? "active",
            },
            update: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              planStatus: status ?? undefined,
            },
          });
        }

        console.log("✅ checkout.session.completed", { id: sess.id, customer: customerId });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const priceId = sub.items.data[0]?.price?.id ?? null;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId,
            planStatus: sub.status,
          },
        });
        console.log(`✅ ${event.type}`, { sub: sub.id, status: sub.status });
        break;
      }

      default:
        console.log("ℹ️ Unhandled event", event.type);
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

