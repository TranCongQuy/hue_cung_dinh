import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { RoyalDivider } from "../components/common/RoyalDivider";
import "./LookbookGalleryPage.css";

type ConceptCategory = "cung-dinh" | "hoai-co" | "lang-man";

interface RetouchPreset {
  id: string;
  title: string;
  location: string;
  gradeName: string;
  desc: string;
  image: string;
}

interface LookbookPhoto {
  id: string;
  title: string;
  couple: string;
  category: ConceptCategory;
  categoryLabel: string;
  venue: string;
  bookingVenue: string;
  cameraSpec: string;
  story: string;
  image: string;
}

const RETOUCH_PRESETS: [RetouchPreset, ...RetouchPreset[]] = [
  {
    id: "preset-ngo-mon",
    title: "Sắc Son Đại Triều — Cổng Ngọ Môn",
    location: "Hoàng Thành Huế • 06:30 Sáng",
    gradeName: "Preset Chu Sa Hoàng Triều (Kodak Portra 400 Warm)",
    desc: "Tôn vinh sắc đỏ gấm Nhật Bình và ánh vàng kim trên ngói lưu ly, cân bằng vùng tối dưới vòm cổng đá thanh.",
    image:
      "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "preset-nhat-binh",
    title: "Loan Phượng Hòa Minh — Cung Diên Thọ",
    location: "Tây Nam Hoàng Thành • 15:45 Chiều",
    gradeName: "Preset Trầm Mặc Gỗ Lim (Fuji Pro 400H Soft Gold)",
    desc: "Giữ trọn kết cấu sợi thêu ngũ sắc trên cổ phục đồng thời tạo độ mịn màng hồng hào tự nhiên cho làn da Á Đông.",
    image:
      "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "preset-huong-giang",
    title: "Chiều Tím Bến Văn Lâu — Sông Hương",
    location: "Thượng nguồn Sông Hương • 17:10 Hoàng hôn",
    gradeName: "Preset Sương Khói Hương Giang (Cinema Amber)",
    desc: "Chuyển hóa ánh sáng ngược chiều tà thành quầng sáng vàng hổ phách lãng mạn trên mặt nước phẳng lặng.",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=85",
  },
];

