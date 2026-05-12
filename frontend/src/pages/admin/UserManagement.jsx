import { useEffect, useState } from "react";
import { ShieldCheck, Search, Edit2, Trash2, Crown, X, AlertCircle } from "lucide-react";
import { adminApi } from "../../api/AdminApi.js";

const fallbackUsers = [
  { id: 1, name: "Nguyễn Minh Anh", email: "anh.nguyen@example.com", role: "USER", status: "Active", isPremium: false, joinedAt: "2026-01-12" },
  { id: 2, name: "Trần Quốc Huy", email: "huy.tran@example.com", role: "ADMIN", status: "Active", isPremium: true, joinedAt: "2025-11-03" },
  { id: 3, name: "Lê Thu Hà", email: "ha.le@example.com", role: "USER", status: "Blocked", isPremium: false, joinedAt: "2026-02-18" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(fallbackUsers);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "USER" });
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    let active = true;
    setLoading(true);

    try {
      const response = await adminApi.getAllUsers();

      if (!active || !response) return;

      const normalized = Array.isArray(response)
        ? response
        : Array.isArray(response?.content)
          ? response.content
          : fallbackUsers;

      setUsers(
        normalized.map((item, index) => ({
          id: item.id ?? item.userId ?? index + 1,
          name: item.fullName ?? item.name ?? item.username ?? "Unknown User",
          email: item.email ?? item.username ?? "unknown@example.com",
          role: item.role ?? item.userRole ?? "USER",
          status: item.status ?? "Active",
          isPremium: item.isPremium ?? item.is_premium ?? false,
          joinedAt: item.createdAt ?? item.createdDate ?? "2026-01-01",
        }))
      );
    } catch (error) {
      console.error("Lỗi tải danh sách user:", error);
      setUsers(fallbackUsers);
    } finally {
      if (active) setLoading(false);
    }

    return () => {
      active = false;
    };
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, role: user.role });
  };

  const handleSaveEdit = async () => {
    if (!editingUser || !editForm.name.trim()) {
      setMessage({ type: "error", text: "Tên không được để trống" });
      return;
    }

    setActionLoading("edit");
    try {
      await adminApi.updateUser(editingUser.id, {
        fullName: editForm.name,
        role: editForm.role,
      });

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: editForm.name, role: editForm.role }
            : u
        )
      );

      setEditingUser(null);
      setMessage({ type: "success", text: "Cập nhật thông tin user thành công!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Lỗi cập nhật user:", error);
      setMessage({ type: "error", text: "Cập nhật thông tin thất bại" });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete
  const handleDelete = async (userId) => {
    setActionLoading("delete");
    try {
      await adminApi.deleteUser(userId);

      // Update local state
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      setDeletingUserId(null);
      setMessage({ type: "success", text: "Xóa user thành công!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      setMessage({ type: "error", text: "Xóa user thất bại" });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle toggle premium
  const handleTogglePremium = async (user) => {
    setActionLoading(`premium-${user.id}`);
    try {
      await adminApi.togglePremium(user.id, !user.isPremium);

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, isPremium: !u.isPremium }
            : u
        )
      );

      setMessage({
        type: "success",
        text: user.isPremium ? "Hủy bỏ Premium thành công!" : "Cấp Premium thành công!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Lỗi cập nhật Premium:", error);
      setMessage({ type: "error", text: "Cập nhật trạng thái Premium thất bại" });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;

    return [user.name, user.email, user.role, user.status]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message.text && (
        <div
          className={`rounded-3xl border p-4 shadow-sm flex items-center gap-3 ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Header Section */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Users
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Quản lý người dùng
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Tìm kiếm, chỉnh sửa, xóa và quản lý trạng thái Premium của user.
            </p>
          </div>

          <label className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-500 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              placeholder="Tìm theo tên, email, role..."
            />
          </label>
        </div>
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Premium', 'Actions'].map((heading) => (
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-blue-50/60">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isPremium
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Crown className="h-3.5 w-3.5" />
                      {user.isPremium ? "Pro" : "Free"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(user)}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Sửa
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingUserId(user.id)}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Xóa
                      </button>

                      {/* Toggle Premium Button */}
                      <button
                        onClick={() => handleTogglePremium(user)}
                        disabled={actionLoading !== null}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                          user.isPremium
                            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                        }`}
                      >
                        <Crown className="h-3.5 w-3.5" />
                        {actionLoading === `premium-${user.id}`
                          ? "..."
                          : user.isPremium
                          ? "Hủy Pro"
                          : "Cấp Pro"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin user</h3>
            <p className="mt-1 text-sm text-gray-500">Cập nhật tên và vai trò của người dùng</p>

            <div className="mt-6 space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-300 focus:outline-none"
                  placeholder="Nhập tên người dùng"
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Vai trò</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-300 focus:outline-none"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MODERATOR">Moderator</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading === "edit"}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-50"
              >
                {actionLoading === "edit" ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingUserId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
            onClick={() => setDeletingUserId(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">Xác nhận xóa user</h3>
            <p className="mt-2 text-sm text-gray-600">
              Bạn có chắc muốn xóa user này? Hành động này không thể hoàn tác.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setDeletingUserId(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deletingUserId)}
                disabled={actionLoading === "delete"}
                className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
              >
                {actionLoading === "delete" ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
