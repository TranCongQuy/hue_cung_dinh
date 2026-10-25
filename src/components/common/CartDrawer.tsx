import { useState, useId, FormEvent } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { useCartStore, CartItem } from "../../features/packages/cartStore";
import { formatCurrency } from "../../lib/formatters";
import { useToastStore } from "../../lib/toastStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { Icon } from "./Icon";
import "./CartDrawer.css";

const checkoutSchema = z.object({
  tenKhach: z.string().min(2, "Họ và tên phải từ 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ (10 chữ số)"),
  ngayCuoi: z.string().min(10, "Vui lòng chọn ngày chụp ảnh dự kiến"),
  diaDiemChup: z.string().min(2, "Vui lòng chọn hoặc nhập địa điểm di sản"),
  ghiChu: z.string().optional(),
});

interface CheckoutModalProps {
  items: CartItem[];
  totalPrice: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CartCheckoutModal({
  items,
  totalPrice,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const formId = useId();
  const addToast = useToastStore((s) => s.addToast);
  const [formData, setFormData] = useState({
    tenKhach: "",
    soDienThoai: "",
    ngayCuoi: "",
    diaDiemChup: "Đại Nội Cố Đô Huế & Cung Diên Thọ",
    ghiChu: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payDeposit, setPayDeposit] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);
  const depositAmount = Math.round(totalPrice * 0.2);

  const parsed = checkoutSchema.safeParse(formData);
  const errors = !parsed.success ? parsed.error.flatten().fieldErrors : {};

  const handleOpenConfirm = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ tenKhach: true, soDienThoai: true, ngayCuoi: true, diaDiemChup: true });
    if (!parsed.success) {
      addToast("Vui lòng hoàn thành đúng thông tin đặt lịch chụp ảnh", "error", 5000);
      return;
    }
    setConfirmStep(true);
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const itemsListStr = items
        .map(
          (i) =>
            `${i.ten} (x${i.soLuong || 1} - ${formatCurrency(i.gia * (i.soLuong || 1))})`
        )
        .join(", ");
      const payload = {
        tenKhach: formData.tenKhach,
        soDienThoai: formData.soDienThoai,
        ngayCuoi: formData.ngayCuoi,
        nganSach: totalPrice,
        goiDeXuatId: items[0]?.id || "gc-01",
        tenDon: `Đơn Chụp Ảnh (${items.map((i) => i.ten).slice(0, 2).join(", ")}${items.length > 2 ? "..." : ""})`,
        diaDiemChup: formData.diaDiemChup,
        danhSachDichVu: items.map((i) => ({
          id: i.id,
          ten: i.ten,
          gia: i.gia,
          soLuong: i.soLuong || 1,
        })),
        mongMuonBoSung: formData.ghiChu,
        ghiChu: `[ĐẶT CHỤP ẢNH TỪ GIỎ]: ${itemsListStr}. Địa điểm: ${formData.diaDiemChup}. Ghi chú: ${formData.ghiChu || "Không"}`,
      };

      let ok = await SupabaseService.createRequest(payload);
      if (!ok) {
        const res = await fetch("/api/yeu-cau", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) ok = true;
      }

