import { useEffect, useState } from "react";
import { ArrowUpRight, CreditCard, Search } from "lucide-react";
import { adminApi } from "../../api/AdminApi.js";

const fallbackPayments = [
  { id: "TXN-001", user: "Nguyễn Minh Anh", amount: 199000, gateway: "VNPAY", status: "Success", createdAt: "2026-05-01" },
  { id: "TXN-002", user: "Trần Quốc Huy", amount: 499000, gateway: "MOMO", status: "Pending", createdAt: "2026-05-03" },
  { id: "TXN-003", user: "Lê Thu Hà", amount: 299000, gateway: "VNPAY", status: "Failed", createdAt: "2026-05-07" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState(fallbackPayments);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    const loadPayments = async () => {
      try {
        const response = await adminApi.getAllPayments();

        if (!active || !response) return;

        const normalized = Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
            ? response.content
            : fallbackPayments;

        setPayments(
          normalized.map((item, index) => ({
            id: item.id ?? item.transactionId ?? `TXN-${String(index + 1).padStart(3, "0")}`,
            user: item.userName ?? item.fullName ?? item.username ?? "Unknown User",
            amount: item.amount ?? item.totalAmount ?? 0,
            gateway: item.gateway ?? item.paymentGateway ?? "VNPAY",
            status: item.status ?? "Success",
            createdAt: item.createdAt ?? item.paidAt ?? "2026-01-01",
          }))
        );
      } catch {
        if (active) setPayments(fallbackPayments);
      }
    };

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;

    return [payment.id, payment.user, payment.gateway, payment.status]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Payments</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Quản lý thanh toán</h2>
          </div>

          <label className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Tìm theo mã giao dịch, user, gateway..."
            />
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['Transaction', 'User', 'Amount', 'Gateway', 'Status', 'Date'].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{payment.id}</p>
                        <p className="text-xs text-slate-500">Payment record</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.user}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {payment.gateway}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status === "Success"
                          ? "bg-emerald-50 text-emerald-700"
                          : payment.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
