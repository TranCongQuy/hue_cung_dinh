import { useState, KeyboardEvent } from "react";
import { Link } from "react-router";
import { formatCurrency } from "../lib/formatters";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { RoyalDivider } from "../components/common/RoyalDivider";
import "./HeritageMapPage.css";

type HeritageZone = "hoang-thanh" | "lang-tam" | "thien-nhien";

export interface HeritageSpot {
  id: string;
  name: string;
  bookingVenueValue: string;
  zone: HeritageZone;
  zoneLabel: string;
  x: number;
  y: number;
  goldenHour: string;
  permitFee: number;
  recommendedAttire: string;
  heritageRule: string;
  summary: string;
  highlights: string[];
  image: string;
}

export const HUE_HERITAGE_SPOTS: [HeritageSpot, ...HeritageSpot[]] = [
  {
    id: "ngo-mon",
    name: "Ngọ Môn & Điện Thái Hòa",
    bookingVenueValue: "Quần thể Đại Nội & Cung Diên Thọ",
    zone: "hoang-thanh",
    zoneLabel: "Trục Chính Hoàng Thành",
    x: 425,
    y: 215,
    goldenHour: "06:00 – 08:15 (Bình minh xiên qua lầu Ngũ Phụng)",
    permitFee: 5000000,
    recommendedAttire: "Áo Nhật Bình Chu Sa & Áo Tấc Gấm Hoàng Kim",
    heritageRule: "Không sử dụng flycam khi chưa có giấy phép đặc cách của Trung tâm Bảo tồn Di tích.",
    summary:
      "Cổng chính phía Nam của Hoàng thành Huế với lầu Ngũ Phụng uy nghiêm và cầu Trung Đạo bắc qua hồ Thái Dịch nở sen hồng.",
    highlights: [
      "Góc chụp đối xứng kinh điển trước cổng Ngọ Môn",
      "Hành lang sơn son thếp vàng dẫn vào sân Đại Triều Nghi",
      "Hồ Thái Dịch mùa sen hạ (tháng 5 – tháng 8)",
    ],
    image:
      "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cung-dien-tho",
    name: "Cung Diên Thọ & Tịnh Minh Lâu",
    bookingVenueValue: "Quần thể Đại Nội & Cung Diên Thọ",
    zone: "hoang-thanh",
    zoneLabel: "Tây Nam Hoàng Thành",
    x: 345,
    y: 165,
    goldenHour: "07:00 – 09:30 & 15:15 – 17:00",
    permitFee: 5000000,
    recommendedAttire: "Áo Nhật Bình Vàng Hoàng Hậu & Khăn Đóng Ngũ Thân",
    heritageRule: "Đi nhẹ nói khẽ, không tựa hoặc đặt đạo cụ nặng lên lan can gỗ lim cổ.",
    summary:
      "Tư dinh của các bậc Hoàng Thái Hậu triều Nguyễn với kiến trúc nhà vườn cung đình thanh nhã, hành lang gỗ đỏ và lầu Tịnh Minh.",
    highlights: [
      "Không gian thưởng trà cung đình tại hiên Chính Điện",
      "Tịnh Minh Lâu mang nét giao thoa Á – Âu thanh lịch",
      "Ánh nắng chiều xuyên qua chấn song chữ Thọ",
    ],
    image:
      "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dien-kien-trung",
    name: "Điện Kiến Trung (Bắc Tử Cấm Thành)",
    bookingVenueValue: "Quần thể Đại Nội & Cung Diên Thọ",
    zone: "hoang-thanh",
    zoneLabel: "Tử Cấm Thành",
    x: 445,
    y: 120,
    goldenHour: "06:30 – 08:45 & 15:45 – 17:15",
    permitFee: 5000000,
    recommendedAttire: "Áo Dài Cưới Gấm Sen Vàng hoặc Âu Phục Cổ Điển Đông Dương",
    heritageRule: "Chỉ tác nghiệp tại sân trước và bậc thềm rồng khảm sành sứ theo lộ trình tham quan.",
    summary:
      "Ngôi điện lộng lẫy bậc nhất vừa phục dựng hoàn chỉnh tại cực Bắc trục thần đạo, nổi bật với mặt tiền khảm sành sứ ngũ sắc tinh xảo.",
    highlights: [
      "Bậc thềm rồng khảm sành sứ rực rỡ dưới nắng sớm",
      "Mặt tiền kiến trúc Tân cổ điển Pháp kết hợp mỹ thuật cung đình",
      "Vườn Thượng Uyển thoáng đãng phía sau điện",
    ],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cau-truong-tien",
    name: "Cầu Trường Tiền & Bến Thuyền Sông Hương",
    bookingVenueValue: "Biệt phủ cổ Hoa Nghiêm ven sông Hương",
    zone: "thien-nhien",
    zoneLabel: "Đôi Bờ Sông Hương",
    x: 520,
    y: 280,
    goldenHour: "05:30 – 06:45 (Sương sớm sông Hương) & 16:45 – 17:45 (Hoàng hôn tím)",
    permitFee: 1800000,
    recommendedAttire: "Áo Dài Tơ Tằm Tím Huế / Trắng Tinh Khôi & Nón Bài Thơ",
    heritageRule: "Nếu chụp trên thuyền rồng giữa sông Hương, bắt buộc mặc áo phao khi di chuyển ra bến.",
    summary:
      "Biểu tượng hơn 120 năm sáu vài mười hai nhịp soi bóng xuống dòng Hương Giang thơ mộng, đẹp nhất vào khoảnh khắc hoàng hôn buông.",
    highlights: [
      "Khung hình thuyền rồng lướt nhẹ trên mặt nước phẳng lặng",
      "Nhịp cầu thép ngân ánh vàng cam lúc mặt trời lặn",
      "Đường đi bộ gỗ lim ven bờ Nam sông Hương",
    ],
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cung-an-dinh",
    name: "Cung An Định (Bờ Sông An Cựu)",
    bookingVenueValue: "Cung An Định & Cầu Trường Tiền",
    zone: "thien-nhien",
    zoneLabel: "Bờ Nam Sông Hương",
    x: 645,
    y: 350,
    goldenHour: "08:00 – 10:00 & 15:00 – 16:45",
    permitFee: 3500000,
    recommendedAttire: "Áo Dài Hoàng Hậu Nam Phương hoặc Váy Cưới Satin Tối Giản",
    heritageRule: "Không bật đèn flash công suất lớn trong phòng tranh bích họa Khải Tường Lâu.",
    summary:
      "Viên ngọc kiến trúc giao thoa Á – Âu bên dòng An Cựu với cổng chính khảm sành sứ nổi và lâu đài Khải Tường tráng lệ.",
    highlights: [
      "Đình Trung Lập bát giác uy nghi giữa sân tiền sảnh",
      "Cầu thang gỗ uốn lượn và khung cửa vòm châu Âu",
      "Tông vàng kem cổ điển lên màu phim Medium Format cực nịnh da",
    ],
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "biet-phu-hoa-nghiem",
    name: "Biệt Phủ Nhà Rường Kim Long",
    bookingVenueValue: "Biệt phủ cổ Hoa Nghiêm ven sông Hương",
    zone: "thien-nhien",
    zoneLabel: "Thượng Nguồn Kim Long",
    x: 235,
    y: 265,
    goldenHour: "07:30 – 10:30 (Ánh sáng dịu xuyên tán cây thanh trà)",
    permitFee: 7500000,
    recommendedAttire: "Áo Giao Lĩnh Tơ Tằm hoặc Áo Tấc Đôi Truyền Thống",
    heritageRule: "Không gian khép kín riêng tư 100% cho ekip, có phòng thay đồ máy lạnh và bàn trang điểm riêng.",
    summary:
      "Biệt phủ nhà rường gỗ mít 5 gian 2 chái trăm năm tuổi nép mình bên bờ Bắc sông Hương, hồ sen riêng và vườn cây trái xứ Huế.",
    highlights: [
      "Không lẫn khách du lịch — riêng tư trọn buổi cho dâu rể",
      "Bàn trà gia tiên gỗ gụ khảm ốc xà cừ truyền thống",
      "Bến thuyền gỗ riêng nhìn thẳng ra chùa Thiên Mụ",
    ],
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lang-tu-duc",
    name: "Khiêm Lăng (Lăng Vua Tự Đức)",
    bookingVenueValue: "Lăng Tự Đức & Cầu ngói Thanh Toàn",
    zone: "lang-tam",
    zoneLabel: "Quần Thể Lăng Tẩm Tây Nam",
    x: 295,
    y: 425,
    goldenHour: "06:30 – 09:00 & 15:30 – 17:00",
    permitFee: 4500000,
    recommendedAttire: "Áo Nhật Bình Xanh Ngọc Lục Bảo hoặc Áo Tấc Trầm Mặc",
    heritageRule: "Giữ trật tự tuyệt đối tại khu vực tẩm điện; ưu tiên ống kính tele bắt trọn mặt hồ Lưu Khiêm.",
    summary:
      "Bức tranh sơn thủy hữu tình bậc nhất trong các lăng tẩm triều Nguyễn với hồ Lưu Khiêm, Xung Khiêm Tạ và rừng thông xanh mát.",
    highlights: [
      "Nhà thủy tạ Xung Khiêm Tạ soi bóng mặt hồ hoa súng",
      "Hành lang gạch Bát Tràng rêu phong cổ kính",
      "Không khí tĩnh mặc đầy chất thơ cung đình xưa",
    ],
    image:
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "doi-thien-an",
    name: "Đồi Thông Thiên An & Hồ Thủy Tiên",
    bookingVenueValue: "Lăng Khải Định & Đồi Thiên An",
    zone: "lang-tam",
    zoneLabel: "Đồi Thông Phía Nam",
    x: 475,
    y: 445,
    goldenHour: "06:00 – 08:00 (Tia nắng ray xuyên rừng thông sương mù)",
    permitFee: 2000000,
    recommendedAttire: "Váy Cưới Voan Nhẹ, Vest Kem hoặc Áo Dài Lụa Trơn",
    heritageRule: "Tuyệt đối không đốt pháo khói lửa trong mùa hanh khô để bảo vệ rừng thông đặc dụng.",
    summary:
      "Con đường nhựa uốn lượn giữa rừng thông cổ thụ mờ sương, tạo hiệu ứng tia nắng (sun-ray) điện ảnh hiếm có ngay lòng Cố đô.",
    highlights: [
      "Tia nắng bình minh chiếu xiên qua tầng lá thông",
      "Nằm sát tuyến đường đi Lăng Khải Định (chỉ 5 phút di chuyển)",
      "Hợp cả phong cách hiện đại lẫn cổ điển lãng mạn",
    ],
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lang-khai-dinh",
    name: "Ứng Lăng (Lăng Vua Khải Định)",
    bookingVenueValue: "Lăng Khải Định & Đồi Thiên An",
    zone: "lang-tam",
    zoneLabel: "Núi Châu Chữ",
    x: 615,
    y: 485,
    goldenHour: "06:15 – 08:15 (Tránh nắng gắt và đoàn khách đông giữa trưa)",
    permitFee: 4000000,
    recommendedAttire: "Áo Nhật Bình Đen Huyền Kim hoặc Cổ Phục Thêu Rồng",
    heritageRule: "Cần có mặt từ 06:15 sáng để lấy trọn 127 bậc thềm rồng đá thanh không vướng khách tham quan.",
    summary:
      "Kiệt tác kiến trúc độc nhất vô nhị trên triền núi Châu Chữ với 127 bậc cấp rồng chầu uy lực và cung Thiên Định khảm sứ lộng lẫy.",
    highlights: [
      "Góc máy từ dưới lên ôm trọn sân Bái Đình và tượng quan văn võ",
      "Sự tương phản ngoạn mục giữa đá xám cổ kính và sắc đỏ Nhật Bình",
      "Kết hợp hoàn hảo cùng Đồi Thiên An trong một buổi sáng",
    ],
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
  },
];

