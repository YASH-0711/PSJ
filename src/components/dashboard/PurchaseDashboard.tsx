/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RefreshCw, IndianRupee, ShoppingBag, Users, TrendingUp } from "lucide-react";

import AdminLayout, { DashboardTheme } from "./AdminLayout";
import SearchBar from "./SearchBar";
import FilterSection, { Filters } from "./FilterSection";
import PurchaseTable from "./PurchaseTable";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { InvoiceRecord } from "./ActionButtons";

interface PurchaseDashboardProps {
  variant: DashboardTheme;
  apiBase: string; // e.g. "/api/invoice" or "/api/psjinvoice"
}

const EMPTY_FILTERS: Filters = { minAmount: "", maxAmount: "", startDate: "", endDate: "" };
const PER_PAGE = 10;

function StatCard({ label, value, icon: Icon, colorClass, bgClass }: { label: string; value: string; icon: any; colorClass: string; bgClass: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center ${colorClass} flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xl font-extrabold text-slate-800 leading-tight">{value}</div>
        <div className="text-xs text-slate-400 font-semibold mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function PurchaseDashboard({ variant, apiBase }: PurchaseDashboardProps) {
  const [allData, setAllData] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const [viewItem, setViewItem] = useState<InvoiceRecord | null>(null);
  const [editItem, setEditItem] = useState<InvoiceRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<InvoiceRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiBase);
      console.log(res.data, "@@@@1111");
      setAllData(res.data?.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Client-side filtering
  const filtered = allData.filter((row) => {
    const q = search.toLowerCase();
    const matchSearch = !search || row.customerName?.toLowerCase().includes(q) || row.customerContact?.includes(q);
    const matchMin = !filters.minAmount || row.total >= parseFloat(filters.minAmount);
    const matchMax = !filters.maxAmount || row.total <= parseFloat(filters.maxAmount);
    const matchStart = !filters.startDate || (row.date || "") >= filters.startDate;
    const matchEnd = !filters.endDate || (row.date || "") <= filters.endDate;
    return matchSearch && matchMin && matchMax && matchStart && matchEnd;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalRevenue = filtered.reduce((s, r) => s + (r.total || 0), 0);
  const totalItems = filtered.reduce((s, r) => s + (r.items?.length || 0), 0);
  const avgOrder = filtered.length ? totalRevenue / filtered.length : 0;

  const accent = variant === "psj"
    ? { text: "text-emerald-700", bg: "bg-emerald-100", btn: "bg-emerald-600 hover:bg-emerald-700 text-white", activePg: "bg-emerald-600" }
    : { text: "text-indigo-700", bg: "bg-indigo-100", btn: "bg-indigo-600 hover:bg-indigo-700 text-white", activePg: "bg-indigo-600" };

  const handleSave = async (id: string, data: Partial<InvoiceRecord>) => {
    setSaving(true);
    try {
      await axios.put(`${apiBase}/${id}`, data);
      toast.success("Record updated successfully");
      setEditItem(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update record");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      console.log(deleteItem,"@@@@")
      await axios.delete(`${apiBase}/${deleteItem._id}`);
      toast.success("Record deleted");
      setDeleteItem(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout variant={variant} activeTab="dashboard">
      <ViewModal item={viewItem} open={!!viewItem} onClose={() => setViewItem(null)} variant={variant} />
      <EditModal item={editItem} open={!!editItem} onClose={() => setEditItem(null)} onSave={handleSave} saving={saving} variant={variant} />
      <DeleteConfirmModal item={deleteItem} open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} deleting={deleting} />

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Purchase Records</h1>
        <p className="text-sm text-slate-400 mt-1">
          {variant === "psj" ? "PSJ Portal" : "Standard Portal"} ·{" "}
          <code className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600">{apiBase}</code>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Records" value={String(filtered.length)} icon={Users} colorClass={accent.text} bgClass={accent.bg} />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={IndianRupee} colorClass="text-amber-700" bgClass="bg-amber-100" />
        <StatCard label="Total Items" value={String(totalItems)} icon={ShoppingBag} colorClass="text-purple-700" bgClass="bg-purple-100" />
        <StatCard label="Avg Order" value={`₹${avgOrder.toFixed(2)}`} icon={TrendingUp} colorClass="text-sky-700" bgClass="bg-sky-100" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or phone..." variant={variant} />
          <FilterSection filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} onReset={() => { setFilters(EMPTY_FILTERS); setPage(1); }} variant={variant} />
          <button
            onClick={fetchData}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${accent.btn} transition-colors`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <PurchaseTable
          data={paged}
          loading={loading}
          onView={setViewItem}
          onEdit={setEditItem}
          onDelete={setDeleteItem}
          variant={variant}
        />

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-400">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === page ? `${accent.activePg} text-white` : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
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
