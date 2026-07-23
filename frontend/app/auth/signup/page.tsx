import { MainLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
  return (
    // main container
    <div className="min-h-screen flex">
      {/* first column */}
      <div className="flex-1 p-8">
        <div className="flex justify-center items-center mb-6">
          <MainLogo />
        </div>
        {/* header component of the signup */}
        <div className="mb-4">
          <h2 className="text-4xl font-bold text-center">Create your account</h2>
          <p className="text-muted-foreground text-center">
            start your journey to better finances
          </p>
        </div>

        {/* form */}
        <div>
          <form>
            <div className="mb-4">
              <p className="mb-1.5 text-muted-foreground text-[14px]">Full Name</p>
              <input
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3"
                type="text"
                placeholder="Olusesi Khalid"
              />
            </div>

            <div className="mb-4">
              <p className="mb-1.5 text-muted-foreground text-[14px]">Email</p>
              <input
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3"
                type="email"
                placeholder="olusesikhalid43@gmail.com"
              />
            </div>

            <div className="mb-4">
              <p className="mb-1.5 text-muted-foreground text-[14px]">Password</p>
              <input
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3"
                type="password"
                placeholder="****"
              />
            </div>

            <div className="mb-4">
              <p className="mb-0.5 text-muted-foreground text-[14px]">Confirm Password</p>
              <input
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3 mb-3"
                type="password"
                placeholder="****"
              />
            </div>
          </form>
        </div>

        <div>
          <Button className="cursor-pointer w-[100%] p-5 mb-1.5">Signup</Button>
          <p className="text-muted-foreground text-[14px] text-center">
            Already have an account?
            <Link className="text-green-600 ml-1" href={"/auth/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* second column */}
      <div className="relative w-1/2 bg-gray-100 flex items-center justify-center h-full p-8 overflow-hidden">
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
