"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Profile", href: "/settings" },
  { name: "Billing", href: "/settings/billing" },
  { name: "Transactions", href: "/settings/transactions" },
  { name: "Password", href: "/settings/password" },
  { name: "Delete Account", href: "/settings/delete" },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-theme-green text-white w-64 h-[calc(100vh-64px)] sticky top-[64px] p-6 flex flex-col justify-start shadow-lg">
      <ul className="space-y-4">
        {links.map(({ name, href }) => {
          const isActive =
            (pathname === "/settings" && href === "/settings") ||
            pathname === href;

          return (
            <li key={name}>
              <Link
                href={href}
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
