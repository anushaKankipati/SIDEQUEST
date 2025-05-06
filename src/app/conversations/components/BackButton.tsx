"use client";

import useUnreadConversationCount from "@/src/hooks/useUnreadConversationCount";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function BackButton() {
  const router = useRouter();
  const unreadCount = useUnreadConversationCount();
  return (
    <div className="absolute top-16 left-0 lg:hidden z-50 flex items-center">
      <IoChevronBack
        size={30}
        onClick={() => {
          router.push("/conversations");
        }}
        className="
          cursor-pointer
          text-theme-green
          hover:text-green-800
        "
      />
      {unreadCount > 0 && (
        <div className="bg-theme-green px-2 py-1 rounded-full">
          <p className="text-xs text-white">{unreadCount}</p>
        </div>
      )}
    </div>
  );
}
