/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RefreshCw, Printer } from "lucide-react";

import AdminLayout, { DashboardTheme } from "./AdminLayout";
import SearchBar from "./SearchBar";
import SalesTable from "./SalesTable";
import { InvoiceRecord } from "./ActionButtons";

interface PurchaseDashboardProps {
  variant: DashboardTheme;
  apiBase: string;
}

export default function SalesDashboard({ variant, apiBase }: PurchaseDashboardProps) {
  const [allData, setAllData] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteItem, setDeleteItem] = useState<InvoiceRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiBase);
      setAllData(res.data?.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = allData.filter((row) => {
    const q = search.toLowerCase();
    return !search || row.customerName?.toLowerCase().includes(q) || row.customerContact?.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const accent = variant === "psj"
    ? { text: "text-emerald-700", bg: "bg-emerald-100", btn: "bg-emerald-600 hover:bg-emerald-700 text-white", activePg: "bg-emerald-600" }
    : { text: "text-indigo-700", bg: "bg-indigo-100", btn: "bg-indigo-600 hover:bg-indigo-700 text-white", activePg: "bg-indigo-600" };

  const handlePrint = () => {
    const printContent = filtered
      .map(
        (row, i) => `
        <tr style="background:${i % 2 === 1 ? "#f8fafc" : "#fff"}">
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#1e293b; font-weight:600;">${i + 1}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#1e293b; font-weight:600;">${row.customerName || "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569;">${row.customerContact || "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569; white-space:nowrap;">${row.date || "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569;">${row.totalGold ? `${row.totalGold}g` : "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569;">${row.totalSilver ? `${row.totalSilver}g` : "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569;">${row.oldPurchase ? `Rs.${Number(row.oldPurchase).toFixed(2)}` : "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569;">${row.cashPayment ? `Rs.${Number(row.cashPayment).toFixed(2)}` : "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#475569;">${row.onlinePayment ? `Rs.${Number(row.onlinePayment).toFixed(2)}` : "—"}</td>
          <td style="padding:7px 8px; border-bottom:1px solid #f1f5f9; color:#4338ca; font-weight:700;">Rs.${Number(row.total || 0).toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            @page { size: A4 landscape; margin: 12mm 10mm; }
            * { box-sizing: border-box; margin: 15px; padding: 0; }
            body { font-family: Arial, sans-serif; font-size: 11px; color: #1e293b; }
            h2 { font-size: 15px; font-weight: 700; color: #334155; margin-bottom: 4px; }
            p.sub { font-size: 10px; color: #94a3b8; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th {
              background: #f1f5f9;
              text-align: left;
              padding: 6px 8px;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #64748b;
              border-bottom: 2px solid #e2e8f0;
              white-space: nowrap;
            }
            tr:last-child td { border-bottom: none; }
            .footer { margin-top: 14px; font-size: 9px; color: #94a3b8; text-align: right; }
          </style>
        </head>
        <body>
          <h2>Sales Records</h2>
          <p class="sub">
            Generated on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            &nbsp;·&nbsp; ${filtered.length} record${filtered.length !== 1 ? "s" : ""}
          </p>
          <table>
            <thead>
              <tr>
                ${["#", "Customer Name", "Contact", "Date", "Gold (g)", "Silver (g)", "Old Purchase", "Cash", "Online", "Total"]
                  .map(h => `<th>${h}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>${printContent}</tbody>
          </table>
          <div class="footer">Printed from Sales Dashboard</div>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed; top:0; left:0; width:0; height:0; border:none; visibility:hidden;";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      iframe.contentWindow!.onafterprint = () => {
        document.body.removeChild(iframe);
      };
    };
  };


  return (
    <AdminLayout variant={variant} activeTab="sales">

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Sales Records</h1>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">

          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by name or phone..."
            variant={variant}
          />

          {/* Rows per page */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium">Rows:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Print */}
          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              variant === "psj"
                ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          {/* Refresh */}
          <button
            onClick={fetchData}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${accent.btn} transition-colors`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <SalesTable
          data={paged}
          loading={loading}
          variant={variant}
        />

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-400">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      p === page
                        ? `${accent.activePg} text-white`
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}