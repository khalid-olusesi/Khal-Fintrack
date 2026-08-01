"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";

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

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-[1fr_5fr] gap-4 bg-[#17283E]">
      {/* section */}
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="">
            <Link className="flex gap-2 items-center cursor-pointer" href="/">
              <FontAwesomeIcon
                icon={faChartColumn}
                className="text-green-700 w-5 h-5"
              />
              <h1 className="text-[14px] font-medium text-white">
                Khal-FinTrack
              </h1>
            </Link>
          </div>
        </div>

        <div className="flex flex-col flex-1 pl-2">
          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <Home className="w-4 h-4 text-white" />
            <p className="text-white">Dashboard</p>
          </div>

          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <Wallet className="w-4 h-4 text-white" />
            <p className="text-white">Transactions</p>
          </div>

          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <LayoutGrid className="w-4 h-4 text-white" />
            <p className="text-white">Categories</p>
          </div>

          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <ChartPie className="w-4 h-4 text-white" />
            <p className="text-white">Budgets</p>
          </div>

          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <ChartColumn className="w-4 h-4 text-white" />
            <p className="text-white">Reports</p>
          </div>

          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <CircleUser className="w-4 h-4 text-white" />
            <p className="text-white">Profile</p>
          </div>

          <div className="flex items-center gap-2 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90">
            <Settings className="w-4 h-4 text-white" />
            <p className="text-white">Settings</p>
          </div>

          <div className="mt-auto">
            <div className="border border-gray-600"></div>
            <div className="text-white flex items-center gap-3 p-4 hover:bg-green-600 hover:cursor-pointer hover:rounded-lg active:opacity-90 pl-2 mt-2 mb-2">
              <LogOut className="w-4 h-4" />
              <p>Log Out</p>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
