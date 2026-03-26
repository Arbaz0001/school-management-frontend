import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { hasPermission } from "../config/permissions";

export default function usePermissions() {
  const auth = useContext(AuthContext);

  const role = useMemo(() => {
    if (auth?.user?.role) return auth.user.role;

    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      return stored?.role || "guest";
    } catch {
      return "guest";
    }
  }, [auth?.user?.role]);

  const can = (resource, action) => hasPermission(role, resource, action);

  return {
    role,
    can,
  };
}
