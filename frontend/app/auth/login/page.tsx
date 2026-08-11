"use client";

import { MainLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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

    try {
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
        router.push("/dashboard/main");
      } else {
        alert(data.error || "login failed");
      }
    } catch (error) {
      console.error(error); //prints the erroe in the consoel and this catch statement is used to check for netork failure
      alert("unable to connect");
    }
  };

  return (
    // main container
    <div className="min-h-screen flex bg-white dark:bg-background text-gray-900 dark:text-foreground">
      {/* first column */}
      <div className="flex-1 p-8 px-6">
        {/* Header with back button and centered logo on mobile, default on desktop */}
        <div className="relative flex justify-center items-center mb-6">
          <Link href="/" className="absolute left-0 p-1 md:hidden">
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-foreground" />
          </Link>
          <div className="flex justify-center items-center">
            <MainLogo />
          </div>
          <div className="absolute right-0">
            <ModeToggle />
          </div>
        </div>

        {/* mobile image - shown at top on small screens */}
        <div className="flex justify-center mb-4 md:hidden">
          <Image
            src="/illustrations/Security On-bro.svg"
            alt="Security illustration"
            width={150}
            height={150}
            priority
          />
        </div>

        {/* header component of the login */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm text-center">
            Login to your account.
          </p>
        </div>

        {/* form */}
        <div>
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
                className="border rounded-[8px] outline-0 p-2.5 text-[13px] md:text-[14px] w-[100%] pl-3 bg-white dark:bg-card border-gray-200 dark:border-border text-foreground dark:placeholder-gray-500"
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
                  className="border rounded-[8px] outline-0 p-2.5 text-[13px] md:text-[14px] w-[100%] pl-3 pr-10 mb-2 bg-white dark:bg-card border-gray-200 dark:border-border text-foreground dark:placeholder-gray-500"
                  type="password"
                  placeholder="********"
                />
              </div>
              <p className="text-red-500 text-left text-[11px] md:text-[12px] mt-1">
                {errors.password}
              </p>
              <div className="flex items-center justify-end mt-1">
                <span className="text-green-600 text-[13px] md:text-[14px] cursor-pointer">
                  <Link href="">Forgot password?</Link>
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="cursor-pointer w-[100%] p-5 mb-1.5 rounded-xl md:rounded-lg"
              >
                Login
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

      {/* second column - desktop only */}
      <div className="hidden md:relative md:flex relative w-1/2 bg-gray-100 dark:bg-[#0a0e17] items-center justify-center h-full p-8 overflow-hidden">
        <div className="absolute -left-10 top-0 h-full w-32 bg-white dark:bg-[#0b0f19] -skew-x-6" />

        <div className="relative z-10">
          <Image
            src="/illustrations/Security On-bro.svg"
            alt="Security illustration"
            width={350}
            height={350}
            priority
          />
        </div>
      </div>
    </div>
  );
}
