"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Menu,
  X,
  Gem,
  ChevronRight,
} from "lucide-react";

export type DashboardTheme = "default" | "psj";

const themeConfig = {
  default: {
    label: "Standard Portal",
    sidebarGradient: "from-slate-900 via-indigo-900 to-slate-900",
    activeItem: "bg-indigo-600",
    hoverItem: "hover:bg-indigo-500/20",
    accentColor: "text-indigo-300",
    accentBorder: "border-indigo-500/30",
    badge: "bg-indigo-500/20 text-indigo-200",
    headerGradient: "from-slate-900 via-indigo-700 to-slate-800",
    dotColor: "bg-indigo-400",
    switchRoute: "/psj/dashboard",
    switchLabel: "PSJ Portal",
    billingRoute: "/",
    billingLabel: "Standard Billing",
  },
  psj: {
    label: "PSJ Portal",
    sidebarGradient: "from-emerald-950 via-emerald-900 to-slate-900",
    activeItem: "bg-emerald-600",
    hoverItem: "hover:bg-emerald-500/20",
    accentColor: "text-emerald-300",
    accentBorder: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-200",
    headerGradient: "from-emerald-800 via-emerald-600 to-lime-600",
    dotColor: "bg-emerald-400",
    switchRoute: "/dashboard",
    switchLabel: "Standard Portal",
    billingRoute: "/psj",
    billingLabel: "PSJ Billing",
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
  variant: DashboardTheme;
  activeTab?: "dashboard" | "sales";
}

export default function AdminLayout({
  children,
  variant,
  activeTab = "dashboard",
}: AdminLayoutProps) {
  const theme = themeConfig[variant];
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

const navItems = [
  {
    id: "dashboard",
    label: "Purchase Records",
    icon: LayoutDashboard,
    route: variant === "psj" ? "/psj/dashboard" : "/dashboard",
  },
  {
    id: "sales",
    label: "Sales Records",
    icon: LayoutDashboard,
    route: variant === "psj" ? "/psj/sales" : "/sales", // ✅ FIXED
  },
  {
    id: "billing",
    label: theme.billingLabel,
    icon: FileText,
    route: theme.billingRoute,
  },
];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b ${theme.sidebarGradient} flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        } flex-shrink-0`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b ${theme.accentBorder} overflow-hidden`}
        >
          <div
            className={`bg-gradient-to-br ${theme.headerGradient} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}
          >
            <Gem className="w-5 h-5 text-yellow-300" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm leading-tight whitespace-nowrap"
              onClick={() => router.push(theme.switchRoute)}
              >
                Padamshree
              </div>
              <div className={`text-xs ${theme.accentColor} whitespace-nowrap`}>
                {theme.label}
              </div>
            </div>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center py-3 text-slate-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.route)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium overflow-hidden ${
                  isActive
                    ? `${theme.activeItem} text-white`
                    : `text-slate-300 ${theme.hoverItem} hover:text-white`
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {sidebarOpen && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Switch Portal */}
        {/* {sidebarOpen && (
          <div className={`px-3 py-3 border-t ${theme.accentBorder}`}>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
              Switch Portal
            </div>
            <button
              onClick={() => router.push(theme.switchRoute)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 ${theme.hoverItem} hover:text-white transition-all`}
            >
              <div className={`w-2 h-2 rounded-full ${theme.dotColor}`} />
              {theme.switchLabel}
            </button>
          </div>
        )} */}

        {/* Logout */}
        <div className={`px-3 py-4 border-t ${theme.accentBorder}`}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 transition-all overflow-hidden ${
              loggingOut ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className={`bg-gradient-to-r ${theme.headerGradient} px-6 py-3.5 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}>
              {theme.label}
            </span>
            <span className="text-white/60 text-sm">Purchase Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.headerGradient} border-2 border-white/30 flex items-center justify-center text-white font-bold text-xs`}
            >
              {variant === "psj" ? "P" : "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
