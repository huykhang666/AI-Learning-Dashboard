import { useEffect, useState } from "react";
import { ArrowUpRight, CreditCard, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../api/AdminApi.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
}

const statusMap = {
  SUCCESS: "Success",
  PENDING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export default function PaymentManagement() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [gatewayFilter, setGatewayFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getStatusLabel = (status) => {
    const normalizedStatus = statusMap[status] || status;
    switch (normalizedStatus) {
      case "Success":
        return t("admin.payment_management.status.success");
      case "Pending":
        return t("admin.payment_management.status.pending");
      case "Failed":
        return t("admin.payment_management.status.failed");
      case "Cancelled":
        return t("admin.payment_management.status.cancelled", { defaultValue: "Cancelled" });
      default:
        return normalizedStatus;
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("pageSize", pageSize);
      if (statusFilter) params.append("status", statusFilter);
      if (gatewayFilter) params.append("gateway", gatewayFilter);

      const response = await adminApi.getPaymentsPaginated(params);

      if (!response) return;

      const pageData = response.result || {};

      setPayments(
        (pageData.content || []).map((item) => ({
          id: item.id || "N/A",
          user: item.userName || "Unknown User",
          email: item.userEmail || "N/A",
          amount: item.amount || 0,
          gateway: item.gateway || "VNPAY",
          status: item.status || "PENDING",
          transactionId: item.gatewayTransactionId || "N/A",
          createdAt: item.createdAt || new Date().toISOString(),
        }))
      );
      setTotalPages(pageData.totalPages || 0);
      setTotalElements(pageData.totalElements || 0);
    } catch (error) {
      console.error("Failed to load payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, pageSize, statusFilter, gatewayFilter]);

  const handleDelete = async (paymentId) => {
    try {
      await adminApi.deletePayment(paymentId);
      setDeleteConfirm(null);
      loadPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setPage(0);
    if (filterType === "status") setStatusFilter(value);
    else if (filterType === "gateway") setGatewayFilter(value);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                <CreditCard className="h-3.5 w-3.5" />
                {t("admin.payment_management.badge")}
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {t("admin.payment_management.title")}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {loading ? t("admin.payment_management.loading") : `${totalElements} giao dịch`}
              </p>
            </div>

            <label className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-500 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                placeholder={t("admin.payment_management.search_placeholder")}
                disabled={loading}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={gatewayFilter}
              onChange={(e) => handleFilterChange("gateway", e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Gateways</option>
              <option value="VNPAY">VNPay</option>
              <option value="MOMO">MoMo</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">Không có giao dịch nào</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    t("admin.payment_management.table.transaction"),
                    t("admin.payment_management.table.user"),
                    t("admin.payment_management.table.amount"),
                    t("admin.payment_management.table.gateway"),
                    t("admin.payment_management.table.status"),
                    t("admin.payment_management.table.date"),
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payments.map((payment) => (
                  <tr key={payment.id} className="transition hover:bg-blue-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{payment.id.toString().substring(0, 8)}</p>
                          <p className="text-xs text-gray-500">{payment.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.user}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {payment.gateway === "VNPAY"
                          ? t("pricing.payment_methods.vnpay")
                          : payment.gateway === "MOMO"
                            ? t("pricing.payment_methods.momo")
                            : payment.gateway}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          payment.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700"
                            : payment.status === "PENDING"
                              ? "bg-amber-50 text-amber-700"
                              : payment.status === "FAILED"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDeleteConfirm(payment.id)}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        title="Delete payment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && payments.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-600">
              Page {page + 1} of {totalPages} ({totalElements} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="rounded-lg border border-gray-200 p-2 text-gray-700 transition disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-gray-200 p-2 text-gray-700 transition disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete this payment?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
