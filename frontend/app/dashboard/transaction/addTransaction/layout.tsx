import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Transaction | KhalFintrack",
  description: "Record a new income or expense transaction.",
};

export default function AddTransactionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
