/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Gem,
  Plus,
  Trash2,
  Printer,
  Save,
  LogOut,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BillingItem {
  id: number;
  itemName: string;
  quantity: number;
  purity: string;
  netWeight: number;
  grossWeight: number;
  amount: number; // net amount (97)
  discount: number; // discount (3)
}

type Variant = "default" | "psj";

type InvoicePageProps = {
  variant: Variant;
  saveApiUrl: string;
};

const themes: Record<
  Variant,
  {
    gradient: string;
    accentText: string;
    chipBg: string;
    buttonPrimary: string;
    buttonPrimaryHover: string;
  }
> = {
  default: {
    gradient: "bg-gradient-to-r from-slate-900 via-indigo-700 to-slate-800",
    accentText: "text-indigo-100",
    chipBg: "bg-indigo-500/20",
    buttonPrimary: "bg-indigo-600",
    buttonPrimaryHover: "hover:bg-indigo-700",
  },
  psj: {
    gradient: "bg-gradient-to-r from-emerald-800 via-emerald-600 to-lime-600",
    accentText: "text-emerald-50",
    chipBg: "bg-emerald-500/20",
    buttonPrimary: "bg-emerald-600",
    buttonPrimaryHover: "hover:bg-emerald-700",
  },
};

export default function InvoicePage({ variant, saveApiUrl }: InvoicePageProps) {
  const theme = themes[variant];

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [oldPurchase, setOldPurchase] = useState(0);
  const [disableAdd, setDisableAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState<BillingItem[]>([
    {
      id: 1,
      itemName: "",
      quantity: 0,
      purity: "",
      netWeight: 0,
      grossWeight: 0,
      amount: 0,
      discount: 0,
    },
  ]);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(today);
  }, []);

  const subTotal = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + Number(item.discount || 0),
    0
  );

  const cgst = Number((totalDiscount / 2).toFixed(3));
  const sgst = Number((totalDiscount / 2).toFixed(3));

  const grandTotal = Number(
    (subTotal + cgst + sgst - Number(oldPurchase || 0)).toFixed(3)
  );

  const handleItemChange = (
    id: number,
    field: keyof BillingItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        if (field === "amount") {
          const entered = Number(value) || 0;

          const discount = Number((entered * 0.03).toFixed(3));
          const netAmount = Number((entered - discount).toFixed(3));

          updated.amount = netAmount; // 97
          updated.discount = discount; // 3
        }

        return updated;
      })
    );
  };

  const addNewItem = () => {
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    if (items.length >= 5) {
      setDisableAdd(true);
      return;
    }
    setDisableAdd(false);
    const next = [
      ...items,
      {
        id: newId,
        itemName: "",
        quantity: 0,
        purity: "",
        netWeight: 0,
        grossWeight: 0,
        amount: 0,
        discount: 0
      },
    ];
    setItems(next);
    if (next.length >= 5) setDisableAdd(true);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    if (next.length < 5) setDisableAdd(false);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        customerName,
        customerAddress,
        customerContact,
        date: currentDate,
        oldPurchase,
        items,
        subTotal,
        grandTotal,
        mode: variant,
      };

      const res = await axios.post(saveApiUrl, payload);
      toast.success(res.data?.message || "Invoice saved");
    } catch (error: any) {
      console.log("Save error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to save invoice"
      );
    } finally {
      setSaving(false);
    }
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);

      toast.error(error.message);
    }
  };

  const format3 = (n: number) => Number(n || 0).toFixed(3);

  return (
    <>
      {/* MAIN PAGE UI (moderate, colorful) */}
      <div className="min-h-screen bg-slate-100 py-6 px-4 print:hidden">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white shadow-lg shadow-slate-200">
          {/* Colorful header */}
          <div
            className={`rounded-t-2xl px-6 py-4 ${theme.gradient} text-sm text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="h-6 w-6 text-yellow-300" />
                <div>
                  <h1
                    onClick={() =>
                      router.push(variant === "psj" ? "/" : "/psj")
                    }
                    className="cursor-default hover:cursor-pointer text-lg font-semibold tracking-tight"
                  >
                    Padamshree Jewellers
                  </h1>
                  <p className="text-[11px] opacity-80">
                    GST: 23FYYPS0128AIZE · +91 8770823751
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium ${theme.chipBg} ${theme.accentText}`}
                  >
                    {variant === "psj" ? "PSJ Dashboard" : "Standard Billing"}
                  </span>
                  <div className="mt-1 text-[11px] opacity-80">
                    Invoice Date: {currentDate || "—"}
                  </div>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 px-6 pb-6 pt-5">
            {/* Customer details */}
            <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span
                  className={`h-4 w-1 rounded-full ${theme.buttonPrimary}`}
                ></span>
                Customer Details
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1 text-sm">
                  <label className="text-xs font-medium text-slate-600">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <label className="text-xs font-medium text-slate-600">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    placeholder="Enter contact number"
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm md:col-span-2">
                  <label className="text-xs font-medium text-slate-600">
                    Address
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter address"
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                  />
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span
                    className={`h-4 w-1 rounded-full ${theme.buttonPrimary}`}
                  ></span>
                  Items
                </h2>
                <button
                  type="button"
                  disabled={disableAdd}
                  onClick={addNewItem}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                    disableAdd
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="text-slate-600">#</th>
                      <th className="text-slate-600">Particulars</th>
                      <th className="text-slate-600">Qty</th>
                      <th className="text-slate-600">Purity</th>
                      <th className="text-slate-600">Net Wt</th>
                      <th className="text-slate-600">Gross Wt</th>
                      <th className="text-slate-600">Amount (₹)</th>
                      <th className="text-center text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                        }
                      >
                        <td className="px-2 py-1.5 text-slate-700">
                          {index + 1}
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "itemName",
                                e.target.value
                              )
                            }
                            placeholder="Item name"
                            className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            value={item.quantity || ""}
                            min={0}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-right text-xs text-black"
                          />
                        </td>

                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="text"
                            value={item.purity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "purity",
                                e.target.value
                              )
                            }
                            className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-right text-xs text-black"
                          />
                        </td>

                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            value={item.netWeight || ""}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "netWeight",
                                Number(e.target.value)
                              )
                            }
                            min={0}
                            className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-right text-xs text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            value={item.grossWeight || ""}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "grossWeight",
                                Number(e.target.value)
                              )
                            }
                            min={0}
                            className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-right text-xs text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <input
                            type="number"
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                            className="w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-right text-xs text-black focus:outline-none focus:ring-1 focus:ring-slate-700"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            className={`inline-flex items-center justify-center rounded-md border px-1.5 py-1 ${
                              items.length === 1
                                ? "cursor-not-allowed border-slate-200 text-slate-300"
                                : "border-rose-200 text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Billing summary + actions */}
            <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span
                    className={`h-4 w-1 rounded-full ${theme.buttonPrimary}`}
                  ></span>
                  Billing Summary
                </h2>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Sub Total</span>
                  <span>₹{format3(subTotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>CGST (1.5%)</span>
                  <span>₹{format3(cgst)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>SGST (1.5%)</span>
                  <span>₹{format3(sgst)}</span>
                </div>

                <div className="flex justify-between text-rose-600">
                  <span>Old Purchase</span>
                  <span>- ₹{format3(oldPurchase)}</span>
                </div>

                <div className="mt-2 flex justify-between text-slate-600 text-sm font-semibold">
                  <span>Total Amount</span>
                  <span>₹{format3(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {/* SAVE */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white ${theme.buttonPrimary} ${theme.buttonPrimaryHover} disabled:cursor-not-allowed disabled:bg-slate-400`}
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Invoice"}
                </button>

                {/* PRINT */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Printer className="h-4 w-4" />
                  Print Invoice
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* COMMON PRINT COMPONENT – hidden on screen, shown only while printing */}
      <PrintBill
        customerName={customerName}
        customerAddress={customerAddress}
        customerContact={customerContact}
        currentDate={currentDate}
        oldPurchase={oldPurchase}
        items={items}
        subTotal={subTotal}
        total={grandTotal} 
        cgst={cgst} 
        sgst={sgst}      />
    </>
  );
}

