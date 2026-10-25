import { useState } from "react";
import { useParams, Link } from "react-router";
import { useFetch } from "../lib/useFetch";
import { goiCuoiSchema } from "../features/packages/types";
import { dichVuListSchema, DichVu } from "../features/services/types";
import { formatCurrency, getStyleLabel, getCategoryLabel } from "../lib/formatters";
import { useCartStore } from "../features/packages/cartStore";
import { useToastStore } from "../lib/toastStore";
import { Button, Skeleton } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { Modal } from "../components/common/Modal";
import { QuickConsultForm } from "../features/consultation/components/QuickConsultForm";
import { assertNever } from "../lib/types";
import "./PackageDetailPage.css";

/* ==========================================================================
   1. INCLUDED SERVICE CARD COMPONENT
   ========================================================================== */
interface IncludedServiceCardProps {
  service: DichVu;
  onViewDetail?: (service: DichVu) => void;
}

export function IncludedServiceCard({ service, onViewDetail }: IncludedServiceCardProps) {
  return (
    <div
      className="included-service-item clickable-included-service"
      onClick={() => onViewDetail && onViewDetail(service)}
      role="button"
      tabIndex={0}
      title="Bấm để xem chi tiết dịch vụ này"
    >
      <img src={service.hinhAnh} alt={service.ten} className="included-service-img" />
      <div className="included-service-content">
        <span className="included-service-tag">{getCategoryLabel(service.loai)}</span>
        <h4 className="included-service-name">{service.ten}</h4>
        <p className="included-service-desc">{service.moTa}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span className="included-service-price">Giá gốc: {formatCurrency(service.gia)}</span>
          <span className="quick-view-link">Xem chi tiết ↗</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. PACKAGE DETAIL PAGE COMPONENT
   ========================================================================== */
export function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [quickViewService, setQuickViewService] = useState<DichVu | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const { state: pkgState } = useFetch(`/api/goi-cuoi/${id}`, goiCuoiSchema);
  const { state: servicesState } = useFetch("/api/dich-vu", dichVuListSchema);

  if (pkgState.status === "loading") {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <Skeleton height="350px" borderRadius="var(--radius-lg)" />
        <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Skeleton width="40%" height="36px" />
          <Skeleton width="70%" height="24px" />
        </div>
      </div>
    );
  }

  if (pkgState.status === "error") {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <Icon name="alert" size={48} color="var(--danger)" />
        <h2 style={{ marginTop: "16px" }}>Không tìm thấy gói cưới</h2>
        <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>{pkgState.message}</p>
        <Link to="/goi-cuoi">
          <Button variant="primary">Quay lại danh sách gói</Button>
        </Link>
      </div>
    );
  }

  if (pkgState.status !== "success") return assertNever(pkgState);

  const pkg = pkgState.data;
  const allServices = servicesState.status === "success" ? servicesState.data : [];
  const includedServices = allServices.filter((s) => pkg.danhSachDichVuIds.includes(s.id));
  const originalTotal = includedServices.reduce((sum, s) => sum + s.gia, 0);
  const savings = originalTotal > pkg.giaTronGoi ? originalTotal - pkg.giaTronGoi : 0;

  const handleAddToCart = () => {
    addItem({
      id: pkg.id,
      loai: "combo",
      ten: pkg.ten,
      gia: pkg.giaTronGoi,
      hinhAnh: pkg.hinhAnh,
    });
    addToast(`Đã thêm "${pkg.ten}" vào giỏ hàng cưới của bạn!`, "success", 5000);
  };

  return (
    <div className="package-detail-root">
      <div className="container">
        <nav className="detail-breadcrumb" aria-label="Đường dẫn trang">
          <Link to="/">Trang Chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/goi-cuoi">Gói Cưới Combo</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{pkg.ten}</span>
        </nav>

        <div className="detail-hero-card">
          <div className="detail-media">
            <img src={pkg.hinhAnh} alt={pkg.ten} className="detail-img" />
            <span className={`detail-style-badge badge-${pkg.phongCach}`}>
              {getStyleLabel(pkg.phongCach)}
            </span>
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{pkg.ten}</h1>
            <p className="detail-desc">{pkg.moTa}</p>

            <div className="detail-pricing-box">
              <div className="detail-price-main">
                <span className="detail-price-label">Giá Trọn Gói Ưu Đãi:</span>
                <span className="detail-price-value">{formatCurrency(pkg.giaTronGoi)}</span>
              </div>
              {savings > 0 && (
                <div className="detail-savings-badge">
                  <Icon name="sparkles" size={16} color="var(--success)" />
                  <span>Tiết kiệm {formatCurrency(savings)} so với chọn lẻ dịch vụ</span>
                </div>
              )}
              {originalTotal > 0 && (
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <span>Giá gốc tổng dịch vụ: </span>
                  <del>{formatCurrency(originalTotal)}</del>
                </div>
              )}
            </div>

            {/* Đặc Quyền Hoàng Triều Bổ Sung Chi Tiết */}
            <div className="royal-package-perks-box">
              <div className="perk-row">
                <Icon name="sparkles" size={16} color="var(--secondary)" />
                <span><strong>Thời lượng chụp:</strong> 01 Ngày (8 tiếng) trọn vẹn tại các di tích hoàng gia</span>
              </div>
              <div className="perk-row">
                <Icon name="mapPin" size={16} color="var(--secondary)" />
                <span><strong>Địa điểm chụp:</strong> Đại Nội, Cung Diên Thọ, Điện Kiến Trung & Sông Hương</span>
              </div>
              <div className="perk-row">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span><strong>Đặc quyền phục trang:</strong> Thử đồ may đo không giới hạn, chuyên gia dặm phấn đi cùng</span>
              </div>
              <div className="perk-row">
                <Icon name="package" size={16} color="var(--secondary)" />
                <span><strong>Bàn giao hoàn thiện:</strong> 100% file ảnh gốc HD + 50 ảnh hậu kỳ + 01 Album photobook sơn mài</span>
              </div>
            </div>

            <div className="detail-actions">
              <Button variant="primary" size="lg" onClick={handleAddToCart} leftIcon={<Icon name="cart" size={20} />}>
                Thêm Vào Giỏ Dịch Vụ
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setIsConsultModalOpen(true)} leftIcon={<Icon name="sparkles" size={18} />}>
                Nhận Báo Giá Nhanh
              </Button>
            </div>
          </div>
        </div>

        <div className="included-services-section">
          <div className="section-header-left">
            <span className="section-tag">CHI TIẾT HẠNG MỤC</span>
            <h2 className="section-title">Các Dịch Vụ Bao Gồm Trong Gói</h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Bấm vào bất kỳ dịch vụ nào dưới đây để xem ảnh và thông số chi tiết mà không bị thoát trang.
            </p>
          </div>

          <div className="included-services-grid">
            {includedServices.map((svc) => (
              <IncludedServiceCard
                key={svc.id}
                service={svc}
                onViewDetail={(item) => setQuickViewService(item)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Báo Giá Nhanh & Tùy Biến Hạng Mục */}
      <Modal isOpen={isConsultModalOpen} onClose={() => setIsConsultModalOpen(false)} title="Nhận Báo Giá Nhanh Gói Cưới" size="lg">
        <QuickConsultForm
          initialGoiId={pkg.id}
          pkg={pkg}
          includedServices={includedServices}
          onSuccess={() => setIsConsultModalOpen(false)}
        />
      </Modal>

      {/* Modal Xem Nhanh Dịch Vụ Lẻ Trong Gói (Không rời trang) */}
      <Modal
        isOpen={quickViewService !== null}
        onClose={() => setQuickViewService(null)}
        title={quickViewService ? `Chi Tiết: ${quickViewService.ten}` : "Chi Tiết Dịch Vụ"}
      >
        {quickViewService && (
          <div className="quickview-service-modal-body">
            <img
              src={quickViewService.hinhAnh}
              alt={quickViewService.ten}
              className="quickview-service-img"
            />
            <div className="quickview-service-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="quickview-service-category">{getCategoryLabel(quickViewService.loai)}</span>
                <strong className="quickview-service-price">{formatCurrency(quickViewService.gia)}</strong>
              </div>
              <h3 className="quickview-service-title">{quickViewService.ten}</h3>
              <p className="quickview-service-desc">{quickViewService.moTa}</p>
              <div className="quickview-service-features">
                <div className="feature-item">
                  <Icon name="check" size={16} color="var(--secondary)" />
                  <span>Cam kết chất lượng chuẩn di sản văn hóa Huế</span>
                </div>
                <div className="feature-item">
                  <Icon name="check" size={16} color="var(--secondary)" />
                  <span>Bao gồm đầy đủ phụ kiện mũ mão, trâm cài, khăn đóng đi kèm</span>
                </div>
              </div>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <Button variant="secondary" size="md" onClick={() => setQuickViewService(null)}>
                  Đóng & Tiếp Tục Xem Gói
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
