import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-lg font-extrabold text-purple-400">Todo App</p>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Todo App. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-6">
          <Link href="#" className="hover:text-purple-300 transition duration-300">
            Twitter
          </Link>
          <Link href="#" className="hover:text-purple-300 transition duration-300">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
