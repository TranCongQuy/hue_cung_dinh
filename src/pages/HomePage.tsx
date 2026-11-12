import { Link } from "react-router";
import { useFetch } from "../lib/useFetch";
import { goiCuoiListSchema } from "../features/packages/types";
import { assertNever } from "../lib/types";
import { FeaturedPackagesMarquee } from "../features/home/components/FeaturedPackagesMarquee";
import { CustomerTestimonialsSection } from "../features/home/components/CustomerTestimonialsSection";
import { HeroSection } from "../features/home/components/HeroSection";
import { CultureIntroSection, InvitationHomeBanner } from "../features/home/components/HomeSections";
import { Button, SkeletonCard } from "../components/common/UI";
import { Icon, IconName } from "../components/common/Icon";
import { RoyalDivider } from "../components/common/RoyalDivider";
import "./HomePage.css";

const ROYAL_EXPERIENCE_CARDS: Array<{
  to: string;
  tag: string;
  title: string;
  desc: string;
  cta: string;
  icon: IconName;
}> = [
  {
    to: "/ban-do-di-san",
    tag: "BẢN ĐỒ SVG TƯƠNG TÁC",
    title: "Bản Đồ Di Sản Cố Đô Huế",
    desc: "Khám phá 9 tọa độ chụp ảnh cung đình từ Ngọ Môn, Cung Diên Thọ đến Lăng Khải Định kèm khung giờ vàng ánh sáng và phí vé di tích.",
    cta: "Mở Bản Đồ Di Sản",
    icon: "map",
  },
  {
    to: "/phoi-co-phuc",
    tag: "XƯỞNG CỔ PHỤC 2D",
    title: "Phòng Phối Cổ Phục Trực Quan",
    desc: "Tự tay phối phom Áo Nhật Bình, Áo Tấc, chọn sắc gấm Chu Sa – Hoàng Kim, mấn phượng pháp lam và báo giá tức thì.",
    cta: "Thử Phối Cổ Phục",
    icon: "palette",
  },
  {
    to: "/trien-lam",
    tag: "TRƯỚC & SAU HẬU KỲ",
    title: "Triển Lãm Lookbook & Màu Phim",
    desc: "Trải nghiệm thanh trượt so sánh ảnh gốc và màu phim cung đình trầm mặc cùng bộ sưu tập album thực tế tại Đại Nội.",
    cta: "Xem Triển Lãm",
    icon: "sliders",
  },
  {
    to: "/ke-hoach-cuoi",
    tag: "CẨM NANG CẶP ĐÔI",
    title: "Sổ Tay Kế Hoạch & Dự Toán Cưới",
    desc: "Quản lý tiến độ chuẩn bị lễ cưới qua 5 cột mốc thời gian, biểu đồ phân bổ ngân sách trực quan và xuất bản in A4.",
    cta: "Mở Sổ Tay Cưới",
    icon: "bookmark",
  },
];

export function HomePage() {
  const { state: packagesState, refetch } = useFetch(
    "/api/goi-cuoi",
    goiCuoiListSchema
  );

  return (
    <div className="home-page-root">
      {/* 1. Hero Section Tràn Viền Hoàng Gia */}
      <HeroSection />

      {/* 2. Giới Thiệu Tinh Hoa Di Sản Cung Đình */}
      <CultureIntroSection />

      <RoyalDivider variant="lotus" />

      {/* 3. Không Gian Trải Nghiệm Số Hóa Di Sản Cố Đô */}
      <section className="royal-experience-hub-section">
        <div className="container">
          <div className="experience-hub-header">
            <span className="section-tag">TRẢI NGHIỆM ĐỘC BẢN TẠI CỐ ĐÔ</span>
            <h2 className="section-title">Không Gian Tương Tác Hoàng Triều</h2>
            <p className="experience-hub-subtitle">
              Khám phá tọa độ di sản, tự tay phối sắc gấm cổ phục, kiểm chứng chất lượng hậu kỳ màu phim và lập kế hoạch lễ cưới chỉ trong vài thao tác.
            </p>
          </div>

          <div className="royal-experience-grid">
            {ROYAL_EXPERIENCE_CARDS.map((card) => (
              <Link key={card.to} to={card.to} className="royal-experience-card">
                <div className="exp-card-top">
                  <div className="exp-card-icon">
                    <Icon name={card.icon} size={22} color="var(--secondary)" />
                  </div>
                  <span className="exp-card-tag">{card.tag}</span>
                </div>
                <h3 className="exp-card-title">{card.title}</h3>
                <p className="exp-card-desc">{card.desc}</p>
                <span className="exp-card-cta">
                  {card.cta} <Icon name="arrowRight" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RoyalDivider variant="fret" />

      {/* 4. Gói Cưới Tiêu Biểu */}
      <section className="featured-packages-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-tag">BỘ SƯU TẬP HOÀNG GIA</span>
              <h2 className="section-title">Gói Cưới Combo Tiêu Biểu</h2>
            </div>
            <Link to="/goi-cuoi">
              <Button variant="secondary" size="md" rightIcon={<Icon name="arrowRight" size={16} />}>
                Xem Tất Cả Gói Cưới
              </Button>
            </Link>
          </div>

          {(() => {
            switch (packagesState.status) {
              case "loading":
                return (
                  <div className="packages-grid">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                );
              case "error":
                return (
                  <div className="error-box">
                    <p>{packagesState.message}</p>
                    <Button variant="secondary" size="sm" onClick={refetch}>
                      Thử lại
                    </Button>
                  </div>
                );
              case "success":
                return (
                  <FeaturedPackagesMarquee packages={packagesState.data} />
                );
              default:
                return assertNever(packagesState);
            }
          })()}
        </div>
      </section>

      {/* 5. Khám Phá Kho Mẫu Thiệp Cưới Online Mới */}
      <InvitationHomeBanner />

      {/* 6. Cảm Nhận & Đánh Giá Của Khách Hàng (Customer Testimonials) */}
      <CustomerTestimonialsSection />
    </div>
  );
}
