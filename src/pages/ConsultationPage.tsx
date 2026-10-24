import { useState, useEffect, FormEvent } from "react";
import { tuVanInputSchema, tuVanResultSchema, TuVanResult } from "../features/consultation/types";
import {
  ConsultationCriteriaForm,
  ConsultationResultBox,
} from "../features/consultation/components/ConsultationWidgets";
import { SkeletonCard } from "../components/common/UI";
import { useToastStore } from "../lib/toastStore";
import "./ConsultationPage.css";

/* ==========================================================================
   1. CONSULTATION SHOWCASE COMPONENT
   ========================================================================== */
const SHOWCASE_PHOTOS = [
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
];

export function ConsultationShowcase() {
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIdx((prev) => (prev + 1) % SHOWCASE_PHOTOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="showcase-left-card">
      <div className="showcase-media-frame">
        <img
          key={photoIdx}
          src={SHOWCASE_PHOTOS[photoIdx]}
          alt="Bộ ảnh cưới hoàng triều"
          className="showcase-dynamic-img"
        />
        <div className="showcase-overlay-text">
          <span className="showcase-script">Happy Wedding</span>
          <h3 className="showcase-couple-title">Chú Rể + Cô Dâu</h3>
          <p className="showcase-location-tag">Hoàng Thành Huế • Di Sản Cung Đình</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. CONSULTATION PAGE COMPONENT
   ========================================================================== */
export function ConsultationPage() {
  const addToast = useToastStore((s) => s.addToast);

  const [nganSach, setNganSach] = useState(25000000);
  const [diaDiem, setDiaDiem] = useState("dai-noi");
  const [soTrangPhuc, setSoTrangPhuc] = useState(2);
  const [hinhThucChup, setHinhThucChup] = useState("ngoai-canh");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TuVanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = tuVanInputSchema.safeParse({
      nganSach,
      diaDiem,
      soTrangPhuc,
      hinhThucChup,
      phongCach: "all",
      soLuongKhach: 100,
    });

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Thông tin nhập chưa hợp lệ");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/tu-van", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error("Tính toán không thành công");
      const raw: unknown = await res.json();
      const validResult = tuVanResultSchema.safeParse(raw);
      if (!validResult.success) throw new Error("Phản hồi không khớp định dạng");

      setResult(validResult.data);
      addToast("AI đã hoàn thành phân tích hôn lễ tối ưu cho bạn!", "success");
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ phân tích. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="consult-page-root">
      <div className="page-header-banner">
        <div className="container">
          <span className="section-tag">TRÍ TUỆ NHÂN TẠO CỐ ĐÔ</span>
          <h1 className="page-title">AI Tư Vấn Hôn Lễ Hoàng Triều</h1>
          <p className="page-subtitle">
            Hệ thống so khớp thông minh địa điểm, số lượng cổ phục và ngân sách để hoạch định bộ ảnh cưới hoàn mỹ.
          </p>
        </div>
      </div>

      <div className="container consult-container">
        <div className="consult-layout-grid">
          <ConsultationShowcase />

          <ConsultationCriteriaForm
            diaDiem={diaDiem}
            setDiaDiem={setDiaDiem}
            soTrangPhuc={soTrangPhuc}
            setSoTrangPhuc={setSoTrangPhuc}
            hinhThucChup={hinhThucChup}
            setHinhThucChup={setHinhThucChup}
            nganSach={nganSach}
            setNganSach={setNganSach}
            errorMsg={errorMsg}
            isLoading={isLoading}
            onSubmit={handleCalculate}
          />
        </div>

        {isLoading && (
          <div className="consult-loading-box">
            <SkeletonCard />
            <p className="loading-ai-text">AI đang tính toán và so khớp các gói cưới tối ưu...</p>
          </div>
        )}

        {!isLoading && result && <ConsultationResultBox result={result} />}
      </div>
    </div>
  );
}
