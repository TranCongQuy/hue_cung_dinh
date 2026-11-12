import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { useCartStore } from "../../features/packages/cartStore";
import { useWishlistStore } from "../../lib/wishlistStore";
import { useAuth } from "../../features/auth/AuthContext";
import { useToastStore } from "../../lib/toastStore";
import { NguoiDung } from "../../features/auth/types";
import { Icon, IconName } from "../common/Icon";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Trang Chủ" },
  { to: "/dich-vu", label: "Dịch Vụ" },
  { to: "/goi-cuoi", label: "Gói Cưới" },
  { to: "/thiep-cuoi", label: "Thiệp Cưới" },
  { to: "/tu-van", label: "AI Tư Vấn" },
  { to: "/dat-lich", label: "Đặt Lịch" },
];

const EXPLORE_LINKS: Array<{
  to: string;
  label: string;
  desc: string;
  icon: IconName;
}> = [
  {
    to: "/ban-do-di-san",
    label: "Bản Đồ Di Sản Cố Đô",
    desc: "Khám phá 9 điểm chụp hoàng cung & giờ vàng",
    icon: "map",
  },
  {
    to: "/phoi-co-phuc",
    label: "Phòng Phối Cổ Phục 2D",
    desc: "Thử Áo Nhật Bình, Áo Tấc & mấn phượng trực quan",
    icon: "palette",
  },
  {
    to: "/trien-lam",
    label: "Triển Lãm & Màu Phim",
    desc: "Lookbook thực tế & thanh trượt hậu kỳ Trước/Sau",
    icon: "image",
  },
  {
    to: "/ke-hoach-cuoi",
    label: "Sổ Tay Kế Hoạch Cưới",
    desc: "Checklist 5 cột mốc & dự toán ngân sách A4",
    icon: "bookmark",
  },
];

interface HeaderUserMenuProps {
  user: NguoiDung;
  onLogout: () => void;
}

