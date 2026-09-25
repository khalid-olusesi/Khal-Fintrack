"use client";

import { toast } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
import { Plus, Search, X, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { Menu } from "lucide-react";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, Suspense } from "react";
import { Icons } from "@/components/category-icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryDropDown from "@/components/dropdown";

function TransactionContent() {
  type CachedPage = {
    transactions: Transaction[];
    totalPages: number;
  };
  const [totalPages, setTotalPages] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const prefetchCache = useRef<Record<string, CachedPage>>({});
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(searchParams.get("page")) || 1;
  });
  const [selectedDate, setSelectedDate] = useState("This Month");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

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

  const TransactionSkeleton = () => {
    return (
      <tr className="border-b border-gray-200 dark:border-border">
        <td className="p-4">
          <Skeleton className="h-4 w-24" />
        </td>

        <td>
          <Skeleton className="h-4 w-32" />
        </td>

        <td>
          <Skeleton className="h-4 w-24" />
        </td>

        <td>
          <Skeleton className="h-4 w-16" />
        </td>

        <td>
          <Skeleton className="h-4 w-20" />
        </td>

        <td>
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </td>
      </tr>
    );
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

  const buildCacheKey = (
    page: number,
    category: string,
    date: string,
    debouncedSearch: string,
  ) => `${page}__${category}__${date}__${debouncedSearch}`;

  useEffect(() => {
    const controller = new AbortController();

    const fetchPage = async (
      page: number,
      category: string,
      date: string,
      debouncedSearch: string,
      signal?: AbortSignal,
    ) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const categoryQuery = category !== "all" ? `&categoryId=${category}` : "";
      const dateQuery =
        date !== "This Month" ? `&date=${encodeURIComponent(date)}` : "";
      //i used encodeURIComponent() because If someone searches (Chicken Republic) i don't want the space to break your URL.It turns it into something like (Chicken%20Republic)
      const trimmedSearch = debouncedSearch.trim();
      const searchQuery =
        trimmedSearch !== ""
          ? `&search=${encodeURIComponent(trimmedSearch)}`
          : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}&limit=10${categoryQuery}${dateQuery}${searchQuery}`,
        {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
          signal,
        },
      );
      if (!response.ok) throw new Error("Failed to fetch page");
      return response.json();
    };

    // Silently prefetch a page and store it in cache (does nothing if already cached)
    const prefetchPage = (
      page: number,
      category: string,
      date: string,
      debouncedSearch: string,
    ) => {
      if (page < 1) return;
      const key = buildCacheKey(page, category, date, debouncedSearch);
      if (prefetchCache.current[key]) return; // already cached
      fetchPage(page, category, date, debouncedSearch)
        .then((d) => {
          prefetchCache.current[key] = {
            transactions: d.transactions || [],
            totalPages: d.pagination?.totalPages || 1,
          };
        })
        .catch(() => {});
    };

    const fetchTransactions = async () => {
      const cacheKey = buildCacheKey(
        currentPage,
        selectedCategory,
        selectedDate,
        debouncedSearch,
      );
      const cached = prefetchCache.current[cacheKey];

      // Stale-while-revalidate: show cached data instantly, never block on it
      if (cached) {
        setTransactions(cached.transactions);
        setTotalPages(cached.totalPages);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      try {
        // Always fetch fresh data — update silently if we already showed cache
        const data = await fetchPage(
          currentPage,
          selectedCategory,
          selectedDate,
          debouncedSearch,
          controller.signal,
        );
        const fetched: Transaction[] = data.transactions || [];
        const pages: number = data.pagination?.totalPages || 1;

        prefetchCache.current[cacheKey] = {
          transactions: fetched,
          totalPages: pages,
        };

        setTransactions(fetched);
        setTotalPages(pages);

        // e xpand prefetch window: next 2 pages + previous 1 page
        prefetchPage(
          currentPage + 1,
          selectedCategory,
          selectedDate,
          debouncedSearch,
        );
        prefetchPage(
          currentPage + 2,
          selectedCategory,
          selectedDate,
          debouncedSearch,
        );
        prefetchPage(
          currentPage - 1,
          selectedCategory,
          selectedDate,
          debouncedSearch,
        );
        
        setIsLoading(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (error instanceof Error && error.message === "No token") {
          // Do not turn off isLoading, wait for token or redirect
          return;
        }
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      controller.abort();
    };
  }, [currentPage, selectedCategory, selectedDate, debouncedSearch]);

  const deleteTransaction = async (id: string | number) => {
    // Optimistic: remove from UI immediately
    const previousTransactions = transactions;
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id),
    );
    toast.add({ title: "Transaction deleted successfully", type: "success" });

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
        // Rollback on failure
        setTransactions(previousTransactions);
        toast.add({
          title: data?.error || text || "failed to delete transaction",
          type: "error",
        });
        return;
      }
    } catch (err) {
      console.error(err);
      // Rollback on network error
      setTransactions(previousTransactions);
      toast.add({ title: "Unable to connect to server", type: "error" });
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page); //this retains the contnet or same page if the condition is not met
    router.push(`?page=${page}`, { scroll: false });
  };

  const dateOptions = [
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Last Month", value: "Last Month" },
    { label: "Last 3 Months", value: "Last 3 Months" },
    { label: "This Year", value: "This Year" },
  ];

  //for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

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
            <Select
              value={selectedDate}
              onValueChange={(value) => {
                setSelectedDate(value ?? "This Month");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border text-xs py-1.5 px-3 rounded-lg h-9">
                <SelectValue />
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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
              {isLoading && transactions.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border border-gray-100 dark:border-border animate-pulse"
                    >
                      <td className="py-4 px-2">
                        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-16" />
                      </td>
                      <td className="py-4 px-2 flex justify-center">
                        <div
                          className="h-3 bg-gray-200 dark:bg-zinc-700 rounded"
                          style={{ width: `${60 + (i % 4) * 15}px` }}
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-14 ml-auto" />
                      </td>
                    </tr>
                  ))
                : transactions.map((transaction, index) => (
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
                        {(transaction.amount ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}

              {!isLoading && transactions.length === 0 && (
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
          <Select
            value={selectedDate}
            onValueChange={(value) => {
              setSelectedDate(value ?? "This Month");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full max-w-48 bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Date</SelectLabel>
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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-gray-200 dark:border-border py-1 pl-10 pr-10 outline-none bg-white dark:bg-card text-foreground"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
              </button>
            )}
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
              {isLoading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <TransactionSkeleton key={index} />
                ))}

              {!isLoading &&
                transactions.map((transaction, index) => (
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
                              sessionStorage.setItem(
                                `editTransaction_${transaction.id}`,
                                JSON.stringify(transaction),
                              );
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

              {!isLoading && transactions.length === 0 && (
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

          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
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

export default function Transaction() {
  return (
    <Suspense>
      <TransactionContent />
    </Suspense>
  );
}
