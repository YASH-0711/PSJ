"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export interface InvoiceRecord {
  _id: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  date: string;
  total: number;
  subTotal: number;
  oldPurchase: number;
  items: Array<{
    itemName: string;
    quantity: number;
    purity: string;
    netWeight: number;
    grossWeight: number;
    amount: number;
    discount: number;
  }>;
  mode: string;
  createdAt: string;
}

interface ActionButtonsProps {
  row: InvoiceRecord;
  onView: (row: InvoiceRecord) => void;
  onEdit: (row: InvoiceRecord) => void;
  onDelete: (row: InvoiceRecord) => void;
  variant?: "default" | "psj";
}

export default function ActionButtons({
  row,
  onView,
  onEdit,
  onDelete,
}: ActionButtonsProps) {
  const actions = [
    { icon: Eye, label: "View", action: () => onView(row), color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" },
    { icon: Pencil, label: "Edit", action: () => onEdit(row), color: "text-amber-600 bg-amber-50 hover:bg-amber-100" },
    { icon: Trash2, label: "Delete", action: () => onDelete(row), color: "text-rose-600 bg-rose-50 hover:bg-rose-100" },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {actions.map(({ icon: Icon, label, action, color }) => (
        <button
          key={label}
          onClick={action}
          title={label}
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${color} transition-all hover:scale-110`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}
