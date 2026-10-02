import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Transaction | KhalFintrack",
  description: "Update an existing income or expense transaction.",
};

export default function EditTransactionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
