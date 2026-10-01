"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  PiggyBank,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import DateFilter from "@/components/date-filter";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/category-icons";
import { useSidebar } from "@/context/sidebar-context";
import { useCurrency } from "@/context/currency-context";
import { formatCurrency } from "@/lib/currency";

type DashboardCategory = {
  id: number | null;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
};

type DashboardTransaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category?: { name: string; icon: string } | null;
};

type DashboardData = {
  total_balance: number;
  total_income: number;
  total_expenses: number;
  spending_by_category: DashboardCategory[];
  recent_transactions: DashboardTransaction[];
};

const emptyDashboard: DashboardData = {
  total_balance: 0,
  total_income: 0,
  total_expenses: 0,
  spending_by_category: [],
  recent_transactions: [],
};

const FALLBACK_COLORS = [
  "#16a34a",
  "#2563eb",
  "#eab308",
  "#ea580c",
  "#dc2626",
  "#64748b",
];

export default function Main() {
  const { toggleSidebar } = useSidebar();
  const { currency } = useCurrency();
  const router = useRouter();
  const [period, setPeriod] = useState("This Month");
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getDashboard = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard?date=${encodeURIComponent(period)}`,
          {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );

        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setDashboard({
          total_balance: data.total_balance ?? 0,
          total_income: data.total_income ?? 0,
          total_expenses: data.total_expenses ?? 0,
          spending_by_category: data.spending_by_category ?? [],
          recent_transactions: data.recent_transactions ?? [],
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        console.error(error);
        setDashboard(emptyDashboard);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    getDashboard();
    return () => controller.abort();
  }, [period]);

  const savingsRate =
    dashboard.total_income > 0
      ? ((dashboard.total_income - dashboard.total_expenses) /
          dashboard.total_income) *
        100
      : 0;
  const hasTransactions = dashboard.recent_transactions.length > 0;

  const openAddTransaction = () =>
    router.push("/dashboard/transaction/addTransaction");

  return (
    <main className="h-full w-full overflow-y-auto bg-gray-100 p-4 dark:bg-background md:p-6">
      <div className="mb-6 space-y-3 md:flex md:items-center md:justify-between md:space-y-0">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="shrink-0 cursor-pointer rounded-md p-2 hover:bg-muted"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 md:hidden">
              <MainLogo />
            </div>
            <h1 className="hidden text-xl font-bold md:block">Dashboard</h1>
          </div>
          <div className="shrink-0 md:hidden">
            <ModeToggle />
          </div>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="min-w-0 flex-1 md:flex-none">
            <DateFilter value={period} onValueChange={setPeriod} />
          </div>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Button
            onClick={openAddTransaction}
            className="shrink-0 cursor-pointer gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        <Metric
          title="Total Balance"
          value={dashboard.total_balance}
          currency={currency}
          loading={isLoading}
          caption="All time · not affected by period filter"
          icon={Wallet}
          iconColor="text-blue-700 dark:text-blue-300"
          iconBackground="bg-blue-50 dark:bg-blue-950/40"
        />
        <Metric
          title="Total Income"
          value={dashboard.total_income}
          currency={currency}
          loading={isLoading}
          icon={TrendingUp}
          iconColor="text-green-700 dark:text-green-300"
          iconBackground="bg-green-50 dark:bg-green-950/40"
        />
        <Metric
          title="Total Expenses"
          value={dashboard.total_expenses}
          currency={currency}
          loading={isLoading}
          icon={TrendingDown}
          iconColor="text-rose-700 dark:text-rose-300"
          iconBackground="bg-rose-50 dark:bg-rose-950/40"
        />
        <div className="min-h-[140px] rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Savings
            </p>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <PiggyBank className="h-4 w-4" />
            </span>
          </div>
          {isLoading ? (
            <Skeleton className="my-3 h-7 w-36" />
          ) : (
            <p className="my-3 whitespace-nowrap text-sm font-bold tabular-nums tracking-tight text-gray-900 dark:text-foreground sm:text-base md:text-2xl">
              {formatCurrency(
                dashboard.total_income - dashboard.total_expenses,
                currency,
              )}
            </p>
          )}
          {isLoading ? (
            <Skeleton className="mt-3 h-3 w-40" />
          ) : (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Savings rate{" "}
              {Number.isFinite(savingsRate) ? savingsRate.toFixed(1) : "0.0"}% ·{" "}
              {period.toLowerCase()}
            </p>
          )}
        </div>
      </section>

      {!isLoading && !hasTransactions ? (
        <section className="mb-6 flex flex-col items-center rounded-xl border border-dashed border-border bg-white px-5 py-10 text-center dark:bg-card">
          <p className="text-base font-semibold">Start tracking your money</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Your totals and spending breakdown will appear here after your first
            transaction.
          </p>
          <Button
            onClick={openAddTransaction}
            className="mt-5 cursor-pointer gap-2"
          >
            <Plus className="h-4 w-4" /> Add your first transaction
          </Button>
        </section>
      ) : null}

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-border dark:bg-card md:p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Spending by Category
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Expenses for {period.toLowerCase()}
              </p>
            </div>
          </div>
          {isLoading ? (
            <div className="grid h-56 grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(150px,0.8fr)_1.2fr]">
              <div className="flex justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : dashboard.spending_by_category.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <p className="text-sm font-medium">No expenses for this period</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try another period or add an expense.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(150px,0.8fr)_1.2fr]">
              <div className="h-52 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard.spending_by_category}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {dashboard.spending_by_category.map((category, index) => (
                        <Cell
                          key={`${category.id ?? "uncategorized"}-${category.name}`}
                          fill={
                            category.color ||
                            FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={false}
                      formatter={(value) =>
                        formatCurrency(Number(value), currency)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="min-w-0">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 border-b border-border pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <span>Category</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">%</span>
                </div>
                <div className="max-h-56 divide-y divide-border overflow-y-auto">
                  {dashboard.spending_by_category.map((category, index) => (
                    <div
                      key={`${category.id ?? "uncategorized"}-${category.name}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-2.5 text-xs"
                    >
                      <span className="flex min-w-0 items-center gap-2 font-medium">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              category.color ||
                              FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                          }}
                        />
                        <span className="truncate">{category.name}</span>
                      </span>
                      <span className="whitespace-nowrap text-right tabular-nums">
                        {formatCurrency(category.amount, currency)}
                      </span>
                      <span className="w-10 text-right tabular-nums">
                        {category.percentage.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-border dark:bg-card md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Recent Transactions
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest activity
              </p>
            </div>
            <Button
              variant="link"
              onClick={() => router.push("/dashboard/transaction")}
              className="cursor-pointer px-0 text-green-700 dark:text-green-400"
            >
              View all
            </Button>
          </div>
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-40 max-w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24 shrink-0" />
                </div>
              ))}
            </div>
          ) : dashboard.recent_transactions.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                No transactions yet
              </p>
              <Button
                variant="link"
                onClick={openAddTransaction}
                className="mt-1 cursor-pointer"
              >
                Add transaction
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {dashboard.recent_transactions.map((transaction) => {
                const isIncome = transaction.type === "income";
                const categoryIcon = Icons.find(
                  (item) => item.name === transaction.category?.icon,
                );
                const Icon =
                  categoryIcon?.icon ??
                  (isIncome ? ArrowDownRight : ArrowUpRight);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${categoryIcon ? `${categoryIcon.selectedBg} ${categoryIcon.textColor} dark:bg-card` : isIncome ? "bg-green-50 text-green-600 dark:bg-green-950/30" : "bg-red-50 text-red-500 dark:bg-red-950/30"}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {transaction.category?.name ||
                            transaction.description ||
                            "Uncategorized"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {transaction.description}
                          {transaction.description && " · "}
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums ${isIncome ? "text-green-600" : "text-red-500"}`}
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(Math.abs(transaction.amount), currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({
  title,
  value,
  currency,
  loading,
  caption,
  icon: Icon,
  iconColor,
  iconBackground,
}: {
  title: string;
  value: number;
  currency: string;
  loading: boolean;
  caption?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
}) {
  return (
    <div className="min-h-[140px] rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-border dark:bg-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBackground} ${iconColor}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="my-4 h-7 w-36" />
      ) : (
        <p className="my-3 whitespace-nowrap text-sm font-bold tabular-nums tracking-tight text-gray-900 dark:text-foreground sm:text-base md:text-2xl">
          {formatCurrency(value, currency)}
        </p>
      )}
      {loading ? (
        <Skeleton className="mt-3 h-3 w-40" />
      ) : (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {caption ?? "For selected period"}
        </p>
      )}
    </div>
  );
}
