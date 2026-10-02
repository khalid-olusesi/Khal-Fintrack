import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | KhalFintrack",
  description:
    "Manage your KhalFintrack profile, account preferences, and security settings.",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}