export const LOOKBOOK_PHOTOS: LookbookPhoto[] = [
  {
    id: "lb-01",
    title: "Bách Niên Triều Nghi Trước Lầu Ngũ Phụng",
    couple: "Quốc Bảo & Ngọc Hân",
    category: "cung-dinh",
    categoryLabel: "Nhật Bình Hoàng Thành",
    venue: "Ngọ Môn - Đại Nội Huế",
    bookingVenue: "Quần thể Đại Nội & Cung Diên Thọ",
    cameraSpec: "Sony A7R V • 35mm f/1.4 GM • ISO 100",
    story:
      "Góc máy đối xứng chính diện lúc bình minh vừa chạm tới mái ngói hoàng lưu ly, tôn lên vẻ uy nghiêm của đôi cổ phục Nhật Bình – Áo Tấc.",
    image:
      "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-02",
    title: "Thưởng Trà Hiên Điện Diên Thọ",
    couple: "Minh Quân & Thanh Trúc",
    category: "cung-dinh",
    categoryLabel: "Nhật Bình Hoàng Thành",
    venue: "Cung Diên Thọ",
    bookingVenue: "Quần thể Đại Nội & Cung Diên Thọ",
    cameraSpec: "Canon EOS R5 • 85mm f/1.2L • ISO 160",
    story:
      "Khoảnh khắc lắng đọng bên ấm trà sen cung đình giữa hành lang gỗ sơn đỏ yên ả của Cung Diên Thọ.",
    image:
      "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-03",
    title: "Duyên Khởi Bậc Rồng Điện Kiến Trung",
    couple: "Đình Phong & Nhã Phương",
    category: "cung-dinh",
    categoryLabel: "Nhật Bình Hoàng Thành",
    venue: "Điện Kiến Trung - Tử Cấm Thành",
    bookingVenue: "Quần thể Đại Nội & Cung Diên Thọ",
    cameraSpec: "Sony A7R V • 50mm f/1.2 GM • ISO 125",
    story:
      "Sự hòa quyện giữa nghệ thuật khảm sành sứ cung đình rực rỡ và tà áo ngũ thân truyền thống.",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-04",
    title: "Hoài Niệm Đá Rêu Ứng Lăng",
    couple: "Hoàng Nam & Bảo Châu",
    category: "hoai-co",
    categoryLabel: "Màu Phim Lăng Tẩm",
    venue: "Lăng Vua Khải Định",
    bookingVenue: "Lăng Khải Định & Đồi Thiên An",
    cameraSpec: "Hasselblad 500C/M • 80mm f/2.8 • Kodak Portra",
    story:
      "Độ tương phản ấn tượng giữa nền đá thanh trầm mặc của 127 bậc thềm rồng và sắc phục đỏ chu sa.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-05",
    title: "Bóng Nước Xung Khiêm Tạ",
    couple: "Gia Huy & Khánh Linh",
    category: "hoai-co",
    categoryLabel: "Màu Phim Lăng Tẩm",
    venue: "Khiêm Lăng (Lăng Tự Đức)",
    bookingVenue: "Lăng Tự Đức & Cầu ngói Thanh Toàn",
    cameraSpec: "Leica SL2-S • 50mm Summilux • ISO 200",
    story:
      "Mặt hồ Lưu Khiêm phẳng lặng như gương phản chiếu bóng đôi uyên ương trong buổi sáng chớm thu xứ Huế.",
    image:
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-06",
    title: "Khải Tường Lâu Giao Thoa Á Âu",
    couple: "Tuấn Kiệt & Mai Anh",
    category: "hoai-co",
    categoryLabel: "Màu Phim Lăng Tẩm",
    venue: "Cung An Định",
    bookingVenue: "Cung An Định & Cầu Trường Tiền",
    cameraSpec: "Canon EOS R5 • 24-70mm f/2.8L • ISO 250",
    story:
      "Phong thái quý tộc Đông Dương thập niên 1930 trước mặt tiền lâu đài Khải Tường bên bờ An Cựu.",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-07",
    title: "Tia Nắng Sớm Rừng Thông Thiên An",
    couple: "Hữu Phước & Diệu Nhi",
    category: "lang-man",
    categoryLabel: "Ngoại Cảnh Sông Hương & Thiên An",
    venue: "Đồi Thông Thiên An",
    bookingVenue: "Lăng Khải Định & Đồi Thiên An",
    cameraSpec: "Sony A7 IV • 70-200mm f/2.8 GM II • ISO 320",
    story:
      "Làn sương mỏng lúc 06:00 sáng trên đồi Thiên An bắt trọn từng dải nắng xiên lấp lánh như thước phim điện ảnh.",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-08",
    title: "Thuyền Rồng Chiều Buông Hương Giang",
    couple: "Văn Khôi & Thùy Dương",
    category: "lang-man",
    categoryLabel: "Ngoại Cảnh Sông Hương & Thiên An",
    venue: "Bến Thuyền Sông Hương & Cầu Trường Tiền",
    bookingVenue: "Biệt phủ cổ Hoa Nghiêm ven sông Hương",
    cameraSpec: "Sony A7R V • 35mm f/1.4 GM • ISO 400",
    story:
      "Ánh chiều tà nhuộm vàng mặt sông Hương khi chiếc đò gỗ lướt chậm qua nhịp cầu Trường Tiền trăm tuổi.",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "lb-09",
    title: "Nghi Lễ Gia Tiên Nhà Rường Kim Long",
    couple: "Đăng Khoa & Bích Ngọc",
    category: "lang-man",
    categoryLabel: "Ngoại Cảnh Sông Hương & Thiên An",
    venue: "Biệt Phủ Nhà Rường Kim Long",
    bookingVenue: "Biệt phủ cổ Hoa Nghiêm ven sông Hương",
    cameraSpec: "Canon EOS R5 • 50mm f/1.2L • ISO 200",
    story:
      "Không gian ấm cúng mùi trầm hương và sen trắng trong ngôi nhà rường gỗ mít cổ kính ven sông.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
  },
];

