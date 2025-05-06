"use client";

import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import useRoutes from "../hooks/useRoute";
import DesktopItem from "./sidebar/DesktopItem";

export default function MobileLeftHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const routes = useRoutes();
  return (
    <div className="xs:hidden cursor-pointer">
      <div className="border-[2px] rounded-lg p-1 text-theme-green border-theme-green">
        <IoMenu size={30} onClick={() => setIsOpen((prev) => !prev)} />
      </div>
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="bg-black/50 fixed inset-0 z-40"
          ></div>
          <div className="absolute z-50 left-2 top-14 bg-white rounded-md p-1 border flex flex-col space-y-1 items-center">
            <Link href="/" className="text-gray-500 hover:bg-gray-100 p-3">
              <FaHome size={24} />
            </Link>
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