      if (!ok) throw new Error("Gửi đơn không thành công");
      addToast(
        "Cảm ơn quý khách đã tin tưởng Studio Huế Cung Đình! Ekip sẽ liên hệ trong vòng 1 giờ làm việc.",
        "success",
        5000
      );
      onSuccess();
    } catch {
      addToast(
        "Không thể gửi yêu cầu đến máy chủ. Vui lòng thử lại sau.",
        "error",
        5000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="cart-checkout-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="cart-checkout-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="cart-drawer-close-btn"
          onClick={onClose}
          style={{ position: "absolute", top: 18, right: 18 }}
          aria-label="Đóng"
        >
          <Icon name="close" size={20} />
        </button>

        {!confirmStep ? (
          <>
            <h3 className="cart-checkout-title">Đặt Lịch Chụp Ảnh Cưới Hoàng Gia</h3>
            <p className="cart-checkout-subtitle">
              Studio Huế Cung Đình sẽ liên hệ quý khách trong vòng 1 giờ làm việc để hoàn thiện lịch hẹn.
            </p>

            {/* DANH SÁCH CÁC HẠNG MỤC ĐÃ CHỌN TRONG GIỎ */}
            <div className="checkout-items-preview-box">
              <span className="preview-box-title">Các hạng mục đã chọn ({items.length}):</span>
              <div className="preview-items-scroll">
                {items.map((it) => (
                  <div key={it.id} className="preview-item-row">
                    <img src={it.hinhAnh} alt={it.ten} className="preview-item-thumb" />
                    <div className="preview-item-details">
                      <span className="preview-item-name">{it.ten}</span>
                      <span className="preview-item-meta">
                        SL: {it.soLuong || 1} × {formatCurrency(it.gia)}
                      </span>
                    </div>
                    <strong className="preview-item-subtotal">
                      {formatCurrency(it.gia * (it.soLuong || 1))}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="preview-total-row">
                <span>Tổng chi phí dự kiến:</span>
                <strong className="preview-total-num">{formatCurrency(totalPrice)}</strong>
              </div>
            </div>

            <form onSubmit={handleOpenConfirm} noValidate className="checkout-form">
              <div className="checkout-form-group">
                <label
                  htmlFor={`${formId}-tenKhach`}
                  className="checkout-form-label"
                >
                  Họ và tên của bạn *
                </label>
                <input
                  id={`${formId}-tenKhach`}
                  type="text"
                  className="checkout-form-input"
                  placeholder="VD: Nguyễn Văn Hoàng"
                  value={formData.tenKhach}
                  onChange={(e) =>
                    setFormData({ ...formData, tenKhach: e.target.value })
                  }
                  onBlur={() => setTouched({ ...touched, tenKhach: true })}
                />
                {touched.tenKhach && errors.tenKhach && (
                  <p className="checkout-form-error">{errors.tenKhach[0]}</p>
                )}
              </div>

              <div className="checkout-form-group">
                <label
                  htmlFor={`${formId}-soDienThoai`}
                  className="checkout-form-label"
                >
                  Số điện thoại Zalo / Liên hệ *
                </label>
                <input
                  id={`${formId}-soDienThoai`}
                  type="tel"
                  className="checkout-form-input"
                  placeholder="VD: 0912345678"
                  value={formData.soDienThoai}
                  onChange={(e) =>
                    setFormData({ ...formData, soDienThoai: e.target.value })
                  }
                  onBlur={() => setTouched({ ...touched, soDienThoai: true })}
                />
                {touched.soDienThoai && errors.soDienThoai && (
                  <p className="checkout-form-error">{errors.soDienThoai[0]}</p>
                )}
              </div>

              <div className="checkout-form-group">
                <label
                  htmlFor={`${formId}-ngayCuoi`}
                  className="checkout-form-label"
                >
                  Ngày chụp ảnh dự kiến *
                </label>
                <input
                  id={`${formId}-ngayCuoi`}
                  type="date"
                  className="checkout-form-input"
                  value={formData.ngayCuoi}
                  onChange={(e) =>
                    setFormData({ ...formData, ngayCuoi: e.target.value })
                  }
                  onBlur={() => setTouched({ ...touched, ngayCuoi: true })}
                />
                {touched.ngayCuoi && errors.ngayCuoi && (
                  <p className="checkout-form-error">{errors.ngayCuoi[0]}</p>
                )}
              </div>

              <div className="checkout-form-group">
                <label
                  htmlFor={`${formId}-diaDiemChup`}
                  className="checkout-form-label"
                >
                  Địa điểm chụp di sản mong muốn *
                </label>
                <select
                  id={`${formId}-diaDiemChup`}
                  className="checkout-form-input"
                  value={formData.diaDiemChup}
                  onChange={(e) =>
                    setFormData({ ...formData, diaDiemChup: e.target.value })
                  }
                >
                  <option value="Đại Nội Cố Đô Huế & Cung Diên Thọ">Quần thể Đại Nội & Cung Diên Thọ</option>
                  <option value="Lăng Khải Định & Đồi Thông Thiên An">Lăng Khải Định & Đồi Thông Thiên An</option>
                  <option value="Biệt Phủ Cổ & Bến Thuyền Sông Hương">Biệt Phủ Cổ & Bến Thuyền Sông Hương</option>
                  <option value="Lăng Tự Đức & Cầu Ngói Thanh Toàn">Lăng Tự Đức & Cầu Ngói Thanh Toàn</option>
                  <option value="Cung An Định Hoàng Triều">Cung An Định Hoàng Triều</option>
                </select>
              </div>

              <div className="checkout-form-group">
                <label htmlFor={`${formId}-ghiChu`} className="checkout-form-label">
                  Ghi chú thêm (yêu cầu riêng, ngày ăn hỏi, số lượng cổ phục...)
                </label>
                <textarea
                  id={`${formId}-ghiChu`}
                  className="checkout-form-textarea"
                  rows={2}
                  placeholder="Yêu cầu cụ thể..."
                  value={formData.ghiChu}
                  onChange={(e) =>
                    setFormData({ ...formData, ghiChu: e.target.value })
                  }
                />
              </div>

              <div style={{ margin: "14px 0", padding: "12px", background: "var(--bg-main)", borderRadius: "10px", border: "1px dashed var(--border-gold)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={payDeposit}
                    onChange={(e) => setPayDeposit(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                  />
                  <span>Đặt cọc trước 20% qua VietQR ({formatCurrency(depositAmount)})</span>
                </label>
                {payDeposit && (
                  <div style={{ marginTop: "10px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <img
                      src={`https://img.vietqr.io/image/MB-0905123456-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent("Dat coc " + (formData.tenKhach || "chup anh cuoi"))}`}
                      alt="Mã VietQR đặt cọc"
                      style={{ width: "140px", height: "140px", objectFit: "contain", borderRadius: "8px", border: "1px solid #EEE" }}
                    />
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      MB Bank • 0905123456 • <strong>Studio Huế Cung Đình</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="checkout-actions-row">
                <button
                  type="button"
                  className="btn-checkout-cancel"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-checkout-submit"
                  disabled={isSubmitting}
                >
                  Xác Nhận Đặt Lịch
                </button>
              </div>
            </form>
          </>
        ) : (
          /* BƯỚC XÁC NHẬN CHÍNH THỨC TRÁNH NHẦM LẪN (MỤC 23) */
          <div className="checkout-confirm-step">
            <div className="confirm-icon-crown">
              <Icon name="crown" size={32} color="var(--primary)" />
            </div>
            <h3 className="confirm-title">Xác Nhận Đặt Lịch Chụp Ảnh</h3>
            <div className="confirm-alert-box">
              <Icon name="alert" size={18} color="var(--primary)" />
              <p>
                Quý khách vui lòng kiểm tra lại danh sách các hạng mục chụp ảnh đã chọn để đảm bảo chính xác, tránh nhầm lẫn trước khi gửi:
              </p>
            </div>

            <div className="confirm-details-card">
              <div className="confirm-info-row">
                <span>Họ và tên:</span>
                <strong>{formData.tenKhach}</strong>
              </div>
              <div className="confirm-info-row">
                <span>Số điện thoại:</span>
                <strong>{formData.soDienThoai}</strong>
              </div>
              <div className="confirm-info-row">
                <span>Ngày chụp dự kiến:</span>
                <strong>{formData.ngayCuoi}</strong>
              </div>
              <div className="confirm-info-row">
                <span>Địa điểm di sản:</span>
                <strong>{formData.diaDiemChup}</strong>
              </div>
              <div className="confirm-info-row">
                <span>Số hạng mục:</span>
                <strong>{items.length} hạng mục dịch vụ</strong>
              </div>
              <div className="confirm-info-row total-highlight">
                <span>Tổng chi phí:</span>
                <span className="total-gold-price">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <div className="confirm-actions-row">
              <button
                type="button"
                className="btn-checkout-cancel"
                onClick={() => setConfirmStep(false)}
                disabled={isSubmitting}
              >
                ← Kiểm Tra Lại
              </button>
              <button
                type="button"
                className="btn-checkout-submit btn-confirm-final"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi đơn..." : "Đồng Ý Đặt Lịch"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const total = getTotalPrice();

  return (
    <>
      <div
        className="cart-drawer-backdrop"
        onClick={closeCart}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="cart-drawer-panel"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="cart-drawer-header">
            <div className="cart-header-title-wrap">
              <Icon name="cart" size={22} color="var(--primary)" />
              <h3 className="cart-drawer-title">Giỏ Dịch Vụ Cưới</h3>
              {items.length > 0 && (
                <span className="cart-items-count-badge">{items.length}</span>
              )}
            </div>
            <button
              type="button"
              className="cart-drawer-close-btn"
              onClick={closeCart}
              aria-label="Đóng giỏ hàng"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="cart-drawer-body">
            {items.length === 0 ? (
              <div className="cart-empty-view">
                <div className="cart-empty-icon-wrap">
                  <Icon name="cart" size={36} color="var(--secondary)" />
                </div>
                <h4 className="cart-empty-title">Giỏ hàng của bạn đang trống</h4>
                <p className="cart-empty-desc">
                  Khám phá các combo cưới hoàng gia và dịch vụ lẻ cung đình để
                  chuẩn bị cho ngày trọng đại.
                </p>
                <Link
                  to="/goi-cuoi"
                  onClick={closeCart}
                  className="btn-checkout-cart"
                  style={{ display: "inline-block", textDecoration: "none" }}
                >
                  Khám Phá Gói Cưới Ngay
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img
                    src={item.hinhAnh}
                    alt={item.ten}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.ten}</h4>
                    <span className="cart-item-price">
                      {formatCurrency(item.gia * (item.soLuong || 1))}
                    </span>
                    <div className="cart-qty-controls">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Giảm số lượng"
                      >
                        -
                      </button>
                      <span className="cart-qty-val">{item.soLuong || 1}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item-delete-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Xóa ${item.ten} khỏi giỏ`}
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="cart-subtotal-row">
                <span className="cart-subtotal-label">
                  Tổng Chi Phí Dự Kiến:
                </span>
                <span className="cart-subtotal-amount">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="cart-footer-actions">
                <button
                  type="button"
                  className="btn-clear-cart"
                  onClick={clearCart}
                >
                  Xóa tất cả
                </button>
                <button
                  type="button"
                  className="btn-checkout-cart"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Đặt Lịch Ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {checkoutOpen && (
        <CartCheckoutModal
          items={items}
          totalPrice={total}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            clearCart();
            setCheckoutOpen(false);
            closeCart();
          }}
        />
      )}
    </>
  );
}
