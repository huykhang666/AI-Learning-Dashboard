import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../common/LanguageSwitcher";
import {
  LayoutDashboard,
  Menu,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  X,
  BookOpen,
} from "lucide-react";

const navigation = [
  { key: "dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { key: "courses", to: "/admin/courses", icon: BookOpen },
  { key: "users", to: "/admin/users", icon: Users },
  { key: "payments", to: "/admin/payments", icon: CreditCard },
];

export default function AdminLayout({ onLogout }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/admin/dashboard")) return t("admin.layout.titles.dashboard");
    if (location.pathname.startsWith("/admin/courses")) return t("admin.layout.titles.courses", { defaultValue: "Quản lý khóa học" });
    if (location.pathname.startsWith("/admin/users")) return t("admin.layout.titles.users");
    if (location.pathname.startsWith("/admin/payments")) return t("admin.layout.titles.payments");
    return t("admin.layout.titles.dashboard");
  }, [location.pathname, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 text-gray-900">
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/35 backdrop-blur-[1px] lg:hidden"
          aria-label={t("admin.layout.aria.close_overlay")}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-100 bg-white/95 shadow-sm transition-transform duration-200 backdrop-blur lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                {t("admin.layout.brand_tag")}
              </p>
              <h2 className="text-base font-bold text-gray-900">{t("admin.layout.brand_name")}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition hover:border-blue-200 hover:text-blue-700 lg:hidden"
            aria-label={t("admin.layout.aria.close_sidebar")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map(({ key, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-700 to-cyan-500 text-white shadow-md shadow-blue-700/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-700",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t(`admin.layout.navigation.${key}`, { defaultValue: key === "courses" ? "Quản lý khóa học" : "" })}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-5">
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              {t("admin.layout.workspace_tag")}
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {t("admin.layout.workspace_description")}
            </p>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
                aria-label={t("admin.layout.aria.open_sidebar")}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                  {t("admin.layout.area_tag")}
                </p>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("admin.layout.logout")}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

