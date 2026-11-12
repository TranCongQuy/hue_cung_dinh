import { useState, useEffect, FormEvent, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import {
  ThiepCuoiLoai,
  datThiepFormSchema,
  BANK_BINS,
  resolveBankBin,
  buildVietQrImageUrl,
  calculateCountdownParts,
  CustomShareInvitation,
} from "../features/invitations/types";
import { Input, Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { useToastStore } from "../lib/toastStore";
import { SupabaseService } from "../lib/supabaseAdapter";
import { RoyalCourtAudio } from "../features/invitations/components/RoyalCourtAudio";
import { FixedFloatingRings } from "../components/common/FixedFloatingRings";
import "./InvitationCustomPage.css";

const ROYAL_TUNES = [
  { id: "nhac-01", name: "Lưu Thủy Kim Tiền (Nhã Nhạc Cung Đình)" },
  { id: "nhac-02", name: "Phú Lục Địch Hoàng Triều" },
  { id: "nhac-03", name: "Dạ Cổ Hoài Lang Tơ Nguyệt" },
  { id: "nhac-04", name: "Mộng Hương Giang Êm Đềm" },
];

const THU_BAC_CHU_RE_OPTIONS = [
  "Trưởng Nam",
  "Thứ Nam",
  "Út Nam",
  "Quý Nam",
  "Giai Út",
  "Trưởng Tôn",
];

const THU_BAC_CO_DAU_OPTIONS = [
  "Trưởng Nữ",
  "Thứ Nữ",
  "Út Nữ",
  "Quý Nữ",
  "Gái Út",
  "Trưởng Tôn Nữ",
];

function slugifyVietnamese(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function InvitationCustomPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const rawTier = searchParams.get("goi") || searchParams.get("loai");
  const initialTier: ThiepCuoiLoai =
    rawTier === "vip" || rawTier === "pro" || rawTier === "basic"
      ? rawTier
      : "vip";
  const rawStyle = searchParams.get("phongCach");
  const initialStyle: "cung-dinh" | "co-dien" | "hien-dai" =
    rawStyle === "cung-dinh" ||
    rawStyle === "co-dien" ||
    rawStyle === "hien-dai"
      ? rawStyle
      : "cung-dinh";

  const [selectedTier, setSelectedTier] = useState<ThiepCuoiLoai>(initialTier);
  const [selectedStyle, setSelectedStyle] = useState<
    "cung-dinh" | "co-dien" | "hien-dai"
  >(initialStyle);

  // Live form state
  const [tenKhach, setTenKhach] = useState(user?.ten || "");
  const [soDienThoai, setSoDienThoai] = useState(user?.soDienThoai || "");
  const [thuBacChuRe, setThuBacChuRe] = useState("Trưởng Nam");
  const [tenChuRe, setTenChuRe] = useState("Nguyễn Quốc Bảo");
  const [thuBacCoDau, setThuBacCoDau] = useState("Trưởng Nữ");
  const [tenCoDau, setTenCoDau] = useState("Lê Ngọc Hân");
  const [nhaTrai, setNhaTrai] = useState(
    "Ông Nguyễn Văn Thắng & Bà Trần Thị Hòa"
  );
  const [nhaGai, setNhaGai] = useState("Ông Lê Văn Định & Bà Hoàng Thị Mai");
  const [ngayCuoi, setNgayCuoi] = useState("2026-12-28");
  const [gioToChuc, setGioToChuc] = useState("10:30");
  const [ngayAmLich, setNgayAmLich] = useState(
    "Ngày 20 tháng 11 năm Bính Ngọ"
  );
  const [diaDiem, setDiaDiem] = useState(
    "Trung Tâm Hội Nghị Hoàng Gia Cố Đô, TP. Huế"
  );
  const [mapUrl, setMapUrl] = useState("https://maps.google.com/?q=Dai+Noi+Hue");
  const [nganHang, setNganHang] = useState("MB");
  const [chuTaiKhoan, setChuTaiKhoan] = useState("NGUYEN QUOC BAO");
  const [soTaiKhoan, setSoTaiKhoan] = useState("0905123456");
  const [soTienMungGoiY, setSoTienMungGoiY] = useState<number>(500000);
  const [nhacNen, setNhacNen] = useState("nhac-01");
  const [loiNgo, setLoiNgo] = useState(
    "Trân trọng kính mời quý bạn hữu cùng chứng kiến và sẻ chia khoảnh khắc kết duyên trăm năm ngập tràn hạnh phúc của chúng tôi tại Cố đô Huế."
  );

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    soDienThoai: string;
    tenCoDau: string;
    tenChuRe: string;
    shareSlug: string;
  } | null>(null);

  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedBankInfo = useMemo(() => resolveBankBin(nganHang), [nganHang]);
  const countdown = useMemo(
    () => calculateCountdownParts(`${ngayCuoi}T${gioToChuc || "10:30"}:00`, nowMs),
    [ngayCuoi, gioToChuc, nowMs]
  );

  // Dynamic 15-Bank VietQR preview URL
  const vietQrUrl = useMemo(() => {
    if (!soTaiKhoan.trim()) return null;
    return buildVietQrImageUrl({
      bankNameOrCode: nganHang,
      accountNumber: soTaiKhoan,
      accountName: chuTaiKhoan,
      amount: soTienMungGoiY > 0 ? soTienMungGoiY : undefined,
      addInfo: `Mung Cuoi ${tenChuRe} ${tenCoDau}`,
    });
  }, [nganHang, soTaiKhoan, chuTaiKhoan, soTienMungGoiY, tenChuRe, tenCoDau]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = datThiepFormSchema.safeParse({
      tenKhach: tenKhach || tenChuRe,
      soDienThoai,
      tenCoDau,
      tenChuRe,
      ngayCuoi,
      diaDiem,
      mauThiepId: `custom-${selectedTier}-${selectedStyle}`,
      goiDichVu: selectedTier,
      ghiChu: `[Thiệp Tự Thiết Kế] Thứ bậc: ${thuBacChuRe} & ${thuBacCoDau} | Giờ: ${gioToChuc} | Âm lịch: ${ngayAmLich} | Nhà trai: ${nhaTrai} | Nhà gái: ${nhaGai} | Map: ${mapUrl} | STK: ${soTaiKhoan} (${selectedBankInfo.shortName} - ${chuTaiKhoan}) | Nhạc: ${nhacNen} | Lời ngỏ: ${loiNgo}`,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (field) errMap[String(field)] = err.message;
      });
      setErrors(errMap);
      addToast("Vui lòng kiểm tra lại thông tin đăng ký thiệp", "error", 5000);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const slugBase = slugifyVietnamese(`${tenChuRe}-${tenCoDau}`);
      const shareSlug = `${slugBase || "thiep-hoang-gia"}-${Date.now()
        .toString()
        .slice(-4)}`;

      const customSharePayload: CustomShareInvitation = {
        slug: shareSlug,
        mauThiepId: `custom-${selectedTier}-${selectedStyle}`,
        tenMauThiep: `Thiệp Hoàng Triều ${selectedTier.toUpperCase()}`,
        phongCach: selectedStyle,
        loai: selectedTier,
        tenChuRe,
        tenCoDau,
        ngayCuoi,
        gioToChuc: gioToChuc || "10:30",
        diaDiem,
        diaChiChiTiet: `${ngayAmLich} • Nhà trai: ${nhaTrai} | Nhà gái: ${nhaGai}`,
        loiMoi: loiNgo,
        nganHang: selectedBankInfo.code,
        soTaiKhoan: soTaiKhoan || "0905123456",
        chuTaiKhoan: chuTaiKhoan || "NGUYEN QUOC BAO",
        soTienMungGoiY: soTienMungGoiY >= 0 ? soTienMungGoiY : 500000,
        hinhAnh:
          "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=900&q=80",
        amNhac:
          ROYAL_TUNES.find((r) => r.id === nhacNen)?.name ||
          "Nhã Nhạc Cung Đình",
        nguoiTao: tenKhach || tenChuRe,
        danhSachRsvp: [],
        ngayTao: new Date().toISOString(),
      };

      await SupabaseService.saveCustomInvitation(customSharePayload);

      const requestPayload = {
        tenKhach: tenKhach || tenChuRe,
        soDienThoai,
        ngayCuoi,
        nganSach:
          selectedTier === "vip"
            ? 450000
            : selectedTier === "pro"
            ? 295000
            : 168000,
        goiDeXuatId: `thiep-${selectedTier}`,
        tenDon: `Đơn Thiết Kế Thiệp Online (${selectedTier.toUpperCase()} - ${tenChuRe} & ${tenCoDau})`,
        diaDiemChup: diaDiem,
        mongMuonBoSung: `Link thiệp đã phát hành: /thiep-cuoi/moi/${shareSlug} | Ngân hàng: ${selectedBankInfo.shortName} (${soTaiKhoan})`,
        ghiChu: `[Tự Thiết Kế Thiệp Cưới] Nhà trai: ${nhaTrai} | Nhà gái: ${nhaGai} | Lời ngỏ: ${loiNgo}`,
      };

      let ok = await SupabaseService.createRequest(requestPayload);
      if (!ok) {
        const res = await fetch("/api/yeu-cau", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });
        if (res.ok) ok = true;
      }

      if (!ok) throw new Error("Gửi đăng ký không thành công");
      setSuccessInfo({ soDienThoai, tenCoDau, tenChuRe, shareSlug });
      addToast(
        "Đã phát hành đường dẫn thiệp cưới công khai & lưu đơn thành công!",
        "success",
        5000
      );
    } catch {
      addToast("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.", "error", 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyShareLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/thiep-cuoi/moi/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
    }
    addToast("Đã sao chép đường dẫn thiệp mời vào bộ nhớ tạm!", "success");
  };

  return (
    <div className="custom-invitation-page">
      <FixedFloatingRings />

      <div className="container custom-invitation-container">
        <div className="custom-invitation-nav">
          <Link to="/thiep-cuoi" className="back-link">
            ← Quay Lại Kho Mẫu Thiệp
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/thiep-cuoi/moi/quoc-bao-ngoc-han-2026" className="back-link">
              <Icon name="share" size={15} /> Xem Thiệp Công Khai Mẫu (RSVP)
            </Link>
            <RoyalCourtAudio />
          </div>
        </div>

        <header className="custom-invitation-header">
          <span className="section-tag">KHỞI TẠO &amp; CHIA SẺ THIỆP CƯỚI TRỰC TUYẾN</span>
          <h1 className="custom-title">Đăng Ký &amp; Phát Hành Link Thiệp Cưới Online</h1>
          <p className="custom-subtitle">
            Hỗ trợ mã VietQR động cho 15 ngân hàng Việt Nam, đồng hồ đếm ngược thời gian thực và cấp
            ngay đường dẫn thiệp công khai có Sổ lưu bút &amp; Xác nhận tham dự (RSVP).
          </p>
        </header>

        {successInfo ? (
          <div className="success-confirmation-card">
            <div className="success-icon-wrap">
              <Icon name="check" size={32} color="#16a34a" />
            </div>
            <h2>Thiệp Cưới Online Đã Sẵn Sàng Chia Sẻ!</h2>
            <p>
              Thiệp hồng của <strong>{successInfo.tenChuRe}</strong> &amp;{" "}
              <strong>{successInfo.tenCoDau}</strong> đã được khởi tạo kèm Sổ lưu bút chúc phúc và
              bảng xác nhận tham dự (RSVP) trực tuyến.
            </p>

            <div
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                background: "var(--bg-alt)",
                border: "1.5px dashed var(--border-gold)",
                marginBottom: "22px",
                wordBreak: "break-all",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              {`${window.location.origin}/thiep-cuoi/moi/${successInfo.shareSlug}`}
            </div>

            <div className="success-actions">
              <Link to={`/thiep-cuoi/moi/${successInfo.shareSlug}`}>
                <Button
                  variant="primary"
                  leftIcon={<Icon name="sparkles" size={16} />}
                >
                  Mở Thiệp Cưới Công Khai Ngay
                </Button>
              </Link>
              <Button
                variant="secondary"
                leftIcon={<Icon name="copy" size={16} />}
                onClick={() => handleCopyShareLink(successInfo.shareSlug)}
              >
                Sao Chép Link Gửi Khách Mời
              </Button>
              <Link to="/don-cua-toi">
                <Button variant="ghost">Xem Đơn Của Tôi</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="custom-invitation-grid">
            {/* CỘT TRÁI: BỘ LỌC & XEM TRƯỚC THIỆP CƯỚI REAL-TIME */}
            <aside className="custom-preview-col" aria-label="Xem trước thiệp cưới">
              <div className="preview-sticky-wrap">
                <div className="custom-options-panel">
                  <div className="option-row">
                    <span className="option-label">Hạng giao diện:</span>
                    <div className="tier-pill-group">
                      {(["vip", "pro", "basic"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`tier-pill ${selectedTier === t ? "active" : ""}`}
                          onClick={() => setSelectedTier(t)}
                        >
                          {t === "vip" && <Icon name="crown" size={13} />}
                          {t === "pro" && <Icon name="sparkles" size={13} />}
                          {" "}{t.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-row">
                    <span className="option-label">Phong cách hôn lễ:</span>
                    <div className="style-chips-row">
                      <button
                        type="button"
                        className={`style-chip ${
                          selectedStyle === "cung-dinh" ? "chip-active" : ""
                        }`}
                        onClick={() => setSelectedStyle("cung-dinh")}
                      >
                        <Icon name="crown" size={13} /> Cung Đình
                      </button>
                      <button
                        type="button"
                        className={`style-chip ${
                          selectedStyle === "co-dien" ? "chip-active" : ""
                        }`}
                        onClick={() => setSelectedStyle("co-dien")}
                      >
                        <Icon name="book" size={13} /> Cổ Điển
                      </button>
                      <button
                        type="button"
                        className={`style-chip ${
                          selectedStyle === "hien-dai" ? "chip-active" : ""
                        }`}
                        onClick={() => setSelectedStyle("hien-dai")}
                      >
                        <Icon name="sparkles" size={13} /> Hiện Đại
                      </button>
                    </div>
                  </div>
                </div>

                {/* THIỆP MOCKUP CARD TRỰC QUAN */}
                <div
                  className={`royal-invitation-mockup style-${selectedStyle} tier-${selectedTier}`}
                >
                  <div className="mockup-header-accent">
                    <span className="mockup-badge">SAVE THE DATE</span>
                    <span className="mockup-sub-badge">HÔN LỄ HOÀNG GIA</span>
                  </div>

                  <div className="mockup-inner-frame">
                    <div className="mockup-ornament top-ornament">
                      <span className="ornament-leaf">
                        <Icon name="crown" size={18} color="var(--secondary)" />
                      </span>
                    </div>

                    <div className="mockup-parents-block">
                      <div className="parent-side">
                        <span className="side-title">NHÀ TRAI</span>
                        <p className="side-name">{nhaTrai || "Ông/Bà Nhà Trai"}</p>
                      </div>
                      <div className="parent-divider">
                        <Icon name="sparkles" size={16} color="var(--secondary)" />
                      </div>
                      <div className="parent-side">
                        <span className="side-title">NHÀ GÁI</span>
                        <p className="side-name">{nhaGai || "Ông/Bà Nhà Gái"}</p>
                      </div>
                    </div>

                    <p className="mockup-intro">
                      Trân trọng kính báo tin Hỷ hôn phối của
                    </p>

                    <div className="mockup-couple-names">
                      <div className="mockup-couple-person">
                        <span className="person-rank-badge">{thuBacChuRe}</span>
                        <h3 className="groom-name">{tenChuRe || "Tên Chú Rể"}</h3>
                      </div>
                      <span className="couple-amp">&amp;</span>
                      <div className="mockup-couple-person">
                        <span className="person-rank-badge">{thuBacCoDau}</span>
                        <h3 className="bride-name">{tenCoDau || "Tên Cô Dâu"}</h3>
                      </div>
                    </div>

                    <div className="mockup-time-box">
                      <div className="time-row-solar">
                        <span className="time-hour">{gioToChuc || "10:30"}</span>
                        <span className="time-date">
                          {ngayCuoi
                            ? new Date(ngayCuoi).toLocaleDateString("vi-VN", {
                                weekday: "long",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "Ngày cưới"}
                        </span>
                      </div>
                      <div className="time-row-lunar">
                        <span>(Tức: {ngayAmLich || "Ngày hoàng đạo"})</span>
                      </div>
                    </div>

                    {/* Đếm ngược thời gian thực */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "6px",
                        marginBottom: "12px",
                      }}
                      aria-label="Đếm ngược tới lễ thành hôn"
                    >
                      {[
                        { val: countdown.days, lbl: "Ngày" },
                        { val: countdown.hours, lbl: "Giờ" },
                        { val: countdown.minutes, lbl: "Phút" },
                        { val: countdown.seconds, lbl: "Giây" },
                      ].map((c) => (
                        <div
                          key={c.lbl}
                          style={{
                            padding: "6px 4px",
                            borderRadius: "8px",
                            background: "rgba(212, 175, 55, 0.12)",
                            border: "1px solid rgba(212, 175, 55, 0.35)",
                          }}
                        >
                          <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--primary)" }}>
                            {String(c.val).padStart(2, "0")}
                          </strong>
                          <small style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                            {c.lbl}
                          </small>
                        </div>
                      ))}
                    </div>

                    <div className="mockup-location-box">
                      <Icon name="mapPin" size={16} color="var(--primary)" />
                      <p className="location-text">{diaDiem || "Địa điểm hôn lễ"}</p>
                    </div>

                    <div className="mockup-message-box">
                      <p className="message-quote">
                        &ldquo;{loiNgo || "Lời ngỏ của gia đình"}&rdquo;
                      </p>
                    </div>

                    {/* Mừng cưới QR Code động 15 ngân hàng */}
                    {vietQrUrl && (
                      <div className="mockup-vietqr-box">
                        <div className="qr-badge">
                          VietQR Mừng Cưới • {selectedBankInfo.shortName} (BIN {selectedBankInfo.bin})
                        </div>
                        <img
                          src={vietQrUrl}
                          alt={`VietQR ${selectedBankInfo.shortName}`}
                          className="mockup-qr-img"
                        />
                        <span className="qr-acc-info">
                          {chuTaiKhoan} • {soTaiKhoan} ({selectedBankInfo.shortName})
                        </span>
                      </div>
                    )}

                    <div className="mockup-audio-indicator">
                      <span className="audio-anim-wave">
                        <Icon name="music" size={13} color="var(--secondary)" />
                      </span>
                      <span>
                        Nhạc nền:{" "}
                        {ROYAL_TUNES.find((r) => r.id === nhacNen)?.name}
                      </span>
                    </div>

                    <div className="mockup-ornament btm-ornament">
                      <span className="ornament-leaf">
                        <Icon name="crown" size={18} color="var(--secondary)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* CỘT PHẢI: FORM ĐIỀN THÔNG TIN CHI TIẾT */}
            <main
              className="custom-form-main"
              aria-label="Biểu mẫu thông tin thiệp cưới"
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                className="invitation-reg-form"
              >
                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="user" size={18} color="var(--primary)" />
                    1. Thông Tin Liên Hệ &amp; Tân Lang - Tân Nương
                  </h3>
                  <div className="form-fields-grid">
                    <Input
                      name="tenKhach"
                      label="Họ và tên người đăng ký"
                      placeholder="VD: Nguyễn Quốc Bảo"
                      value={tenKhach}
                      onChange={(e) => setTenKhach(e.target.value)}
                      error={errors.tenKhach}
                      required
                    />
                    <Input
                      name="soDienThoai"
                      label="Số điện thoại / Zalo"
                      placeholder="VD: 0912345678"
                      value={soDienThoai}
                      onChange={(e) => setSoDienThoai(e.target.value)}
                      error={errors.soDienThoai}
                      required
                    />
                  </div>

                  <div className="form-rank-couple-grid">
                    <div className="rank-select-field-wrap">
                      <label htmlFor="thu-bac-chu-re" className="input-label">
                        Thứ bậc (Chú Rể) <span className="required-star">*</span>
                      </label>
                      <select
                        id="thu-bac-chu-re"
                        name="thuBacChuRe"
                        className="custom-rank-select"
                        value={thuBacChuRe}
                        aria-invalid={false}
                        aria-describedby="desc-thu-bac-re"
                        onChange={(e) => setThuBacChuRe(e.target.value)}
                      >
                        {THU_BAC_CHU_RE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <span id="desc-thu-bac-re" className="sr-only">
                        Chọn thứ bậc chú rể trong gia đình
                      </span>
                    </div>
                    <Input
                      name="tenChuRe"
                      label="Họ tên Chú Rể"
                      placeholder="VD: Nguyễn Quốc Bảo"
                      value={tenChuRe}
                      onChange={(e) => setTenChuRe(e.target.value)}
                      error={errors.tenChuRe}
                      required
                    />
                  </div>

                  <div className="form-rank-couple-grid">
                    <div className="rank-select-field-wrap">
                      <label htmlFor="thu-bac-co-dau" className="input-label">
                        Thứ bậc (Cô Dâu) <span className="required-star">*</span>
                      </label>
                      <select
                        id="thu-bac-co-dau"
                        name="thuBacCoDau"
                        className="custom-rank-select"
                        value={thuBacCoDau}
                        aria-invalid={false}
                        aria-describedby="desc-thu-bac-dau"
                        onChange={(e) => setThuBacCoDau(e.target.value)}
                      >
                        {THU_BAC_CO_DAU_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <span id="desc-thu-bac-dau" className="sr-only">
                        Chọn thứ bậc cô dâu trong gia đình
                      </span>
                    </div>
                    <Input
                      name="tenCoDau"
                      label="Họ tên Cô Dâu"
                      placeholder="VD: Lê Ngọc Hân"
                      value={tenCoDau}
                      onChange={(e) => setTenCoDau(e.target.value)}
                      error={errors.tenCoDau}
                      required
                    />
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="crown" size={18} color="var(--primary)" />
                    2. Thông Tin Đại Diện Hai Họ
                  </h3>
                  <div className="form-fields-grid">
                    <Input
                      name="nhaTrai"
                      label="Đại diện Nhà Trai (Họ tên Song thân)"
                      placeholder="VD: Ông Nguyễn Văn Thắng & Bà Trần Thị Hòa"
                      value={nhaTrai}
                      onChange={(e) => setNhaTrai(e.target.value)}
                    />
                    <Input
                      name="nhaGai"
                      label="Đại diện Nhà Gái (Họ tên Song thân)"
                      placeholder="VD: Ông Lê Văn Định & Bà Hoàng Thị Mai"
                      value={nhaGai}
                      onChange={(e) => setNhaGai(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="clock" size={18} color="var(--primary)" />
                    3. Thời Gian &amp; Địa Điểm Tổ Chức Hôn Lễ
                  </h3>
                  <div className="form-fields-grid">
                    <Input
                      name="ngayCuoi"
                      label="Ngày cưới Dương lịch"
                      type="date"
                      value={ngayCuoi}
                      onChange={(e) => setNgayCuoi(e.target.value)}
                      error={errors.ngayCuoi}
                      required
                    />
                    <Input
                      name="gioToChuc"
                      label="Giờ cử hành hôn lễ *"
                      type="time"
                      value={gioToChuc}
                      onChange={(e) => setGioToChuc(e.target.value)}
                    />
                    <Input
                      name="ngayAmLich"
                      label="Ngày Âm lịch (Ghi chú ngày lành)"
                      placeholder="VD: Ngày 20 tháng 11 năm Bính Ngọ"
                      value={ngayAmLich}
                      onChange={(e) => setNgayAmLich(e.target.value)}
                    />
                    <Input
                      name="diaDiem"
                      label="Địa điểm tổ chức hôn lễ"
                      placeholder="VD: Nhà hát Cung Đình Huế"
                      value={diaDiem}
                      onChange={(e) => setDiaDiem(e.target.value)}
                      error={errors.diaDiem}
                      required
                    />
                    <div className="form-group-col-span-2">
                      <Input
                        name="mapUrl"
                        label="Link Google Map chỉ đường (Nếu có)"
                        placeholder="VD: https://maps.google.com/?q=Dai+Noi+Hue"
                        value={mapUrl}
                        onChange={(e) => setMapUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="qr" size={18} color="var(--primary)" />
                    4. Mã VietQR Động 15 Ngân Hàng &amp; Nhạc Nền Cung Đình
                  </h3>
                  <div className="form-fields-grid">
                    <div className="form-group">
                      <label className="input-label" htmlFor="select-bank">
                        Ngân hàng thụ hưởng (15 ngân hàng Napas)
                      </label>
                      <select
                        id="select-bank"
                        name="nganHang"
                        className="input-control select-control"
                        value={nganHang}
                        aria-invalid={false}
                        aria-describedby="desc-select-bank"
                        onChange={(e) => setNganHang(e.target.value)}
                      >
                        {BANK_BINS.map((bank) => (
                          <option key={bank.code} value={bank.code}>
                            {bank.shortName} (BIN {bank.bin})
                          </option>
                        ))}
                      </select>
                      <span id="desc-select-bank" className="sr-only">
                        Chọn ngân hàng tạo mã QR mừng cưới tự động
                      </span>
                    </div>

                    <Input
                      name="soTaiKhoan"
                      label="Số tài khoản ngân hàng"
                      placeholder="VD: 0905123456"
                      value={soTaiKhoan}
                      onChange={(e) => setSoTaiKhoan(e.target.value)}
                    />

                    <Input
                      name="chuTaiKhoan"
                      label="Tên chủ tài khoản (In hoa không dấu)"
                      placeholder="VD: NGUYEN QUOC BAO"
                      value={chuTaiKhoan}
                      onChange={(e) =>
                        setChuTaiKhoan(e.target.value.toUpperCase())
                      }
                    />

                    <Input
                      name="soTienMungGoiY"
                      label="Mức tiền mừng gợi ý (VNĐ - nhập 0 để khách tự điền)"
                      type="number"
                      min={0}
                      step={100000}
                      value={String(soTienMungGoiY)}
                      onChange={(e) =>
                        setSoTienMungGoiY(Math.max(0, Number(e.target.value) || 0))
                      }
                    />

                    <div className="form-group-col-span-2">
                      <label className="input-label" htmlFor="select-nhac-nen">
                        Nhạc nền cung đình tự phát khi mở thiệp
                      </label>
                      <select
                        id="select-nhac-nen"
                        name="nhacNen"
                        className="input-control select-control"
                        value={nhacNen}
                        aria-invalid={false}
                        aria-describedby="desc-select-nhac"
                        onChange={(e) => setNhacNen(e.target.value)}
                      >
                        {ROYAL_TUNES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <span id="desc-select-nhac" className="sr-only">
                        Chọn bản Nhã nhạc phát trên thiệp
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="check" size={18} color="var(--primary)" />
                    5. Lời Ngỏ Gửi Đến Quan Khách
                  </h3>
                  <div className="form-group-full">
                    <label htmlFor="ghi-chu-thiep" className="sr-only">
                      Lời ngỏ gửi đến quan khách
                    </label>
                    <textarea
                      id="ghi-chu-thiep"
                      name="loiNgo"
                      className="input-control"
                      rows={3}
                      aria-invalid={false}
                      aria-describedby="desc-loi-ngo"
                      placeholder="Nhập lời nhắn gửi, tâm sự ngọt ngào của Dâu Rể..."
                      value={loiNgo}
                      onChange={(e) => setLoiNgo(e.target.value)}
                    />
                    <span id="desc-loi-ngo" className="sr-only">
                      Nội dung lời mời hiển thị trên thiệp công khai
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="btn-submit-invitation"
                  leftIcon={<Icon name="sparkles" size={18} />}
                >
                  Phát Hành Thiệp Online &amp; Tạo Link Chia Sẻ (
                  {selectedTier.toUpperCase()} -{" "}
                  {selectedTier === "vip"
                    ? "450.000 đ"
                    : selectedTier === "pro"
                    ? "295.000 đ"
                    : "168.000 đ"}
                  )
                </Button>
              </form>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
