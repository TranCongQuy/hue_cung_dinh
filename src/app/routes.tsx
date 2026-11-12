import { lazy, Suspense, ReactNode } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { AdminLayout } from "./AdminLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { Skeleton } from "../components/common/UI";

/* ==========================================================================
   CORE PUBLIC PAGES (Tải tức thì cho trải nghiệm đầu trang)
   ========================================================================== */
import { HomePage } from "../pages/HomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { PackagesPage } from "../pages/PackagesPage";
import { ConsultationPage } from "../pages/ConsultationPage";
import { InvitationsPage } from "../pages/InvitationsPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";

/* ==========================================================================
   CODE-SPLIT INTERACTIVE & PROTECTED PAGES (Tối ưu dung lượng chunk < 500 kB)
   ========================================================================== */
const ServiceDetailPage = lazy(() =>
  import("../pages/ServiceDetailPage").then((m) => ({ default: m.ServiceDetailPage }))
);
const PackageDetailPage = lazy(() =>
  import("../pages/PackageDetailPage").then((m) => ({ default: m.PackageDetailPage }))
);
const BookingPage = lazy(() =>
  import("../pages/BookingPage").then((m) => ({ default: m.BookingPage }))
);
const HeritageMapPage = lazy(() =>
  import("../pages/HeritageMapPage").then((m) => ({ default: m.HeritageMapPage }))
);
const RoyalFittingRoomPage = lazy(() =>
  import("../pages/RoyalFittingRoomPage").then((m) => ({ default: m.RoyalFittingRoomPage }))
);
const LookbookGalleryPage = lazy(() =>
  import("../pages/LookbookGalleryPage").then((m) => ({ default: m.LookbookGalleryPage }))
);
const WeddingPlannerPage = lazy(() =>
  import("../pages/WeddingPlannerPage").then((m) => ({ default: m.WeddingPlannerPage }))
);
const PublicInvitationSharePage = lazy(() =>
  import("../pages/PublicInvitationSharePage").then((m) => ({ default: m.PublicInvitationSharePage }))
);
const InvitationDetailPage = lazy(() =>
  import("../pages/InvitationDetailPage").then((m) => ({ default: m.InvitationDetailPage }))
);
const InvitationCustomPage = lazy(() =>
  import("../pages/InvitationCustomPage").then((m) => ({ default: m.InvitationCustomPage }))
);
const CartPage = lazy(() =>
  import("../pages/CartPage").then((m) => ({ default: m.CartPage }))
);
const MyBookingsPage = lazy(() =>
  import("../pages/MyBookingsPage").then((m) => ({ default: m.MyBookingsPage }))
);
const ProcessGuidePage = lazy(() =>
  import("../pages/ProcessGuidePage").then((m) => ({ default: m.ProcessGuidePage }))
);

/* ==========================================================================
   CODE-SPLIT ADMIN ERP PAGES
   ========================================================================== */
const AdminDashboardPage = lazy(() =>
  import("../pages/admin/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminServicesPage = lazy(() =>
  import("../pages/admin/AdminServicesPage").then((m) => ({ default: m.AdminServicesPage }))
);
const AdminPackagesPage = lazy(() =>
  import("../pages/admin/AdminPackagesPage").then((m) => ({ default: m.AdminPackagesPage }))
);
const AdminInvitationsPage = lazy(() =>
  import("../pages/admin/AdminInvitationsPage").then((m) => ({ default: m.AdminInvitationsPage }))
);
const AdminRequestsPage = lazy(() =>
  import("../pages/admin/AdminRequestsPage").then((m) => ({ default: m.AdminRequestsPage }))
);
const AdminSchedulePage = lazy(() =>
  import("../pages/admin/AdminSchedulePage").then((m) => ({ default: m.AdminSchedulePage }))
);
const AdminUsersPage = lazy(() =>
  import("../pages/admin/AdminUsersPage").then((m) => ({ default: m.AdminUsersPage }))
);

export function RouteSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: "40px 16px" }}>
          <Skeleton height="320px" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

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
            <RouteSuspense>
              <ServiceDetailPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      { path: "goi-cuoi", element: <PackagesPage /> },
      {
        path: "goi-cuoi/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <PackageDetailPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "dat-lich",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <BookingPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      { path: "tu-van", element: <ConsultationPage /> },
      {
        path: "ban-do-di-san",
        element: (
          <RouteSuspense>
            <HeritageMapPage />
          </RouteSuspense>
        ),
      },
      {
        path: "phoi-co-phuc",
        element: (
          <RouteSuspense>
            <RoyalFittingRoomPage />
          </RouteSuspense>
        ),
      },
      {
        path: "trien-lam",
        element: (
          <RouteSuspense>
            <LookbookGalleryPage />
          </RouteSuspense>
        ),
      },
      {
        path: "ke-hoach-cuoi",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <WeddingPlannerPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      { path: "thiep-cuoi", element: <InvitationsPage /> },
      {
        path: "thiep-cuoi/moi/:slug",
        element: (
          <RouteSuspense>
            <PublicInvitationSharePage />
          </RouteSuspense>
        ),
      },
      {
        path: "thiep-cuoi/dang-ky",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <InvitationCustomPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "thiep-cuoi/tuy-bien",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <InvitationCustomPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "thiep-cuoi/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <InvitationDetailPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "gio-hang",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <CartPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "don-cua-toi",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RouteSuspense>
              <MyBookingsPage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "quy-trinh",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <RouteSuspense>
              <ProcessGuidePage />
            </RouteSuspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "huong-dan-quy-trinh",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <RouteSuspense>
              <ProcessGuidePage />
            </RouteSuspense>
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
      {
        index: true,
        element: (
          <RouteSuspense>
            <AdminDashboardPage />
          </RouteSuspense>
        ),
      },
      {
        path: "dich-vu",
        element: (
          <RouteSuspense>
            <AdminServicesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "goi-cuoi",
        element: (
          <RouteSuspense>
            <AdminPackagesPage />
          </RouteSuspense>
        ),
      },
      {
        path: "thiep-cuoi",
        element: (
          <RouteSuspense>
            <AdminInvitationsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "yeu-cau",
        element: (
          <RouteSuspense>
            <AdminRequestsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "lich-chup",
        element: (
          <RouteSuspense>
            <AdminSchedulePage />
          </RouteSuspense>
        ),
      },
      {
        path: "tai-khoan",
        element: (
          <RouteSuspense>
            <AdminUsersPage />
          </RouteSuspense>
        ),
      },
    ],
  },
]);
