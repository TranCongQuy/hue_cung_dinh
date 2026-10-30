import { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router";
import { Icon } from "../components/common/Icon";
import { ToastContainer } from "../components/common/UI";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../features/auth/AuthContext";
import { ScrollToTop } from "../components/common/ScrollToTop";
import "./AdminLayout.css";

export function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", label: "Tổng Quan & KPI", icon: "barChart" as const, end: true },
    { to: "/admin/dich-vu", label: "Quản Lý Dịch Vụ", icon: "sparkles" as const, end: false },
    { to: "/admin/goi-cuoi", label: "Quản Lý Gói Cưới", icon: "package" as const, end: false },
    { to: "/admin/yeu-cau", label: "Đơn Yêu Cầu Tư Vấn", icon: "phone" as const, end: false },
    { to: "/admin/tai-khoan", label: "Quản Lý Tài Khoản", icon: "user" as const, end: false },
  ];

  return (
    <div className={`admin-layout-root ${mobileMenuOpen ? "mobile-sidebar-open" : ""}`}>
      <ScrollToTop />
      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Cung Đình Tối Màu */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand">
            <div className="admin-brand-icon">
              <Icon name="crown" size={22} color="var(--secondary)" />
            </div>
            <div className="admin-brand-text">
              <span className="admin-brand-title">Cung Đình Admin</span>
              <span className="admin-brand-role">HỆ THỐNG QUẢN TRỊ</span>
            </div>
          </Link>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Đóng bảng điều hướng"
          >
            <Icon name="close" size={20} color="#A89E92" />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Điều hướng quản trị">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "admin-nav-active" : ""}`
              }
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item back-home-link">
            <Icon name="arrowRight" size={18} />
            <span>Về Trang Khách</span>
          </Link>
          <Link to="/quy-trinh" className="admin-nav-item sop-link">
            <Icon name="book" size={18} />
            <span>Hướng Dẫn & Quy Trình</span>
          </Link>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            aria-label="Đăng xuất khỏi hệ thống"
          >
            <Icon name="logOut" size={18} />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </aside>

      {/* Vùng Nội Dung Chính */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mở menu quản trị"
            >
              <Icon name="menu" size={20} />
            </button>
            <span className="admin-badge">Quản Trị Hoàng Gia</span>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-theme-btn"
              onClick={toggleTheme}
              aria-label="Đổi chế độ sáng tối"
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={18} color="var(--secondary)" />
            </button>

            <div className="admin-user-info">
              <div className="admin-avatar">
                <Icon name="crown" size={18} color="#FFFFFF" />
              </div>
              <div className="admin-user-details">
                <span className="admin-user-name">
                  {user?.ten || "Quản Trị Viên"}
                </span>
                <span className="admin-user-status">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

