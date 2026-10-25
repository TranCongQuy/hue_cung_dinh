import { useState, useId, FormEvent } from "react";
import { Icon } from "../../../components/common/Icon";
import { ThiepCuoi, ThiepCuoiLoai, DatThiepFormData, datThiepFormSchema } from "../types";
import { useToastStore } from "../../../lib/toastStore";
import { SupabaseService } from "../../../lib/supabaseAdapter";
import { useRoyalCourtAudio } from "./RoyalCourtAudio";
import "./InvitationModals.css";

/* ==========================================================================
   1. INVITATION PREVIEW MODAL COMPONENT
   ========================================================================== */
interface PreviewProps {
  invitation: ThiepCuoi | null;
  onClose: () => void;
  onSelect: (item: ThiepCuoi) => void;
}

export function InvitationPreviewModal({ invitation, onClose, onSelect }: PreviewProps) {
  const { isPlaying: isPlayingAudio, togglePlay: toggleAudio, stop: stopAudio } = useRoyalCourtAudio(0.3);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showGiftQr, setShowGiftQr] = useState(false);

  const handleClose = () => {
    stopAudio();
    onClose();
  };

  if (!invitation) return null;

  return (
    <div
      className="preview-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-invitation-title"
      onClick={handleClose}
    >
      <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="preview-modal-close"
          onClick={handleClose}
          aria-label="Đóng bảng xem trước thiệp"
        >
          <Icon name="close" size={18} />
        </button>

        <div className="preview-phone-chassis">
          <div className="preview-phone-notch">
            <span className="preview-camera-lens" />
          </div>

          <div className="preview-phone-body">
            <button
              type="button"
              className="preview-audio-control"
              onClick={toggleAudio}
              aria-label="Bật hoặc tắt nhạc nền thiệp cưới"
            >
              <Icon name={isPlayingAudio ? "music" : "volumeX"} size={13} color={isPlayingAudio ? "var(--secondary)" : "currentColor"} />
              <span style={{ fontWeight: isPlayingAudio ? 700 : 500 }}>
                {isPlayingAudio ? "Đang tấu Nhã Nhạc..." : "Bật Nhã Nhạc Cung Đình"}
              </span>
            </button>

            {!envelopeOpen ? (
              <div
                className="closed-envelope-stage"
                onClick={() => setEnvelopeOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setEnvelopeOpen(true)}
                aria-label="Chạm để mở thiệp cưới"
              >
                <div className="envelope-top-flap" />
                <div className="envelope-center-seal">
                  <div className="envelope-wax-seal pulse-seal">
                    <Icon name="crown" size={30} color="#D4AF37" />
                  </div>
                  <h3 className="envelope-prompt-text">Chạm để mở thiệp hồng</h3>
                  <p className="envelope-subtext">Hôn lễ hoàng gia • {invitation.chuRe} &amp; {invitation.coDau}</p>
                  <span className="envelope-click-hint">👆 Nhấn để mở phong bì</span>
                </div>
              </div>
            ) : (
              <div className="opened-envelope-stage slide-up-anim">
                <button
                  type="button"
                  className="btn-collapse-envelope"
                  onClick={() => setEnvelopeOpen(false)}
                  title="Thu gọn thiệp vào phong bì"
                >
                  <Icon name="chevronDown" size={14} />
                  <span>Thu gọn thiệp hồng</span>
                </button>

                <div className="opened-hero-photo-wrap" style={{ position: "relative", width: "100%", maxHeight: "380px", overflow: "hidden" }}>
                  <img
                    src={invitation.hinhAnh}
                    alt={invitation.ten}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                <div className="invitation-inner-content">
                  <div className="invitation-royal-emblem">
                    <Icon name="crown" size={32} color="var(--secondary)" />
                  </div>
                  <span className="invitation-header-badge">HÔN LỄ HOÀNG GIA</span>
                  <h2 id="preview-invitation-title" className="invitation-couple-headline">
                    {invitation.chuRe} &amp; {invitation.coDau}
                  </h2>
                  <p className="invitation-intro">
                    Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi
                  </p>

                  <div className="invitation-wedding-detail-box">
                    <div className="detail-row-time">
                      <Icon name="sparkles" size={14} color="var(--primary)" /> {invitation.ngayCuoi}
                    </div>
                    <div className="detail-row-venue">
                      <Icon name="mapPin" size={14} color="var(--secondary)" /> {invitation.diaDiem}
                    </div>
                  </div>

                  <div className="preview-countdown-box">
                    <div className="countdown-cell">
                      <span className="countdown-number">28</span>
                      <span className="countdown-label">Ngày</span>
                    </div>
                    <div className="countdown-cell">
                      <span className="countdown-number">12</span>
                      <span className="countdown-label">Giờ</span>
                    </div>
                    <div className="countdown-cell">
                      <span className="countdown-number">30</span>
                      <span className="countdown-label">Phút</span>
                    </div>
                    <div className="countdown-cell">
                      <span className="countdown-number">45</span>
                      <span className="countdown-label">Giây</span>
                    </div>
                  </div>

                  <div className="invitation-gift-box">
                    <button
                      type="button"
                      className="btn-toggle-gift-qr"
                      onClick={() => setShowGiftQr(!showGiftQr)}
                    >
                      <Icon name="qr" size={16} />
                      <span>{showGiftQr ? "Ẩn Mã Mừng Cưới" : "🎁 Hộp Mừng Cưới Thông Minh (VietQR)"}</span>
                    </button>

                    {showGiftQr && (
                      <div className="invitation-vietqr-preview">
                        <img
                          src={`https://img.vietqr.io/image/MB-0905123456-compact2.png?amount=500000&addInfo=${encodeURIComponent("Mung Cuoi " + invitation.chuRe + " " + invitation.coDau)}`}
                          alt="Mã QR mừng cưới VietQR"
                          className="invitation-vietqr-img"
                        />
                        <div className="invitation-vietqr-meta">
                          <strong>MB Bank • 0905123456</strong>
                          <span>Chủ TK: {invitation.chuRe} &amp; {invitation.coDau}</span>
                          <small>Quét bằng mọi ứng dụng Mobile Banking</small>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-collapse-bottom"
                    onClick={() => setEnvelopeOpen(false)}
                  >
                    Thu gọn thiệp hồng
                  </button>
                </div>

                <div className="preview-actions-footer">
                  <button
                    type="button"
                    className="btn-modal-order-now"
                    onClick={() => {
                      onClose();
                      onSelect(invitation);
                    }}
                  >
                    ✦ Chọn Mẫu Thiệp Này
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. INVITATION ORDER MODAL COMPONENT
   ========================================================================== */
interface OrderProps {
  initialInvitation?: ThiepCuoi | null;
  initialTier?: ThiepCuoiLoai;
  allInvitations: ThiepCuoi[];
  onClose: () => void;
}

export function InvitationOrderModal({
  initialInvitation,
  initialTier = "vip",
  allInvitations,
  onClose,
}: OrderProps) {
  const formId = useId();
  const addToast = useToastStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<DatThiepFormData>({
    tenKhach: "",
    soDienThoai: "",
    tenCoDau: initialInvitation?.coDau || "",
    tenChuRe: initialInvitation?.chuRe || "",
    ngayCuoi: initialInvitation?.ngayCuoi || "",
    diaDiem: initialInvitation?.diaDiem || "",
    mauThiepId: initialInvitation?.id || allInvitations[0]?.id || "tc-01",
    goiDichVu: initialInvitation?.loai || initialTier,
    ghiChu: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const parseResult = datThiepFormSchema.safeParse(formData);
  const errors = !parseResult.success
    ? parseResult.error.flatten().fieldErrors
    : {};

  const handleBlur = (field: keyof DatThiepFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      tenKhach: true,
      soDienThoai: true,
      tenCoDau: true,
      tenChuRe: true,
      ngayCuoi: true,
      diaDiem: true,
      mauThiepId: true,
      goiDichVu: true,
    });

    if (!parseResult.success) {
      addToast("Vui lòng hoàn thiện đúng các thông tin yêu cầu", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const requestPayload = {
        tenKhach: formData.tenKhach,
        soDienThoai: formData.soDienThoai,
        ngayCuoi: formData.ngayCuoi,
        soLuongKhach: 100,
        nganSach:
          formData.goiDichVu === "vip"
            ? 450000
            : formData.goiDichVu === "pro"
            ? 295000
            : 168000,
        goiDeXuatId: formData.mauThiepId,
        ghiChu: `[ĐẶT THIỆP CƯỚI ONLINE - Gói ${formData.goiDichVu.toUpperCase()}]: Mẫu thiệp: ${
          formData.mauThiepId
        }. Cô dâu: ${formData.tenCoDau}, Chú rể: ${
          formData.tenChuRe
        }. Địa điểm: ${formData.diaDiem}. Ghi chú riêng: ${
          formData.ghiChu || "Không"
        }`,
      };

      let ok = await SupabaseService.createRequest(requestPayload);
      if (!ok) {
        const res = await fetch("/api/yeu-cau", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });
        if (res.ok) ok = true;
      }

      if (!ok) throw new Error("Gửi đơn đăng ký thiệp không thành công");
      addToast(
        "Đăng ký mẫu thiệp thành công! Huế Cung Đình sẽ liên hệ demo cho Dâu Rể sớm nhất.",
        "success"
      );
      onClose();
    } catch {
      addToast("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="order-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h3 className="order-modal-title">Khởi Tạo Thiệp Cưới Điện Tử</h3>
          <p className="order-modal-subtitle">Hoàn tất biểu mẫu để Huế Cung Đình tiến hành thiết kế demo thiệp riêng</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="order-modal-form">
          <div className="form-row-duo">
            <div className="order-form-group">
              <label htmlFor={`${formId}-tenKhach`} className="order-form-label">Họ tên quý khách *</label>
              <input id={`${formId}-tenKhach`} className="order-form-input" value={formData.tenKhach} onChange={(e) => setFormData({ ...formData, tenKhach: e.target.value })} onBlur={() => handleBlur("tenKhach")} aria-invalid={Boolean(touched.tenKhach && errors.tenKhach)} placeholder="Nguyễn Văn A" />
              {touched.tenKhach && errors.tenKhach && <p role="alert" className="order-form-error">{errors.tenKhach[0]}</p>}
            </div>

            <div className="order-form-group">
              <label htmlFor={`${formId}-sdt`} className="order-form-label">Số điện thoại / Zalo *</label>
              <input id={`${formId}-sdt`} className="order-form-input" value={formData.soDienThoai} onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })} onBlur={() => handleBlur("soDienThoai")} aria-invalid={Boolean(touched.soDienThoai && errors.soDienThoai)} placeholder="0912345678" />
              {touched.soDienThoai && errors.soDienThoai && <p role="alert" className="order-form-error">{errors.soDienThoai[0]}</p>}
            </div>
          </div>

          <div className="form-row-duo">
            <div className="order-form-group">
              <label htmlFor={`${formId}-chuRe`} className="order-form-label">Tên Chú Rể *</label>
              <input id={`${formId}-chuRe`} className="order-form-input" value={formData.tenChuRe} onChange={(e) => setFormData({ ...formData, tenChuRe: e.target.value })} onBlur={() => handleBlur("tenChuRe")} aria-invalid={Boolean(touched.tenChuRe && errors.tenChuRe)} placeholder="Quốc Bảo" />
              {touched.tenChuRe && errors.tenChuRe && <p role="alert" className="order-form-error">{errors.tenChuRe[0]}</p>}
            </div>

            <div className="order-form-group">
              <label htmlFor={`${formId}-coDau`} className="order-form-label">Tên Cô Dâu *</label>
              <input id={`${formId}-coDau`} className="order-form-input" value={formData.tenCoDau} onChange={(e) => setFormData({ ...formData, tenCoDau: e.target.value })} onBlur={() => handleBlur("tenCoDau")} aria-invalid={Boolean(touched.tenCoDau && errors.tenCoDau)} placeholder="Ngọc Hân" />
              {touched.tenCoDau && errors.tenCoDau && <p role="alert" className="order-form-error">{errors.tenCoDau[0]}</p>}
            </div>
          </div>

          <div className="form-row-duo">
            <div className="order-form-group">
              <label htmlFor={`${formId}-ngayCuoi`} className="order-form-label">Ngày thành hôn *</label>
              <input id={`${formId}-ngayCuoi`} type="date" className="order-form-input" value={formData.ngayCuoi} onChange={(e) => setFormData({ ...formData, ngayCuoi: e.target.value })} onBlur={() => handleBlur("ngayCuoi")} aria-invalid={Boolean(touched.ngayCuoi && errors.ngayCuoi)} />
              {touched.ngayCuoi && errors.ngayCuoi && <p role="alert" className="order-form-error">{errors.ngayCuoi[0]}</p>}
            </div>

            <div className="order-form-group">
              <label htmlFor={`${formId}-goi`} className="order-form-label">Gói dịch vụ đã chọn *</label>
              <select id={`${formId}-goi`} className="order-form-select" value={formData.goiDichVu} onChange={(e) => setFormData({ ...formData, goiDichVu: e.target.value as ThiepCuoiLoai })}>
                <option value="vip">Gói VIP - 450.000 ₫ (Đầy đủ nhất)</option>
                <option value="pro">Gói PRO - 295.000 ₫ (Nâng cao)</option>
                <option value="basic">Gói BASIC - 168.000 ₫ (Tiêu chuẩn)</option>
              </select>
            </div>
          </div>

          <div className="order-form-group">
            <label htmlFor={`${formId}-diaDiem`} className="order-form-label">Địa điểm tổ chức hôn lễ *</label>
            <input id={`${formId}-diaDiem`} className="order-form-input" value={formData.diaDiem} onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })} onBlur={() => handleBlur("diaDiem")} aria-invalid={Boolean(touched.diaDiem && errors.diaDiem)} placeholder="Trung Tâm Tiệc Cưới Hoàng Gia, TP. Huế" />
            {touched.diaDiem && errors.diaDiem && <p role="alert" className="order-form-error">{errors.diaDiem[0]}</p>}
          </div>

          <div className="order-form-group">
            <label htmlFor={`${formId}-mauThiep`} className="order-form-label">Mẫu thiệp cưới lựa chọn *</label>
            <select id={`${formId}-mauThiep`} className="order-form-select" value={formData.mauThiepId} onChange={(e) => setFormData({ ...formData, mauThiepId: e.target.value })}>
              {allInvitations.map((item) => (
                <option key={item.id} value={item.id}>{item.ten} ({item.loai.toUpperCase()})</option>
              ))}
            </select>
          </div>

          <div className="order-form-group">
            <label htmlFor={`${formId}-ghiChu`} className="order-form-label">Ghi chú thêm</label>
            <textarea id={`${formId}-ghiChu`} className="order-form-textarea" rows={2} value={formData.ghiChu} onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })} placeholder="VD: Muốn đổi màu nền sang đỏ mận, bài nhạc nền yêu thích..." />
          </div>

          <div className="order-modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={isSubmitting}>Hủy bỏ</button>
            <button type="submit" className="btn-modal-submit" disabled={isSubmitting}>{isSubmitting ? "Đang gửi đăng ký..." : "Gửi Đăng Ký Thiệp Cưới"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

