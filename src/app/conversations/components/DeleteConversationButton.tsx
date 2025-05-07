"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useConversation from "@/src/hooks/useConversation";
import axios from "axios";

export default function DeleteConversationButton() {
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const router = useRouter();
  const {conversationId} = useConversation();

  function HandleDelete() {
    axios.delete(`/api/conversations/${conversationId}`).then(() => {
      toast.success("Conversation Deleted");
      router.push("/conversations/");
    })
    .catch(() => {
      toast.error("Error Deleting Conversation"); 
    })
  }
  if (showDeleteQuestion) {
    return (
      <div className="bg-black/90 fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg">
            Do you really want to Delete this Conversation? This action cannot
            be undone
          </h2>
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
      className="border border-red-600 text-red-600 rounded-md py-1 px-4 inline-flex gap-1 items-center w-full"
    >
      <FontAwesomeIcon icon={faTrash} />
      <span>Delete</span>
    </button>
  );
}
