"use client";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Menu, ArrowDown, Bell } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    //main container
    <div className="bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-auto">
      {/* --- MOBILE VIEW --- */}
      <div className="block md:hidden space-y-5">
        {/* Mobile Top Header */}
        <div className="flex justify-between items-center bg-white dark:bg-card dark:border-border p-4 shadow-sm border-b -mx-4 -mt-4 mb-4">
          <button className="cursor-pointer" onClick={toggleSidebar}>
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <MainLogo />
          <ModeToggle />
        </div>

        {/* Dashboard Title & Bell */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <button className="p-1 cursor-pointer">
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-white dark:bg-card shadow-sm border border-gray-100 dark:border-border rounded-xl p-4">
          <p className="text-[12px] text-muted-foreground uppercase font-medium tracking-wider">
            Total Balance
          </p>
          <p className="text-2xl font-bold text-gray-900 my-1">$5,231.89</p>
          <p className="text-[12px] text-green-600 flex items-center gap-1 font-medium">
            <span>▲</span> 12.5% from last month
          </p>
        </div>

        {/* Income / Expenses Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Income Card */}
          <div className="bg-white dark:bg-card shadow-sm border border-gray-100 dark:border-border rounded-xl p-4">
            <p className="text-[12px] text-muted-foreground uppercase font-medium tracking-wider">
              Income
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-foreground my-1">
              $8,650.00
            </p>
            <p className="text-[12px] text-green-600 flex items-center gap-1 font-medium">
              <span>▲</span> 8.2%
            </p>
          </div>
          {/* Expenses Card */}
          <div className="bg-white dark:bg-card shadow-sm border border-gray-100 dark:border-border rounded-xl p-4">
            <p className="text-[12px] text-muted-foreground uppercase font-medium tracking-wider">
              Expenses
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-foreground my-1">
              $3,418.11
            </p>
            <p className="text-[12px] text-green-600 flex items-center gap-1 font-medium">
              <span>▲</span> 6.1%
            </p>
          </div>
          <div className="bg-white dark:bg-card shadow-sm border border-gray-100 dark:border-border rounded-xl p-4">
            <p className="text-[12px] text-muted-foreground uppercase font-medium tracking-wider">
              Savings
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-foreground my-1">
              $8,300.60
            </p>
            <p className="text-[12px] text-green-600 flex items-center gap-1 font-medium">
              <span>▲</span> 4.3%
            </p>
          </div>
        </div>

        {/* Spending Overview */}
        <div className="bg-white dark:bg-card shadow-sm border border-gray-100 dark:border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-sm text-gray-900 dark:text-foreground">
              Spending Overview
            </p>
            <button className="flex items-center gap-1 cursor-pointer p-1 px-2 rounded border border-gray-200 dark:border-border text-[11px] text-muted-foreground bg-gray-50 dark:bg-card">
              This Month
              <ArrowDown className="w-3 h-3 text-gray-500 dark:text-foreground" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    stroke="white"
                    strokeWidth={2}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* List with percentages */}
            <div className="flex-1 space-y-1.5 pl-2">
              {[
                { name: "Food & Dining", val: "34%", color: "bg-blue-600" },
                { name: "Transport", val: "24%", color: "bg-green-500" },
                { name: "Shopping", val: "16%", color: "bg-yellow-500" },
                {
                  name: "Bills & Utilities",
                  val: "16%",
                  color: "bg-orange-500",
                },
                { name: "Entertainment", val: "5%", color: "bg-red-500" },
                { name: "Others", val: "4%", color: "bg-blue-400" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px] text-gray-700"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <div
                      className={`${item.color} h-2 w-2 rounded-full shrink-0`}
                    ></div>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 ml-1">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-sm text-gray-900">
              Recent Transactions
            </p>
            <span
              onClick={() => router.push("/dashboard/transaction")}
              className="text-xs text-green-600 font-semibold hover:underline cursor-pointer"
            >
              View All
            </span>
          </div>

          <div className="space-y-4">
            {/* Transaction 1 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 flex justify-center items-center rounded-full w-9 h-9 shrink-0">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Grocery Store
                  </p>
                  <p className="text-muted-foreground text-[10px]">Today</p>
                </div>
              </div>
              <p className="text-red-500 text-xs font-bold">-$45.20</p>
            </div>

            {/* Transaction 2 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-50 flex justify-center items-center rounded-full w-9 h-9 shrink-0">
                  <BriefcaseBusiness className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Salary</p>
                  <p className="text-muted-foreground text-[10px]">May 12</p>
                </div>
              </div>
              <p className="text-green-600 text-xs font-bold">+$4,500.00</p>
            </div>

            {/* Transaction 3 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 flex justify-center items-center rounded-full w-9 h-9 shrink-0">
                  <MonitorPlay className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Netflix Subscription
                  </p>
                  <p className="text-muted-foreground text-[10px]">May 11</p>
                </div>
              </div>
              <p className="text-red-500 text-xs font-bold">-$15.99</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-950/30 flex justify-center items-center rounded-xl w-7 h-7">
                  <Laptop className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-foreground">
                    Freelance Work
                  </p>
                  <p className="text-muted-foreground text-[10px]">May 10</p>
                </div>
              </div>
              <p className="text-green-600 text-xs font-bold">+$250.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block">
        {/* menu button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 items-center">
            <button className="cursor-pointer" onClick={toggleSidebar}>
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <ModeToggle />
        </div>

        {/* flex divs */}
        <div className="flex justify-between items-center mt-4">
          <div className="bg-white dark:bg-card dark:border dark:border-border shadow-lg rounded-lg p-6">
            <p className="text-[14px] text-muted-foreground">Total Balance</p>
            <p className="text-xl pb-1 font-bold">$5,300.20</p>
            <p className="text-[14px] text-green-600">
              2% more than last march
            </p>
          </div>

          <div className="bg-white dark:bg-card dark:border dark:border-border shadow-lg rounded-lg p-6">
            <p className="text-[14px] text-muted-foreground">Total Income</p>
            <p className="text-xl pb-1 font-bold">$7,800.20</p>
            <p className="text-[14px] text-green-600">
              3.4% more than last march
            </p>
          </div>

          <div className="bg-white dark:bg-card dark:border dark:border-border shadow-lg rounded-lg p-6">
            <p className="text-[14px] text-muted-foreground">Total Expense</p>
            <p className="text-xl pb-1 font-bold">$4,700.80</p>
            <p className="text-[14px] text-red-600">
              0.5% less than last march
            </p>
          </div>

          <div className="bg-white dark:bg-card dark:border dark:border-border shadow-lg rounded-lg p-6">
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
          <div className="bg-white dark:bg-card dark:border dark:border-border flex-1 rounded-lg shadow-lg pt-6 pl-3 pr-8 pb-8">
            <div className="flex items-center justify-between mb-10">
              <p className="font-bold">Spending Overview</p>
              <button className="flex items-center gap-4 cursor-pointer p-1 border-gray-100 dark:border-border text-[13px] text-muted-foreground border dark:bg-card">
                The month
                <ArrowDown className="w-3 h-3 text-black dark:text-foreground" />
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
                      className="stroke-white dark:stroke-card"
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
          <div className="bg-white dark:bg-card dark:border dark:border-border p-4 space-y-3 flex-1 rounded-lg shadow-lg justify-between items-center">
            <div className="flex justify-between items-center">
              <p className="font-bold pb-2">Recent Transactions</p>
              <p className="text-green-600 font-semibold cursor-pointer">
                View all
              </p>
            </div>

            {/* subsection */}
            <div className="space-y-4.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-950/30 flex justify-center items-center rounded-2xl w-8 h-8">
                    <ShoppingCart className="w-4 h-4 text-blue-800 dark:text-blue-400" />
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
                  <div className="bg-yellow-100 dark:bg-yellow-950/30 flex justify-center items-center rounded-2xl w-8 h-8">
                    <BriefcaseBusiness className="w-4 h-4 text-yellow-800 dark:text-yellow-400" />
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
                  <div className="bg-red-100 dark:bg-red-950/30 flex justify-center items-center rounded-2xl w-8 h-8">
                    <Lightbulb className="w-4 h-4 text-red-500 dark:text-red-400" />
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
                  <div className="bg-red-100 dark:bg-red-950/30 flex justify-center items-center rounded-2xl w-8 h-8">
                    <MonitorPlay className="w-4 h-4 text-red-500 dark:text-red-400" />
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
                  <div className="bg-green-100 dark:bg-green-950/30 flex justify-center items-center rounded-2xl w-8 h-8">
                    <Laptop className="w-4 h-4 text-green-500 dark:text-green-400" />
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
    </div>
  );
}
