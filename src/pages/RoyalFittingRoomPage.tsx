import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCartStore } from "../features/packages/cartStore";
import { useAuth } from "../features/auth/AuthContext";
import { useToastStore } from "../lib/toastStore";
import { formatCurrency } from "../lib/formatters";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import "./RoyalFittingRoomPage.css";

interface GarmentOption {
  id: string;
  name: string;
  price: number;
  desc: string;
}

interface BrocadeColor {
  id: string;
  name: string;
  hex: string;
  trimHex: string;
}

interface HeadwearOption {
  id: string;
  name: string;
  price: number;
}

interface AccessoryOption {
  id: string;
  name: string;
  price: number;
}

const BRIDE_GARMENTS: [GarmentOption, ...GarmentOption[]] = [
  {
    id: "nhat-binh",
    name: "Áo Nhật Bình Hoàng Hậu",
    price: 4500000,
    desc: "Cổ chữ nhật thêu loan phượng, tay áo dải ngũ sắc tượng trưng ngũ hành.",
  },
  {
    id: "ao-tac-nu",
    name: "Áo Tấc Ngũ Thân Nữ Gia",
    price: 3400000,
    desc: "Cổ đứng trang nghiêm, tay thụng rộng 5 thân tượng trưng tứ thân phụ mẫu.",
  },
  {
    id: "giao-linh",
    name: "Áo Giao Lĩnh Tơ Tằm",
    price: 3900000,
    desc: "Cổ giao nhau chéo vạt tiền triều kết hợp chân váy thường trắng thanh tao.",
  },
];

const GROOM_GARMENTS: [GarmentOption, ...GarmentOption[]] = [
  {
    id: "ao-tac-nam",
    name: "Áo Tấc Ngũ Thân Tay Thụng",
    price: 3200000,
    desc: "Lễ phục truyền thống triều Nguyễn phối quần trắng và khăn xếp chữ Nhân.",
  },
  {
    id: "mang-bao",
    name: "Mãng Bào Thêu Rồng Bốn Móng",
    price: 4800000,
    desc: "Bào phục đại lễ thêu thủy ba và rồng mây kim tuyến nổi uy lực.",
  },
];

const BRIDE_COLORS: [BrocadeColor, ...BrocadeColor[]] = [
  { id: "chu-sa", name: "Đỏ Chu Sa", hex: "#8B0000", trimHex: "#D4AF37" },
  { id: "hoang-kim", name: "Hoàng Kim", hex: "#B78618", trimHex: "#680000" },
  { id: "luc-bao", name: "Lục Bảo", hex: "#1B5138", trimHex: "#D4AF37" },
  { id: "lam-ngoc", name: "Lam Ngọc", hex: "#1E3A5F", trimHex: "#E2C05A" },
  { id: "hong-sen", name: "Hồng Sen", hex: "#942951", trimHex: "#F0D27A" },
];

const GROOM_COLORS: [BrocadeColor, ...BrocadeColor[]] = [
  { id: "lam-quan", name: "Lam Sẫm", hex: "#1A365D", trimHex: "#D4AF37" },
  { id: "huyet-du", name: "Đỏ Huyết Dụ", hex: "#6E1414", trimHex: "#D4AF37" },
  { id: "huyen-kim", name: "Đen Huyền Kim", hex: "#231F20", trimHex: "#D4AF37" },
  { id: "vang-dong", name: "Vàng Vương Gia", hex: "#9E711B", trimHex: "#5C0A0A" },
];

const BRIDE_HEADWEAR: [HeadwearOption, ...HeadwearOption[]] = [
  { id: "man-phuong", name: "Mấn Phượng Pháp Lam", price: 850000 },
  { id: "khan-vanh", name: "Khăn Vành Vàng Cung Đình", price: 450000 },
  { id: "tram-ngoc", name: "Trâm Ngọc Trai Cài Tóc", price: 250000 },
];

const ACCESSORIES: AccessoryOption[] = [
  { id: "khanh-vang", name: "Khánh Vàng Bội Ngọc Đôi", price: 350000 },
  { id: "quat-giay", name: "Quạt Trúc Chỉ Thư Pháp Huế", price: 200000 },
  { id: "hai-theu", name: "Hài Thêu & Guốc Mộc Sơn Mài", price: 300000 },
];

