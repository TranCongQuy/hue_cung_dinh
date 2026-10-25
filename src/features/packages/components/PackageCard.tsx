import { Link, useNavigate } from "react-router";
import { GoiCuoi } from "../types";
import { formatCurrency, getStyleLabel } from "../../../lib/formatters";
import { useCartStore } from "../cartStore";
import { useAuth } from "../../auth/AuthContext";
import { useToastStore } from "../../../lib/toastStore";
import { Button } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import "./PackageCard.css";

interface PackageCardProps {
  pkg: GoiCuoi;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === pkg.id));
  const quantity = cartItem?.soLuong || 0;
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addToast = useToastStore((s) => s.addToast);

  const handleDetailNav = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      addToast("Quý khách vui lòng đăng nhập để xem chi tiết gói cưới!", "warning", 5000);
      navigate("/login", { state: { from: { pathname: `/goi-cuoi/${pkg.id}` } } });
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToast("Quý khách vui lòng đăng nhập để đặt gói và thêm vào giỏ cưới!", "warning", 5000);
      navigate("/login", { state: { from: { pathname: "/goi-cuoi" } } });
      return;
    }
    addItem({
      id: pkg.id,
      ten: pkg.ten,
      giaTronGoi: pkg.giaTronGoi,
      hinhAnh: pkg.hinhAnh,
      phongCach: pkg.phongCach,
    });
    addToast(`Đã thêm "${pkg.ten}" vào giỏ cưới hoàng gia!`, "success", 5000);
  };

  return (
    <article className={`package-card ${quantity > 0 ? "package-card-selected" : ""}`}>
      <div className="package-card-media">
        <img
          src={pkg.hinhAnh}
          alt={pkg.ten}
          className="package-card-img"
          loading="lazy"
        />

        <div className="package-badges-header">
          <span className={`package-style-badge badge-${pkg.phongCach}`}>
            {getStyleLabel(pkg.phongCach)}
          </span>

          {pkg.isTop && (
            <span className="package-top-badge" title="Gói cưới combo hoàng gia được đặt nhiều nhất">
              ⭐ Được Đặt Nhiều Nhất
            </span>
          )}
        </div>

        {quantity > 0 && (
          <span className="card-selected-counter-badge" aria-label={`Đã chọn ${quantity}`}>
            <Icon name="check" size={12} />
            Đã chọn: {quantity}
          </span>
        )}
      </div>

      <div className="package-card-content">
        <h3 className="package-card-title">
          <Link to={`/goi-cuoi/${pkg.id}`} onClick={handleDetailNav}>{pkg.ten}</Link>
        </h3>
        <p className="package-card-desc">{pkg.moTa}</p>

        <div className="package-card-meta">
          <span className="package-service-count">
            <Icon name="package" size={16} color="var(--secondary)" />
            {pkg.danhSachDichVuIds.length} hạng mục cung đình
          </span>
        </div>

        <div className="package-card-footer">
          <div className="package-price-wrap">
            <span className="package-price-label">Giá trọn gói</span>
            <span className="package-price-value">{formatCurrency(pkg.giaTronGoi)}</span>
          </div>

          <div className="package-card-actions">
            {quantity > 0 ? (
              <div className="card-qty-stepper" aria-label={`Số lượng đã chọn: ${quantity}`}>
                <button
                  type="button"
                  className="btn-qty-step"
                  onClick={() => updateQuantity(pkg.id, -1)}
                  aria-label="Giảm 1 gói"
                >
                  <Icon name="minus" size={13} />
                </button>
                <span className="qty-step-value" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  className="btn-qty-step"
                  onClick={() => updateQuantity(pkg.id, 1)}
                  aria-label="Tăng 1 gói"
                >
                  <Icon name="plus" size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="package-cart-quick-btn"
                onClick={handleAddToCart}
                aria-label={`Thêm gói ${pkg.ten} vào giỏ`}
                title="Thêm vào giỏ cưới"
              >
                <Icon name="cart" size={18} />
              </button>
            )}

            <Link to={`/goi-cuoi/${pkg.id}`} onClick={handleDetailNav}>
              <Button variant="primary" size="sm">
                Chi Tiết
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
