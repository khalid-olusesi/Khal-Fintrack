"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, X } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";
import { Menu } from "lucide-react";
import { SelectSeparator } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
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
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

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
    <div className="bg-gray-100 w-full h-full p-6 overflow-auto">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <button className="mb-4" onClick={toggleSidebar}>
            <Menu className="w-4 h-4 cursor-pointer" />
          </button>
          <h1 className="text-xl mb-4 font-bold">Transaction</h1>
        </div>

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
            className="w-full rounded-lg border py-1 pl-10 pr-10 outline-none"
          />

          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* tables */}
      <div>
        <table className="w-full shadow-lg">
          <thead className="border bg-gray-200">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="text-left">Description</th>
              <th className="text-left">Category</th>
              <th className="text-left">Type</th>
              <th className="text-left">Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border">
              <td className="p-4">May 12, 2024</td>
              <td>Grocery Store</td>
              <td>Food & Drink</td>
              <td>Expense</td>
              <td className="text-red-500">-$45.00</td>
              <td className="flex gap-4 items-center justify-center pt-4">
                <Pencil className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr className="border">
              <td className="p-4">July 2, 2023</td>
              <td>Grocery Store</td>
              <td>Food & Drink</td>
              <td>Expense</td>
              <td className="text-red-500">-$45.00</td>
              <td className="flex gap-4 items-center justify-center pt-4">
                <Pencil className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr className="border">
              <td className="p-4">May 12, 2024</td>
              <td>Grocery Store</td>
              <td>Food & Drink</td>
              <td>Expense</td>
              <td className="text-red-500">-$45.00</td>
              <td className="flex gap-4 items-center justify-center pt-4">
                <Pencil className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr className="border">
              <td className="p-4">May 12, 2024</td>
              <td>Grocery Store</td>
              <td>Food & Drink</td>
              <td>Expense</td>
              <td className="text-green-600">$45.00</td>
              <td className="flex gap-4 items-center justify-center pt-4">
                <Pencil className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
              </td>
            </tr>
          </tbody>

          <tbody>
            <tr className="border">
              <td className="p-4">May 12, 2024</td>
              <td>Grocery Store</td>
              <td>Food & Drink</td>
              <td>Expense</td>
              <td className="text-green-600">$45.00</td>
              <td className="flex gap-4 items-center justify-center pt-4">
                <Pencil className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* toggling buttons */}
      <div className="flex items-center justify-center mt-6 gap-1">
        <button className="cursor-pointer pt-1.5 pb-1.5 pl-4 pr-4 text-white bg-green-600 rounded-lg ">
          1
        </button>
        <button className="cursor-pointer rounded-lg border-2 pt-1.5 pb-1.5 pl-4 pr-4">
          2
        </button>
        <button className="cursor-pointer rounded-lg border-2 pt-1.5 pb-1.5 pl-4 pr-4">
          3
        </button>

        <button className="cursor-pointer rounded-lg border-2 pt-1.5 pb-1.5 pl-4 pr-4">
          ...
        </button>

        <button className="cursor-pointer rounded-lg border-2 pt-1.5 pb-1.5 pl-4 pr-4">
          8
        </button>
      </div>
    </div>
  );
}
