"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";
import { ToastContainer, toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import { ClipLoader } from "react-spinners"; // Import the spinner from react-spinners
import { signIn } from "next-auth/react"; // Import signIn for automatic login

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading icon

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are necessary."); // Use toastify for error
      return;
    }

    try {
      setLoading(true); // Show loading icon

      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        toast.error("User already exists."); // Use toastify for error
        setLoading(false); // Hide loading icon
        return;
      }

      // Register the user
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
        toast.success("Successfully registered! Logging you in...");

        // Automatically log in the user
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          toast.error("Login failed. Please try logging in manually.");
          setLoading(false);
          return;
        }

        // Redirect to the dashboard
        router.replace("/dashboard");
      } else {
        toast.error("User registration failed."); // Use toastify for error
      }
    } catch (error) {
      toast.error("Error during registration: " + error.message); // Use toastify for error
    } finally {
      setLoading(false); // Hide loading icon
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
              value={name}
            />
            <input
              className="px-4 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              value={email}
            />
            <input
              className="px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              value={password}
            />
            <button
              className="bg-blue-600 hover:bg-blue-400 text-white font-bold cursor-pointer px-6 py-2 rounded-md w-full"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <ClipLoader color="#fff" size={20} /> Registering...
                </div>
              ) : (
                "Register"
              )}
            </button>

            <Link className="text-sm mt-3 text-right text-white" href={"/"}>
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>

      {/* ToastContainer component to render toast notifications */}
      <ToastContainer />
    </>
  );
}
