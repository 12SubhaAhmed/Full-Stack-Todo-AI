"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-3xl font-extrabold text-purple-400 hover:text-purple-300 transition duration-300">
          ✨ Todo App
        </Link>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-6 py-2 border-2 border-purple-500 text-purple-400 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition duration-300 transform hover:scale-105 shadow-md"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
