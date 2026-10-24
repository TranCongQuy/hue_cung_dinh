import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { DichVu, LoaiDichVu } from "../types";
import { taoDichVuInputSchema } from "../types";
import { Modal } from "../../../components/common/Modal";
import { Button } from "../../../components/common/UI";
import { Input } from "../../../components/common/UI";
import { useToastStore } from "../../../lib/toastStore";

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: DichVu | null;
  onSuccess: () => void;
}

export function ServiceFormModal({ isOpen, onClose, service, onSuccess }: ServiceFormModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const isEditing = Boolean(service);

  const [values, setValues] = useState({
    ten: "",
    loai: "ao-dai" as LoaiDichVu,
    gia: "3000000",
    moTa: "",
    hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setValues({ ten: service.ten, loai: service.loai, gia: String(service.gia), moTa: service.moTa, hinhAnh: service.hinhAnh });
    } else {
      setValues({ ten: "", loai: "ao-dai", gia: "3000000", moTa: "", hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80" });
    }
    setErrors({});
  }, [service, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = taoDichVuInputSchema.safeParse({ ...values, gia: Number(values.gia) });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/dich-vu/${service!.id}` : "/api/dich-vu";
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Thao tác thất bại");
      addToast(isEditing ? "Đã cập nhật dịch vụ thành công!" : "Đã tạo dịch vụ mới thành công!", "success");
      onSuccess();
      onClose();
    } catch {
      addToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}>
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Tên dịch vụ" name="ten" value={values.ten} onChange={handleChange} error={errors.ten} required />
        <div className="input-field-group">
          <label className="input-label" htmlFor="service-category">Phân loại dịch vụ</label>
          <select id="service-category" name="loai" className="input-control" value={values.loai} onChange={handleChange}>
            <option value="ao-dai">Áo Dài Cổ Phục</option>
            <option value="tho-anh">Nhiếp Ảnh Gia</option>
            <option value="dia-diem">Địa Điểm Di Sản</option>
            <option value="trang-tri">Trang Trí Hoàng Gia</option>
          </select>
        </div>
        <Input label="Đơn giá (VND)" name="gia" type="number" step="500000" value={values.gia} onChange={handleChange} error={errors.gia} required />
        <div className="input-field-group">
          <label className="input-label" htmlFor="service-desc">Mô tả chi tiết</label>
          <textarea id="service-desc" name="moTa" className="input-control" rows={3} value={values.moTa} onChange={handleChange} required />
          {errors.moTa && <p role="alert" className="input-error-msg">{errors.moTa}</p>}
        </div>
        <Input label="URL Hình ảnh (Unsplash)" name="hinhAnh" value={values.hinhAnh} onChange={handleChange} error={errors.hinhAnh} required />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>{isEditing ? "Cập Nhật" : "Tạo Mới"}</Button>
        </div>
      </form>
    </Modal>
  );
}
