// app/api/stripe/create-setup-intent/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST() {
  try {
    const customer = await stripe.customers.create();
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
