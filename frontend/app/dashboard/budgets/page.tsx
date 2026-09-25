"use client";

import { Icons } from "@/components/category-icons";
import { Button } from "@/components/ui/button";
import { Plus, X, Tag, DollarSign, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryDropDown from "@/components/dropdown";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Budget = {
  id: number;
  category_id: number;
  category?: {
    name: string;
    icon: string;
  };
  budgeted: number;
  spent: number;
};

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showCard, setShowCard] = useState(false);
  const [form, setForm] = useState({
    budgeted: "",
    category: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getBudgets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/budgets`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }

      const data = await response.json();

      setBudgets(data.budgets);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBudgets();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.category) {
      toast.add({ title: "Choose a category", type: "warning" });
      return;
    }

    if (Number(form.budgeted) <= 0) {
      toast.add({ title: "Amount must be greater than zero", type: "warning" });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/budgets/${selectedBudget?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/budgets`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: Number(form.category),
          budgeted: Number(form.budgeted),
        }),
      });

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

      toast.add({
        title: isEditing
          ? "Budget updated successfully"
          : "Budget created successfully",
        type: "success",
      });
      setForm({ budgeted: "", category: "" });
      setShowCard(false);
      setIsEditing(false);
      setSelectedBudget(null);
      getBudgets();
    } catch (err) {
      console.error(err);
      toast.add({ title: "Unable to connect to the server.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/budgets/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      toast.add({ title: "Budget deleted successfully", type: "success" });
      getBudgets();
    } catch (error) {
      console.error(error);
      toast.add({ title: "Unable to delete budget", type: "error" });
    }
  };

  function CategoryDisplay({
    category,
  }: {
    category?: {
      name: string;
      icon: string;
    };
  }) {
    if (!category) {
      return <span>—</span>;
    }

    const categoryIcon = Icons.find((item) => item.name === category.icon);

    const Icon = categoryIcon?.icon;

    return (
      <div className="flex items-center gap-6">
        {Icon && (
          <Icon className={`w-4 h-4 ${categoryIcon?.textColor ?? ""}`} />
        )}

        <span>{category.name}</span>
      </div>
    );
  }

  const BudgetSkeleton = () => {
    return (
      <tr className="border-b border-gray-200 dark:border-border">
        <td className="text-left p-4">
          <div className="flex items-center gap-6">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </td>
        <td className="text-left">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="text-right pr-3">
          <div className="flex justify-end">
            <Skeleton className="h-4 w-16" />
          </div>
        </td>
        <td className="pr-6">
          <div className="flex items-center justify-end gap-3">
            <Skeleton className="h-2 w-24 rounded-full" />
            <Skeleton className="h-4 w-9" />
          </div>
        </td>
        <td className="py-4 pr-6">
          <div className="flex items-center justify-end pr-4 gap-10">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-4 h-4" />
          </div>
        </td>
      </tr>
    );
  };

  return (
    // container
    <div className="bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth">
      {/*headers*/}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Budgets</h1>
        <Button
          onClick={() => {
            setForm({ budgeted: "", category: "" });
            setIsEditing(false);
            setSelectedBudget(null);
            setShowCard(true);
          }}
          className="cursor-pointer flex justify-between items-center"
        >
          <Plus />
          <span> Add Budget</span>
        </Button>
      </div>

      {/*main contents*/}
      <div>
        <div>
          <table className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg text-foreground">
            <thead className="bg-gray-200 dark:bg-zinc-800/80">
              <tr>
                <th className="p-4 text-left">Category</th>
                <th className="text-left">Budgeted</th>
                <th className="text-right pr-3">Spent</th>
                <th className="text-end pr-6">Progress</th>
                <th className="text-end pr-6">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <BudgetSkeleton key={idx} />
                ))
              ) : budgets.length > 0 ? (
                budgets.map((budget, index) => {
                  const progress = (budget.spent / budget.budgeted) * 100;
                  const progressWidth = Math.min(progress, 100);
                  const isOverBudget = budget.spent > budget.budgeted;
                  return (
                    <tr
                      key={budget.id ?? index}
                      className="border-b border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="text-left p-4">
                        <CategoryDisplay category={budget.category} />
                      </td>

                      <td className="text-left">{budget.budgeted}</td>

                      <td className="text-right pr-3">₦{budget.spent}</td>

                      <td className="pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isOverBudget ? "bg-red-500" : "bg-primary"
                              }`}
                              style={{ width: `${progressWidth}%` }}
                            />
                          </div>
                          <div className="w-9 text-right">
                            {progress.toFixed(0)}%
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center justify-end pr-4 gap-10">
                          <button
                            onClick={() => {
                              setSelectedBudget(budget);
                              setForm({
                                budgeted: String(budget.budgeted),
                                category: String(budget.category_id),
                              });
                              setIsEditing(true);
                              setShowCard(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                          </button>

                          <button
                            className="cursor-pointer"
                            onClick={() => {
                              deleteBudget(budget.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    No budget found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-auto h-85 grid w-full max-w-2xl gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="mt-3">
                  {isEditing ? "Edit Budget" : "Add Budget"}
                </CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowCard(false);
                      setIsEditing(false);
                      setSelectedBudget(null);
                      setForm({ budgeted: "", category: "" });
                    }}
                    className="cursor-pointer"
                    variant="link"
                  >
                    <X />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label className="text-muted-foreground">Category</Label>
                      <div className="flex w-full">
                        <div className="flex items-center justify-center h-10 w-11 bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-md text-muted-foreground">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div className="flex-1 pb-3">
                          <CategoryDropDown
                            value={form.category}
                            onValueChange={(value) => {
                              setForm({
                                ...form,
                                category: value ?? "",
                              });
                            }}
                            type="expense"
                            className="rounded-l-none w-full border-l-0 shadow-none outline-none h-auto! py-2!" //!important
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-muted-foreground">
                        Budgeted Amount
                      </Label>
                      <div className="flex w-full">
                        <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-md text-muted-foreground font-semibold">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={form.budgeted}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              budgeted: e.target.value,
                            })
                          }
                          className="rounded-l-none p-5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-none mt-7 bg-none">
                    <Button
                      type="button"
                      className="cursor-pointer bg-0 border-xl text-black hover:opacity-100 hover:text-white"
                      onClick={() => {
                        setForm({ budgeted: "", category: "" });
                        setIsEditing(false);
                        setSelectedBudget(null);
                        setShowCard(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="cursor-pointer"
                      disabled={isSaving}
                    >
                      {isSaving
                        ? "Saving..."
                        : isEditing
                          ? "Update Budget"
                          : "Save Budget"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
