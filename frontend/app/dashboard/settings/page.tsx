"use client";

import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Coins,
  Download,
  Menu,
  SlidersHorizontal,
  SunMoon,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/context/sidebar-context";
import { useCurrency } from "@/context/currency-context";
import { useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";

const currencies = [
  { label: "Nigerian Naira (₦)", value: "NGN" },
  { label: "US Dollar ($)", value: "USD" },
  { label: "British Pound (£)", value: "GBP" },
  { label: "Euro (€)", value: "EUR" },
];

export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const [isSavingCurrency, setIsSavingCurrency] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isDeletingAccountRef = useRef(false);
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const exportTransactions = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("token");
      const transactions: {
        date: string;
        type: string;
        category?: { name?: string } | null;
        description: string;
        amount: number;
      }[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}&limit=200`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error("Failed to export transactions");
        const data = await response.json();
        transactions.push(...(data.transactions ?? []));
        totalPages = Math.max(1, Number(data.pagination?.totalPages ?? 1));
        page += 1;
      } while (page <= totalPages);

      const csvCell = (value: unknown) => {
        let text = String(value ?? "");
        if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
        return `"${text.replaceAll('"', '""')}"`;
      };
      const rows = [
        ["Date", "Type", "Category", "Description", "Amount"],
        ...transactions.map((transaction) => [
          new Date(transaction.date).toISOString(),
          transaction.type,
          transaction.category?.name ?? "Uncategorized",
          transaction.description,
          transaction.amount,
        ]),
      ];
      const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
      const url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "khal-fintrack-transactions.csv";
      link.click();
      URL.revokeObjectURL(url);
      toast.add({ title: "Transactions exported", type: "success" });
    } catch (error) {
      toast.add({
        title:
          error instanceof Error
            ? error.message
            : "Failed to export transactions",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const deleteAccount = async () => {
    if (isDeletingAccountRef.current) return;

    isDeletingAccountRef.current = true;
    setIsDeletingAccount(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/account`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to delete account");

      localStorage.removeItem("token");
      router.replace("/auth/login");
    } catch (error) {
      toast.add({
        title:
          error instanceof Error ? error.message : "Failed to delete account",
        type: "error",
      });
      isDeletingAccountRef.current = false;
      setIsDeletingAccount(false);
    }
  };

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

      <div className="w-full divide-y divide-border rounded-xl border border-border bg-white px-5 dark:bg-card md:px-8">
        <section className="py-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            General
          </h3>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Coins className="h-4 w-4 text-muted-foreground" />
            Currency
          </label>

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
            <p className="mt-1 text-xs text-muted-foreground">Saving...</p>
          )}
        </section>

        <section className="py-5">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <SunMoon className="h-4 w-4 text-muted-foreground" />
            Appearance
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Choose how KhalFintrack looks on this device.
          </p>
          <Select
            value={theme ?? "system"}
            onValueChange={(value) => setTheme(value ?? "system")}
          >
            <SelectTrigger className="w-full bg-white dark:bg-background sm:max-w-sm">
              <SelectValue placeholder="Select appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <section className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">Export data</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Download all your transactions as a CSV file.
            </p>
          </div>
          <Button
            onClick={exportTransactions}
            disabled={isExporting}
            variant="outline"
            className="cursor-pointer gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Preparing CSV..." : "Export CSV"}
          </Button>
        </section>

        <section className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
              Delete account
            </h3>
            <p className="mt-1 max-w-xl text-xs text-muted-foreground">
              Permanently delete your account, transactions, budgets, and
              categories.
            </p>
          </div>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeletingAccount}
            variant="destructive"
            className="cursor-pointer gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeletingAccount ? "Deleting..." : "Delete account"}
          </Button>
        </section>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeletingAccount) {
              setShowDeleteConfirm(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !isDeletingAccount) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
            className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl dark:bg-card"
          >
            <h2 id="delete-account-title" className="text-base font-semibold">
              Delete your account?
            </h2>
            <p
              id="delete-account-description"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              This permanently deletes your account, transactions, budgets, and
              categories. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeletingAccount}
                autoFocus
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isDeletingAccount}
                onClick={() => void deleteAccount()}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isDeletingAccount ? "Deleting..." : "Delete account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
