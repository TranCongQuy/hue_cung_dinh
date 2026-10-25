export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const formatVND = formatCurrency;

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function getCategoryLabel(loai: string): string {
  switch (loai) {
    case "ao-dai":
      return "Áo Dài Cổ Phục";
    case "tho-anh":
      return "Nhiếp Ảnh Gia";
    case "dia-diem":
      return "Địa Điểm Di Sản";
    case "trang-tri":
      return "Trang Trí Hoàng Gia";
    default:
      return "Dịch Vụ Lẻ";
  }
}

export function getStyleLabel(phongCach: string): string {
  switch (phongCach) {
    case "cung-dinh":
      return "Cung Đình Triều Nguyễn";
    case "hien-dai":
      return "Tân Thời Tối Giản";
    case "co-dien":
      return "Hoài Niệm Cố Đô";
    default:
      return "Hoàng Triều";
  }
}

export function getStatusInfo(status: string): { label: string; variant: "warning" | "info" | "success" | "danger" } {
  switch (status) {
    case "cho-xu-ly":
      return { label: "Chờ duyệt", variant: "warning" };
    case "da-duyet":
      return { label: "Đã duyệt", variant: "success" };
    case "da-lien-he":
      return { label: "Đã liên hệ", variant: "info" };
    case "hoan-thanh":
      return { label: "Hoàn thành", variant: "success" };
    case "tu-choi":
      return { label: "Từ chối", variant: "danger" };
    default:
      return { label: "Chưa rõ", variant: "info" };
  }
}

/* ==========================================================================
   CHÍNH SÁCH HỦY ĐƠN & HOÀN CỌC PHÂN BẬC THEO THỜI GIAN (TIERED POLICY)
   ========================================================================== */
export interface RefundPolicyResult {
  daysRemaining: number;
  refundRate: number; // 1.0 (100%), 0.5 (50%), 0 (0%)
  refundPercent: number;
  depositAmount: number;
  refundAmount: number;
  feeAmount: number;
  tierLabel: string;
  tierVariant: "success" | "warning" | "danger";
  explanation: string;
}

export function calculateRefundPolicy(
  weddingDateStr: string,
  totalBudget: number,
  depositRate: number = 0.2
): RefundPolicyResult {
  const depositAmount = Math.round(totalBudget * depositRate);
  const weddingTime = new Date(weddingDateStr).getTime();
  const now = Date.now();

  // Tính số ngày còn lại đến hôn lễ (làm tròn lên)
  const diffDays = isNaN(weddingTime)
    ? 30
    : Math.ceil((weddingTime - now) / (1000 * 60 * 60 * 24));

  if (diffDays >= 15) {
    return {
      daysRemaining: diffDays,
      refundRate: 1.0,
      refundPercent: 100,
      depositAmount,
      refundAmount: depositAmount,
      feeAmount: 0,
      tierLabel: "Hoàn cọc 100%",
      tierVariant: "success",
      explanation: `Hủy trước ngày cưới ${diffDays} ngày (≥ 15 ngày): Quý khách đủ điều kiện hoàn 100% tiền đặt cọc giữ lịch.`,
    };
  } else if (diffDays >= 7) {
    const fee = Math.round(depositAmount * 0.5);
    return {
      daysRemaining: diffDays,
      refundRate: 0.5,
      refundPercent: 50,
      depositAmount,
      refundAmount: depositAmount - fee,
      feeAmount: fee,
      tierLabel: "Hoàn cọc 50%",
      tierVariant: "warning",
      explanation: `Hủy trước ngày cưới ${diffDays} ngày (từ 7 đến 14 ngày): Khấu trừ 50% tiền cọc chi phí chuẩn bị cổ phục và lịch ekip thợ ảnh.`,
    };
  } else {
    return {
      daysRemaining: Math.max(0, diffDays),
      refundRate: 0,
      refundPercent: 0,
      depositAmount,
      refundAmount: 0,
      feeAmount: depositAmount,
      tierLabel: "Phí hủy 100% (Không hoàn cọc)",
      tierVariant: "danger",
      explanation: `Hủy trước ngày cưới ${Math.max(0, diffDays)} ngày (< 7 ngày): Không hoàn cọc do lịch trình tại Di sản Đại Nội đã ấn định đặc cách.`,
    };
  }
}

