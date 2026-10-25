import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import { loginInputSchema, registerInputSchema } from "../features/auth/types";
import { Button, Input } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { useToastStore } from "../lib/toastStore";
import "./LoginPage.css";

/* ==========================================================================
   1. REGISTER FORM COMPONENT
   ========================================================================== */
interface RegisterFormProps {
  onSuccess: (hoTen: string, tenDangNhap: string, matKhau: string) => Promise<boolean>;
  isLoading: boolean;
}

export function RegisterForm({ onSuccess, isLoading }: RegisterFormProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [hoTen, setHoTen] = useState("");
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = registerInputSchema.safeParse({ hoTen, tenDangNhap, matKhau });
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) errMap[String(field)] = issue.message;
      });
      setErrors(errMap);
      return;
    }
    setErrors({});
    const ok = await onSuccess(hoTen, tenDangNhap, matKhau);
    if (!ok) {
      addToast("Đăng ký không thành công. Tên đăng nhập có thể đã tồn tại.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="login-form">
      <Input
        label="Họ và tên của bạn"
        name="hoTen"
        placeholder="VD: Nguyễn Văn Hoàng"
        value={hoTen}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setHoTen(e.target.value)}
        error={errors.hoTen}
        required
      />
      <Input
        label="Tên đăng nhập mới"
        name="tenDangNhap"
        placeholder="VD: hoangnguyen"
        value={tenDangNhap}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTenDangNhap(e.target.value)}
        error={errors.tenDangNhap}
        required
      />
      <Input
        label="Mật khẩu"
        name="matKhau"
        type="password"
        placeholder="Tối thiểu 6 ký tự"
        value={matKhau}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMatKhau(e.target.value)}
        error={errors.matKhau}
        required
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="login-submit-btn"
      >
        Tạo Tài Khoản Khách Hàng
      </Button>
    </form>
  );
}

/* ==========================================================================
   2. LOGIN PAGE COMPONENT
   ========================================================================== */
export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const addToast = useToastStore((s) => s.addToast);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [values, setValues] = useState({ tenDangNhap: "admin", matKhau: "123456" });
  const [touched, setTouched] = useState({ tenDangNhap: false, matKhau: false });
  const [errors, setErrors] = useState<Partial<Record<"tenDangNhap" | "matKhau", string>>>({});
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const parsed = loginInputSchema.safeParse(values);
    if (parsed.success) { setErrors({}); return true; }
    const newErrors: Partial<Record<"tenDangNhap" | "matKhau", string>> = {};
    parsed.error.issues.forEach((i) => {
      const f = i.path[0] as "tenDangNhap" | "matKhau";
      if (f && !newErrors[f]) newErrors[f] = i.message;
    });
    setErrors(newErrors);
    return false;
  };

  const handleQuickFill = (u: string, p: string) => {
    setValues({ tenDangNhap: u, matKhau: p });
    setTouched({ tenDangNhap: true, matKhau: true });
    setAuthError("");
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ tenDangNhap: true, matKhau: true });
    if (!validate()) return;
    setIsLoading(true);
    const success = await login(values.tenDangNhap, values.matKhau);
    setIsLoading(false);
    if (success) {
      addToast(`Đăng nhập thành công! Chào mừng ${values.tenDangNhap}.`, "success");
      const originState = location.state as { from?: { pathname?: string } } | null;
      const isAdmin = values.tenDangNhap === "admin";
      navigate(originState?.from?.pathname || (isAdmin ? "/admin" : "/"), { replace: true });
    } else {
      setAuthError("Tên đăng nhập hoặc mật khẩu không chính xác");
      addToast("Đăng nhập thất bại. Vui lòng thử lại.", "error");
    }
  };

  const handleRegisterSuccess = async (hoTen: string, u: string, p: string) => {
    setIsLoading(true);
    const success = await register(hoTen, u, p);
    setIsLoading(false);
    if (success) {
      addToast(`Đăng ký thành công! Chào mừng ${hoTen}.`, "success");
      navigate("/", { replace: true });
      return true;
    }
    return false;
  };

  return (
    <div className="login-page-root">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-badge"><Icon name="crown" size={32} color="var(--secondary)" /></div>
          <h1 className="login-title">{authMode === "login" ? "Cổng Quản Trị Studio & Đăng Nhập" : "Tạo Tài Khoản Mới"}</h1>
          <p className="login-subtitle">Dành cho Quản trị viên điều hành và Khách hàng đặt dịch vụ cưới</p>
        </div>

        {location.state?.from && (
          <div className="login-redirect-notice" role="status">
            <Icon name="crown" size={20} color="var(--primary)" />
            <span>
              Quý khách vui lòng đăng nhập tài khoản để xem chi tiết sản phẩm và sử dụng dịch vụ cưới hoàng triều.
            </span>
          </div>
        )}

        <div className="auth-tab-row" role="tablist">
          <button type="button" className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`} onClick={() => setAuthMode("login")}>Đăng Nhập</button>
          <button type="button" className={`auth-tab-btn ${authMode === "register" ? "active" : ""}`} onClick={() => setAuthMode("register")}>Đăng Ký Khách Hàng</button>
        </div>

        {authMode === "login" ? (
          <>
            <div className="login-hint">
              <span>💡 Chọn nhanh tài khoản thử nghiệm:</span>
            </div>
            <div className="quick-fill-group">
              <button
                type="button"
                className="btn-quick-fill"
                onClick={async () => {
                  handleQuickFill("khachhang", "123456");
                  setIsLoading(true);
                  const ok = await login("khachhang", "123456");
                  setIsLoading(false);
                  if (ok) {
                    addToast("Đăng nhập Khách Hàng thành công!", "success");
                    const originState = location.state as { from?: { pathname?: string } } | null;
                    navigate(originState?.from?.pathname || "/", { replace: true });
                  }
                }}
              >
                💍 1-Click Khách Hàng (khachhang)
              </button>
              <button
                type="button"
                className="btn-quick-fill"
                onClick={async () => {
                  handleQuickFill("admin", "123456");
                  setIsLoading(true);
                  const ok = await login("admin", "123456");
                  setIsLoading(false);
                  if (ok) {
                    addToast("Đăng nhập Admin thành công!", "success");
                    const originState = location.state as { from?: { pathname?: string } } | null;
                    navigate(originState?.from?.pathname || "/admin", { replace: true });
                  }
                }}
              >
                👑 1-Click Admin (admin)
              </button>
            </div>
            {authError && (
              <div className="login-alert-error" role="alert">
                <Icon name="alert" size={18} color="var(--danger)" /><span>{authError}</span>
              </div>
            )}
            <form onSubmit={handleLoginSubmit} noValidate className="login-form">
              <Input
                label="Tên đăng nhập"
                name="tenDangNhap"
                value={values.tenDangNhap}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setValues((p) => ({ ...p, tenDangNhap: e.target.value })); setAuthError(""); }}
                onBlur={() => { setTouched((p) => ({ ...p, tenDangNhap: true })); validate(); }}
                error={errors.tenDangNhap}
                touched={touched.tenDangNhap}
                required
              />
              <Input
                label="Mật khẩu"
                name="matKhau"
                type="password"
                value={values.matKhau}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setValues((p) => ({ ...p, matKhau: e.target.value })); setAuthError(""); }}
                onBlur={() => { setTouched((p) => ({ ...p, matKhau: true })); validate(); }}
                error={errors.matKhau}
                touched={touched.matKhau}
                required
              />
              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="login-submit-btn">
                Đăng Nhập Ngay
              </Button>
            </form>
          </>
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
