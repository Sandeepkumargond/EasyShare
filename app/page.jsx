import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex flex-col">
      <Navbar/>
      
      <header className="flex-grow bg-slate-900 flex flex-col items-center justify-center text-center px-4">
        <Image
          src="/logo.png"
          alt="FileDrive Icon"
          width={120}
          height={120}
          className="mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          The easiest way to upload and share the files link with your company
        </h1>
        <p className="mt-4 text-white text-lg">
          Make an account and start managing your files in less than a minute.
        </p>
      </header>
    </div>
  );
}
