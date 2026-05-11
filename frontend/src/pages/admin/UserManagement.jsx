import { useEffect, useState } from "react";
import { ShieldCheck, Search } from "lucide-react";
import { adminApi } from "../../api/AdminApi.js";

const fallbackUsers = [
  { id: 1, name: "Nguyễn Minh Anh", email: "anh.nguyen@example.com", role: "USER", status: "Active", joinedAt: "2026-01-12" },
  { id: 2, name: "Trần Quốc Huy", email: "huy.tran@example.com", role: "ADMIN", status: "Active", joinedAt: "2025-11-03" },
  { id: 3, name: "Lê Thu Hà", email: "ha.le@example.com", role: "USER", status: "Blocked", joinedAt: "2026-02-18" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(fallbackUsers);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
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
            joinedAt: item.createdAt ?? item.createdDate ?? "2026-01-01",
          }))
        );
      } catch {
        if (active) setUsers(fallbackUsers);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

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
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Users</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Quản lý người dùng</h2>
          </div>

          <label className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Tìm theo tên, email, role..."
            />
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Joined'].map((heading) => (
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">ID #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
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
                  <td className="px-6 py-4 text-sm text-slate-600">{user.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
