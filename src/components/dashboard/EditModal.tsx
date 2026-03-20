/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { InvoiceRecord } from "./ActionButtons";

type EditableItem = {
  itemName: string;
  quantity: number;
  purity: string;
  netWeight: number;
  grossWeight: number;
  amount: number;
  discount: number;
};

interface EditModalProps {
  item: InvoiceRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<InvoiceRecord>) => Promise<void>;
  saving: boolean;
  variant?: "default" | "psj";
}

export default function EditModal({ item, open, onClose, onSave, saving, variant = "default" }: EditModalProps) {
  const [items, setItems] = useState<EditableItem[]>([]);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    if (item) {
      setItems(
        (item.items || []).map((it) => ({
          itemName: it.itemName || "",
          quantity: it.quantity || 0,
          purity: it.purity || "",
          netWeight: it.netWeight || 0,
          grossWeight: it.grossWeight || 0,
          amount: it.amount || 0,
          discount: it.discount || 0,
        }))
      );
      setSubTotal(item.subTotal || 0);
    }
  }, [item]);

  if (!open || !item) return null;

  const accent =
    variant === "psj"
      ? { btn: "bg-emerald-600 hover:bg-emerald-700", ring: "focus:ring-emerald-400 focus:border-emerald-400", header: "from-emerald-800 via-emerald-600 to-lime-600" }
      : { btn: "bg-indigo-600 hover:bg-indigo-700", ring: "focus:ring-indigo-400 focus:border-indigo-400", header: "from-slate-900 via-indigo-700 to-slate-800" };

  const handleItemChange = (index: number, field: keyof EditableItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      // Auto-recalculate discount when amount changes
      // if (field === "amount") {
      //   const entered = Number(value) || 0;
      //   // row.discount = Number((entered * 0.03).toFixed(3));
      //   // row.amount = Number((entered - row.discount).toFixed(3));
      // }

      updated[index] = row;

      // Recalculate subTotal
      const newSubTotal = updated.reduce((s, r) => s + (Number(r.amount) || 0), 0);
      setSubTotal(Number(newSubTotal.toFixed(3)));

      return updated;
    });
  };

  const handleSave = () => {
    onSave(item._id, { items, subTotal });
  };

  const inputCls = `w-full px-1.5 py-1 border border-slate-200 rounded-lg text-xs text-black focus:outline-none focus:ring-1 ${accent.ring} transition-all bg-white`;

  const cols = ["#", "Item Name", "Qty", "Purity", "Net Wt", "Gross Wt", "Amount (₹)"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${accent.header} rounded-t-2xl px-6 py-4 flex items-center justify-between`}>
          <div>
            <h2 className="text-base font-bold text-white">Edit Items</h2>
            <p className="text-white/60 text-xs mt-0.5">{item.customerName} · {item.date}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50">
                  {cols.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                    <td className="px-3 py-2 text-slate-400 font-semibold">{i + 1}</td>
                    <td className="px-2 py-1.5 min-w-[120px]">
                      <input
                        type="text"
                        value={it.itemName}
                        onChange={(e) => handleItemChange(i, "itemName", e.target.value)}
                        className={inputCls}
                        placeholder="Item name"
                      />
                    </td>
                    <td className="px-2 py-1.5 w-16">
                      <input
                        type="number"
                        value={it.quantity || ""}
                        min={0}
                        onChange={(e) => handleItemChange(i, "quantity", Number(e.target.value))}
                        className={inputCls + " text-right"}
                      />
                    </td>
                    <td className="px-2 py-1.5 w-20">
                      <input
                        type="text"
                        value={it.purity}
                        onChange={(e) => handleItemChange(i, "purity", e.target.value)}
                        className={inputCls}
                        placeholder="e.g. 22K"
                      />
                    </td>
                    <td className="px-2 py-1.5 w-24">
                      <input
                        type="number"
                        value={it.netWeight || ""}
                        min={0}
                        // step={0.001}
                        onChange={(e) => handleItemChange(i, "netWeight", Number(e.target.value))}
                        className={inputCls + " text-right"}
                      />
                    </td>
                    <td className="px-2 py-1.5 w-24">
                      <input
                        type="number"
                        value={it.grossWeight || ""}
                        min={0}
                        // step={0.001}
                        onChange={(e) => handleItemChange(i, "grossWeight", Number(e.target.value))}
                        className={inputCls + " text-right"}
                      />
                    </td>
                    <td className="px-2 py-1.5 w-28">
                      <input
                        type="number"
                        value={it.amount || ""}
                        min={0}
                        // step={0.001}
                        onChange={(e) => handleItemChange(i, "amount", Number(e.target.value))}
                        className={inputCls + " text-right font-semibold"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sub Total */}
          <div className="mt-4 flex justify-end">
            <div className="bg-slate-50 rounded-xl px-5 py-3 flex items-center gap-6 border border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Sub Total</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  value={subTotal || ""}
                  min={0}
                  // step={0.001}
                  onChange={(e) => setSubTotal(Number(e.target.value))}
                  className={`w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 text-right focus:outline-none focus:ring-2 ${accent.ring} bg-white`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white ${accent.btn} transition-colors ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
