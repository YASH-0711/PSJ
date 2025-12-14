/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

type SignupFormProps = {
  title: string;                     // Header: "Client Signup", "Admin Signup", etc.
  apiUrl: string;                    // e.g. "/api/users/signup/client"
  fields: FieldConfig[];
};

const SignupForm: React.FC<SignupFormProps> = ({ title, apiUrl, fields }) => {
  const router = useRouter();

  const [values, setValues] = useState<Record<string, string>>(
    () =>
      fields.reduce(
        (acc, field) => ({ ...acc, [field.name]: "" }),
        {} as Record<string, string>
      )
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    // Disable if any field empty
    const allFilled = fields.every((f) => newValues[f.name]?.trim().length > 0);
    setButtonDisabled(!allFilled);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(apiUrl, values);
      toast.success(res.data?.message || "Signup successful");

      // optional: redirect to login
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6"> */}
        {/* HEADER (different per role) */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {loading ? "Loading..." : title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Please fill in the details to create your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label
                htmlFor={field.name}
                className="mb-1 text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="p-2 border text-blue-600 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black-600 text-sm"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`mt-2 p-2 rounded-lg text-sm font-semibold text-white
              ${
                buttonDisabled || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
          >
            {buttonDisabled
              ? "Fill all fields"
              : loading
              ? "Submitting..."
              : "Sign Up"}
          </button>
        </form>


      {/* </div>
    </div> */}
    </>
  );
};

export default SignupForm;
