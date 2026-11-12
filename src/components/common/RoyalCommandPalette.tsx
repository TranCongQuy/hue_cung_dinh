import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { useWishlistStore } from "../../lib/wishlistStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { formatCurrency } from "../../lib/formatters";
import { Icon, IconName } from "./Icon";
import "./RoyalCommandPalette.css";

interface SearchableCommandItem {
  id: string;
  title: string;
  subtitle: string;
  group: "Lối Tắt Nhanh" | "Gói Cưới Combo" | "Dịch Vụ Lẻ" | "Mẫu Thiệp Cưới" | "Địa Danh Di Sản";
  path: string;
  icon: IconName;
  priceLabel?: string;
}

const QUICK_ROUTES: SearchableCommandItem[] = [
  {
    id: "qr-map",
    title: "Bản Đồ Di Sản Cố Đô Tương Tác",
    subtitle: "Khám phá Ngọ Môn, Cung Diên Thọ, Lăng Khải Định, Đồi Thiên An & giờ vàng ánh sáng",
    group: "Lối Tắt Nhanh",
    path: "/ban-do-di-san",
    icon: "map",
  },
  {
    id: "qr-fit",
    title: "Phòng Phối Cổ Phục Trực Quan 2D",
    subtitle: "Phối Áo Nhật Bình, Áo Tấc, sắc gấm & phụ kiện mấn phượng theo sở thích",
    group: "Lối Tắt Nhanh",
    path: "/phoi-co-phuc",
    icon: "palette",
  },
  {
    id: "qr-gallery",
    title: "Triển Lãm Lookbook & Hậu Kỳ Màu Phim",
    subtitle: "So sánh ảnh gốc và màu phim cung đình bằng thanh trượt Trước / Sau",
    group: "Lối Tắt Nhanh",
    path: "/trien-lam",
    icon: "image",
  },
  {
    id: "qr-planner",
    title: "Sổ Tay Kế Hoạch & Dự Toán Đám Cưới",
    subtitle: "Checklist chuẩn bị lễ cưới theo mốc thời gian & biểu đồ theo dõi ngân sách",
    group: "Lối Tắt Nhanh",
    path: "/ke-hoach-cuoi",
    icon: "clipboardList",
  },
  {
    id: "qr-ai",
    title: "AI Tư Vấn Ngân Sách Hoàng Triều",
    subtitle: "Gợi ý gói combo & dịch vụ lẻ khớp ngân sách từ 10 – 60 triệu đồng",
    group: "Lối Tắt Nhanh",
    path: "/tu-van",
    icon: "sparkles",
  },
  {
    id: "qr-book",
    title: "Đặt Lịch Chụp Ảnh & Chọn Ngày Đẹp",
    subtitle: "Kiểm tra lịch trống ekip theo tháng và khóa ca chụp Bình Minh / Hoàng Hôn",
    group: "Lối Tắt Nhanh",
    path: "/dat-lich",
    icon: "calendar",
  },
  {
    id: "qr-invite-sample",
    title: "Xem Mẫu Thiệp Mời Cưới Công Khai (Sổ Lưu Bút & RSVP)",
    subtitle: "Trải nghiệm thiệp mời Quốc Bảo & Ngọc Hân kèm đếm ngược thực tế",
    group: "Lối Tắt Nhanh",
    path: "/thiep-cuoi/moi/quoc-bao-ngoc-han-2026",
    icon: "mail",
  },
];

const HERITAGE_SPOTS: SearchableCommandItem[] = [
  {
    id: "hs-dai-noi",
    title: "Ngọ Môn & Điện Thái Hòa (Đại Nội Huế)",
    subtitle: "Giờ vàng: 06:00 – 08:30 • Phù hợp Áo Nhật Bình Đỏ Chu Sa & Vàng Hoàng Yến",
    group: "Địa Danh Di Sản",
    path: "/ban-do-di-san?spot=dai-noi",
    icon: "mapPin",
  },
  {
    id: "hs-dien-tho",
    title: "Cung Diên Thọ & Tịnh Minh Lâu",
    subtitle: "Giờ vàng: 15:00 – 17:15 • Hành lang gỗ sơn son & vườn thượng uyển trầm mặc",
    group: "Địa Danh Di Sản",
    path: "/ban-do-di-san?spot=cung-dien-tho",
    icon: "mapPin",
  },
  {
    id: "hs-khai-dinh",
    title: "Ứng Lăng (Lăng Vua Khải Định)",
    subtitle: "Giờ vàng: 14:30 – 17:00 • Kiến trúc khảm sành sứ tinh xảo bậc nhất triều Nguyễn",
    group: "Địa Danh Di Sản",
    path: "/ban-do-di-san?spot=lang-khai-dinh",
    icon: "mapPin",
  },
  {
    id: "hs-tu-duc",
    title: "Khiêm Lăng (Lăng Vua Tự Đức) & Hồ Lưu Khiêm",
    subtitle: "Giờ vàng: 06:30 – 09:00 • Thủy tạ Xung Khiêm Tạ thơ mộng bên đầm sen",
    group: "Địa Danh Di Sản",
    path: "/ban-do-di-san?spot=lang-tu-duc",
    icon: "mapPin",
  },
];

