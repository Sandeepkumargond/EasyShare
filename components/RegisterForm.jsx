"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <>
      <Navbar />
     
      <div className="grid place-items-center h-screen bg-slate-900 px-4 sm:px-0">
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-blue-500 bg-slate-800 w-full max-w-md sm:w-full">
          <h1 className="text-xl font-bold my-4 text-white text-center">Register</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
            />
            <input
              className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
            />
            <input
              className="px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <button className="bg-blue-600 hover:bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 rounded-md w-full">
              Register
            </button>

            {error && (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <Link className="text-sm mt-3 text-right text-white" href={"/"}>
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
