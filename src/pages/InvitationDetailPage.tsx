import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router";
import { useFetch } from "../lib/useFetch";
import { thiepCuoiSchema, thiepCuoiListSchema, ThiepCuoiLoai } from "../features/invitations/types";
import { formatCurrency } from "../lib/formatters";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { Skeleton } from "../components/common/UI";
import { useToastStore } from "../lib/toastStore";
import { RoyalCourtAudio } from "../features/invitations/components/RoyalCourtAudio";
import { InvitationPreviewModal } from "../features/invitations/components/InvitationModals";
import { FixedFloatingRings } from "../components/common/FixedFloatingRings";
import { FloatingContactWidget } from "../components/common/FloatingContactWidget";
import { assertNever } from "../lib/types";
import "./InvitationDetailPage.css";

interface InvitationReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

const INVITATION_REVIEWS: InvitationReview[] = [
  {
    id: "ir-1",
    name: "Tôn Nữ Diễm My",
    rating: 5,
    date: "20/10/2026",
    comment: "Giao diện thiệp VIP quá đỗi sang trọng! Khách mời mở phong bì có âm nhạc cung đình và bản đồ dẫn đường rất tiện lợi.",
  },
  {
    id: "ir-2",
    name: "Nguyễn Vĩnh Kỳ",
    rating: 5,
    date: "15/10/2026",
    comment: "Tích hợp mã QR mừng cưới động cực kỳ tiện cho bạn bè ở xa. Ai nhận được thiệp cũng khen tấm tắc.",
  },
];

