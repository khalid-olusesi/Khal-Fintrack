import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categoies | KhalFintrack",
  description:
    "Create and manage categories for organizing your income and expenses.",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
