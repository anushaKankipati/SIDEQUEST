// src/features/DeleteAccountSection.tsx
export default function DeleteAccountSection() {
    return (
      <div className="border border-red-500 p-6 rounded-xl bg-red-50 text-red-700 space-y-4">
        <p>
          This action is permanent and will remove all your data. Please be sure before continuing.
        </p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow">
          Delete My Account
        </button>
      </div>
    );
  }
  