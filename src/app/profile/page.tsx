/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);

      toast.error(error.message);
    }
  };

  const getUSerData = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res, "user data");
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile pahe</h1>
      <h2 className="p-1 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />

      <button
        onClick={getUSerData}
        className="bg-purple-500 mt-4 text-white font-bold py-2 px-4 rounded"
      >
        Get User Data
      </button>
      <hr />

      <button
        onClick={logout}
        className="bg-blue-500 mt-4 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
