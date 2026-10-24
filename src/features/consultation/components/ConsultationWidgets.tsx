import { FormEvent } from "react";
import { TuVanResult } from "../types";
import { formatCurrency } from "../../../lib/formatters";
import { PackageCard } from "../../packages/components/PackageCard";
import { ServiceCard } from "../../services/components/ServiceCard";
import { Button } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import "./ConsultationWidgets.css";

/* ==========================================================================
   1. CONSULTATION CRITERIA FORM COMPONENT
   ========================================================================== */
interface CriteriaFormProps {
  diaDiem: string;
  setDiaDiem: (val: string) => void;
  soTrangPhuc: number;
  setSoTrangPhuc: (val: number) => void;
  hinhThucChup: string;
  setHinhThucChup: (val: string) => void;
  nganSach: number;
  setNganSach: (val: number) => void;
  errorMsg: string;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
}

export function ConsultationCriteriaForm({
  diaDiem,
  setDiaDiem,
  soTrangPhuc,
  setSoTrangPhuc,
  hinhThucChup,
  setHinhThucChup,
  nganSach,
  setNganSach,
  errorMsg,
  isLoading,
  onSubmit,
}: CriteriaFormProps) {
  return (
    <div className="consult-form-card">
      <div className="consult-card-header">
        <Icon name="sparkles" size={24} color="var(--secondary)" />
        <h3>Tiêu Chí Bộ Ảnh Của Đôi Bạn</h3>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="criteria-grid">
          <div className="criteria-field">
            <label className="criteria-label">Địa điểm chụp di sản:</label>
            <select
              className="input-control"
              value={diaDiem}
              onChange={(e) => setDiaDiem(e.target.value)}
            >
              <option value="dai-noi">Quần thể Đại Nội &amp; Cung Diên Thọ</option>
              <option value="lang-khai-dinh">Lăng Khải Định &amp; Đồi Thông Thiên An</option>
              <option value="song-huong">Biệt Phủ Cổ &amp; Bến Thuyền Sông Hương</option>
              <option value="lang-tu-duc">Lăng Tự Đức &amp; Làng Hương Thủy Xuân</option>
            </select>
          </div>

          <div className="criteria-field">
            <label className="criteria-label">Số bộ cổ phục hoàng gia:</label>
            <div className="pill-choice-row">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`pill-choice-btn ${soTrangPhuc === num ? "pill-choice-active" : ""}`}
                  onClick={() => setSoTrangPhuc(num)}
                >
                  {num} Bộ Cổ Phục
                </button>
              ))}
            </div>
          </div>

          <div className="criteria-field">
            <label className="criteria-label">Hình thức quay chụp:</label>
            <div className="pill-choice-row">
              <button
                type="button"
                className={`pill-choice-btn ${hinhThucChup === "ngoai-canh" ? "pill-choice-active" : ""}`}
                onClick={() => setHinhThucChup("ngoai-canh")}
              >
                Ngoại Cảnh Di Sản
              </button>
              <button
                type="button"
                className={`pill-choice-btn ${hinhThucChup === "phim-truong" ? "pill-choice-active" : ""}`}
                onClick={() => setHinhThucChup("phim-truong")}
              >
                Cung Điện Nội Bộ
              </button>
            </div>
          </div>

          <div className="criteria-field">
            <div className="budget-slider-header">
              <label className="criteria-label">Ngân sách dự kiến:</label>
              <span className="budget-val-badge">{formatCurrency(nganSach)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={60000000}
              step={1000000}
              value={nganSach}
              onChange={(e) => setNganSach(Number(e.target.value))}
              className="budget-range-input"
            />
            <div className="budget-markers">
              <span>10 Triệu</span>
              <span>35 Triệu</span>
              <span>60 Triệu</span>
            </div>
          </div>
        </div>

        {errorMsg && <p className="criteria-error-msg">{errorMsg}</p>}

        <div className="criteria-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            leftIcon={<Icon name="sparkles" size={18} />}
          >
            {isLoading ? "AI Đang Phân Tích & May Đo..." : "AI Gợi Ý Gói Cưới Tối Ưu"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ==========================================================================
   2. CONSULTATION RESULT BOX COMPONENT
   ========================================================================== */
interface ResultBoxProps {
  result: TuVanResult;
}

export function ConsultationResultBox({ result }: ResultBoxProps) {
  return (
    <div className="consult-result-box" aria-label="Kết quả phân tích từ AI Cung Đình">
      <div
        className={`analysis-banner ${
          result.duNganSach ? "banner-surplus" : "banner-deficit"
        }`}
      >
        <div className="banner-icon">
          <Icon name={result.duNganSach ? "check" : "alert"} size={28} />
        </div>
        <div className="banner-content">
          <h4 className="banner-title">
            {result.duNganSach
              ? `Dư Ngân Sách Dự Kiến: +${formatCurrency(result.chenhLech)}`
              : `Cần Cân Đối Thêm: -${formatCurrency(Math.abs(result.chenhLech))}`}
          </h4>
          <p className="banner-desc">{result.phanTich}</p>
        </div>
      </div>

      <div className="recommended-package-wrap">
        <div className="section-title-wrap">
          <Icon name="crown" size={22} color="var(--secondary)" />
          <h3 className="result-section-title">Gói Cưới Tối Ưu Nhất Cho Đôi Bạn</h3>
        </div>
        <div className="package-card-highlight-wrap">
          <PackageCard pkg={result.goiDeXuat} />
        </div>
      </div>

      {result.dichVuGoiYThem.length > 0 && (
        <div className="addon-services-wrap">
          <div className="section-title-wrap">
            <Icon name="sparkles" size={20} color="var(--secondary)" />
            <h3 className="result-section-title">
              Dịch Vụ Nâng Cấp Khuyến Nghị (Trong khoảng dư {formatCurrency(result.chenhLech)})
            </h3>
          </div>
          <div className="addon-services-grid">
            {result.dichVuGoiYThem.map((dv) => (
              <ServiceCard key={dv.id} service={dv} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

