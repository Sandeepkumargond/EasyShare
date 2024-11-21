'use client';
import Image from "next/image";
import React, { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="w-full bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logoo.png"
              alt="EasyShare Logo"
              width={60}
              height={60}
            />
            <span className="ml-2 text-lg font-bold text-white">EasyShare</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-4">
            <a
              href="/"
              className="text-white px-4 py-2 hover:bg-black rounded-md transition"
            >
              Home
            </a>
            <a
              href="/register"
              className="text-white px-4 py-2 hover:bg-black rounded-md transition"
            >
              Sign up
            </a>
            <a
              href="/login"
              className="text-white px-4 py-2 hover:bg-black rounded-md transition"
            >
              Login
            </a>
            <a
              href="/contact"
              className="text-white px-4 py-2 hover:bg-black rounded-md transition"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} aria-label="Toggle navigation">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div
          className={`md:hidden bg-gray-800 text-white flex flex-col space-y-4 py-4 px-6 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <a
            href="/"
            className="px-4 py-2 hover:bg-black rounded-md transition"
          >
            Home
          </a>
          <a
            href="/register"
            className="px-4 py-2 hover:bg-black rounded-md transition"
          >
            Sign In
          </a>
          <a
            href="/login"
            className="px-4 py-2 hover:bg-black rounded-md transition"
          >
            Login
          </a>
          <a
            href="/contact"
            className="px-4 py-2 hover:bg-black rounded-md transition"
          >
            Contact Us
          </a>
        </div>
      </nav>
    </>
  );
}