export function RoyalCommandPalette() {
  const navigate = useNavigate();
  const isOpen = useWishlistStore((s) => s.isCommandPaletteOpen);
  const closePalette = useWishlistStore((s) => s.closeCommandPalette);
  const togglePalette = useWishlistStore((s) => s.toggleCommandPalette);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [catalogItems, setCatalogItems] = useState<SearchableCommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      } else if (e.key === "Escape" && isOpen) {
        closePalette();
      }
    };
    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, [isOpen, togglePalette, closePalette]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 40);

    let mounted = true;
    Promise.all([
      SupabaseService.getPackages(),
      SupabaseService.getServices(),
      SupabaseService.getInvitations(),
    ]).then(([pkgs, svcs, invs]) => {
      if (!mounted) return;
      const mappedPkgs: SearchableCommandItem[] = pkgs.map((p) => ({
        id: `pkg-${p.id}`,
        title: p.ten,
        subtitle: p.moTa,
        group: "Gói Cưới Combo",
        path: `/goi-cuoi/${p.id}`,
        icon: "package",
        priceLabel: formatCurrency(p.giaTronGoi),
      }));
      const mappedSvcs: SearchableCommandItem[] = svcs.map((s) => ({
        id: `svc-${s.id}`,
        title: s.ten,
        subtitle: s.moTa,
        group: "Dịch Vụ Lẻ",
        path: `/dich-vu/${s.id}`,
        icon: "sparkles",
        priceLabel: formatCurrency(s.gia),
      }));
      const mappedInvs: SearchableCommandItem[] = invs.map((inv) => ({
        id: `inv-${inv.id}`,
        title: `Thiệp ${inv.ten}`,
        subtitle: `${inv.diaDiem} • Gói ${inv.loai.toUpperCase()}`,
        group: "Mẫu Thiệp Cưới",
        path: `/thiep-cuoi/${inv.id}`,
        icon: "mail",
        priceLabel: formatCurrency(inv.gia),
      }));
      setCatalogItems([...mappedPkgs, ...mappedSvcs, ...mappedInvs]);
    });

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const all = [...QUICK_ROUTES, ...HERITAGE_SPOTS, ...catalogItems];
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...QUICK_ROUTES, ...HERITAGE_SPOTS.slice(0, 2), ...catalogItems.slice(0, 5)];
    }
    return all
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q)
      )
      .slice(0, 14);
  }, [query, catalogItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchableCommandItem) => {
    closePalette();
    navigate(item.path);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
      );
    } else if (e.key === "Enter" && filteredItems[activeIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[activeIndex]!);
    }
  };

  return (
    <div
      className="cmd-palette-backdrop"
      onClick={closePalette}
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm toàn cục Huế Cung Đình"
    >
      <div className="cmd-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-palette-input-row">
          <Icon name="search" size={20} color="var(--secondary)" />
          <input
            ref={inputRef}
            id="global-command-search-input"
            name="globalCommandSearch"
            type="search"
            className="cmd-palette-input"
            placeholder="Tìm nhanh gói cưới, cổ phục Nhật Bình, địa danh Đại Nội, thiệp cưới..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-invalid={false}
            aria-describedby="cmd-palette-shortcut-hint"
          />
          <button
            type="button"
            className="cmd-palette-esc-btn"
            onClick={closePalette}
            aria-label="Đóng hộp tìm kiếm"
          >
            ESC
          </button>
        </div>

        <div className="cmd-palette-results" role="listbox" aria-label="Kết quả tìm kiếm nhanh">
          {filteredItems.length === 0 ? (
            <div className="cmd-palette-empty">
              <Icon name="compass" size={32} color="var(--secondary)" />
              <p>Không tìm thấy mục nào khớp với từ khóa "{query}".</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`cmd-palette-item ${isSelected ? "cmd-item-active" : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item)}
                >
                  <div className="cmd-item-icon">
                    <Icon name={item.icon} size={18} color="var(--secondary)" />
                  </div>
                  <div className="cmd-item-body">
                    <div className="cmd-item-top">
                      <span className="cmd-item-title">{item.title}</span>
                      <span className="cmd-item-group-tag">{item.group}</span>
                    </div>
                    <span className="cmd-item-sub">{item.subtitle}</span>
                  </div>
                  {item.priceLabel ? (
                    <span className="cmd-item-price">{item.priceLabel}</span>
                  ) : (
                    <Icon name="arrowRight" size={15} color="var(--text-muted)" />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div id="cmd-palette-shortcut-hint" className="cmd-palette-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Di chuyển</span>
          <span><kbd>Enter</kbd> Mở trang</span>
          <span><kbd>Ctrl</kbd> + <kbd>K</kbd> Bật / tắt nhanh</span>
        </div>
      </div>
    </div>
  );
}
