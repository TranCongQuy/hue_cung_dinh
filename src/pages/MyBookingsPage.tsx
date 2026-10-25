import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import { useFetch } from "../lib/useFetch";
import { yeuCauListSchema, YeuCau, TrangThaiYeuCau } from "../features/requests/types";
import { formatCurrency, formatDate, getStatusInfo, calculateRefundPolicy } from "../lib/formatters";
import { Button, SkeletonCard } from "../components/common/UI";
import { Modal } from "../components/common/Modal";
import { Icon } from "../components/common/Icon";
import { useToastStore } from "../lib/toastStore";
import { SupabaseService } from "../lib/supabaseAdapter";
import { isSupabaseConfigured } from "../lib/supabase";
import "./MyBookingsPage.css";

/* ==========================================================================
   TABS TRẠNG THÁI CHO KHÁCH HÀNG
   ========================================================================== */
const STATUS_TABS: Array<{ id: "all" | TrangThaiYeuCau; label: string }> = [
  { id: "all", label: "Tất Cả Đơn" },
  { id: "cho-xu-ly", label: "Chờ Xử Lý" },
  { id: "da-duyet", label: "Đã Duyệt" },
  { id: "da-lien-he", label: "Đã Liên Hệ" },
  { id: "hoan-thanh", label: "Hoàn Thành" },
  { id: "tu-choi", label: "Đã Hủy" },
];

