"use client";

import { MainLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("https://khal-fintrack.onrender.com/login", {
        method: "POST",
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
    <div className="min-h-screen flex">
      {/* first column */}
      <div className="flex-1 p-8">
        <div className="flex justify-center items-center mb-10">
          <MainLogo />
        </div>
        {/* header component of the signup */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-center">Welcome back</h2>
          <p className="text-muted-foreground text-center">
            Log in to your account
          </p>
        </div>

        {/* form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <p className="mb-1.5 text-muted-foreground text-[14px]">Email</p>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value, //value already contains the form.email
                  })
                }
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3"
                type="email"
                placeholder="olusesikhalid43@gmail.com"
              />
              <p className="text-red-500 text-center text-[14px]">
                {errors.email}
              </p>
            </div>

            <div className="mb-5">
              <p className="mb-1.5 text-muted-foreground text-[14px]">
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
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3 mb-4"
                type="password"
                placeholder="****"
              />
              <p className="text-red-500 text-center text-[14px]">
                {errors.password}
              </p>
              <div className="flex items-center justify-end">
                <span className="text-green-600 text-[14px]">
                  <Link href="">forgot password</Link>
                </span>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="cursor-pointer w-[100%] p-5 mb-5"
              >
                {/*always remeber to name the type submit*/}
                Login
              </Button>
              <p className="text-muted-foreground text-[14px] text-center">
                Dont have an account?
                <Link className="text-green-600 ml-1" href={"/auth/signup"}>
                  Signup
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* second column */}
      <div className="relative w-1/2 bg-gray-100 flex items-center justify-center h-full p-8 overflow-hidden">
        <div className="absolute -left-10 top-0 h-full w-32 bg-white -skew-x-6" />

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
