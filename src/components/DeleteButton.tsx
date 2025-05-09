"use client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteButton({id}: {id:string}) {
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);
  const router = useRouter(); 

  function HandleDelete() {
    fetch(`${window.location.origin}/api/ads?id=${id}`, { 
      method: "DELETE",
      credentials: 'include' // This ensures cookies are sent with the request
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setShowDeleteQuestion(false);
      router.push("/");
      toast.success("Quest Successfully Deleted");  
    }).catch((e) => {
      console.error("Error deleting Quest:", e); 
      toast.error("Error Deleting Quest"); 
    });
  }
  if (showDeleteQuestion) {
    return (
      <div className="bg-black/90 fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg">Do you really want to Delete this ad?</h2>
          <div className="flex justify-center gap-2 mt-2">
            <button
              className="px-2 py-1 border border-theme-black rounded"
              onClick={() => setShowDeleteQuestion(false)}
            >
              No, Cancel Here
            </button>
            <button
              className="py-1 px-2 bg-red-600 text-white border-red-600 rounded-md"
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
