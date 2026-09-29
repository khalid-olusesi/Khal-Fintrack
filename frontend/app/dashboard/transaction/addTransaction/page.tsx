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
import { useRouter } from "next/navigation";
import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSidebar } from "@/context/sidebar-context";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategoryDropDown from "@/components/dropdown";

export default function AddTransaction() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [form, setForm] = useState({
    type: "",
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setForm({
      type: "",
      category: "",
      amount: "",
      description: "",
      date: new Date(),
    });
  }; //sets the form content back to empty content just like the emoty strings

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.description.trim()) {
      toast.add({ title: "Description is required", type: "warning" });
      return;
    }

    if (!form.category) {
      toast.add({ title: "Choose a category", type: "warning" });
      return;
    }

    if (!form.type) {
      toast.add({ title: "Choose Income or Expense", type: "warning" });
      return;
    }

    if (Number(form.amount) <= 0) {
      toast.add({ title: "Amount must be greater than zero", type: "warning" });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        {
          method: "POST",
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

      console.log("FORM CATEGORY:", form.category);
      console.log("CATEGORY ID:", Number(form.category));

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

      toast.add({ title: "Transaction created successfully", type: "success" });
      router.push("/dashboard/transaction");
    } catch (err) {
      console.error(err);
      toast.add({ title: "Unable to connect to the server.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

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
            <button className="cursor-pointer rounded-md p-2 hover:bg-muted" onClick={toggleSidebar}>
              <Menu className="w-4 h-4 text-foreground" />
            </button>
            <h1 className="text-base font-bold sm:text-xl text-foreground">
              Add Transaction
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

        {/* Centered form card */}
        <div className="flex-1 flex items-start justify-center pt-4 lg:pt-10">
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border w-full max-w-3xl">
            {/* Card header with type toggle */}
            <div className="p-6 pb-0">
              <h3 className="text-sm font-semibold text-foreground mb-4">Transaction Type</h3>
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
                  <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">Description</label>
                  <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                    <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                      <FileText className="w-4 h-4" />
                    </div>
                    <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} type="text" placeholder="e.g Grocery Shopping" className="bg-transparent text-foreground outline-none p-3 w-full text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">Amount (₦)</label>
                  <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                    <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} type="number" placeholder="e.g 100.00" className="bg-transparent text-foreground outline-none p-3 w-full text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">Category</label>
                  <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                    <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <CategoryDropDown value={form.category} onValueChange={(value) => setForm({ ...form, category: value ?? "" })} type={form.type as "income" | "expense"} className="w-full h-full p-3 bg-transparent border-none text-sm shadow-none outline-none rounded-none rounded-r-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-muted-foreground">Date</label>
                  <div className="flex w-full rounded-xl overflow-hidden border border-border bg-white dark:bg-zinc-900/30 transition-all">
                    <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border-r border-border text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <Popover>
                      <PopoverTrigger className="bg-transparent" render={<Button variant={"ghost"} data-empty={!form.date} className="flex-1 w-full p-3 h-auto justify-between bg-transparent hover:bg-transparent border-none outline-none text-left font-normal text-foreground data-[empty=true]:text-muted-foreground rounded-none rounded-r-xl ">{format(form.date, "MMM dd, yyyy")}</Button>} />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={form.date} onSelect={(selectedDate) => { if (!selectedDate) return; setForm({ ...form, date: selectedDate }); }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-border">
                <button type="button" className="border border-border bg-white text-gray-700 rounded-xl cursor-pointer px-6 py-2.5 text-sm font-medium hover:bg-gray-50 dark:bg-zinc-800/30 dark:text-foreground dark:hover:bg-zinc-800/60 transition-colors" onClick={handleCancel}>Cancel</button>
                <button disabled={isSaving} className="text-white font-medium rounded-xl cursor-pointer px-8 py-2.5 bg-green-600 hover:bg-green-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm">{isSaving ? "Saving..." : "Save Transaction"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
