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

export default function Signup() {
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (form.name.length < 3) {
      newErrors.name = "name must not be less than 3 letters";
    }

    if (form.password.length < 8) {
      newErrors.password = "password must be atleast 8 characters";
    }

    if (form.email.trim() === " ") {
      newErrors.email = "Email is required in this field";
    } //this is for when the email field is empty

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid Email";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "passwords do not match";
    }

    setErrors(newErrors);

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.password ||
      newErrors.confirmPassword
    ) {
      return;
    } //if there is an error in any one of the following, stop the program from running

    setIsSigningUp(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.add({ title: "Account created successfully", type: "success" });
        router.push("/auth/login");
      } else {
        toast.add({ title: data.error || "Sign up failed", type: "error" });
      }
    } catch (error) {
      console.error(error);
      toast.add({ title: "Unable to connect", type: "error" });
    } finally {
      setIsSigningUp(false);
    }
  }; //prevents the page from refreshing whenever i click on the submit button

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

        <div className="flex flex-1 flex-col justify-center py-6">
          {/* mobile image - shown at top on small screens */}
          <div className="mb-5 flex justify-center lg:hidden">
            <Image
              src="/illustrations/Revenue-bro.svg"
              alt="Revenue illustration"
              width={112}
              height={112}
              priority
            />
          </div>

          {/* header component of the signup */}
          <div className="mx-auto mb-6 w-full max-w-md">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
              Start with a clearer picture
            </p>
            <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Start your journey to better finances
            </p>
          </div>

          {/* form */}
          <div className="mx-auto w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 md:mb-4">
                <p className="mb-1.5 text-muted-foreground text-[13px] md:text-[14px]">
                  Full Name
                </p>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-card dark:placeholder-gray-500"
                  type="text"
                  placeholder="Olusesi Khalid"
                />
                <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                  {errors.name}
                </p>
              </div>

              <div className="mb-3 md:mb-4">
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
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-card dark:placeholder-gray-500"
                  type="email"
                  placeholder="olusesikhalid43@gmail.com"
                />
                <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                  {errors.email}
                </p>
              </div>

              <div className="mb-3 md:mb-4">
                <p className="mb-1.5 text-muted-foreground text-[13px] md:text-[14px]">
                  Password
                </p>
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-card dark:placeholder-gray-500"
                  type="password"
                  placeholder="****"
                />
                <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                  {errors.password}
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-1.5 text-muted-foreground text-[13px] md:text-[14px]">
                  Confirm Password
                </p>
                <input
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-card dark:placeholder-gray-500"
                  type="password"
                  placeholder="****"
                />
                <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                  {errors.confirmPassword}
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSigningUp}
                  aria-busy={isSigningUp}
                  className="mb-1.5 h-12 w-full cursor-pointer rounded-lg font-semibold shadow-sm"
                >
                  {isSigningUp ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <p className="text-muted-foreground text-[13px] md:text-[14px] text-center mt-2">
                  Already have an account?
                  <Link className="text-green-600 ml-1" href={"/auth/login"}>
                    Login
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
            src="/illustrations/Revenue-bro.svg"
            alt="Revenue illustration"
            width={380}
            height={340}
            priority
            className="h-auto w-full max-w-[380px] object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Build healthier money habits.
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Keep everyday spending and long-term goals in view as your finances
          grow.
        </p>
      </aside>
    </div>
  );
}
