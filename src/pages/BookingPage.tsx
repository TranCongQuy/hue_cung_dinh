import { useState, FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { taoYeuCauInputSchema } from "../features/requests/types";
import { Input, Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { useToastStore } from "../lib/toastStore";
import { SupabaseService } from "../lib/supabaseAdapter";
import "./BookingPage.css";

/* ==========================================================================
   1. BOOKING FORM COMPONENT
   ========================================================================== */
const VENUES = [
  { id: "dai-noi", label: "Quần thể Đại Nội & Cung Diên Thọ" },
  { id: "lang-khai-dinh", label: "Lăng Khải Định & Đồi Thông Thiên An" },
  { id: "song-huong", label: "Biệt Phủ Cổ & Bến Thuyền Sông Hương" },
  { id: "lang-tu-duc", label: "Lăng Tự Đức & Cầu Ngói Thanh Toàn" },
];

const PACKAGES = [
  { id: "gc-01", label: "Gói Cung Đình Khang Ninh (VIP - 26.9M)" },
  { id: "gc-02", label: "Gói Hoàng Hậu Nam Phương (19.5M)" },
  { id: "gc-03", label: "Gói Tân Thời Tối Giản (15.9M)" },
  { id: "gc-05", label: "Gói Đại Nội Vĩnh Cửu (38.5M)" },
  { id: "gc-07", label: "Gói Long Phụng Kỳ Duyên (31.5M)" },
];

interface BookingFormProps {
  onSuccess: (info: { tenChuRe: string; tenCoDau: string; soDienThoai: string }) => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [searchParams] = useSearchParams();
  const initialGoi = searchParams.get("goi") || "gc-01";
  const initialVenue = searchParams.get("diaDiem") || "dai-noi";
  const initialDichVu = searchParams.get("dichVu");

  const addToast = useToastStore((s) => s.addToast);
  const [tenKhach, setTenKhach] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [tenChuRe, setTenChuRe] = useState("");
  const [tenCoDau, setTenCoDau] = useState("");
  const [ngayChup, setNgayChup] = useState("");
  const [ngayCuoi, setNgayCuoi] = useState("");
  const [diaDiem, setDiaDiem] = useState(initialVenue);
  const [goiChup, setGoiChup] = useState(initialGoi);
  const [ghiChu, setGhiChu] = useState(
    initialDichVu ? `[Quan tâm dịch vụ lẻ: ${initialDichVu}] ` : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = taoYeuCauInputSchema.safeParse({
      tenKhach: tenKhach.trim() || `${tenChuRe} & ${tenCoDau}`,
      soDienThoai,
      ngayCuoi: ngayCuoi || ngayChup,
      soLuongKhach: 100,
      nganSach: 25000000,
      goiDeXuatId: goiChup,
      ghiChu: `[Đặt Lịch] Chú Rể: ${tenChuRe} - Cô Dâu: ${tenCoDau} | Ngày chụp: ${ngayChup} | Địa điểm: ${diaDiem} | Lời dặn: ${ghiChu}`,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (field) errMap[String(field)] = err.message;
      });
      setErrors(errMap);
      addToast("Vui lòng kiểm tra lại thông tin đặt lịch", "error");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      let ok = await SupabaseService.createRequest({
        tenKhach: result.data.tenKhach,
        soDienThoai: result.data.soDienThoai,
        ngayCuoi: result.data.ngayCuoi,
        soLuongKhach: result.data.soLuongKhach,
        nganSach: result.data.nganSach,
        goiDeXuatId: result.data.goiDeXuatId,
        ghiChu: result.data.ghiChu,
      });

      if (!ok) {
        const res = await fetch("/api/yeu-cau", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        if (res.ok) ok = true;
      }

      if (!ok) throw new Error("Gửi đơn không thành công");
      onSuccess({ tenChuRe, tenCoDau, soDienThoai });
      addToast("Đặt lịch chụp ảnh thành công!", "success");
    } catch {
      addToast("Không thể gửi thông tin lúc này. Vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="booking-form-element">
      <div className="form-legend-header">
        <Icon name="crown" size={24} color="var(--secondary)" />
        <h2>Phiếu Khởi Tạo Thông Tin Đặt Lịch</h2>
      </div>

      <div className="booking-form-grid">
        <Input label="Họ tên người đăng ký" value={tenKhach} onChange={(e) => setTenKhach(e.target.value)} error={errors.tenKhach} placeholder="Nguyễn Văn A" required />
        <Input label="Số điện thoại Zalo / Liên hệ" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} error={errors.soDienThoai} placeholder="0912345678" required />
        <Input label="Tên Chú Rể" value={tenChuRe} onChange={(e) => setTenChuRe(e.target.value)} placeholder="Quốc Bảo" required />
        <Input label="Tên Cô Dâu" value={tenCoDau} onChange={(e) => setTenCoDau(e.target.value)} placeholder="Ngọc Hân" required />
        <Input label="Ngày dự kiến chụp ảnh" type="date" value={ngayChup} onChange={(e) => setNgayChup(e.target.value)} required />
        <Input label="Ngày tổ chức hôn lễ" type="date" value={ngayCuoi} onChange={(e) => setNgayCuoi(e.target.value)} error={errors.ngayCuoi} required />
      </div>

      <div className="booking-select-row">
        <div className="select-field-group">
          <label className="input-label" htmlFor="venue-select">Địa điểm chụp di sản mong muốn</label>
          <select id="venue-select" className="booking-select" value={diaDiem} onChange={(e) => setDiaDiem(e.target.value)}>
            {VENUES.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}
          </select>
        </div>

        <div className="select-field-group">
          <label className="input-label" htmlFor="package-select">Gói combo hoàng gia lựa chọn</label>
          <select id="package-select" className="booking-select" value={goiChup} onChange={(e) => setGoiChup(e.target.value)}>
            {PACKAGES.map((p) => (<option key={p.id} value={p.id}>{p.label}</option>))}
          </select>
        </div>
      </div>

      <div className="form-group-full">
        <label className="input-label" htmlFor="ghi-chu-booking">Ghi chú riêng về trang phục, số lượng người thân đi cùng...</label>
        <textarea id="ghi-chu-booking" className="input-control" rows={3} placeholder="VD: Yêu cầu thêm 1 bộ áo Nhật Bình cho mẹ cô dâu, thích chụp khoảnh khắc hoàng hôn..." value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
      </div>

      <div className="booking-form-footer">
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="btn-submit-booking" leftIcon={<Icon name="sparkles" size={18} />}>
          Gửi Yêu Cầu Đặt Lịch Chụp
        </Button>
      </div>
    </form>
  );
}

/* ==========================================================================
   2. BOOKING PAGE COMPONENT
   ========================================================================== */
export function BookingPage() {
  const [successInfo, setSuccessInfo] = useState<{
    tenChuRe: string;
    tenCoDau: string;
    soDienThoai: string;
  } | null>(null);

  return (
    <div className="booking-page-root">
      <div className="container">
        <nav className="booking-breadcrumb" aria-label="Đường dẫn trang">
          <Link to="/">Trang Chủ</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-cur">Đặt Lịch Chụp Ảnh Cưới</span>
        </nav>

        <header className="booking-header">
          <span className="section-tag">ĐẶT LỊCH CHỤP ẢNH CƯỚI CUNG ĐÌNH</span>
          <h1 className="booking-title">Đăng Ký Đặt Lịch Chụp Ảnh Cưới</h1>
          <p className="booking-subtitle">
            Khai thác trọn vẹn thông tin ngày trọng đại để ekip Huế Cung Đình chuẩn bị phục trang, thiết bị và bối cảnh hoàn mỹ nhất.
          </p>
        </header>

        {successInfo ? (
          <div className="booking-success-card">
            <div className="success-icon-badge">
              <Icon name="check" size={32} color="#16a34a" />
            </div>
            <h2>Đặt Lịch Chụp Ảnh Cưới Thành Công!</h2>
            <p>
              Ekip quản lý Studio đã tiếp nhận hồ sơ của <strong>{successInfo.tenChuRe}</strong> &amp; <strong>{successInfo.tenCoDau}</strong>. Chuyên viên sẽ gọi điện tư vấn qua số <strong>{successInfo.soDienThoai}</strong> trong ít phút.
            </p>
            <div className="success-btn-row">
              <Link to="/don-cua-toi">
                <Button variant="primary" leftIcon={<Icon name="check" size={16} />}>
                  Xem Tiến Độ Đơn Của Tôi
                </Button>
              </Link>
              <Link to="/goi-cuoi">
                <Button variant="secondary">Khám Phá Thêm Gói Cưới</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost">Về Trang Chủ</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="booking-card">
            <BookingForm onSuccess={(info) => setSuccessInfo(info)} />
          </div>
        )}
      </div>
    </div>
  );
}
