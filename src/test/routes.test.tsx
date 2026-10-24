import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../features/auth/AuthContext";
import { RootLayout } from "../app/RootLayout";
import { AdminLayout } from "../app/AdminLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { ConsultationPage } from "../pages/ConsultationPage";
import { InvitationsPage } from "../pages/InvitationsPage";
import { CartPage } from "../pages/CartPage";
import { MyBookingsPage } from "../pages/MyBookingsPage";
import { LoginPage } from "../pages/LoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";

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
          { path: "gio-hang", element: <CartPage /> },
          { path: "don-cua-toi", element: <MyBookingsPage /> },
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

describe("Kiểm thử Tích hợp Định tuyến React Router (createMemoryRouter)", () => {
  it("tải tuyến Public '/' và hiển thị tiêu đề Hero mới", async () => {
    renderWithRouter(["/"]);
    const heading = await screen.findByRole("heading", { level: 1, name: /Thiệp Cưới Điện Tử|Hôn Lễ Hoàng Triều/i });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/tu-van' và hiển thị form AI Tư Vấn", async () => {
    renderWithRouter(["/tu-van"]);
    const heading = await screen.findByRole("heading", { level: 1, name: /AI Tư Vấn Hôn Lễ Hoàng Triều/i });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/thiep-cuoi' và hiển thị tiêu đề Kho Mẫu Thiệp Cưới", async () => {
    renderWithRouter(["/thiep-cuoi"]);
    const heading = await screen.findByRole("heading", { level: 1, name: /Kho Giao Diện Các Mẫu Thiệp Cưới/i });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/gio-hang' và hiển thị giỏ hàng hoàng gia", async () => {
    renderWithRouter(["/gio-hang"]);
    const heading = await screen.findByRole("heading", { level: 1, name: /Giỏ Dịch Vụ Cưới Hoàng Gia/i });
    expect(heading).toBeInTheDocument();
  });

  it("tải tuyến Public '/don-cua-toi' và hiển thị trang Tra Cứu & Lịch Sử Đơn Của Quý Khách", async () => {
    renderWithRouter(["/don-cua-toi"]);
    const heading = await screen.findByRole("heading", { level: 1, name: /Lịch Sử Đơn Hàng & Lịch Hẹn/i });
    expect(heading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/admin' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/admin"]);
    const loginHeading = await screen.findByRole("heading", { level: 1, name: /Cổng Quản Trị Studio/i });
    expect(loginHeading).toBeInTheDocument();
  });

  it("chuyển hướng tuyến Protected '/admin/tai-khoan' về '/login' khi chưa xác thực", async () => {
    renderWithRouter(["/admin/tai-khoan"]);
    const loginHeading = await screen.findByRole("heading", { level: 1, name: /Cổng Quản Trị Studio/i });
    expect(loginHeading).toBeInTheDocument();
  });
});

