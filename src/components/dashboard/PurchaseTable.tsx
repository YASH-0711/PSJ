"use client";

import { Loader2 } from "lucide-react";
import ActionButtons, { InvoiceRecord } from "./ActionButtons";

interface PurchaseTableProps {
  data: InvoiceRecord[];
  loading: boolean;
  onView: (row: InvoiceRecord) => void;
  onEdit: (row: InvoiceRecord) => void;
  onDelete: (row: InvoiceRecord) => void;
  variant?: "default" | "psj";
}

const themeAccent = {
  default: { text: "text-indigo-700", hover: "hover:bg-indigo-50/60" },
  psj: { text: "text-emerald-700", hover: "hover:bg-emerald-50/60" },
};

export default function PurchaseTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  variant = "default",
}: PurchaseTableProps) {
  const accent = themeAccent[variant];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className={`w-8 h-8 animate-spin ${accent.text}`} />
        <span className="text-sm text-slate-400">Loading records...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <div className="text-5xl">📭</div>
        <div className="text-base font-semibold text-slate-500">No records found</div>
        <div className="text-sm text-slate-400">Try adjusting your search or filters</div>
      </div>
    );
  }

  const cols = [
    "Customer Name",
    "Phone",
    "Amount (₹)",
    "Items",
    "Date",
    "Mode",
    "Actions",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            {cols.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b-2 border-slate-100 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row._id}
              className={`border-b border-slate-50 transition-colors ${accent.hover} ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}
            >
              <td className="px-4 py-3 font-semibold text-slate-800">{row.customerName || "—"}</td>
              <td className="px-4 py-3 text-slate-500">{row.customerContact || "—"}</td>
              <td className={`px-4 py-3 font-bold ${accent.text}`}>
                ₹{Number(row.total || 0).toFixed(3)}
              </td>
              <td className="px-4 py-3 text-slate-500">{row.items?.length ?? 0} item{(row.items?.length ?? 0) !== 1 ? "s" : ""}</td>
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.date || "—"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  row.mode === "psj"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}>
                  {row.mode || "default"}
                </span>
              </td>
              <td className="px-4 py-3">
                <ActionButtons
                  row={row}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  variant={variant}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
