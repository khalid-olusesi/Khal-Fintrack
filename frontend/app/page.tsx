"use client";

import { MainLogo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faReceipt,
  faChartPie,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";

const pieData = [
  { name: "Food & Dining", value: 850 },
  { name: "Transport", value: 600 },
  { name: "Shopping", value: 750 },
  { name: "Entertainment", value: 500 },
  { name: "Others", value: 320 },
];

const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#F97316", "#06B6D4"];

const data = [
  { month: "Jan", amount: 220 },
  { month: "Feb", amount: 260 },
  { month: "Mar", amount: 240 },
  { month: "Apr", amount: 300 },
  { month: "May", amount: 280 },
  { month: "Jun", amount: 360 },
  { month: "Jul", amount: 340 },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* header container div */}
      <div className="flex justify-between items-center px-5 py-3 md:px-6">
        <div>
          <MainLogo />
        </div>

        {/* hamburger menu - mobile only */}
        <button className="md:hidden text-gray-700 p-2">
          <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
        </button>

        {/* header nav links - desktop only */}
        <div className="hidden md:flex gap-4 items-center">
          <span className="text-black">
            <Link href="" className="decoration-0">
              Features
            </Link>
          </span>

          <span className="text-black">
            <Link href="" className="decoration-0">
              About
            </Link>
          </span>

          <span className="text-black">
            <Link href="" className="decoration-0">
              Contact
            </Link>
          </span>

          <span className="text-black">
            <Button>
              <Link href="" className="decoration-0">
                Get started
              </Link>
            </Button>
          </span>
        </div>
      </div>

      {/* landing page main contents */}
      <div className="flex flex-col items-center px-5 pt-6 pb-4 md:flex md:flex-1 md:flex-row md:items-center md:justify-between md:ml-10 md:mr-10">
        {/* text content */}
        <div className="w-full md:w-65 flex gap-3 flex-col">
          <p className="text-3xl md:text-4xl font-bold leading-tight">
            Take Control of Your Finances
          </p>
          <p className="text-sm text-muted-foreground md:w-58 leading-relaxed">
            Track your income, expenses and savings in one place. Simple,
            powerful and built for you.
          </p>

          {/* mobile buttons */}
          <div className="px-5 pb-6 pt-2 flex flex-col gap-3 md:flex-row md:pl-0 mt-auto">
            <Button className="w-full md:rounded-md md:pl-2.5 md:pr-2.5 md:h-10 md: md:w-auto h-11 rounded-xl text-sm cursor-pointer">
              Get Started
            </Button>
            <Button className="w-full h-11 md:w-auto md:h-10 md:rounded-md rounded-xl text-sm bg-white text-green-700 border border-green-700 hover:bg-green-50 cursor-pointer">
              Learn More
            </Button>
          </div>
        </div>

        {/* balance card */}
        <div className="w-full md:w-[380px] h-auto md:h-auto rounded-2xl bg-white shadow-xl p-5 md:p-6 mt-6 md:mt-10">
          <p className="text-muted-foreground text-[10px]">Total Balance</p>
          <p className="font-bold text-2xl">$5,231.89</p>

          <div className="flex items-center justify-between mt-3 mb-1 md:hidden">
            <div>
              <p className="text-muted-foreground text-[10px]">
                Income This Month
              </p>
              <p className="font-semibold text-base">$1,428.20</p>
            </div>
            <div className="w-[100px] h-[50px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="balanceMini"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#86efac" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#balanceMini)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* desktop chart - larger */}
          <div className="hidden md:block">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#86efac" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#balance)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* piechart */}
          <div className="flex items-center justify-between mt-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={30}
                    outerRadius={50}
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
                <div className="bg-blue-500 h-3 w-3 rounded-[2px]"></div>
                <div className="flex items-center justify-between gap-22 text-muted-foreground text-sm">
                  <p className="">others</p>
                  $319.89
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* footer */}
      <div className="px-5 py-4 pb-12 pt-5 bg-white shadow-lg">
        <div className="md:flex md:flex-row md:items-center md:justify-around flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <FontAwesomeIcon
                icon={faReceipt}
                className="w-4 h-4 text-green-700"
              />
            </div>
            <div>
              <p className="md:font-semibold text-sm">Track Expenses</p>
              <p className="text-muted-foreground text-xs md:w-35">
                Easily track and categorize your expenses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-l-2 border-r-2 pl-12 pr-12">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faChartPie}
                className="w-4 h-4 text-green-700"
              />
            </div>
            <div className="">
              <p className="font-semibold text-sm">Analyze Spending</p>
              <p className="text-muted-foreground text-xs md:w-35">
                Visualize your spending with powerful charts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faBullseye}
                className="w-4 h-4 text-green-700"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">Achieve Goals</p>
              <p className="text-muted-foreground text-xs md:w-35">
                Set budgets and reach your financial goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
