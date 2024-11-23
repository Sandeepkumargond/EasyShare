import Image from "next/image";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { GoArrowRight } from "react-icons/go";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div>
        
        <div className="relative w-full flex flex-col md:flex-row items-center justify-between text-black mt-16 px-4 md:px-12">
          <div className="space-y-9">
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-5 space-y-3 leading-10">
              
              <div className="flex flex-col space-y-2 text-center md:text-left md:max-w-[500px]">
                <h1 className="text-white font-bold text-[38px] font-loader">
                  EasyShare
                </h1>
                <span className="text-white text-[28px] font-normal mb-7">
                  Your Simple File Sharing Solution!
                </span>
                <p className="text-white text-[17px] md:text-left">
                  Easyshare is the easiest way to upload and share your
                  important documents and images. Whether it is a PDF for work
                  or an image to share with friends, EasyShare makes it simple
                  to upload, store, and share the link of the files in just a few
                  clicks.
                </p>
                <div className="flex justify-center md:justify-start">
                  <Link href="/dashboard">
                    <button className="bg-blue-600 text-white p-4 font-semibold rounded-[8px] w-[148px] h-[44px] flex justify-center items-center hover:bg-cyan-500 gap-2 cursor-pointer transition-all duration-300">
                      Try for Free <GoArrowRight />
                    </button>
                  </Link>
                </div>
              </div>

             
              <div className="hidden md:block">
                <Image
                  src={"/Frame.png"}
                  alt="laptop"
                  width={500}
                  height={600}
                  className="mx-auto ml-32 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <footer className="mt-auto py-4 text-center text-slate-400 text-sm">
        © 2024 EasyShare. All rights reserved.
      </footer>
    </div>
  );
}
