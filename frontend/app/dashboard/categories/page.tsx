"use client";

import { Menu, Plus, Trash2, Pencil } from "lucide-react";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/sidebar-context";
import { useEffect, useState } from "react";
import CardSpacing from "./addCategories/page";
import { Icons } from "@/components/category-icons";

type Category = {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
};

export default function Categories() {
  const { toggleSidebar } = useSidebar();

  const [showCard, setShowCard] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
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
        alert(data?.error || text || "failed to get category");
        return;
      }

      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const deleteCategory = async (id: string | number) => {
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
        alert(data?.error || text || "failed to delete category");
      }

      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      console.error(err);
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
          <h1 className="text-xl font-bold">Categories</h1>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            onClick={() => setShowCard(true)}
            className="cursor-pointer flex items-center"
          >
            <span>Add Category</span>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* tables */}
      <div className="mt-10">
        <table className="w-full bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg text-foreground">
          <thead className="bg-gray-200 dark:bg-zinc-800/80">
            <tr>
              <th className="p-4 text-left">Category</th>
              <th className="text-left">Type</th>
              <th className="text-end pr-6">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => {
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

                      <button className="cursor-pointer">
                        <Trash2
                          onClick={() => {
                            deleteCategory(category.id);
                          }}
                          className="w-4 h-4 text-red-500 hover:text-red-700"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/*add category card*/}

      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <CardSpacing
            onClose={() => {
              setShowCard(false);
              setIsEditing(false);
              setSelectedCategory(null);
            }}
            selectedCategory={selectedCategory}
            isEditing={isEditing}
            onSuccess={fetchCategory}
          />
        </div>
      )}
    </div>
  );
}
