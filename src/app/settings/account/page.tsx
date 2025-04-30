import dynamic from "next/dynamic";
import DeleteAccountSection from "@/src/features/DeleteAccountSection";
import ProfilePage from "@/src/features/ProfilePage";
import NotificationSettings from "@/src/components/NotificationSettings";
import PasswordSettings from "@/src/components/PasswordSettings";

export default function AccountSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="space-y-24">
        {/* Profile Section */}
        <section id="profile" className="scroll-mt-32">
          <h2 className="text-3xl font-bold mb-6">Profile</h2>
          <ProfilePage />
        </section>

        {/* Password Section */}
        <section id="password" className="scroll-mt-32">
          <h2 className="text-3xl font-bold mb-6">Password</h2>
          <PasswordSettings />
        </section>

        {/* Notifications Section */}
        <section id="notifications" className="scroll-mt-32">
          <h2 className="text-3xl font-bold mb-6">Notifications</h2>
          <NotificationSettings />
        </section>

        {/* Delete Account Section */}
        <section id="delete" className="scroll-mt-32">
          <h2 className="text-3xl font-bold mb-6">Delete Account</h2>
          <DeleteAccountSection />
        </section>
      </div>
    </div>
  );
}
