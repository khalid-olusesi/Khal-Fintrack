"use client";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Menu, ArrowDown } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import {
  BriefcaseBusiness,
  Laptop,
  Lightbulb,
  MonitorPlay,
  ShoppingCart,
} from "lucide-react";

const pieData = [
  { name: "Food & Dining", value: 850 },
  { name: "Transport", value: 600 },
  { name: "Shopping", value: 750 },
  { name: "Entertainment", value: 500 },
  { name: "Televison", value: 420 },
  { name: "others", value: 320 },
];

const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#FACC15",
  "#F97316",
  "#A855F7",
  "#06B6D4",
];

export default function Main() {
  const { toggleSidebar } = useSidebar();

  return (
    //main container

    <div className="bg-gray-100 w-full h-full p-6 overflow-auto">
      {/* menu button */}
      <div className="flex gap-4 items-center">
        <button className="mb-4" onClick={toggleSidebar}>
          <Menu className="w-4 h-4 cursor-pointer" />
        </button>
        <h1 className="text-xl mb-4 font-bold">Dashboard</h1>
      </div>

      {/* flex divs */}
      <div className="flex justify-between items-center mt-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-[14px] text-muted-foreground">Total Balance</p>
          <p className="text-xl pb-1 font-bold">$5,300.20</p>
          <p className="text-[14px] text-green-600">2% more than last march</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-[14px] text-muted-foreground">Total Income</p>
          <p className="text-xl pb-1 font-bold">$7,800.20</p>
          <p className="text-[14px] text-green-600">
            3.4% more than last march
          </p>
        </div>

        <div className=" bg-white shadow-lg rounded-lg p-6">
          <p className="text-[14px] text-muted-foreground">Total Expense</p>
          <p className="text-xl pb-1 font-bold">$4,700.80</p>
          <p className="text-[14px] text-red-600">0.5% less than last march</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-[14px] text-muted-foreground">Savings</p>
          <p className="text-xl pb-1 font-bold">$8,300.60</p>
          <p className="text-[14px] text-green-600">
            4.3% more than last march
          </p>
        </div>
      </div>

      {/* bigger subsection */}
      <div className="flex mt-10 items-center justify-between gap-4">
        {/*left bigger subsection */}
        <div className="bg-white flex-1 rounded-lg shadow-lg pt-6 pl-3 pr-8 pb-8">
          <div className="flex items-center justify-between mb-10">
            <p className="font-bold">Spending Overview</p>
            <button className="flex items-center gap-4 cursor-pointer p-1 border-gray-100 text-[13px] text-muted-foreground border">
              The month
              <ArrowDown className="w-3 h-3 text-black" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 pb-15">
            <div className="w-48 h-48 ">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="white"
                    strokeWidth={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* list */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 h-3 w-3 rounded-4xl"></div>
                <div className="flex items-center justify-between gap-9 text-muted-foreground text-sm">
                  <p className="">Food & Dining</p>
                  $850.00
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-500 h-3 w-3 rounded-4xl"></div>
                <div className="flex items-center justify-between gap-17 text-muted-foreground text-sm">
                  <p className="">Transport</p>
                  $600.00
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 h-3 w-3 rounded-4xl"></div>
                <div className="flex items-center justify-between gap-8 text-muted-foreground text-sm">
                  <p className="">Bills & Utilities</p>
                  $750.00
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-red-500 h-3 w-3 rounded-4xl"></div>
                <div className="flex items-center justify-between gap-11 text-muted-foreground text-sm">
                  <p className="">Entertainment</p>
                  $500.00
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-500 h-3 w-3 rounded-4xl"></div>
                <div className="flex items-center justify-between gap-17 text-muted-foreground text-sm">
                  <p className="">Televison</p>
                  $700.00
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-500 h-3 w-3 rounded-xs"></div>
                <div className="flex items-center justify-between gap-22 text-muted-foreground text-sm">
                  <p className="">others</p>
                  $319.89
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right bigger subsection */}
        <div className="bg-white p-4 space-y-3 flex-1 rounded-lg shadow-lg justify-between items-center">
          <div className="flex justify-between items-center">
            <p className="font-bold pb-2">Recent Transactions</p>
            <p>View all</p>
          </div>

          {/* subsection */}
          <div className="space-y-4.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 flex justify-center items-center rounded-2xl w-8 h-8">
                  <ShoppingCart className="w-4 h-4 text-blue-800" />
                </div>
                <div>
                  <p>Grocery Store</p>
                  <p className="text-muted-foreground text-[13px]">
                    July 11, 2026
                  </p>
                </div>
              </div>

              <p className="text-red-500 text-[13px]">-$45.43</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 flex justify-center items-center rounded-2xl w-8 h-8">
                  <BriefcaseBusiness className="w-4 h-4 text-yellow-800" />
                </div>
                <div>
                  <p>Salary</p>
                  <p className="text-muted-foreground text-[13px]">
                    May 9, 2026
                  </p>
                </div>
              </div>

              <p className="text-green-600 text-[13px]">+$53000.00</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 flex justify-center items-center rounded-2xl w-8 h-8">
                  <Lightbulb className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p>Electricity Bill</p>
                  <p className="text-muted-foreground text-[13px]">
                    August 3, 2026
                  </p>
                </div>
              </div>

              <p className="text-red-600 text-[13px]">-$120.00</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 flex justify-center items-center rounded-2xl w-8 h-8">
                  <MonitorPlay className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p>Netflix Subscription</p>
                  <p className="text-muted-foreground text-[13px]">
                    june 21, 2026
                  </p>
                </div>
              </div>

              <p className="text-red-600 text-[13px]">-$16.00</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 flex justify-center items-center rounded-2xl w-8 h-8">
                  <Laptop className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p>Freelance Work</p>
                  <p className="text-muted-foreground text-[13px]">
                    July 28, 2026
                  </p>
                </div>
              </div>

              <p className="text-green-600 text-[13px]">+$1250.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
