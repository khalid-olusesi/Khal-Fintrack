"use client";

import { ArrowLeft, Menu, ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSidebar } from "@/context/sidebar-context";
import { MainLogo } from "@/components/logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EditTransaction() {
  const router = useRouter();
  const [date, setDate] = React.useState<Date>();
  const { toggleSidebar } = useSidebar();

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
    // container
    <div className="bg-white md:bg-gray-100 w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
      {/* --- MOBILE VIEW --- */}
      <div className="block md:hidden">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="flex justify-center items-center">
            <MainLogo />
          </div>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[18px] font-bold text-gray-900">Edit Transaction</h1>
          <div className="text-gray-500 text-[13px] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Save
          </div>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-xl mb-6">
          <button type="button" className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-medium text-[13px] text-center shadow-sm">
            Expense
          </button>
          <button type="button" className="flex-1 py-2.5 rounded-lg bg-transparent text-gray-800 font-medium text-[13px] text-center">
            Income
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800">Description</label>
            <input
              type="text"
              placeholder="Grocery Store"
              className="w-full border border-gray-200 bg-white rounded-xl p-3.5 text-[13px] outline-none placeholder:text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800">Amount</label>
            <input
              type="text"
              placeholder="$ 45.20"
              className="w-full border border-gray-200 bg-white rounded-xl p-3.5 text-[13px] outline-none placeholder:text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800">Category</label>
            <Select>
              <SelectTrigger className="w-full border border-gray-200 bg-white rounded-xl p-3.5 h-auto text-[13px] outline-none text-gray-900 [&>svg]:text-gray-500">
                <SelectValue placeholder="Food & Dining" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800">Date</label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full border border-gray-200 bg-white rounded-xl p-3.5 h-auto text-left font-normal text-[13px] text-gray-900 flex justify-between items-center hover:bg-white"
                  >
                    {date ? format(date, "MMM dd, yyyy") : <span>May 12, 2025</span>}
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-800">Note (optional)</label>
            <input
              type="text"
              placeholder="Weekly groceries"
              className="w-full border border-gray-200 bg-white rounded-xl p-3.5 text-[13px] outline-none placeholder:text-gray-900"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 pb-8">
            <button type="button" onClick={() => router.back()} className="flex-[0.8] py-3.5 border border-gray-200 bg-white rounded-xl font-semibold text-[13px] text-gray-800 text-center cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="flex-[1.2] py-3.5 bg-green-700 rounded-xl font-semibold text-[13px] text-white text-center cursor-pointer">
              Update Transaction
            </button>
          </div>
        </form>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <button className="mb-4 cursor-pointer" onClick={toggleSidebar}>
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-xl mb-4 font-bold">Edit Transaction</h1>
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
          <span className="pt-2 pb-2 pl-10 pr-12 rounded-lg border-2 cursor-pointer text-center">
            Income
          </span>
          <span className="pt-2 pb-2 pl-10 pr-12 rounded-lg  text-white bg-red-500 cursor-pointer text-center">
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
              Update Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
