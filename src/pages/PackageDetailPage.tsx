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
}

export function IncludedServiceCard({ service }: IncludedServiceCardProps) {
  return (
    <div className="included-service-item">
      <img src={service.hinhAnh} alt={service.ten} className="included-service-img" />
      <div className="included-service-content">
        <span className="included-service-tag">{getCategoryLabel(service.loai)}</span>
        <h4 className="included-service-name">{service.ten}</h4>
        <p className="included-service-desc">{service.moTa}</p>
        <span className="included-service-price">Giá gốc: {formatCurrency(service.gia)}</span>
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
    addToast(`Đã thêm "${pkg.ten}" vào giỏ hàng cưới của bạn!`, "success");
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

            <div className="detail-actions">
              <Button variant="primary" size="lg" onClick={handleAddToCart} leftIcon={<Icon name="cart" size={20} />}>
                Thêm Vào Giỏ Dịch Vụ
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setIsConsultModalOpen(true)}>
                Nhận Báo Giá Nhanh
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.print()}
                leftIcon={<Icon name="printer" size={20} />}
                className="btn-print-quote"
                title="In bản báo giá & hợp đồng cung đình"
              >
                In Hợp Đồng A4
              </Button>
            </div>
          </div>
        </div>

        {/* Hợp đồng A4 dành riêng cho chế độ In Ấn (CSS @media print) */}
        <div className="royal-print-contract">
          <div className="print-header">
            <div className="print-crest">⚜️ HUẾ CUNG ĐÌNH • HÔN LỄ HOÀNG GIA ⚜️</div>
            <h1 className="print-title">BẢNG BÁO GIÁ & DỰ THẢO HỢP ĐỒNG HÔN LỄ</h1>
            <p className="print-sub">
              Mã hồ sơ: HD-HUE-{pkg.id.toUpperCase()} • Ngày phát hành: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="print-section-title">I. THÔNG TIN GÓI DỊCH VỤ HOÀNG TRIỀU</div>
          <table className="print-table">
            <tbody>
              <tr>
                <td style={{ width: "30%", fontWeight: 700 }}>Tên Gói Cưới:</td>
                <td style={{ fontWeight: 700, color: "#8B0000" }}>{pkg.ten}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Phong Cách:</td>
                <td>{getStyleLabel(pkg.phongCach)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>Mô Tả Tiêu Chuẩn:</td>
                <td>{pkg.moTa}</td>
              </tr>
            </tbody>
          </table>

          <div className="print-section-title">II. DANH MỤC CÁC HẠNG MỤC DỊCH VỤ ĐÍNH KÈM</div>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "8%" }}>STT</th>
                <th style={{ width: "45%" }}>Hạng Mục Dịch Vụ</th>
                <th style={{ width: "25%" }}>Phân Loại</th>
                <th style={{ width: "22%", textAlign: "right" }}>Giá Niêm Yết</th>
              </tr>
            </thead>
            <tbody>
              {includedServices.map((svc, idx) => (
                <tr key={svc.id}>
                  <td style={{ textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{svc.ten}</td>
                  <td>{getCategoryLabel(svc.loai)}</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(svc.gia)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="print-summary-box">
            <div>
              <span>Tổng chi phí các hạng mục lẻ: </span>
              <del>{formatCurrency(originalTotal)}</del>
              <br />
              <strong style={{ color: "#16a34a" }}>Ưu đãi trọn gói hôn lễ hoàng triều: </strong>
              <span>- {formatCurrency(savings)}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10pt", color: "#666" }}>TỔNG THANH TOÁN TRỌN GÓI:</div>
              <div style={{ fontSize: "16pt", fontWeight: 700, color: "#8B0000" }}>
                {formatCurrency(pkg.giaTronGoi)}
              </div>
            </div>
          </div>

          <div className="print-section-title">III. CAM KẾT CHẤT LƯỢNG & BẢO HÀNH CUNG ĐÌNH</div>
          <p style={{ fontSize: "9.5pt", lineHeight: 1.5, margin: "6px 0" }}>
            1. 100% Cổ phục Nhật Bình và Áo Tấc được dệt may thủ công theo đúng chuẩn tích triều Nguyễn.<br />
            2. Toàn bộ hình ảnh cưới được lưu trữ vĩnh viễn trên máy chủ bảo mật Hoàng Gia.<br />
            3. Hỗ trợ thay đổi thời gian chụp ảnh trước 07 ngày không tính phụ phí.
          </p>

          <div className="print-signatures">
            <div className="print-sign-col">
              <div className="print-sign-title">ĐẠI DIỆN KHÁCH HÀNG</div>
              <div className="print-sign-sub">(Ký & ghi rõ họ tên)</div>
              <div className="print-sign-name">Tân Lang & Tân Nương</div>
            </div>
            <div className="print-sign-col">
              <div className="print-sign-title">ĐẠI DIỆN HUẾ CUNG ĐÌNH</div>
              <div className="print-sign-sub">(Ký, đóng dấu hoàng triều)</div>
              <div className="print-sign-name">Giám Đốc Điều Hành Studio</div>
            </div>
          </div>
        </div>

        <div className="included-services-section">
          <div className="section-header-left">
            <span className="section-tag">CHI TIẾT HẠNG MỤC</span>
            <h2 className="section-title">Các Dịch Vụ Bao Gồm Trong Gói</h2>
          </div>

          <div className="included-services-grid">
            {includedServices.map((svc) => (
              <IncludedServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isConsultModalOpen} onClose={() => setIsConsultModalOpen(false)} title="Đăng Ký Tư Vấn Gói Cưới Này">
        <QuickConsultForm
          initialGoiId={pkg.id}
          initialBudget={pkg.giaTronGoi}
          onSuccess={() => setIsConsultModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
