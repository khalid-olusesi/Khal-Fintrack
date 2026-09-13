"use client";

import { createContext, useState, useContext, useEffect, useCallback } from "react";

export type Category = {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
};

type CategoryContextType = {
  categories: Category[];
  fetchCategories: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // No token yet — skip silently, we'll retry when token appears
      if (!token) return;

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
        // Silently skip on 401 (not logged in yet) to avoid spamming alerts
        if (response.status !== 401) {
          console.error(data?.error || text || "failed to get category");
        }
        return;
      }

      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch immediately on mount (works when token already exists, e.g. after refresh)
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Also poll localStorage for a token appearing (handles post-login navigation)
  useEffect(() => {
    if (categories.length > 0) return; // already loaded, no need to poll

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchCategories();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [categories.length, fetchCategories]);

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategories must be used within a <CategoryProvider>");
  }

  return context;
}
