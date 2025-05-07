"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SessionProvider } from "next-auth/react";
import AuthContext from "../context/AuthContext";
import ActiveStatus from "../components/ActiveStatus";
import { Toaster } from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Elements stripe={stripePromise}>
        <AuthContext>
          <Toaster position="top-center" />
          <ActiveStatus />
          {children}
        </AuthContext>
      </Elements>
    </SessionProvider>
  );
}
