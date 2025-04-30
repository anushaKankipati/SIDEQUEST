// // app/api/capture-payment.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { stripe } from "@/libs/stripe";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { payment_intent_id } = req.body;

//   try {
//     const captured = await stripe.paymentIntents.capture(payment_intent_id);
//     await stripe.paymentIntents.cancel(payment_intent_id);
//     res.status(200).json({ captured });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// }
