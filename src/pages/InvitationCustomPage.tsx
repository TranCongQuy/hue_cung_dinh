import { useState, FormEvent, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { ThiepCuoiLoai, datThiepFormSchema } from "../features/invitations/types";
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

export function InvitationCustomPage() {
  const [searchParams] = useSearchParams();
  const initialTier = (searchParams.get("goi") as ThiepCuoiLoai) || "vip";

  const [selectedTier, setSelectedTier] = useState<ThiepCuoiLoai>(initialTier);
  const [selectedStyle, setSelectedStyle] = useState<"cung-dinh" | "co-dien" | "hien-dai">("cung-dinh");

  // Live form state
  const [tenKhach, setTenKhach] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [tenChuRe, setTenChuRe] = useState("Nguyễn Văn Hoàng");
  const [tenCoDau, setTenCoDau] = useState("Lê Thị Ngọc Mai");
  const [nhaTrai, setNhaTrai] = useState("Ông Nguyễn Văn Thắng & Bà Trần Thị Hòa");
  const [nhaGai, setNhaGai] = useState("Ông Lê Văn Định & Bà Hoàng Thị Mai");
  const [ngayCuoi, setNgayCuoi] = useState("2026-11-20");
  const [gioToChuc, setGioToChuc] = useState("11:00");
  const [ngayAmLich, setNgayAmLich] = useState("Ngày 12 tháng 10 năm Bính Ngọ");
  const [diaDiem, setDiaDiem] = useState("Trung Tâm Hội Nghị Hoàng Gia Cố Đô, TP. Huế");
  const [mapUrl, setMapUrl] = useState("https://maps.google.com");
  const [nganHang, setNganHang] = useState("MB Bank");
  const [chuTaiKhoan, setChuTaiKhoan] = useState("NGUYEN VAN HOANG");
  const [soTaiKhoan, setSoTaiKhoan] = useState("0987654321");
  const [nhacNen, setNhacNen] = useState("nhac-01");
  const [loiNgo, setLoiNgo] = useState("Trân trọng kính mời quý bạn hữu cùng chứng kiến và sẻ chia khoảnh khắc kết duyên trăm năm ngập tràn hạnh phúc của chúng tôi.");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    soDienThoai: string;
    tenCoDau: string;
    tenChuRe: string;
  } | null>(null);

  const addToast = useToastStore((s) => s.addToast);

  // Dynamic VietQR preview URL for wedding money gift
  const vietQrUrl = useMemo(() => {
    if (!soTaiKhoan) return null;
    const bankBin = "970422"; // MBBank standard BIN
    return `https://img.vietqr.io/image/${bankBin}-${soTaiKhoan}-compact2.png?amount=500000&addInfo=Mung%20Cuoi%20${encodeURIComponent(tenChuRe)}%20${encodeURIComponent(tenCoDau)}`;
  }, [soTaiKhoan, tenChuRe, tenCoDau]);

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
      ghiChu: `[Thiệp Tự Thiết Kế] Giờ: ${gioToChuc} | Âm lịch: ${ngayAmLich} | Nhà trai: ${nhaTrai} | Nhà gái: ${nhaGai} | Map: ${mapUrl} | STK: ${soTaiKhoan} (${nganHang} - ${chuTaiKhoan}) | Nhạc: ${nhacNen} | Lời ngỏ: ${loiNgo}`,
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
      const requestPayload = {
        tenKhach: tenKhach || tenChuRe,
        soDienThoai,
        ngayCuoi,
        nganSach: selectedTier === "vip" ? 450000 : selectedTier === "pro" ? 295000 : 168000,
        goiDeXuatId: `thiep-${selectedTier}`,
        tenDon: `Đơn Thiết Kế Thiệp Online (${selectedTier.toUpperCase()} - ${tenChuRe} & ${tenCoDau})`,
        diaDiemChup: diaDiem,
        mongMuonBoSung: `Gói: ${selectedTier.toUpperCase()} | Phong cách: ${selectedStyle} | Nhạc: ${nhacNen} | STK: ${soTaiKhoan} - ${nganHang}`,
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
      setSuccessInfo({ soDienThoai, tenCoDau, tenChuRe });
      addToast("Đăng ký khởi tạo thiệp cưới thành công! Studio sẽ liên hệ sớm nhất.", "success", 5000);
    } catch {
      addToast("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.", "error", 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-invitation-page">
      <FixedFloatingRings />

      <div className="container custom-invitation-container">
        <div className="custom-invitation-nav">
          <Link to="/thiep-cuoi" className="back-link">
            ← Quay Lại Kho Mẫu Thiệp
          </Link>
          <RoyalCourtAudio />
        </div>

        <header className="custom-invitation-header">
          <span className="section-tag">KHỞI TẠO THIỆP CƯỚI TRỰC TUYẾN</span>
          <h1 className="custom-title">Đăng Ký &amp; Cá Nhân Hóa Thiệp Cưới Online</h1>
          <p className="custom-subtitle">
            Điền thông tin hôn lễ bên phải, bản xem trước thiệp cưới bên trái sẽ tự động hiển thị trực quan theo thời gian thực.
          </p>
        </header>

        {successInfo ? (
          <div className="success-confirmation-card">
            <div className="success-icon-wrap">
              <Icon name="check" size={32} color="#16a34a" />
            </div>
            <h2>Đăng Ký Khởi Tạo Thiệp Thành Công!</h2>
            <p>
              Ekip thiết kế Cung Đình sẽ liên hệ số <strong>{successInfo.soDienThoai}</strong> trong vòng 1 giờ làm việc để bàn giao đường link thiệp trực tuyến chính thức cho Cô Dâu <strong>{successInfo.tenCoDau}</strong> &amp; Chú Rể <strong>{successInfo.tenChuRe}</strong>.
            </p>
            <div className="success-actions">
              <Link to="/don-cua-toi">
                <Button variant="primary" leftIcon={<Icon name="check" size={16} />}>
                  Xem Đơn Của Tôi
                </Button>
              </Link>
              <Link to="/thiep-cuoi">
                <Button variant="secondary">Xem Thêm Mẫu Thiệp Khác</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="custom-invitation-grid">
            {/* CỘT TRÁI: BỘ LỌC & XEM TRƯỚC THIỆP CƯỚI REAL-TIME */}
            <aside className="custom-preview-col" aria-label="Xem trước thiệp cưới">
              <div className="preview-sticky-wrap">
                {/* Chọn gói & Phong cách */}
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
                          {t.toUpperCase()} {t === "vip" ? "👑" : t === "pro" ? "✨" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-row">
                    <span className="option-label">Phong cách hôn lễ:</span>
                    <div className="style-chips-row">
                      <button
                        type="button"
                        className={`style-chip ${selectedStyle === "cung-dinh" ? "chip-active" : ""}`}
                        onClick={() => setSelectedStyle("cung-dinh")}
                      >
                        🏛️ Cung Đình
                      </button>
                      <button
                        type="button"
                        className={`style-chip ${selectedStyle === "co-dien" ? "chip-active" : ""}`}
                        onClick={() => setSelectedStyle("co-dien")}
                      >
                        📜 Cổ Điển
                      </button>
                      <button
                        type="button"
                        className={`style-chip ${selectedStyle === "hien-dai" ? "chip-active" : ""}`}
                        onClick={() => setSelectedStyle("hien-dai")}
                      >
                        ✨ Hiện Đại
                      </button>
                    </div>
                  </div>
                </div>

                {/* THIỆP MOCKUP CARD TRỰC QUAN */}
                <div className={`royal-invitation-mockup style-${selectedStyle} tier-${selectedTier}`}>
                  <div className="mockup-header-accent">
                    <span className="mockup-badge">SAVE THE DATE</span>
                    <span className="mockup-sub-badge">HÔN LỄ HOÀNG GIA</span>
                  </div>

                  <div className="mockup-inner-frame">
                    <div className="mockup-ornament top-ornament">
                      <span className="ornament-leaf">⚜️</span>
                    </div>

                    <div className="mockup-parents-block">
                      <div className="parent-side">
                        <span className="side-title">NHÀ TRAI</span>
                        <p className="side-name">{nhaTrai || "Ông/Bà Nhà Trai"}</p>
                      </div>
                      <div className="parent-divider">💍</div>
                      <div className="parent-side">
                        <span className="side-title">NHÀ GÁI</span>
                        <p className="side-name">{nhaGai || "Ông/Bà Nhà Gái"}</p>
                      </div>
                    </div>

                    <p className="mockup-intro">Trân trọng kính báo tin Hỷ hôn phối của</p>

                    <div className="mockup-couple-names">
                      <span className="groom-title">Chú Rể</span>
                      <h3 className="groom-name">{tenChuRe || "Tên Chú Rể"}</h3>
                      <span className="couple-amp">&amp;</span>
                      <span className="bride-title">Cô Dâu</span>
                      <h3 className="bride-name">{tenCoDau || "Tên Cô Dâu"}</h3>
                    </div>

                    <div className="mockup-time-box">
                      <div className="time-row-solar">
                        <span className="time-hour">{gioToChuc || "11:00"}</span>
                        <span className="time-date">{ngayCuoi ? new Date(ngayCuoi).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }) : "Ngày cưới"}</span>
                      </div>
                      <div className="time-row-lunar">
                        <span>(Tức: {ngayAmLich || "Ngày hoàng đạo"})</span>
                      </div>
                    </div>

                    <div className="mockup-location-box">
                      <Icon name="mapPin" size={16} color="var(--primary)" />
                      <p className="location-text">{diaDiem || "Địa điểm hôn lễ"}</p>
                    </div>

                    <div className="mockup-message-box">
                      <p className="message-quote">"{loiNgo || "Lời ngỏ của gia đình"}"</p>
                    </div>

                    {/* Mừng cưới QR Code mockup */}
                    {vietQrUrl && (
                      <div className="mockup-vietqr-box">
                        <div className="qr-badge">Mã VietQR Mừng Cưới Thông Minh</div>
                        <img src={vietQrUrl} alt="VietQR Mừng Cưới" className="mockup-qr-img" />
                        <span className="qr-acc-info">{chuTaiKhoan} - {soTaiKhoan} ({nganHang})</span>
                      </div>
                    )}

                    <div className="mockup-audio-indicator">
                      <span className="audio-anim-wave">♫</span>
                      <span>Nhạc nền: {ROYAL_TUNES.find((r) => r.id === nhacNen)?.name}</span>
                    </div>

                    <div className="mockup-ornament btm-ornament">
                      <span className="ornament-leaf">⚜️</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* CỘT PHẢI: FORM ĐIỀN THÔNG TIN CHI TIẾT */}
            <main className="custom-form-main" aria-label="Biểu mẫu thông tin thiệp cưới">
              <form onSubmit={handleSubmit} noValidate className="invitation-reg-form">
                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="user" size={18} color="var(--primary)" />
                    1. Thông Tin Liên Hệ &amp; Tân Lang - Tân Nương
                  </h3>
                  <div className="form-fields-grid">
                    <Input
                      label="Họ và tên người đăng ký *"
                      placeholder="VD: Nguyễn Văn Hoàng"
                      value={tenKhach}
                      onChange={(e) => setTenKhach(e.target.value)}
                      error={errors.tenKhach}
                      required
                    />
                    <Input
                      label="Số điện thoại / Zalo *"
                      placeholder="VD: 0912345678"
                      value={soDienThoai}
                      onChange={(e) => setSoDienThoai(e.target.value)}
                      error={errors.soDienThoai}
                      required
                    />
                    <Input
                      label="Họ tên Chú Rể *"
                      placeholder="VD: Nguyễn Văn Hoàng"
                      value={tenChuRe}
                      onChange={(e) => setTenChuRe(e.target.value)}
                      error={errors.tenChuRe}
                      required
                    />
                    <Input
                      label="Họ tên Cô Dâu *"
                      placeholder="VD: Lê Thị Ngọc Mai"
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
                      label="Đại diện Nhà Trai (Họ tên Song thân)"
                      placeholder="VD: Ông Nguyễn Văn Thắng & Bà Trần Thị Hòa"
                      value={nhaTrai}
                      onChange={(e) => setNhaTrai(e.target.value)}
                    />
                    <Input
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
                      label="Ngày cưới Dương lịch *"
                      type="date"
                      value={ngayCuoi}
                      onChange={(e) => setNgayCuoi(e.target.value)}
                      error={errors.ngayCuoi}
                      required
                    />
                    <Input
                      label="Giờ cử hành hôn lễ *"
                      type="time"
                      value={gioToChuc}
                      onChange={(e) => setGioToChuc(e.target.value)}
                    />
                    <Input
                      label="Ngày Âm lịch (Ghi chú ngày lành)"
                      placeholder="VD: Ngày 12 tháng 10 năm Bính Ngọ"
                      value={ngayAmLich}
                      onChange={(e) => setNgayAmLich(e.target.value)}
                    />
                    <Input
                      label="Địa điểm tổ chức hôn lễ *"
                      placeholder="VD: Nhà hát Cung Đình Huế"
                      value={diaDiem}
                      onChange={(e) => setDiaDiem(e.target.value)}
                      error={errors.diaDiem}
                      required
                    />
                    <div className="form-group-col-span-2">
                      <Input
                        label="Link Google Map chỉ đường (Nếu có)"
                        placeholder="VD: https://maps.app.goo.gl/..."
                        value={mapUrl}
                        onChange={(e) => setMapUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="sparkles" size={18} color="var(--primary)" />
                    4. Tiện Ích VietQR &amp; Nhạc Nền Cung Đình
                  </h3>
                  <div className="form-fields-grid">
                    <div className="form-group">
                      <label className="input-label" htmlFor="select-bank">Ngân hàng thụ hưởng</label>
                      <input
                        id="select-bank"
                        className="input-control"
                        placeholder="VD: MB Bank, Vietcombank, Techcombank..."
                        value={nganHang}
                        onChange={(e) => setNganHang(e.target.value)}
                      />
                    </div>
                    <Input
                      label="Số tài khoản ngân hàng"
                      placeholder="VD: 0987654321"
                      value={soTaiKhoan}
                      onChange={(e) => setSoTaiKhoan(e.target.value)}
                    />
                    <div className="form-group-col-span-2">
                      <Input
                        label="Tên chủ tài khoản (In hoa không dấu)"
                        placeholder="VD: NGUYEN VAN HOANG"
                        value={chuTaiKhoan}
                        onChange={(e) => setChuTaiKhoan(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="form-group-col-span-2">
                      <label className="input-label" htmlFor="select-nhac-nen">Nhạc nền cung đình tự phát khi mở thiệp</label>
                      <select
                        id="select-nhac-nen"
                        className="input-control select-control"
                        value={nhacNen}
                        onChange={(e) => setNhacNen(e.target.value)}
                      >
                        {ROYAL_TUNES.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="form-legend">
                    <Icon name="check" size={18} color="var(--primary)" />
                    5. Lời Ngỏ Gửi Đến Quan Khách
                  </h3>
                  <div className="form-group-full">
                    <textarea
                      id="ghi-chu-thiep"
                      className="input-control"
                      rows={3}
                      placeholder="Nhập lời nhắn gửi, tâm sự ngọt ngào của Dâu Rể..."
                      value={loiNgo}
                      onChange={(e) => setLoiNgo(e.target.value)}
                    />
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
                  Xác Nhận Đăng Ký Khởi Tạo Thiệp ({selectedTier.toUpperCase()} - {selectedTier === "vip" ? "450.000 đ" : selectedTier === "pro" ? "295.000 đ" : "168.000 đ"})
                </Button>
              </form>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
