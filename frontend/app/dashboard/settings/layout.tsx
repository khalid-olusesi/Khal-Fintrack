import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | KhalFintrack",
  description: "Manage your KhalFintrack account and preferences.",
};

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
