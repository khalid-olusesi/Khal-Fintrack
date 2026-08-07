"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, X, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { Menu } from "lucide-react";
import { MainLogo } from "@/components/logo";
import { ModeToggle } from "@/components/toggle";
import { SelectSeparator } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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

export default function Transaction() {
  type Transaction = {
    id: number;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: string;
  };
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toggleSidebar } = useSidebar();

  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://khal-fintrack.onrender.com/transactions",
        );

        const data = await response.json();

        setTransactions(data.transactions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, []);

  const expenses = [
    { label: "Food & Dining", value: "food & dining" },
    { label: "Groceries", value: "groceries" },
    { label: "Transport", value: "transport" },
    { label: "Fuel", value: "fuel" },
    { label: "Rent", value: "rent" },
    { label: "Utilities", value: "utilities" },
    { label: "Electricity", value: "electricity" },
    { label: "Water", value: "water" },
    { label: "Internet", value: "internet" },
    { label: "Shopping", value: "shopping" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Subscription", value: "subscriptions" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Pharmacy", value: "pharmacy" },
    { label: "Education", value: "education" },
    { label: "Insurance", value: "insurance" },
    { label: "Travel", value: "travel" },
    { label: "Personal care", value: "personal-care" },
    { label: "Fitness", value: "fitness" },
    { label: "Family", value: "family" },
    { label: "Taxes", value: "taxes" },
    { label: "Donations", value: "donations" },
    { label: "Other Expenses", value: "other-expenses" },
  ];

  const incomes = [
    { label: "Salary", value: "salary" },
    { label: "Freelance", value: "freelance" },
    { label: "Business", value: "business" },
    { label: "Bonus", value: "bonus" },
    { label: "Investment", value: "investment" },
    { label: "Interest", value: "interest" },
    { label: "Dividend", value: "dividend" },
    { label: "Rental Income", value: "rental-income" },
    { label: "Gift", value: "gift" },
    { label: "Refund", value: "refund" },
    { label: "Other Income", value: "other-income" },
  ];

  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "This week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "Last Month", value: "last-month" },
    { label: "Last 3 Months", value: "last 3-months" },
    { label: "This Year", value: "this-year" },
    { label: "Custom Range", value: "custom-range" },
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
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
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
            <Select>
              <SelectTrigger className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border text-xs py-1.5 px-3 rounded-lg h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Income</SelectLabel>
                  {incomes.map((income) => (
                    <SelectItem key={income.value} value={income.value}>
                      {income.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Expense</SelectLabel>
                  {expenses.map((expense) => (
                    <SelectItem key={expense.value} value={expense.value}>
                      {expense.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
                <tr key={transaction.id || index} className="border border-gray-100 dark:border-border">
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

              <tr className="text-gray-900 dark:text-foreground">
                <td className="py-4 px-2 text-left text-muted-foreground">
                  May 11, 2025
                </td>
                <td className="py-4 px-2 text-center font-medium">Netflix</td>
                <td className="py-4 px-2 text-right text-red-500 font-bold">
                  -$15.99
                </td>
              </tr>
              <tr className="text-gray-900 dark:text-foreground">
                <td className="py-4 px-2 text-left text-muted-foreground">
                  May 10, 2025
                </td>
                <td className="py-4 px-2 text-center font-medium">Salary</td>
                <td className="py-4 px-2 text-right text-green-600 font-bold">
                  +$4,500.00
                </td>
              </tr>
              <tr className="text-gray-900 dark:text-foreground">
                <td className="py-4 px-2 text-left text-muted-foreground">
                  May 9, 2025
                </td>
                <td className="py-4 px-2 text-center font-medium">Transport</td>
                <td className="py-4 px-2 text-right text-red-500 font-bold">
                  -$12.50
                </td>
              </tr>
              <tr className="text-gray-900 dark:text-foreground">
                <td className="py-4 px-2 text-left text-muted-foreground">
                  May 8, 2025
                </td>
                <td className="py-4 px-2 text-center font-medium">
                  Restaurant
                </td>
                <td className="py-4 px-2 text-right text-red-500 font-bold">
                  -$38.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Pagination */}
        <div className="flex items-center justify-center mt-6 gap-2">
          <button className="p-2 border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-white dark:bg-card">
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-foreground" />
          </button>
          <button className="cursor-pointer font-semibold py-1 px-3 bg-green-600 text-white rounded-lg text-xs">
            1
          </button>
          <button className="cursor-pointer py-1 px-3 border border-gray-200 dark:border-border rounded-lg text-xs text-gray-650 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-white dark:bg-card">
            2
          </button>
          <button className="cursor-pointer py-1 px-3 border border-gray-200 dark:border-border rounded-lg text-xs text-gray-650 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-white dark:bg-card">
            3
          </button>
          <button className="p-2 border border-gray-200 dark:border-border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-white dark:bg-card">
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              <SelectSeparator />

              <SelectGroup>
                <SelectLabel>Income</SelectLabel>
                {incomes.map((income) => (
                  <SelectItem key={income.value} value={income.value}>
                    {income.label}
                  </SelectItem>
                ))}
              </SelectGroup>

              <SelectSeparator />

              <SelectGroup>
                <SelectLabel>Expense</SelectLabel>
                {expenses.map((expense) => (
                  <SelectItem key={expense.value} value={expense.value}>
                    {expense.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full max-w-48">
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

                  <td>{transaction.category}</td>

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
                    <div className="flex items-center justify-center gap-4">
                      <button className="cursor-pointer">
                        <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                      </button>

                      <button className="cursor-pointer">
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
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
          <button className="cursor-pointer pt-1.5 pb-1.5 pl-4 pr-4 text-white bg-green-600 rounded-lg ">
            1
          </button>
          <button className="cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border pt-1.5 pb-1.5 pl-4 pr-4 dark:text-foreground dark:bg-card">
            2
          </button>
          <button className="cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border pt-1.5 pb-1.5 pl-4 pr-4 dark:text-foreground dark:bg-card">
            3
          </button>

          <button className="cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border pt-1.5 pb-1.5 pl-4 pr-4 dark:text-foreground dark:bg-card">
            ...
          </button>

          <button className="cursor-pointer rounded-lg border-2 border-gray-200 dark:border-border pt-1.5 pb-1.5 pl-4 pr-4 dark:text-foreground dark:bg-card">
            8
          </button>
        </div>
      </div>
    </div>
  );
}
