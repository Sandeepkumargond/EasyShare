"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import { ClipLoader } from "react-spinners"; // Import a spinner from react-spinners

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const router = useRouter(); 

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }
  
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const startTime = Date.now();
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("API Response Time:", Date.now() - startTime, "ms");
  
      if (res?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Login successful!");
        router.replace("/dashboard"); // Navigate immediately
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
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
              className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md hover:bg-blue-400 w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <ClipLoader color="#fff" size={20} /> Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <Link
              className="text-sm mt-3 text-right text-white"
              href={"/register"}
            >
              Do not have an account? <span className="underline">Register</span>
            </Link>
          </form>
        </div>
      </div>

      {/* ToastContainer component to render toast notifications */}
      <ToastContainer />
    </div>
  );
}
