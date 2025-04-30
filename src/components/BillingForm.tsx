// // components/BillingForm.tsx
// "use client";

// import { useState } from "react";
// import {
//   CardElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";

// interface Props {
//   amount: number; // in cents
// }

// export default function BillingForm({ amount }: Props) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [status, setStatus] = useState("");
//   const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) return;

//     setStatus("Authorizing payment...");

//     const { paymentMethod, error } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardElement,
//     });

//     if (error || !paymentMethod) {
//       setStatus("Error creating payment method");
//       return;
//     }

//     const res = await fetch("/api/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         amount,
//         payment_method_id: paymentMethod.id,
//       }),
//     });

//     const data = await res.json();
//     if (data.error) {
//       setStatus("Payment failed: " + data.error);
//     } else {
//       setStatus("Payment authorized (not charged yet).");
//       setPaymentIntentId(data.paymentIntentId);
//     }
//   };

//   const handleCapture = async () => {
//     if (!paymentIntentId) return;

//     const res = await fetch("/api/capture-payment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ payment_intent_id: paymentIntentId }),
//     });

//     const data = await res.json();
//     if (data.error) {
//       setStatus("Capture failed: " + data.error);
//     } else {
//       setStatus("Payment captured successfully!");
//     }
//   };

//   const handleCancel = async () => {
//     if (!paymentIntentId) return;

//     const res = await fetch("/api/cancel-payment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ payment_intent_id: paymentIntentId }),
//     });

//     const data = await res.json();
//     if (data.error) {
//       setStatus("Cancel failed: " + data.error);
//     } else {
//       setStatus("Payment hold cancelled.");
//       setPaymentIntentId(null);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 shadow-xl rounded-xl bg-white">
//       <h2 className="text-2xl font-semibold text-gray-800">Payment Authorization</h2>

//       <CardElement className="p-3 border border-gray-300 rounded-md" />
      
//       <div className="flex gap-3">
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           Authorize ${amount / 100}
//         </button>
//         {paymentIntentId && (
//           <>
//             <button
//               type="button"
//               onClick={handleCapture}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Capture
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//             >
//               Cancel
//             </button>
//           </>
//         )}
//       </div>

//       <p className="text-sm text-gray-600">{status}</p>
//     </form>
//   );
// }
