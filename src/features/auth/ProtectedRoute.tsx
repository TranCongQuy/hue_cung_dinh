import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "user" | "khach">;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, canAccessAdmin, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có quy định cụ thể danh sách vai trò
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.vaiTro)) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  // Mặc định đối với các trang /admin (chỉ admin mới có quyền canAccessAdmin)
  if (!canAccessAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

