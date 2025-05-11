import { MobileSidebar } from "./_components/mobile-sidebar";
import { Sidebar } from "./_components/sidebar";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <MobileSidebar />

      <Sidebar />

      {children}
    </div>
  );
}
