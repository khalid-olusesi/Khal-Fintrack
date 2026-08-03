import { SidebarProvider } from "@/context/sidebar-context";
import SideNavbar from "@/components/sidenavbar";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#17283E]">
        <SideNavbar />
        {children}
      </div>
    </SidebarProvider>
  );
}
