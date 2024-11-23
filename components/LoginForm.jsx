"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }
      router.replace("/dashboard"); 
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="grid place-items-center h-[calc(100vh-4rem)] px-4 sm:px-8 md:px-16">
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-blue-500 bg-slate-800 w-full max-w-md sm:max-w-lg">
          <h1 className="text-xl font-bold my-4 text-white">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="px-4 py-2 rounded-md bg-white text-black placeholder-gray-400 w-full"
              value={email}
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="px-4 py-2 rounded-md bg-white text-black placeholder-gray-400 w-full"
              value={password}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md hover:bg-blue-400 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <Link
              className="text-sm mt-3 text-right text-white "
              href={"/register"}
            >
              Do not have an account? <span className="underline">Register</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
