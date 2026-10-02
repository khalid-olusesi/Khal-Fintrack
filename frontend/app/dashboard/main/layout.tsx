import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | KhalFintrack",
  description:
    "View your balance, income, expenses, savings, and recent transactions.",
};

export default function DashboardMainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
