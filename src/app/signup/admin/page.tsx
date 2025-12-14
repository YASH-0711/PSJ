"use client";

import React from "react";
import SignupForm from "@/components/auth/SignupFormBase";
import Link from "next/link";

const AdminSignupPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
          <SignupForm
            title="Admin Signup"
            apiUrl="/api/users/signup/admin"
            fields={[
              {
                name: "username",
                label: "Admin Name",
                placeholder: "Enter admin name",
              },
              {
                name: "email",
                label: "Work Email",
                type: "email",
                placeholder: "admin@company.com",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "Enter password",
              }
            ]}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Visit login page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSignupPage;
