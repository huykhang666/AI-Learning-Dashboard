import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
];

const titleMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "User Management",
  "/admin/payments": "Payment Management",
};

export default function AdminLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    if (titleMap[location.pathname]) {
      return titleMap[location.pathname];
    }

    if (location.pathname.startsWith("/admin/users")) return "User Management";
    if (location.pathname.startsWith("/admin/payments")) return "Payment Management";
    return "Admin Dashboard";
  }, [location.pathname]);

  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Control Center</p>
            <h2 className="text-base font-semibold text-white">AI Learning Admin</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <div className="rounded-2xl bg-slate-900/80 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Admin workspace</p>
          <p className="mt-1 leading-6 text-slate-400">
            Quản lý dashboard, user và giao dịch thanh toán trong một giao diện tập trung.
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      {sidebar}

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin area</p>
                <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">{pageTitle}</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
