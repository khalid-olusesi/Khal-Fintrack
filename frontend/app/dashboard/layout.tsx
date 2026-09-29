"use client";

import { SidebarProvider, useSidebar } from "@/context/sidebar-context";
import SideNavbar from "@/components/sidenavbar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background overflow-hidden">
      <SideNavbar />
      <div className={`flex-1 min-w-0 h-full relative transition-all duration-300 ${isOpen ? "max-md:blur-[4px] max-md:pointer-events-none" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
