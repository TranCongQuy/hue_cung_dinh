import { useState, FormEvent, ChangeEvent, FocusEvent } from "react";
import { taoYeuCauInputSchema } from "../../requests/types";
import { Button, Input } from "../../../components/common/UI";
import { useToastStore } from "../../../lib/toastStore";
import { isSupabaseConfigured } from "../../../lib/supabase";
import { SupabaseService } from "../../../lib/supabaseAdapter";
import "./ConsultationWidgets.css";

interface FormValues {
  tenKhach: string;
  soDienThoai: string;
  ngayCuoi: string;
  nganSach: string;
}

interface QuickConsultFormProps {
  initialGoiId?: string;
  initialBudget?: number;
  onSuccess?: () => void;
}

export function QuickConsultForm({
  initialGoiId,
  initialBudget,
  onSuccess,
}: QuickConsultFormProps = {}) {
  const addToast = useToastStore((s) => s.addToast);
  const [values, setValues] = useState<FormValues>({
    tenKhach: "",
    soDienThoai: "",
    ngayCuoi: "",
    nganSach: initialBudget ? String(initialBudget) : "25000000",
  });
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    tenKhach: false,
    soDienThoai: false,
    ngayCuoi: false,
    nganSach: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (formValues: FormValues) => {
    const parsed = taoYeuCauInputSchema.safeParse({
      ...formValues,
      soLuongKhach: 100,
      goiDeXuatId: initialGoiId,
    });
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const newErrors: Partial<Record<keyof FormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FormValues;
      if (field && !newErrors[field]) newErrors[field] = issue.message;
    }
    setErrors(newErrors);
    return false;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    if (touched[name as keyof FormValues]) {
      validate(nextValues);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(values);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ tenKhach: true, soDienThoai: true, ngayCuoi: true, nganSach: true });
    if (!validate(values)) return;

    setIsSubmitting(true);
    try {
      let isSuccess = false;
      if (isSupabaseConfigured) {
        isSuccess = await SupabaseService.createRequest({
          tenKhach: values.tenKhach,
          soDienThoai: values.soDienThoai,
          ngayCuoi: values.ngayCuoi,
          soLuongKhach: 100,
          nganSach: Number(values.nganSach),
          goiDeXuatId: initialGoiId,
          ghiChu: initialGoiId
            ? `[Tư vấn nhanh gói: ${initialGoiId}]`
            : "Đăng ký tư vấn nhanh từ Trang Chủ",
        });
      }

      if (!isSuccess) {
        const res = await fetch("/api/yeu-cau", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            soLuongKhach: 100,
            goiDeXuatId: initialGoiId,
            ghiChu: initialGoiId
              ? `[Tư vấn nhanh gói: ${initialGoiId}]`
              : "Đăng ký tư vấn nhanh từ Trang Chủ",
          }),
        });
        if (res.ok) isSuccess = true;
      }

      if (!isSuccess) throw new Error("Gửi yêu cầu không thành công");
      addToast("Gửi yêu cầu tư vấn thành công! Chuyên viên sẽ liên hệ trong 24h.", "success");
      setValues({ tenKhach: "", soDienThoai: "", ngayCuoi: "", nganSach: "25000000" });
      setTouched({ tenKhach: false, soDienThoai: false, ngayCuoi: false, nganSach: false });
      setErrors({});
      if (onSuccess) onSuccess();
    } catch {
      addToast("Lỗi kết nối máy chủ, vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="quick-consult-form" onSubmit={handleSubmit} noValidate>
      <div className="quick-form-header">
        <h3 className="quick-form-title">Đăng Ký Tư Vấn Hoàng Triều</h3>
        <p className="quick-form-desc">
          Để lại thông tin để nhận bảng dự toán cưới và ưu đãi trang phục Nhật Bình miễn phí.
        </p>
      </div>

      <div className="quick-form-grid">
        <Input
          label="Họ và tên của bạn"
          name="tenKhach"
          placeholder="Ví dụ: Nguyễn Minh Thư"
          value={values.tenKhach}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.tenKhach}
          touched={touched.tenKhach}
          required
        />
        <Input
          label="Số điện thoại liên hệ"
          name="soDienThoai"
          placeholder="Ví dụ: 0912345678"
          value={values.soDienThoai}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.soDienThoai}
          touched={touched.soDienThoai}
          required
        />
        <Input
          label="Ngày dự kiến hôn lễ"
          name="ngayCuoi"
          type="date"
          value={values.ngayCuoi}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.ngayCuoi}
          touched={touched.ngayCuoi}
          required
        />
        <Input
          label="Ngân sách dự kiến (VND)"
          name="nganSach"
          type="number"
          step="1000000"
          value={values.nganSach}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.nganSach}
          touched={touched.nganSach}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="quick-form-submit-btn"
      >
        Gửi Yêu Cầu Nhận Dự Toán Miễn Phí
      </Button>
    </form>
  );
}
