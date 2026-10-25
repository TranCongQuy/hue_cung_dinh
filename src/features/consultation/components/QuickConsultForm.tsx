import { useState, FormEvent } from "react";
import { Button, Input } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import { useToastStore } from "../../../lib/toastStore";
import { SupabaseService } from "../../../lib/supabaseAdapter";
import { GoiCuoi } from "../../packages/types";
import { DichVu } from "../../services/types";
import { formatCurrency, getCategoryLabel } from "../../../lib/formatters";
import "./ConsultationWidgets.css";

interface QuickConsultFormProps {
  initialGoiId?: string;
  pkg?: GoiCuoi;
  includedServices?: DichVu[];
  onSuccess?: () => void;
}

export function QuickConsultForm({
  initialGoiId,
  pkg,
  includedServices = [],
  onSuccess,
}: QuickConsultFormProps = {}) {
  const addToast = useToastStore((s) => s.addToast);

  const [tenKhach, setTenKhach] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [ngayCuoi, setNgayCuoi] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  // Quản lý danh sách các hạng mục được chọn trong Combo
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    includedServices.map((s) => s.id)
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kiểm tra xem khách có bỏ bớt hạng mục nào trong Combo không
  const isCustomized =
    includedServices.length > 0 &&
    selectedServiceIds.length < includedServices.length;

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!tenKhach.trim() || tenKhach.trim().length < 2) {
      errs.tenKhach = "Họ và tên quý khách phải từ 2 ký tự";
    }
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(soDienThoai.trim())) {
      errs.soDienThoai = "Số điện thoại không đúng định dạng (10 chữ số)";
    }
    if (!ngayCuoi) {
      errs.ngayCuoi = "Vui lòng chọn ngày chụp dự kiến";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const activeIncludedNames = includedServices
        .filter((s) => selectedServiceIds.includes(s.id))
        .map((s) => s.ten);

      const noteText = isCustomized
        ? `[Tùy biến combo: Bỏ ${includedServices.length - selectedServiceIds.length} mục. Các mục giữ lại: ${activeIncludedNames.join(", ")}]. ${ghiChu}`
        : ghiChu || "Yêu cầu báo giá giữ nguyên toàn bộ hạng mục combo";

      const selectedServicesList = includedServices
        .filter((s) => selectedServiceIds.includes(s.id))
        .map((s) => ({
          id: s.id,
          ten: s.ten,
          gia: s.gia,
          soLuong: 1,
        }));

      await SupabaseService.createRequest({
        tenKhach: tenKhach.trim(),
        soDienThoai: soDienThoai.trim(),
        ngayCuoi,
        tenDon: pkg?.ten || "Gói Cưới Combo Hoàng Gia",
        danhSachDichVu: selectedServicesList,
        nganSach: isCustomized ? undefined : pkg?.giaTronGoi,
        goiDeXuatId: pkg?.id || initialGoiId,
        ghiChu: noteText,
        diaDiemChup: "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
      });

      // Bật flash message 5 giây trang trọng
      addToast(
        "Cảm ơn quý khách! Studio Huế Cung Đình đã tiếp nhận thông tin yêu cầu. Chuyên viên tư vấn sẽ liên hệ với quý khách trong thời gian sớm nhất có thể.",
        "success",
        5000
      );

      setTenKhach("");
      setSoDienThoai("");
      setNgayCuoi("");
      setGhiChu("");
      setErrors({});

      if (onSuccess) onSuccess();
    } catch {
      addToast("Không thể gửi yêu cầu, vui lòng thử lại.", "error", 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="quick-consult-form" onSubmit={handleSubmit} noValidate>
      <div className="quick-form-header">
        <span className="section-tag" style={{ margin: "0 auto 6px" }}>BÁO GIÁ NHANH</span>
        <h3 className="quick-form-title">
          {pkg ? `Tư Vấn & Báo Giá: ${pkg.ten}` : "Đăng Ký Tư Vấn Hoàng Triều"}
        </h3>
        <p className="quick-form-desc">
          {isCustomized
            ? "Quý khách đã tùy chỉnh bớt hạng mục. Studio sẽ liên hệ thương lượng mức giá ưu đãi tốt nhất theo đúng nhu cầu thực tế."
            : "Để lại thông tin để nhận bảng dự toán cưới và ưu đãi thử trang phục Nhật Bình miễn phí."}
        </p>
      </div>

      {/* Hiển thị danh mục hạng mục trong Combo cho phép khách xóa bớt */}
      {includedServices.length > 0 && (
        <div className="combo-services-selection-wrap">
          <div className="combo-selection-header">
            <span className="selection-label">Các hạng mục bao gồm trong gói (Tích để chọn / Bỏ tích nếu không cần):</span>
            <span className={`combo-status-chip ${isCustomized ? "chip-customized" : "chip-fixed"}`}>
              {isCustomized ? "⚖️ Thương lượng giá theo nhu cầu" : `✨ Trọn gói: ${formatCurrency(pkg?.giaTronGoi || 0)}`}
            </span>
          </div>

          <div className="combo-items-checklist">
            {includedServices.map((svc) => {
              const isChecked = selectedServiceIds.includes(svc.id);
              return (
                <div
                  key={svc.id}
                  className={`checklist-item ${isChecked ? "item-active" : "item-removed"}`}
                  onClick={() => toggleService(svc.id)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                >
                  <div className="item-left-block">
                    <div className="item-check-icon">
                      <Icon name={isChecked ? "check" : "close"} size={14} />
                    </div>
                    <div className="item-details">
                      <strong className="item-name">{svc.ten}</strong>
                      <span className="item-category">{getCategoryLabel(svc.loai)}</span>
                    </div>
                  </div>
                  <div className="item-price-block">
                    <span className="item-price">{formatCurrency(svc.gia)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="quick-form-grid" style={{ marginTop: "18px" }}>
        <Input
          label="Họ và tên của bạn"
          name="tenKhach"
          placeholder="Ví dụ: Nguyễn Minh Thư"
          value={tenKhach}
          onChange={(e) => setTenKhach(e.target.value)}
          error={errors.tenKhach}
          required
        />
        <Input
          label="Số điện thoại liên hệ (Zalo)"
          name="soDienThoai"
          placeholder="Ví dụ: 0912345678"
          value={soDienThoai}
          onChange={(e) => setSoDienThoai(e.target.value)}
          error={errors.soDienThoai}
          required
        />
        <Input
          label="Ngày dự kiến chụp ảnh"
          name="ngayCuoi"
          type="date"
          value={ngayCuoi}
          onChange={(e) => setNgayCuoi(e.target.value)}
          error={errors.ngayCuoi}
          required
        />
        <Input
          label="Ghi chú thêm (mong muốn riêng)"
          name="ghiChu"
          placeholder="Ví dụ: Muốn chụp thêm hoàng hôn sông Hương, size áo..."
          value={ghiChu}
          onChange={(e) => setGhiChu(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="quick-form-submit-btn"
        leftIcon={<Icon name={isCustomized ? "edit" : "sparkles"} size={18} />}
      >
        {isCustomized ? "Gửi Yêu Cầu Thương Lượng Giá Theo Nhu Cầu" : "Gửi Yêu Cầu Nhận Báo Giá Nhanh"}
      </Button>
    </form>
  );
}
