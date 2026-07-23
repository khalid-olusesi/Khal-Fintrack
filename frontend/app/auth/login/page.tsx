import { MainLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
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
          <h2 className="text-4xl font-bold text-center">Welcome back</h2>
          <p className="text-muted-foreground text-center">
            Log in to your account
          </p>
        </div>

        {/* form */}
        <div>
          <form>
            <div className="mb-5">
              <p className="mb-1.5 text-muted-foreground text-[14px]">Email</p>
              <input
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3"
                type="email"
                placeholder="olusesikhalid43@gmail.com"
              />
            </div>

            <div className="mb-5">
              <p className="mb-1.5 text-muted-foreground text-[14px]">Password</p>
              <input
                className="border-2 rounded-[8px] outline-0 p-2 text-[14px] w-[100%] pl-3 mb-4"
                type="password"
                placeholder="****"
              />

              <div className="flex items-center justify-end">
                <span className="text-green-600 text-[14px]"><Link href="">forgot password</Link></span>
              </div>
            </div>

          </form>
        </div>

        <div>
          <Button className="cursor-pointer w-[100%] p-5 mb-5">Login</Button>
          <p className="text-muted-foreground text-[14px] text-center">
            Dont have an account?
            <Link className="text-green-600 ml-1" href={"/auth/signup"}>
              Signup
            </Link>
          </p>
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
