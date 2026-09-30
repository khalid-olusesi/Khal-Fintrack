"use client";

import { ModeToggle } from "@/components/toggle";
import { Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/context/sidebar-context";
import { useCurrency } from "@/context/currency-context";
import { useState } from "react";

const currencies = [
  { label: "Nigerian Naira (₦)", value: "NGN" },
  { label: "US Dollar ($)", value: "USD" },
  { label: "British Pound (£)", value: "GBP" },
  { label: "Euro (€)", value: "EUR" },
];

export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const [isSavingCurrency, setIsSavingCurrency] = useState(false);
  const { toggleSidebar } = useSidebar();
  return (
    // container
    <div className="bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth">
      {/*headers*/}
      <div className="flex justify-between items-center mb-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="cursor-pointer rounded-md p-2 hover:bg-muted"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold sm:text-xl">Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>

      {/*first section*/}
      <div>
        <h3 className="font-bold">General</h3>
        <label className="block mb-2">Currency</label>

        <Select
          value={currency}
          onValueChange={async (value) => {
            setCurrency(value ?? "");
            setIsSavingCurrency(true);

            try {
              const token = localStorage.getItem("token");

              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/profile`,
                {
                  method: "PATCH",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    currency: value,
                  }),
                },
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || "Failed to update currency");
              }
            } catch (error) {
              console.error(error);
            } finally {
              setIsSavingCurrency(false);
            }
          }}
        >
          <SelectTrigger className="w-full bg-white dark:bg-background">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>

          <SelectContent>
            {currencies.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isSavingCurrency && (
          <p className="text-xs text-muted-foreground mt-1">Saving...</p>
        )}
      </div>
    </div>
  );
}
