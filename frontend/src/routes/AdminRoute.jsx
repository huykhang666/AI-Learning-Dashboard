import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function normalizeRoleValue(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(normalizeRoleValue).flat();
  }

  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim().replace(/^ROLE_/, ""))
      .filter(Boolean);
  }

  return [];
}

function extractRolesFromToken(token) {
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    return normalizeRoleValue(
      decoded?.role ??
        decoded?.roles ??
        decoded?.authorities ??
        decoded?.scope ??
        decoded?.permissions
    );
  } catch {
    return [];
  }
}

function extractRolesFromStorage() {
  const directRole = localStorage.getItem("role") || localStorage.getItem("userRole");
  const userPayload = localStorage.getItem("user");
  const directRoles = normalizeRoleValue(directRole);

  if (directRoles.length > 0) {
    return directRoles;
  }

  if (userPayload) {
    try {
      const parsed = JSON.parse(userPayload);
      return normalizeRoleValue(
        parsed?.role ?? parsed?.roles ?? parsed?.authorities ?? parsed?.scope
      );
    } catch {
      return [];
    }
  }

  return [];
}

function hasAdminRole() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  const tokenRoles = extractRolesFromToken(token);
  const storageRoles = extractRolesFromStorage();
  const roles = [...tokenRoles, ...storageRoles].map((role) => role.toUpperCase());

  return roles.includes("ADMIN");
}

export default function AdminRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!hasAdminRole()) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}
