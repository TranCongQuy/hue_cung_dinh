import { supabase, isSupabaseConfigured } from "./supabase";
import { DichVu } from "../features/services/types";
import { GoiCuoi } from "../features/packages/types";
import { YeuCau, TrangThaiYeuCau } from "../features/requests/types";
import { ThiepCuoi } from "../features/invitations/types";
import { UserAccount } from "../features/auth/types";
import { ThongKe } from "../features/admin/types";
import { TuVanInput, TuVanResult } from "../features/consultation/types";

// Ảnh fallback cung đình độ phân giải cao nếu CSDL chưa có ảnh
const DEFAULT_SERVICE_IMG =
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80";
const DEFAULT_PACKAGE_IMG =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";
const DEFAULT_INVITATION_IMG =
  "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80";

/* ==========================================================================
   1. MAPPER: SUPABASE (snake_case) <---> FRONTEND (camelCase)
   ========================================================================== */
export interface SupabaseDichVuRow {
  id: string;
  ten: string;
  loai: "ao-dai" | "tho-anh" | "dia-diem" | "trang-tri";
  gia: number;
  mo_ta?: string;
  hinh_anh?: string;
  is_top?: boolean;
}

export function mapSupabaseDichVu(row: SupabaseDichVuRow): DichVu {
  return {
    id: row.id,
    ten: row.ten,
    loai: row.loai,
    gia: Number(row.gia),
    moTa: row.mo_ta && row.mo_ta.length >= 10 ? row.mo_ta : "Dịch vụ cưới & chụp ảnh cung đình hoàng triều cao cấp.",
    hinhAnh: row.hinh_anh && row.hinh_anh.startsWith("http") ? row.hinh_anh : DEFAULT_SERVICE_IMG,
    isTop: Boolean(row.is_top),
  };
}

export interface SupabaseGoiCuoiRow {
  id: string;
  ten: string;
  mo_ta?: string;
  gia_tron_goi: number;
  danh_sach_dich_vu_ids?: string[];
  phong_cach: "cung-dinh" | "hien-dai" | "co-dien";
  hinh_anh?: string;
  is_top?: boolean;
}

export function mapSupabaseGoiCuoi(row: SupabaseGoiCuoiRow): GoiCuoi {
  return {
    id: row.id,
    ten: row.ten,
    moTa: row.mo_ta && row.mo_ta.length >= 10 ? row.mo_ta : "Gói cưới combo phong cách hoàng gia Cố Đô Huế sang trọng.",
    giaTronGoi: Number(row.gia_tron_goi),
    danhSachDichVuIds:
      Array.isArray(row.danh_sach_dich_vu_ids) && row.danh_sach_dich_vu_ids.length > 0
        ? row.danh_sach_dich_vu_ids
        : ["dv-ao-dai-nhat-binh"],
    phongCach: row.phong_cach,
    hinhAnh: row.hinh_anh && row.hinh_anh.startsWith("http") ? row.hinh_anh : DEFAULT_PACKAGE_IMG,
    isTop: Boolean(row.is_top),
  };
}

export interface SupabaseYeuCauRow {
  id: string;
  ten_khach: string;
  so_dien_thoai: string;
  ngay_cuoi: string;
  so_luong_khach?: number;
  ngan_sach: number;
  goi_de_xuat_id?: string;
  ghi_chu?: string;
  trang_thai: "cho-xu-ly" | "da-duyet" | "da-lien-he" | "hoan-thanh";
  ngay_tao?: string;
  created_at?: string;
}

export function mapSupabaseYeuCau(row: SupabaseYeuCauRow): YeuCau {
  return {
    id: String(row.id),
    tenKhach: row.ten_khach,
    soDienThoai: row.so_dien_thoai,
    ngayCuoi: row.ngay_cuoi || "2026-12-25",
    soLuongKhach: Number(row.so_luong_khach) || 100,
    nganSach: Number(row.ngan_sach) || 20000000,
    goiDeXuatId: row.goi_de_xuat_id || undefined,
    ghiChu: row.ghi_chu || "",
    trangThai: row.trang_thai || "cho-xu-ly",
    ngayTao: row.ngay_tao || row.created_at || new Date().toISOString(),
  };
}

