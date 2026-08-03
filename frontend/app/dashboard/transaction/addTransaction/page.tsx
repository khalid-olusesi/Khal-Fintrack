"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSidebar } from "@/context/sidebar-context";
import { Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AddTransaction() {
  const router = useRouter();
   const { toggleSidebar } = useSidebar();
  const [date, setDate] = React.useState<Date>();

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

  return (
    //   container
    <div className="bg-gray-100 w-full h-full p-6 overflow-auto">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <button className="mb-4 cursor-pointer" onClick={toggleSidebar}>
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="text-xl mb-4 font-bold">Add Transaction</h1>
        </div>

        <button
          type="submit"
          onClick={() => router.push("/dashboard/transaction")}
          className="flex items-center border outline-none border-gray-400 cursor-pointer p-2 rounded-lg gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      <h3 className="font-bold mb-3">Type</h3>

      <div className="flex gap-2 mb-5">
        <span className="pt-2 pb-2 pl-10 pr-12 rounded-lg text-white bg-green-700 cursor-pointer text-center">
          income
        </span>
        <span className="pt-2 pb-2 pl-10 pr-12 rounded-lg border-2 cursor-pointer text-center">
          Expense
        </span>
      </div>

      {/* forms */}
      <form className="space-y-4">
        <div className="space-y-0.5">
          <p>Description</p>
          <input
            type="text"
            placeholder="e.g Grocery Shopping"
            className="border-2 outline-none p-2 rounded-lg w-full"
          />
        </div>

        <div className="space-y-0.5">
          <p>Amount</p>
          <input
            type="text"
            placeholder="e.g 100.00"
            className="border-2 outline-none p-2 rounded-lg w-full"
          />
        </div>

        {/* category */}
        <div className="space-y-0.5">
          <p>Category</p>
          <div className="flex items-center justify-between mb-8">
            <Select>
              <SelectTrigger className="w-full p-5 outline-none border-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
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
        </div>

        {/* date */}
        <div className="-mt-[18px] space-y-0.5">
          <p>Date</p>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant={"outline"}
                  data-empty={!date}
                  className="w-full p-6 justify-between bg-transparent border-2 outline-none text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                  <ChevronDownIcon data-icon="inline-end" />
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-0.5">
          <p>Notes(optional)</p>
          <input
            type="text"
            placeholder="Add a note"
            className="border-2 outline-none p-2 rounded-lg w-full"
          />
        </div>

        {/* buttons */}
        <div className="flex items-center justify-end gap-4 mt-3">
          <button className="border-2 rounded-lg cursor-pointer p-1.5 pb-1.5 pl-7 pr-7">
            Cancel
          </button>
          <button className="text-white rounded-lg cursor-pointer p-1.5 pb-1.5 pl-7 pr-7 bg-green-700">
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
