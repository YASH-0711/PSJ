"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  variant?: "default" | "psj";
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  variant = "default",
}: SearchBarProps) {
  const focusRing =
    variant === "psj"
      ? "focus:ring-emerald-400 focus:border-emerald-400"
      : "focus:ring-indigo-400 focus:border-indigo-400";

  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-black focus:outline-none focus:ring-2 ${focusRing} transition-all`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
