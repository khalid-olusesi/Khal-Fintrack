"use client";

import { toast } from "@/components/ui/toast";
import {
  ArrowLeft,
  Menu,
  Calendar as CalendarIcon,
  DollarSign,
  Tag,
  FileText,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSidebar } from "@/context/sidebar-context";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { useState } from "react";
import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategoryDropDown from "@/components/dropdown";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTransaction() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { toggleSidebar } = useSidebar();

  // Try to read cached transaction data so the form renders instantly
  const cachedTransaction = (() => {
    if (typeof window === "undefined" || !id) return null;
    try {
      const raw = sessionStorage.getItem(`editTransaction_${id}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  const [form, setForm] = useState({
    type: cachedTransaction?.type || "",
    description: cachedTransaction?.description || "",
    amount: cachedTransaction ? String(cachedTransaction.amount ?? "") : "",
    category: cachedTransaction
      ? String(
          cachedTransaction.categoryId ?? cachedTransaction.category?.id ?? "",
        )
      : "",
    date: cachedTransaction?.date
      ? new Date(cachedTransaction.date)
      : new Date(),
  });

  const [isLoading, setIsLoading] = useState(!cachedTransaction);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
          {
            method: "GET",
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
          toast.add({
            title: data?.error || text || "Failed to retrieve transaction data",
            type: "error",
          });
          return;
        }

        const transaction = data.transaction;

        setForm({
          type: transaction.type || "",
          description: transaction.description || "",
          amount: String(transaction.amount ?? ""),
          category: String(transaction.categoryId) || "",
          date: transaction.date ? new Date(transaction.date) : new Date(),
        }); //puts the old transaction into the form
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        // Clean up sessionStorage
        if (id) sessionStorage.removeItem(`editTransaction_${id}`);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]); //Gets the user old saved message that wants to be edited
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: form.type,
            categoryId: Number(form.category),
            amount: Number(form.amount),
            description: form.description,
            date: form.date,
          }),
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
        toast.add({
          title: data?.error || text || "Something went wrong",
          type: "error",
        });
        return;
      }

      toast.add({ title: "Transaction updated successfully", type: "success" });
      router.push("/dashboard/transaction");
    } catch (err) {
      console.error(err);
      toast.add({ title: "Unable to connect to server", type: "error" });
    } finally {
      setIsSaving(false);
    }
  }; //updates the page after the users data that want to be edited has been retrieved(GET)

  return (
    // container
    <div
      className="bg-white dark:bg-background md:bg-gray-100 md:dark:bg-background w-full h-full p-3 md:p-6 overflow-y-auto scroll-smooth"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Mobile view */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
          </button>
          <div className="flex justify-center items-center">
            <MainLogo />
          </div>
          <ModeToggle />
        </div>

        <div className="mb-4">
          <h1 className="text-base font-bold text-gray-900 dark:text-foreground">
            Edit Transaction
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-4 mt-3">
            <Skeleton className="h-9 w-full rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            {/* Type Toggle */}
            <div className="flex bg-gray-50 dark:bg-card border border-gray-100 dark:border-border p-1 rounded-xl mb-4">
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    type: "income",
                  })
                }
                className={`flex-1 py-2 rounded-lg font-medium text-sm text-center ${
                  form.type === "income"
                    ? "bg-green-600 text-white border-gray-100"
                    : "bg-transparent text-gray-800"
                }`}
              >
                Income
              </button>

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    type: "expense",
                  })
                }
                className={`flex-1 py-2 rounded-lg font-medium text-sm text-center ${
                  form.type === "expense"
                    ? "bg-red-600 text-white border-gray-100"
                    : "bg-transparent text-gray-800 dark:text-muted-foreground"
                }`}
              >
                Expense
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-800 dark:text-muted-foreground">
                  Description
                </label>
                <div className="flex w-full">
                  <div className="flex w-10 shrink-0 items-center justify-center bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-xl text-muted-foreground">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    value={form.description}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        description: e.target.value,
                      });
                    }}
                    type="text"
                    placeholder="Enter description"
                    className="min-w-0 w-full border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-r-xl p-2.5 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-800 dark:text-muted-foreground">
                  Amount
                </label>
                <div className="flex w-full">
                  <div className="flex w-10 shrink-0 items-center justify-center bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-xl text-muted-foreground font-semibold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    value={form.amount}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        amount: e.target.value,
                      });
                    }}
                    type="number"
                    placeholder="Enter amount"
                    className="min-w-0 w-full border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-r-xl p-2.5 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-800 dark:text-muted-foreground">
                  Category
                </label>
                <div className="flex w-full">
                  <div className="flex w-10 shrink-0 items-center justify-center bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-xl text-muted-foreground">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <CategoryDropDown
                      value={form.category}
                      onValueChange={(value) => {
                        setForm({
                          ...form,
                          category: value ?? "",
                        });
                      }}
                      type={form.type as "income" | "expense"}
                      className="rounded-l-none rounded-r-xl w-full h-full !p-2.5 !h-auto bg-white dark:bg-card border-l-0 text-sm shadow-none outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-gray-800 dark:text-muted-foreground">
                  Date
                </label>
                <div className="flex w-full">
                  <div className="flex w-10 shrink-0 items-center justify-center bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-xl text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="flex-1 w-full border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-l-none rounded-r-xl p-2.5 h-auto text-left font-normal text-sm text-gray-900 dark:text-foreground flex justify-between items-center hover:bg-white dark:hover:bg-card"
                        >
                          {format(form.date, "MMM dd, yyyy")}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.date}
                        onSelect={(selectedDate) => {
                          if (!selectedDate) {
                            return;
                          }
                          setForm({
                            ...form,
                            date: selectedDate,
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2 pb-5">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-[0.8] py-2.5 border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-lg font-semibold text-sm text-gray-800 dark:text-muted-foreground text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[1.2] py-2.5 bg-green-700 rounded-lg font-semibold text-sm text-white text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Transaction"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4 items-center">
            <button className="cursor-pointer" onClick={toggleSidebar}>
              <Menu className="w-4 h-4 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">
              Edit Transaction
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <button
              type="button"
              onClick={() => router.push("/dashboard/transaction")}
              className="flex items-center border outline-none border-gray-400 dark:border-border text-foreground cursor-pointer p-2 rounded-lg gap-2 dark:bg-card"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
        <h3 className="font-bold mb-3 text-foreground">Type</h3>

        {isLoading ? (
          <div className="space-y-6 mt-4">
            <div className="flex gap-2 mb-7">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-7">
              <span
                onClick={() =>
                  setForm({
                    ...form,
                    type: "income",
                  })
                }
                className={`pt-2 pb-2 pl-10 pr-12 rounded-lg border-2 cursor-pointer text-center ${
                  form.type === "income"
                    ? "bg-green-600 text-white"
                    : "bg-transparent text-gray-800"
                }`}
              >
                Income
              </span>
              <span
                onClick={() =>
                  setForm({
                    ...form,
                    type: "expense",
                  })
                }
                className={`pt-2 pb-2 pl-10 pr-12 rounded-lg border-2 cursor-pointer text-center ${
                  form.type === "expense"
                    ? "bg-red-600 text-white"
                    : "bg-transparent text-gray-800 dark:text-muted-foreground"
                }`}
              >
                Expense
              </span>
            </div>

            {/* forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-0.5">
                <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
                  Description
                </p>
                <div className="flex w-full">
                  <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-2 border-r-0 border-gray-200 dark:border-border rounded-l-lg text-muted-foreground">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="e.g Grocery Shopping"
                    className="border-2 border-l border-gray-200 dark:border-border bg-white dark:bg-card text-foreground outline-none p-2 rounded-r-lg w-full"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
                  Amount
                </p>
                <div className="flex w-full">
                  <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-2 border-r-0 border-gray-200 dark:border-border rounded-l-lg text-muted-foreground font-semibold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                    type="number"
                    placeholder="e.g 100.00"
                    className="border-2 border-l border-gray-200 dark:border-border bg-white dark:bg-card text-foreground outline-none p-2 rounded-r-lg w-full"
                  />
                </div>
              </div>

              {/* category */}
              <div className="space-y-0.5">
                <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
                  Category
                </p>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex w-full">
                    <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-2 border-r-0 border-gray-200 dark:border-border rounded-l-lg text-muted-foreground">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <CategoryDropDown
                        value={form.category}
                        onValueChange={(value) => {
                          setForm({
                            ...form,
                            category: value ?? "",
                          });
                        }}
                        type={form.type as "income" | "expense"}
                        className="rounded-l-none rounded-r-lg w-full h-full !p-2 !h-auto bg-white dark:bg-card border-l-0 text-[13px] shadow-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* date */}
              <div className="-mt-1.5 space-y-0.5">
                <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
                  Date
                </p>
                <div className="flex w-full">
                  <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-2 border-r-0 border-gray-200 dark:border-border rounded-l-lg text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant={"outline"}
                          data-empty={!form.date}
                          className="flex-1 w-full !p-2 !h-auto justify-between dark:bg-card border-2 bg-white border-l border-gray-200 dark:border-border outline-none text-left font-normal text-foreground data-[empty=true]:text-muted-foreground rounded-l-none rounded-r-lg"
                        >
                          {format(form.date, "MMM dd, yyyy")}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.date}
                        onSelect={(selectedDate) => {
                          if (!selectedDate) {
                            return;
                          }
                          setForm({
                            ...form,
                            date: selectedDate,
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* buttons */}
              <div className="flex items-center justify-end gap-4 mt-7">
                <button
                  type="button"
                  className="border-2 border-gray-250 dark:border-border text-foreground rounded-lg cursor-pointer p-1.5 pb-1.5 pl-7 pr-7 dark:bg-card"
                >
                  Cancel
                </button>
                <button
                  disabled={isSaving}
                  className="text-white rounded-lg cursor-pointer p-1.5 pb-1.5 pl-7 pr-7 bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Update Transaction"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
