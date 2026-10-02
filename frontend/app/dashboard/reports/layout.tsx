import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports | KhalFintrack",
  description: "Analyze your spending and understand your financial activity.",
};

export default function ReportsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
