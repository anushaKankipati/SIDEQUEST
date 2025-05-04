"use client";

import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function BackButton() {
  const router = useRouter();
  return (
    <div className="absolute top-3 left-3 lg:hidden">
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
    </div>
  );
}
