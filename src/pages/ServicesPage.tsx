import { useSearchParams } from "react-router";
import { useFetch } from "../lib/useFetch";
import { dichVuListSchema } from "../features/services/types";
import { ServiceCard } from "../features/services/components/ServiceCard";
import { Button, SkeletonCard } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { assertNever } from "../lib/types";
import "./ServicesPage.css";

/* ==========================================================================
   1. SERVICES FILTER BAR COMPONENT
   ========================================================================== */
export const CATEGORIES = [
  { id: "all", label: "Tất Cả Dịch Vụ" },
  { id: "top", label: "⭐ Top Dịch Vụ" },
  { id: "ao-dai", label: "Áo Dài Cổ Phục" },
  { id: "tho-anh", label: "Nhiếp Ảnh Gia" },
  { id: "dia-diem", label: "Địa Điểm Di Sản" },
  { id: "trang-tri", label: "Trang Trí Cung Đình" },
];

export const SORTS = [
  { id: "price-asc", label: "Giá: Thấp đến Cao" },
  { id: "price-desc", label: "Giá: Cao đến Thấp" },
  { id: "name-asc", label: "Tên: A - Z" },
];

interface ServicesFilterBarProps {
  currentLoai: string;
  currentSort: string;
  currentSearch: string;
  totalCount?: number;
  onUpdateParam: (key: string, val: string, defaultVal?: string) => void;
}

export function ServicesFilterBar({
  currentLoai,
  currentSort,
  currentSearch,
  totalCount,
  onUpdateParam,
}: ServicesFilterBarProps) {
  return (
    <div className="filter-toolbar-box">
      <div className="filter-toolbar-categories" role="tablist" aria-label="Danh mục dịch vụ">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`pill-btn ${currentLoai === cat.id ? "pill-btn-active" : ""}`}
            onClick={() => onUpdateParam("loai", cat.id, "all")}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="filter-toolbar-actions">
        <div className="filter-search-field">
          <Icon name="search" size={16} color="var(--secondary)" />
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ, phong cách..."
            value={currentSearch}
            onChange={(e) => onUpdateParam("search", e.target.value)}
            aria-label="Tìm kiếm dịch vụ theo tên"
          />
          {currentSearch && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onUpdateParam("search", "")}
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {typeof totalCount === "number" && (
          <div className="filter-count-badge">
            Hiển thị <strong>{totalCount}</strong> dịch vụ
          </div>
        )}

        <div className="filter-sort-field">
          <label htmlFor="service-sort-select" className="sort-label">Sắp xếp:</label>
          <select
            id="service-sort-select"
            value={currentSort}
            onChange={(e) => onUpdateParam("sort", e.target.value)}
            aria-label="Sắp xếp danh sách dịch vụ"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. SERVICES PAGE COMPONENT
   ========================================================================== */
const ITEMS_PER_PAGE = 6;

export function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLoai = searchParams.get("loai") || "all";
  const currentSort = searchParams.get("sort") || "price-asc";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const apiUrl = `/api/dich-vu?loai=${currentLoai}&sort=${currentSort}&search=${encodeURIComponent(currentSearch)}`;
  const { state, refetch } = useFetch(apiUrl, dichVuListSchema);

  const updateParam = (key: string, val: string, defaultVal?: string) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === defaultVal) next.delete(key);
    else next.set(key, val);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="services-page-root">
      <div className="page-header-banner">
        <div className="container">
          <span className="section-tag">HẠNG MỤC CUNG ĐÌNH</span>
          <h1 className="page-title">Danh Mục Dịch Vụ Lẻ Hoàng Triều</h1>
          <p className="page-subtitle">
            Tự do may đo từng chi tiết ngày trọng đại từ cổ phục Nhật Bình, thợ ảnh đến địa điểm chụp di sản Cố đô.
          </p>
        </div>
      </div>

      <div className="container services-main-container">
        <ServicesFilterBar
          currentLoai={currentLoai}
          currentSort={currentSort}
          currentSearch={currentSearch}
          totalCount={state.status === "success" ? state.data.length : undefined}
          onUpdateParam={updateParam}
        />

        {(() => {
          switch (state.status) {
            case "loading":
              return (
                <div className="services-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              );
            case "error":
              return (
                <div className="error-box">
                  <p>{state.message}</p>
                  <Button variant="secondary" size="sm" onClick={refetch}>Thử lại</Button>
                </div>
              );
            case "success": {
              if (state.data.length === 0) {
                return (
                  <div className="empty-box">
                    <Icon name="alert" size={40} color="var(--secondary)" />
                    <h3>Không tìm thấy dịch vụ phù hợp</h3>
                    <p>Hãy thử đổi danh mục hoặc từ khóa tìm kiếm khác.</p>
                  </div>
                );
              }
              const totalPages = Math.ceil(state.data.length / ITEMS_PER_PAGE);
              const pagedItems = state.data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
              return (
                <>
                  <div className="services-grid">
                    {pagedItems.map((item) => (
                      <ServiceCard key={item.id} service={item} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="services-pagination" role="navigation" aria-label="Phân trang dịch vụ">
                      <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => updateParam("page", String(currentPage - 1), "1")}
                        aria-label="Trang trước"
                      >&lt;</button>
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx + 1}
                          className={`page-btn ${currentPage === idx + 1 ? "page-btn-active" : ""}`}
                          onClick={() => updateParam("page", String(idx + 1), "1")}
                          aria-current={currentPage === idx + 1 ? "page" : undefined}
                        >{idx + 1}</button>
                      ))}
                      <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => updateParam("page", String(currentPage + 1), "1")}
                        aria-label="Trang sau"
                      >&gt;</button>
                    </div>
                  )}
                </>
              );
            }
            default:
              return assertNever(state);
          }
        })()}
      </div>
    </div>
  );
}
