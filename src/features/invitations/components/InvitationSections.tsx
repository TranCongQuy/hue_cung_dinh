import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Icon } from "../../../components/common/Icon";
import { formatVND } from "../../../lib/formatters";
import { ThiepCuoiLoai, GoiGiaThiep } from "../types";
import "./InvitationSections.css";

/* ==========================================================================
   1. INVITATION STEPS SECTION
   ========================================================================== */
interface StepData {
  number: number;
  title: string;
  description: string;
}

const STEPS: StepData[] = [
  {
    number: 1,
    title: "Tiếp Nhận Yêu Cầu",
    description:
      "Chọn mẫu thiệp ưng ý hoặc ý tưởng cung đình của bạn, gửi cho Huế Cung Đình các thông tin ngày lành, địa điểm và yêu cầu của Dâu Rể.",
  },
  {
    number: 2,
    title: "Tiến Hành Thực Hiện",
    description:
      "Huế Cung Đình tiến hành thực hiện trong thời gian nhanh nhất và gửi demo thiệp. Sau đó sẽ điều chỉnh thiệp theo ý Dâu Rể đến khi vừa ý tuyệt đối.",
  },
  {
    number: 3,
    title: "Hoàn Thành & Duyệt Thiệp",
    description:
      "Thiệp cưới chỉ được hoàn thành khi Dâu Rể đã hài lòng và vừa ý. Huế Cung Đình cam kết không giới hạn số lần chỉnh sửa hay thời gian sửa thiệp.",
  },
  {
    number: 4,
    title: "Thanh Toán Hoàn Tất",
    description:
      "Dâu Rể sẽ nhận được trọn bộ thiệp cưới bao gồm Link thiệp riêng, phong bì số, mã QR thiệp thông minh, link quản lý lời chúc và xác nhận tham dự (RSVP).",
  },
];

