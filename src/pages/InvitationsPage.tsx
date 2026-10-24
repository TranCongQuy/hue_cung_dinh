import { useState, useMemo } from "react";
import { useFetch } from "../lib/useFetch";
import { thiepCuoiListSchema, ThiepCuoi, ThiepCuoiLoai } from "../features/invitations/types";
import { InvitationCard } from "../features/invitations/components/InvitationCard";
import {
  InvitationStepsSection,
  InvitationPricingSection,
} from "../features/invitations/components/InvitationSections";
import {
  InvitationPreviewModal,
  InvitationOrderModal,
} from "../features/invitations/components/InvitationModals";
import { Skeleton } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import "./InvitationsPage.css";

const TIER_FILTERS = [
  { value: "all", label: "Tất Cả Mẫu Thiệp" },
  { value: "vip", label: "Giao Diện VIP" },
  { value: "pro", label: "Giao Diện PRO" },
  { value: "basic", label: "Giao Diện Tiêu Chuẩn" },
];

interface FilterBarProps {
  selectedLoai: string;
  onSelectLoai: (loai: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function InvitationFilterBar({
  selectedLoai,
  onSelectLoai,
  searchTerm,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="invitation-filter-bar" role="search" aria-label="Bộ lọc mẫu thiệp cưới">
      <div className="filter-pills-group">
        {TIER_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`filter-pill-btn ${selectedLoai === f.value ? "filter-pill-active" : ""}`}
            onClick={() => onSelectLoai(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="filter-search-box">
        <Icon name="search" size={16} color="var(--text-muted)" />
        <input
          type="search"
          className="filter-search-input"
          placeholder="Tìm tên mẫu thiệp..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm kiếm mẫu thiệp theo tên"
        />
      </div>
    </div>
  );
}

export function InvitationsPage() {
  const { state } = useFetch<ThiepCuoi[]>(
    "/api/thiep-cuoi",
    thiepCuoiListSchema,
  );

  const [selectedLoai, setSelectedLoai] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewItem, setPreviewItem] = useState<ThiepCuoi | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedForOrder, setSelectedForOrder] = useState<ThiepCuoi | null>(null);
  const [selectedTier, setSelectedTier] = useState<ThiepCuoiLoai>("vip");

  const rawList = state.status === "success" ? state.data : [];

  const filteredList = useMemo(() => {
    return rawList.filter((item) => {
      const matchLoai = selectedLoai === "all" || item.loai === selectedLoai;
      const matchSearch =
        item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.moTa.toLowerCase().includes(searchTerm.toLowerCase());
      return matchLoai && matchSearch;
    });
  }, [rawList, selectedLoai, searchTerm]);

  const handleSelectTierFromPricing = (tier: ThiepCuoiLoai) => {
    setSelectedTier(tier);
    setSelectedLoai(tier);
    const targetItem = rawList.find((i) => i.loai === tier) || null;
    setSelectedForOrder(targetItem);
    setOrderModalOpen(true);
  };

  const handleChooseInvitation = (item: ThiepCuoi) => {
    setSelectedForOrder(item);
    setSelectedTier(item.loai);
    const pricingElem = document.getElementById("bang-gia-thiep");
    if (pricingElem) {
      pricingElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="invitations-page-root">
      <header className="invitations-hero invitations-hero-banner">
        <div className="container">
          <span className="section-badge invitations-badge">HÔN LỄ HOÀNG GIA HUẾ</span>
          <h1 className="invitations-hero-title invitations-title">Kho Giao Diện Các Mẫu Thiệp Cưới Cung Đình</h1>
          <div className="title-gold-divider">
            <span className="title-gold-divider-diamond" />
          </div>
          <p className="invitations-hero-subtitle invitations-desc">
            Trải nghiệm mời cưới công nghệ đỉnh cao chuẩn hoàng gia, tích hợp nhạc cung đình, bản đồ thông minh và xác nhận tham dự tiện ích.
          </p>
        </div>
      </header>

      <div className="container">
        <InvitationFilterBar
          selectedLoai={selectedLoai}
          onSelectLoai={setSelectedLoai}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {state.status === "loading" && (
          <div className="invitations-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="invitation-skeleton-item">
                <Skeleton height="320px" borderRadius="16px" />
              </div>
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="invitations-error-banner" role="alert">
            <p>{state.message}</p>
          </div>
        )}

        {state.status === "success" && (
          <>
            {filteredList.length === 0 ? (
              <div className="invitations-empty">
                <Icon name="search" size={40} color="var(--secondary)" />
                <h3 className="invitations-empty-title">Không Tìm Thấy Mẫu Thiệp</h3>
                <p className="invitations-empty-desc">Không có mẫu thiệp nào phù hợp với từ khóa hoặc phân loại đã chọn.</p>
              </div>
            ) : (
              <div className="invitations-grid">
                {filteredList.map((item) => (
                  <InvitationCard
                    key={item.id}
                    invitation={item}
                    onPreview={setPreviewItem}
                    onSelect={handleChooseInvitation}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <InvitationPricingSection
        selectedTier={selectedTier}
        onSelectTier={handleSelectTierFromPricing}
      />

      <InvitationStepsSection />

      <InvitationPreviewModal
        invitation={previewItem}
        onClose={() => setPreviewItem(null)}
        onSelect={handleChooseInvitation}
      />

      {orderModalOpen && (
        <InvitationOrderModal
          initialInvitation={selectedForOrder}
          initialTier={selectedTier}
          allInvitations={rawList}
          onClose={() => setOrderModalOpen(false)}
        />
      )}
    </div>
  );
}
