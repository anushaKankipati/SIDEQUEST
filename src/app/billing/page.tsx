// // app/billing/page.tsx
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import BillingForm from "@/src/components/BillingForm";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// export default function BillingPage() {
//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Elements stripe={stripePromise}>
//         <BillingForm amount={5000} /> {/* $50.00 */}
//       </Elements>
//     </main>
//   );
// }
