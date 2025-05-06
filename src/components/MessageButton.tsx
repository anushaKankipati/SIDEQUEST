"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiChat } from "react-icons/hi";
import axios from "axios";

interface MessageButtonProps {
  userId: string;
}

export default function MessageButton({ userId }: MessageButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/conversations", {
        userId,
      });
      router.push(`/conversations/${response.data.id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="rounded-full hover:bg-light-hover-green text-theme-green w-11 h-11 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <HiChat className="w-7 h-7" />
    </button>
  );
}