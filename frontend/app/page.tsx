"use client";

import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/context/currency-context";
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
  const { currency } = useCurrency();

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#f5f5f5] via-white to-[#f9fafb] dark:from-background dark:via-background dark:to-background">
      {/* header container div */}
      <div className="w-full">
        <div className="flex justify-between items-center px-5 py-3 md:px-6">
          <div>
            <MainLogo />
          </div>

          <div className="md:hidden">
            <ModeToggle />
          </div>

          {/* header nav links - desktop only */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="#features"
              className="text-black dark:text-foreground font-medium text-sm hover:text-green-600 transition-colors"
            >
              Features
            </Link>

            <Link
              href="#about"
              className="text-black dark:text-foreground font-medium text-sm hover:text-green-600 transition-colors"
            >
              About
            </Link>

            <Link
              href="#contact"
              className="text-black dark:text-foreground font-medium text-sm hover:text-green-600 transition-colors"
            >
              Contact
            </Link>

            <span className="text-black dark:text-foreground flex items-center ml-2">
              <ModeToggle />
            </span>
          </div>
        </div>

        {/* landing page main contents */}
        <div className="flex flex-col items-center px-5 pt-6 pb-4 md:flex md:flex-1 md:flex-row md:items-center md:justify-between md:ml-10 md:mr-10">
          {/* text content */}
          <div
            className="w-full md:w-65 flex gap-2 flex-col animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-2xl md:text-3xl font-bold leading-tight">
              Take Control of Your Finances
            </p>
            <p className="text-sm text-muted-foreground md:w-58 leading-relaxed">
              Track your income, expenses and savings in one place. Simple,
              powerful and built for you.
            </p>

            {/* desktop buttons only */}
            <div className="hidden md:flex md:flex-row md:pl-0 mt-auto gap-3">
              <Button className="md:rounded-md md:pl-2.5 md:pr-2.5 md:h-10 md:w-auto text-sm cursor-pointer">
                <Link href={"/auth/signup"}>Get Started</Link>
              </Button>
              <Button className="md:w-auto md:h-10 md:rounded-md text-sm bg-white text-green-700 border border-green-700 hover:bg-green-50 cursor-pointer dark:bg-transparent dark:text-green-400 dark:border-green-400 dark:hover:bg-green-950/20">
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* balance card */}
          <div
            className="w-full md:w-95 h-auto md:h-auto rounded-2xl bg-white dark:bg-card dark:border dark:border-border shadow-xl p-5 md:p-6 mt-6 md:mt-10 animate-fade-in-up"
            style={{ animationDelay: "250ms" }}
          >
            <p className="text-muted-foreground text-[10px]">Total Balance</p>
            <p className="font-bold text-xl">
              {formatCurrency(5231.89, currency)}
            </p>

            <div className="flex items-center justify-between mt-3 mb-1 md:hidden">
              <div>
                <p className="text-muted-foreground text-[10px]">
                  Income This Month
                </p>
                <p className="font-semibold text-base">
                  {formatCurrency(1428.2, currency)}
                </p>
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
                        <stop
                          offset="5%"
                          stopColor="#86efac"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="95%"
                          stopColor="#86efac"
                          stopOpacity={0}
                        />
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
                    {formatCurrency(850, currency)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-500 h-3 w-3 rounded-4xl"></div>
                  <div className="flex items-center justify-between gap-17 text-muted-foreground text-sm">
                    <p className="">Transport</p>
                    {formatCurrency(600, currency)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500 h-3 w-3 rounded-4xl"></div>
                  <div className="flex items-center justify-between gap-8 text-muted-foreground text-sm">
                    <p className="">Bills & Utilities</p>
                    {formatCurrency(750, currency)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-red-500 h-3 w-3 rounded-4xl"></div>
                  <div className="flex items-center justify-between gap-11 text-muted-foreground text-sm">
                    <p className="">Entertainment</p>
                    {formatCurrency(500, currency)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 h-3 w-3 rounded-xs"></div>
                  <div className="flex items-center justify-between gap-22 text-muted-foreground text-sm">
                    <p className="">others</p>
                    {formatCurrency(319.89, currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* features section */}
      <div
        id="features"
        className="relative px-5 py-12 md:py-20 overflow-hidden"
      >
        {/* Background decorative blobs */}
        <div className="absolute top-1/2 left-4 md:left-1/4 w-64 h-64 bg-green-400/20 dark:bg-green-600/10 rounded-full blur-3xl -z-10 transform -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-4 md:right-1/4 w-64 h-64 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 transform -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="animate-fade-in-up flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl hover:-translate-y-1 transition-transform duration-300"
            style={{ animationDelay: "350ms" }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center shrink-0 mb-4 shadow-inner">
              <FontAwesomeIcon
                icon={faReceipt}
                className="w-5 h-5 text-green-700 dark:text-green-400"
              />
            </div>
            <p className="font-bold text-lg mb-1">Track Expenses</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Easily track and categorize your expenses in real-time.
            </p>
          </div>

          <div
            className="animate-fade-in-up flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl hover:-translate-y-1 transition-transform duration-300"
            style={{ animationDelay: "500ms" }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center shrink-0 mb-4 shadow-inner">
              <FontAwesomeIcon
                icon={faChartPie}
                className="w-5 h-5 text-green-700 dark:text-green-400"
              />
            </div>
            <p className="font-bold text-lg mb-1">Analyze Spending</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualize your spending habits with powerful, interactive charts.
            </p>
          </div>

          <div
            className="animate-fade-in-up flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl hover:-translate-y-1 transition-transform duration-300"
            style={{ animationDelay: "650ms" }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center shrink-0 mb-4 shadow-inner">
              <FontAwesomeIcon
                icon={faBullseye}
                className="w-5 h-5 text-green-700 dark:text-green-400"
              />
            </div>
            <p className="font-bold text-lg mb-1">Achieve Goals</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Set smart budgets and seamlessly reach your financial goals.
            </p>
          </div>
        </div>

        {/* mobile buttons */}
        <div className="flex flex-col gap-3 mt-8 md:hidden">
          <Button className="w-full h-11 rounded-xl text-sm cursor-pointer">
            <Link
              href={"/auth/signup"}
              className="w-full h-full flex items-center justify-center"
            >
              Get Started
            </Link>
          </Button>
          <Button className="w-full h-11 rounded-xl text-sm bg-white text-green-700 border border-green-700 hover:bg-green-50 cursor-pointer dark:bg-transparent dark:text-green-400 dark:border-green-400 dark:hover:bg-green-950/20">
            <Link
              href="#about"
              className="w-full h-full flex items-center justify-center"
            >
              Learn More
            </Link>
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="px-5 py-12 md:py-16 relative overflow-hidden">
        <div
          className="animate-fade-in-up max-w-4xl mx-auto p-6 md:p-10 rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden"
          style={{ animationDelay: "200ms" }}
        >
          {/* Decorative elements inside the card */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              About Khal-FinTrack
            </h2>
            <p className="text-muted-foreground leading-relaxed md:text-base">
              Khal-FinTrack is designed to help you take complete control of
              your financial life. We understand that tracking expenses, setting
              budgets, and achieving financial goals can be overwhelming. That's
              why we built a simple, yet powerful platform that provides clear
              insights into your spending habits. Whether you're saving for a
              vacation, paying off debt, or just trying to stay within your
              monthly budget, Khal-FinTrack provides the tools you need to
              succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="px-5 py-12 md:py-16 relative">
        <div
          className="animate-fade-in-up max-w-4xl mx-auto p-6 md:p-10 rounded-3xl bg-gradient-to-b from-white/60 to-white/30 dark:from-black/40 dark:to-black/10 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl"
          style={{ animationDelay: "300ms" }}
        >
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground md:text-base max-w-2xl mx-auto">
              Have questions, feedback, or want to collaborate? I'd love to hear
              from you. Let's make financial tracking better together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Email */}
            <a
              href="mailto:olusesikhalid43@gmail.com"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all duration-300 group cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-100 to-green-50 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-base mb-1">Email</p>
                <p className="text-muted-foreground text-xs group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  olusesikhalid43@gmail.com
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:09038244886"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all duration-300 group cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-100 to-green-50 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-inner">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-base mb-1">Phone</p>
                <p className="text-muted-foreground text-xs group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  09038244886
                </p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/olusesi-khalid-931a44347/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-white/60 dark:border-white/5 transition-all duration-300 group cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-100 to-green-50 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-base mb-1">LinkedIn</p>
                <p className="text-muted-foreground text-xs group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Olusesi Khalid
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-gray-200/50 dark:border-border/50">
        <p>
          &copy; {new Date().getFullYear()} Khal-FinTrack. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
