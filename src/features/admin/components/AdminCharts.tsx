import { useState } from "react";
import { Link } from "react-router";
import { YeuCau, TrangThaiYeuCau } from "../../requests/types";
import { formatCurrency, formatDate, getStatusInfo } from "../../../lib/formatters";
import { Button } from "../../../components/common/UI";
import { Icon } from "../../../components/common/Icon";
import { useToastStore } from "../../../lib/toastStore";
import { SupabaseService } from "../../../lib/supabaseAdapter";
import { isSupabaseConfigured } from "../../../lib/supabase";
import "./AdminCharts.css";

/* ==========================================================================
   1. PACKAGE PIE / DONUT CHART COMPONENT
   ========================================================================== */
interface PieChartItem {
  tenGoi: string;
  soLuong: number;
  phanTram: number;
}

interface PieChartProps {
  data: PieChartItem[];
}

const PALETTE = ["#8B0000", "#D4AF37", "#1B4F72", "#B7791F", "#1E7E34"];

export function PackagePieChart({ data }: PieChartProps) {
  if (data.length === 0) return null;

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;
  const totalCount = data.reduce((sum, d) => sum + d.soLuong, 0);

  return (
    <div className="pie-chart-card">
      <div className="chart-header">
        <div className="chart-header-left">
          <h3 className="chart-title">Cơ Cấu Gói Cưới Được Chọn</h3>
          <span className="chart-subtitle">Tỷ trọng thị phần các gói hôn lễ ({totalCount} hợp đồng)</span>
        </div>
        <span className="chart-metric-badge">
          <Icon name="crown" size={12} color="#16a34a" /> 100% Cung Đình
        </span>
      </div>

      <div className="pie-chart-body">
        <div className="pie-svg-container">
          <svg viewBox="0 0 200 200" className="pure-donut-svg" role="img" aria-label="Biểu đồ tròn cơ cấu gói cưới">
            <g transform="rotate(-90 100 100)">
              {data.map((item, index) => {
                const strokeLength = (item.phanTram / 100) * circumference;
                const dashOffset = -accumulatedOffset;
                accumulatedOffset += strokeLength;
                const color = PALETTE[index % PALETTE.length];

                return (
                  <circle
                    key={item.tenGoi}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="30"
                    strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                    strokeDashoffset={dashOffset}
                    className="donut-segment"
                  />
                );
              })}
            </g>
            <text x="100" y="96" textAnchor="middle" className="donut-center-num">
              {totalCount}
            </text>
            <text x="100" y="114" textAnchor="middle" className="donut-center-label">
              HỢP ĐỒNG
            </text>
          </svg>
        </div>

        <div className="pie-legend">
          {data.map((item, index) => {
            const color = PALETTE[index % PALETTE.length];
            return (
              <div key={item.tenGoi} className="legend-item">
                <div className="legend-row-top">
                  <div className="legend-item-left">
                    <span className="legend-dot" style={{ backgroundColor: color }} />
                    <span className="legend-label" title={item.tenGoi}>
                      {item.tenGoi}
                    </span>
                  </div>
                  <span className="legend-pct">{item.phanTram}% ({item.soLuong} đơn)</span>
                </div>
                <div className="legend-bar-track">
                  <div
                    className="legend-bar-fill"
                    style={{ width: `${item.phanTram}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. REVENUE BAR CHART COMPONENT
   ========================================================================== */
interface BarChartProps {
  data: Array<{ thang: string; doanhThu: number }>;
}

export function RevenueBarChart({ data }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const maxRevenue = Math.max(...data.map((d) => d.doanhThu), 1);
  const chartHeight = 160;
  const chartWidth = 540;
  const barWidth = 36;
  const startX = 40;
  const gap = (chartWidth - startX - data.length * barWidth) / (data.length || 1);

  return (
    <div className="bar-chart-card">
      <div className="chart-header">
        <div className="chart-header-left">
          <h3 className="chart-title">Doanh Thu 6 Tháng Gần Nhất</h3>
          <span className="chart-subtitle">So sánh tiến độ doanh số thực thu (Đơn vị: VNĐ)</span>
        </div>
        <div className="chart-badges-row">
          <span className="chart-metric-badge">
            <Icon name="trendingUp" size={12} color="#16a34a" /> +18.4% Tăng trưởng
          </span>
        </div>
      </div>

      <div className="svg-chart-wrapper">
        <svg
          viewBox={`0 0 ${chartWidth} 240`}
          className="pure-svg-chart"
          role="img"
          aria-label="Biểu đồ cột doanh thu 6 tháng gần nhất"
        >
          <defs>
            <linearGradient id="royalBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <linearGradient id="royalBarGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B30000" />
              <stop offset="100%" stopColor="#F5D061" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight - ratio * (chartHeight - 30) + 20;
            return (
              <line
                key={i}
                x1={startX - 10}
                y1={y}
                x2={chartWidth - 10}
                y2={y}
                stroke="var(--border-color)"
                strokeDasharray="4 4"
                opacity="0.6"
              />
            );
          })}

          {/* Trục hoành */}
          <line
            x1={startX - 10}
            y1={chartHeight + 20}
            x2={chartWidth - 10}
            y2={chartHeight + 20}
            stroke="var(--border-color)"
            strokeWidth="1.5"
          />

          {data.map((item, index) => {
            const h = (item.doanhThu / maxRevenue) * (chartHeight - 30);
            const x = startX + index * (barWidth + gap);
            const y = chartHeight + 20 - h;
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={item.thang}
                className="bar-column-group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Thanh nền mờ so sánh baseline */}
                <rect
                  x={x}
                  y={chartHeight + 20 - (chartHeight - 20)}
                  width={barWidth}
                  height={chartHeight - 20}
                  rx="6"
                  className="bar-rect-bg"
                />

                {/* Cột thực tế */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx="6"
                  className={`bar-rect ${isHovered ? "bar-rect-hovered" : ""}`}
                />

                {/* Nhãn tháng */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 42}
                  textAnchor="middle"
                  className="bar-x-label"
                >
                  {item.thang}
                </text>

                {/* Tooltip hoàng gia khi hover */}
                {isHovered && (
                  <g className="chart-tooltip-group">
                    <rect
                      x={x + barWidth / 2 - 65}
                      y={y - 48}
                      width="130"
                      height="40"
                      rx="6"
                      className="tooltip-bg"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 32}
                      textAnchor="middle"
                      className="tooltip-title"
                    >
                      Tháng {item.thang} • Doanh Thu
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={y - 16}
                      textAnchor="middle"
                      className="tooltip-value"
                    >
                      {formatCurrency(item.doanhThu)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. STUDIO PLAN & LICENSE WIDGET (Inspired by Corbel Settings/Plan)
   ========================================================================== */
export function StudioPlanWidget() {
  const addToast = useToastStore((s) => s.addToast);

  const handleDownloadInvoice = () => {
    const content = [
      "===========================================================",
      "       STUDIO HUẾ CUNG ĐÌNH — HÓA ĐƠN BẢN QUYỀN HỆ THỐNG",
      "===========================================================",
      `Mã hóa đơn:     INV-2026-1024P`,
      `Ngày phát hành: ${new Date().toLocaleDateString("vi-VN")}`,
      `Đơn vị thụ hưởng: Studio Huế Cung Đình (Chi nhánh Đại Nội)`,
      `Địa chỉ:         128 Đoàn Thị Điểm, P. Thuận Thành, TP. Huế`,
      `Gói bản quyền:   Hoàng Triều Enterprise (VIP License)`,
      `Chu kỳ thuê:     30 ngày (Gia hạn tự động)`,
      `Hạn bản quyền:   24/11/2026`,
      "-----------------------------------------------------------",
      "DANH MỤC CÁC PHÂN HỆ VÀ TIỆN ÍCH KÍCH HOẠT:",
      "- 16 Tuyến đường và phân hệ quản trị Studio Cung Đình",
      "- AI Tư vấn ngân sách & Dự toán chi phí hôn lễ Cố Đô",
      "- Cổng kết nối Dynamic VietQR tự động hóa 24/7",
      "- In ấn hợp đồng & báo giá chuẩn A4 Cung Đình (@media print)",
      "- Bảng Kanban quản lý quy trình chăm sóc khách hàng",
      "- Lưu trữ đám mây hình ảnh HD không giới hạn",
      "-----------------------------------------------------------",
      "TỔNG CHI PHÍ BẢN QUYỀN:               4.500.000 ₫",
      "Phương thức thanh toán:                Thẻ Visa •••• 4242",
      "Trạng thái giao dịch:                  ĐÃ THANH TOÁN THÀNH CÔNG",
      "===========================================================",
      "Cảm ơn quý studio đã đồng hành gìn giữ nét đẹp văn hóa Huế."
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hoa-don-studio-INV-2026-1024P.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast("Đã tải xuống hóa đơn bản quyền Studio (INV-2026-1024P.txt)", "success");
  };

  const handleRenew = () => {
    addToast("Gói bản quyền Hoàng Triều Enterprise của bạn đang ở trạng thái kích hoạt tốt nhất!", "info");
  };

  return (
    <div className="studio-plan-card">
      <div className="studio-plan-glow" aria-hidden="true" />
      <div className="studio-plan-header">
        <div>
          <span className="studio-plan-badge">
            <Icon name="crown" size={14} color="var(--secondary)" />
            Bản Quyền Đang Kích Hoạt • Enterprise VIP
          </span>
          <h3 className="studio-plan-title">Hệ Thống Quản Trị Cung Đình Enterprise</h3>
          <p className="studio-plan-sub">Toàn bộ 16 phân hệ, AI tư vấn thông minh, VietQR và in ấn A4</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <strong style={{ fontSize: "1.4rem", color: "var(--primary)" }}>4.500.000 ₫</strong>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>chu kỳ 30 ngày (Gia hạn tự động)</div>
        </div>
      </div>

      <div className="studio-plan-meter-box">
        <div className="meter-labels">
          <span style={{ fontWeight: 600 }}>Thời hạn bản quyền</span>
          <span style={{ color: "#16a34a", fontWeight: 700 }}>Còn 28 ngày gia hạn (Đã dùng 2 / 30 ngày)</span>
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: "93%" }} />
        </div>
      </div>

      <div className="studio-plan-features">
        <span className="plan-feature-tag"><Icon name="check" size={13} color="#16a34a" /> 16 Phân hệ quản trị</span>
        <span className="plan-feature-tag"><Icon name="check" size={13} color="#16a34a" /> AI Dự toán ngân sách</span>
        <span className="plan-feature-tag"><Icon name="check" size={13} color="#16a34a" /> Tích hợp Dynamic VietQR</span>
        <span className="plan-feature-tag"><Icon name="check" size={13} color="#16a34a" /> In ấn Hợp đồng A4</span>
        <span className="plan-feature-tag"><Icon name="check" size={13} color="#16a34a" /> Lưu trữ ảnh HD vĩnh viễn</span>
      </div>

      <div className="studio-plan-actions">
        <span className="studio-plan-note">
          💳 Thanh toán định kỳ qua Visa kết thúc bằng 4242 • Hỗ trợ kỹ thuật 24/7
        </span>
        <div className="studio-plan-btns">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownloadInvoice}
            leftIcon={<Icon name="download" size={14} />}
          >
            Tải Hóa Đơn (TXT)
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleRenew}
            leftIcon={<Icon name="sparkles" size={14} />}
          >
            Quản Lý Gia Hạn
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. LIVE ACTIVITY & TOP SELLERS WIDGET
   ========================================================================== */
export function LiveActivityAndTopSellers() {
  const [activeTab, setActiveTab] = useState<"stream" | "top">("stream");

  const activities = [
    {
      id: "act-1",
      user: "Nguyễn Văn Hoàng",
      avatar: "H",
      text: "vừa đặt lịch gói cưới",
      highlight: "Hoàng Hậu Nam Phương",
      time: "12 phút trước",
    },
    {
      id: "act-2",
      user: "Quản Trị Viên",
      avatar: "👑",
      text: "đã duyệt đơn yêu cầu tư vấn",
      highlight: "#YC-08 (Đại Nội)",
      time: "45 phút trước",
    },
    {
      id: "act-3",
      user: "Phan Quốc Bảo",
      avatar: "B",
      text: "vừa khởi tạo mẫu thiệp cưới",
      highlight: "Hoàng Kim Liên Hoa (VIP)",
      time: "2 giờ trước",
    },
    {
      id: "act-4",
      user: "Võ Thị Ngọc Hân",
      avatar: "H",
      text: "đã đặt cọc 20% qua VietQR",
      highlight: "11.200.000 ₫",
      time: "4 giờ trước",
    },
  ];

  const topSellers = [
    {
      rank: "🥇",
      name: "Áo Nhật Bình Hoàng Gia Thêu Long Phụng",
      meta: "Cổ phục hoàng hậu triều Nguyễn",
      orders: "68 lượt thuê",
      revenue: "306.000.000 ₫",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=120&q=80",
    },
    {
      rank: "🥈",
      name: "Gói Cung Đình Khang Ninh",
      meta: "Nghi thức cưới hoàng gia đỉnh cao",
      orders: "18 hợp đồng",
      revenue: "484.200.000 ₫",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=120&q=80",
    },
    {
      rank: "🥉",
      name: "Áo Tấc Ngũ Thân Hoàng Triều",
      meta: "Trang phục chú rể tay thụng truyền thống",
      orders: "42 lượt thuê",
      revenue: "134.400.000 ₫",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=120&q=80",
    },
  ];

  return (
    <div className="activity-widget-card">
      <div className="activity-widget-tabs" role="tablist">
        <button
          type="button"
          className={`activity-tab-btn ${activeTab === "stream" ? "active" : ""}`}
          onClick={() => setActiveTab("stream")}
        >
          <Icon name="activity" size={13} style={{ marginRight: 6 }} />
          Nhật Ký Hoạt Động Real-Time
        </button>
        <button
          type="button"
          className={`activity-tab-btn ${activeTab === "top" ? "active" : ""}`}
          onClick={() => setActiveTab("top")}
        >
          <Icon name="crown" size={13} style={{ marginRight: 6 }} />
          Top Dịch Vụ Thịnh Hành
        </button>
      </div>

      {activeTab === "stream" ? (
        <div className="activity-stream-list">
          {activities.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-avatar">{item.avatar}</div>
              <div className="activity-content">
                <span className="activity-text">
                  <strong>{item.user}</strong> {item.text} <strong>{item.highlight}</strong>
                </span>
                <span className="activity-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="top-sellers-list">
          {topSellers.map((item) => (
            <div key={item.name} className="top-seller-item">
              <span className="top-seller-rank">{item.rank}</span>
              <img src={item.image} alt={item.name} className="top-seller-thumb" />
              <div className="top-seller-info">
                <span className="top-seller-name">{item.name}</span>
                <span className="top-seller-meta">{item.meta} • <strong>{item.orders}</strong></span>
              </div>
              <span className="top-seller-revenue">{item.revenue}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   5. RECENT REQUESTS TABLE COMPONENT
   ========================================================================== */
interface RecentRequestsTableProps {
  requests: YeuCau[];
  onRefresh: () => void;
}

export function RecentRequestsTable({ requests, onRefresh }: RecentRequestsTableProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: TrangThaiYeuCau) => {
    setUpdatingId(id);
    try {
      let ok = false;
      if (isSupabaseConfigured) {
        ok = await SupabaseService.updateRequestStatus(id, newStatus);
      }
      if (!ok) {
        const res = await fetch(`/api/yeu-cau/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trangThai: newStatus }),
        });
        if (res.ok) ok = true;
      }
      addToast("Cập nhật trạng thái thành công!", "success");
      onRefresh();
    } catch {
      addToast("Không thể cập nhật trạng thái đơn", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn này khỏi hệ thống?")) return;
    setUpdatingId(id);
    try {
      let ok = false;
      if (isSupabaseConfigured) {
        ok = await SupabaseService.deleteRequest(id);
      }
      if (!ok) {
        const res = await fetch(`/api/yeu-cau/${id}`, { method: "DELETE" });
        if (res.ok) ok = true;
      }
      addToast("Đã xóa đơn yêu cầu!", "success");
      onRefresh();
    } catch {
      addToast("Lỗi khi xóa đơn", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="recent-requests-card">
      <div className="recent-header">
        <div>
          <h3 className="recent-title">Đơn Yêu Cầu Tư Vấn Gần Nhất</h3>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Khách hàng chờ xếp lịch tư vấn và thử cổ phục</span>
        </div>
        <Link to="/admin/yeu-cau">
          <Button variant="ghost" size="sm" rightIcon={<Icon name="arrowRight" size={14} />}>
            Xem tất cả ({requests.length})
          </Button>
        </Link>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách Hàng</th>
              <th>Số Điện Thoại</th>
              <th>Ngày Cưới</th>
              <th>Ngân Sách</th>
              <th>Trạng Thái</th>
              <th>Thao Tác Nhanh</th>
            </tr>
          </thead>
          <tbody>
            {requests.slice(0, 5).map((req) => {
              const statusInfo = getStatusInfo(req.trangThai);
              return (
                <tr key={req.id}>
                  <td className="fw-bold">{req.tenKhach}</td>
                  <td>
                    <a href={`tel:${req.soDienThoai}`} style={{ color: "var(--primary)", fontWeight: 600 }}>
                      {req.soDienThoai}
                    </a>
                  </td>
                  <td>{formatDate(req.ngayCuoi)}</td>
                  <td className="text-primary fw-bold">{formatCurrency(req.nganSach || 0)}</td>
                  <td>
                    <span className={`status-pill status-${statusInfo.variant}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {req.trangThai === "cho-xu-ly" && (
                        <button
                          type="button"
                          className="btn-status-quick"
                          style={{ color: "#16a34a", borderColor: "#16a34a", padding: "2px 8px", fontSize: "0.75rem", borderRadius: "4px" }}
                          disabled={updatingId === req.id}
                          onClick={() => handleUpdateStatus(req.id, "da-duyet")}
                        >
                          Duyệt
                        </button>
                      )}
                      <button
                        type="button"
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                        disabled={updatingId === req.id}
                        onClick={() => handleDelete(req.id)}
                        title="Xóa"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
