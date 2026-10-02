import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { CategoryProvider } from "@/context/category-context";
import { CurrencyProvider } from "@/context/currency-context";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KhalFintrack — Personal Finance Tracker",
    template: "%s | KhalFintrack",
  },
  description:
    "KhalFintrack is a personal finance tracker for managing expenses, income, budgets, and financial goals.",
  metadataBase: new URL("https://khal-fintrack.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KhalFintrack — Personal Finance Tracker",
    description:
      "Manage your expenses, income, budgets, and financial goals with KhalFintrack.",
    url: "https://khal-fintrack.vercel.app",
    siteName: "KhalFintrack",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased`}
      suppressHydrationWarning
    >
      <body className="h-screen flex flex-col">
        {" "}
        <ThemeProvider>
          <CurrencyProvider>
            <CategoryProvider>
              <Toaster>{children}</Toaster>
            </CategoryProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
