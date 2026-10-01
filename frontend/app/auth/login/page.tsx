"use client";

import { toast } from "@/components/ui/toast";

import { MainLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { ModeToggle } from "@/components/toggle";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevents the default browser trouble
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      email: "",
      password: "",
    };

    if (form.email.trim() === "") {
      newErrors.email = "Email is required in this field"; //newErrors save the error texts while the errors usetate saves everything
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid Email";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must not be less than 8 characters";
    }

    setErrors(newErrors); //now all the error texts are contained in the error state

    if (newErrors.email || newErrors.password) {
      return;
    }

    setIsLoggingIn(true);
    try {
      console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL}/login`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", //application json is used as content type for auth in golang
        },

        body: JSON.stringify(form), //login page
      }); //fetch takes two parameters the url you are calling from which is the backend here and the scond describe what we are calling

      const data = await response.json(); //use the content for error handling

      if (response.ok) {
        // Store token for cross-origin auth (cookies don't work reliably across domains)
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        toast.add({ title: "Login successful", type: "success" });
        router.push("/dashboard/main");
      } else {
        toast.add({ title: data.error || "Login failed", type: "error" });
      }
    } catch (error) {
      console.error(error); //prints the erroe in the consoel and this catch statement is used to check for netork failure
      toast.add({ title: "Unable to connect", type: "error" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    // main container
    <div className="min-h-screen bg-white text-gray-900 dark:bg-background dark:text-foreground lg:grid lg:grid-cols-2">
      {/* first column */}
      <div className="flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12 xl:px-20">
        {/* Header with back button and centered logo on mobile, default on desktop */}
        <div className="relative flex items-center justify-between">
          <Link
            href="/"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted lg:invisible"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-foreground" />
          </Link>
          <MainLogo />
          <ModeToggle />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          {/* mobile image - shown at top on small screens */}
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src="/illustrations/Security On-bro.svg"
              alt="Security illustration"
              width={132}
              height={132}
              priority
            />
          </div>

          {/* header component of the login */}
          <div className="mx-auto mb-7 w-full max-w-md">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
              Personal finance, made clear
            </p>
            <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Login to your account.
            </p>
          </div>

          {/* form */}
          <div className="mx-auto w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="mb-1.5 text-muted-foreground text-[13px] md:text-[14px]">
                  Email
                </p>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-card dark:placeholder-gray-500"
                  type="email"
                  placeholder="john@example.com"
                />
                <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                  {errors.email}
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-1.5 text-muted-foreground text-[13px] md:text-[14px]">
                  Password
                </p>
                <div className="relative">
                  <input
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-card dark:placeholder-gray-500"
                    type="password"
                    placeholder="********"
                  />
                </div>
                <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                  {errors.password}
                </p>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  aria-busy={isLoggingIn}
                  className="mb-1.5 h-12 w-full cursor-pointer rounded-lg font-semibold shadow-sm"
                >
                  {isLoggingIn ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <p className="text-muted-foreground text-[13px] md:text-[14px] text-center mt-3">
                  Don't have an account?
                  <Link
                    className="text-green-600 ml-1 font-medium"
                    href={"/auth/signup"}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* second column - desktop only */}
      <aside className="relative hidden min-h-screen flex-col items-center justify-center overflow-hidden border-l border-border bg-gray-50 px-10 py-14 text-center dark:bg-card lg:flex">
        <p className="mb-5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          Khal-FinTrack
        </p>
        <div className="relative z-10 mb-5">
          <Image
            src="/illustrations/Security On-bro.svg"
            alt="Security illustration"
            width={380}
            height={340}
            priority
            className="h-auto w-full max-w-[380px] object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Your finances, in focus.
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          See your income, spending, and budgets in one clear place.
        </p>
      </aside>
    </div>
  );
}
