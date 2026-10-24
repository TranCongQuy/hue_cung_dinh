import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { useCartStore } from "../../features/packages/cartStore";
import { useAuth } from "../../features/auth/AuthContext";
import { NguoiDung } from "../../features/auth/types";
import { Icon } from "../common/Icon";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Trang Chủ" },
  { to: "/dich-vu", label: "Dịch Vụ Lẻ" },
  { to: "/goi-cuoi", label: "Gói Cưới Combo" },
  { to: "/thiep-cuoi", label: "Mẫu Thiệp Cưới" },
  { to: "/tu-van", label: "AI Tư Vấn" },
  { to: "/don-cua-toi", label: "Đơn Của Tôi" },
];

interface HeaderUserMenuProps {
  user: NguoiDung;
  onLogout: () => void;
}

export function HeaderUserMenu({ user, onLogout }: HeaderUserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="header-user-menu-wrap">
      <button
        type="button"
        className="admin-portal-link user-pill-btn"
        onClick={() => setOpen((prev) => !prev)}
        title="Tài khoản cá nhân"
        aria-expanded={open}
      >
        <Icon name="crown" size={16} />
        <span className="admin-portal-text">
          {user.vaiTro === "admin" ? "Quản Trị" : user.ten || "Khách Hàng"}
        </span>
        <Icon name="chevronDown" size={12} />
      </button>

      {open && (
        <div className="user-dropdown-menu" onClick={() => setOpen(false)}>
          <div className="dropdown-user-info">
            <strong>{user.ten || user.tenDangNhap}</strong>
            <span>{user.vaiTro === "admin" ? "Quản trị viên" : "Khách hàng"}</span>
          </div>
          {user.vaiTro === "admin" && (
            <Link to="/admin" className="dropdown-menu-item">
              <Icon name="crown" size={14} /> Bảng Điều Khiển Admin
            </Link>
          )}
          <Link to="/don-cua-toi" className="dropdown-menu-item">
            <Icon name="cart" size={14} /> Đơn Hàng Của Tôi
          </Link>
          <button type="button" className="dropdown-menu-item logout-item" onClick={onLogout}>
            <Icon name="close" size={14} /> Đăng Xuất
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const cartItems = useCartStore((s) => s.items);
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="header-logo" aria-label="Huế Cung Đình - Trang chủ">
          <div className="logo-symbol">
            <Icon name="crown" size={24} color="var(--secondary)" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Huế Cung Đình</span>
            <span className="logo-subtitle">HÔN LỄ HOÀNG TRIỀU</span>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="action-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Chuyển sang chế độ ${theme === "light" ? "Tối" : "Sáng"}`}
            title={`Chế độ: ${theme === "light" ? "Ban ngày" : "Dạ nguyệt"}`}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={19} color="var(--secondary)" />
          </button>

          <button
            type="button"
            className="action-btn cart-btn"
            onClick={() => useCartStore.getState().openCart()}
            aria-label={`Giỏ hàng (${cartItems.length} sản phẩm)`}
            title="Xem giỏ hàng"
          >
            <Icon name="cart" size={20} color="var(--secondary)" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </button>

          {isAuthenticated && user ? (
            <HeaderUserMenu user={user} onLogout={logout} />
          ) : (
            <Link to="/login" className="admin-portal-link" title="Đăng nhập tài khoản">
              <Icon name="user" size={17} />
              <span className="admin-portal-text">Đăng Nhập</span>
            </Link>
          )}

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mở danh mục menu"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mobile-nav-drawer" aria-label="Menu di động">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/admin" className="mobile-nav-link mobile-admin-link" onClick={() => setMobileMenuOpen(false)}>
            Quản Trị Viên (Admin)
          </Link>
        </nav>
      )}
    </header>
  );
}
