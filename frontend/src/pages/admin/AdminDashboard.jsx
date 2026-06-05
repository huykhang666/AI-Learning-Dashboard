import { useEffect, useState } from "react";
import { Landmark, Layers3, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../api/AdminApi.js";

const fallbackMetrics = {
  totalUsers: 0,
  totalSessions: 0,
  totalRevenue: 0,
};

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadMetrics = async () => {
      try {
        const response = await adminApi.getDashboardMetrics();

        if (!active || !response) return;

        setMetrics({
          totalUsers: response.totalUsers ?? fallbackMetrics.totalUsers,
          totalSessions: response.totalSessions ?? fallbackMetrics.totalSessions,
          totalRevenue: response.totalRevenue ?? fallbackMetrics.totalRevenue,
        });
      } catch {
        if (active) setMetrics(fallbackMetrics);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMetrics();

    return () => {
      active = false;
    };
  }, []);

  const statCards = [
    {
      label: t("admin.dashboard.stats.total_users"),
      value: metrics.totalUsers.toLocaleString("vi-VN"),
      icon: Users,
      accent: "from-cyan-500 to-blue-500",
    },
    {
      label: t("admin.dashboard.stats.total_sessions"),
      value: metrics.totalSessions.toLocaleString("vi-VN"),
      icon: Layers3,
      accent: "from-blue-500 to-cyan-500",
    },
    {
      label: t("admin.dashboard.stats.total_revenue"),
      value: formatCurrency(metrics.totalRevenue),
      icon: Landmark,
      accent: "from-sky-500 to-blue-700",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              <TrendingUp className="h-3.5 w-3.5" />
              {t("admin.dashboard.badge")}
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t("admin.dashboard.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {t("admin.dashboard.subtitle", {
                defaultValue: "Tổng hợp số liệu hệ thống: người dùng, phiên học và doanh thu.",
              })}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-700 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-sm">
            <TrendingUp className="h-4 w-4" />
            {loading ? t("admin.dashboard.loading") : t("admin.dashboard.ready")}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div
                className={`mb-5 inline-flex rounded-2xl bg-linear-to-br ${card.accent} p-3 text-white shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{card.value}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
