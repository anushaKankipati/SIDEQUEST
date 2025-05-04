"use client";

import useRoutes from "@/src/hooks/useRoute";
import { useState } from "react";

export default function DesktopSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className="
    mt-14
    hidden
    lg:fixed
    lg:inset-y-0
    lg:left-0
    lg:z-40
    xl:px-6
    lg:overflow-y-auto
    lg:bg-white
    lg:border-r-[1px]
    lg:pb-4
    lg:flex
    lg:flex-col
    justify-between
  "
    >
      <nav
        className="
        mt-4
        flex 
        flex-col
        justify-between
        items-center
      "
      >
        <div
          onClick={() => setIsOpen(true)}
          className="
            cursor-pointer 
            hover:opacity-75
            transition
        "
        ></div>
      </nav>
    </div>
  );
}
