import { Link } from "react-router";
import { useFetch } from "../lib/useFetch";
import { goiCuoiListSchema } from "../features/packages/types";
import { assertNever } from "../lib/types";
import { FeaturedPackagesMarquee } from "../features/home/components/FeaturedPackagesMarquee";
import { CustomerTestimonialsSection } from "../features/home/components/CustomerTestimonialsSection";
import { HeroSection } from "../features/home/components/HeroSection";
import { CultureIntroSection, InvitationHomeBanner } from "../features/home/components/HomeSections";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { SkeletonCard } from "../components/common/UI";
import "./HomePage.css";

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

      {/* 3. Gói Cưới Tiêu Biểu */}
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

      {/* 4. Khám Phá Kho Mẫu Thiệp Cưới Online Mới */}
      <InvitationHomeBanner />

      {/* 5. Cảm Nhận & Đánh Giá Của Khách Hàng (Customer Testimonials) */}
      <CustomerTestimonialsSection />
    </div>
  );
}
