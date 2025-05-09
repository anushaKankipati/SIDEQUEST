// src/features/DeleteAccountSection.tsx
"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function DeleteAccountSection() {
  const router = useRouter();
  function HandleDelete() {
    axios
      .delete("/api/profile")
      .then(() => signOut({ redirect: false }))
      .then(() => {
        toast.success("Profile Deleted");
        router.refresh(); // triggers server component re-evaluation
        router.push("/");
      })
      .catch(() => {
        toast.error("Error Deleting Profile");
      });
  }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-2xl shadow-lg space-y-6 border border-red-500">
      <p>
        This action is permanent and will remove all your data. Please be sure
        before continuing.
      </p>
      <button
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
        onClick={HandleDelete}
      >
        Delete My Account
      </button>
    </div>
  );
}
