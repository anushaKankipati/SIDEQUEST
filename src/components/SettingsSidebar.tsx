"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Settings, CreditCard } from "lucide-react";

const sections = {
  "Account Settings": [
    { name: "Password", href: "/settings/account#password" },
    { name: "Notifications", href: "/settings/account#notifications" },
    { name: "Delete Account", href: "/settings/account#delete" },
  ],
  // "Payment Details": [
  //   { name: "Billing", href: "/settings/payment#billing" },
  // ],
};

const sectionIds = [
  "password",
  "notifications",
  "delete",
  "billing",
];

export default function SettingsSidebar() {
  const [openSection, setOpenSection] = useState("Account Settings");
  const [activeSection, setActiveSection] = useState<string>("profile");

  // Scroll spy effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="text-sm space-y-6 sticky top-24">
      {Object.entries(sections).map(([sectionName, links]) => {
        const Icon = sectionName === "Account Settings" ? Settings : CreditCard;
        const isOpen = openSection === sectionName;

        return (
          <div key={sectionName}>
            <button
              className="flex justify-between items-center w-full font-semibold uppercase text-xs tracking-wide text-white"
              onClick={() => setOpenSection(isOpen ? "" : sectionName)}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {sectionName}
              </div>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOpen && (
              <ul className="space-y-2 ml-6 mt-2">
                {links.map(({ name, href }) => {
                  const hash = href.split("#")[1];
                  const isActive = activeSection === hash || (!activeSection && hash === "profile");

                  return (
                    <li key={name}>
                      <Link
                        href={href}
                        className={`block px-2 py-1 rounded-md transition-all duration-300 ${
                          isActive
                            ? "font-bold text-white bg-theme-green/10"
                            : "text-gray-200 hover:text-white"
                        }`}
                      >
                        {name}
                      </Link>
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
