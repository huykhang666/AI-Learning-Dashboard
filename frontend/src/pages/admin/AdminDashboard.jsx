import { useEffect, useState } from "react";
import { Users, Layers3, Landmark, TrendingUp } from "lucide-react";
import { adminApi } from "../../api/AdminApi.js";

const fallbackMetrics = {
  totalUsers: 1280,
  totalSessions: 842,
  totalRevenue: 284500000,
};

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadMetrics = async () => {
      try {
        const response = await adminApi.getDashboardMetrics();

        if (!active || !response) return;

        setMetrics({
          totalUsers: response.totalUsers ?? response.userCount ?? fallbackMetrics.totalUsers,
          totalSessions:
            response.totalSessions ?? response.sessionCount ?? fallbackMetrics.totalSessions,
          totalRevenue:
            response.totalRevenue ?? response.revenue ?? fallbackMetrics.totalRevenue,
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
      label: "Tổng user",
      value: metrics.totalUsers.toLocaleString("vi-VN"),
      icon: Users,
      accent: "from-cyan-500 to-blue-500",
    },
    {
      label: "Tổng session",
      value: metrics.totalSessions.toLocaleString("vi-VN"),
      icon: Layers3,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Tổng doanh thu",
      value: formatCurrency(metrics.totalRevenue),
      icon: Landmark,
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
              Admin overview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Tổng quan hệ thống</h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
            <TrendingUp className="h-4 w-4" />
            {loading ? "Đang tải dữ liệu..." : "Dữ liệu đã sẵn sàng"}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${card.accent} p-3 text-white`}>
                <Icon className="h-5 w-5" />
              </div>

              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
