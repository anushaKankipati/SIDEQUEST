"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Settings, CreditCard } from "lucide-react";

const sections = {
  "Account Settings": [
    { name: "Profile", href: "/settings/account#profile" },
    { name: "Password", href: "/settings/account#password" },
    { name: "Notifications", href: "/settings/account#notifications" },
    { name: "Delete Account", href: "/settings/account#delete-account" },
  ],
  "Payment Details": [
    { name: "Billing", href: "/settings/payment#billing" },
    { name: "Transactions", href: "/settings/payment#transactions" },
  ],
};

export default function SettingsSidebar() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState("Account Settings");
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    handleHashChange(); // Set on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="text-sm space-y-6">
      {Object.entries(sections).map(([sectionName, links]) => {
        const Icon = sectionName === "Account Settings" ? Settings : CreditCard;
        const isOpen = openSection === sectionName;

        return (
          <div key={sectionName}>
            <button
              className="flex justify-between items-center w-full font-semibold uppercase text-xs tracking-wide mb-2"
              onClick={() => setOpenSection(isOpen ? "" : sectionName)}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {sectionName}
              </div>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && (
              <ul className="space-y-2 ml-6">
                {links.map(({ name, href }) => {
                  const hash = href.split("#")[1];
                  const isActive = activeHash === `#${hash}` || (!activeHash && hash === "profile"); // default to profile

                  return (
                    <li key={name}>
                      <Link
                        href={href}
                        className={`block px-2 py-1 rounded transition-colors ${
                          isActive ? "text-white font-bold" : "text-gray-300 hover:text-white"
                        }`}
                      ></Link>

                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
