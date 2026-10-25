import { useState, FormEvent } from "react";
import { useSearchParams, Link } from "react-router";
import { ThiepCuoiLoai, datThiepFormSchema } from "../features/invitations/types";
import { Input, Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { useToastStore } from "../lib/toastStore";
import { SupabaseService } from "../lib/supabaseAdapter";
import { RoyalCourtAudio } from "../features/invitations/components/RoyalCourtAudio";
import "./InvitationCustomPage.css";

/* ==========================================================================
   1. AI TEMPLATE RECOMMENDER COMPONENT
   ========================================================================== */
interface RecommenderProps {
  selectedTier: ThiepCuoiLoai;
  onSelectTier: (tier: ThiepCuoiLoai) => void;
  selectedStyle: string;
  onSelectStyle: (st: string) => void;
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
}

const AI_RECOMMENDATIONS = {
  vip: {
    id: "tc-01",
    ten: "Hoàng Kim Liên Hoa (VIP)",
    phongCach: "cung-dinh",
    hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80",
    matchScore: 99,
    lyDo: "Thiết kế Sen Vàng Hoàng Cung quý phái, hiệu ứng mở phong bì hoàng triều, nhạc nhã nhạc tự động và album HD không giới hạn.",
  },
  pro: {
    id: "tc-03",
    ten: "Thanh Phong Tố Nguyệt (PRO)",
    phongCach: "co-dien",
    hinhAnh: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    matchScore: 96,
    lyDo: "Tông kem ngà hoài niệm sông Hương thơ mộng, đếm ngược ngày trọng đại và hòm thư lưu giữ lời chúc ngọt ngào.",
  },
  basic: {
    id: "tc-05",
    ten: "Tân Hôn Cung Đình (BASIC)",
    phongCach: "hien-dai",
    hinhAnh: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    matchScore: 94,
    lyDo: "Tinh giản nhẹ nhàng, hiển thị siêu tốc trên smartphone với album 6 ảnh cưới và mã QR mừng cưới tiện lợi.",
  },
};

export function AiTemplateRecommender({
  selectedTier,
  onSelectTier,
  selectedStyle,
  onSelectStyle,
  selectedTemplateId,
  onSelectTemplate,
}: RecommenderProps) {
  const rec = AI_RECOMMENDATIONS[selectedTier] || AI_RECOMMENDATIONS.vip;
  const isSelected = selectedTemplateId === rec.id;

  return (
    <div className="ai-recommender-card">
      <div className="ai-recommender-header">
        <div className="ai-badge-chip">
          <Icon name="sparkles" size={16} color="#d4af37" />
          <span>AI Trợ Lý Gợi Ý Mẫu Thiệp</span>
        </div>
        <span className="ai-match-score">So khớp {rec.matchScore}%</span>
      </div>

      <div className="tier-selector-box">
        <span className="selector-heading">Gói thiệp dịch vụ:</span>
        <div className="tier-pill-group">
          {(["vip", "pro", "basic"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`tier-pill ${selectedTier === t ? "active" : ""}`}
              onClick={() => onSelectTier(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="ai-style-selector">
        <label className="recommender-label selector-heading">Phong cách hôn lễ:</label>
        <div className="style-chips-row">
          <button
            type="button"
            className={`style-chip ${selectedStyle === "cung-dinh" ? "chip-active" : ""}`}
            onClick={() => onSelectStyle("cung-dinh")}
          >
            Cung Đình
          </button>
          <button
            type="button"
            className={`style-chip ${selectedStyle === "co-dien" ? "chip-active" : ""}`}
            onClick={() => onSelectStyle("co-dien")}
          >
            Cổ Điển
          </button>
          <button
            type="button"
            className={`style-chip ${selectedStyle === "hien-dai" ? "chip-active" : ""}`}
            onClick={() => onSelectStyle("hien-dai")}
          >
            Hiện Đại
          </button>
        </div>
      </div>

      <div className={`ai-suggested-item ${isSelected ? "suggested-chosen" : ""}`}>
        <img src={rec.hinhAnh} alt={rec.ten} className="suggested-thumb" />
        <div className="suggested-info">
          <h4>{rec.ten}</h4>
          <p className="suggested-reason">{rec.lyDo}</p>
          <button
            type="button"
            className={`btn-choose-suggested ${isSelected ? "btn-suggested-active" : ""}`}
            onClick={() => onSelectTemplate(rec.id)}
          >
            {isSelected ? "Đã Lựa Chọn Mẫu Này" : "Chọn Mẫu AI Gợi Ý Này"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. INVITATION CUSTOM FORM COMPONENT
   ========================================================================== */
interface InvitationCustomFormProps {
  selectedTier: ThiepCuoiLoai;
  selectedTemplateId: string;
  onSuccess: (data: { soDienThoai: string; tenCoDau: string; tenChuRe: string }) => void;
}

export function InvitationCustomForm({
  selectedTier,
  selectedTemplateId,
  onSuccess,
}: InvitationCustomFormProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [tenKhach, setTenKhach] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [tenCoDau, setTenCoDau] = useState("");
  const [tenChuRe, setTenChuRe] = useState("");
  const [ngayCuoi, setNgayCuoi] = useState("");
  const [diaDiem, setDiaDiem] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = datThiepFormSchema.safeParse({
      tenKhach,
      soDienThoai,
      tenCoDau,
      tenChuRe,
      ngayCuoi,
      diaDiem,
      mauThiepId: selectedTemplateId,
      goiDichVu: selectedTier,
      ghiChu,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (field) errMap[String(field)] = err.message;
      });
      setErrors(errMap);
      addToast("Vui lòng kiểm tra lại thông tin đăng ký", "error");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const requestPayload = {
        tenKhach,
        soDienThoai,
        ngayCuoi,
        soLuongKhach: 100,
        nganSach: selectedTier === "vip" ? 450000 : selectedTier === "pro" ? 295000 : 168000,
        goiDeXuatId: selectedTemplateId,
        ghiChu: `[Đăng Ký Thiệp Online] Gói: ${selectedTier.toUpperCase()} | Mẫu: ${selectedTemplateId} | Cô Dâu: ${tenCoDau} - Chú Rể: ${tenChuRe} | Địa điểm: ${diaDiem} | Lời dặn: ${ghiChu}`,
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
      onSuccess({ soDienThoai, tenCoDau, tenChuRe });
      addToast("Đăng ký khởi tạo thiệp cưới thành công!", "success");
    } catch {
      addToast("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-form-container">
      <form onSubmit={handleSubmit} noValidate className="invitation-reg-form">
        <h3 className="form-legend">Thông Tin Hôn Lễ Của Bạn</h3>
        <div className="form-fields-grid">
          <Input label="Họ và tên người đăng ký" value={tenKhach} onChange={(e) => setTenKhach(e.target.value)} error={errors.tenKhach} required />
          <Input label="Số điện thoại Zalo / Liên hệ" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} error={errors.soDienThoai} required />
          <Input label="Họ tên Chú Rể" value={tenChuRe} onChange={(e) => setTenChuRe(e.target.value)} error={errors.tenChuRe} required />
          <Input label="Họ tên Cô Dâu" value={tenCoDau} onChange={(e) => setTenCoDau(e.target.value)} error={errors.tenCoDau} required />
          <Input label="Ngày cưới tổ chức" type="date" value={ngayCuoi} onChange={(e) => setNgayCuoi(e.target.value)} error={errors.ngayCuoi} required />
          <Input label="Địa điểm tổ chức hôn lễ" placeholder="VD: Nhà hát Cung Đình" value={diaDiem} onChange={(e) => setDiaDiem(e.target.value)} error={errors.diaDiem} required />
        </div>

        <div className="form-group-full">
          <label className="input-label" htmlFor="ghi-chu-thiep">Lời dặn hoặc link ảnh cưới (Nếu có)</label>
          <textarea id="ghi-chu-thiep" className="input-control" rows={3} placeholder="Nhập thông tin tài khoản mừng cưới, lời chúc..." value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="btn-submit-invitation" leftIcon={<Icon name="sparkles" size={18} />}>
          Gửi Đăng Ký Khởi Tạo Thiệp Cưới
        </Button>
      </form>
    </div>
  );
}

/* ==========================================================================
   3. INVITATION CUSTOM PAGE
   ========================================================================== */
export function InvitationCustomPage() {
  const [searchParams] = useSearchParams();
  const initialTier = (searchParams.get("goi") as ThiepCuoiLoai) || "vip";

  const [selectedTier, setSelectedTier] = useState<ThiepCuoiLoai>(initialTier);
  const [selectedStyle, setSelectedStyle] = useState("cung-dinh");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialTier === "vip" ? "tc-01" : initialTier === "pro" ? "tc-03" : "tc-05"
  );

  const [successInfo, setSuccessInfo] = useState<{
    soDienThoai: string;
    tenCoDau: string;
    tenChuRe: string;
  } | null>(null);

  return (
    <div className="custom-invitation-page">
      <div className="container">
        <div className="custom-invitation-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <Link to="/thiep-cuoi" className="back-link">
            ← Quay Lại Kho Mẫu Thiệp
          </Link>
          <RoyalCourtAudio />
        </div>

        <header className="custom-invitation-header">
          <span className="section-tag">KHỞI TẠO THIỆP CƯỚI TRỰC TUYẾN</span>
          <h1 className="custom-title">Đăng Ký Thiết Kế Thiệp Cưới Online</h1>
          <p className="custom-subtitle">
            Hệ thống AI sẽ phối màu và tối ưu bố cục thiệp cưới theo gói dịch vụ hoàng gia bạn lựa chọn.
          </p>
        </header>

        {successInfo ? (
          <div className="success-confirmation-card">
            <div className="success-icon-wrap">
              <Icon name="check" size={32} color="#16a34a" />
            </div>
            <h2>Đăng Ký Khởi Tạo Thiệp Thành Công!</h2>
            <p>
              Ekip thiết kế Cố Đô sẽ liên hệ số <strong>{successInfo.soDienThoai}</strong> trong vòng 15 phút để hoàn tất bản demo cho Cô Dâu <strong>{successInfo.tenCoDau}</strong> &amp; Chú Rể <strong>{successInfo.tenChuRe}</strong>.
            </p>
            <div className="success-actions" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/don-cua-toi">
                <Button variant="primary" leftIcon={<Icon name="check" size={16} />}>
                  Xem Đơn Đã Đăng Ký
                </Button>
              </Link>
              <Link to="/thiep-cuoi">
                <Button variant="secondary">Xem Thêm Các Mẫu Khác</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="custom-invitation-grid">
            <div className="custom-sidebar">
              <AiTemplateRecommender
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={setSelectedTemplateId}
              />
            </div>

            <div className="custom-form-main">
              <InvitationCustomForm
                selectedTier={selectedTier}
                selectedTemplateId={selectedTemplateId}
                onSuccess={(data) => {
                  setSuccessInfo({
                    soDienThoai: data.soDienThoai,
                    tenCoDau: data.tenCoDau,
                    tenChuRe: data.tenChuRe,
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
