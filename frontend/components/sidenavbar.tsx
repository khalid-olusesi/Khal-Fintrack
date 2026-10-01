"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/context/sidebar-context";
import { usePathname } from "next/navigation";

import Link from "next/link";
import {
  ChartColumn,
  ChartPie,
  CircleUser,
  Home,
  LayoutGrid,
  Settings,
  Wallet,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toast";

export default function SideNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    let logoutWarning = false;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        },
      );

      if (!response.ok) {
        logoutWarning = true;
      }
    } catch {
      logoutWarning = true;
    } finally {
      localStorage.removeItem("token");
      toast.add({
        title: logoutWarning ? "Signed out on this device" : "Logged out",
        description: logoutWarning
          ? "You can sign in again whenever you're ready."
          : "You have been logged out successfully.",
        type: logoutWarning ? "warning" : "success",
      });
      router.replace("/auth/login");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
        />
      )}

      <div
        className={`flex flex-col h-full bg-gray-50 dark:bg-zinc-900/30 shrink-0 transition-all duration-300 z-50 
          fixed md:relative left-0 top-0 border-r border-border
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 w-[72px]"}
        `}
      >
        {/* Logo */}
        <div className="p-5 flex items-center h-16 shrink-0">
          <Link
            className="flex gap-3 items-center cursor-pointer w-full"
            href="/"
            onClick={() => {
              if (isOpen && window.innerWidth < 768) toggleSidebar();
            }}
          >
            <div className="h-8 w-8 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
              <FontAwesomeIcon
                icon={faChartColumn}
                className="text-green-600 dark:text-green-500 w-4 h-4"
              />
            </div>
            {isOpen && (
              <h1 className="text-[15px] font-bold text-foreground whitespace-nowrap">
                Khal-FinTrack
              </h1>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <div className="flex flex-col flex-1 px-3 gap-1 mt-4 overflow-y-auto">
          <NavItem
            icon={<Home className="w-4 h-4 shrink-0" />}
            label="Dashboard"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/main"}
            onClick={() => handleNavigation("/dashboard/main")}
          />
          <NavItem
            icon={<Wallet className="w-4 h-4 shrink-0" />}
            label="Transactions"
            isOpen={isOpen}
            isActive={pathname.startsWith("/dashboard/transaction")}
            onClick={() => handleNavigation("/dashboard/transaction")}
          />
          <NavItem
            icon={<LayoutGrid className="w-4 h-4 shrink-0" />}
            label="Categories"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/categories"}
            onClick={() => handleNavigation("/dashboard/categories")}
          />
          <NavItem
            icon={<ChartPie className="w-4 h-4 shrink-0" />}
            label="Budgets"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/budgets"}
            onClick={() => handleNavigation("/dashboard/budgets")}
          />
          <NavItem
            icon={<ChartColumn className="w-4 h-4 shrink-0" />}
            label="Reports"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/reports"}
            onClick={() => handleNavigation("/dashboard/reports")}
          />

          <div className="my-2 border-t border-border mx-2"></div>

          <NavItem
            icon={<CircleUser className="w-4 h-4 shrink-0" />}
            label="Profile"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/profile"}
            onClick={() => handleNavigation("/dashboard/profile")}
          />
          <NavItem
            icon={<Settings className="w-4 h-4 shrink-0" />}
            label="Settings"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/settings"}
            onClick={() => handleNavigation("/dashboard/settings")}
          />

          {/* Logout */}
          <div className="mt-auto pb-4 pt-2">
            <NavItem
              icon={<LogOut className="w-4 h-4 shrink-0" />}
              label={isLoggingOut ? "Logging out..." : "Log Out"}
              isOpen={isOpen}
              isLogout
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function NavItem({
  icon,
  label,
  isOpen,
  isActive,
  isLogout,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
  isLogout?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 mx-1 transition-all rounded-xl cursor-pointer group ${
        !isOpen ? "justify-center px-0" : ""
      } ${
        isActive
          ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-500 font-medium"
          : isLogout
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800/50"
      }`}
    >
      <div
        className={`${!isOpen ? "" : ""} ${isActive ? "text-green-600 dark:text-green-500" : isLogout ? "text-red-500" : "text-muted-foreground group-hover:text-foreground"}`}
      >
        {icon}
      </div>
      {isOpen && <p className="text-[13px] whitespace-nowrap">{label}</p>}
    </div>
  );
}
