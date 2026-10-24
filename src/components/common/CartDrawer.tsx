import { useState, useId, FormEvent } from "react";
import { Link } from "react-router";
import { z } from "zod";
import { useCartStore, CartItem } from "../../features/packages/cartStore";
import { formatCurrency } from "../../lib/formatters";
import { useToastStore } from "../../lib/toastStore";
import { Icon } from "./Icon";
import "./CartDrawer.css";

const checkoutSchema = z.object({
  tenKhach: z.string().min(2, "Họ và tên phải từ 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ (10 chữ số)"),
  ngayCuoi: z.string().min(10, "Vui lòng chọn ngày cưới dự kiến"),
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
    ghiChu: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payDeposit, setPayDeposit] = useState(false);
  const depositAmount = Math.round(totalPrice * 0.2);

  const parsed = checkoutSchema.safeParse(formData);
  const errors = !parsed.success ? parsed.error.flatten().fieldErrors : {};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ tenKhach: true, soDienThoai: true, ngayCuoi: true });
    if (!parsed.success) {
      addToast("Vui lòng hoàn thành đúng thông tin đặt lịch", "error");
      return;
    }
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
        soLuongKhach: 100,
        nganSach: totalPrice,
        goiDeXuatId: items[0]?.id || "gc-01",
        ghiChu: `[ĐẶT DỊCH VỤ TỪ GIỎ HÀNG]: ${itemsListStr}. Ghi chú: ${
          formData.ghiChu || "Không"
        }`,
      };
      const res = await fetch("/api/yeu-cau", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gửi đơn không thành công");
      addToast(
        "Đặt lịch dịch vụ thành công! Studio sẽ liên hệ quý khách sớm nhất.",
        "success"
      );
      onSuccess();
    } catch {
      addToast(
        "Không thể gửi yêu cầu đến máy chủ. Vui lòng thử lại sau.",
        "error"
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

        <h3 className="cart-checkout-title">Đặt Lịch Dịch Vụ Cưới</h3>
        <p className="cart-checkout-subtitle">
          Studio Huế Cung Đình sẽ liên hệ quý khách trong vòng 1 giờ làm việc.
        </p>

        <div className="checkout-summary-box">
          <span className="checkout-summary-count">
            Tổng {items.length} hạng mục đã chọn
          </span>
          <span className="checkout-summary-total">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="checkout-form">
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
              placeholder="VD: Nguyễn Văn A"
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
              Số điện thoại liên hệ *
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
              Ngày tổ chức dự kiến *
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
            <label htmlFor={`${formId}-ghiChu`} className="checkout-form-label">
              Ghi chú thêm (yêu cầu riêng, ngày ăn hỏi...)
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
                  src={`https://img.vietqr.io/image/MB-0905123456-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent("Dat coc " + (formData.tenKhach || "cuoi hoang gia"))}`}
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
              {isSubmitting ? "Đang gửi đơn..." : "Xác Nhận Đặt Lịch"}
            </button>
          </div>
        </form>
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
