import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | KhalFintrack",
  description: "Log in to your KhalFintrack account.",
};

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
