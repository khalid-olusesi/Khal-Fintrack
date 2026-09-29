"use client";

import { ModeToggle } from "@/components/toggle";
import { useSidebar } from "@/context/sidebar-context";
import { Menu, BarChart2, ListOrdered } from "lucide-react";
import DateFilter from "@/components/date-filter";
import { useState, useEffect } from "react";
import ExpensesOverviewChart from "@/components/bar-chart";
import TopSpendingCategories from "@/components/top-spending";
import { Skeleton } from "@/components/ui/skeleton";

export default function Reports() {
  const [dateFilter, setDateFilter] = useState("This Month");
  const { toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(true);

  const [expenseOverview, setExpenseOverview] = useState<
    { week: string; total: number }[]
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
      setExpenseOverview(data.expense_overview || []);
      setTopCategories(data.top_categories || []);
      setTotalExpenses(data.total_expenses || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [dateFilter]);

  const hasExpenses = totalExpenses > 0;

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
      ) : hasExpenses ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

          {/* Expenses Overview card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <BarChart2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Expenses Overview</h2>
                <p className="text-xs text-muted-foreground">
                  Total spending by period
                </p>
              </div>
            </div>
            <ExpensesOverviewChart data={expenseOverview} hideTitle />
          </div>

          {/* Top Spending Categories card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <ListOrdered className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Top Spending Categories</h2>
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
            <p className="text-sm font-medium">No expenses recorded for this period</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try selecting a different date range above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
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
              <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` }} />
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
