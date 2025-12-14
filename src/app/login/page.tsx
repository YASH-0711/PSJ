/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      const resData = response.data.data;
      console.log(response,"@@@@ ")
      toast.success("Login success");
      if(resData.isClient){
        router.push("/");
      }
      // if(resData.isAdminPSJ){

      // }else if(resData.isAdmin){

      // }else if(resData.isClient){
      //   router.push("/");
      // }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">
          {loading ? "Processing..." : "Login"}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Welcome back! Please enter your credentials to continue.
        </p>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="you@example.com"
            className="mb-4 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700 text-black"
          />

          <label
            htmlFor="password"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            className="mb-4 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700 text-black"
          />

          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className={`mt-2 w-full rounded-lg p-2 text-sm font-semibold text-white ${
              buttonDisabled || loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gray-900 hover:bg-black"
            }`}
          >
            {buttonDisabled
              ? "Fill all fields"
              : loading
              ? "Logging in..."
              : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Visit signup page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