const SUGGESTED_ITINERARIES = [
  {
    id: "route-royal",
    title: "Tuyến 01: Hoàng Cung Chính Thống",
    duration: "01 Buổi Bình Minh (05:30 – 10:30)",
    route: "Ngọ Môn ➔ Cung Diên Thọ ➔ Điện Kiến Trung",
    bestFor: "Cặp đôi yêu vẻ đẹp uy nghiêm của Áo Nhật Bình & Áo Tấc triều Nguyễn, di chuyển nội bộ đi bộ nhẹ nhàng.",
    spotIds: ["ngo-mon", "cung-dien-tho", "dien-kien-trung"],
  },
  {
    id: "route-cinematic",
    title: "Tuyến 02: Điện Ảnh Sương Sớm & Đá Rêu Phong",
    duration: "01 Buổi Sáng (05:45 – 10:45)",
    route: "Lăng Khải Định ➔ Đồi Thông Thiên An ➔ Cung An Định",
    bestFor: "Kết hợp cả 2 phong cách: Cổ phục quyền quý trên bậc rồng đá và Váy cưới hiện đại giữa rừng thông.",
    spotIds: ["lang-khai-dinh", "doi-thien-an", "cung-an-dinh"],
  },
  {
    id: "route-poetic",
    title: "Tuyến 03: Trữ Tình Hương Giang & Nhà Rường",
    duration: "01 Buổi Hoàng Hôn (13:30 – 18:00)",
    route: "Biệt Phủ Kim Long ➔ Lăng Tự Đức ➔ Hoàng Hôn Cầu Trường Tiền",
    bestFor: "Không gian riêng tư sâu lắng, khép lại bằng khung hình thuyền rồng lãng mạn dưới nắng chiều tím Huế.",
    spotIds: ["biet-phu-hoa-nghiem", "lang-tu-duc", "cau-truong-tien"],
  },
];

