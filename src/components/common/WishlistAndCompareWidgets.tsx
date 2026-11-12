import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useWishlistStore } from "../../lib/wishlistStore";
import { useCartStore } from "../../features/packages/cartStore";
import { useAuth } from "../../features/auth/AuthContext";
import { useToastStore } from "../../lib/toastStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { formatCurrency, getStyleLabel } from "../../lib/formatters";
import { DichVu } from "../../features/services/types";
import { Button } from "./UI";
import { Icon } from "./Icon";
import "./WishlistAndCompareWidgets.css";

/* ==========================================================================
   1. WISHLIST SLIDE-OVER DRAWER
   ========================================================================== */
export function WishlistDrawer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToast = useToastStore((s) => s.addToast);
  const addItem = useCartStore((s) => s.addItem);

  const wishlist = useWishlistStore((s) => s.wishlist);
  const isOpen = useWishlistStore((s) => s.isWishlistOpen);
  const closeWishlist = useWishlistStore((s) => s.closeWishlist);
  const removeItem = useWishlistStore((s) => s.removeWishlistItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeWishlist();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeWishlist]);

  if (!isOpen) return null;

  const getCategoryTag = (cat: string) => {
    if (cat === "goi-cuoi") return "Gói Cưới Combo";
    if (cat === "dich-vu") return "Dịch Vụ Lẻ";
    return "Thiệp Cưới Online";
  };

  const handleMoveToCart = (item: (typeof wishlist)[number]) => {
    if (!isAuthenticated) {
      closeWishlist();
      addToast("Quý khách vui lòng đăng nhập để chuyển hạng mục vào giỏ cưới!", "warning");
      navigate("/login");
      return;
    }
    addItem({
      id: item.id,
      ten: item.ten,
      gia: item.gia,
      hinhAnh: item.hinhAnh,
    });
    addToast(`Đã thêm "${item.ten}" vào giỏ cưới!`, "success");
  };

  return (
    <div
      className="wishlist-drawer-backdrop"
      onClick={closeWishlist}
      role="dialog"
      aria-modal="true"
      aria-label="Danh sách yêu thích"
    >
      <aside className="wishlist-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-drawer-header">
          <div className="wishlist-header-title">
            <Icon name="heart" size={20} color="var(--primary)" />
            <h3>Bộ Sưu Tập Yêu Thích ({wishlist.length})</h3>
          </div>
          <button
            type="button"
            className="wishlist-close-btn"
            onClick={closeWishlist}
            aria-label="Đóng danh sách yêu thích"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="wishlist-drawer-body">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty-state">
              <Icon name="heart" size={42} color="var(--secondary)" />
              <h4>Chưa có hạng mục lưu trữ</h4>
              <p>
                Bấm biểu tượng trái tim trên các Gói cưới, Dịch vụ cổ phục hoặc Mẫu thiệp để lưu lại cân nhắc cùng người thương.
              </p>
              <div className="wishlist-empty-links">
                <Link to="/goi-cuoi" onClick={closeWishlist}>
                  <Button variant="primary" size="sm">Khám Phá Gói Cưới</Button>
                </Link>
                <Link to="/phoi-co-phuc" onClick={closeWishlist}>
                  <Button variant="secondary" size="sm">Phối Cổ Phục 2D</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item-card">
                  <img src={item.hinhAnh} alt={item.ten} className="wishlist-item-img" />
                  <div className="wishlist-item-info">
                    <span className="wishlist-item-tag">{getCategoryTag(item.phanLoai)}</span>
                    <Link
                      to={item.duongDan}
                      className="wishlist-item-name"
                      onClick={closeWishlist}
                    >
                      {item.ten}
                    </Link>
                    <strong className="wishlist-item-price">{formatCurrency(item.gia)}</strong>
                    <div className="wishlist-item-actions">
                      {item.phanLoai !== "thiep-cuoi" ? (
                        <button
                          type="button"
                          className="wishlist-move-cart-btn"
                          onClick={() => handleMoveToCart(item)}
                        >
                          <Icon name="cart" size={13} /> Thêm vào giỏ
                        </button>
                      ) : (
                        <Link
                          to={`/thiep-cuoi/dang-ky?mau=${item.id}`}
                          className="wishlist-move-cart-btn"
                          onClick={closeWishlist}
                        >
                          <Icon name="sparkles" size={13} /> Tạo thiệp ngay
                        </Link>
                      )}
                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Bỏ yêu thích ${item.ten}`}
                        title="Xóa khỏi yêu thích"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="wishlist-drawer-footer">
            <button
              type="button"
              className="wishlist-clear-btn"
              onClick={clearWishlist}
            >
              Xóa toàn bộ danh sách
            </button>
            <Link to="/dat-lich" onClick={closeWishlist}>
              <Button variant="primary" size="sm" rightIcon={<Icon name="arrowRight" size={15} />}>
                Đặt Lịch Tư Vấn
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ==========================================================================
   2. FLOATING COMPARE PACKAGES BAR + MATRIX MODAL
   ========================================================================== */
export function ComparePackagesWidget() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToast = useToastStore((s) => s.addToast);
  const addItem = useCartStore((s) => s.addItem);

  const comparePackages = useWishlistStore((s) => s.comparePackages);
  const isModalOpen = useWishlistStore((s) => s.isCompareModalOpen);
  const openModal = useWishlistStore((s) => s.openCompareModal);
  const closeModal = useWishlistStore((s) => s.closeCompareModal);
  const removeCompare = useWishlistStore((s) => s.removeComparePackage);
  const clearCompare = useWishlistStore((s) => s.clearComparePackages);

  const [allServices, setAllServices] = useState<DichVu[]>([]);

  useEffect(() => {
    if (!isModalOpen) return;
    SupabaseService.getServices().then(setAllServices);
  }, [isModalOpen]);

  if (comparePackages.length === 0) return null;

  // Tập hợp toàn bộ ID dịch vụ xuất hiện trong các gói đang so sánh
  const unionServiceIds = Array.from(
    new Set(comparePackages.flatMap((p) => p.danhSachDichVuIds))
  );

  const getOriginalTotal = (ids: string[]) =>
    ids.reduce((sum, id) => {
      const found = allServices.find((s) => s.id === id);
      return sum + (found ? found.gia : 0);
    }, 0);

  const handleChoosePackage = (pkg: (typeof comparePackages)[number]) => {
    if (!isAuthenticated) {
      closeModal();
      addToast("Quý khách vui lòng đăng nhập để đặt gói cưới!", "warning");
      navigate("/login");
      return;
    }
    addItem({
      id: pkg.id,
      ten: pkg.ten,
      giaTronGoi: pkg.giaTronGoi,
      hinhAnh: pkg.hinhAnh,
      phongCach: pkg.phongCach,
    });
    addToast(`Đã chọn gói "${pkg.ten}" vào giỏ cưới!`, "success");
    closeModal();
  };

  return (
    <>
      <div className="compare-floating-bar" role="region" aria-label="Thanh so sánh gói cưới">
        <div className="compare-bar-inner">
          <div className="compare-bar-title">
            <Icon name="arrowsLeftRight" size={18} color="var(--secondary)" />
            <span>So sánh gói cưới ({comparePackages.length}/3):</span>
          </div>

          <div className="compare-bar-chips">
            {comparePackages.map((p) => (
              <div key={p.id} className="compare-chip">
                <span className="compare-chip-name">{p.ten.replace(/^Gói\s+/i, "")}</span>
                <button
                  type="button"
                  onClick={() => removeCompare(p.id)}
                  aria-label={`Bỏ gói ${p.ten} khỏi bảng so sánh`}
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="compare-bar-actions">
            <button type="button" className="compare-clear-link" onClick={clearCompare}>
              Thu gọn
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={openModal}
              disabled={comparePackages.length < 2}
            >
              {comparePackages.length < 2 ? "Chọn thêm 1 gói" : "Đối Chiếu Chi Tiết"}
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="compare-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Bảng đối chiếu chi tiết các gói cưới"
        >
          <div className="compare-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="compare-modal-header">
              <div>
                <span className="section-badge">ĐỐI CHIẾU QUYỀN LỢI HOÀNG GIA</span>
                <h3 style={{ marginTop: "6px" }}>So Sánh Trực Quan Gói Cưới Combo</h3>
              </div>
              <button
                type="button"
                className="wishlist-close-btn"
                onClick={closeModal}
                aria-label="Đóng bảng so sánh"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="compare-table-scroll">
              <table className="compare-matrix-table">
                <thead>
                  <tr>
                    <th className="compare-criteria-col">Tiêu chí đối chiếu</th>
                    {comparePackages.map((pkg) => (
                      <th key={pkg.id} className="compare-pkg-col">
                        <div className="compare-pkg-head">
                          <img src={pkg.hinhAnh} alt={pkg.ten} className="compare-pkg-thumb" />
                          <span className="compare-pkg-title">{pkg.ten}</span>
                          <strong className="compare-pkg-price">
                            {formatCurrency(pkg.giaTronGoi)}
                          </strong>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="compare-row-label">Phong cách chủ đạo</td>
                    {comparePackages.map((pkg) => (
                      <td key={pkg.id}>{getStyleLabel(pkg.phongCach)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-row-label">Số hạng mục bao gồm</td>
                    {comparePackages.map((pkg) => (
                      <td key={pkg.id}>
                        <strong>{pkg.danhSachDichVuIds.length}</strong> dịch vụ cung đình
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-row-label">Tổng giá trị lẻ ước tính</td>
                    {comparePackages.map((pkg) => {
                      const orig = getOriginalTotal(pkg.danhSachDichVuIds);
                      const saved = Math.max(0, orig - pkg.giaTronGoi);
                      return (
                        <td key={pkg.id}>
                          <div>{orig > 0 ? formatCurrency(orig) : "Đang tính..."}</div>
                          {saved > 0 && (
                            <span className="compare-save-pill">
                              Tiết kiệm {formatCurrency(saved)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="compare-row-label">Mức cọc giữ lịch (20%)</td>
                    {comparePackages.map((pkg) => (
                      <td key={pkg.id}>{formatCurrency(Math.round(pkg.giaTronGoi * 0.2))}</td>
                    ))}
                  </tr>
                  {unionServiceIds.map((svcId) => {
                    const svc = allServices.find((s) => s.id === svcId);
                    return (
                      <tr key={svcId}>
                        <td className="compare-row-label">
                          {svc ? svc.ten : `Hạng mục #${svcId}`}
                        </td>
                        {comparePackages.map((pkg) => {
                          const has = pkg.danhSachDichVuIds.includes(svcId);
                          return (
                            <td key={pkg.id} style={{ textAlign: "center" }}>
                              {has ? (
                                <span className="compare-has-yes" aria-label="Có bao gồm">
                                  <Icon name="checkCircle" size={18} color="#16a34a" />
                                </span>
                              ) : (
                                <span className="compare-has-no" aria-label="Không bao gồm">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="compare-row-label">Lựa chọn đặt gói</td>
                    {comparePackages.map((pkg) => (
                      <td key={pkg.id}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleChoosePackage(pkg)}
                          >
                            Chọn Gói Này
                          </Button>
                          <Link
                            to={`/dat-lich?goi=${pkg.id}`}
                            onClick={closeModal}
                          >
                            <Button variant="secondary" size="sm">
                              Đặt Lịch
                            </Button>
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
