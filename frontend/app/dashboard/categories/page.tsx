"use client";

import { toast } from "@/components/ui/toast";

import { Menu, Plus, Trash2, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/sidebar-context";
import { useState } from "react";
import CardSpacing from "./addCategories/page";
import { Icons } from "@/components/category-icons";
import { useCategories, Category } from "@/context/category-context";

export default function Categories() {
  const { categories, setCategories, fetchCategories, isLoading } =
    useCategories();
  const { toggleSidebar } = useSidebar();

  const CategorySkeleton = () => {
    return (
      <tr className="border-b border-gray-200 dark:border-border">
        <td className="p-4 text-left">
          <div className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </td>
        <td className="text-left">
          <Skeleton className="h-4 w-16" />
        </td>
        <td className="py-4">
          <div className="flex items-center justify-end pr-4 gap-10">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-4 h-4" />
          </div>
        </td>
      </tr>
    );
  };

  const [showCard, setShowCard] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [isEditing, setIsEditing] = useState(false);

  const deleteCategory = async (id: string | number) => {
    // Optimistic: remove from UI immediately
    const previousCategories = categories;
    setCategories((prev) => prev.filter((category) => category.id !== id));
    toast.add({ title: "Category deleted successfully", type: "success" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          method: "DELETE",
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
        // Rollback on failure
        setCategories(previousCategories);
        toast.add({
          title: data?.error || text || "failed to delete category",
          type: "error",
        });
        return;
      }

      // Sync with server in background
      fetchCategories();
    } catch (err) {
      console.error(err);
      // Rollback on network error
      setCategories(previousCategories);
      toast.add({ title: "Unable to connect to server", type: "error" });
    }
  };

  return (
    // container
    <div className="relative bg-gray-100 dark:bg-background w-full h-full p-4 md:p-6 overflow-y-auto scroll-smooth">
      {/*header*/}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 items-center">
          <button className="cursor-pointer" onClick={toggleSidebar}>
            <Menu className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold sm:text-xl">Categories</h1>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            onClick={() => setShowCard(true)}
            className="cursor-pointer flex items-center"
            aria-label="Add category"
            title="Add category"
          >
            <span className="hidden sm:inline">Add Category</span>
            <Plus className="h-4 w-4 sm:ml-1" />
          </Button>
        </div>
      </div>

      {/* tables */}
      <div className="mt-5 md:mt-10 hidden md:block overflow-x-auto">
        <table className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg text-foreground">
          <thead className="bg-gray-200 dark:bg-zinc-800/80">
            <tr>
              <th className="p-4 text-left">Category</th>
              <th className="text-left">Type</th>
              <th className="text-end pr-6">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <CategorySkeleton key={idx} />
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const categoryIcon = Icons.find(
                  (item) => item.name === category.icon,
                ); //to get one icon at a time, it gets the icon that matches a name

                const Icon = categoryIcon?.icon;

                return (
                  <tr
                    key={category.id}
                    className="border-b border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {Icon && (
                          <div
                            className={`rounded-full p-2 border-2 ${categoryIcon?.selectedBg}`}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${categoryIcon?.textColor}`}
                            />
                          </div>
                        )}
                        <span>{category.name}</span>
                      </div>
                    </td>

                    <td>{category.type}</td>

                    <td className="py-4">
                      <div className="flex items-center justify-end pr-4 gap-10">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCard(true);
                            setIsEditing(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                        </button>

                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            deleteCategory(category.id);
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
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="mt-3 h-3 w-1/4" />
            </div>
          ))
        ) : categories.length > 0 ? (
          categories.map((category) => {
            const categoryIcon = Icons.find(
              (item) => item.name === category.icon,
            );
            const Icon = categoryIcon?.icon;

            return (
              <article
                key={category.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-border dark:bg-card"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {Icon && (
                    <span
                      className={`shrink-0 rounded-full border-2 p-2 ${categoryIcon?.selectedBg}`}
                    >
                      <Icon className={`h-4 w-4 ${categoryIcon?.textColor}`} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                      {category.type}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${category.name}`}
                    title="Edit category"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCard(true);
                      setIsEditing(true);
                    }}
                    className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
                    onClick={() => deleteCategory(category.id)}
                    className="rounded-md p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <p className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted-foreground">
            No categories found.
          </p>
        )}
      </div>

      {/*add category card*/}

      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">
          <CardSpacing
            onClose={() => {
              setShowCard(false);
              setIsEditing(false);
              setSelectedCategory(null);
            }}
            selectedCategory={selectedCategory}
            isEditing={isEditing}
            onSuccess={fetchCategories}
          />
        </div>
      )}
    </div>
  );
}
