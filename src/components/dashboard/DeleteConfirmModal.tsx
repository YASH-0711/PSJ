"use client";

import { AlertTriangle, X } from "lucide-react";
import { InvoiceRecord } from "./ActionButtons";

interface DeleteConfirmModalProps {
  item: InvoiceRecord | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleting: boolean;
}

export default function DeleteConfirmModal({ item, open, onClose, onConfirm, deleting }: DeleteConfirmModalProps) {
  if (!open || !item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center" onClick={(e) => e.stopPropagation()} style={{ animation: "modalIn 0.2s ease" }}>
        <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-rose-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Record?</h2>
        <p className="text-sm text-slate-500 mb-1">This will permanently remove the invoice for:</p>
        <p className="text-sm font-bold text-slate-800 mb-5">{item.customerName} <span className="font-normal text-slate-400">({item.date})</span></p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white ${deleting ? "bg-rose-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"} transition-colors`}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
