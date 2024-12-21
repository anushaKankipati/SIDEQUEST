"use client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

export default function DeleteButton({id}: {id:string}) {
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);
  const router = useRouter(); 

  function HandleDelete() {
    fetch(`/api/ads?id=${id}`, { method: "DELETE" }).then(() => {
      setShowDeleteQuestion(false);
      router.push("/"); 
    });
  }
  if (showDeleteQuestion) {
    return (
      <div className="bg-black/90 fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg">Do you really want to Delete this ad?</h2>
          <div className="flex justify-center gap-2 mt-2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setShowDeleteQuestion(false)}
            >
              No, Cancel Here
            </button>
            <button
              className="py-1 px-2 bg-red-600 text-white border-rounded"
              onClick={() => {
                HandleDelete();
                setShowDeleteQuestion(false);
              }}
            >
              Yes, Delete!
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={() => setShowDeleteQuestion(true)}
      className="border border-red-600 text-red-600 rounded-md py-1 px-4 inline-flex gap-1 items-center"
    >
      <FontAwesomeIcon icon={faTrash} />
      <span>Delete</span>
    </button>
  );
}
