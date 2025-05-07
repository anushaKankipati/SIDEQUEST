"use client";

import { useState, useEffect } from "react";
import SaveCardForm from "@/src/components/SaveCardForm";
import { CheckCircle } from "lucide-react";

export default function BillingSettings() {
  const [cardSaved, setCardSaved] = useState(false);

  // Auto-reset success message after 3 seconds
  useEffect(() => {
    if (cardSaved) {
      const timer = setTimeout(() => setCardSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [cardSaved]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200 relative">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Billing Information</h3>
      </div>

      <SaveCardForm />

      {cardSaved && (
        <div className="absolute top-4 right-6 flex items-center text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-md shadow-sm animate-fade-in">
          <CheckCircle className="w-4 h-4 mr-1" />
          Card saved successfully
        </div>
      )}
    </div>
  );
}
