"use client";

import { MainLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

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

    const response = await fetch("https://khal-fintrack.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/dashboard/main");
    } else {
      alert(data.error);
    }
  }; //prevents the page from refreshing whenever i click on the submit button

  return (
    // main container
    <div className="min-h-screen flex">
      {/* first column */}
      <div className="flex-1 p-8 px-6">
        {/* Header with back button and centered logo on mobile, default on desktop */}
        <div className="relative flex justify-center items-center mb-4 md:mb-6">
          <Link href="/" className="absolute left-0 p-1 md:hidden">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex justify-center items-center">
            <MainLogo />
          </div>
        </div>

        {/* mobile image - shown at top on small screens */}
        <div className="flex justify-center mb-4 md:hidden">
          <Image
            src="/illustrations/Revenue-bro.svg"
            alt="Revenue illustration"
            width={150}
            height={150}
            priority
          />
        </div>

        {/* header component of the signup */}
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Create your account
          </h2>
          <p className="text-muted-foreground text-sm text-center">
            Start your journey to better finances
          </p>
        </div>

        {/* form */}
        <div>
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
                className="border rounded-[8px] outline-0 p-2.5 text-[13px] md:text-[14px] w-[100%] pl-3"
                type="text"
                placeholder="Olusesi Khalid"
              />
              <p className="text-red-500 text-center text-[13px] md:text-[14px]">
                {errors.name}
              </p>
            </div>

            <div className="mb-3 md:mb-4">
              <p className="mb-1.5 text-muted-foreground text-[13px] md:text-[14px]">Email</p>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="border rounded-[8px] outline-0 p-2.5 text-[13px] md:text-[14px] w-[100%] pl-3"
                type="email"
                placeholder="olusesikhalid43@gmail.com"
              />
              <p className="text-red-500 text-center text-[13px] md:text-[14px]">
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
                className="border rounded-[8px] outline-0 p-2.5 text-[13px] md:text-[14px] w-[100%] pl-3"
                type="password"
                placeholder="****"
              />
              <p className="text-red-500 text-center text-[13px] md:text-[14px]">
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
                className="border rounded-[8px] outline-0 p-2.5 text-[13px] md:text-[14px] w-[100%] pl-3"
                type="password"
                placeholder="****"
              />
              <p className="text-red-500 text-center text-[13px] md:text-[14px]">
                {errors.confirmPassword}
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="cursor-pointer w-[100%] p-5 mb-1.5 rounded-xl md:rounded-lg"
              >
                Sign Up
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

      {/* second column - desktop only */}
      <div className="hidden md:relative md:flex relative w-1/2 bg-gray-100 items-center justify-center h-full p-8 overflow-hidden">
        <div className="absolute -left-10 top-0 h-full w-32 bg-white -skew-x-6" />

        <div className="relative z-10">
          <Image
            src="/illustrations/Revenue-bro.svg"
            alt="Revenue illustration"
            width={350}
            height={350}
            priority
          />
        </div>
      </div>
    </div>
  );
}
