import { selectUser } from "@/features/auth/api/auth.selectors";
import { useAppSelector } from "@/hooks";
import { Navigate, Outlet } from "react-router-dom";

export function OwnerGuard() {
  const user = useAppSelector(selectUser);

  // login bo'lmasa owner-login ga yuboramiz
  if (!user) return <Navigate to="/owner-login" replace />;

  // login bor, lekin owner emas
  if (user.role !== "owner") return <Navigate to="/" replace />;

  return <Outlet />;
}
