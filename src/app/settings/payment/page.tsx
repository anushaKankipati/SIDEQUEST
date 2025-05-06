import dynamic from "next/dynamic";
import TransactionSettings from "@/src/components/TransactionSettings";
import BillingSettings from "@/src/components/BillingSettings";

export default function AccountSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="space-y-24">
        <section id="billing" className="scroll-mt-32">
          <h2 className="text-3xl font-bold mb-6">Billing</h2>
          <BillingSettings />
        </section>

        <section id="transactions" className="scroll-mt-32">
          <h2 className="text-3xl font-bold mb-6">Transactions</h2>
          <TransactionSettings />
        </section>

      </div>
    </div>
  );
}
