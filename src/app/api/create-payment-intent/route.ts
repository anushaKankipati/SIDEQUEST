// app/api/create-payment-intent/route.ts
import { stripe } from "@/libs/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, payment_method_id } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: payment_method_id,
      confirm: true,
      capture_method: "manual",
    });

    return NextResponse.json({ paymentIntentId: paymentIntent.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
