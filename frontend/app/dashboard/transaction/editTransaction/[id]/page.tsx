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
import { useCurrency } from "@/context/currency-context";

export default function EditTransaction() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { toggleSidebar } = useSidebar();
  const { currency } = useCurrency();

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
      {/* Responsive view */}
      <div className="flex flex-col min-h-full">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 items-center">
            <button
              className="cursor-pointer rounded-md p-2 hover:bg-muted"
              onClick={toggleSidebar}
            >
              <Menu className="w-4 h-4 text-foreground" />
            </button>
            <h1 className="text-base font-bold sm:text-xl text-foreground">
              Edit Transaction
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <button
              type="button"
              onClick={() => router.push("/dashboard/transaction")}
              className="flex items-center border outline-none border-border text-foreground cursor-pointer p-2 rounded-lg gap-2 bg-white dark:bg-card shadow-sm hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-start justify-center pt-4 lg:pt-10">
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border w-full max-w-3xl">
            {isLoading ? (
              <div className="p-6">
                <div className="mb-4">
                  <Skeleton className="h-5 w-32 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                  </div>
                </div>
                <div className="border-t border-border mx-[-24px] px-6 my-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-border mx-[-24px] px-6">
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                {/* Card header with type toggle */}
                <div className="p-6 pb-0">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Transaction Type
                  </h3>
                  <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "income" })}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-center cursor-pointer transition-all ${
                        form.type === "income"
                          ? "bg-green-600 text-white shadow-sm"
                          : "text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: "expense" })}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-center cursor-pointer transition-all ${
                        form.type === "expense"
                          ? "bg-red-600 text-white shadow-sm"
                          : "text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                <div className="border-t border-border mx-6 mt-6" />

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="p-6 pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">
                        Description
                      </label>
                      <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                        <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                          <FileText className="w-4 h-4" />
                        </div>
                        <input
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          type="text"
                          placeholder="e.g Grocery Shopping"
                          className="bg-transparent text-foreground outline-none p-3 w-full text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">
                        Amount ({currency})
                      </label>
                      <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                        <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <input
                          value={form.amount}
                          onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                          }
                          type="number"
                          placeholder="e.g 100.00"
                          className="bg-transparent text-foreground outline-none p-3 w-full text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">
                        Category
                      </label>
                      <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                        <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <CategoryDropDown
                            value={form.category}
                            onValueChange={(value) =>
                              setForm({ ...form, category: value ?? "" })
                            }
                            type={form.type as "income" | "expense"}
                            className="w-full h-full p-3 bg-transparent border-none text-sm shadow-none outline-none rounded-none rounded-r-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">
                        Date
                      </label>
                      <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                        <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <Popover>
                          <PopoverTrigger
                            className="bg-transparent"
                            render={
                              <Button
                                variant={"ghost"}
                                data-empty={!form.date}
                                className="flex-1 w-full p-3 h-auto justify-between bg-transparent hover:bg-transparent border-none outline-none text-left font-normal text-foreground data-[empty=true]:text-muted-foreground rounded-none rounded-r-xl "
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
                                if (!selectedDate) return;
                                setForm({ ...form, date: selectedDate });
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-border">
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/transaction")}
                      className="border border-border bg-white text-gray-700 rounded-xl cursor-pointer px-6 py-2.5 text-sm font-medium hover:bg-gray-50 dark:bg-zinc-800/30 dark:text-foreground dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSaving}
                      className="text-white font-medium rounded-xl cursor-pointer px-8 py-2.5 bg-green-600 hover:bg-green-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {isSaving ? "Saving..." : "Update Transaction"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
