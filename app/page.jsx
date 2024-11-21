import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import { GoArrowRight } from "react-icons/go";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <div >
          {/* Section 01 */}
          <div className="relative w-full flex flex-col md:flex-row  items-center justify-between text-black mt-16">
            <div className="mx-12 space-y-9">
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-5 space-y-3 leading-10">
                {/* Left side */}
                <div className="flex flex-col space-y-2 text-center md:text-left">
                  <h1 className=" text-white font-bold text-[38px] font-loader">
                    EasyShare
                  </h1>
                  <span className="text-blue-400 text-[28px] md:ml-16 font-normal mb-7">
                  Your Simple File Sharing Solution!
                  </span>
                  <div>
                    <p className="w-full text-white max-w-[500px] text-[17px]">
                    Easyshare is the easiest way to upload and share your important documents and images. Whether it's a PDF for work or an image to share with friends, EasyShare makes it simple to upload, store, and share link of the files in just a few clicks.
                    </p>
                  </div>
                  <div className="flex justify-center text-white md:justify-start">
                    <button  className=" bg-blue-600 text-white p-4 font-semibold rounded-[8px] w-[148px] h-[44px] flex justify-center items-center hover:bg-cyan-500 gap-2 cursor-pointer transition-all duration-300">
                     <a href="/dashboard"> Try for Free</a> <GoArrowRight />
                     
                    </button>
                  </div>
                </div>

                {/* Right side */}
                <div>
                  <Image
                    src={"/Frame.png"}
                    alt="laptop"
                    width={500}
                    height={600}
                    className=" md:mx-20 mx-0 h-auto"
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
