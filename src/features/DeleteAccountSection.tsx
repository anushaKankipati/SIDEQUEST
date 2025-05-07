// src/features/DeleteAccountSection.tsx
export default function DeleteAccountSection() {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-2xl shadow-lg space-y-6 border border-red-500">
        <p>
          This action is permanent and will remove all your data. Please be sure before continuing.
        </p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow">
          Delete My Account
        </button>
      </div>
    );
  }
  