/* ==========================================================================
   XUẤT DỮ LIỆU EXCEL / CSV THUẦN (PURE JS BLOB VỚI UTF-8 BOM)
   ========================================================================== */
export interface RequestExportData {
  id: string;
  tenKhach: string;
  soDienThoai: string;
  ngayCuoi: string;
  soLuongKhach?: number;
  nganSach: number;
  trangThai: string;
  ngayTao: string;
  ghiChu?: string;
}

export function exportRequestsToCSV(
  requests: RequestExportData[],
  filename = "danh-sach-don-hang-hue-cung-dinh.csv"
): boolean {
  if (!requests || requests.length === 0) return false;

  const headers = [
    "Mã Đơn",
    "Họ Tên Khách Hàng",
    "Số Điện Thoại",
    "Ngày Cưới Dự Kiến",
    "Số Khách",
    "Tổng Ngân Sách (VND)",
    "Tiền Cọc 20% (VND)",
    "Trạng Thái",
    "Ngày Khởi Tạo",
    "Yêu Cầu Đặc Biệt",
  ];

  const rows = requests.map((r) => [
    `"${r.id}"`,
    `"${(r.tenKhach || "").replace(/"/g, '""')}"`,
    `"${r.soDienThoai}"`,
    `"${r.ngayCuoi}"`,
    `"${r.soLuongKhach || 100}"`,
    `"${r.nganSach}"`,
    `"${Math.round(r.nganSach * 0.2)}"`,
    `"${getStatusInfo(r.trangThai).label}"`,
    `"${r.ngayTao}"`,
    `"${(r.ghiChu || "").replace(/"/g, '""')}"`,
  ]);

  // Thêm BOM UTF-8 (\uFEFF) để phần mềm Microsoft Excel hiển thị đúng tiếng Việt có dấu
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === "function") {
      URL.revokeObjectURL(url);
    }
  }
  return true;
}

export function exportRevenueStatsToCSV(
  stats: {
    tongDon: number;
    donChoXuLy: number;
    tongDoanhThuDuKien: number;
    tyLeThanhCong: number;
    doanhThuTheoThang: Array<{ thang: string; doanhThu: number }>;
    tyLeGoiCuoi: Array<{ tenGoi: string; soLuong: number; phanTram: number }>;
  },
  filename = "bao-cao-kpi-hue-cung-dinh.csv"
): boolean {
  const lines: string[] = [
    "BÁO CÁO THỐNG KÊ DOANH THU & KPI HOÀNG TRIỀU",
    `Thời gian xuất:,${new Date().toLocaleString("vi-VN")}`,
    "",
    "CHỈ SỐ TỔNG QUAN,GIÁ TRỊ",
    `Tổng số đơn yêu cầu,${stats.tongDon}`,
    `Đơn đang chờ xử lý,${stats.donChoXuLy}`,
    `Tổng doanh thu dự kiến (VND),${stats.tongDoanhThuDuKien}`,
    `Tỷ lệ hôn lễ thành công,${stats.tyLeThanhCong}%`,
    "",
    "DOANH THU THEO THÁNG,DOANH THU (VND)",
    ...stats.doanhThuTheoThang.map((m) => `${m.thang},${m.doanhThu}`),
    "",
    "TỶ TRỌNG GÓI CƯỚI,SỐ LƯỢNG ĐƠN,TỶ LỆ PHẦN TRĂM",
    ...stats.tyLeGoiCuoi.map((p) => `"${p.tenGoi}",${p.soLuong},${p.phanTram}%`),
  ];

  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === "function") {
      URL.revokeObjectURL(url);
    }
  }
  return true;
}