export function MyBookingsPage() {
  const { user } = useAuth();
  const addToast = useToastStore((s) => s.addToast);

  // Số điện thoại hoặc mã đơn dùng để tra cứu
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | TrangThaiYeuCau>("all");
  const [cancelTarget, setCancelTarget] = useState<YeuCau | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Nạp toàn bộ danh sách đơn
  const { state, refetch } = useFetch("/api/yeu-cau", yeuCauListSchema);

  // Lọc đơn theo số điện thoại / mã đơn và Tab trạng thái
  const filteredRequests = useMemo(() => {
    if (state.status !== "success") return [];
    let list = state.data;

    // 1. Lọc theo từ khóa tra cứu (SĐT hoặc mã đơn hoặc họ tên)
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (r) =>
          r.soDienThoai.includes(term) ||
          r.id.toLowerCase().includes(term) ||
          r.tenKhach.toLowerCase().includes(term)
      );
    } else if (user && user.vaiTro === "user") {
      // Nếu đã đăng nhập tài khoản user nhưng chưa gõ gì, tự động lọc đơn theo tên khách hàng
      const userMatch = list.filter((r) =>
        r.tenKhach.toLowerCase().includes(user.ten.toLowerCase())
      );
      if (userMatch.length > 0) list = userMatch;
    }

    // 2. Lọc theo Tab trạng thái
    if (activeTab !== "all") {
      list = list.filter((r) => r.trangThai === activeTab);
    }

    return list;
  }, [state, searchTerm, activeTab, user]);

  // Xử lý Hủy đơn yêu cầu (Khớp chuẩn US#4 trong PRD của thầy)
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      let ok = false;
      if (isSupabaseConfigured) {
        ok = await SupabaseService.updateRequestStatus(cancelTarget.id, "tu-choi");
      }
      if (!ok) {
        const res = await fetch(`/api/yeu-cau/${cancelTarget.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trangThai: "tu-choi" }),
        });
        if (res.ok) ok = true;
      }

      addToast(`Đã hủy đơn yêu cầu #${cancelTarget.id} thành công!`, "info");
      setCancelTarget(null);
      refetch();
    } catch {
      addToast("Không thể hủy đơn lúc này. Vui lòng thử lại sau.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="my-bookings-page">
      {/* 1. Header Banner Hoàng Gia */}
      <section className="my-bookings-hero">
        <div className="container">
          <div className="hero-badge">
            <Icon name="check" size={14} />
            <span>Tra Cứu Tiến Độ Hôn Lễ Hoàng Triều</span>
          </div>
          <h1 className="my-bookings-title">Lịch Sử Đơn Hàng & Lịch Hẹn Của Quý Khách</h1>
          <p className="my-bookings-subtitle">
            Theo dõi tiến trình xét duyệt gói cưới, lịch trải nghiệm cổ phục và quản lý các yêu cầu
            tư vấn đã gửi đến Hoàng Triều Huế.
          </p>

          {/* Thanh tra cứu tức thì theo SĐT / Mã Đơn */}
          <div className="my-bookings-search-bar">
            <div className="search-input-wrapper">
              <Icon name="search" size={20} color="var(--primary)" />
              <input
                type="text"
                placeholder="Nhập Số điện thoại hoặc Mã đơn (Ví dụ: 0912345678 hoặc yc-01)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Tra cứu đơn yêu cầu"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchTerm("")}
                  title="Xóa tìm kiếm"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
            <Button variant="primary" onClick={() => refetch()}>
              Tra Cứu Đơn
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Nội dung danh sách đơn */}
      <section className="my-bookings-content container">
        {/* Bộ lọc trạng thái */}
        <div className="my-bookings-tabs" role="tablist" aria-label="Bộ lọc trạng thái đơn">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`booking-tab-btn ${activeTab === tab.id ? "booking-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trạng thái tải dữ liệu */}
        {state.status === "loading" && (
          <div className="my-bookings-loading-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Trạng thái lỗi */}
        {state.status === "error" && (
          <div className="my-bookings-error-box">
            <Icon name="alert" size={36} color="var(--danger)" />
            <h3>Không thể tải danh sách đơn</h3>
            <p>{state.message}</p>
            <Button variant="secondary" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        )}

        {/* Trạng thái thành công */}
        {state.status === "success" && (
          <>
            {filteredRequests.length === 0 ? (
              <div className="my-bookings-empty-state">
                <div className="empty-icon-box">
                  <Icon name="cart" size={48} color="var(--secondary)" />
                </div>
                <h3>Chưa tìm thấy đơn yêu cầu nào</h3>
                <p>
                  {searchTerm
                    ? `Không tìm thấy đơn nào trùng khớp với từ khóa "${searchTerm}". Quý khách vui lòng kiểm tra lại số điện thoại.`
                    : "Quý khách chưa có đơn đặt lịch hoặc yêu cầu tư vấn nào. Hãy khám phá các gói cưới hoàng triều tuyệt mỹ ngay hôm nay!"}
                </p>
                <div className="empty-actions">
                  <Link to="/goi-cuoi">
                    <Button variant="primary">Khám Phá Gói Cưới</Button>
                  </Link>
                  <Link to="/dat-lich">
                    <Button variant="secondary">Đặt Lịch Ngay</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="my-bookings-grid">
                {filteredRequests.map((req) => {
                  const status = getStatusInfo(req.trangThai);
                  const canCancel = req.trangThai === "cho-xu-ly" || req.trangThai === "da-duyet";

                  return (
                    <div key={req.id} className="my-booking-card">
                      <div className="card-header">
                        <div className="order-code-badge">
                          <span>MÃ ĐƠN:</span>
                          <strong>#{req.id}</strong>
                        </div>
                        <span className={`status-pill status-${status.variant}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="card-body">
                        <h3 className="card-customer-name">{req.tenKhach}</h3>
                        <p className="card-phone">
                          <Icon name="check" size={14} color="var(--secondary)" />
                          Số liên hệ: <strong>{req.soDienThoai}</strong>
                        </p>

                        <div className="booking-details-box">
                          <div className="detail-row">
                            <span className="detail-label">Ngày tổ chức:</span>
                            <span className="detail-val fw-bold">{formatDate(req.ngayCuoi)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Quy mô tiệc:</span>
                            <span className="detail-val">{req.soLuongKhach} quan khách</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Dự toán ngân sách:</span>
                            <span className="detail-val text-primary fw-bold">
                              {formatCurrency(req.nganSach)}
                            </span>
                          </div>
                          {req.goiDeXuatId && (
                            <div className="detail-row">
                              <span className="detail-label">Mã gói cưới:</span>
                              <span className="detail-val tag-package">{req.goiDeXuatId}</span>
                            </div>
                          )}
                        </div>

                        {req.ghiChu && (
                          <div className="card-notes">
                            <span className="notes-label">Yêu cầu đặc biệt:</span>
                            <p className="notes-content">{req.ghiChu}</p>
                          </div>
                        )}
                      </div>

                      <div className="card-footer">
                        <span className="order-date-text">
                          Khởi tạo: {formatDate(req.ngayTao)}
                        </span>
                        <div className="card-actions">
                          {canCancel ? (
                            <Button
                              variant="danger"
                              onClick={() => setCancelTarget(req)}
                              title="Hủy đơn yêu cầu này"
                            >
                              Hủy Đơn
                            </Button>
                          ) : req.trangThai === "tu-choi" ? (
                            <span className="text-muted fst-italic">Đã hủy</span>
                          ) : (
                            <span className="text-muted fst-italic">Đã hoàn tất</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* 3. Modal xác nhận hủy đơn với Chính sách Hoàn cọc phân tầng */}
      <Modal
        isOpen={Boolean(cancelTarget)}
        title="Xác Nhận Hủy Đơn & Chính Sách Hoàn Cọc"
        onClose={() => setCancelTarget(null)}
      >
        {cancelTarget && (() => {
          const policy = calculateRefundPolicy(cancelTarget.ngayCuoi, cancelTarget.nganSach);
          return (
            <div className="cancel-confirm-body">
              <p>
                Quý khách có chắc chắn muốn hủy đơn yêu cầu <strong>#{cancelTarget.id}</strong> (Khách hàng: <strong>{cancelTarget.tenKhach}</strong>)?
              </p>

              {/* Hộp chính sách hoàn cọc minh bạch */}
              <div
                style={{
                  margin: "16px 0",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-color)" }}>
                    Thời gian còn lại đến ngày cưới:
                  </span>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                    {policy.daysRemaining > 0 ? `${policy.daysRemaining} ngày` : "Đã đến/qua ngày cưới"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-color)" }}>Mức độ hoàn cọc:</span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      backgroundColor:
                        policy.tierVariant === "success"
                          ? "rgba(22, 163, 74, 0.15)"
                          : policy.tierVariant === "warning"
                          ? "rgba(217, 119, 6, 0.15)"
                          : "rgba(220, 38, 38, 0.15)",
                      color:
                        policy.tierVariant === "success"
                          ? "#16a34a"
                          : policy.tierVariant === "warning"
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  >
                    {policy.tierLabel}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-color)",
                    fontSize: "0.85rem",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <span className="text-muted">Tiền cọc 20%:</span>{" "}
                    <strong>{formatCurrency(policy.depositAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Hoàn trả dự kiến:</span>{" "}
                    <strong style={{ color: policy.refundAmount > 0 ? "#16a34a" : "var(--text-muted)" }}>
                      {formatCurrency(policy.refundAmount)}
                    </strong>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: "1.4",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  ℹ️ {policy.explanation}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", width: "100%", marginTop: "16px" }}>
                <Button variant="secondary" onClick={() => setCancelTarget(null)} disabled={isCancelling}>
                  Giữ Lại Đơn
                </Button>
                <Button variant="danger" onClick={handleConfirmCancel} disabled={isCancelling}>
                  {isCancelling ? "Đang xử lý..." : "Xác Nhận Hủy Đơn"}
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
