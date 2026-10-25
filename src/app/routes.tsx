import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { AdminLayout } from "./AdminLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";

import { HomePage } from "../pages/HomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { PackagesPage } from "../pages/PackagesPage";
import { PackageDetailPage } from "../pages/PackageDetailPage";
import { ConsultationPage } from "../pages/ConsultationPage";
import { InvitationsPage } from "../pages/InvitationsPage";
import { InvitationDetailPage } from "../pages/InvitationDetailPage";
import { InvitationCustomPage } from "../pages/InvitationCustomPage";
import { CartPage } from "../pages/CartPage";
import { BookingPage } from "../pages/BookingPage";
import { ServiceDetailPage } from "../pages/ServiceDetailPage";
import { MyBookingsPage } from "../pages/MyBookingsPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";

import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminServicesPage } from "../pages/admin/AdminServicesPage";
import { AdminPackagesPage } from "../pages/admin/AdminPackagesPage";
import { AdminRequestsPage } from "../pages/admin/AdminRequestsPage";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dich-vu", element: <ServicesPage /> },
      {
        path: "dich-vu/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ServiceDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: "goi-cuoi", element: <PackagesPage /> },
      {
        path: "goi-cuoi/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <PackageDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dat-lich",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      { path: "tu-van", element: <ConsultationPage /> },
      { path: "thiep-cuoi", element: <InvitationsPage /> },
      {
        path: "thiep-cuoi/dang-ky",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <InvitationCustomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "thiep-cuoi/tuy-bien",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <InvitationCustomPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "thiep-cuoi/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <InvitationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gio-hang",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "don-cua-toi",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <MyBookingsPage />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <LoginPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "dich-vu", element: <AdminServicesPage /> },
      { path: "goi-cuoi", element: <AdminPackagesPage /> },
      { path: "yeu-cau", element: <AdminRequestsPage /> },
      { path: "tai-khoan", element: <AdminUsersPage /> },
    ],
  },
]);
