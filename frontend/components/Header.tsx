"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    // Redirection is handled within the logout function in AuthContext
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-purple-500/20 text-white shadow-2xl py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link href="/" className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 transition duration-300">
          ✨ TODO AI
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center space-x-6">
            <span className="hidden sm:inline-block text-sm font-medium text-gray-300">
              Logged in as <span className="text-purple-400 font-bold">{user?.name}</span>
            </span>
            <button
              onClick={handleSignOut}
              className="px-5 py-2 bg-linear-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 rounded-xl text-sm font-bold transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg shadow-pink-900/20"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 border border-purple-500 text-purple-400 rounded-xl font-bold hover:bg-purple-500/10 transition duration-300"
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition duration-300 transform hover:scale-105 shadow-xl shadow-purple-900/20"
            >
              SIGN UP
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