export function InvitationStepsSection() {
  return (
    <section
      className="invitation-steps-section"
      aria-label="Hướng dẫn 4 bước sở hữu thiệp cưới điện tử"
    >
      <div className="container">
        <header className="steps-section-header">
          <h2 className="steps-section-title">
            4 Bước Để Sở Hữu Thiệp Cưới Điện Tử
          </h2>
          <p className="steps-section-subtitle">
            Quy trình chuẩn mực, nhanh chóng và tinh tế giúp ngày trọng đại của
            Dâu Rể thêm phần trang trọng, đài các
          </p>
        </header>

        <div className="steps-grid-layout">
          <div className="steps-list">
            {STEPS.map((step) => (
              <div key={step.number} className="step-item-card">
                <div className="step-number-bubble" aria-hidden="true">
                  {step.number}
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="steps-art-showcase">
            <div className="steps-art-wreath">
              <div className="steps-art-circle-border" />
              <div className="steps-art-inner">
                <div className="steps-art-icon-wrap">
                  <Icon name="crown" size={32} color="var(--primary)" />
                </div>
                <h3 className="steps-art-heading">Đặc Quyền Hoàng Gia</h3>
                <p className="steps-art-quote">
                  &ldquo;Trao gửi thiệp hồng ngọc ngà, gắn kết trăm năm đài các.&rdquo;
                </p>
                <div className="steps-art-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="sparkles" size={14} color="var(--secondary)" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   2. INVITATION PRICING SECTION
   ========================================================================== */
const PRICING_TIERS: GoiGiaThiep[] = [
  {
    loai: "basic",
    tenGoi: "BASIC",
    gia: 168000,
    giaGoc: 298000,
    tagline: "Trải Nghiệm Tiêu Chuẩn",
    tinhNang: [
      "01 Mẫu thiệp cưới trang nhã",
      "Album ảnh cưới 6 hình sắc nét",
      "Mã QR mừng cưới tiện lợi",
      "Bản đồ dẫn đường Google Maps",
      "Tối ưu mọi dòng điện thoại",
    ],
  },
  {
    loai: "pro",
    tenGoi: "PRO",
    gia: 295000,
    giaGoc: 450000,
    tagline: "Trải Nghiệm Nâng Cao",
    tinhNang: [
      "01 Mẫu thiệp hoàng gia đài các",
      "Album ảnh cưới 12 hình cao cấp",
      "Nhạc nền cưới lãng mạn tùy chọn",
      "Đếm ngược đến ngày hôn lễ",
      "Mã QR mừng cưới & hộp mừng số",
      "Hòm thư lưu giữ lời chúc ngọt ngào",
    ],
  },
  {
    loai: "vip",
    tenGoi: "VIP",
    gia: 450000,
    giaGoc: 990000,
    noiBat: true,
    tagline: "Trải Nghiệm Vượt Trội",
    tinhNang: [
      "Toàn bộ tính năng gói PRO",
      "Hiệu ứng mở phong bì hoàng cung",
      "Nhã nhạc cung đình Huế tự động phát",
      "Không giới hạn album ảnh cưới HD",
      "Quản lý lời chúc & khách xác nhận RSVP",
      "Thư pháp dâu rể son thiếp vàng",
    ],
  },
];

interface PricingProps {
  selectedTier?: ThiepCuoiLoai;
  onSelectTier: (tier: ThiepCuoiLoai) => void;
}

export function InvitationPricingSection({
  selectedTier,
  onSelectTier,
}: PricingProps) {
  const [highlighted, setHighlighted] = useState<ThiepCuoiLoai>("vip");

  useEffect(() => {
    if (selectedTier) {
      setHighlighted(selectedTier);
    }
  }, [selectedTier]);

  return (
    <section
      id="bang-gia-thiep"
      className="invitation-pricing-section"
      aria-label="Bảng giá các gói thiệp cưới điện tử"
    >
      <div className="container">
        <header className="pricing-section-header">
          <span className="pricing-tag">CHI PHÍ MINH BẠCH</span>
          <h2 className="pricing-section-title pricing-title">Chi Phí Đăng Ký Thiệp Cưới Điện Tử</h2>
          <p className="pricing-section-subtitle pricing-subtitle">
            Chỉ với chi phí tương đương một ly cà phê, Dâu Rể đã sở hữu trọn bộ
            thiệp mời điện tử lộng lẫy và tiện ích quản trị thông minh
          </p>
        </header>

        <div className="pricing-tiers-grid">
          {PRICING_TIERS.map((tier) => {
            const isSelected = highlighted === tier.loai;
            return (
              <div
                key={tier.loai}
                className={`pricing-card tier-${tier.loai} ${
                  isSelected ? "tier-spotlight-active" : "tier-spotlight-dimmed"
                }`}
                onClick={() => {
                  setHighlighted(tier.loai);
                  onSelectTier(tier.loai);
                }}
              >
                {tier.noiBat && (
                  <div className="tier-active-banner">
                    <Icon name="sparkles" size={13} color="#1A1512" />
                    <span>ĐƯỢC ƯA CHUỘNG NHẤT</span>
                  </div>
                )}

                <h3 className={`pricing-card-title ${tier.loai === "vip" ? "vip-title-accent" : ""}`}>
                  {tier.tenGoi}
                </h3>
                <p className="pricing-tagline">{tier.tagline}</p>

                <div className="pricing-price-wrap">
                  <span className="pricing-current-price">
                    {formatVND(tier.gia)}
                  </span>
                  <span className="pricing-original-price">
                    {formatVND(tier.giaGoc)}
                  </span>
                </div>

                <ul className="pricing-features-list">
                  {tier.tinhNang.map((feat, idx) => (
                    <li key={idx} className="pricing-feature-item">
                      <span className="feature-check-icon">
                        <Icon name="check" size={15} color="var(--secondary)" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`btn-pricing-cta ${
                    isSelected ? "btn-pricing-cta-highlight" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHighlighted(tier.loai);
                    onSelectTier(tier.loai);
                  }}
                >
                  {isSelected ? "Đã Chọn Gói Này" : "Chọn Gói Này"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pricing-custom-prompt">
          <p>
            Bạn cần phong cách thiết kế độc bản theo gia huy hoàng tộc hoặc tùy
            biến riêng?
          </p>
          <Link to="/thiep-cuoi/dang-ky" className="link-custom-invitation">
            Yêu cầu may đo thiệp cưới độc bản &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

