"use client";

import useUnreadConversationCount from "@/src/hooks/useUnreadConversationCount";
import clsx from "clsx";
import Link from "next/link";

interface DesktopIconProps {
  label: string;
  icon: any;
  href: string;
  active?: boolean;
}

export default function DesktopItem({
  label,
  icon: Icon,
  href,
  active,
}: DesktopIconProps) {
  const isMessageIcon = label === "Chat";
  const unreadCount = useUnreadConversationCount();
  return (
    <li>
      <Link
        href={href}
        className={clsx(
          `
        group 
        flex 
        relative
        gap-x-3
        rounded-md
        p-3
        text-sm
        leading-6
        font-semibold
        text-gray-500
        hover:text-black
        hover:bg-gray-100
      `,
          active && "bg-gray-100 text-black"
        )}
      >
        {isMessageIcon && unreadCount > 0 && (
          <div className="absolute top-0 right-0 translate-x-[21%] -translate-y-[21%] rounded-full bg-theme-green px-2 py-1">
            <p className="text-xs text-white">{unreadCount}</p>
          </div>
        )}
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
}
