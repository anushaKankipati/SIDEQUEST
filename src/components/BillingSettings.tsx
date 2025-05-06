// components/BillingSettings.tsx

export default function BillingSettings() {
    return (
      <div className="p-6 bg-gray-100 rounded-2xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Billing Information</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cardholder Name"
              className="form-input w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="form-input w-full p-3 rounded-lg border border-gray-300"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="form-input w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="CVC"
              className="form-input w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              className="form-input w-full p-3 rounded-lg border border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="bg-theme-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Card
          </button>
        </form>
      </div>
    );
  }
  