// import { stripe } from "@/libs/stripe";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { payment_intent_id } = body;

//     const cancelled = await stripe.paymentIntents.cancel(payment_intent_id);

//     return NextResponse.json({ cancelled });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }
