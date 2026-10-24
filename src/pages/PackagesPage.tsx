import { useSearchParams } from "react-router";
import { useFetch } from "../lib/useFetch";
import { goiCuoiListSchema } from "../features/packages/types";
import { PackageCard } from "../features/packages/components/PackageCard";
import { Button, SkeletonCard } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { assertNever } from "../lib/types";
import "./PackagesPage.css";

/* ==========================================================================
   1. PACKAGES FILTER BAR COMPONENT
   ========================================================================== */
export const STYLES = [
  { id: "all", label: "Tất Cả Phong Cách" },
  { id: "top", label: "⭐ Top Gói Cưới" },
  { id: "cung-dinh", label: "Cung Đình Triều Nguyễn" },
  { id: "hien-dai", label: "Tân Thời Tối Giản" },
  { id: "co-dien", label: "Hoài Niệm Cố Đô" },
];

export const PACKAGE_SORTS = [
  { id: "price-asc", label: "Giá: Thấp đến Cao" },
  { id: "price-desc", label: "Giá: Cao đến Thấp" },
  { id: "name-asc", label: "Tên: A - Z" },
];

interface PackagesFilterBarProps {
  currentStyle: string;
  currentSort: string;
  currentSearch: string;
  totalCount?: number;
  onUpdateParam: (key: string, val: string, defaultVal?: string) => void;
}

export function PackagesFilterBar({
  currentStyle,
  currentSort,
  currentSearch,
  totalCount,
  onUpdateParam,
}: PackagesFilterBarProps) {
  return (
    <div className="filter-toolbar-box">
      <div className="filter-toolbar-categories" role="tablist" aria-label="Phong cách gói cưới">
        {STYLES.map((st) => (
          <button
            key={st.id}
            type="button"
            className={`pill-btn ${currentStyle === st.id ? "pill-btn-active" : ""}`}
            onClick={() => onUpdateParam("phongCach", st.id, "all")}
          >
            {st.label}
          </button>
        ))}
      </div>

      <div className="filter-toolbar-actions">
        <div className="filter-search-field">
          <Icon name="search" size={16} color="var(--secondary)" />
          <input
            type="text"
            placeholder="Tìm theo tên gói cưới, địa điểm di sản..."
            value={currentSearch}
            onChange={(e) => onUpdateParam("search", e.target.value)}
            aria-label="Tìm kiếm gói cưới combo"
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
            Hiển thị <strong>{totalCount}</strong> gói cưới
          </div>
        )}

        <div className="filter-sort-field">
          <label htmlFor="package-sort-select" className="sort-label">Sắp xếp:</label>
          <select
            id="package-sort-select"
            value={currentSort}
            onChange={(e) => onUpdateParam("sort", e.target.value)}
            aria-label="Sắp xếp danh sách gói cưới"
          >
            {PACKAGE_SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. PACKAGES PAGE COMPONENT
   ========================================================================== */
const ITEMS_PER_PAGE = 6;

export function PackagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStyle = searchParams.get("phongCach") || "all";
  const currentSort = searchParams.get("sort") || "price-asc";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const apiUrl = `/api/goi-cuoi?phongCach=${currentStyle}&sort=${currentSort}&search=${encodeURIComponent(currentSearch)}`;
  const { state, refetch } = useFetch(apiUrl, goiCuoiListSchema);

  const updateParam = (key: string, val: string, defaultVal?: string) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === defaultVal) next.delete(key);
    else next.set(key, val);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="packages-page-root">
      <div className="page-header-banner">
        <div className="container">
          <span className="section-tag">BỘ SƯU TẬP HOÀNG GIA</span>
          <h1 className="page-title">Gói Cưới Combo Hoàng Gia Triều Nguyễn</h1>
          <p className="page-subtitle">
            Trọn vẹn hạnh phúc lứa đôi với các gói cưới trọn gói được thiết kế chỉn chu, tiết kiệm từ 15% đến 25% so với đặt dịch vụ lẻ.
          </p>
        </div>
      </div>

      <div className="container packages-main-container">
        <PackagesFilterBar
          currentStyle={currentStyle}
          currentSort={currentSort}
          currentSearch={currentSearch}
          totalCount={state.status === "success" ? state.data.length : undefined}
          onUpdateParam={updateParam}
        />

        {(() => {
          switch (state.status) {
            case "loading":
              return (
                <div className="packages-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              );
            case "error":
              return (
                <div className="error-box">
                  <p>{state.message}</p>
                  <Button variant="secondary" size="sm" onClick={refetch}>
                    Thử lại
                  </Button>
                </div>
              );
            case "success":
              if (state.data.length === 0) {
                return (
                  <div className="empty-box">
                    <Icon name="package" size={40} color="var(--secondary)" />
                    <h3>Chưa có gói cưới phù hợp</h3>
                    <p>Hãy thử chọn lại phong cách khác hoặc từ khóa tìm kiếm.</p>
                  </div>
                );
              }
              const totalPages = Math.ceil(state.data.length / ITEMS_PER_PAGE);
              const pagedItems = state.data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
              return (
                <>
                  <div className="packages-grid">
                    {pagedItems.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="services-pagination" role="navigation" aria-label="Phân trang gói cưới">
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
            default:
              return assertNever(state);
          }
        })()}
      </div>
    </div>
  );
}
