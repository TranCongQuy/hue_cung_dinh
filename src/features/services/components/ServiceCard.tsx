import { Link } from "react-router";
import { DichVu } from "../types";
import { formatCurrency, getCategoryLabel } from "../../../lib/formatters";
import { useCartStore } from "../../packages/cartStore";
import { useToastStore } from "../../../lib/toastStore";
import { Icon } from "../../../components/common/Icon";
import "./ServiceCard.css";

interface ServiceCardProps {
  service: DichVu;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === service.id));
  const quantity = cartItem?.soLuong || 0;
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddToCart = () => {
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
        <Link to={`/dich-vu/${service.id}`} className="service-card-link-img">
          <img
            src={service.hinhAnh}
            alt={service.ten}
            className="service-card-img"
            loading="lazy"
          />
        </Link>
        <span className="service-category-badge">
          {getCategoryLabel(service.loai)}
        </span>

        {service.isTop && (
          <span className="service-top-badge" title="Dịch vụ được đặt nhiều nhất tại Cố Đô">
            ⭐ Được Đặt Nhiều
          </span>
        )}

        {quantity > 0 && (
          <span className="card-selected-counter-badge" aria-label={`Đã chọn ${quantity}`}>
            <Icon name="check" size={12} />
            Đã chọn: {quantity}
          </span>
        )}
      </div>

      <div className="service-card-body">
        <h3 className="service-card-title">
          <Link to={`/dich-vu/${service.id}`}>{service.ten}</Link>
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
