"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/Logo.png"
                alt="SplitTrack Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SplitTrack
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Features
            </a>
            <a href="#login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Login
            </a>
            <a
              href="#login"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
