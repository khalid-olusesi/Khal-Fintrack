import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | KhalFintrack",
  description: "View and manage your income and expense transactions.",
};

export default function TransactionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
