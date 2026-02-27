"use client";

import { X } from "lucide-react";
import { InvoiceRecord } from "./ActionButtons";

interface ViewModalProps {
  item: InvoiceRecord | null;
  open: boolean;
  onClose: () => void;
  variant?: "default" | "psj";
}

export default function ViewModal({ item, open, onClose, variant = "default" }: ViewModalProps) {
  if (!open || !item) return null;

  const gradient =
    variant === "psj"
      ? "from-emerald-800 via-emerald-600 to-lime-600"
      : "from-slate-900 via-indigo-700 to-slate-800";

  const fmt = (n: number) => Number(n || 0).toFixed(3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradient} rounded-t-2xl p-5 text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-bold">{item.customerName || "—"}</div>
              <div className="text-white/70 text-xs mt-1">{item.customerContact}</div>
              <div className="text-white/60 text-xs mt-0.5">{item.customerAddress}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold">₹{fmt(item.total)}</div>
              <div className="text-white/60 text-xs mt-1">Grand Total</div>
              <button onClick={onClose} className="mt-2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Date", value: item.date },
              { label: "Sub Total", value: `₹${fmt(item.subTotal)}` },
              { label: "Old Purchase", value: `₹${fmt(item.oldPurchase)}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400 font-semibold mb-1">{label}</div>
                <div className="text-sm font-bold text-slate-700">{value || "—"}</div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Items</div>
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {["#", "Item", "Qty", "Purity", "Net Wt", "Gross Wt", "Amount"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-slate-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(item.items || []).map((it, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50/60" : ""}>
                    <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-700">{it.itemName || "—"}</td>
                    <td className="px-3 py-2 text-slate-500">{it.quantity}</td>
                    <td className="px-3 py-2 text-slate-500">{it.purity}</td>
                    <td className="px-3 py-2 text-slate-500">{Number(it.netWeight || 0).toFixed(3)} g</td>
                    <td className="px-3 py-2 text-slate-500">{Number(it.grossWeight || 0).toFixed(3)} g</td>
                    <td className="px-3 py-2 font-semibold text-slate-700">₹{Number(it.amount || 0).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