export function InvitationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addToast = useToastStore((s) => s.addToast);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ThiepCuoiLoai>("vip");

  const [reviews, setReviews] = useState<InvitationReview[]>(INVITATION_REVIEWS);
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");

  const { state } = useFetch(`/api/thiep-cuoi/${id}`, thiepCuoiSchema);
  const { state: allState } = useFetch("/api/thiep-cuoi", thiepCuoiListSchema);

  if (state.status === "loading") {
    return (
      <div className="container" style={{ padding: "80px 24px" }}>
        <Skeleton height="400px" borderRadius="var(--radius-xl)" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <Icon name="alert" size={48} color="var(--danger)" />
        <h2 style={{ marginTop: "16px" }}>Không tìm thấy mẫu thiệp cưới</h2>
        <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>{state.message}</p>
        <Link to="/thiep-cuoi">
          <Button variant="primary">Quay lại kho mẫu thiệp</Button>
        </Link>
      </div>
    );
  }

  if (state.status !== "success") return assertNever(state);
  const invitation = state.data;

  const tierPrices: Record<ThiepCuoiLoai, number> = {
    basic: 168000,
    pro: 295000,
    vip: 450000,
  };

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      addToast("Vui lòng nhập họ tên và nhận xét!", "warning", 4000);
      return;
    }
    const newRev: InvitationReview = {
      id: `ir-${Date.now()}`,
      name: revName.trim(),
      rating: revRating,
      date: new Date().toLocaleDateString("vi-VN"),
      comment: revComment.trim(),
    };
    setReviews([newRev, ...reviews]);
    setRevName("");
    setRevComment("");
    addToast("Cảm ơn bạn đã gửi đánh giá trải nghiệm mẫu thiệp!", "success", 5000);
  };

  const relatedInvitations = allState.status === "success"
    ? allState.data.filter((i) => i.id !== invitation.id).slice(0, 3)
    : [];

  return (
    <div className="invitation-detail-page-root">
      <FixedFloatingRings />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <nav className="detail-breadcrumb" aria-label="Đường dẫn trang">
          <Link to="/">Trang Chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/thiep-cuoi">Mẫu Thiệp Cưới</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{invitation.ten}</span>
        </nav>

        <div className="invitation-detail-card">
          {/* Cột trái: Phone Frame Demo Mockup */}
          <div className="invitation-detail-visual">
            <div className="invitation-phone-frame">
              <img
                src={invitation.hinhAnh}
                alt={invitation.ten}
                className="invitation-detail-hero-img"
              />
              <div className="invitation-detail-overlay">
                <div className="phone-screen-header">
                  <span className="phone-status-dot" aria-hidden="true" />
                  <RoyalCourtAudio />
                </div>
                <div className="phone-screen-caption">
                  <p className="phone-save-the-date">HÔN LỄ HOÀNG GIA</p>
                  <h3 className="phone-couple-names">{invitation.chuRe} &amp; {invitation.coDau}</h3>
                  <p className="phone-wedding-date">{invitation.ngayCuoi}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-live-preview-launch"
              onClick={() => setPreviewOpen(true)}
            >
              <Icon name="eye" size={18} />
              <span>Xem Thử Trực Tiếp (Live Demo)</span>
            </button>
          </div>

          {/* Cột phải: Thông số, Tính năng & Đăng ký */}
          <div className="invitation-detail-info">
            <span className="invitation-tier-tag">
              Giao Diện {selectedTier.toUpperCase()} • Chuẩn Cung Đình
            </span>
            <h1 className="invitation-detail-title">{invitation.ten}</h1>
            <p className="invitation-detail-desc">{invitation.moTa}</p>

            <div className="tier-selection-selector">
              <span className="tier-selector-label">Chọn Hạng Gói Thiệp:</span>
              <div className="tier-selector-pills">
                {(["vip", "pro", "basic"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tier-btn ${selectedTier === t ? "tier-btn-active" : ""}`}
                    onClick={() => setSelectedTier(t)}
                  >
                    {t === "vip" ? "👑 Gói VIP" : t === "pro" ? "✨ Gói PRO" : "📱 Tiêu Chuẩn"}
                  </button>
                ))}
              </div>
            </div>

            <div className="invitation-detail-pricing">
              <span className="pricing-label">Chi phí kích hoạt trọn đời:</span>
              <div className="pricing-row">
                <strong className="pricing-amount">{formatCurrency(tierPrices[selectedTier])}</strong>
                <span className="pricing-original">{formatCurrency(tierPrices[selectedTier] * 1.5)}</span>
              </div>
            </div>

            <div className="invitation-features-list">
              <div className="feature-row">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Hiệu ứng mở phong bì hoàng triều dập nổi hoa văn sen vàng</span>
              </div>
              <div className="feature-row">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Tích hợp Nhã Nhạc Cung Đình Huế tự động phát du dương</span>
              </div>
              <div className="feature-row">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Mã VietQR mừng cưới thông minh & Bản đồ chỉ đường Google Maps</span>
              </div>
              <div className="feature-row">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Quản lý hòm thư chúc phúc và xác nhận tham dự (RSVP) tức thì</span>
              </div>
            </div>

            <div className="invitation-detail-actions">
              <Link
                to={`/thiep-cuoi/tuy-bien?mauThiepId=${invitation.id}&loai=${selectedTier}`}
                style={{ flex: 1 }}
              >
                <Button variant="primary" size="lg" style={{ width: "100%" }} leftIcon={<Icon name="sparkles" size={18} />}>
                  Khởi Tạo Mẫu Thiệp Này Ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. MẪU THIỆP CƯỚI CÙNG PHONG CÁCH */}
        {relatedInvitations.length > 0 && (
          <div className="detail-section-block">
            <div className="detail-section-header">
              <h3 className="detail-section-title">
                <Icon name="sparkles" size={20} color="var(--secondary)" />
                Mẫu Thiệp Cưới Cùng Phong Cách
              </h3>
              <Link to="/thiep-cuoi" style={{ fontSize: "0.88rem", color: "var(--primary)", fontWeight: 600 }}>
                Xem toàn bộ kho thiệp →
              </Link>
            </div>

            <div className="related-invitations-grid">
              {relatedInvitations.map((relItem) => (
                <div key={relItem.id} className="related-invitation-card">
                  <img src={relItem.hinhAnh} alt={relItem.ten} className="related-invitation-img" />
                  <div className="related-invitation-content">
                    <h4>{relItem.ten}</h4>
                    <p>{relItem.moTa}</p>
                    <Link to={`/thiep-cuoi/${relItem.id}`} className="btn-view-rel-inv">
                      Xem chi tiết ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. BÌNH LUẬN & ĐÁNH GIÁ (FEEDBACK) */}
        <div className="detail-section-block">
          <div className="detail-section-header">
            <h3 className="detail-section-title">
              <Icon name="heart" size={20} color="var(--secondary)" />
              Cảm Nhận & Đánh Giá Của Các Cặp Đôi ({reviews.length})
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
                  placeholder="Ví dụ: Tôn Nữ Bích Trâm"
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  required
                />
              </div>

              <div className="review-input-group">
                <label>Đánh giá số sao:</label>
                <div className="star-rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="star-clickable"
                      onClick={() => setRevRating(star)}
                      style={{ opacity: star <= revRating ? 1 : 0.3 }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-input-group">
                <label>Cảm nhận về giao diện & tính năng thiệp:</label>
                <textarea
                  className="review-textarea"
                  placeholder="Nhận xét về âm nhạc, hiệu ứng mở thiệp, bản đồ..."
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="md">
                Gửi Đánh Giá
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Preview Thiệp Trực Tiếp */}
      {previewOpen && (
        <InvitationPreviewModal
          invitation={invitation}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {/* Floating Action Widget góc màn hình */}
      <FloatingContactWidget pageType="thiep-cuoi" />
    </div>
  );
}