const CURATED_PRESETS = [
  {
    id: "preset-dai-trieu",
    label: "Đại Triều Ngọ Môn",
    brideGarment: "nhat-binh",
    brideColor: "chu-sa",
    headwear: "man-phuong",
    groomGarment: "mang-bao",
    groomColor: "lam-quan",
    accessories: ["khanh-vang", "hai-theu"],
  },
  {
    id: "preset-khiem-lang",
    label: "Tĩnh Mặc Khiêm Lăng",
    brideGarment: "ao-tac-nu",
    brideColor: "luc-bao",
    headwear: "khan-vanh",
    groomGarment: "ao-tac-nam",
    groomColor: "huyen-kim",
    accessories: ["quat-giay"],
  },
  {
    id: "preset-kim-long",
    label: "Hoàng Kim Diên Thọ",
    brideGarment: "giao-linh",
    brideColor: "hoang-kim",
    headwear: "tram-ngoc",
    groomGarment: "ao-tac-nam",
    groomColor: "huyet-du",
    accessories: ["khanh-vang", "quat-giay"],
  },
];

export function RoyalFittingRoomPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addToast = useToastStore((s) => s.addToast);

  const [brideGarmentId, setBrideGarmentId] = useState("nhat-binh");
  const [brideColorId, setBrideColorId] = useState("chu-sa");
  const [headwearId, setHeadwearId] = useState("man-phuong");

  const [groomGarmentId, setGroomGarmentId] = useState("ao-tac-nam");
  const [groomColorId, setGroomColorId] = useState("lam-quan");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    "khanh-vang",
    "quat-giay",
  ]);

  const brideGarment =
    BRIDE_GARMENTS.find((g) => g.id === brideGarmentId) || BRIDE_GARMENTS[0];
  const brideColor =
    BRIDE_COLORS.find((c) => c.id === brideColorId) || BRIDE_COLORS[0];
  const headwear =
    BRIDE_HEADWEAR.find((h) => h.id === headwearId) || BRIDE_HEADWEAR[0];

  const groomGarment =
    GROOM_GARMENTS.find((g) => g.id === groomGarmentId) || GROOM_GARMENTS[0];
  const groomColor =
    GROOM_COLORS.find((c) => c.id === groomColorId) || GROOM_COLORS[0];

  const activeAccessoryObjects = ACCESSORIES.filter((a) =>
    selectedAccessories.includes(a.id)
  );
  const accessoriesTotal = activeAccessoryObjects.reduce((s, a) => s + a.price, 0);

  const totalPrice =
    brideGarment.price + headwear.price + groomGarment.price + accessoriesTotal;

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyPreset = (preset: (typeof CURATED_PRESETS)[number]) => {
    setBrideGarmentId(preset.brideGarment);
    setBrideColorId(preset.brideColor);
    setHeadwearId(preset.headwear);
    setGroomGarmentId(preset.groomGarment);
    setGroomColorId(preset.groomColor);
    setSelectedAccessories(preset.accessories);
  };

  const handleAddCustomSetToCart = () => {
    if (!isAuthenticated) {
      addToast(
        "Quý khách vui lòng đăng nhập để lưu bộ cổ phục phối riêng vào giỏ cưới!",
        "warning"
      );
      navigate("/login");
      return;
    }

    const configKey = `cp-${brideGarment.id}-${brideColor.id}-${groomGarment.id}-${groomColor.id}-${headwear.id}`;
    const customTitle = `Bộ Cổ Phục Đôi: ${brideGarment.name} (${brideColor.name}) & ${groomGarment.name} (${groomColor.name})`;

    addItem({
      id: configKey,
      ten: customTitle,
      gia: totalPrice,
      hinhAnh:
        "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
      loai: "ao-dai",
      phongCach: "cung-dinh",
    });

    addToast("Đã thêm bộ cổ phục phối riêng vào giỏ cưới của bạn!", "success");
    openCart();
  };

  const hasKhanhVang = selectedAccessories.includes("khanh-vang");
  const hasQuatGiay = selectedAccessories.includes("quat-giay");

  return (
    <div className="fitting-room-page">
      <section className="fitting-hero">
        <div className="container fitting-hero-inner">
          <span className="section-tag">XƯỞNG CHẾ TÁC Y PHỤC HOÀNG TRIỀU</span>
          <h1 className="fitting-title">Phòng Phối Cổ Phục Cưới Trực Quan 2D</h1>
          <p className="fitting-subtitle">
            Tự tay phối hợp phom dáng Áo Nhật Bình, Áo Tấc, Mãng Bào cùng sắc gấm truyền thống và
            phụ kiện pháp lam để tìm ra tổng thể hài hòa nhất cho ngày trọng đại.
          </p>

          <div className="preset-bar">
            <span className="preset-bar-label">Bộ phối gợi ý nhanh:</span>
            {CURATED_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="preset-chip-btn"
                onClick={() => applyPreset(p)}
              >
                <Icon name="sparkles" size={14} color="var(--secondary)" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="fitting-stage-section">
        <div className="container fitting-grid">
          {/* Cột Trái: Sân khấu Ma-nơ-canh Đôi Pure SVG */}
          <div className="fitting-canvas-card">
            <div className="canvas-header-strip">
              <span>Bản vẽ phác thảo tỷ lệ đôi Tân Nương & Tân Lang</span>
              <span className="canvas-price-pill">
                Tổng bộ đôi: <strong>{formatCurrency(totalPrice)}</strong>
              </span>
            </div>

            <div className="fitting-svg-stage">
              <svg
                viewBox="0 0 640 500"
                className="fitting-svg"
                role="img"
                aria-label="Mô phỏng trực quan bộ cổ phục cô dâu và chú rể"
              >
                <defs>
                  <radialGradient id="royalBackdropCircle" cx="50%" cy="46%" r="48%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.24" />
                    <stop offset="70%" stopColor="#8B0000" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Phông nền Vầng Trăng Cung Đình & Cửa Võng */}
                <circle cx="320" cy="240" r="205" fill="url(#royalBackdropCircle)" />
                <circle
                  cx="320"
                  cy="240"
                  r="185"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeOpacity="0.32"
                  strokeDasharray="6 4"
                />
                <ellipse
                  cx="320"
                  cy="452"
                  rx="235"
                  ry="20"
                  fill="rgba(212, 175, 55, 0.16)"
                />

                {/* ======================================================
                    1. TÂN NƯƠNG (CÔ DÂU - BÊN TRÁI x=205)
                   ====================================================== */}
                <g transform="translate(205, 75)">
                  {/* Mấn / Khăn vành / Trâm cài */}
                  {headwearId === "man-phuong" && (
                    <g>
                      <ellipse cx="0" cy="24" rx="44" ry="18" fill={brideColor.hex} stroke="#D4AF37" strokeWidth="2" />
                      <path d="M-28 14 Q0 -12 28 14" fill="none" stroke="#D4AF37" strokeWidth="3" />
                      <circle cx="0" cy="4" r="6" fill="#D4AF37" />
                      <line x1="-38" y1="26" x2="-42" y2="54" stroke="#D4AF37" strokeWidth="2" />
                      <line x1="38" y1="26" x2="42" y2="54" stroke="#D4AF37" strokeWidth="2" />
                    </g>
                  )}
                  {headwearId === "khan-vanh" && (
                    <ellipse cx="0" cy="26" rx="46" ry="15" fill="#D4AF37" stroke="#8B0000" strokeWidth="1.8" />
                  )}
                  {headwearId === "tram-ngoc" && (
                    <g>
                      <circle cx="0" cy="18" r="18" fill="#2D241E" />
                      <line x1="-32" y1="18" x2="34" y2="14" stroke="#D4AF37" strokeWidth="2.5" />
                      <circle cx="34" cy="14" r="4" fill="#FFFDF7" stroke="#D4AF37" strokeWidth="1.2" />
                    </g>
                  )}

                  {/* Khuôn mặt & Cổ */}
                  <circle cx="0" cy="48" r="22" fill="#F6E2CC" stroke="#D9B99B" strokeWidth="1.2" />
                  <rect x="-7" y="68" width="14" height="14" rx="4" fill="#F2D8BE" />

                  {/* Chân váy Thường trắng ngà bên dưới */}
                  <polygon
                    points="-42,235 42,235 64,368 -64,368"
                    fill="#FBF8F1"
                    stroke="#D8CEBE"
                    strokeWidth="1.5"
                  />

                  {/* Thân Áo Cô Dâu */}
                  <path
                    d="M-32,82 L32,82 L88,195 L56,214 L36,154 L46,328 L-46,328 L-36,154 L-56,214 L-88,195 Z"
                    fill={brideColor.hex}
                    stroke={brideColor.trimHex}
                    strokeWidth="2.2"
                  />

                  {/* Họa tiết đặc trưng từng phom áo cô dâu */}
                  {brideGarmentId === "nhat-binh" && (
                    <g>
                      {/* Cổ Nhật Bình chữ nhật thêu kim tuyến */}
                      <rect
                        x="-22"
                        y="82"
                        width="44"
                        height="44"
                        fill={brideColor.trimHex}
                        fillOpacity="0.9"
                        stroke="#FFF8DC"
                        strokeWidth="1.2"
                      />
                      {/* Dải ngũ sắc ở ống tay */}
                      <line x1="-74" y1="176" x2="-48" y2="192" stroke="#2B6CB0" strokeWidth="4" />
                      <line x1="-78" y1="182" x2="-52" y2="198" stroke="#38A169" strokeWidth="4" />
                      <line x1="-82" y1="188" x2="-56" y2="204" stroke="#ECC94B" strokeWidth="4" />
                      <line x1="74" y1="176" x2="48" y2="192" stroke="#2B6CB0" strokeWidth="4" />
                      <line x1="78" y1="182" x2="52" y2="198" stroke="#38A169" strokeWidth="4" />
                      <line x1="82" y1="188" x2="56" y2="204" stroke="#ECC94B" strokeWidth="4" />
                      {/* Hoa văn đoàn phượng trên ngực & tà */}
                      <circle cx="0" cy="175" r="14" fill="none" stroke="#D4AF37" strokeWidth="1.8" />
                      <circle cx="-18" cy="245" r="11" fill="none" stroke="#D4AF37" strokeWidth="1.4" />
                      <circle cx="18" cy="245" r="11" fill="none" stroke="#D4AF37" strokeWidth="1.4" />
                    </g>
                  )}

                  {brideGarmentId === "ao-tac-nu" && (
                    <g>
                      <rect x="-12" y="76" width="24" height="10" rx="3" fill={brideColor.trimHex} />
                      <path d="M0,86 L24,132 L24,324" fill="none" stroke={brideColor.trimHex} strokeWidth="1.8" />
                      <circle cx="24" cy="132" r="3" fill="#D4AF37" />
                      <circle cx="24" cy="175" r="3" fill="#D4AF37" />
                      <circle cx="24" cy="218" r="3" fill="#D4AF37" />
                    </g>
                  )}

                  {brideGarmentId === "giao-linh" && (
                    <g>
                      <path d="M-20,82 L18,148 M20,82 L-8,130" stroke="#FBF8F1" strokeWidth="4" fill="none" />
                      <rect x="-35" y="152" width="70" height="12" rx="4" fill={brideColor.trimHex} />
                    </g>
                  )}

                  {/* Khánh vàng đeo ngực cô dâu */}
                  {hasKhanhVang && (
                    <g transform="translate(0, 136)">
                      <path d="M-16,-24 Q0,-4 16,-24" fill="none" stroke="#D4AF37" strokeWidth="1.6" />
                      <polygon points="0,-6 12,4 0,14 -12,4" fill="#D4AF37" stroke="#FFF8DC" strokeWidth="1" />
                    </g>
                  )}

                  <text x="0" y="395" textAnchor="middle" className="svg-role-caption">
                    TÂN NƯƠNG
                  </text>
                </g>

                {/* ======================================================
                    2. TÂN LANG (CHÚ RỂ - BÊN PHẢI x=435)
                   ====================================================== */}
                <g transform="translate(435, 62)">
                  {/* Khăn đóng chữ Nhân truyền thống */}
                  <path
                    d="M-28,28 Q0,4 28,28 L25,44 L-25,44 Z"
                    fill={groomColor.hex}
                    stroke={groomColor.trimHex}
                    strokeWidth="2"
                  />
                  <path d="M-18,36 L0,24 L18,36" fill="none" stroke="#D4AF37" strokeWidth="1.6" />

                  {/* Khuôn mặt & Cổ */}
                  <circle cx="0" cy="58" r="23" fill="#F2D8BE" stroke="#D5B292" strokeWidth="1.2" />
                  <rect x="-8" y="80" width="16" height="14" rx="4" fill="#ECCFB2" />

                  {/* Quần lụa trắng ống sớ */}
                  <rect x="-32" y="290" width="26" height="88" rx="4" fill="#FBF8F1" stroke="#D8CEBE" />
                  <rect x="6" y="290" width="26" height="88" rx="4" fill="#FBF8F1" stroke="#D8CEBE" />

                  {/* Thân Áo Chú Rể */}
                  <path
                    d="M-36,94 L36,94 L92,204 L60,222 L38,162 L46,332 L-46,332 L-38,162 L-60,222 L-92,204 Z"
                    fill={groomColor.hex}
                    stroke={groomColor.trimHex}
                    strokeWidth="2.2"
                  />

                  {/* Họa tiết Áo Tấc vs Mãng Bào */}
                  {groomGarmentId === "ao-tac-nam" ? (
                    <g>
                      <rect x="-14" y="88" width="28" height="11" rx="3" fill={groomColor.trimHex} />
                      <path d="M0,99 L26,144 L26,330" fill="none" stroke={groomColor.trimHex} strokeWidth="1.8" />
                      <circle cx="0" cy="168" r="18" fill="none" stroke="#D4AF37" strokeWidth="1.8" />
                      <path d="M-8,168 L0,160 L8,168 L0,176 Z" fill="#D4AF37" />
                    </g>
                  ) : (
                    <g>
                      {/* Mãng Bào thêu rồng & sóng thủy ba chân áo */}
                      <circle cx="0" cy="165" r="24" fill="rgba(212,175,55,0.2)" stroke="#D4AF37" strokeWidth="2.2" />
                      <circle cx="0" cy="165" r="10" fill="#D4AF37" />
                      <rect x="-38" y="198" width="76" height="10" rx="3" fill="#D4AF37" />
                      <path
                        d="M-44,312 Q-22,296 0,312 T44,312"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="3"
                      />
                      <path
                        d="M-45,322 Q-22,306 0,322 T45,322"
                        fill="none"
                        stroke="#ECC94B"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* Khánh vàng đeo ngực chú rể */}
                  {hasKhanhVang && (
                    <g transform="translate(0, 134)">
                      <polygon points="0,-6 13,4 0,14 -13,4" fill="#D4AF37" stroke="#FFF8DC" strokeWidth="1" />
                    </g>
                  )}

                  {/* Quạt giấy trúc chỉ cầm tay */}
                  {hasQuatGiay && (
                    <g transform="translate(-58, 208) rotate(-18)">
                      <path
                        d="M0,0 L-26,-32 A38,38 0 0,1 26,-32 Z"
                        fill="#FFF8E7"
                        stroke="#D4AF37"
                        strokeWidth="1.8"
                      />
                      <line x1="0" y1="0" x2="-12" y2="-35" stroke="#8B0000" strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="-38" stroke="#8B0000" strokeWidth="1" />
                      <line x1="0" y1="0" x2="12" y2="-35" stroke="#8B0000" strokeWidth="1" />
                    </g>
                  )}

                  <text x="0" y="408" textAnchor="middle" className="svg-role-caption">
                    TÂN LANG
                  </text>
                </g>
              </svg>
            </div>

            <div className="canvas-summary-footer">
              <div className="summary-tags">
                <span>{brideGarment.name} • {brideColor.name}</span>
                <span>{headwear.name}</span>
                <span>{groomGarment.name} • {groomColor.name}</span>
              </div>
            </div>
          </div>

          {/* Cột Phải: Bảng Điều Khiển Cấu Hình Từng Lớp */}
          <div className="fitting-controls-panel">
            {/* 1. Phục trang Cô dâu */}
            <div className="config-block">
              <h2 className="config-block-title">1. Phục Trang Tân Nương (Cô Dâu)</h2>
              <div className="garment-cards-list">
                {BRIDE_GARMENTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`garment-choice-btn ${brideGarmentId === g.id ? "active" : ""}`}
                    onClick={() => setBrideGarmentId(g.id)}
                  >
                    <div className="garment-choice-top">
                      <strong>{g.name}</strong>
                      <span>{formatCurrency(g.price)}</span>
                    </div>
                    <p>{g.desc}</p>
                  </button>
                ))}
              </div>

              <div className="swatch-row-wrap">
                <span className="swatch-label">Sắc gấm Cô Dâu: <strong>{brideColor.name}</strong></span>
                <div className="color-swatches">
                  {BRIDE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`swatch-circle ${brideColorId === c.id ? "active" : ""}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setBrideColorId(c.id)}
                      aria-label={`Chọn màu ${c.name} cho cô dâu`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="headwear-pills">
                {BRIDE_HEADWEAR.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`headwear-pill ${headwearId === h.id ? "active" : ""}`}
                    onClick={() => setHeadwearId(h.id)}
                  >
                    <span>{h.name}</span>
                    <small>+{formatCurrency(h.price)}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Phục trang Chú rể */}
            <div className="config-block">
              <h2 className="config-block-title">2. Phục Trang Tân Lang (Chú Rể)</h2>
              <div className="garment-cards-list">
                {GROOM_GARMENTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`garment-choice-btn ${groomGarmentId === g.id ? "active" : ""}`}
                    onClick={() => setGroomGarmentId(g.id)}
                  >
                    <div className="garment-choice-top">
                      <strong>{g.name}</strong>
                      <span>{formatCurrency(g.price)}</span>
                    </div>
                    <p>{g.desc}</p>
                  </button>
                ))}
              </div>

              <div className="swatch-row-wrap">
                <span className="swatch-label">Sắc gấm Chú Rể: <strong>{groomColor.name}</strong></span>
                <div className="color-swatches">
                  {GROOM_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`swatch-circle ${groomColorId === c.id ? "active" : ""}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setGroomColorId(c.id)}
                      aria-label={`Chọn màu ${c.name} cho chú rể`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Phụ kiện hoàng cung đi kèm */}
            <div className="config-block">
              <h2 className="config-block-title">3. Đạo Cụ & Phụ Kiện Chế Tác Đi Kèm</h2>
              <div className="accessory-check-grid">
                {ACCESSORIES.map((acc) => {
                  const checked = selectedAccessories.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      className={`accessory-toggle-btn ${checked ? "active" : ""}`}
                      onClick={() => toggleAccessory(acc.id)}
                      aria-pressed={checked}
                    >
                      <div className="acc-left">
                        <Icon
                          name={checked ? "checkCircle" : "plus"}
                          size={16}
                          color={checked ? "var(--secondary)" : "var(--text-muted)"}
                        />
                        <span>{acc.name}</span>
                      </div>
                      <strong>+{formatCurrency(acc.price)}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Báo giá tổng hợp & Đặt thuê */}
            <div className="fitting-checkout-box">
              <div className="checkout-price-row">
                <span>Tổng chi phí thuê trọn bộ đôi:</span>
                <strong>{formatCurrency(totalPrice)}</strong>
              </div>
              <p className="checkout-note">
                Đã bao gồm giặt hấp thảo mộc cung đình, chỉnh sửa số đo vừa vặn trước ngày chụp 48 giờ.
              </p>
              <div className="checkout-actions">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<Icon name="cart" size={18} />}
                  onClick={handleAddCustomSetToCart}
                >
                  Đưa Bộ Cổ Phục Đã Phối Vào Giỏ Cưới
                </Button>
                <Link to="/ban-do-di-san" className="checkout-sub-link">
                  <Button variant="secondary" size="md" fullWidth>
                    Chọn Bối Cảnh Di Sản Hợp Với Bộ Này
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