export function HeaderUserMenu({ user, onLogout }: HeaderUserMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="header-user-menu-wrap" ref={wrapRef}>
      <button
        type="button"
        className="admin-portal-link user-pill-btn"
        onClick={() => setOpen((prev) => !prev)}
        title={user.ten ? `Tài khoản: ${user.ten}` : "Tài khoản cá nhân"}
        aria-expanded={open}
      >
        <Icon name="crown" size={16} />
        <span className="admin-portal-text">
          {user.vaiTro === "admin" ? "Quản Trị" : user.ten || "Khách Hàng"}
        </span>
        <Icon name="chevronDown" size={13} />
      </button>

      {open && (
        <div className="user-dropdown-menu" onClick={() => setOpen(false)}>
          <div className="dropdown-user-info">
            <strong>{user.ten || user.tenDangNhap}</strong>
            <span>{user.vaiTro === "admin" ? "Quản trị viên" : "Khách hàng"}</span>
          </div>
          {user.vaiTro === "admin" && (
            <>
              <Link to="/admin" className="dropdown-menu-item">
                <Icon name="crown" size={14} /> Bảng Điều Khiển Admin
              </Link>
              <Link to="/admin/lich-chup" className="dropdown-menu-item">
                <Icon name="calendar" size={14} /> Lịch Điều Phối Ekip
              </Link>
              <Link to="/quy-trinh" className="dropdown-menu-item">
                <Icon name="book" size={14} /> Hướng Dẫn & Quy Trình
              </Link>
            </>
          )}
          <Link to="/don-cua-toi" className="dropdown-menu-item">
            <Icon name="cart" size={14} /> Đơn Hàng Của Tôi
          </Link>
          <Link to="/ke-hoach-cuoi" className="dropdown-menu-item">
            <Icon name="bookmark" size={14} /> Sổ Tay Kế Hoạch Cưới
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
  const wishlistItems = useWishlistStore((s) => s.wishlist);
  const toggleWishlistDrawer = useWishlistStore((s) => s.toggleWishlistDrawer);
  const openCommandPalette = useWishlistStore((s) => s.openCommandPalette);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const addToast = useToastStore((s) => s.addToast);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  const isExploreRouteActive = EXPLORE_LINKS.some((item) =>
    location.pathname.startsWith(item.to)
  );

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      addToast("Quý khách vui lòng đăng nhập để xem giỏ hàng và đặt dịch vụ!", "warning", 5000);
      navigate("/login");
      return;
    }
    useCartStore.getState().openCart();
  };

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

          {/* Dropdown Khám Phá Hệ Sinh Thái Cố Đô */}
          <div className="header-explore-wrap" ref={exploreRef}>
            <button
              type="button"
              className={`nav-link nav-explore-trigger ${
                isExploreRouteActive ? "nav-link-active" : ""
              }`}
              onClick={() => setExploreOpen((prev) => !prev)}
              aria-expanded={exploreOpen}
              aria-haspopup="menu"
            >
              <span>Khám Phá</span>
              <Icon name="chevronDown" size={13} />
            </button>

            {exploreOpen && (
              <div
                className="header-explore-dropdown"
                role="menu"
                onClick={() => setExploreOpen(false)}
              >
                <div className="explore-dropdown-heading">KHÔNG GIAN TRẢI NGHIỆM CỐ ĐÔ</div>
                {EXPLORE_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    className={`explore-dropdown-item ${
                      location.pathname === item.to ? "active" : ""
                    }`}
                  >
                    <div className="explore-item-icon">
                      <Icon name={item.icon} size={18} color="var(--secondary)" />
                    </div>
                    <div className="explore-item-copy">
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <NavLink
              to="/don-cua-toi"
              className={({ isActive }) =>
                `nav-link nav-link-bookings ${isActive ? "nav-link-active" : ""}`
              }
            >
              Đơn Của Tôi
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="action-btn search-palette-btn"
            onClick={openCommandPalette}
            aria-label="Tìm kiếm nhanh toàn hệ thống (Ctrl + K)"
            title="Tìm kiếm nhanh (Ctrl + K)"
          >
            <Icon name="search" size={19} color="var(--secondary)" />
          </button>

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
            className="action-btn wishlist-header-btn"
            onClick={toggleWishlistDrawer}
            aria-label={`Danh sách yêu thích (${wishlistItems.length} mục)`}
            title="Danh sách yêu thích đã lưu"
          >
            <Icon name="heart" size={19} color="var(--secondary)" />
            {wishlistItems.length > 0 && (
              <span className="cart-badge wishlist-badge">{wishlistItems.length}</span>
            )}
          </button>

          <button
            type="button"
            className="action-btn cart-btn"
            onClick={handleCartClick}
            aria-label={`Giỏ hàng (${cartItems.length} sản phẩm)`}
            title="Xem giỏ hàng"
          >
            <Icon name="cart" size={20} color="var(--secondary)" />
            {isAuthenticated && cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </button>

          {isAuthenticated && user ? (
            <HeaderUserMenu user={user} onLogout={logout} />
          ) : (
            <Link to="/login" className="admin-portal-link" title="Đăng nhập tài khoản">
              <Icon name="user" size={18} />
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
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mobile-section-divider">KHÔNG GIAN TRẢI NGHIỆM</div>
          {EXPLORE_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `mobile-nav-link mobile-explore-link ${isActive ? "mobile-nav-link-active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon name={item.icon} size={17} color="var(--secondary)" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAuthenticated && (
            <Link
              to="/don-cua-toi"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đơn Của Tôi
            </Link>
          )}
          {isAuthenticated && user?.vaiTro === "admin" && (
            <Link
              to="/quy-trinh"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hướng Dẫn & Quy Trình (SOP)
            </Link>
          )}
          {isAuthenticated && (
            <button
              type="button"
              className="mobile-nav-link mobile-cart-link"
              onClick={() => {
                setMobileMenuOpen(false);
                useCartStore.getState().openCart();
              }}
            >
              Giỏ Hàng {cartItems.length > 0 ? `(${cartItems.length})` : ""}
            </button>
          )}
          {isAuthenticated && user?.vaiTro === "admin" && (
            <Link
              to="/admin"
              className="mobile-nav-link mobile-admin-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Quản Trị Viên (Admin)
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
