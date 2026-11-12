import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { DichVu, LoaiDichVu, taoDichVuInputSchema } from "../types";
import { Modal } from "../../../components/common/Modal";
import { Button, Input } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import { useToastStore } from "../../../lib/toastStore";
import { SupabaseService } from "../../../lib/supabaseAdapter";

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: DichVu | null;
  onSuccess: () => void;
}

export function ServiceFormModal({
  isOpen,
  onClose,
  service,
  onSuccess,
}: ServiceFormModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const isEditing = Boolean(service);

  const [values, setValues] = useState({
    ten: "",
    loai: "ao-dai" as LoaiDichVu,
    gia: "3000000",
    moTa: "",
    hinhAnh:
      "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (service) {
      setValues({
        ten: service.ten,
        loai: service.loai,
        gia: String(service.gia),
        moTa: service.moTa,
        hinhAnh: service.hinhAnh,
      });
    } else {
      setValues({
        ten: "",
        loai: "ao-dai",
        gia: "3000000",
        moTa: "",
        hinhAnh:
          "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
      });
    }
    setErrors({});
  }, [service, isOpen]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Vui lòng chọn tệp định dạng hình ảnh (JPG, PNG, WEBP)!", "error");
      return;
    }
    setIsUploading(true);
    try {
      const uploadedUrl = await SupabaseService.uploadImageAsset(file, "services");
      setValues((prev) => ({ ...prev, hinhAnh: uploadedUrl }));
      addToast("Đã tải ảnh dịch vụ lên thành công!", "success");
    } catch {
      addToast("Không thể đọc tệp hình ảnh đã chọn", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = taoDichVuInputSchema.safeParse({
      ...values,
      gia: Number(values.gia),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0])
          fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      let ok = false;
      if (isEditing && service) {
        ok = await SupabaseService.updateService(service.id, parsed.data);
      } else {
        ok = await SupabaseService.createService(parsed.data);
      }
      if (!ok) {
        const url = isEditing ? `/api/dich-vu/${service!.id}` : "/api/dich-vu";
        const res = await fetch(url, {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        if (res.ok) ok = true;
      }
      addToast(
        isEditing
          ? "Đã cập nhật dịch vụ thành công!"
          : "Đã tạo dịch vụ mới thành công!",
        "success"
      );
      onSuccess();
      onClose();
    } catch {
      addToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Tên dịch vụ"
          name="ten"
          value={values.ten}
          onChange={handleChange}
          error={errors.ten}
          required
        />
        <div className="input-field-group">
          <label className="input-label" htmlFor="service-category">
            Phân loại dịch vụ
          </label>
          <select
            id="service-category"
            name="loai"
            className="input-control"
            value={values.loai}
            aria-invalid={false}
            aria-describedby="desc-service-category"
            onChange={handleChange}
          >
            <option value="ao-dai">Áo Dài Cổ Phục</option>
            <option value="tho-anh">Nhiếp Ảnh Gia</option>
            <option value="dia-diem">Địa Điểm Di Sản</option>
            <option value="trang-tri">Trang Trí Hoàng Gia</option>
          </select>
          <span id="desc-service-category" className="sr-only">
            Chọn nhóm danh mục của dịch vụ cưới
          </span>
        </div>
        <Input
          label="Đơn giá (VND)"
          name="gia"
          type="number"
          step="500000"
          value={values.gia}
          onChange={handleChange}
          error={errors.gia}
          required
        />
        <div className="input-field-group">
          <label className="input-label" htmlFor="service-desc">
            Mô tả chi tiết
          </label>
          <textarea
            id="service-desc"
            name="moTa"
            className="input-control"
            rows={3}
            value={values.moTa}
            aria-invalid={Boolean(errors.moTa)}
            aria-describedby={errors.moTa ? "err-service-desc" : "desc-service-desc"}
            onChange={handleChange}
            required
          />
          <span id="desc-service-desc" className="sr-only">
            Mô tả chi tiết chất liệu và quyền lợi dịch vụ
          </span>
          {errors.moTa && (
            <p id="err-service-desc" role="alert" className="input-error-msg">
              {errors.moTa}
            </p>
          )}
        </div>

        <Input
          label="URL Hình ảnh hoặc tải tệp từ máy"
          name="hinhAnh"
          value={values.hinhAnh}
          onChange={handleChange}
          error={errors.hinhAnh}
          required
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "8px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "var(--bg-alt)",
            border: "1px dashed var(--border-gold)",
          }}
        >
          {values.hinhAnh && (
            <img
              src={values.hinhAnh}
              alt="Xem trước ảnh dịch vụ"
              style={{
                width: "54px",
                height: "54px",
                objectFit: "cover",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            />
          )}
          <label
            htmlFor="service-file-upload"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "var(--primary)",
            }}
          >
            <Icon name="upload" size={16} />
            <span>
              {isUploading ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy tính"}
            </span>
            <input
              id="service-file-upload"
              name="serviceFile"
              type="file"
              accept="image/*"
              aria-invalid={false}
              aria-describedby="desc-service-upload"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
          <span id="desc-service-upload" className="sr-only">
            Tải tệp ảnh dịch vụ lên Supabase Storage hoặc bộ nhớ cục bộ
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? "Cập Nhật" : "Tạo Mới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
