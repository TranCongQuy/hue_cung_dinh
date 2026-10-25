import { Link, useNavigate } from "react-router";
import { DichVu } from "../types";
import { formatCurrency, getCategoryLabel } from "../../../lib/formatters";
import { useCartStore } from "../../packages/cartStore";
import { useAuth } from "../../auth/AuthContext";
import { useToastStore } from "../../../lib/toastStore";
import { Icon } from "../../../components/common/Icon";
import "./ServiceCard.css";

interface ServiceCardProps {
  service: DichVu;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === service.id));
  const quantity = cartItem?.soLuong || 0;
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addToast = useToastStore((s) => s.addToast);

  const handleDetailNav = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      addToast("Vui lòng đăng nhập để xem chi tiết gói dịch vụ!", "warning", 5000);
      navigate("/login", { state: { from: { pathname: `/dich-vu/${service.id}` } } });
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToast("Vui lòng đăng nhập để đặt dịch vụ và thêm vào giỏ hàng!", "warning", 5000);
      navigate("/login", { state: { from: { pathname: "/dich-vu" } } });
      return;
    }
    addItem({
      id: service.id,
      ten: service.ten,
      gia: service.gia,
      hinhAnh: service.hinhAnh,
      loai: service.loai,
    });
    addToast(`Đã thêm "${service.ten}" vào giỏ dịch vụ!`, "success", 5000);
  };

  return (
    <article className={`service-card ${quantity > 0 ? "service-card-selected" : ""}`}>
      <div className="service-card-media">
        <Link
          to={`/dich-vu/${service.id}`}
          className="service-card-link-img"
          onClick={handleDetailNav}
        >
          <img
            src={service.hinhAnh}
            alt={service.ten}
            className="service-card-img"
            loading="lazy"
          />
        </Link>
        <div className="service-badges-header">
          <span className="service-category-badge">
            {getCategoryLabel(service.loai)}
          </span>

          {service.isTop && (
            <span className="service-top-badge" title="Dịch vụ được đặt nhiều nhất tại Cố Đô">
              ⭐ Được Đặt Nhiều
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

      <div className="service-card-body">
        <h3 className="service-card-title">
          <Link to={`/dich-vu/${service.id}`} onClick={handleDetailNav}>{service.ten}</Link>
        </h3>
        <p className="service-card-desc">{service.moTa}</p>

        <div className="service-card-footer">
          <div className="service-price-block">
            <span className="service-price-label">Đơn giá niêm yết</span>
            <span className="service-price-value">
              {formatCurrency(service.gia)}
            </span>
          </div>

          <div className="service-card-actions-group">
            <Link
              to={`/dich-vu/${service.id}`}
              className="btn-service-detail"
              title="Xem chi tiết dịch vụ này"
              onClick={handleDetailNav}
            >
              Chi tiết
            </Link>

            {quantity > 0 ? (
              <div className="card-qty-stepper" aria-label={`Số lượng đã chọn: ${quantity}`}>
                <button
                  type="button"
                  className="btn-qty-step"
                  onClick={() => updateQuantity(service.id, -1)}
                  aria-label="Giảm 1 sản phẩm"
                >
                  <Icon name="minus" size={13} />
                </button>
                <span className="qty-step-value" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  className="btn-qty-step"
                  onClick={() => updateQuantity(service.id, 1)}
                  aria-label="Tăng 1 sản phẩm"
                >
                  <Icon name="plus" size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-service-add-cart"
                onClick={handleAddToCart}
                aria-label={`Thêm ${service.ten} vào giỏ hàng`}
                title="Thêm vào giỏ hàng"
              >
                <Icon name="plus" size={15} />
                <span>Thêm giỏ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
