import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | KhalFintrack",
  description:
    "Create your KhalFintrack account and start managing your finances.",
};

export default function SignupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