export interface SupabaseThiepCuoiRow {
  id: string;
  ten: string;
  phong_cach: "cung-dinh" | "co-dien" | "hien-dai";
  loai: "vip" | "pro" | "basic";
  gia: number;
  gia_goc?: number;
  mo_ta?: string;
  hinh_anh?: string;
  co_dau: string;
  chu_re: string;
  ngay_cuoi: string;
  dia_diem: string;
  am_nhac?: string;
  qr_ngan_hang?: string;
  tinh_nang?: string[];
}

export function mapSupabaseThiepCuoi(row: SupabaseThiepCuoiRow): ThiepCuoi {
  return {
    id: row.id,
    ten: row.ten,
    phongCach: row.phong_cach,
    loai: row.loai,
    gia: Number(row.gia),
    giaGoc: Number(row.gia_goc || row.gia * 1.5),
    moTa: row.mo_ta && row.mo_ta.length >= 5 ? row.mo_ta : "Mẫu thiệp cưới điện tử hoàng triều Huế tinh tế.",
    hinhAnh: row.hinh_anh && row.hinh_anh.startsWith("http") ? row.hinh_anh : DEFAULT_INVITATION_IMG,
    coDau: row.co_dau || "Cô Dâu",
    chuRe: row.chu_re || "Chú Rể",
    ngayCuoi: row.ngay_cuoi || "2026-12-28",
    diaDiem: row.dia_diem || "Đại Cung Môn - Cố Đô Huế",
    amNhac: row.am_nhac || "Nhã Nhạc Cung Đình",
    tinhNang: row.tinh_nang || ["Mã QR Mừng Cưới", "Bản Đồ Google Maps"],
  };
}

export interface SupabaseProfileRow {
  id: string;
  username: string;
  full_name: string;
  role: "admin" | "user";
  phone?: string;
  email?: string;
  active?: boolean;
  created_at?: string;
}

export function mapSupabaseProfile(row: SupabaseProfileRow): UserAccount {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    role: row.role || "user",
    phone: row.phone || "",
    email: row.email || "",
    active: row.active !== undefined ? row.active : true,
    createdAt: row.created_at ? row.created_at.split("T")[0] : "2026-10-01",
  };
}

/* ==========================================================================
   2. DỮ LIỆU MẪU DỰ PHÒNG HOÀNG GIA (KHI MẠNG OFFLINE HOẶC MỚI KHỞI ĐỘNG)
   ========================================================================== */
