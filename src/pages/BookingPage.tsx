import { useState, useRef, useEffect, FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import { taoYeuCauInputSchema } from "../features/requests/types";
import { Input, Button } from "../components/common/UI";
import { Icon, IconName } from "../components/common/Icon";
import { useToastStore } from "../lib/toastStore";
import { SupabaseService } from "../lib/supabaseAdapter";
import "./BookingPage.css";

/* ==========================================================================
   1. BOOKING FORM COMPONENT & VENUES / PACKAGES DEFINITIONS
   ========================================================================== */
interface VenueOption {
  id: string;
  label: string;
  tag: string;
  desc: string;
  icon: IconName;
}

interface PackageOption {
  id: string;
  label: string;
  price: string;
  badge: string;
  desc: string;
  icon: IconName;
}

const VENUES: VenueOption[] = [
  {
    id: "dai-noi",
    label: "Quần thể Đại Nội & Cung Diên Thọ",
    tag: "Hoàng Thành Cung Đình",
    desc: "Kiến trúc Ngọ Môn, Điện Kiến Trung và Cung Diên Thọ uy nghiêm ngàn năm",
    icon: "crown",
  },
  {
    id: "lang-khai-dinh",
    label: "Lăng Khải Định & Đồi Thông Thiên An",
    tag: "Kiệt Tác Khảm Sành Sứ",
    desc: "Kiến trúc mỹ thuật khảm sành sứ đỉnh cao kết hợp đồi thông thơ mộng xứ Huế",
    icon: "sparkles",
  },
  {
    id: "song-huong",
    label: "Biệt Phủ Cổ & Bến Thuyền Sông Hương",
    tag: "Thơ Mộng Hương Giang",
    desc: "Biệt phủ nhà rường Huế trăm năm, vườn sen thơm ngát và du thuyền rồng",
    icon: "mapPin",
  },
  {
    id: "lang-tu-duc",
    label: "Lăng Tự Đức & Cầu Ngói Thanh Toàn",
    tag: "Hoài Niệm Cố Đô",
    desc: "Phong cảnh non nước hữu tình Khiêm Lăng và cây cầu ngói cổ kính rêu phong",
    icon: "book",
  },
];

const PACKAGES: PackageOption[] = [
  {
    id: "gc-01",
    label: "Gói Cung Đình Khang Ninh",
    price: "26.900.000 ₫",
    badge: "VIP Hoàng Triều",
    desc: "Trọn gói Cổ phục Nhật Bình thêu tay, chụp ảnh Đại Nội và trang trí gia tiên",
    icon: "crown",
  },
  {
    id: "gc-02",
    label: "Gói Hoàng Hậu Nam Phương",
    price: "19.500.000 ₫",
    badge: "Cổ Phục Quý Tộc",
    desc: "Cổ phục tơ tằm thanh nhã, chuyên gia trang điểm hoàng cung và thợ ảnh di sản",
    icon: "sparkles",
  },
  {
    id: "gc-03",
    label: "Gói Tân Thời Tối Giản",
    price: "15.900.000 ₫",
    badge: "Dạ Nguyệt Cố Đô",
    desc: "Giao thoa tà áo dài truyền thống và nghệ thuật chụp ảnh tối giản hiện đại",
    icon: "sparkles",
  },
  {
    id: "gc-05",
    label: "Gói Đại Nội Vĩnh Cửu",
    price: "38.500.000 ₫",
    badge: "Super VIP Toàn Năng",
    desc: "Flycam 4K, 2 máy ảnh cinematic, ban nhạc bát âm cung đình và tráp sính lễ",
    icon: "crown",
  },
  {
    id: "gc-07",
    label: "Gói Long Phụng Kỳ Duyên",
    price: "31.500.000 ₫",
    badge: "Cổ Phục 3 Bộ",
    desc: "Bộ 3 cổ phục (Nhật Bình, Áo Tấc, Giao Lĩnh) và kiệu hoa rước dâu hoàng cung",
    icon: "crown",
  },
];

interface BookingFormProps {
  onSuccess: (info: { tenChuRe: string; tenCoDau: string; soDienThoai: string }) => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialGoi = searchParams.get("goi") || "gc-01";
  const initialVenue = searchParams.get("diaDiem") || "dai-noi";
  const initialDichVu = searchParams.get("dichVu");

  const addToast = useToastStore((s) => s.addToast);
  const [tenKhach, setTenKhach] = useState(user?.ten || "");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [tenChuRe, setTenChuRe] = useState("");
  const [tenCoDau, setTenCoDau] = useState("");
  const [ngayChup, setNgayChup] = useState("");
  const [ngayCuoi, setNgayCuoi] = useState("");
  const [diaDiem, setDiaDiem] = useState(initialVenue);
  const [goiChup, setGoiChup] = useState(initialGoi);
  const [openDropdown, setOpenDropdown] = useState<"venue" | "package" | null>(null);

  const venueRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        venueRef.current &&
        !venueRef.current.contains(target) &&
        packageRef.current &&
        !packageRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentVenue = VENUES.find((v) => v.id === diaDiem) ?? VENUES[0]!;
  const currentPackage = PACKAGES.find((p) => p.id === goiChup) ?? PACKAGES[0]!;

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
      const selectedPkg = PACKAGES.find((p) => p.id === result.data.goiDeXuatId);
      const selectedVenueObj = VENUES.find((v) => v.id === diaDiem);

      let ok = await SupabaseService.createRequest({
        tenKhach: result.data.tenKhach,
        soDienThoai: result.data.soDienThoai,
        ngayCuoi: result.data.ngayCuoi,
        nganSach: result.data.nganSach,
        goiDeXuatId: result.data.goiDeXuatId,
        tenDon: selectedPkg ? selectedPkg.label.split(" (")[0] : "Gói Chụp Ảnh Cung Đình",
        diaDiemChup: selectedVenueObj ? selectedVenueObj.label : "Quần thể Đại Nội & Cung Diên Thọ",
        mongMuonBoSung: `Ngày chụp: ${ngayChup}. Chú rể: ${tenChuRe} - Cô dâu: ${tenCoDau}. ${ghiChu}`,
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
      addToast("Cảm ơn quý khách đã tin tưởng! Studio sẽ liên hệ sớm nhất.", "success", 5000);
    } catch {
      addToast("Không thể gửi thông tin lúc này. Vui lòng thử lại sau.", "error", 5000);
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
        {/* Dropdown 1: Địa điểm chụp di sản hoàng triều */}
        <div className="royal-select-group" ref={venueRef}>
          <label className="input-label" id="venue-label" htmlFor="venue-select-hidden">
            <span className="label-icon-wrap"><Icon name="mapPin" size={16} color="var(--primary)" /></span>
            <span>Địa điểm chụp di sản mong muốn</span>
          </label>
          <div className="royal-select-container">
            <button
              type="button"
              className={`royal-select-trigger ${openDropdown === "venue" ? "active" : ""}`}
              onClick={() => setOpenDropdown((prev) => (prev === "venue" ? null : "venue"))}
              aria-haspopup="listbox"
              aria-expanded={openDropdown === "venue"}
              aria-labelledby="venue-label"
            >
              <div className="trigger-main">
                <div className="trigger-icon-box">
                  <Icon name={currentVenue.icon} size={18} color="var(--secondary)" />
                </div>
                <div className="trigger-content">
                  <span className="trigger-title">{currentVenue.label}</span>
                  <span className="trigger-tag">
                    <Icon name="mapPin" size={11} color="var(--secondary)" /> {currentVenue.tag}
                  </span>
                </div>
              </div>
              <div className={`trigger-chevron ${openDropdown === "venue" ? "rotated" : ""}`}>
                <Icon name="chevronDown" size={15} />
              </div>
            </button>

            {openDropdown === "venue" && (
              <div className="royal-dropdown-panel" role="listbox" aria-labelledby="venue-label">
                {VENUES.map((v) => {
                  const isSelected = v.id === diaDiem;
                  return (
                    <div
                      key={v.id}
                      className={`royal-dropdown-option ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setDiaDiem(v.id);
                        setOpenDropdown(null);
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="option-icon-box">
                        <Icon name={v.icon} size={18} color={isSelected ? "var(--primary)" : "var(--secondary)"} />
                      </div>
                      <div className="option-body">
                        <div className="option-top-row">
                          <strong className="option-title">{v.label}</strong>
                          <span className="option-tag-badge">{v.tag}</span>
                        </div>
                        <p className="option-desc">{v.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="option-check">
                          <Icon name="check" size={16} color="var(--secondary)" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* Hidden native select for form accessibility */}
            <select
              id="venue-select-hidden"
              className="sr-only-select"
              value={diaDiem}
              onChange={(e) => setDiaDiem(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
            >
              {VENUES.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}
            </select>
          </div>
        </div>

        {/* Dropdown 2: Gói combo hoàng gia lựa chọn */}
        <div className="royal-select-group" ref={packageRef}>
          <label className="input-label" id="package-label" htmlFor="package-select-hidden">
            <span className="label-icon-wrap"><Icon name="crown" size={16} color="var(--secondary)" /></span>
            <span>Gói combo hoàng gia lựa chọn</span>
          </label>
          <div className="royal-select-container">
            <button
              type="button"
              className={`royal-select-trigger ${openDropdown === "package" ? "active" : ""}`}
              onClick={() => setOpenDropdown((prev) => (prev === "package" ? null : "package"))}
              aria-haspopup="listbox"
              aria-expanded={openDropdown === "package"}
              aria-labelledby="package-label"
            >
              <div className="trigger-main">
                <div className="trigger-icon-box crown-box">
                  <Icon name={currentPackage.icon} size={18} color="var(--secondary)" />
                </div>
                <div className="trigger-content">
                  <span className="trigger-title">{currentPackage.label}</span>
                  <div className="trigger-badge-row">
                    <span className="trigger-price-badge">{currentPackage.price}</span>
                    <span className="trigger-vip-tag">
                      <Icon name="sparkles" size={11} color="var(--secondary)" /> {currentPackage.badge}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`trigger-chevron ${openDropdown === "package" ? "rotated" : ""}`}>
                <Icon name="chevronDown" size={15} />
              </div>
            </button>

            {openDropdown === "package" && (
              <div className="royal-dropdown-panel" role="listbox" aria-labelledby="package-label">
                {PACKAGES.map((p) => {
                  const isSelected = p.id === goiChup;
                  return (
                    <div
                      key={p.id}
                      className={`royal-dropdown-option ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setGoiChup(p.id);
                        setOpenDropdown(null);
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="option-icon-box crown-box">
                        <Icon name={p.icon} size={18} color={isSelected ? "var(--primary)" : "var(--secondary)"} />
                      </div>
                      <div className="option-body">
                        <div className="option-top-row">
                          <strong className="option-title">{p.label}</strong>
                          <span className="option-price-highlight">{p.price}</span>
                        </div>
                        <p className="option-desc">{p.desc}</p>
                        <span className="option-sub-badge">
                          <Icon name="sparkles" size={11} color="var(--secondary)" /> {p.badge}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="option-check">
                          <Icon name="check" size={16} color="var(--secondary)" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* Hidden native select for form accessibility */}
            <select
              id="package-select-hidden"
              className="sr-only-select"
              value={goiChup}
              onChange={(e) => setGoiChup(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
            >
              {PACKAGES.map((p) => (<option key={p.id} value={p.id}>{p.label}</option>))}
            </select>
          </div>
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
