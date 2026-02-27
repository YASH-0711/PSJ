"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export interface Filters {
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
}

interface FilterSectionProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  variant?: "default" | "psj";
}

export default function FilterSection({
  filters,
  onChange,
  onReset,
  variant = "default",
}: FilterSectionProps) {
  const [open, setOpen] = useState(false);
  const active = Object.values(filters).some(Boolean);

  const accent =
    variant === "psj"
      ? { border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", ring: "focus:ring-emerald-400 focus:border-emerald-400" }
      : { border: "border-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700", btn: "bg-indigo-600 hover:bg-indigo-700", ring: "focus:ring-indigo-400 focus:border-indigo-400" };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
          active
            ? `${accent.border} ${accent.bg} ${accent.text}`
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters {active && <span className={`w-2 h-2 rounded-full ${variant === "psj" ? "bg-emerald-500" : "bg-indigo-500"}`} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 w-72 p-4">
            <div className="font-semibold text-sm text-slate-800 mb-3">Filter Records</div>
            {[
              { key: "minAmount", label: "Min Amount (₹)", type: "number" },
              { key: "maxAmount", label: "Max Amount (₹)", type: "number" },
              { key: "startDate", label: "From Date", type: "date" },
              { key: "endDate", label: "To Date", type: "date" },
            ].map(({ key, label, type }) => (
              <div key={key} className="mb-3">
                <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
                <input
                  type={type}
                  value={filters[key as keyof Filters] || ""}
                  onChange={(e) => onChange({ ...filters, [key]: e.target.value })}
                  className={`w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 ${accent.ring} transition-all`}
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { onReset(); setOpen(false); }}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white ${accent.btn} transition-colors`}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
