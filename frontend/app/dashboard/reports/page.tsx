"use client";

import { ModeToggle } from "@/components/toggle";
import { useSidebar } from "@/context/sidebar-context";
import { Menu, BarChart2, ListOrdered } from "lucide-react";
import DateFilter from "@/components/date-filter";
import { useState, useEffect } from "react";
import IncomeExpensesChart from "@/components/bar-chart";
import TopSpendingCategories from "@/components/top-spending";
import { Skeleton } from "@/components/ui/skeleton";

export default function Reports() {
  const [dateFilter, setDateFilter] = useState("This Month");
  const { toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(true);

  const [incomeVsExpenses, setIncomeVsExpenses] = useState<
    { period: string; income: number; expenses: number }[]
  >([]);

  const [topCategories, setTopCategories] = useState<
    {
      id: number;
      name: string;
      icon: string;
      color: string;
      spent: number;
      percentage: number;
    }[]
  >([]);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const getReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports?date=${encodeURIComponent(dateFilter)}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();

      let comparison = Array.isArray(data.income_vs_expenses)
        ? data.income_vs_expenses
        : [];
      const comparisonIncome = comparison.reduce(
        (total: number, item: { income?: number }) =>
          total + Number(item.income || 0),
        0,
      );
      const comparisonExpenses = comparison.reduce(
        (total: number, item: { expenses?: number }) =>
          total + Number(item.expenses || 0),
        0,
      );
      const reportIncome = Number(data.total_income || 0);
      const reportExpenses = Number(data.total_expenses || 0);
      const comparisonNeedsRefresh =
        comparison.length === 0 ||
        Math.abs(comparisonIncome - reportIncome) > 0.01 ||
        Math.abs(comparisonExpenses - reportExpenses) > 0.01;

      if (comparisonNeedsRefresh && (reportIncome > 0 || reportExpenses > 0)) {
        comparison = await getIncomeExpenseBuckets(
          dateFilter,
          data.expense_overview || [],
        );
      }

      setIncomeVsExpenses(comparison);
      setTopCategories(data.top_categories || []);
      setTotalExpenses(reportExpenses);
      setTotalIncome(
        data.total_income ??
          comparison.reduce(
            (total: number, item: { income?: number }) =>
              total + Number(item.income || 0),
            0,
          ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [dateFilter]);

  const hasActivity = totalExpenses > 0 || totalIncome > 0;

  return (
    <div className="bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="cursor-pointer rounded-md p-2 hover:bg-muted"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold sm:text-xl">Reports</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ModeToggle />
          <DateFilter value={dateFilter} onValueChange={setDateFilter} />
        </div>
      </div>

      {/* Main content */}
      {loading ? (
        <ReportsSkeleton />
      ) : hasActivity ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Income vs Expenses card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <BarChart2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Income vs Expenses</h2>
                <p className="text-xs text-muted-foreground">
                  Compare your money in and out by period
                </p>
              </div>
            </div>
            <IncomeExpensesChart data={incomeVsExpenses} hideTitle />
          </div>

          {/* Top Spending Categories card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <ListOrdered className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  Top Spending Categories
                </h2>
                <p className="text-xs text-muted-foreground">
                  Where your money went
                </p>
              </div>
            </div>
            <TopSpendingCategories categories={topCategories} hideTitle />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center h-80">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              No income or expenses recorded for this period
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try selecting a different date range above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

async function getIncomeExpenseBuckets(
  dateFilter: string,
  expenseOverview: { week: string; total: number }[],
) {
  type ReportTransaction = {
    type: "income" | "expense";
    amount: number;
    date: string;
  };

  const token = localStorage.getItem("token");
  const transactions: ReportTransaction[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}&limit=200&date=${encodeURIComponent(dateFilter)}`,
      {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) throw new Error("Failed to load comparison transactions");
    const data = await response.json();
    transactions.push(...(data.transactions ?? []));
    totalPages = Math.max(1, Number(data.pagination?.totalPages ?? 1));
    page += 1;
  } while (page <= totalPages);

  const buckets = new Map<
    string,
    { period: string; income: number; expenses: number }
  >();
  for (const item of expenseOverview) {
    buckets.set(item.week, {
      period: item.week,
      income: 0,
      expenses: Number(item.total || 0),
    });
  }

  for (const transaction of transactions) {
    const period = getReportPeriodLabel(dateFilter, transaction.date);
    const totals = buckets.get(period) ?? { period, income: 0, expenses: 0 };
    if (transaction.type === "income")
      totals.income += Number(transaction.amount || 0);
    if (transaction.type === "expense" && expenseOverview.length === 0) {
      totals.expenses += Number(transaction.amount || 0);
    }
    buckets.set(period, totals);
  }

  return [...buckets.values()];
}

function getReportPeriodLabel(dateFilter: string, dateValue: string) {
  const date = new Date(dateValue);
  const timeZone = "Africa/Lagos";
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(date);

  switch (dateFilter) {
    case "Today":
      return "Today";
    case "This Week":
      return format({ weekday: "short" });
    case "This Month":
    case "Last Month": {
      const day = Number(format({ day: "numeric" }));
      return `Week ${Math.ceil(day / 7)}`;
    }
    case "Last 3 Months":
    case "This Year":
      return format({ month: "short" });
    default:
      return "Other";
  }
}

function ReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Chart skeleton */}
      <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-end gap-3 h-[300px] pt-4">
          {[65, 45, 80, 30, 55].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <Skeleton
                className="w-full rounded-t-md"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-1.5 h-5 rounded-full" />
                <Skeleton className="h-4 flex-1 max-w-[120px]" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
