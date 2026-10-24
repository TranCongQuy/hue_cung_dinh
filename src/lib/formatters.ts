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

