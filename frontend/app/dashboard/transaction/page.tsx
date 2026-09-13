"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, X, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { Menu } from "lucide-react";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/category-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import CategoryDropDown from "@/components/dropdown";

export default function Transaction() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const prefetchCache = useRef<Record<string, Transaction[]>>({});

  type Transaction = {
    id: number;
    description: string;
    categoryId: number;
    category: {
      id: number;
      name: string;
      icon: string;
      type: string;
      color: string;
    };
    amount: number;
    date: string;
    type: string;
  };

  function CategoryDisplay({
    category,
  }: {
    category?: {
      name: string;
      icon: string;
    };
  }) {
    if (!category) {
      return <span>—</span>;
    }

    const categoryIcon = Icons.find((item) => item.name === category.icon);

    const Icon = categoryIcon?.icon;

    return (
      <div className="flex items-center gap-6">
        {Icon && (
          <Icon className={`w-4 h-4 ${categoryIcon?.textColor ?? ""}`} />
        )}

        <span>{category.name}</span>
      </div>
    );
  }

  const buildCacheKey = (page: number, category: string) => `${page}__${category}`;

  useEffect(() => {
    const controller = new AbortController();

    const fetchPage = async (page: number, category: string, signal?: AbortSignal) => {
      const token = localStorage.getItem("token");
      const categoryQuery = category !== "all" ? `&categoryId=${category}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}&limit=10${categoryQuery}`,
        {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
          signal,
        },
      );
      return response.json();
    };

    const fetchTransactions = async () => {
      const cacheKey = buildCacheKey(currentPage, selectedCategory);

      // Serve from cache instantly if available
      if (prefetchCache.current[cacheKey]) {
        setTransactions(prefetchCache.current[cacheKey]);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      try {
        const data = await fetchPage(currentPage, selectedCategory, controller.signal);
        const fetched: Transaction[] = data.transactions || [];
        const pages: number = data.pagination?.totalPages || 1;

        prefetchCache.current[cacheKey] = fetched;
        setTransactions(fetched);
        setTotalPages(pages);

        // Prefetch next page in background if it exists
        if (currentPage < pages) {
          const nextKey = buildCacheKey(currentPage + 1, selectedCategory);
          if (!prefetchCache.current[nextKey]) {
            fetchPage(currentPage + 1, selectedCategory)
              .then((d) => {
                prefetchCache.current[nextKey] = d.transactions || [];
              })
              .catch(() => {}); // silently ignore prefetch errors
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      controller.abort();
    };
  }, [currentPage, selectedCategory]);

  const deleteTransaction = async (id: string | number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!response.ok) {
        alert(data?.error || text || "failed to delete transaction");
        return;
      }

      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id),
      ); //removes the deleted transaction from the UI
      alert("Transaction deleted successfully");
    } catch (err) {
      console.error(err);
      alert("unable to connect to server");
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page); //this retains the contnet or same page if the condition is not met
  };

  const dateOptions = [
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Last Month", value: "Last Month" },
    { label: "Last 3 Months", value: "Last 3 Months" },
    { label: "This Year", value: "This Year" },
    { label: "Custom Range", value: "Custom Range" },
  ];

  return (
    // container
    <div
      className="bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
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

        {/* Transactions Title & Bell */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <button className="p-1 cursor-pointer">
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Add Transaction Button */}
        <div className="flex justify-start">
          <button
            onClick={() => router.push("/dashboard/transaction/addTransaction")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer border-none active:scale-95 transition-all"
          >
            <span>Add Transaction</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex gap-4">
          <div className="flex-1">
            <CategoryDropDown
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value ?? "all");
                setCurrentPage(1);
              }}
              type="all"
            />
          </div>

          <div className="flex-1">
            <Select>
              <SelectTrigger className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border text-xs py-1.5 px-3 rounded-lg h-9">
                <SelectValue placeholder="This Month" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transaction..."
            className="w-full rounded-lg border border-gray-200 dark:border-border py-2 pl-9 pr-4 text-xs outline-none bg-white dark:bg-card text-foreground"
          />
        </div>

        {/* Mobile Table List */}
        <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-border shadow-sm p-2 text-foreground">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-border text-muted-foreground">
                <th className="py-3 px-2 text-left font-semibold">Date</th>
                <th className="py-3 px-2 text-center font-semibold">
                  Description
                </th>
                <th className="py-3 px-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-border">
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id || index}
                  className="border border-gray-100 dark:border-border"
                >
                  <td className="py-4 px-2 text-left text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2 text-center font-medium">
                    {transaction.description}
                  </td>
                  <td className="py-4 px-2 text-right text-red-500 font-bold">
                    ₦{(transaction.amount ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Pagination */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-white dark:bg-card disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-foreground" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show at most 3 page buttons centred around currentPage
              if (totalPages <= 3) return true;
              if (currentPage === 1) return page <= 3;
              if (currentPage === totalPages) return page >= totalPages - 2;
              return Math.abs(page - currentPage) <= 1;
            })
            .map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={
                  currentPage === page
                    ? "cursor-pointer font-semibold py-1 px-3 bg-green-600 text-white rounded-lg text-xs"
                    : "cursor-pointer py-1 px-3 border border-gray-200 dark:border-border rounded-lg text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 bg-white dark:bg-card"
                }
              >
                {page}
              </button>
            ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-white dark:bg-card disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-foreground" />
          </button>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 items-center">
            <button className="cursor-pointer" onClick={toggleSidebar}>
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold">Transaction</h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              type="submit"
              onClick={() => {
                router.push("/dashboard/transaction/addTransaction");
              }}
              className="cursor-pointer flex items-center"
            >
              <span>Add Transaction</span>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* dropdowns */}
        <div className="flex items-center justify-between mt-5 mb-10">
          <CategoryDropDown
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value ?? "all");
              setCurrentPage(1);
            }}
            type="all"
          />
          <Select>
            <SelectTrigger className="w-full max-w-48 bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                {dateOptions.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-gray-200 dark:border-border py-1 pl-10 pr-10 outline-none bg-white dark:bg-card text-foreground"
            />

            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* tables */}
        <div>
          <table className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg text-foreground">
            <thead className="bg-gray-200 dark:bg-zinc-800/80">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="text-left">Description</th>
                <th className="text-left">Category</th>
                <th className="text-left">Type</th>
                <th className="text-left">Amount</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id ?? index}
                  className="border-b border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="p-4">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>

                  <td>{transaction.description}</td>

                  <td>
                    <CategoryDisplay category={transaction.category} />
                  </td>

                  <td>
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-green-600 font-medium"
                          : "text-red-500 font-medium"
                      }
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td
                    className={
                      transaction.type === "income"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    ₦{(transaction.amount ?? 0).toLocaleString()}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-4  justify-evenly">
                      <button className="cursor-pointer">
                        <Pencil
                          onClick={() => {
                            router.push(
                              `/dashboard/transaction/editTransaction/${transaction.id}`,
                            );
                          }}
                          className="w-4 h-4 text-blue-600 hover:text-blue-800"
                        />
                      </button>

                      <button className="cursor-pointer">
                        <Trash2
                          onClick={() => {
                            deleteTransaction(transaction.id);
                          }}
                          className="w-4 h-4 text-red-500 hover:text-red-700"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* toggling buttons */}
        <div className="flex items-center justify-center mt-6 gap-1">
          <button
            className="cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border p-2 dark:bg-card"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={
                  currentPage === page
                    ? "cursor-pointer rounded-lg bg-green-600 text-white px-4 py-1.5"
                    : "cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border px-4 py-1.5 dark:bg-card"
                }
              >
                {page}
              </button>
            );
          })}

          <button
            className="cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border p-2 dark:bg-card"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
