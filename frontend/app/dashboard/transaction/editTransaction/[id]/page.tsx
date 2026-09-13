"use client";
import {
  ArrowLeft,
  Menu,
  ChevronDownIcon,
  Calendar as CalendarIcon,
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

export default function EditTransaction() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { toggleSidebar } = useSidebar();

  const [form, setForm] = useState({
    type: "",
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

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
          alert(data?.error || text || "Failed to retrieve transaction data");
          return;
        }

        console.log("transaction retrieved :", data);

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
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]); //Gets the user old saved message that wants to be edited
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        alert(data?.error || text || "Something went wrong");
        return;
      }

      alert("Transaction updated successfully");
      router.push("/dashboard/transaction");
    } catch (err) {
      console.error(err);
      alert("Unable to connect to server");
    }
  }; //updates the page after the users data that want to be edited has been retrieved(GET)

  return (
    // container
    <div
      className="bg-white dark:bg-background md:bg-gray-100 md:dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Mobile view */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6">
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

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[18px] font-bold text-gray-900 dark:text-foreground">
            Edit Transaction
          </h1>
          <div className="text-gray-500 text-[13px] flex items-center gap-1">
            <ChevronDownIcon className="w-3.5 h-3.5" />
            Save
          </div>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-gray-50 dark:bg-card border border-gray-100 dark:border-border p-1 rounded-xl mb-6">
          <button
            onClick={() =>
              setForm({
                ...form,
                type: "income",
              })
            }
            className={`flex-1 py-2.5 rounded-lg font-medium text-[13px] text-center ${
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
            className={`flex-1 py-2.5 rounded-lg font-medium text-[13px] text-center ${
              form.type === "expense"
                ? "bg-red-600 text-white border-gray-100"
                : "bg-transparent text-gray-800 dark:text-muted-foreground"
            }`}
          >
            Expense
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800 dark:text-muted-foreground">
              Description
            </label>
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
              className="w-full border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-xl p-3.5 text-[13px] outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800 dark:text-muted-foreground">
              Amount
            </label>
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
              className="w-full border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-xl p-3.5 text-[13px] outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800 dark:text-muted-foreground">
              Category
            </label>
            <CategoryDropDown
              value={form.category}
              onValueChange={(value) => {
                setForm({
                  ...form,
                  category: value ?? "",
                });
              }}
              type={form.type as "income" | "expense"}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800 dark:text-muted-foreground">
              Date
            </label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-xl p-3.5 h-auto text-left font-normal text-[13px] text-gray-900 dark:text-foreground flex justify-between items-center hover:bg-white dark:hover:bg-card"
                  >
                    {format(form.date, "MMM dd, yyyy")}
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
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

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 pb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-[0.8] py-3.5 border border-gray-200 dark:border-border bg-white dark:bg-card text-foreground rounded-xl font-semibold text-[13px] text-gray-800 dark:text-muted-foreground text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.2] py-3.5 bg-green-700 rounded-xl font-semibold text-[13px] text-white text-center cursor-pointer"
            >
              Save Transaction
            </button>
          </div>
        </form>
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
              className="border-2 border-gray-200 dark:border-border bg-white dark:bg-card text-foreground outline-none p-2 rounded-lg w-full"
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
              Amount
            </p>
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
              className="border-2 border-gray-200 dark:border-border bg-white dark:bg-card text-foreground outline-none p-2 rounded-lg w-full"
            />
          </div>

          {/* category */}
          <div className="space-y-0.5">
            <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
              Category
            </p>
            <div className="flex items-center justify-between mb-8">
              <CategoryDropDown
                value={form.category}
                onValueChange={(value) => {
                  setForm({
                    ...form,
                    category: value ?? "",
                  });
                }}
                type={form.type as "income" | "expense"}
              />
            </div>
          </div>

          {/* date */}
          <div className="-mt-1.5 space-y-0.5">
            <p className="text-gray-700 dark:text-muted-foreground font-medium text-[13px]">
              Date
            </p>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant={"outline"}
                    data-empty={!form.date}
                    className="w-full p-6 justify-between dark:bg-card border-2 bg-white border-gray-200 dark:border-border outline-none text-left font-normal text-foreground data-[empty=true]:text-muted-foreground"
                  >
                    {format(form.date, "MMM dd, yyyy")}
                    <ChevronDownIcon data-icon="inline-end" />
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

          {/* buttons */}
          <div className="flex items-center justify-end gap-4 mt-7">
            <button
              type="button"
              className="border-2 border-gray-250 dark:border-border text-foreground rounded-lg cursor-pointer p-1.5 pb-1.5 pl-7 pr-7 dark:bg-card"
            >
              Cancel
            </button>
            <button className="text-white rounded-lg cursor-pointer p-1.5 pb-1.5 pl-7 pr-7 bg-green-700">
              Update Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
