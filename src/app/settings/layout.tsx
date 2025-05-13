import SettingsSidebar from "@/src/components/SettingsSidebar";
import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen pt-[4rem]"> {/* Adjust for header height */}
      {/* Main content */}
      <main className="flex-1 px-6 pb-20 max-w-6xl mx-auto">
        {children}
      </main>

      {/* Sidebar - hidden on mobile, visible on lg screens */}
      <aside className="hidden lg:block w-64 sticky top-[4rem] h-[calc(100vh-4.5rem)] bg-green-600 text-white px-4 py-6 shadow-lg">
        <SettingsSidebar />
      </aside>
    </div>
  );
}
