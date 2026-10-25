import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router";
import { useFetch } from "../lib/useFetch";
import { dichVuSchema, dichVuListSchema } from "../features/services/types";
import { formatCurrency, getCategoryLabel } from "../lib/formatters";
import { useCartStore } from "../features/packages/cartStore";
import { useToastStore } from "../lib/toastStore";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { Skeleton } from "../components/common/UI";
import { ServiceCard } from "../features/services/components/ServiceCard";
import { assertNever } from "../lib/types";
import "./ServiceDetailPage.css";

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rv-1",
    name: "Phan Nhật Nam",
    rating: 5,
    date: "18/10/2026",
    comment: "Chất lượng dịch vụ hoàn hảo, phục trang đúng chuẩn cung đình triều Nguyễn, thêu tay tinh xảo và vừa vặn.",
  },
  {
    id: "rv-2",
    name: "Lê Thị Thảo My",
    rating: 5,
    date: "12/10/2026",
    comment: "Ekip nhiệt tình, hướng dẫn tạo dáng rất duyên dáng và cổ kính. Rất xứng đáng trải nghiệm!",
  },
];

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const cartItem = useCartStore((s) => s.items.find((i) => i.id === id));
  const quantity = cartItem?.soLuong || 0;
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const addToast = useToastStore((s) => s.addToast);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const { state } = useFetch(`/api/dich-vu/${id}`, dichVuSchema);
  const { state: allServicesState } = useFetch("/api/dich-vu", dichVuListSchema);

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
    addToast(`Đã thêm "${service.ten}" vào giỏ dịch vụ!`, "success", 5000);
  };

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      addToast("Vui lòng điền họ tên và nội dung đánh giá!", "warning", 4000);
      return;
    }
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      rating: newReviewRating,
      date: new Date().toLocaleDateString("vi-VN"),
      comment: newReviewComment.trim(),
    };
    setReviews([newRev, ...reviews]);
    setNewReviewName("");
    setNewReviewComment("");
    addToast("Cảm ơn bạn đã gửi đánh giá trải nghiệm dịch vụ!", "success", 5000);
  };

  // Lọc các dịch vụ tương tự (cùng loại hoặc khác id)
  const relatedServices = allServicesState.status === "success"
    ? allServicesState.data.filter((s) => s.id !== service.id).slice(0, 3)
    : [];

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

              <Link to={`/dat-lich?dichVu=${service.id}&diaDiem=${service.loai === "dia-diem" ? service.id : "dai-noi"}`}>
                <Button variant="secondary" size="lg" leftIcon={<Icon name="sparkles" size={18} />}>
                  Đặt Lịch Dịch Vụ Này
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. MẪU THAM KHẢO & DỊCH VỤ TƯƠNG TỰ */}
        {relatedServices.length > 0 && (
          <div className="detail-section-block">
            <div className="detail-section-header">
              <h3 className="detail-section-title">
                <Icon name="sparkles" size={20} color="var(--secondary)" />
                Mẫu Tham Khảo & Dịch Vụ Cùng Phong Cách
              </h3>
              <Link to="/dich-vu" style={{ fontSize: "0.88rem", color: "var(--primary)", fontWeight: 600 }}>
                Xem tất cả dịch vụ →
              </Link>
            </div>
            <div className="related-services-grid">
              {relatedServices.map((relSvc) => (
                <ServiceCard key={relSvc.id} service={relSvc} />
              ))}
            </div>
          </div>
        )}

        {/* 2. BÌNH LUẬN & ĐÁNH GIÁ CỦA KHÁCH HÀNG */}
        <div className="detail-section-block">
          <div className="detail-section-header">
            <h3 className="detail-section-title">
              <Icon name="heart" size={20} color="var(--secondary)" />
              Đánh Giá & Cảm Nhận Của Khách Hàng ({reviews.length})
            </h3>
          </div>

          <div className="reviews-container">
            <div className="reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-item-card">
                  <div className="review-card-header">
                    <div className="reviewer-profile">
                      <div className="reviewer-avatar-circle">
                        {rev.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="reviewer-name">{rev.name}</h4>
                        <span className="review-date">{rev.date}</span>
                      </div>
                    </div>
                    <div className="review-rating-stars">
                      {"★".repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="review-comment-text">{rev.comment}</p>
                </div>
              ))}
            </div>

            <form className="review-form-card" onSubmit={handleAddReview}>
              <h4 className="review-form-title">Gửi Đánh Giá Của Bạn</h4>
              <div className="review-input-group">
                <label>Họ và tên của bạn:</label>
                <input
                  type="text"
                  className="review-input"
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  required
                />
              </div>

              <div className="review-input-group">
                <label>Đánh giá trải nghiệm:</label>
                <div className="star-rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="star-clickable"
                      onClick={() => setNewReviewRating(star)}
                      style={{ opacity: star <= newReviewRating ? 1 : 0.3 }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-input-group">
                <label>Cảm nhận của bạn:</label>
                <textarea
                  className="review-textarea"
                  placeholder="Chia sẻ trải nghiệm về phục trang, ekip chụp hoặc chất lượng ảnh..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="md">
                Gửi Đánh Giá Ngay
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

