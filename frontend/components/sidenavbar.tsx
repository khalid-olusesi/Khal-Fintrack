"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/context/sidebar-context";

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

export default function SideNavbar() {
  const router = useRouter();
  const { isOpen } = useSidebar();

  return (
    <div
      className={`flex flex-col h-full shrink-0 transition-all duration-300 ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="p-4">
        <Link
          className="flex gap-2 items-center cursor-pointer justify-center"
          href="/"
        >
          <FontAwesomeIcon
            icon={faChartColumn}
            className="text-green-700 w-5 h-5 shrink-0"
          />
          {isOpen && (
            <h1 className="text-[14px] font-medium text-white whitespace-nowrap">
              Khal-FinTrack
            </h1>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex flex-col flex-1 px-2">
        <NavItem
          icon={<Home className="w-4 h-4 text-white shrink-0" />}
          label="Dashboard"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/main")}
        />
        <NavItem
          icon={<Wallet className="w-4 h-4 text-white shrink-0" />}
          label="Transactions"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/transaction")}
        />
        <NavItem
          icon={<LayoutGrid className="w-4 h-4 text-white shrink-0" />}
          label="Categories"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/categories")}
        />
        <NavItem
          icon={<ChartPie className="w-4 h-4 text-white shrink-0" />}
          label="Budgets"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/budgets")}
        />
        <NavItem
          icon={<ChartColumn className="w-4 h-4 text-white shrink-0" />}
          label="Reports"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/reports")}
        />
        <NavItem
          icon={<CircleUser className="w-4 h-4 text-white shrink-0" />}
          label="Profile"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/profile")}
        />
        <NavItem
          icon={<Settings className="w-4 h-4 text-white shrink-0" />}
          label="Settings"
          isOpen={isOpen}
          onClick={() => router.push("/dashboard/settings")}
        />

        {/* Logout */}
        <div className="mt-auto">
          <div className="border border-gray-600"></div>
          <NavItem
            icon={<LogOut className="w-4 h-4 text-white shrink-0" />}
            label="Log Out"
            isOpen={isOpen}
          />
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  isOpen,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90 ${
        !isOpen ? "justify-center" : ""
      }`}
    >
      {icon}
      {isOpen && <p className="text-white whitespace-nowrap">{label}</p>}
    </div>
  );
}
