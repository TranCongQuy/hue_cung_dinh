import { useState, useEffect } from "react";
import { Link } from "react-router";
import "./HeroSection.css";

const LAPTOP_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
];

const PHONE_IMAGES = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
];

export function HeroDevicesMockup() {
  const [laptopIdx, setLaptopIdx] = useState(0);
  const [phoneIdx, setPhoneIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLaptopIdx((prev) => (prev + 1) % LAPTOP_IMAGES.length);
      setPhoneIdx((prev) => (prev + 1) % PHONE_IMAGES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-mockup-container" aria-label="Mô phỏng website cưới và thiệp điện tử">
      <div className="floating-background-rings" aria-hidden="true">
        <div className="drifting-ring ring-fig-8-a">
          <svg viewBox="0 0 48 48" className="svg-drifting-ring">
            <circle cx="24" cy="24" r="18" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
            <polygon points="24,3 28,9 20,9" fill="#FFF9E6" stroke="#D4AF37" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="drifting-ring ring-fig-8-b">
          <svg viewBox="0 0 42 42" className="svg-drifting-ring">
            <circle cx="21" cy="21" r="16" stroke="#F59E0B" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="drifting-ring ring-heart-a">
          <svg viewBox="0 0 44 44" className="svg-drifting-ring">
            <circle cx="22" cy="22" r="16" stroke="#E6CA65" strokeWidth="2.5" fill="none" />
          </svg>
        </div>
        <div className="drifting-ring ring-heart-b">
          <svg viewBox="0 0 38 38" className="svg-drifting-ring">
            <circle cx="19" cy="19" r="14" stroke="#D4AF37" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="drifting-ring ring-diagonal-1">
          <svg viewBox="0 0 52 52" className="svg-drifting-ring">
            <circle cx="26" cy="26" r="20" stroke="#C5A059" strokeWidth="2.5" fill="none" />
            <circle cx="26" cy="26" r="17" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          </svg>
        </div>
        <div className="drifting-ring ring-diagonal-2">
          <svg viewBox="0 0 36 36" className="svg-drifting-ring">
            <circle cx="18" cy="18" r="13" stroke="#D4AF37" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="drifting-ring ring-float-ambient-1">
          <svg viewBox="0 0 32 32" className="svg-drifting-ring">
            <circle cx="16" cy="16" r="11" stroke="#E5C158" strokeWidth="1.8" fill="none" />
          </svg>
        </div>
        <div className="drifting-ring ring-float-ambient-2">
          <svg viewBox="0 0 40 40" className="svg-drifting-ring">
            <circle cx="20" cy="20" r="15" stroke="#D4AF37" strokeWidth="2.2" fill="none" />
          </svg>
        </div>
      </div>

      <div className="hero-wedding-rings-header" aria-hidden="true">
        <svg className="wedding-rings-icon" viewBox="0 0 64 64" fill="none">
          <circle cx="26" cy="36" r="16" stroke="#D4AF37" strokeWidth="3" />
          <circle cx="42" cy="36" r="16" stroke="#C5A059" strokeWidth="3" />
          <polygon points="34,14 38,20 30,20" fill="#D4AF37" />
          <polygon points="34,14 38,20 34,24 30,20" stroke="#F59E0B" strokeWidth="1.5" fill="#FEF3C7" />
        </svg>
        <span className="wedding-script-title">Happy Wedding</span>
      </div>

      <div className="laptop-wrapper">
        <div className="laptop-lid">
          <div className="laptop-camera-notch" aria-hidden="true" />
          <div className="laptop-screen">
            <img
              key={laptopIdx}
              src={LAPTOP_IMAGES[laptopIdx]}
              alt="Website đám cưới hiển thị trên máy tính"
              className="laptop-screen-img fade-in-image"
            />
            <div className="laptop-screen-overlay">
              <p className="laptop-wedding-calligraphy">Happy Wedding</p>
              <h3 className="laptop-couple-names">Chú Rể + Cô Dâu</h3>
              <p className="laptop-wedding-info">28/12/2026 • Hôn Lễ Cung Đình Hoàng Gia</p>
              <div className="laptop-action-pills" aria-label="Tương tác hôn lễ">
                <span className="laptop-pill pill-gold">Gửi lời chúc</span>
                <span className="laptop-pill pill-crimson">Xác nhận tham dự</span>
                <span className="laptop-pill pill-glass">Mừng cưới</span>
              </div>
            </div>
          </div>
        </div>
        <div className="laptop-base">
          <div className="laptop-notch-grip" aria-hidden="true" />
        </div>

        <div className="floating-phone-wrap" aria-hidden="true">
          <div className="phone-device-body">
            <div className="phone-dynamic-island" />
            <div className="phone-screen-inner">
              <img
                key={phoneIdx}
                src={PHONE_IMAGES[phoneIdx]}
                alt="Thiệp cưới điện tử trên smartphone"
                className="phone-img-cover fade-in-image"
              />
              <div className="phone-content-bottom">
                <h4 className="phone-mini-names">Chú Rể + Cô Dâu</h4>
                <div className="phone-mini-buttons">
                  <div className="phone-mini-btn btn-wishes">Gửi lời chúc</div>
                  <div className="phone-mini-btn btn-rsvp">Xác nhận tham dự</div>
                </div>
                <div className="phone-mini-section-label">CHUYỆN CHÚNG MÌNH</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_PAIR = { line1: "THIỆP CƯỚI ĐIỆN TỬ", line2: "MỜI CƯỚI ONLINE" };

const HEADLINE_PAIRS = [
  DEFAULT_PAIR,
  { line1: "WEBSITE ĐÁM CƯỚI", line2: "MỪNG CƯỚI ONLINE" },
  { line1: "HÔN LỄ HOÀNG TRIỀU", line2: "VĨNH CỬU CUNG ĐÌNH" },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HEADLINE_PAIRS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentPair = HEADLINE_PAIRS[currentIndex] ?? DEFAULT_PAIR;

  return (
    <section className="hero-mewedding-section" aria-label="Giới thiệu dịch vụ cưới và thiệp cưới điện tử">
      <div className="container">
        <div className="hero-mewedding-grid">
          <div className="hero-left-content">
            <span className="hero-mini-badge">Đám cưới và chụp ảnh cưới thời 5.0</span>
            <div
              key={currentIndex}
              className="hero-animated-title-wrap text-jump-in"
              aria-live="polite"
            >
              <h1 className="hero-anim-text-line-1">{currentPair.line1}</h1>
              <span className="hero-anim-text-line-2">{currentPair.line2}</span>
            </div>

            <p className="hero-mewedding-subtitle">
              <span className="subtitle-top-line">Cho Đám Cưới của bạn trở nên</span>
              <span>
                <span className="highlight-coral">Độc Đáo</span> và{" "}
                <span className="highlight-coral">Đáng Nhớ</span> hơn{" "}
                <span className="heart-animated-icon" aria-hidden="true">♥</span>
              </span>
            </p>

            <div className="hero-cta-buttons-row">
              <Link to="/dat-lich" className="btn-pill-primary">
                Đặt lịch
              </Link>
              <Link to="/goi-cuoi" className="btn-pill-secondary">
                Khám Phá Gói Cưới
              </Link>
            </div>
          </div>

          <div className="hero-right-visual">
            <HeroDevicesMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
