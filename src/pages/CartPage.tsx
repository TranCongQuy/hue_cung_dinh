import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCartStore } from "../features/packages/cartStore";
import { formatCurrency } from "../lib/formatters";
import { Icon } from "../components/common/Icon";
import { CartCheckoutModal } from "../components/common/CartDrawer";
import "./CartPage.css";

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const total = getTotalPrice();

  return (
    <div className="cart-page-root">
      <div className="container">
        <header className="cart-page-header">
          <h1 className="cart-page-title">Giỏ Dịch Vụ Cưới Hoàng Gia</h1>
          <p className="cart-page-subtitle">
            Quản lý các combo trọn gói và dịch vụ lẻ cung đình đã chọn cho ngày trọng đại
          </p>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty-view" style={{ background: "var(--surface)", borderRadius: "20px", padding: "60px 20px" }}>
            <div className="cart-empty-icon-wrap">
              <Icon name="cart" size={42} color="var(--secondary)" />
            </div>
            <h2 className="cart-empty-title">Giỏ hàng của bạn đang trống</h2>
            <p className="cart-empty-desc">
              Bạn chưa chọn dịch vụ hoặc gói cưới nào. Hãy khám phá ngay các bộ sưu tập cung đình của chúng tôi!
            </p>
            <Link to="/goi-cuoi" className="btn-checkout-cart" style={{ display: "inline-block", textDecoration: "none" }}>
              Xem Gói Cưới Combo
            </Link>
          </div>
        ) : (
          <div className="cart-page-grid">
            {/* Cột danh sách món hàng */}
            <div className="cart-items-wrapper">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.hinhAnh} alt={item.ten} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.ten}</h3>
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
                    aria-label={`Xóa ${item.ten}`}
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Icon name="trash" size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cột tổng kết chi phí */}
            <aside className="cart-summary-card">
              <h2 className="cart-summary-title">Tóm Tắt Đơn Hàng</h2>
              <div className="cart-summary-row">
                <span>Số lượng hạng mục:</span>
                <strong style={{ color: "var(--text-main)" }}>{items.length} mục</strong>
              </div>
              <div className="cart-summary-row">
                <span>Tư vấn &amp; Lên kịch bản:</span>
                <strong style={{ color: "#16a34a" }}>Miễn Phí</strong>
              </div>
              <div className="cart-summary-total-row">
                <span className="cart-summary-total-label">Tổng Chi Phí:</span>
                <span className="cart-summary-total-val">{formatCurrency(total)}</span>
              </div>

              <div className="cart-summary-actions">
                <button
                  type="button"
                  className="btn-checkout-cart"
                  style={{ width: "100%", padding: "14px" }}
                  onClick={() => setCheckoutOpen(true)}
                >
                  Xác Nhận Đặt Lịch
                </button>
                <button
                  type="button"
                  className="btn-clear-cart"
                  style={{ width: "100%" }}
                  onClick={clearCart}
                >
                  Xóa Tất Cả Giỏ Hàng
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      {checkoutOpen && (
        <CartCheckoutModal
          items={items}
          totalPrice={total}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            clearCart();
            setCheckoutOpen(false);
            navigate("/don-cua-toi");
          }}
        />
      )}
    </div>
  );
}