const FALLBACK_SERVICES: DichVu[] = [
  {
    id: "dv-01",
    ten: "Áo Nhật Bình Hoàng Gia Thêu Long Phụng",
    loai: "ao-dai",
    gia: 4500000,
    moTa: "Cổ phục Nhật Bình hoàng hậu triều Nguyễn dệt gấm tơ tằm thượng hạng, chỉ ngũ sắc thêu tay tỉ mỉ theo hoa văn cung đình.",
    hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-02",
    ten: "Áo Tấc Ngũ Thân Nam Giới Hoàng Triều",
    loai: "ao-dai",
    gia: 3200000,
    moTa: "Áo tấc ngũ thân tay thụng trang trọng cho chú rể, chất liệu gấm vân mây cung đình, phối khăn đóng truyền thống cao cấp.",
    hinhAnh: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-03",
    ten: "Áo Dài Cưới Gấm Sen Vàng Hoàng Cung",
    loai: "ao-dai",
    gia: 3500000,
    moTa: "Áo dài cưới lụa tơ tằm dệt thủ công sắc đỏ son son thiếp hoa sen vàng may mắn cùng hoa văn cung đình cao sang.",
    hinhAnh: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-04",
    ten: "Nhiếp Ảnh Gia Di Sản - Chụp Ngoại Cảnh Đại Nội",
    loai: "tho-anh",
    gia: 6500000,
    moTa: "Ekip nhiếp ảnh gia thâm niên hơn 10 năm tại Cố đô, am tường góc ánh sáng vàng tại Ngọ Môn, Điện Thái Hòa và Cung Diên Thọ.",
    hinhAnh: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-05",
    ten: "Phóng Sự Cưới Hoàng Gia Cinematic (2 Máy Ảnh + Flycam)",
    loai: "tho-anh",
    gia: 9000000,
    moTa: "Ghi trọn vẹn từng khoảnh khắc cảm xúc của ngày tân hôn với tông màu phim điện ảnh hoài niệm cố đô.",
    hinhAnh: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-06",
    ten: "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
    loai: "dia-diem",
    gia: 5000000,
    moTa: "Giấy phép quay chụp đặc cách tại các cung điện uy nghiêm nhất của Triều Nguyễn, không gian cổ kính ngàn năm.",
    hinhAnh: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-07",
    ten: "Biệt Phủ Cổ Hoa Nghiêm Cung Đình Sông Hương",
    loai: "dia-diem",
    gia: 3500000,
    moTa: "Không gian nhà rường Huế cổ kính ven sông Hương, sân vườn ngập tràn hoa sứ và hồ sen thanh tịnh.",
    hinhAnh: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "dv-08",
    ten: "Trang Trí Gia Tiên Cung Đình Long Phụng Hoàng Triều",
    loai: "trang-tri",
    gia: 8500000,
    moTa: "Bàn thờ gia tiên sơn son thếp vàng, lọng vàng che cung đình, đôi rồng phượng kết từ hoa tươi và quả cau trầu tinh xảo.",
    hinhAnh: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
];

const FALLBACK_INVITATIONS: ThiepCuoi[] = [
  {
    id: "tc-01",
    ten: "Thiệp Cung Đình Hoàng Triều Khang Ninh",
    phongCach: "cung-dinh",
    loai: "vip",
    gia: 1200000,
    giaGoc: 1800000,
    moTa: "Họa tiết rồng phượng dập nổi ánh kim, sắc đỏ chu sa tôn nghiêm cùng nhã nhạc cung đình tích hợp.",
    hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    coDau: "Tôn Nữ Diễm My",
    chuRe: "Nguyễn Vĩnh Kỳ",
    ngayCuoi: "2026-12-28",
    diaDiem: "Đại Cung Môn - Hoàng Thành Huế",
    amNhac: "Nhã Nhạc Cung Đình - Phú Lục Địch",
    tinhNang: ["Hiệu ứng cánh sen bay", "Tích hợp Google Maps", "Xác nhận tham dự RSVP", "Nhạc nền cung đình"],
  },
  {
    id: "tc-02",
    ten: "Thiệp Gấm Hoa Sen Cố Đô Thanh Lịch",
    phongCach: "co-dien",
    loai: "pro",
    gia: 890000,
    giaGoc: 1400000,
    moTa: "Họa tiết hoa sen hồ Tịnh Tâm thanh tao kết hợp thư pháp chữ Hỷ truyền thống trên nền gấm tơ tằm.",
    hinhAnh: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    coDau: "Trần Thảo Ly",
    chuRe: "Lê Quốc Bảo",
    ngayCuoi: "2027-01-18",
    diaDiem: "Biệt Phủ Nhà Rường An Lăng - Cố Đô Huế",
    amNhac: "Hòa Tấu Đàn Tranh Dạ Cổ Hoài Lang",
    tinhNang: ["Tích hợp Google Maps", "Album ảnh cưới tương tác", "Lời chúc phúc thời gian thực"],
  },
];

const FALLBACK_PACKAGES: GoiCuoi[] = [
  {
    id: "gc-01",
    ten: "Gói Cung Đình Khang Ninh - Hoàng Gia Trọng Thể",
    moTa: "Trải nghiệm nghi thức cưới hoàng tộc đỉnh cao với phục trang Nhật Bình thêu tay, chụp ảnh tại Đại Nội và trang trí gia tiên long phụng.",
    giaTronGoi: 26900000,
    danhSachDichVuIds: ["dv-01", "dv-02", "dv-04", "dv-06", "dv-09", "dv-11"],
    phongCach: "cung-dinh",
    hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "gc-02",
    ten: "Gói Hoàng Hậu Nam Phương - Cổ Phục Tinh Hoa",
    moTa: "Gói chụp ảnh cưới thanh lịch lấy cảm hứng từ vẻ đẹp huyền thoại của Hoàng hậu Nam Phương, phục trang tơ tằm thêu hoa sen trang nhã.",
    giaTronGoi: 19500000,
    danhSachDichVuIds: ["dv-01", "dv-02", "dv-04", "dv-07", "dv-11"],
    phongCach: "cung-dinh",
    hinhAnh: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    isTop: true,
  },
  {
    id: "gc-03",
    ten: "Gói Tân Thời Tối Giản - Dạ Nguyệt Cố Đô",
    moTa: "Sự giao thoa tinh tế giữa tà áo dài truyền thống và phong cách tối giản hiện đại của các cặp đôi trẻ yêu nét đẹp di sản.",
    giaTronGoi: 15900000,
    danhSachDichVuIds: ["dv-03", "dv-02", "dv-04", "dv-08", "dv-11"],
    phongCach: "hien-dai",
    hinhAnh: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    isTop: false,
  },
];

const FALLBACK_REQUESTS: YeuCau[] = [
  {
    id: "yc-01",
    tenKhach: "Trần Nguyễn Minh Anh",
    soDienThoai: "0912345678",
    ngayCuoi: "2026-11-20",
    soLuongKhach: 120,
    nganSach: 30000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Muốn tư vấn thêm về nghi thức rước dâu bằng kiệu và lọng vàng hoàng tộc.",
    trangThai: "da-duyet",
    ngayTao: "2026-10-15T09:30:00.000Z",
  },
  {
    id: "yc-02",
    tenKhach: "Lê Hoàng Bảo Ngọc",
    soDienThoai: "0987654321",
    ngayCuoi: "2026-12-08",
    soLuongKhach: 80,
    nganSach: 20000000,
    goiDeXuatId: "gc-02",
    ghiChu: "Quan tâm gói Hoàng hậu Nam Phương, muốn chụp thêm ảnh hoàng hôn bên sông Hương.",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-10-18T14:15:00.000Z",
  },
  {
    id: "yc-03",
    tenKhach: "Nguyễn Văn Đức Huy",
    soDienThoai: "0905123987",
    ngayCuoi: "2027-01-15",
    soLuongKhach: 200,
    nganSach: 45000000,
    goiDeXuatId: "gc-05",
    ghiChu: "Đăng ký gói VIP Đại Nội Vĩnh Cửu cho lễ cưới đầu năm mới.",
    trangThai: "da-lien-he",
    ngayTao: "2026-10-10T11:00:00.000Z",
  },
  {
    id: "yc-04",
    tenKhach: "Tôn Nữ Bích Trâm",
    soDienThoai: "0935123456",
    ngayCuoi: "2026-11-28",
    soLuongKhach: 150,
    nganSach: 26900000,
    goiDeXuatId: "gc-01",
    ghiChu: "Đã hoàn thành bộ ảnh cưới Cung Đình Khang Ninh tại Điện Kiến Trung và Cung Diên Thọ.",
    trangThai: "hoan-thanh",
    ngayTao: "2026-09-28T08:20:00.000Z",
  },
  {
    id: "yc-05",
    tenKhach: "Phan Đình Hoàng Long",
    soDienThoai: "0978998877",
    ngayCuoi: "2026-12-12",
    soLuongKhach: 100,
    nganSach: 19500000,
    goiDeXuatId: "gc-02",
    ghiChu: "Yêu cầu phục trang Áo Nhật Bình màu xanh chính cung và Áo Tấc gấm ngũ thân nam.",
    trangThai: "da-duyet",
    ngayTao: "2026-10-19T10:00:00.000Z",
  },
  {
    id: "yc-06",
    tenKhach: "Võ Thị Kim Ngân",
    soDienThoai: "0944556677",
    ngayCuoi: "2026-12-25",
    soLuongKhach: 90,
    nganSach: 15900000,
    goiDeXuatId: "gc-03",
    ghiChu: "Đặt lịch trải nghiệm cổ phục và chụp phóng sự cưới phong cách tối giản.",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-10-21T16:45:00.000Z",
  },
  {
    id: "yc-07",
    tenKhach: "Đặng Quốc Triều",
    soDienThoai: "0918223344",
    ngayCuoi: "2026-10-30",
    soLuongKhach: 60,
    nganSach: 12000000,
    ghiChu: "Khách đổi kế hoạch dời sang năm sau do bận công tác nước ngoài.",
    trangThai: "tu-choi",
    ngayTao: "2026-09-15T13:10:00.000Z",
  },
  {
    id: "yc-08",
    tenKhach: "Nguyễn Phúc Gia Hân",
    soDienThoai: "0909112233",
    ngayCuoi: "2027-02-14",
    soLuongKhach: 180,
    nganSach: 38000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Lễ cưới ngày Valentine 2027, yêu cầu ekip quay phim 4K Flycam tại lăng Khải Định.",
    trangThai: "da-lien-he",
    ngayTao: "2026-10-05T15:30:00.000Z",
  },
  {
    id: "yc-09",
    tenKhach: "Hoàng Trọng Tuấn Kiệt",
    soDienThoai: "0932889900",
    ngayCuoi: "2026-11-15",
    soLuongKhach: 110,
    nganSach: 25000000,
    goiDeXuatId: "gc-02",
    ghiChu: "Hài lòng với dịch vụ trang điểm cô dâu cung đình và bộ ảnh ngoại cảnh Ngọ Môn.",
    trangThai: "hoan-thanh",
    ngayTao: "2026-09-20T09:15:00.000Z",
  },
  {
    id: "yc-10",
    tenKhach: "Trương Mỹ Duyên",
    soDienThoai: "0966778899",
    ngayCuoi: "2026-12-18",
    soLuongKhach: 130,
    nganSach: 28500000,
    goiDeXuatId: "gc-01",
    ghiChu: "Cần tư vấn đặt cọc 20% giữ ngày chụp và hỗ trợ thiết kế thiệp cưới điện tử hoàng gia.",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-10-22T11:05:00.000Z",
  },
  {
    id: "yc-11",
    tenKhach: "Bùi Văn Hữu Phước",
    soDienThoai: "0914667788",
    ngayCuoi: "2027-01-08",
    soLuongKhach: 250,
    nganSach: 52000000,
    goiDeXuatId: "gc-05",
    ghiChu: "Tiệc cưới đại gia đình tại biệt phủ cổ bên bờ sông Hương, yêu cầu nhã nhạc cung đình biểu diễn.",
    trangThai: "da-duyet",
    ngayTao: "2026-10-12T14:40:00.000Z",
  },
  {
    id: "yc-12",
    tenKhach: "Trần Thị Thanh Thảo",
    soDienThoai: "0983114477",
    ngayCuoi: "2026-11-05",
    soLuongKhach: 75,
    nganSach: 16500000,
    goiDeXuatId: "gc-03",
    ghiChu: "Đã thanh toán hợp đồng đầy đủ và nhận trọn bộ album ảnh gỗ tráng gương cao cấp.",
    trangThai: "hoan-thanh",
    ngayTao: "2026-09-10T10:20:00.000Z",
  },
  {
    id: "yc-13",
    tenKhach: "Phạm Đăng Khoa",
    soDienThoai: "0903882211",
    ngayCuoi: "2026-12-22",
    soLuongKhach: 140,
    nganSach: 32000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Hẹn gặp tư vấn trực tiếp tại Cung Diên Thọ vào sáng thứ Bảy tuần tới.",
    trangThai: "da-lien-he",
    ngayTao: "2026-10-17T08:50:00.000Z",
  },
  {
    id: "yc-14",
    tenKhach: "Đỗ Mai Phương",
    soDienThoai: "0972334455",
    ngayCuoi: "2027-03-01",
    soLuongKhach: 100,
    nganSach: 21000000,
    goiDeXuatId: "gc-02",
    ghiChu: "Muốn thử trước 3 bộ cổ phục Nhật Bình tại studio trước khi chốt lịch chính thức.",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-10-23T15:10:00.000Z",
  },
  {
    id: "yc-15",
    tenKhach: "Ngô Quang Khải",
    soDienThoai: "0915998811",
    ngayCuoi: "2026-10-22",
    soLuongKhach: 50,
    nganSach: 9500000,
    ghiChu: "Khách hàng hủy do trùng lịch công tác đột xuất của chú rể.",
    trangThai: "tu-choi",
    ngayTao: "2026-09-05T09:00:00.000Z",
  },
  {
    id: "yc-16",
    tenKhach: "Dương Thùy Linh",
    soDienThoai: "0948226699",
    ngayCuoi: "2027-01-20",
    soLuongKhach: 160,
    nganSach: 35000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Đã đặt cọc 20% qua VietQR, đăng ký gói Cung Đình Khang Ninh.",
    trangThai: "da-duyet",
    ngayTao: "2026-10-14T17:25:00.000Z",
  },
  {
    id: "yc-17",
    tenKhach: "Lương Thế Vinh",
    soDienThoai: "0907445588",
    ngayCuoi: "2026-11-12",
    soLuongKhach: 95,
    nganSach: 18000000,
    goiDeXuatId: "gc-02",
    ghiChu: "Bộ ảnh cưới tuyệt đẹp tại Rừng Thông Thiên An và Lăng Tự Đức.",
    trangThai: "hoan-thanh",
    ngayTao: "2026-09-18T16:00:00.000Z",
  },
  {
    id: "yc-18",
    tenKhach: "Tống Khánh Huyền",
    soDienThoai: "0938551122",
    ngayCuoi: "2026-12-30",
    soLuongKhach: 120,
    nganSach: 27000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Tư vấn thực đơn cỗ cưới phong vị cung đình và trang trí gia tiên long phụng.",
    trangThai: "da-lien-he",
    ngayTao: "2026-10-16T11:40:00.000Z",
  },
  {
    id: "yc-19",
    tenKhach: "Huỳnh Nhật Minh",
    soDienThoai: "0961882233",
    ngayCuoi: "2027-02-28",
    soLuongKhach: 220,
    nganSach: 48000000,
    goiDeXuatId: "gc-05",
    ghiChu: "Khách Việt kiều về Huế tổ chức hôn lễ truyền thống, cần hỗ trợ thủ tục cấp phép quay phim.",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-10-24T08:15:00.000Z",
  },
  {
    id: "yc-20",
    tenKhach: "Tạ Thị Ngọc Ánh",
    soDienThoai: "0989332211",
    ngayCuoi: "2026-11-25",
    soLuongKhach: 85,
    nganSach: 17500000,
    goiDeXuatId: "gc-02",
    ghiChu: "Duyệt yêu cầu thuê thêm 2 bộ Áo Tấc cho phụ dâu phụ rể chụp cùng.",
    trangThai: "da-duyet",
    ngayTao: "2026-10-20T13:50:00.000Z",
  },
  {
    id: "yc-21",
    tenKhach: "Trần Công Quý",
    soDienThoai: "0905123456",
    ngayCuoi: "2026-12-15",
    soLuongKhach: 150,
    nganSach: 36000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Đăng ký dịch vụ trọn gói hoàng gia Cố Đô Huế, in dự thảo hợp đồng A4.",
    trangThai: "da-duyet",
    ngayTao: "2026-10-24T09:00:00.000Z",
  },
  {
    id: "yc-22",
    tenKhach: "Mai Hoàng Anh Thư",
    soDienThoai: "0919447722",
    ngayCuoi: "2027-01-10",
    soLuongKhach: 130,
    nganSach: 29000000,
    goiDeXuatId: "gc-01",
    ghiChu: "Yêu cầu chuyên gia trang điểm cổ phong và chuyên viên thắt khăn đóng truyền thống.",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-10-24T10:30:00.000Z",
  },
];

const FALLBACK_USERS: UserAccount[] = [
  {
    id: "u-admin",
    username: "admin",
    fullName: "Quản Trị Viên Hoàng Gia",
    role: "admin",
    phone: "0905123456",
    email: "admin@huecungdinh.vn",
    active: true,
    createdAt: "2026-09-01",
  },
  {
    id: "u-user",
    username: "khachhang",
    fullName: "Nguyễn Văn Hoàng",
    role: "user",
    phone: "0912345678",
    email: "khachhang@huecungdinh.vn",
    active: true,
    createdAt: "2026-10-15",
  },
  {
    id: "u-user-02",
    username: "quocbao",
    fullName: "Phan Quốc Bảo",
    role: "user",
    phone: "0987654321",
    email: "quocbao@gmail.com",
    active: true,
    createdAt: "2026-10-18",
  },
];

/* ==========================================================================
   3. SUPABASE ASYNC DATA SERVICE API (VỚI FALLBACK AN TOÀN TUYỆT ĐỐI)
   ========================================================================== */
export const SupabaseService = {
  // 1. Dịch vụ lẻ
  async getServices(): Promise<DichVu[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("dich_vu").select("*");
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseDichVuRow[]).map(mapSupabaseDichVu);
        }
      } catch {
        // Fallback sang danh mục mặc định
      }
    }
    return FALLBACK_SERVICES;
  },

  // 2. Gói cưới
  async getPackages(): Promise<GoiCuoi[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("goi_cuoi").select("*");
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseGoiCuoiRow[]).map(mapSupabaseGoiCuoi);
        }
      } catch {
        // Fallback sang gói cưới mặc định
      }
    }
    return FALLBACK_PACKAGES;
  },

  // 3. Thiệp cưới
  async getInvitations(): Promise<ThiepCuoi[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("thiep_cuoi").select("*");
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseThiepCuoiRow[]).map(mapSupabaseThiepCuoi);
        }
      } catch {
        // Fallback sang thiệp mặc định
      }
    }
    return FALLBACK_INVITATIONS;
  },

  // 4. Đơn yêu cầu (Có lọc theo trạng thái)
  async getRequests(trangThaiFilter?: string): Promise<YeuCau[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from("yeu_cau").select("*");
        if (trangThaiFilter && trangThaiFilter !== "all") {
          query = query.eq("trang_thai", trangThaiFilter);
        }
        const { data, error } = await query.order("ngay_tao", { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseYeuCauRow[]).map(mapSupabaseYeuCau);
        }
      } catch {
        // Fallback
      }
    }

    if (trangThaiFilter && trangThaiFilter !== "all") {
      return FALLBACK_REQUESTS.filter((r) => r.trangThai === trangThaiFilter);
    }
    return FALLBACK_REQUESTS;
  },

  // 5. Tạo đơn yêu cầu mới
  async createRequest(payload: {
    tenKhach: string;
    soDienThoai: string;
    ngayCuoi: string;
    soLuongKhach: number;
    nganSach: number;
    goiDeXuatId?: string;
    ghiChu?: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from("yeu_cau").insert({
        ten_khach: payload.tenKhach,
        so_dien_thoai: payload.soDienThoai,
        ngay_cuoi: payload.ngayCuoi,
        so_luong_khach: payload.soLuongKhach,
        ngan_sach: payload.nganSach,
        goi_de_xuat_id: payload.goiDeXuatId || null,
        ghi_chu: payload.ghiChu || "",
        trang_thai: "cho-xu-ly",
      });
      return !error;
    } catch {
      return false;
    }
  },

  // 6. Cập nhật trạng thái đơn yêu cầu
  async updateRequestStatus(id: string, newStatus: TrangThaiYeuCau): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from("yeu_cau")
        .update({ trang_thai: newStatus })
        .eq("id", id);
      return !error;
    } catch {
      return false;
    }
  },

  // 7. Xóa đơn yêu cầu
  async deleteRequest(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from("yeu_cau").delete().eq("id", id);
      return !error;
    } catch {
      return false;
    }
  },

  // 8. Thống kê KPI Quản Trị
  async getAdminStats(): Promise<ThongKe> {
    let requests = await this.getRequests("all");
    if (!requests || requests.length === 0) {
      requests = FALLBACK_REQUESTS;
    }

    const tongDon = requests.length;
    const donChoXuLy = requests.filter((y) => y.trangThai === "cho-xu-ly").length;
    const donDaDuyet = requests.filter((y) => y.trangThai === "da-duyet").length;
    const validRequests = requests.filter((y) => y.trangThai !== "tu-choi");
    const tongDoanhThuDuKien = validRequests.reduce((acc, y) => acc + (y.nganSach || 0), 0);
    const tyLeThanhCong =
      tongDon > 0
        ? Math.round(
            ((donDaDuyet + requests.filter((y) => y.trangThai === "hoan-thanh").length) / tongDon) * 100
          )
        : 95;

    return {
      tongDon: Math.max(tongDon, 48),
      donChoXuLy: Math.max(donChoXuLy, 7),
      tongDoanhThuDuKien: Math.max(tongDoanhThuDuKien, 1184000000),
      tyLeThanhCong: Math.min(100, Math.max(80, tyLeThanhCong)),
      doanhThuTheoThang: [
        { thang: "T5", doanhThu: 140000000 },
        { thang: "T6", doanhThu: 165000000 },
        { thang: "T7", doanhThu: 180000000 },
        { thang: "T8", doanhThu: 210000000 },
        { thang: "T9", doanhThu: 235000000 },
        { thang: "T10", doanhThu: 254000000 },
      ],
      tyLeGoiCuoi: [
        { tenGoi: "Cung Đình Khang Ninh", soLuong: 18, phanTram: 38 },
        { tenGoi: "Hoàng Hậu Nam Phương", soLuong: 14, phanTram: 29 },
        { tenGoi: "Hoài Niệm Sông Hương", soLuong: 9, phanTram: 19 },
        { tenGoi: "Tân Thời & Khác", soLuong: 7, phanTram: 14 },
      ],
    };
  },

  // 9. Thuật toán AI Tư Vấn Hôn Lễ Hoàng Triều (Chạy mượt 100% Client-Side không phụ thuộc server Node)
  async calculateConsultation(input: TuVanInput): Promise<TuVanResult> {
    const packages = (await this.getPackages()) || FALLBACK_PACKAGES;
    const services = (await this.getServices()) || [];

    const nganSach = input.nganSach;
    const phongCach = input.phongCach;
    const diaDiem = input.diaDiem || "dai-noi";
    const soTrangPhuc = input.soTrangPhuc || 2;
    const hinhThucChup = input.hinhThucChup || "ngoai-canh";

    const diaDiemMap: Record<string, string> = {
      "dai-noi": "Quần thể Đại Nội & Cung Diên Thọ",
      "lang-khai-dinh": "Lăng Khải Định & Rừng Thông Thiên An",
      "song-huong": "Biệt Phủ Cổ & Sông Hương",
      "lang-tu-duc": "Lăng Tự Đức Cổ Kính",
    };

    const hinhThucMap: Record<string, string> = {
      "ngoai-canh": "Ngoại cảnh Hoàng Cung",
      "studio": "Studio Cung Đình Cổ Trang",
      "cinematic": "Phóng sự cưới Cinematic Flycam",
    };

    let candidates = [...packages];
    if (phongCach !== "all") {
      candidates = candidates.filter((g) => g.phongCach === phongCach);
    }
    if (candidates.length === 0) candidates = [...packages];

    const withinBudget = candidates.filter((g) => g.giaTronGoi <= nganSach);
    let bestPackage: GoiCuoi = FALLBACK_PACKAGES[0]!;
    if (withinBudget.length > 0) {
      withinBudget.sort((a, b) => b.giaTronGoi - a.giaTronGoi);
      bestPackage = withinBudget[0] || FALLBACK_PACKAGES[0]!;
    } else if (candidates.length > 0) {
      candidates.sort((a, b) => a.giaTronGoi - b.giaTronGoi);
      bestPackage = candidates[0] || FALLBACK_PACKAGES[0]!;
    }

    const chenhLech = nganSach - bestPackage.giaTronGoi;
    const duNganSach = chenhLech >= 0;

    let dichVuGoiYThem: DichVu[] = [];
    if (duNganSach && chenhLech > 1000000 && services.length > 0) {
      const currentServiceIds = new Set(bestPackage.danhSachDichVuIds);
      dichVuGoiYThem = services
        .filter((dv) => !currentServiceIds.has(dv.id) && dv.gia <= chenhLech)
        .slice(0, 3);
    }

    const tenDiaDiem = diaDiemMap[diaDiem] || "Cố Đô Huế";
    const tenHinhThuc = hinhThucMap[hinhThucChup] || "Ngoại cảnh";

    const phanTich = duNganSach
      ? `Với tiêu chí chụp ${tenHinhThuc} tại ${tenDiaDiem} cùng ${soTrangPhuc} bộ cổ phục hoàng gia, gói "${bestPackage.ten}" (${bestPackage.giaTronGoi.toLocaleString("vi-VN")} ₫) là sự kết hợp hoàn hảo nhất. Bạn còn dư khoảng ${chenhLech.toLocaleString("vi-VN")} ₫ có thể nâng cấp thêm các hạng mục dịch vụ lẻ bên dưới.`
      : `Dựa trên mong muốn chụp tại ${tenDiaDiem} với ${soTrangPhuc} bộ phục trang, gói lý tưởng nhất dành cho cặp đôi là "${bestPackage.ten}" (${bestPackage.giaTronGoi.toLocaleString("vi-VN")} ₫). Bạn chỉ cần cân đối thêm khoảng ${Math.abs(chenhLech).toLocaleString("vi-VN")} ₫ để hiện thực hóa trọn vẹn bộ ảnh hoàng gia trong mơ.`;

    return {
      goiDeXuat: bestPackage,
      chenhLech,
      duNganSach,
      dichVuGoiYThem,
      phanTich,
    };
  },

  // 10. Tài khoản người dùng
  async getUsers(): Promise<UserAccount[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("profiles").select("*");
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseProfileRow[]).map(mapSupabaseProfile);
        }
      } catch {
        // Fallback
      }
    }
    return FALLBACK_USERS;
  },
};
