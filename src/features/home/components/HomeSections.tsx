import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Icon } from "../../../components/common/Icon";
import { Button } from "../../../components/common/UI";
import "./HomeSections.css";

/* ==========================================================================
   1. CULTURE INTRO SECTION
   ========================================================================== */
const CULTURES = [
  {
    icon: "crown" as const,
    title: "Cổ Phục Hoàng Triều",
    desc: "Áo Nhật Bình hoàng hậu, Áo Tấc ngũ thân thêu chỉ ngũ sắc thủ công trên nền lụa tơ tằm Hà Đông thượng hạng, tái hiện nghi thức nghinh hôn triều Nguyễn.",
  },
  {
    icon: "mapPin" as const,
    title: "Đại Nội Uy Nghiêm",
    desc: "Đặc quyền quay chụp tại các cung điện tôn nghiêm bậc nhất: Ngọ Môn, Cung Diên Thọ, Điện Thái Hòa, Nhật Thành Lâu và quần thể biệt phủ sông Hương.",
  },
  {
    icon: "sparkles" as const,
    title: "Nghệ Thuật Cinematic",
    desc: "Đội ngũ nhiếp ảnh gia thâm niên hơn 10 năm tại Cố đô, bắt trọn từng khoảnh khắc giao thoa giữa tình yêu lứa đôi và linh hồn di sản ngàn năm.",
  },
];

export function CultureIntroSection() {
  return (
    <section className="culture-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">GIÁ TRỊ CỐT LÕI</span>
          <h2 className="section-title">Tinh Hoa Hôn Lễ Cung Đình Huế</h2>
          <div className="title-divider" />
        </div>

        <div className="culture-grid">
          {CULTURES.map((item, i) => (
            <div key={i} className="culture-card">
              <div className="culture-icon-wrap">
                <Icon name={item.icon} size={28} color="var(--secondary)" />
              </div>
              <h3 className="culture-card-title">{item.title}</h3>
              <p className="culture-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   2. INVITATION HOME BANNER
   ========================================================================== */
const DEFAULT_BANNER_PHOTO = {
  url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  tag: "Giao Diện VIP Hoàng Cung",
};

const BANNER_PHOTOS = [
  DEFAULT_BANNER_PHOTO,
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    tag: "Hôn Lễ Song Hỷ Đài Các",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    tag: "Cổ Phục Cố Đô Triều Nguyễn",
  },
  {
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    tag: "Khoảnh Khắc Trăm Năm",
  },
];

export function InvitationHomeBanner() {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % BANNER_PHOTOS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentPhoto = BANNER_PHOTOS[photoIndex] ?? DEFAULT_BANNER_PHOTO;

  return (
    <section className="invitation-home-banner" aria-label="Mẫu thiệp cưới online hoàng gia">
      <div className="container">
        <div className="banner-inner-box">
          <div className="banner-text-content">
            <span className="banner-tag">
              <Icon name="crown" size={14} color="#825a00" />
              Tính Năng Mới • Hoàng Triều
            </span>
            <h2 className="banner-title">
              Kho Giao Diện Thiệp Cưới Điện Tử Online
            </h2>
            <p className="banner-desc">
              Bắt đầu đám cưới của bạn với một chiếc thiệp cưới hoàng gia thật đẹp. Tích hợp nhạc nhã cung đình, phong bì tương tác, mã QR mừng cưới và link RSVP quản lý khách mời thông minh.
            </p>

            <div className="banner-features-mini">
              <div className="mini-feature-item">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Mẫu VIP &amp; Cung Đình</span>
              </div>
              <div className="mini-feature-item">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Nhạc Cung Đình Tự Động</span>
              </div>
              <div className="mini-feature-item">
                <Icon name="check" size={16} color="var(--secondary)" />
                <span>Tùy Biến Theo Yêu Cầu</span>
              </div>
            </div>

            <div className="banner-cta-group">
              <Link to="/thiep-cuoi">
                <Button variant="primary" size="lg" rightIcon={<Icon name="arrowRight" size={16} />}>
                  Khám Phá Mẫu Thiệp Ngay
                </Button>
              </Link>
              <Link to="/thiep-cuoi/dang-ky">
                <Button variant="secondary" size="lg">
                  Tạo Thiệp Riêng
                </Button>
              </Link>
            </div>
          </div>

          <div className="banner-preview-visual">
            <div className="banner-phone-card">
              <img
                key={photoIndex}
                src={currentPhoto.url}
                alt="Mẫu thiệp cưới hoàng gia Huế"
                className="banner-phone-img"
              />
              <div className="banner-photo-dots">
                {BANNER_PHOTOS.map((_, i) => (
                  <span
                    key={i}
                    className={`banner-photo-dot ${i === photoIndex ? "active" : ""}`}
                    onClick={() => setPhotoIndex(i)}
                  />
                ))}
              </div>
              <div className="banner-phone-glass">
                <span className="banner-phone-names">Chú Rể &amp; Cô Dâu</span>
                <span className="banner-phone-tag">{currentPhoto.tag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

