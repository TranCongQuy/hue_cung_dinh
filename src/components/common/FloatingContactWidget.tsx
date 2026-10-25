import { useState, FormEvent } from "react";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { Button, Input } from "./UI";
import { useToastStore } from "../../lib/toastStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import "./FloatingContactWidget.css";

interface FloatingContactWidgetProps {
  pageType: "thiep-cuoi" | "dich-vu" | "goi-cuoi" | "ai-tu-van";
}

const WIDGET_CONFIGS = {
  "thiep-cuoi": {
    badge: "Thiết Kế Riêng",
    shortTitle: "Thiết Kế Thiệp Độc Bản",
    bubbleText: "Bạn muốn thiết kế thiệp cưới mang dấu ấn riêng?",
    modalTitle: "Tư Vấn Thiết Kế Thiệp Cưới Độc Bản",
    modalDesc: "Để lại số điện thoại, nghệ nhân Huế Cung Đình sẽ liên hệ trao đổi ý tưởng và may đo thiệp riêng cho bạn.",
  },
  "dich-vu": {
    badge: "May Đo Cổ Phục",
    shortTitle: "Tư Vấn May Đo Riêng",
    bubbleText: "Cần may đo cổ phục theo số đo riêng của bạn?",
    modalTitle: "Tư Vấn Phục Trang Cổ Phong Theo Số Đo",
    modalDesc: "Nghệ nhân may đo hoàng gia hỗ trợ thử áo tận nơi và điều chỉnh theo vóc dáng của bạn.",
  },
  "goi-cuoi": {
    badge: "Tùy Biến Gói",
    shortTitle: "Tư Vấn Gói Cưới Riêng",
    bubbleText: "Muốn may đo gói cưới riêng theo ngân sách?",
    modalTitle: "Tư Vấn Hoạch Định Gói Cưới Hoàng Gia",
    modalDesc: "Lên kế hoạch bộ ảnh cưới cố đô tối ưu chi phí và chọn địa điểm di sản ưng ý nhất.",
  },
  "ai-tu-van": {
    badge: "Chuyên Viên 1-1",
    shortTitle: "Tư Vấn Trực Tiếp 1-1",
    bubbleText: "Cần cố vấn trực tiếp cùng chuyên gia?",
    modalTitle: "Kết Nối Cố Vấn Hôn Lễ Hoàng Triều",
    modalDesc: "Đội ngũ chuyên gia văn hóa Huế đồng hành giải đáp mọi lễ nghi và phục trang cổ truyền.",
  },
};

export function FloatingContactWidget({ pageType }: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wish, setWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToast = useToastStore((s) => s.addToast);
  const config = WIDGET_CONFIGS[pageType] || WIDGET_CONFIGS["thiep-cuoi"];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      addToast("Vui lòng điền họ tên và số điện thoại liên hệ!", "warning", 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      await SupabaseService.createRequest({
        tenKhach: name.trim(),
        soDienThoai: phone.trim(),
        ngayCuoi: new Date().toISOString().split("T")[0] || "2026-12-25",
        tenDon: config.modalTitle,
        ghiChu: `[Yêu cầu tư vấn riêng từ Widget góc màn hình]: ${wish || "Khách cần tư vấn nhanh"}`,
      });

      addToast(
        "Cảm ơn quý khách! Chuyên viên Huế Cung Đình sẽ liên hệ với quý khách trong thời gian sớm nhất có thể.",
        "success",
        5000
      );
      setName("");
      setPhone("");
      setWish("");
      setIsOpen(false);
    } catch {
      addToast("Không thể gửi thông tin lúc này. Vui lòng thử lại sau.", "error", 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="floating-royal-widget" aria-label="Hộp thoại kết nối tư vấn">
        <div className="widget-bubble-hint" onClick={() => setIsOpen(true)}>
          <span className="bubble-text">{config.bubbleText}</span>
          <span className="bubble-cta">Liên hệ ngay ➔</span>
        </div>

        <button
          type="button"
          className="widget-royal-btn"
          onClick={() => setIsOpen(true)}
          title={config.modalTitle}
          aria-expanded={isOpen}
        >
          <div className="widget-btn-glow" />
          <Icon name="sparkles" size={20} color="#ffd700" />
          <span className="widget-btn-text">{config.shortTitle}</span>
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={config.modalTitle}>
        <form className="widget-contact-modal-form" onSubmit={handleSubmit}>
          <div className="modal-header-ornament">
            <Icon name="crown" size={28} color="var(--secondary)" />
            <p className="modal-desc-sub">{config.modalDesc}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "16px" }}>
            <Input
              label="Họ và tên của quý khách *"
              name="name"
              placeholder="Ví dụ: Nguyễn Văn Hoàng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Số điện thoại Zalo liên hệ *"
              name="phone"
              placeholder="Ví dụ: 0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="widget-input-group">
              <label className="widget-label">Mong muốn / Ý tưởng riêng của bạn:</label>
              <textarea
                className="widget-textarea"
                rows={3}
                placeholder="Chia sẻ mong muốn về mẫu thiệp, phong cách ảnh, hoa văn cổ phục..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Icon name="sparkles" size={18} />}
              style={{ marginTop: "8px" }}
            >
              Gửi Yêu Cầu Kết Nối Ngay
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

