import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { GoiCuoi, PhongCachGoiCuoi, taoGoiCuoiInputSchema } from "../types";
import { DichVu } from "../../services/types";
import { Modal } from "../../../components/common/Modal";
import { Button, Input } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import { formatCurrency } from "../../../lib/formatters";
import { useToastStore } from "../../../lib/toastStore";
import { SupabaseService } from "../../../lib/supabaseAdapter";
import "./PackageCard.css";

interface SelectorProps {
  allServices: DichVu[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  error?: string;
}

export function PackageServiceSelector({
  allServices,
  selectedIds,
  onToggle,
  error,
}: SelectorProps) {
  const selectedTotalOriginal = allServices
    .filter((s) => selectedIds.includes(s.id))
    .reduce((sum, s) => sum + s.gia, 0);

  return (
    <div className="input-field-group">
      <label className="input-label">
        Chọn các dịch vụ thành phần ({selectedIds.length} dịch vụ)
      </label>
      <div className="service-checkbox-grid">
        {allServices.map((svc) => {
          const isChecked = selectedIds.includes(svc.id);
          return (
            <label
              key={svc.id}
              className={`checkbox-item ${
                isChecked ? "checkbox-item-checked" : ""
              }`}
            >
              <input
                id={`pkg-svc-${svc.id}`}
                name={`pkg-svc-${svc.id}`}
                type="checkbox"
                checked={isChecked}
                aria-invalid={false}
                aria-describedby={`pkg-svc-lbl-${svc.id}`}
                onChange={() => onToggle(svc.id)}
              />
              <span id={`pkg-svc-lbl-${svc.id}`} className="checkbox-name">
                {svc.ten}
              </span>
              <span className="checkbox-price">+{formatCurrency(svc.gia)}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="input-error-msg">
          {error}
        </p>
      )}
      <div className="original-sum-hint">
        <span>
          Tổng giá trị gốc: <strong>{formatCurrency(selectedTotalOriginal)}</strong>
        </span>
      </div>
    </div>
  );
}

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg?: GoiCuoi | null;
  allServices: DichVu[];
  onSuccess: () => void;
}

export function PackageFormModal({
  isOpen,
  onClose,
  pkg,
  allServices,
  onSuccess,
}: PackageFormModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const isEditing = Boolean(pkg);

  const [values, setValues] = useState({
    ten: "",
    moTa: "",
    giaTronGoi: "20000000",
    phongCach: "cung-dinh" as PhongCachGoiCuoi,
    hinhAnh:
      "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
    danhSachDichVuIds: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (pkg) {
      setValues({
        ten: pkg.ten,
        moTa: pkg.moTa,
        giaTronGoi: String(pkg.giaTronGoi),
        phongCach: pkg.phongCach,
        hinhAnh: pkg.hinhAnh,
        danhSachDichVuIds: pkg.danhSachDichVuIds,
      });
    } else {
      setValues({
        ten: "",
        moTa: "",
        giaTronGoi: "20000000",
        phongCach: "cung-dinh",
        hinhAnh:
          "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
        danhSachDichVuIds: allServices.slice(0, 3).map((s) => s.id),
      });
    }
    setErrors({});
  }, [pkg, isOpen, allServices]);

  const toggleService = (id: string) => {
    setValues((prev) => {
      const exists = prev.danhSachDichVuIds.includes(id);
      return {
        ...prev,
        danhSachDichVuIds: exists
          ? prev.danhSachDichVuIds.filter((item) => item !== id)
          : [...prev.danhSachDichVuIds, id],
      };
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Vui lòng chọn tệp hình ảnh hợp lệ!", "error");
      return;
    }
    setIsUploading(true);
    try {
      const uploadedUrl = await SupabaseService.uploadImageAsset(
        file,
        "packages"
      );
      setValues((prev) => ({ ...prev, hinhAnh: uploadedUrl }));
      addToast("Đã tải ảnh đại diện gói cưới lên thành công!", "success");
    } catch {
      addToast("Lỗi khi đọc tệp hình ảnh", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = taoGoiCuoiInputSchema.safeParse({
      ...values,
      giaTronGoi: Number(values.giaTronGoi),
    });

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) newErrors[String(field)] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      let ok = false;
      if (isEditing && pkg) {
        ok = await SupabaseService.updatePackage(pkg.id, parsed.data);
      } else {
        ok = await SupabaseService.createPackage(parsed.data);
      }

      if (!ok) {
        const url = isEditing ? `/api/goi-cuoi/${pkg?.id}` : "/api/goi-cuoi";
        const method = isEditing ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        if (res.ok) ok = true;
      }

      addToast(
        isEditing
          ? "Cập nhật gói cưới thành công!"
          : "Tạo gói cưới mới thành công!",
        "success"
      );
      onSuccess();
      onClose();
    } catch {
      addToast("Lỗi khi lưu gói cưới", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing ? "Cập Nhật Gói Cưới Hoàng Gia" : "Thêm Gói Cưới Combo Mới"
      }
    >
      <form onSubmit={handleSubmit} noValidate className="admin-form-modal">
        <Input
          name="ten"
          label="Tên gói cưới"
          placeholder="VD: Gói Cung Đình Khang Ninh"
          value={values.ten}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValues({ ...values, ten: e.target.value })
          }
          error={errors.ten}
          required
        />

        <div className="form-row-2">
          <Input
            name="giaTronGoi"
            label="Giá trọn gói (VNĐ)"
            type="number"
            value={values.giaTronGoi}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValues({ ...values, giaTronGoi: e.target.value })
            }
            error={errors.giaTronGoi}
            required
          />

          <div className="input-field-group">
            <label className="input-label" htmlFor="phong-cach-select">
              Phong cách gói
            </label>
            <select
              id="phong-cach-select"
              name="phongCach"
              className="input-control"
              value={values.phongCach}
              aria-invalid={false}
              aria-describedby="desc-phong-cach"
              onChange={(e) =>
                setValues({
                  ...values,
                  phongCach: e.target.value as PhongCachGoiCuoi,
                })
              }
            >
              <option value="cung-dinh">Cung Đình Triều Nguyễn</option>
              <option value="hien-dai">Tân Thời Tối Giản</option>
              <option value="co-dien">Hoài Niệm Cố Đô</option>
            </select>
            <span id="desc-phong-cach" className="sr-only">
              Chọn phong cách chủ đạo của gói cưới
            </span>
          </div>
        </div>

        <Input
          name="hinhAnh"
          label="URL Hình ảnh đại diện hoặc tải từ máy"
          value={values.hinhAnh}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValues({ ...values, hinhAnh: e.target.value })
          }
          error={errors.hinhAnh}
          required
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "var(--bg-alt)",
            border: "1px dashed var(--border-gold)",
          }}
        >
          {values.hinhAnh && (
            <img
              src={values.hinhAnh}
              alt="Ảnh gói cưới"
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
            htmlFor="package-file-upload"
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
              {isUploading ? "Đang tải ảnh lên..." : "Tải ảnh đại diện từ máy"}
            </span>
            <input
              id="package-file-upload"
              name="packageFile"
              type="file"
              accept="image/*"
              aria-invalid={false}
              aria-describedby="desc-pkg-upload"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
          <span id="desc-pkg-upload" className="sr-only">
            Tải ảnh đại diện gói cưới từ máy tính
          </span>
        </div>

        <div className="input-field-group">
          <label className="input-label" htmlFor="mo-ta-goi">
            Mô tả gói cưới
          </label>
          <textarea
            id="mo-ta-goi"
            name="moTa"
            className="input-control"
            rows={3}
            value={values.moTa}
            aria-invalid={Boolean(errors.moTa)}
            aria-describedby={errors.moTa ? "err-mo-ta-goi" : "desc-mo-ta-goi"}
            onChange={(e) => setValues({ ...values, moTa: e.target.value })}
          />
          <span id="desc-mo-ta-goi" className="sr-only">
            Mô tả quyền lợi trọn gói
          </span>
          {errors.moTa && (
            <p id="err-mo-ta-goi" role="alert" className="input-error-msg">
              {errors.moTa}
            </p>
          )}
        </div>

        <PackageServiceSelector
          allServices={allServices}
          selectedIds={values.danhSachDichVuIds}
          onToggle={toggleService}
          error={errors.danhSachDichVuIds}
        />

        <div className="form-modal-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? "Lưu thay đổi" : "Tạo gói cưới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