export function HeritageMapPage() {
  const [zoneFilter, setZoneFilter] = useState<"all" | HeritageZone>("all");
  const [selectedSpotId, setSelectedSpotId] = useState<string>("ngo-mon");
  const [activeItinerarySpotIds, setActiveItinerarySpotIds] = useState<string[]>([]);

  const visibleSpots =
    zoneFilter === "all"
      ? HUE_HERITAGE_SPOTS
      : HUE_HERITAGE_SPOTS.filter((s) => s.zone === zoneFilter);

  const selectedSpot =
    HUE_HERITAGE_SPOTS.find((s) => s.id === selectedSpotId) || HUE_HERITAGE_SPOTS[0];

  const handleSelectSpot = (spot: HeritageSpot) => {
    setSelectedSpotId(spot.id);
    setActiveItinerarySpotIds([]);
  };

  const handleSpotKeyDown = (e: KeyboardEvent<SVGGElement>, spot: HeritageSpot) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectSpot(spot);
    }
  };

  const handleSelectItinerary = (spotIds: string[]) => {
    setZoneFilter("all");
    setActiveItinerarySpotIds(spotIds);
    if (spotIds[0]) setSelectedSpotId(spotIds[0]);
  };

  // Vẽ đường nối giữa các điểm trong lộ trình đang chọn
  const itineraryPolylinePoints = activeItinerarySpotIds
    .map((id) => HUE_HERITAGE_SPOTS.find((s) => s.id === id))
    .filter((s): s is HeritageSpot => Boolean(s))
    .map((s) => `${s.x},${s.y}`)
    .join(" ");

  return (
    <div className="heritage-map-page">
      {/* Hero Banner */}
      <section className="heritage-hero">
        <div className="container heritage-hero-inner">
          <span className="section-tag">BẢN ĐỒ SỐ HÓA DI SẢN CỐ ĐÔ</span>
          <h1 className="heritage-hero-title">Bản Đồ Tọa Độ Nhiếp Ảnh Cung Đình Huế</h1>
          <p className="heritage-hero-desc">
            Tra cứu trực quan 9 địa danh di sản đẹp nhất đôi bờ Sông Hương: khung giờ vàng ánh sáng,
            chi phí giấy phép quay chụp, gợi ý phối cổ phục và quy tắc bảo tồn di tích.
          </p>

          <div className="heritage-zone-tabs" role="tablist" aria-label="Lọc vùng di sản">
            <button
              type="button"
              role="tab"
              aria-selected={zoneFilter === "all"}
              className={`zone-tab-btn ${zoneFilter === "all" ? "active" : ""}`}
              onClick={() => setZoneFilter("all")}
            >
              Tất Cả Địa Danh ({HUE_HERITAGE_SPOTS.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={zoneFilter === "hoang-thanh"}
              className={`zone-tab-btn ${zoneFilter === "hoang-thanh" ? "active" : ""}`}
              onClick={() => {
                setZoneFilter("hoang-thanh");
                setSelectedSpotId("ngo-mon");
              }}
            >
              Khu Hoàng Thành (3)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={zoneFilter === "thien-nhien"}
              className={`zone-tab-btn ${zoneFilter === "thien-nhien" ? "active" : ""}`}
              onClick={() => {
                setZoneFilter("thien-nhien");
                setSelectedSpotId("cau-truong-tien");
              }}
            >
              Sông Hương & Biệt Phủ (3)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={zoneFilter === "lang-tam"}
              className={`zone-tab-btn ${zoneFilter === "lang-tam" ? "active" : ""}`}
              onClick={() => {
                setZoneFilter("lang-tam");
                setSelectedSpotId("lang-khai-dinh");
              }}
            >
              Lăng Tẩm & Đồi Thông (3)
            </button>
          </div>
        </div>
      </section>

      {/* Main Map + Detail Panel */}
      <section className="heritage-workspace-section">
        <div className="container heritage-workspace-grid">
          {/* Cột Trái: Bản đồ Pure SVG Cố Đô Huế */}
          <div className="heritage-svg-card">
            <div className="svg-card-toolbar">
              <div className="svg-toolbar-left">
                <Icon name="compass" size={18} color="var(--secondary)" />
                <span>Bản đồ kiến trúc khái lược Kinh Thành & Nam Ngạn Sông Hương</span>
              </div>
              <span className="svg-toolbar-hint">Nhấp vào ghim vàng để xem chi tiết</span>
            </div>

            <div className="heritage-svg-canvas-wrap">
              <svg
                viewBox="0 0 880 560"
                className="heritage-svg-canvas"
                role="img"
                aria-label="Bản đồ tương tác 9 địa điểm chụp ảnh cưới di sản Huế"
              >
                <defs>
                  <linearGradient id="perfumeRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2B6CB0" stopOpacity="0.28" />
                    <stop offset="50%" stopColor="#3182CE" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#2C5282" stopOpacity="0.26" />
                  </linearGradient>
                  <radialGradient id="citadelGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#8B0000" stopOpacity="0.03" />
                  </radialGradient>
                </defs>

                {/* Lưới tọa độ cổ đồ */}
                <g stroke="var(--secondary)" strokeOpacity="0.12" strokeDasharray="4 6">
                  <line x1="0" y1="140" x2="880" y2="140" />
                  <line x1="0" y1="280" x2="880" y2="280" />
                  <line x1="0" y1="420" x2="880" y2="420" />
                  <line x1="220" y1="0" x2="220" y2="560" />
                  <line x1="440" y1="0" x2="440" y2="560" />
                  <line x1="660" y1="0" x2="660" y2="560" />
                </g>

                {/* Vùng đồi thông phía Nam */}
                <ellipse cx="470" cy="465" rx="260" ry="78" fill="#2F855A" fillOpacity="0.08" />

                {/* Dòng Sông Hương uốn lượn qua Kinh Thành */}
                <path
                  d="M -20 325 C 120 295, 220 265, 340 272 C 460 278, 560 292, 680 245 C 760 212, 830 190, 900 185"
                  fill="none"
                  stroke="url(#perfumeRiverGrad)"
                  strokeWidth="44"
                  strokeLinecap="round"
                />
                <path
                  d="M -20 325 C 120 295, 220 265, 340 272 C 460 278, 560 292, 680 245 C 760 212, 830 190, 900 185"
                  fill="none"
                  stroke="#63B3ED"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  strokeDasharray="8 6"
                />

                {/* Nhánh Sông An Cựu */}
                <path
                  d="M 555 288 C 595 330, 650 365, 765 395"
                  fill="none"
                  stroke="url(#perfumeRiverGrad)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                {/* Nhịp Cầu Trường Tiền 6 vài 12 nhịp */}
                <g transform="translate(502, 256) rotate(6)">
                  <rect
                    x="0"
                    y="0"
                    width="36"
                    height="46"
                    rx="4"
                    fill="var(--surface)"
                    fillOpacity="0.85"
                    stroke="var(--secondary)"
                    strokeWidth="1.6"
                  />
                  <path d="M4 12 Q18 4 32 12 M4 24 Q18 16 32 24 M4 36 Q18 28 32 36" stroke="var(--primary)" strokeWidth="1.4" fill="none" />
                </g>

                {/* Vòng Tường Kinh Thành Huế (Vuông xoay nhẹ theo địa lý thực) */}
                <polygon
                  points="300,70 535,55 565,235 320,248"
                  fill="url(#citadelGlow)"
                  stroke="var(--secondary)"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                {/* Vòng Hoàng Thành & Tử Cấm Thành bên trong */}
                <polygon
                  points="345,105 495,96 512,222 358,230"
                  fill="rgba(139, 0, 0, 0.08)"
                  stroke="var(--primary)"
                  strokeWidth="2"
                />

                {/* Nhãn Địa Lý Cố Đô */}
                <text x="425" y="44" textAnchor="middle" className="svg-map-region-label">
                  BỜ BẮC — KINH THÀNH PHÚ XUÂN
                </text>
                <text x="155" y="302" textAnchor="middle" className="svg-map-river-label">
                  DÒNG HƯƠNG GIANG
                </text>
                <text x="720" y="372" textAnchor="middle" className="svg-map-river-label">
                  SÔNG AN CỰU
                </text>
                <text x="465" y="536" textAnchor="middle" className="svg-map-region-label">
                  BỜ NAM — QUẦN THỂ LĂNG TẨM & ĐỒI THÔNG
                </text>

                {/* La Bàn Cung Đình góc phải trên */}
                <g transform="translate(815, 62)">
                  <circle cx="0" cy="0" r="26" fill="var(--surface)" fillOpacity="0.9" stroke="var(--secondary)" strokeWidth="1.5" />
                  <polygon points="0,-20 5,0 0,-5 -5,0" fill="var(--primary)" />
                  <polygon points="0,20 5,0 0,5 -5,0" fill="var(--secondary)" />
                  <text x="0" y="-29" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--secondary)">
                    BẮC
                  </text>
                </g>

                {/* Đường nối Lộ Trình Đề Xuất nếu đang chọn */}
                {itineraryPolylinePoints && (
                  <polyline
                    points={itineraryPolylinePoints}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeDasharray="7 5"
                  />
                )}

                {/* Các Ghim Địa Điểm Di Sản */}
                {visibleSpots.map((spot) => {
                  const isSelected = spot.id === selectedSpot.id;
                  const itineraryIdx = activeItinerarySpotIds.indexOf(spot.id);
                  return (
                    <g
                      key={spot.id}
                      transform={`translate(${spot.x}, ${spot.y})`}
                      className={`heritage-map-pin ${isSelected ? "is-selected" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Xem địa điểm ${spot.name}`}
                      onClick={() => handleSelectSpot(spot)}
                      onKeyDown={(e) => handleSpotKeyDown(e, spot)}
                    >
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="24"
                          className="pin-pulse-ring"
                          fill="rgba(212, 175, 55, 0.25)"
                          stroke="var(--secondary)"
                          strokeWidth="1.5"
                        />
                      )}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 13 : 10}
                        fill={isSelected ? "var(--primary)" : "var(--surface)"}
                        stroke="var(--secondary)"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 4.5 : 3.5}
                        fill={isSelected ? "var(--secondary)" : "var(--primary)"}
                      />

                      {itineraryIdx >= 0 && (
                        <g transform="translate(12, -14)">
                          <circle cx="0" cy="0" r="9" fill="var(--secondary)" />
                          <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="800"
                            fill="#1A1512"
                          >
                            {itineraryIdx + 1}
                          </text>
                        </g>
                      )}

                      <g transform="translate(0, 26)">
                        <rect
                          x="-76"
                          y="-11"
                          width="152"
                          height="20"
                          rx="10"
                          fill="var(--surface)"
                          fillOpacity="0.94"
                          stroke={isSelected ? "var(--primary)" : "var(--border-gold)"}
                          strokeWidth={isSelected ? "1.6" : "1"}
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          className={`pin-caption-text ${isSelected ? "selected" : ""}`}
                        >
                          {(spot.name.split(" & ")[0] || spot.name).split(" (")[0]}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Thanh chọn nhanh địa điểm bên dưới bản đồ cho màn hình cảm ứng */}
            <div className="spot-quick-pills">
              {visibleSpots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`spot-pill-btn ${spot.id === selectedSpot.id ? "active" : ""}`}
                  onClick={() => handleSelectSpot(spot)}
                >
                  <Icon name="mapPin" size={14} />
                  <span>{spot.name.split(" (")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cột Phải: Hồ sơ chi tiết Địa Danh đang chọn */}
          <aside className="heritage-detail-panel" aria-live="polite">
            <div className="detail-photo-frame">
              <img src={selectedSpot.image} alt={selectedSpot.name} loading="lazy" />
              <span className="detail-zone-badge">{selectedSpot.zoneLabel}</span>
            </div>

            <div className="detail-panel-body">
              <h2 className="detail-spot-title">{selectedSpot.name}</h2>
              <p className="detail-spot-summary">{selectedSpot.summary}</p>

              <div className="detail-specs-list">
                <div className="detail-spec-row">
                  <div className="spec-icon-box">
                    <Icon name="sun" size={17} color="var(--secondary)" />
                  </div>
                  <div>
                    <span className="spec-label">Khung giờ vàng ánh sáng</span>
                    <strong className="spec-value">{selectedSpot.goldenHour}</strong>
                  </div>
                </div>

                <div className="detail-spec-row">
                  <div className="spec-icon-box">
                    <Icon name="palette" size={17} color="var(--secondary)" />
                  </div>
                  <div>
                    <span className="spec-label">Phối cổ phục ăn ảnh nhất</span>
                    <strong className="spec-value">{selectedSpot.recommendedAttire}</strong>
                  </div>
                </div>

                <div className="detail-spec-row">
                  <div className="spec-icon-box">
                    <Icon name="award" size={17} color="var(--secondary)" />
                  </div>
                  <div>
                    <span className="spec-label">Chi phí vé & giấy phép ekip tham khảo</span>
                    <strong className="spec-value price-highlight">
                      {formatCurrency(selectedSpot.permitFee)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="detail-highlights-box">
                <h4>Góc Máy Đắt Giá Nhất</h4>
                <ul>
                  {selectedSpot.highlights.map((h) => (
                    <li key={h}>
                      <Icon name="check" size={14} color="var(--success)" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-rule-callout">
                <Icon name="shield" size={17} color="var(--warning)" />
                <p>
                  <strong>Quy tắc bảo tồn di tích:</strong> {selectedSpot.heritageRule}
                </p>
              </div>

              <div className="detail-cta-group">
                <Link
                  to={`/dat-lich?diaDiem=${encodeURIComponent(selectedSpot.bookingVenueValue)}`}
                  className="detail-cta-link"
                >
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    rightIcon={<Icon name="arrowRight" size={16} />}
                  >
                    Đặt Lịch Chụp Tại Địa Danh Này
                  </Button>
                </Link>
                <Link to="/phoi-co-phuc" className="detail-cta-link">
                  <Button variant="secondary" size="md" fullWidth>
                    Phối Cổ Phục Cho Bối Cảnh Này
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <RoyalDivider variant="lotus" />

      {/* 3 Lộ trình gợi ý không mệt mỏi */}
      <section className="heritage-itineraries-section">
        <div className="container">
          <div className="itineraries-header">
            <span className="section-tag">LỘ TRÌNH TỐI ƯU DI CHUYỂN</span>
            <h2 className="section-title">Gợi Ý 3 Tuyến Chụp Ghép Điểm Trong Ngày</h2>
            <p>
              Nhấp chọn một tuyến để vẽ đường di chuyển trực tiếp lên bản đồ Cố đô phía trên.
            </p>
          </div>

          <div className="itineraries-grid">
            {SUGGESTED_ITINERARIES.map((item) => {
              const isCurrent =
                activeItinerarySpotIds.length > 0 &&
                activeItinerarySpotIds.join(",") === item.spotIds.join(",");
              return (
                <div
                  key={item.id}
                  className={`itinerary-card ${isCurrent ? "active" : ""}`}
                >
                  <span className="itinerary-duration">{item.duration}</span>
                  <h3>{item.title}</h3>
                  <div className="itinerary-route-line">{item.route}</div>
                  <p>{item.bestFor}</p>
                  <Button
                    variant={isCurrent ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => {
                      handleSelectItinerary(item.spotIds);
                      window.scrollTo({ top: 240, behavior: "smooth" });
                    }}
                  >
                    {isCurrent ? "Đang Hiển Thị Trên Bản Đồ" : "Xem Tuyến Trên Bản Đồ"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
