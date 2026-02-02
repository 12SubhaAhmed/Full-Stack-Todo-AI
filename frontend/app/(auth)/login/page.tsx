"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); // Redirect if already logged in
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // Redirection is handled within the login function in AuthContext
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 p-4 relative overflow-hidden">
      {/* Neon glowing effect background */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        background: 'radial-gradient(circle at 15% 50%, #8A2BE2 0%, transparent 50%), radial-gradient(circle at 85% 50%, #4B0082 0%, transparent 50%), radial-gradient(circle at 50% 100%, #6A0DAD 0%, transparent 50%)',
      }}></div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 border border-purple-500/30 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            WELCOME BACK
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium tracking-wide">Enter your credentials to access your tasks</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 ml-1">
              EMAIL ADDRESS
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition duration-200"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2 ml-1">
              PASSWORD
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 text-center font-medium bg-red-900/20 py-2 rounded-lg border border-red-500/20">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              SIGN IN
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-400 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-purple-400 hover:text-purple-300 transition-colors">
              SIGN UP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
