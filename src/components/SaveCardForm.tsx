"use client";

import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function SaveCardForm({ onSave }: { onSave?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/stripe/create-setup-intent", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      onSave?.(); // ✅ Notify BillingSection that the card was saved
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="px-3 py-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-theme-green">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1a1a1a",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: {
                color: "#e53e3e",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full py-3 px-4 bg-theme-green text-white font-semibold rounded-md hover:bg-green-700 transition"
      >
        Save Payment Method
      </button>
    </form>
  );
}
