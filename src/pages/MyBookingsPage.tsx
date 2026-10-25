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
import { RoyalContractA4Modal } from "../features/requests/components/RoyalContractA4Modal";
import { FixedFloatingRings } from "../components/common/FixedFloatingRings";
import "./MyBookingsPage.css";

/* ==========================================================================
   TABS TRẠNG THÁI CHO KHÁCH HÀNG
   ========================================================================== */
const STATUS_TABS: Array<{ id: "all" | TrangThaiYeuCau; label: string }> = [
  { id: "all", label: "Tất Cả Đơn" },
  { id: "cho-xu-ly", label: "Chờ Duyệt" },
  { id: "da-duyet", label: "Đã Duyệt" },
  { id: "da-lien-he", label: "Đã Liên Hệ" },
  { id: "hoan-thanh", label: "Hoàn Tất" },
  { id: "tu-choi", label: "Đã Hủy" },
];

export function MyBookingsPage() {
  const { user } = useAuth();
  const addToast = useToastStore((s) => s.addToast);

  // Tra cứu theo SĐT hoặc mã đơn
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | TrangThaiYeuCau>("all");
  const [cancelTarget, setCancelTarget] = useState<YeuCau | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Chi tiết đơn & Xuất hợp đồng Modal states
  const [detailTarget, setDetailTarget] = useState<YeuCau | null>(null);
  const [contractTarget, setContractTarget] = useState<YeuCau | null>(null);
  const [supplementNotes, setSupplementNotes] = useState("");
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Nạp toàn bộ danh sách đơn
  const { state, refetch } = useFetch("/api/yeu-cau", yeuCauListSchema);

  // Lọc đơn
  const filteredRequests = useMemo(() => {
    if (state.status !== "success") return [];
    let list = state.data;

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (r) =>
          r.soDienThoai.includes(term) ||
          r.id.toLowerCase().includes(term) ||
          r.tenKhach.toLowerCase().includes(term) ||
          (r.tenDon && r.tenDon.toLowerCase().includes(term))
      );
    } else if (user && user.vaiTro === "user") {
      const userMatch = list.filter((r) =>
        r.tenKhach.toLowerCase().includes(user.ten.toLowerCase())
      );
      if (userMatch.length > 0) list = userMatch;
    }

    if (activeTab !== "all") {
      list = list.filter((r) => r.trangThai === activeTab);
    }

    return list;
  }, [state, searchTerm, activeTab, user]);

  // Mở modal chi tiết
  const handleOpenDetail = (req: YeuCau) => {
    setDetailTarget(req);
    setSupplementNotes(req.mongMuonBoSung || "");
  };

  // Lưu mong muốn bổ sung cho bộ ảnh cưới
  const handleSaveSupplementNotes = async () => {
    if (!detailTarget) return;
    setIsUpdatingNotes(true);
    try {
      const ok = await SupabaseService.updateRequestNotes(detailTarget.id, supplementNotes);
      if (ok) {
        addToast("Đã lưu bổ sung mong muốn chụp ảnh thành công!", "success", 5000);
        refetch();
        setDetailTarget({
          ...detailTarget,
          mongMuonBoSung: supplementNotes,
        });
      } else {
        throw new Error("Không thể cập nhật ghi chú");
      }
    } catch {
      addToast("Không thể lưu lúc này. Vui lòng thử lại sau.", "error", 5000);
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  // Xử lý Hủy đơn
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      let ok = await SupabaseService.updateRequestStatus(cancelTarget.id, "tu-choi");
      if (!ok) {
        const res = await fetch(`/api/yeu-cau/${cancelTarget.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trangThai: "tu-choi" }),
        });
        if (res.ok) ok = true;
      }

      addToast(`Đã hủy đơn yêu cầu #${cancelTarget.id} thành công!`, "info", 5000);
      setCancelTarget(null);
      if (detailTarget && detailTarget.id === cancelTarget.id) {
        setDetailTarget(null);
      }
      refetch();
    } catch {
      addToast("Không thể hủy đơn lúc này. Vui lòng thử lại sau.", "error", 5000);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="my-bookings-page">
      <FixedFloatingRings />

      {/* 1. Header Banner Hoàng Gia */}
      <section className="my-bookings-hero">
        <div className="container">
          <div className="hero-badge">
            <Icon name="check" size={14} />
            <span>Tiến Độ Chụp Ảnh &amp; Hôn Lễ Hoàng Triều</span>
          </div>
          <h1 className="my-bookings-title">Quản Lý &amp; Tra Cứu Đơn Đặt Lịch Chụp Ảnh</h1>
          <p className="my-bookings-subtitle">
            Theo dõi tiến trình xét duyệt gói chụp ảnh, địa điểm di sản Đại Nội, bổ sung mong muốn chụp ảnh và xem hợp đồng pháp lý A4.
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
                aria-label="Tra cứu đơn chụp ảnh"
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
              Tra Cứu
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
                <h3>Chưa có dữ liệu đơn chụp ảnh nào</h3>
                <p>
                  {searchTerm
                    ? `Không tìm thấy đơn nào trùng khớp với từ khóa "${searchTerm}". Quý khách vui lòng kiểm tra lại.`
                    : "Quý khách chưa có đơn đặt lịch chụp ảnh nào. Hãy bắt đầu chọn gói chụp di sản hoặc dịch vụ lẻ hoàng triều ngay hôm nay!"}
                </p>
                <div className="empty-actions">
                  <Link to="/goi-cuoi">
                    <Button variant="primary">Khám Phá Gói Cưới</Button>
                  </Link>
                  <Link to="/dich-vu">
                    <Button variant="secondary">Xem Dịch Vụ Lẻ</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="my-bookings-grid">
                {filteredRequests.map((req) => {
                  const status = getStatusInfo(req.trangThai);
                  const canCancel = req.trangThai === "cho-xu-ly" || req.trangThai === "da-duyet";
                  const isApproved = req.trangThai === "da-duyet";

                  return (
                    <div key={req.id} className="my-booking-card">
                      <div className="card-header">
                        <div className="order-code-badge">
                          <span>MÃ ĐƠN:</span>
                          <strong>#{req.id.toUpperCase()}</strong>
                        </div>
                        <span className={`status-pill status-${status.variant}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="card-body">
                        {/* Tên đơn rõ ràng */}
                        <h3 className="card-order-title">
                          {req.tenDon || `Gói Chụp Ảnh Cung Đình #${req.goiDeXuatId || "VIP"}`}
                        </h3>

                        <div className="card-customer-row">
                          <Icon name="user" size={15} color="var(--primary)" />
                          <span>Khách hàng: <strong>{req.tenKhach}</strong></span>
                        </div>
                        <div className="card-phone-row">
                          <Icon name="check" size={15} color="var(--secondary)" />
                          <span>Liên hệ: <strong>{req.soDienThoai}</strong></span>
                        </div>

                        <div className="booking-details-box">
                          <div className="detail-row">
                            <span className="detail-label">Ngày chụp dự kiến:</span>
                            <span className="detail-val fw-bold">{formatDate(req.ngayCuoi)}</span>
                          </div>
                          {/* ĐÃ LOẠI BỎ TRIỆT ĐỂ QUY MÔ TIỆC, THAY BẰNG ĐỊA ĐIỂM CHỤP DI SẢN */}
                          <div className="detail-row">
                            <span className="detail-label">Địa điểm di sản:</span>
                            <span className="detail-val heritage-location">
                              {req.diaDiemChup || "Đại Nội Cố Đô Huế & Lăng Tẩm"}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Tổng chi phí gói:</span>
                            <span className="detail-val text-primary fw-bold">
                              {formatCurrency(req.nganSach || 0)}
                            </span>
                          </div>
                        </div>

                        {req.mongMuonBoSung && (
                          <div className="card-notes">
                            <span className="notes-label">Mong muốn chụp ảnh:</span>
                            <p className="notes-content">{req.mongMuonBoSung}</p>
                          </div>
                        )}
                      </div>

                      <div className="card-footer">
                        <span className="order-date-text">
                          Ngày tạo: {formatDate(req.ngayTao)}
                        </span>
                        <div className="card-actions">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenDetail(req)}
                          >
                            Chi Tiết Đơn
                          </Button>

                          {/* NÚT XUẤT HỢP ĐỒNG A4 KHI ĐÃ ĐƯỢC DUYỆT */}
                          {isApproved && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setContractTarget(req)}
                              leftIcon={<Icon name="printer" size={14} />}
                            >
                              Xuất Hợp Đồng A4
                            </Button>
                          )}

                          {canCancel && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setCancelTarget(req)}
                              title="Hủy đơn chụp ảnh này"
                            >
                              Hủy Đơn
                            </Button>
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

      {/* 3. MODAL CHI TIẾT ĐƠN & BỔ SUNG MONG MUỐN */}
      <Modal
        isOpen={Boolean(detailTarget)}
        title={`Chi Tiết Đơn Hàng #${detailTarget?.id.toUpperCase()}`}
        onClose={() => setDetailTarget(null)}
      >
        {detailTarget && (() => {
          const status = getStatusInfo(detailTarget.trangThai);
          const isApproved = detailTarget.trangThai === "da-duyet";
          const canCancel = detailTarget.trangThai === "cho-xu-ly" || detailTarget.trangThai === "da-duyet";

          return (
            <div className="order-detail-modal-body">
              <div className="detail-modal-header">
                <div>
                  <h3 className="modal-order-name">
                    {detailTarget.tenDon || `Gói Cưới Hoàng Gia #${detailTarget.goiDeXuatId || "VIP"}`}
                  </h3>
                  <span className="modal-created-time">Khởi tạo lúc: {formatDate(detailTarget.ngayTao)}</span>
                </div>
                <span className={`status-pill status-${status.variant}`}>
                  {status.label}
                </span>
              </div>

              <div className="detail-modal-grid">
                <div className="info-item">
                  <span className="info-title">Khách hàng đăng ký:</span>
                  <span className="info-data">{detailTarget.tenKhach}</span>
                </div>
                <div className="info-item">
                  <span className="info-title">Số điện thoại liên hệ:</span>
                  <span className="info-data">{detailTarget.soDienThoai}</span>
                </div>
                <div className="info-item">
                  <span className="info-title">Ngày chụp ảnh dự kiến:</span>
                  <span className="info-data fw-bold">{formatDate(detailTarget.ngayCuoi)}</span>
                </div>
                <div className="info-item">
                  <span className="info-title">Địa điểm chụp di sản:</span>
                  <span className="info-data">{detailTarget.diaDiemChup || "Đại Nội Cố Đô Huế & Lăng Tẩm Hoàng Gia"}</span>
                </div>
                <div className="info-item">
                  <span className="info-title">Tổng chi phí dự kiến:</span>
                  <span className="info-data text-primary fw-bold">{formatCurrency(detailTarget.nganSach || 0)}</span>
                </div>
                <div className="info-item">
                  <span className="info-title">Tiền cọc giữ lịch (20%):</span>
                  <span className="info-data">{formatCurrency(Math.round((detailTarget.nganSach || 0) * 0.2))}</span>
                </div>
              </div>

              {/* Danh sách các dịch vụ trong đơn */}
              {detailTarget.danhSachDichVu && detailTarget.danhSachDichVu.length > 0 && (
                <div className="detail-services-list">
                  <h4 className="detail-section-title">Danh sách hạng mục trong gói:</h4>
                  <ul>
                    {detailTarget.danhSachDichVu.map((item, i) => (
                      <li key={i}>
                        <span>{item.ten} (x{item.soLuong})</span>
                        <strong>{formatCurrency(item.gia)}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* BỔ SUNG THÊM MONG MUỐN / GHI CHÚ CHỤP ẢNH */}
              <div className="supplement-notes-box">
                <h4 className="detail-section-title">
                  <Icon name="sparkles" size={16} color="var(--primary)" />
                  Bổ sung mong muốn &amp; yêu cầu chụp ảnh:
                </h4>
                <p className="supplement-hint">
                  Quý khách muốn thêm góc chụp hoàng hôn, đổi màu cổ phục hoặc lưu ý đặc biệt cho ekip nhiếp ảnh?
                </p>
                <textarea
                  className="input-control"
                  rows={3}
                  placeholder="Nhập mong muốn bổ sung của quý khách tại đây..."
                  value={supplementNotes}
                  onChange={(e) => setSupplementNotes(e.target.value)}
                />
                <div className="save-notes-btn-wrap">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveSupplementNotes}
                    isLoading={isUpdatingNotes}
                    leftIcon={<Icon name="check" size={14} />}
                  >
                    Lưu Bổ Sung Mong Muốn
                  </Button>
                </div>
              </div>

              {/* HÀNH ĐỘNG MODAL: XUẤT HỢP ĐỒNG & HỦY ĐƠN */}
              <div className="detail-modal-footer">
                <div className="modal-footer-left">
                  {canCancel && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setCancelTarget(detailTarget)}
                    >
                      Hủy Đơn Này
                    </Button>
                  )}
                </div>

                <div className="modal-footer-right">
                  {isApproved && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setContractTarget(detailTarget)}
                      leftIcon={<Icon name="printer" size={16} />}
                    >
                      Xem &amp; Xuất Hợp Đồng A4
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => setDetailTarget(null)}>
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 4. MODAL XUẤT HỢP ĐỒNG A4 PHÁP LÝ */}
      <RoyalContractA4Modal
        request={contractTarget}
        onClose={() => setContractTarget(null)}
      />

      {/* 5. MODAL XÁC NHẬN HỦY ĐƠN VỚI CHÍNH SÁCH HOÀN CỌC */}
      <Modal
        isOpen={Boolean(cancelTarget)}
        title="Xác Nhận Hủy Đơn &amp; Chính Sách Hoàn Cọc"
        onClose={() => setCancelTarget(null)}
      >
        {cancelTarget && (() => {
          const policy = calculateRefundPolicy(cancelTarget.ngayCuoi, cancelTarget.nganSach || 0);
          return (
            <div className="cancel-confirm-body">
              <p>
                Quý khách có chắc chắn muốn hủy đơn <strong>#{cancelTarget.id.toUpperCase()}</strong> ({cancelTarget.tenDon || "Gói Chụp Ảnh Cung Đình"})?
              </p>

              <div className="policy-refund-box">
                <div className="policy-row">
                  <span>Thời gian còn lại đến ngày chụp ảnh:</span>
                  <strong className="text-primary">
                    {policy.daysRemaining > 0 ? `${policy.daysRemaining} ngày` : "Đã đến/qua ngày hẹn"}
                  </strong>
                </div>

                <div className="policy-row">
                  <span>Chính sách hoàn trả:</span>
                  <span className={`refund-tag tag-${policy.tierVariant}`}>
                    {policy.tierLabel}
                  </span>
                </div>

                <div className="policy-calc-grid">
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

                <p className="policy-explain">ℹ️ {policy.explanation}</p>
              </div>

              <div className="cancel-actions-row">
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