/** PRINT-ONLY BILL COMPONENT (A5 landscape) */
type PrintBillProps = {
  customerName: string;
  customerAddress: string;
  customerContact: string;
  currentDate: string;
  oldPurchase: number;
  items: BillingItem[];
  subTotal: number;
  cgst: number;
  sgst: number;
  total: number;
};

function PrintBill({
  customerName,
  customerAddress,
  customerContact,
  currentDate,
  oldPurchase,
  items,
  subTotal,
  total,
  cgst,
  sgst
}: PrintBillProps) {
  const format3 = (num: number) => Number(num || 0).toFixed(3);

  return (
    <div
      className="bill-wrapper"
      aria-label="A5 bill print"
      style={{
        display: "none",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          padding: "6mm",
          width: "210mm",
          height: "148mm",
          boxSizing: "border-box",
          background: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            paddingTop: "50px",
          }}
        >
          {/* ---------------- HEADER ---------------- */}
          <div>
            <div
              style={{
                marginBottom: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Name: {customerName || "—"}
                </div>
                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "12px",
                    maxWidth: "80mm",
                    lineHeight: 1.2,
                    fontWeight: "bold",
                  }}
                >
                  Address: {customerAddress || "Address not set"}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px" }}>
                  <strong>Date:</strong> {currentDate || "—"}
                </div>
                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Mob: {customerContact || "—"}
                </div>
              </div>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
                marginTop: "4mm",
              }}
            >
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ width: "6mm" }}>#</td>
                  <td>Particular</td>
                  <td align="right">Qty</td>
                  <td align="right">Purity</td>
                  <td align="right">Net</td>
                  <td align="right">Gross</td>
                  <td align="right">Amount</td>
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.id}>
                    <td>{idx + 1}</td>
                    <td>{it.itemName}</td>
                    <td align="right">{it.quantity}</td>
                    <td align="right">{it.purity}</td>
                    <td align="right">{format3(it.netWeight)} gm</td>
                    <td align="right">{format3(it.grossWeight)} gm</td>
                    <td align="right">{format3(it.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------------- FOOTER ---------------- */}
          {/* ---------------- FOOTER ---------------- */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10mm",
              fontSize: "11px",
            }}
          >
            {/* LEFT – AMOUNT IN WORDS */}
            <div style={{ maxWidth: "120mm", fontWeight: "bold" }}>
              Amount (in words):
              <br />
              {numberToWords(total)}
            </div>

            {/* RIGHT – TOTALS */}
            <div style={{ textAlign: "right", minWidth: "60mm" }}>
              <div>Sub Total : ₹{format3(subTotal)}</div>
              <div>CGST @1.5% : ₹{format3(cgst)}</div>
              <div>SGST @1.5% : ₹{format3(sgst)}</div>
              <div>- Old Purchase : ₹{format3(oldPurchase)}</div>
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Total : ₹{format3(total)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function numberToWords(num: number): string {
  if (!num) return "Zero Rupees Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + " " + a[n % 10];
    if (n < 1000)
      return a[Math.floor(n / 100)] + " Hundred " + inWords(n % 100);
    if (n < 100000)
      return inWords(Math.floor(n / 1000)) + " Thousand " + inWords(n % 1000);
    if (n < 10000000)
      return inWords(Math.floor(n / 100000)) + " Lakh " + inWords(n % 100000);
    return (
      inWords(Math.floor(n / 10000000)) + " Crore " + inWords(n % 10000000)
    );
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 1000);

  return `${inWords(rupees).trim()} Rupees${
    paise ? " and " + inWords(paise) + " Paise" : ""
  } Only`;
}