export function LookbookGalleryPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(RETOUCH_PRESETS[0].id);
  const [sliderPercent, setSliderPercent] = useState(54);
  const [activeCategory, setActiveCategory] = useState<"all" | ConceptCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const currentPreset =
    RETOUCH_PRESETS.find((p) => p.id === selectedPresetId) || RETOUCH_PRESETS[0];

  const filteredPhotos =
    activeCategory === "all"
      ? LOOKBOOK_PHOTOS
      : LOOKBOOK_PHOTOS.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const activeLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="lookbook-page">
      {/* Hero */}
      <section className="lookbook-hero">
        <div className="container lookbook-hero-inner">
          <span className="section-tag">NGHỆ THUẬT ÁNH SÁNG & HẬU KỲ MÀU PHIM</span>
          <h1 className="lookbook-title">Triển Lãm Lookbook Cưới Hoàng Triều</h1>
          <p className="lookbook-subtitle">
            Kiểm chứng trực tiếp sự khác biệt giữa ảnh thô nguyên bản từ máy ảnh và công nghệ
            chỉnh màu phim cung đình độc quyền của studio trước khi quyết định đặt lịch.
          </p>
        </div>
      </section>

      {/* Phần 1: Thanh Trượt Hậu Kỳ Trước / Sau */}
      <section className="retouch-showcase-section">
        <div className="container">
          <div className="retouch-card">
            <div className="retouch-header">
              <div>
                <span className="retouch-kicker">SO SÁNH HẬU KỲ TƯƠNG TÁC</span>
                <h2>{currentPreset.title}</h2>
                <p>{currentPreset.desc}</p>
              </div>
              <div className="retouch-preset-pills">
                {RETOUCH_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`retouch-pill-btn ${
                      preset.id === currentPreset.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedPresetId(preset.id)}
                  >
                    Bối cảnh 0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="before-after-viewport">
              {/* Lớp Nền: Ảnh Gốc Chưa Chỉnh Màu (Bên Phải) */}
              <img
                src={currentPreset.image}
                alt={`Ảnh gốc chưa hậu kỳ - ${currentPreset.title}`}
                className="ba-img ba-img-raw"
              />

              {/* Lớp Phủ Cắt Theo Phần Trăm: Ảnh Đã Hậu Kỳ Màu Phim Cung Đình (Bên Trái) */}
              <div
                className="ba-graded-layer"
                style={{ clipPath: `inset(0 ${100 - sliderPercent}% 0 0)` }}
              >
                <img
                  src={currentPreset.image}
                  alt={`Ảnh đã chỉnh màu phim cung đình - ${currentPreset.title}`}
                  className="ba-img ba-img-graded"
                />
              </div>

              {/* Nhãn 2 bên */}
              <span className="ba-corner-badge graded">SAU HẬU KỲ MÀU PHIM</span>
              <span className="ba-corner-badge raw">ẢNH THÔ NGUYÊN BẢN (RAW)</span>

              {/* Thanh chia dọc + nút kéo */}
              <div
                className="ba-divider-line"
                style={{ left: `${sliderPercent}%` }}
                aria-hidden="true"
              >
                <div className="ba-handle-knob">
                  <Icon name="arrowsLeftRight" size={18} color="#1A1512" />
                </div>
              </div>

              {/* Input range phủ toàn khung hỗ trợ cả kéo chuột, cảm ứng & bàn phím A11y */}
              <input
                id="retouch-slider-input"
                name="retouchSlider"
                type="range"
                min={5}
                max={95}
                value={sliderPercent}
                onChange={(e) => setSliderPercent(Number(e.target.value))}
                className="ba-range-overlay"
                aria-label="Kéo thanh trượt để so sánh ảnh gốc và ảnh đã chỉnh màu phim cung đình"
                aria-invalid={false}
                aria-describedby="retouch-slider-caption"
              />
            </div>

            <div className="retouch-footer-meta" id="retouch-slider-caption">
              <span>
                <Icon name="mapPin" size={15} color="var(--secondary)" />{" "}
                {currentPreset.location}
              </span>
              <span>
                <Icon name="sliders" size={15} color="var(--secondary)" />{" "}
                {currentPreset.gradeName} (Tỷ lệ hiển thị: {sliderPercent}%)
              </span>
            </div>
          </div>
        </div>
      </section>

      <RoyalDivider variant="lotus" />

      {/* Phần 2: Bộ Sưu Tập Album Thực Tế */}
      <section className="lookbook-grid-section">
        <div className="container">
          <div className="lookbook-filter-bar">
            <div>
              <span className="section-tag">TÁC PHẨM THỰC TẾ</span>
              <h2 className="section-title">Bộ Sưu Tập Khoảnh Khắc Cố Đô</h2>
            </div>

            <div className="lookbook-tabs" role="tablist" aria-label="Lọc chủ đề ảnh cưới">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "all"}
                className={`lb-tab ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory("all");
                  setLightboxIndex(null);
                }}
              >
                Tất Cả ({LOOKBOOK_PHOTOS.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "cung-dinh"}
                className={`lb-tab ${activeCategory === "cung-dinh" ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory("cung-dinh");
                  setLightboxIndex(null);
                }}
              >
                Nhật Bình Hoàng Thành
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "hoai-co"}
                className={`lb-tab ${activeCategory === "hoai-co" ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory("hoai-co");
                  setLightboxIndex(null);
                }}
              >
                Màu Phim Lăng Tẩm
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "lang-man"}
                className={`lb-tab ${activeCategory === "lang-man" ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory("lang-man");
                  setLightboxIndex(null);
                }}
              >
                Sông Hương & Đồi Thông
              </button>
            </div>
          </div>

          <div className="lookbook-cards-grid">
            {filteredPhotos.map((photo, index) => (
              <article
                key={photo.id}
                className="lookbook-item-card"
                onClick={() => setLightboxIndex(index)}
              >
                <div className="lb-img-box">
                  <img src={photo.image} alt={photo.title} loading="lazy" />
                  <span className="lb-cat-tag">{photo.categoryLabel}</span>
                </div>
                <div className="lb-card-content">
                  <div className="lb-couple-line">
                    <Icon name="crown" size={14} color="var(--secondary)" />
                    <span>{photo.couple}</span>
                  </div>
                  <h3>{photo.title}</h3>
                  <p className="lb-venue-line">
                    <Icon name="mapPin" size={14} color="var(--text-muted)" />
                    <span>{photo.venue}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal Phóng To & Thông Số Nhiếp Ảnh */}
      {activeLightboxPhoto && lightboxIndex !== null && (
        <div
          className="lookbook-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxPhoto.title}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="lookbook-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lb-close-btn"
              onClick={() => setLightboxIndex(null)}
              aria-label="Đóng khung xem ảnh"
            >
              <Icon name="close" size={20} />
            </button>

            <div className="lb-dialog-media">
              <img src={activeLightboxPhoto.image} alt={activeLightboxPhoto.title} />
              <button
                type="button"
                className="lb-nav-arrow prev"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredPhotos.length) %
                      filteredPhotos.length
                  )
                }
                aria-label="Ảnh trước"
              >
                <Icon name="chevronLeft" size={22} />
              </button>
              <button
                type="button"
                className="lb-nav-arrow next"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
                }
                aria-label="Ảnh tiếp theo"
              >
                <Icon name="chevronRight" size={22} />
              </button>
            </div>

            <div className="lb-dialog-info">
              <span className="section-tag">{activeLightboxPhoto.categoryLabel}</span>
              <h2>{activeLightboxPhoto.title}</h2>
              <p className="lb-dialog-couple">
                Cặp đôi: <strong>{activeLightboxPhoto.couple}</strong>
              </p>
              <p className="lb-dialog-story">{activeLightboxPhoto.story}</p>

              <div className="lb-exif-box">
                <div>
                  <span>Địa điểm thực hiện</span>
                  <strong>{activeLightboxPhoto.venue}</strong>
                </div>
                <div>
                  <span>Thiết bị & Thông số ống kính</span>
                  <strong>{activeLightboxPhoto.cameraSpec}</strong>
                </div>
              </div>

              <Link
                to={`/dat-lich?diaDiem=${encodeURIComponent(
                  activeLightboxPhoto.bookingVenue
                )}`}
                onClick={() => setLightboxIndex(null)}
                className="lb-book-cta"
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<Icon name="arrowRight" size={16} />}
                >
                  Đặt Lịch Chụp Theo Concept Này
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
