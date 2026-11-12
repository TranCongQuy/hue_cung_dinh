import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../features/auth/AuthContext";
import { RootLayout } from "../app/RootLayout";
import { AdminLayout } from "../app/AdminLayout";
import { RouteSuspense } from "../app/routes";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { ConsultationPage } from "../pages/ConsultationPage";
import { InvitationsPage } from "../pages/InvitationsPage";
import { CartPage } from "../pages/CartPage";
import { MyBookingsPage } from "../pages/MyBookingsPage";
import { ServiceDetailPage } from "../pages/ServiceDetailPage";
import { PackageDetailPage } from "../pages/PackageDetailPage";
import { LoginPage } from "../pages/LoginPage";
import { ProcessGuidePage } from "../pages/ProcessGuidePage";
import { HeritageMapPage } from "../pages/HeritageMapPage";
import { RoyalFittingRoomPage } from "../pages/RoyalFittingRoomPage";
import { LookbookGalleryPage } from "../pages/LookbookGalleryPage";
import { WeddingPlannerPage } from "../pages/WeddingPlannerPage";
import { PublicInvitationSharePage } from "../pages/PublicInvitationSharePage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminInvitationsPage } from "../pages/admin/AdminInvitationsPage";
import { AdminSchedulePage } from "../pages/admin/AdminSchedulePage";

function renderWithRouter(initialEntries: string[]) {
  const testRouter = createMemoryRouter(
    [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "tu-van", element: <ConsultationPage /> },
          { path: "thiep-cuoi", element: <InvitationsPage /> },
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
            path: "thiep-cuoi/moi/:slug",
            element: (
              <RouteSuspense>
                <PublicInvitationSharePage />
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
          {
            path: "dich-vu/:id",
            element: (
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <ServiceDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "goi-cuoi/:id",
            element: (
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <PackageDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "quy-trinh",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProcessGuidePage />
              </ProtectedRoute>
            ),
          },
          { path: "login", element: <LoginPage /> },
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
          { path: "thiep-cuoi", element: <AdminInvitationsPage /> },
          { path: "lich-chup", element: <AdminSchedulePage /> },
          {
            path: "tai-khoan",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <div data-testid="admin-users-view">Quản Lý Tài Khoản</div>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
    { initialEntries }
  );

  return render(
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={testRouter} />
      </AuthProvider>
    </ThemeProvider>
  );
}

describe("Kiểm thử Tích hợp Định tuyến & Phân quyền 2-Tier RBAC (createMemoryRouter)", () => {
  beforeEach(() => {
    localStorage.removeItem("hue_auth_session");
    localStorage.removeItem("hue_admin_session");
  });

  it("tải tuyến Public '/' và hiển thị tiêu đề Hero trang chủ", async () => {
    renderWithRouter(["/"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Thiệp Cưới Điện Tử|Hôn Lễ Hoàng Triều/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/tu-van' và hiển thị form AI Tư Vấn", async () => {
    renderWithRouter(["/tu-van"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /AI Tư Vấn Hôn Lễ Hoàng Triều/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/thiep-cuoi' và hiển thị Kho Giao Diện Các Mẫu Thiệp Cưới", async () => {
    renderWithRouter(["/thiep-cuoi"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Kho Giao Diện Các Mẫu Thiệp Cưới/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/ban-do-di-san' và hiển thị Bản Đồ Tọa Độ Nhiếp Ảnh Cung Đình Huế", async () => {
    renderWithRouter(["/ban-do-di-san"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Bản Đồ Tọa Độ Nhiếp Ảnh Cung Đình Huế/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/phoi-co-phuc' và hiển thị Phòng Phối Cổ Phục Cưới Trực Quan 2D", async () => {
    renderWithRouter(["/phoi-co-phuc"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Phòng Phối Cổ Phục Cưới Trực Quan 2D/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/trien-lam' và hiển thị Triển Lãm Lookbook Cưới Hoàng Triều", async () => {
    renderWithRouter(["/trien-lam"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Triển Lãm Lookbook Cưới Hoàng Triều/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public chia sẻ thiệp '/thiep-cuoi/moi/quoc-bao-ngoc-han-2026' không cần đăng nhập", async () => {
    renderWithRouter(["/thiep-cuoi/moi/quoc-bao-ngoc-han-2026"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Phan Quốc Bảo & Võ Thị Ngọc Hân/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/ke-hoach-cuoi' về '/login' khi chưa đăng nhập", async () => {
    renderWithRouter(["/ke-hoach-cuoi"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio & Đăng Nhập/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("cho phép vai trò 'user' truy cập tuyến '/ke-hoach-cuoi' sau khi đăng nhập", async () => {
    localStorage.setItem(
      "hue_auth_session",
      JSON.stringify({
        id: "user-khachhang",
        ten: "Nguyễn Văn Hoàng",
        tenDangNhap: "khachhang",
        soDienThoai: "0912345678",
        vaiTro: "user",
      })
    );
    renderWithRouter(["/ke-hoach-cuoi"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Kế hoạch lễ cưới — Nguyễn Văn Hoàng/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/gio-hang' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/gio-hang"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio & Đăng Nhập/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/don-cua-toi' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/don-cua-toi"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio & Đăng Nhập/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected chi tiết dịch vụ '/dich-vu/dv-02' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/dich-vu/dv-02"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio & Đăng Nhập/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected chi tiết gói cưới '/goi-cuoi/gc-02' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/goi-cuoi/gc-02"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio & Đăng Nhập/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/admin' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/admin"]);
    const loginHeading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio/i,
    });
    expect(loginHeading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/admin/tai-khoan' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/admin/tai-khoan"]);
    const loginHeading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio/i,
    });
    expect(loginHeading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/quy-trinh' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/quy-trinh"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Cổng Quản Trị Studio & Đăng Nhập/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("cho phép vai trò 'admin' truy cập tuyến '/admin/thiep-cuoi' Quản Trị Kho Thiệp Cưới & RSVP", async () => {
    localStorage.setItem(
      "hue_auth_session",
      JSON.stringify({
        id: "user-admin",
        ten: "Quản Trị Viên Hoàng Triều",
        tenDangNhap: "admin",
        soDienThoai: "0905123456",
        vaiTro: "admin",
      })
    );
    renderWithRouter(["/admin/thiep-cuoi"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Quản Trị Kho Thiệp Cưới & Sổ Khách Mời RSVP/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("cho phép vai trò 'admin' truy cập tuyến '/admin/lich-chup' Lịch Điều Phối Ekip", async () => {
    localStorage.setItem(
      "hue_auth_session",
      JSON.stringify({
        id: "user-admin",
        ten: "Quản Trị Viên Hoàng Triều",
        tenDangNhap: "admin",
        soDienThoai: "0905123456",
        vaiTro: "admin",
      })
    );
    renderWithRouter(["/admin/lich-chup"]);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /Lịch Điều Phối Ekip Nhiếp Ảnh & Cổ Phục/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
