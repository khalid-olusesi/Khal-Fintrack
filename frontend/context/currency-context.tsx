"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type CurrencyContextValue = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState("NGN");
  const hasLoadedCurrency = useRef(false);
  const pathname = usePathname();

  const updateCurrency = (nextCurrency: string) => {
    hasLoadedCurrency.current = true;
    setCurrency(nextCurrency);
  };

  useEffect(() => {
    if (pathname === "/dashboard/profile" || hasLoadedCurrency.current) return;

    const getProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      hasLoadedCurrency.current = true;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setCurrency(data.user.currency || "NGN");
      } catch (error) {
        console.error(error);
      }
    };

    getProfile();
  }, [pathname]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
