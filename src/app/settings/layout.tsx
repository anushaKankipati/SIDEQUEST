// src/app/settings/layout.tsx
import SettingsSidebar from "@/src/components/SettingsSidebar";
import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-grow p-6">{children}</div>
      <SettingsSidebar />
    </div>
  );
}
