import { useParams, Link } from "react-router";
import { useFetch } from "../lib/useFetch";
import { dichVuSchema } from "../features/services/types";
import { formatCurrency, getCategoryLabel } from "../lib/formatters";
import { useCartStore } from "../features/packages/cartStore";
import { useToastStore } from "../lib/toastStore";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { Skeleton } from "../components/common/UI";
import { assertNever } from "../lib/types";
import "./ServiceDetailPage.css";

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === id));
  const quantity = cartItem?.soLuong || 0;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addToast = useToastStore((s) => s.addToast);

  const { state } = useFetch(`/api/dich-vu/${id}`, dichVuSchema);

  if (state.status === "loading") {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <Skeleton height="360px" borderRadius="var(--radius-lg)" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <Icon name="alert" size={48} color="var(--danger)" />
        <h2 style={{ marginTop: "16px" }}>Không tìm thấy dịch vụ</h2>
        <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>{state.message}</p>
        <Link to="/dich-vu">
          <Button variant="primary">Quay lại danh sách dịch vụ</Button>
        </Link>
      </div>
    );
  }

  if (state.status !== "success") return assertNever(state);
  const service = state.data;

  const handleAddToCart = () => {
    addItem({
      id: service.id,
      ten: service.ten,
      gia: service.gia,
      hinhAnh: service.hinhAnh,
      loai: service.loai,
    });
    addToast(`Đã thêm "${service.ten}" vào giỏ dịch vụ!`, "success");
  };

  return (
    <div className="service-detail-root">
      <div className="container">
        <nav className="detail-breadcrumb" aria-label="Đường dẫn trang">
          <Link to="/">Trang Chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/dich-vu">Dịch Vụ Lẻ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{service.ten}</span>
        </nav>

        <div className="service-detail-card">
          <div className="service-detail-media">
            <img src={service.hinhAnh} alt={service.ten} className="service-detail-img" />
            <span className="service-detail-badge">
              {getCategoryLabel(service.loai)}
            </span>
          </div>

          <div className="service-detail-info">
            <h1 className="service-detail-title">{service.ten}</h1>
            <p className="service-detail-desc">{service.moTa}</p>

            <div className="service-detail-pricing">
              <span className="pricing-title">Đơn giá niêm yết</span>
              <strong className="pricing-number">{formatCurrency(service.gia)}</strong>
            </div>

            <div className="service-features-list">
              <div className="feature-item">
                <Icon name="check" size={18} color="var(--secondary)" />
                <span>Cam kết chất lượng phục trang và góc máy di sản Cố đô</span>
              </div>
              <div className="feature-item">
                <Icon name="check" size={18} color="var(--secondary)" />
                <span>Ekip chuyên nghiệp hơn 10 năm kinh nghiệm phong cách cung đình</span>
              </div>
              <div className="feature-item">
                <Icon name="check" size={18} color="var(--secondary)" />
                <span>Hỗ trợ may đo, thử đồ và dặm trang điểm xuyên suốt buổi chụp</span>
              </div>
            </div>

            <div className="service-detail-actions">
              {quantity > 0 ? (
                <div className="service-detail-stepper">
                  <button
                    type="button"
                    className="btn-stepper-step"
                    onClick={() => updateQuantity(service.id, -1)}
                    aria-label="Giảm số lượng"
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="stepper-val">Đã chọn: {quantity}</span>
                  <button
                    type="button"
                    className="btn-stepper-step"
                    onClick={() => updateQuantity(service.id, 1)}
                    aria-label="Tăng số lượng"
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  leftIcon={<Icon name="cart" size={18} />}
                >
                  Thêm Vào Giỏ Hàng
                </Button>
              )}

              <Link to="/dat-lich">
                <Button variant="secondary" size="lg" leftIcon={<Icon name="sparkles" size={18} />}>
                  Đặt Lịch Chụp Ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

