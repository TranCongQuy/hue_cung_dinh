import { Icon } from "../../../components/common/Icon";
import { ThiepCuoi } from "../types";
import "./InvitationCard.css";

interface InvitationCardProps {
  invitation: ThiepCuoi;
  onPreview: (item: ThiepCuoi) => void;
  onSelect: (item: ThiepCuoi) => void;
}

export function InvitationCard({ invitation, onPreview, onSelect }: InvitationCardProps) {
  const isVip = invitation.loai === "vip";
  const isPro = invitation.loai === "pro";

  const badgeConfig = isVip
    ? { text: "Giao diện VIP", className: "badge-vip", iconName: "crown" as const }
    : isPro
    ? { text: "Giao diện PRO", className: "badge-pro", iconName: "sparkles" as const }
    : { text: "Giao diện Tiêu Chuẩn", className: "badge-basic", iconName: "smartphone" as const };

  return (
    <article
      className={`invitation-card ${isVip ? "invitation-card-vip" : ""}`}
      aria-label={`Mẫu thiệp ${invitation.ten}`}
    >
      {/* Khung mô phỏng điện thoại di động */}
      <div className="phone-mockup-frame">
        <div className="phone-screen">
          <img
            src={invitation.hinhAnh}
            alt={invitation.ten}
            className="phone-screen-img"
            loading="lazy"
          />

          <div className="phone-screen-overlay">
            <div className="phone-screen-header">
              <span className="phone-status-dot" aria-hidden="true" />
              {invitation.amNhac && (
                <span className="phone-screen-audio-badge">
                  <Icon name="music" size={12} color="#f7d08a" />
                  <span>Âm nhạc</span>
                </span>
              )}
            </div>

            <div className="phone-screen-caption">
              <p className="phone-save-the-date">Save The Date</p>
              <h4 className="phone-couple-names">
                {invitation.chuRe} &amp; {invitation.coDau}
              </h4>
              <p className="phone-wedding-date">{invitation.ngayCuoi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Huy hiệu phân loại gói thiệp */}
      <div className="invitation-badge-container">
        <span className={`invitation-type-badge ${badgeConfig.className}`}>
          <Icon name={badgeConfig.iconName} size={14} />
          {badgeConfig.text}
        </span>
      </div>

      {/* Thông tin mô tả và nút tương tác */}
      <div className="invitation-card-body">
        <h3 className="invitation-card-title">{invitation.ten}</h3>
        <p className="invitation-card-desc">{invitation.moTa}</p>

        <div className="invitation-card-actions">
          <button
            type="button"
            className="btn-preview-invitation"
            onClick={() => onPreview(invitation)}
            aria-label={`Xem trước mẫu thiệp ${invitation.ten}`}
          >
            <Icon name="eye" size={16} />
            <span>Xem thiệp</span>
          </button>

          <button
            type="button"
            className="btn-select-invitation"
            onClick={() => onSelect(invitation)}
            aria-label={`Chọn mẫu thiệp ${invitation.ten}`}
          >
            <Icon name="check" size={16} />
            <span>Chọn thiệp</span>
          </button>
        </div>
      </div>
    </article>
  );
}

