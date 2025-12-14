"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">
          Choose Signup Type
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Please select which type of account you want to create.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/signup/client"
            className="w-full text-center p-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
          >
            Client Signup
          </Link>

          <Link
            href="/signup/admin"
            className="w-full text-center p-2 rounded-lg bg-gray-800 text-white text-sm font-semibold hover:bg-black"
          >
            Admin Signup
          </Link>

          <Link
            href="/signup/admin-psj"
            className="w-full text-center p-2 rounded-lg bg-gray-700 text-white text-sm font-semibold hover:bg-black"
          >
            Admin / PSJ Signup
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Visit login page
          </Link>
        </div>
      </div>
    </div>
  );
}
