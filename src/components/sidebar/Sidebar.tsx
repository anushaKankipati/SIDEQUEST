import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <MobileFooter/>
      <main className="lg:pl-20 h-full">
        <DesktopSidebar />
        {children}
      </main>
    </div>
  );
}
