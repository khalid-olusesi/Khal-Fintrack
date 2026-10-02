import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budgets | KhalFintrack",
  description: "Create and manage spending budgets and track your progress.",
};

export default function BudgetsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
