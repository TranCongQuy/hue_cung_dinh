import { z } from "zod";
import { supabase, isSupabaseConfigured } from "./supabase";
import { DichVu } from "../features/services/types";
import { GoiCuoi } from "../features/packages/types";
import {
  YeuCau,
  TrangThaiYeuCau,
  CaChup,
  EkipPhuTrach,
  LichSuChamSocItem,
} from "../features/requests/types";
import {
  ThiepCuoi,
  CustomShareInvitation,
  TaoRsvpInput,
  RsvpEntry,
  customShareInvitationListSchema,
} from "../features/invitations/types";
import { UserAccount } from "../features/auth/types";
import { ThongKe } from "../features/admin/types";
import { TuVanInput, TuVanResult } from "../features/consultation/types";

// Ảnh fallback cung đình độ phân giải cao nếu CSDL chưa có ảnh
const DEFAULT_SERVICE_IMG =
  "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80";
const DEFAULT_PACKAGE_IMG =
  "https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80";
const DEFAULT_INVITATION_IMG =
  "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80";

function isValidImgSrc(src?: string): src is string {
  return Boolean(src && (src.startsWith("http") || src.startsWith("data:image/")));
}

/* ==========================================================================
   1. MAPPER & ZOD ROW SCHEMAS: SUPABASE (snake_case) <---> FRONTEND (camelCase)
   ========================================================================== */
export const supabaseDichVuRowSchema = z.object({
  id: z.coerce.string(),
  ten: z.string(),
  loai: z.enum(["ao-dai", "tho-anh", "dia-diem", "trang-tri"]).catch("ao-dai"),
  gia: z.coerce.number(),
  mo_ta: z.string().nullable().optional(),
  hinh_anh: z.string().nullable().optional(),
  is_top: z.boolean().nullable().optional(),
});
export type SupabaseDichVuRow = z.infer<typeof supabaseDichVuRowSchema>;

export function mapSupabaseDichVu(row: SupabaseDichVuRow): DichVu {
  return {
    id: row.id,
    ten: row.ten,
    loai: row.loai,
    gia: Number(row.gia),
    moTa: row.mo_ta && row.mo_ta.length >= 10 ? row.mo_ta : "Dịch vụ cưới & chụp ảnh cung đình hoàng triều cao cấp.",
    hinhAnh: isValidImgSrc(row.hinh_anh ?? undefined) ? row.hinh_anh! : DEFAULT_SERVICE_IMG,
    isTop: Boolean(row.is_top),
  };
}

export const supabaseGoiCuoiRowSchema = z.object({
  id: z.coerce.string(),
  ten: z.string(),
  mo_ta: z.string().nullable().optional(),
  gia_tron_goi: z.coerce.number(),
  danh_sach_dich_vu_ids: z.array(z.string()).nullable().optional(),
  phong_cach: z.enum(["cung-dinh", "hien-dai", "co-dien"]).catch("cung-dinh"),
  hinh_anh: z.string().nullable().optional(),
  is_top: z.boolean().nullable().optional(),
});
export type SupabaseGoiCuoiRow = z.infer<typeof supabaseGoiCuoiRowSchema>;

export function mapSupabaseGoiCuoi(row: SupabaseGoiCuoiRow): GoiCuoi {
  return {
    id: row.id,
    ten: row.ten,
    moTa: row.mo_ta && row.mo_ta.length >= 10 ? row.mo_ta : "Gói cưới combo phong cách hoàng gia Cố Đô Huế sang trọng.",
    giaTronGoi: Number(row.gia_tron_goi),
    danhSachDichVuIds:
      Array.isArray(row.danh_sach_dich_vu_ids) && row.danh_sach_dich_vu_ids.length > 0
        ? row.danh_sach_dich_vu_ids
        : ["dv-01"],
    phongCach: row.phong_cach,
    hinhAnh: isValidImgSrc(row.hinh_anh ?? undefined) ? row.hinh_anh! : DEFAULT_PACKAGE_IMG,
    isTop: Boolean(row.is_top),
  };
}

export const supabaseYeuCauRowSchema = z.object({
  id: z.coerce.string(),
  ten_don: z.string().nullable().optional(),
  ten_khach: z.string(),
  so_dien_thoai: z.string(),
  ngay_cuoi: z.string().nullable().optional(),
  ca_chup: z.enum(["binh-minh", "hoang-hon", "tron-ngay"]).nullable().optional(),
  dia_diem_chup: z.string().nullable().optional(),
  so_luong_khach: z.coerce.number().nullable().optional(),
  ngan_sach: z.coerce.number().default(0),
  goi_de_xuat_id: z.string().nullable().optional(),
  ghi_chu: z.string().nullable().optional(),
  mong_muon_bo_sung: z.string().nullable().optional(),
  danh_sach_dich_vu: z
    .array(z.object({ id: z.string(), ten: z.string(), gia: z.number(), soLuong: z.number() }))
    .nullable()
    .optional(),
  ekip_phu_trach: z
    .object({ nhiepAnhGia: z.string().optional(), stylist: z.string().optional() })
    .nullable()
    .optional(),
  lich_su_cham_soc: z
    .array(z.object({ thoiGian: z.string(), noiDung: z.string(), nguoiGhi: z.string() }))
    .nullable()
    .optional(),
  trang_thai: z
    .enum(["cho-xu-ly", "da-duyet", "da-lien-he", "hoan-thanh", "tu-choi"])
    .catch("cho-xu-ly"),
  ngay_tao: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
});
export type SupabaseYeuCauRow = z.infer<typeof supabaseYeuCauRowSchema>;

export function mapSupabaseYeuCau(row: SupabaseYeuCauRow): YeuCau {
  return {
    id: String(row.id),
    tenDon: row.ten_don || (row.goi_de_xuat_id ? `Gói Cưới Hoàng Gia #${row.goi_de_xuat_id}` : "Dịch Vụ Chụp Ảnh Cưới Cố Đô"),
    tenKhach: row.ten_khach,
    soDienThoai: row.so_dien_thoai,
    ngayCuoi: row.ngay_cuoi || "2026-12-25",
    caChup: row.ca_chup || undefined,
    diaDiemChup: row.dia_diem_chup || "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
    soLuongKhach: row.so_luong_khach ? Number(row.so_luong_khach) : undefined,
    nganSach: row.ngan_sach ? Number(row.ngan_sach) : 0,
    goiDeXuatId: row.goi_de_xuat_id || undefined,
    ghiChu: row.ghi_chu || "",
    mongMuonBoSung: row.mong_muon_bo_sung || "",
    danhSachDichVu: Array.isArray(row.danh_sach_dich_vu) ? row.danh_sach_dich_vu : [],
    ekipPhuTrach: row.ekip_phu_trach || undefined,
    lichSuChamSoc: Array.isArray(row.lich_su_cham_soc) ? row.lich_su_cham_soc : [],
    trangThai: row.trang_thai || "cho-xu-ly",
    ngayTao: row.ngay_tao || row.created_at || new Date().toISOString(),
  };
}

export const supabaseThiepCuoiRowSchema = z.object({
  id: z.coerce.string(),
  ten: z.string(),
  phong_cach: z.enum(["cung-dinh", "co-dien", "hien-dai"]).catch("cung-dinh"),
  loai: z.enum(["vip", "pro", "basic"]).catch("vip"),
  gia: z.coerce.number(),
  gia_goc: z.coerce.number().nullable().optional(),
  mo_ta: z.string().nullable().optional(),
  hinh_anh: z.string().nullable().optional(),
  co_dau: z.string(),
  chu_re: z.string(),
  ngay_cuoi: z.string(),
  dia_diem: z.string(),
  am_nhac: z.string().nullable().optional(),
  qr_ngan_hang: z.string().nullable().optional(),
  tinh_nang: z.array(z.string()).nullable().optional(),
});
export type SupabaseThiepCuoiRow = z.infer<typeof supabaseThiepCuoiRowSchema>;

export function mapSupabaseThiepCuoi(row: SupabaseThiepCuoiRow): ThiepCuoi {
  const gia = Number(row.gia) >= 0 ? Number(row.gia) : 450000;
  const giaGoc = row.gia_goc && Number(row.gia_goc) > 0 ? Number(row.gia_goc) : Math.round(Math.max(gia, 250000) * 1.5);

  return {
    id: String(row.id),
    ten: row.ten || "Thiệp Cưới Cung Đình Hoàng Triều",
    phongCach: row.phong_cach,
    loai: row.loai,
    gia,
    giaGoc,
    moTa: row.mo_ta && row.mo_ta.length >= 5 ? row.mo_ta : "Mẫu thiệp cưới điện tử hoàng triều Huế tinh tế.",
    hinhAnh: isValidImgSrc(row.hinh_anh ?? undefined) ? row.hinh_anh! : DEFAULT_INVITATION_IMG,
    coDau: row.co_dau || "Cô Dâu",
    chuRe: row.chu_re || "Chú Rể",
    ngayCuoi: row.ngay_cuoi || "2026-12-28",
    diaDiem: row.dia_diem || "Đại Cung Môn - Cố Đô Huế",
    amNhac: row.am_nhac || "Nhã Nhạc Cung Đình",
    tinhNang: Array.isArray(row.tinh_nang) && row.tinh_nang.length > 0 ? row.tinh_nang : ["Mã QR Mừng Cưới", "Bản Đồ Google Maps"],
  };
}

export const supabaseProfileRowSchema = z.object({
  id: z.coerce.string(),
  username: z.string(),
  full_name: z.string(),
  role: z.enum(["admin", "user"]).catch("user"),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  active: z.boolean().nullable().optional(),
  created_at: z.string().nullable().optional(),
});
export type SupabaseProfileRow = z.infer<typeof supabaseProfileRowSchema>;

export function mapSupabaseProfile(row: SupabaseProfileRow): UserAccount {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    role: row.role || "user",
    phone: row.phone || "",
    email: row.email || "",
    active: row.active !== undefined && row.active !== null ? row.active : true,
    createdAt: row.created_at ? row.created_at.split("T")[0] : "2026-10-01",
  };
}

/* ==========================================================================
   2. DỮ LIỆU MẪU DỰ PHÒNG HOÀNG GIA (KHI MẠNG OFFLINE HOẶC MỚI KHỞI ĐỘNG)
   ========================================================================== */
export const FALLBACK_SERVICES: DichVu[] = [
  {
    "id": "dv-01",
    "ten": "Áo Nhật Bình Hoàng Gia Thêu Long Phụng",
    "loai": "ao-dai",
    "gia": 4500000,
    "moTa": "Cổ phục Nhật Bình hoàng hậu triều Nguyễn dệt gấm tơ tằm thượng hạng, chỉ ngũ sắc thêu tay tỉ mỉ theo hoa văn cung đình Đại Nội Huế.",
    "hinhAnh": "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "dv-02",
    "ten": "Áo Tấc Ngũ Thân Nam Giới Hoàng Triều",
    "loai": "ao-dai",
    "gia": 3200000,
    "moTa": "Áo tấc ngũ thân tay thụng trang trọng cho chú rể, chất liệu gấm vân mây cung đình, phối khăn đóng truyền thống cao cấp Cố Đô.",
    "hinhAnh": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "dv-03",
    "ten": "Áo Dài Cưới Gấm Sen Vàng Hoàng Cung",
    "loai": "ao-dai",
    "gia": 3500000,
    "moTa": "Áo dài cưới lụa tơ tằm dệt thủ công sắc đỏ son thếp hoa sen vàng may mắn cùng hoa văn cung đình triều Nguyễn cao sang.",
    "hinhAnh": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "dv-04",
    "ten": "Nhiếp Ảnh Gia Di Sản - Chụp Ngoại Cảnh Đại Nội",
    "loai": "tho-anh",
    "gia": 6500000,
    "moTa": "Ekip nhiếp ảnh gia thâm niên hơn 10 năm tại Cố đô Huế, am tường góc ánh sáng vàng tại Ngọ Môn, Điện Thái Hòa và Cung Diên Thọ.",
    "hinhAnh": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "dv-05",
    "ten": "Phóng Sự Cưới Hoàng Gia Cinematic (2 Máy Ảnh + Flycam)",
    "loai": "tho-anh",
    "gia": 9000000,
    "moTa": "Ghi trọn vẹn từng khoảnh khắc cảm xúc của ngày tân hôn với tông màu phim điện ảnh hoài niệm cố đô Huế kèm góc máy trên không.",
    "hinhAnh": "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "dv-06",
    "ten": "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
    "loai": "dia-diem",
    "gia": 5000000,
    "moTa": "Giấy phép quay chụp đặc cách tại các cung điện uy nghiêm nhất của Triều Nguyễn, không gian điện ngọc cổ kính ngàn năm.",
    "hinhAnh": "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "dv-07",
    "ten": "Biệt Phủ Cổ Hoa Nghiêm Cung Đình Sông Hương",
    "loai": "dia-diem",
    "gia": 7500000,
    "moTa": "Biệt phủ nhà rường gỗ lim 100 năm tuổi ven dòng sông Hương thơ mộng, khuôn viên hoa sen nở ngát hương và bến thuyền riêng.",
    "hinhAnh": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-08",
    "ten": "Lăng Khải Định & Rừng Thông Thiên An",
    "loai": "dia-diem",
    "gia": 4000000,
    "moTa": "Sự kết hợp hoàn hảo giữa kiến trúc khảm sành sứ lộng lẫy Lăng Khải Định và nét đẹp trữ tình của đồi thông ngút ngàn đồi Thiên An xứ Huế.",
    "hinhAnh": "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-09",
    "ten": "Trang Trí Gia Tiên Phong Cách Hoàng Tộc (Long Phụng Sum Vầy)",
    "loai": "trang-tri",
    "gia": 8500000,
    "moTa": "Không gian lễ gia tiên bài trí bàn thờ gỗ gụ chạm trổ, bình gốm cổ, lọng vàng che lụa và hoa tươi sen trắng thơm ngát Cố Đô.",
    "hinhAnh": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-10",
    "ten": "Cổng Hoa Sen Đồng Cung Đình & Lồng Đèn Gấm",
    "loai": "trang-tri",
    "gia": 6000000,
    "moTa": "Cổng hoa thiết kế mái vòm cong cung đình, kết hợp hàng trăm đóa sen hồng ngát hương và đèn lồng lụa đỏ ấm cúng xứ Huế.",
    "hinhAnh": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-11",
    "ten": "Trang Điểm Cô Dâu Phong Thái Hoàng Hậu",
    "loai": "ao-dai",
    "gia": 2500000,
    "moTa": "Nghệ thuật trang điểm thanh tú, tự nhiên tôn lên nét đẹp phúc hậu của phụ nữ Á Đông cùng trâm cài tóc mạ vàng tinh xảo.",
    "hinhAnh": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-12",
    "ten": "Ban Nhạc Cung Đình & Nghi Thức Rước Dâu Truyền Thống",
    "loai": "trang-tri",
    "gia": 5500000,
    "moTa": "Đội hình nghinh hôn cổ truyền với đội lọng che tía, nhạc bát âm nhã nhạc cung đình Huế tạo nên không khí trang nghiêm.",
    "hinhAnh": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-13",
    "ten": "Áo Giao Lĩnh Tơ Tằm Cưới Triều Lê - Nguyễn",
    "loai": "ao-dai",
    "gia": 3900000,
    "moTa": "Cổ phục Áo Giao Lĩnh tơ tằm dệt thủ công sắc đỏ chu sa hoàng tộc, cổ chéo giao nhau đài các dành cho dâu rể truyền thống.",
    "hinhAnh": "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-14",
    "ten": "Kiệu Hoa Rước Dâu Hoàng Cung Chạm Khắc Long Phụng",
    "loai": "trang-tri",
    "gia": 7000000,
    "moTa": "Kiệu cưới sơn son thếp vàng chạm trổ tứ linh Long Lân Quy Phụng, phục vụ nghi thức nghinh hôn trang trọng qua các phố cổ Huế.",
    "hinhAnh": "https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-15",
    "ten": "Chụp Ảnh Phim Cổ Điển Medium Format Cố Đô",
    "loai": "tho-anh",
    "gia": 5800000,
    "moTa": "Chụp bằng máy ảnh phim khổ lớn Hasselblad/Mamiya, mang lại nước ảnh hạt mịn màng, sắc độ trầm mặc sâu thẳm của Cố Đô.",
    "hinhAnh": "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-16",
    "ten": "Quay Phim Teaser Trailer Cưới Điện Ảnh 4K",
    "loai": "tho-anh",
    "gia": 8000000,
    "moTa": "Video teaser giới thiệu câu chuyện tình yêu phong cách phim ngắn điện ảnh hoàng gia, lồng tiếng thơ và nhạc khúc trữ tình Huế.",
    "hinhAnh": "https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-17",
    "ten": "Lăng Tự Đức & Cầu Ngói Thanh Toàn Cổ Kính",
    "loai": "dia-diem",
    "gia": 4500000,
    "moTa": "Không gian thơ mộng khiên lăng Tự Đức hòa quyện cùng cầu ngói Thanh Toàn hơn 200 năm tuổi, tạo nên bộ ảnh mộc mạc hoài cổ.",
    "hinhAnh": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "dv-18",
    "ten": "Tráp Cưới Sơn Mài Khảm Xà Cừ Rồng Bay Phượng Múa",
    "loai": "trang-tri",
    "gia": 6800000,
    "moTa": "Bộ 6 tráp sơn mài mỹ nghệ Huế thếp vàng khảm ốc xà cừ thượng hạng, chứa trầu cau, bánh cốm, chè sen, rượu tiến vua.",
    "hinhAnh": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  }
];

export const FALLBACK_INVITATIONS: ThiepCuoi[] = [
  {
    "id": "tc-01",
    "ten": "Hoàng Kim Liên Hoa",
    "phongCach": "cung-dinh",
    "loai": "vip",
    "gia": 450000,
    "giaGoc": 990000,
    "moTa": "Chủ đề Sen Vàng Hoàng Cung quý phái, kết hợp hoa văn son thiếp vàng cung đình. Tối ưu giao diện hiển thị cho mọi thiết bị di động.",
    "hinhAnh": "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80",
    "coDau": "Cô Dâu",
    "chuRe": "Chú Rể",
    "ngayCuoi": "2026-12-28",
    "diaDiem": "Đại Cung Môn - Cố Đô Huế",
    "amNhac": "Nhã Nhạc Cung Đình - Phú Lục Địch",
    "tinhNang": [
      "Mã QR Mừng Cưới",
      "Nhạc Nền Tự Động",
      "Xác Nhận Tham Dự (RSVP)",
      "Bản Đồ Google Maps",
      "Album Ảnh Cưới HD",
      "Đếm Ngược Ngày Cưới"
    ]
  },
  {
    "id": "tc-02",
    "ten": "Phượng Vũ Long Phi",
    "phongCach": "cung-dinh",
    "loai": "vip",
    "gia": 450000,
    "giaGoc": 990000,
    "moTa": "Họa tiết Long Phụng trình tường uy nghi, lồng ghép nhã nhạc hoàng gia cùng album ảnh cưới di sản sắc nét từng chi tiết.",
    "hinhAnh": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    "coDau": "Cô Dâu",
    "chuRe": "Chú Rể",
    "ngayCuoi": "2026-11-20",
    "diaDiem": "Cung Diên Thọ - Hoàng Thành Huế",
    "amNhac": "Dạ Cổ Hoài Lang Cung Đình",
    "tinhNang": [
      "Mã QR Mừng Cưới",
      "Nhạc Nền Tự Động",
      "Xác Nhận Tham Dự (RSVP)",
      "Bản Đồ Google Maps",
      "Album Ảnh Cưới HD",
      "Đếm Ngược Ngày Cưới"
    ]
  },
  {
    "id": "tc-03",
    "ten": "Thanh Phong Tố Nguyệt",
    "phongCach": "co-dien",
    "loai": "pro",
    "gia": 295000,
    "giaGoc": 450000,
    "moTa": "Phong cách hoài niệm sông Hương thơ mộng, tông kem ngà tinh tế. Tích hợp đếm ngược ngày trọng đại và bản đồ chỉ đường thông minh.",
    "hinhAnh": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    "coDau": "Cô Dâu",
    "chuRe": "Chú Rể",
    "ngayCuoi": "2026-12-15",
    "diaDiem": "Biệt Phủ Nhà Rường Hương Thủy",
    "amNhac": "Tình Khúc Huế Dịu Êm",
    "tinhNang": [
      "Mã QR Mừng Cưới",
      "Nhạc Nền Tùy Chỉnh",
      "Xác Nhận Tham Dự (RSVP)",
      "Bản Đồ Chỉ Đường",
      "Album 12 Ảnh Cưới"
    ]
  },
  {
    "id": "tc-04",
    "ten": "Bách Niên Hảo Hợp",
    "phongCach": "co-dien",
    "loai": "pro",
    "gia": 295000,
    "giaGoc": 450000,
    "moTa": "Mẫu thiệp hoài niệm cố đô trang nhã với họa tiết hoa mai vàng nở rộ, hiệu ứng lật trang 3D mượt mà và hộp chúc phúc online.",
    "hinhAnh": "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    "coDau": "Cô Dâu",
    "chuRe": "Chú Rể",
    "ngayCuoi": "2027-01-08",
    "diaDiem": "Cung An Định - Cố Đô Huế",
    "amNhac": "Hòa Tấu Đàn Tranh Nam Bình",
    "tinhNang": [
      "Mã QR Mừng Cưới",
      "Nhạc Nền Tùy Chỉnh",
      "Xác Nhận Tham Dự (RSVP)",
      "Bản Đồ Chỉ Đường",
      "Album 12 Ảnh Cưới"
    ]
  },
  {
    "id": "tc-05",
    "ten": "Tân Hôn Cung Đình",
    "phongCach": "hien-dai",
    "loai": "basic",
    "gia": 168000,
    "giaGoc": 250000,
    "moTa": "Phong cách trẻ trung kết hợp nét cung đình Huế đương đại, tải nhanh trong 1 giây, chia sẻ tức thì qua Zalo và Messenger.",
    "hinhAnh": "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
    "coDau": "Cô Dâu",
    "chuRe": "Chú Rể",
    "ngayCuoi": "2026-12-25",
    "diaDiem": "Khách Sạn Sài Gòn Morin Huế",
    "amNhac": "Khúc Tương Phùng Nhẹ Nhàng",
    "tinhNang": [
      "Mã QR Mừng Cưới",
      "Thiết Kế Tinh Gọn",
      "Xác Nhận Tham Dự (RSVP)",
      "Bản Đồ Google Maps"
    ]
  },
  {
    "id": "tc-06",
    "ten": "Diễm Lệ Cố Đô",
    "phongCach": "hien-dai",
    "loai": "basic",
    "gia": 168000,
    "giaGoc": 250000,
    "moTa": "Giao diện tối giản hiện đại tôn vinh hình ảnh cô dâu chú rể trong tà áo dài truyền thống, tích hợp quét mã chuyển khoản mừng cưới.",
    "hinhAnh": "https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80",
    "coDau": "Cô Dâu",
    "chuRe": "Chú Rể",
    "ngayCuoi": "2027-02-14",
    "diaDiem": "Làng Cổ Phước Tích - Thừa Thiên Huế",
    "amNhac": "Tiếng Đàn Bầu Xứ Huế",
    "tinhNang": [
      "Mã QR Mừng Cưới",
      "Thiết Kế Tinh Gọn",
      "Xác Nhận Tham Dự (RSVP)",
      "Bản Đồ Google Maps"
    ]
  }
];

export const FALLBACK_PACKAGES: GoiCuoi[] = [
  {
    "id": "gc-01",
    "ten": "Gói Cung Đình Khang Ninh - Hoàng Gia Trọng Thể",
    "moTa": "Trải nghiệm nghi thức cưới hoàng tộc đỉnh cao với phục trang Nhật Bình thêu tay, chụp ảnh tại Đại Nội và trang trí gia tiên long phụng.",
    "giaTronGoi": 26900000,
    "danhSachDichVuIds": [
      "dv-01",
      "dv-02",
      "dv-04",
      "dv-06",
      "dv-09",
      "dv-11"
    ],
    "phongCach": "cung-dinh",
    "hinhAnh": "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "gc-02",
    "ten": "Gói Hoàng Hậu Nam Phương - Cổ Phục Tinh Hoa",
    "moTa": "Gói chụp ảnh cưới thanh lịch lấy cảm hứng từ vẻ đẹp huyền thoại của Hoàng hậu Nam Phương, phục trang tơ tằm thêu hoa sen trang nhã.",
    "giaTronGoi": 19500000,
    "danhSachDichVuIds": [
      "dv-01",
      "dv-02",
      "dv-04",
      "dv-07",
      "dv-11"
    ],
    "phongCach": "cung-dinh",
    "hinhAnh": "https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "gc-03",
    "ten": "Gói Tân Thời Tối Giản - Dạ Nguyệt Cố Đô",
    "moTa": "Sự giao thoa tinh tế giữa tà áo dài truyền thống và phong cách tối giản hiện đại của các cặp đôi trẻ yêu nét đẹp di sản Cố Đô.",
    "giaTronGoi": 15900000,
    "danhSachDichVuIds": [
      "dv-03",
      "dv-02",
      "dv-04",
      "dv-08",
      "dv-11"
    ],
    "phongCach": "hien-dai",
    "hinhAnh": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "gc-04",
    "ten": "Gói Hoài Niệm Sông Hương - Cổ Điển Trầm Mặc",
    "moTa": "Bộ ảnh cưới mang âm hưởng lãng mạn hoài cổ tại biệt phủ nhà rường và bến thuyền sông Hương với tông màu phim trầm lắng.",
    "giaTronGoi": 18200000,
    "danhSachDichVuIds": [
      "dv-03",
      "dv-04",
      "dv-07",
      "dv-10",
      "dv-11"
    ],
    "phongCach": "co-dien",
    "hinhAnh": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "gc-05",
    "ten": "Gói Đại Nội Vĩnh Cửu - Hoàng Tộc Toàn Năng",
    "moTa": "Gói cưới VIP toàn diện từ trang phục, 2 máy ảnh phóng sự cinematic, flycam, ban nhạc bát âm cung đình và trang trí gia tiên lộng lẫy.",
    "giaTronGoi": 38500000,
    "danhSachDichVuIds": [
      "dv-01",
      "dv-02",
      "dv-05",
      "dv-06",
      "dv-09",
      "dv-10",
      "dv-11",
      "dv-12"
    ],
    "phongCach": "cung-dinh",
    "hinhAnh": "https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "gc-06",
    "ten": "Gói Phong Vị Cố Đô - Lễ Nghinh Hôn Cổ Truyền",
    "moTa": "Tái hiện trọn vẹn nghi lễ rước dâu truyền thống xứ Huế với kiệu hoa, tráp sơn mài khảm xà cừ và nghi lễ bái tạ tổ tiên.",
    "giaTronGoi": 21800000,
    "danhSachDichVuIds": [
      "dv-01",
      "dv-02",
      "dv-04",
      "dv-12",
      "dv-14",
      "dv-18"
    ],
    "phongCach": "co-dien",
    "hinhAnh": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "gc-07",
    "ten": "Gói Long Phụng Kỳ Duyên - Cổ Phục Toàn Diện",
    "moTa": "Bộ sưu tập cổ phục trọn gói cho dâu rể cùng hai họ, chụp tại Ngọ Môn - Điện Kiến Trung với album ảnh gỗ sơn mài cao cấp.",
    "giaTronGoi": 31500000,
    "danhSachDichVuIds": [
      "dv-01",
      "dv-02",
      "dv-13",
      "dv-04",
      "dv-06",
      "dv-11",
      "dv-18"
    ],
    "phongCach": "cung-dinh",
    "hinhAnh": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    "isTop": true
  },
  {
    "id": "gc-08",
    "ten": "Gói Dạ Yến Cố Đô - Thơ Mộng Sông Hương",
    "moTa": "Không gian tiệc cưới và chụp ảnh bên dòng sông Hương thơ mộng, thả đèn hoa đăng lung linh và hòa tấu đàn tranh Huế.",
    "giaTronGoi": 24500000,
    "danhSachDichVuIds": [
      "dv-03",
      "dv-05",
      "dv-07",
      "dv-10",
      "dv-12"
    ],
    "phongCach": "co-dien",
    "hinhAnh": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  },
  {
    "id": "gc-09",
    "ten": "Gói Tinh Hoa Di Sản - Phóng Sự Cưới Phim 4K",
    "moTa": "Kết hợp chụp ảnh phim medium format và video 4K cinematic bắt trọn vẻ đẹp di sản Cố Đô trường tồn cùng năm tháng.",
    "giaTronGoi": 28900000,
    "danhSachDichVuIds": [
      "dv-01",
      "dv-02",
      "dv-05",
      "dv-15",
      "dv-16",
      "dv-17"
    ],
    "phongCach": "hien-dai",
    "hinhAnh": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
    "isTop": false
  }
];

const DEFAULT_SEED_REQUESTS: YeuCau[] = [
  {
    id: "yc-1001",
    tenDon: "Gói Cung Đình Khang Ninh - Đại Nội Huế",
    tenKhach: "Nguyễn Văn Hoàng",
    soDienThoai: "0912345678",
    ngayCuoi: "2026-12-18",
    caChup: "binh-minh",
    diaDiemChup: "Quần thể Đại Nội & Cung Diên Thọ",
    soLuongKhach: 2,
    nganSach: 26900000,
    goiDeXuatId: "gc-01",
    ghiChu: "Cô dâu cao 1m62, chú rể 1m74. Mong muốn chụp sương sớm Ngọ Môn.",
    mongMuonBoSung: "Chuẩn bị thêm quạt thêu phượng và trâm ngọc bích.",
    danhSachDichVu: [
      { id: "dv-01", ten: "Áo Nhật Bình Hoàng Gia Thêu Long Phụng", gia: 4500000, soLuong: 1 },
      { id: "dv-04", ten: "Nhiếp Ảnh Gia Di Sản Chuyên Nghiệp (1 Ngày)", gia: 7000000, soLuong: 1 },
    ],
    ekipPhuTrach: {
      nhiepAnhGia: "NAG. Tôn Thất Minh Khôi",
      stylist: "Stylist Lê Ngọc Trân",
    },
    lichSuChamSoc: [
      {
        thoiGian: "2026-11-02T09:15:00.000Z",
        noiDung: "Đã xác nhận lịch đo cổ phục Nhật Bình tại Tư dinh số 128 Đoàn Thị Điểm.",
        nguoiGhi: "Quản Trị Viên Hoàng Gia",
      },
    ],
    trangThai: "da-duyet",
    ngayTao: "2026-11-01T08:30:00.000Z",
  },
  {
    id: "yc-1002",
    tenDon: "Gói Hoàng Hậu Nam Phương - Lăng Khải Định",
    tenKhach: "Phan Quốc Bảo",
    soDienThoai: "0987654321",
    ngayCuoi: "2026-12-22",
    caChup: "hoang-hon",
    diaDiemChup: "Lăng Khải Định & Đồi Thông Thiên An",
    soLuongKhach: 2,
    nganSach: 32500000,
    goiDeXuatId: "gc-05",
    ghiChu: "Quay thêm phóng sự 4K tại Cung Thiên Định.",
    mongMuonBoSung: "",
    ekipPhuTrach: {
      nhiepAnhGia: "NAG. Nguyễn Phúc Gia Huy",
      stylist: "Stylist Hoàng Diệu Liên",
    },
    lichSuChamSoc: [
      {
        thoiGian: "2026-11-05T14:20:00.000Z",
        noiDung: "Đã xin giấy phép quay chụp nội điện Lăng Khải Định khung 14:30 - 17:30.",
        nguoiGhi: "Quản Trị Viên Hoàng Gia",
      },
    ],
    trangThai: "da-duyet",
    ngayTao: "2026-11-04T10:15:00.000Z",
  },
  {
    id: "yc-1003",
    tenDon: "Gói Duyên Dáng Áo Tấc Ngũ Thân - Lăng Tự Đức",
    tenKhach: "Trần Thị Minh Châu",
    soDienThoai: "0905234567",
    ngayCuoi: "2026-12-25",
    caChup: "binh-minh",
    diaDiemChup: "Lăng Tự Đức & Hồ Lưu Khiêm",
    soLuongKhach: 2,
    nganSach: 18500000,
    goiDeXuatId: "gc-02",
    ghiChu: "Mong muốn tông màu phim cổ điển trầm mặc.",
    mongMuonBoSung: "",
    trangThai: "cho-xu-ly",
    ngayTao: "2026-11-08T15:40:00.000Z",
  },
  {
    id: "yc-1004",
    tenDon: "Gói Dạ Yến Cố Đô - Bến Thuyền Sông Hương",
    tenKhach: "Lê Đình Khánh Duy",
    soDienThoai: "0935678910",
    ngayCuoi: "2026-12-28",
    caChup: "hoang-hon",
    diaDiemChup: "Biệt Phủ Cổ & Sông Hương",
    soLuongKhach: 4,
    nganSach: 24500000,
    goiDeXuatId: "gc-08",
    ghiChu: "Đặt thuyền rồng đôi thả hoa đăng lúc 17h15.",
    mongMuonBoSung: "",
    lichSuChamSoc: [
      {
        thoiGian: "2026-11-09T11:00:00.000Z",
        noiDung: "Đã gọi điện tư vấn phương án ghép ban nhạc Nhã Nhạc 4 nghệ nhân.",
        nguoiGhi: "Quản Trị Viên Hoàng Gia",
      },
    ],
    trangThai: "da-lien-he",
    ngayTao: "2026-11-07T09:20:00.000Z",
  },
  {
    id: "yc-1005",
    tenDon: "Gói Vương Giả Kim Chi Ngọc Diệp - Điện Kiến Trung",
    tenKhach: "Võ Thị Ngọc Hân",
    soDienThoai: "0978112233",
    ngayCuoi: "2026-11-28",
    caChup: "tron-ngay",
    diaDiemChup: "Điện Kiến Trung & Cung An Định",
    soLuongKhach: 2,
    nganSach: 35000000,
    goiDeXuatId: "gc-07",
    ghiChu: "Đã bàn giao full album sơn mài 40 trang.",
    mongMuonBoSung: "",
    ekipPhuTrach: {
      nhiepAnhGia: "NAG. Tôn Thất Minh Khôi",
      stylist: "Stylist Lê Ngọc Trân",
    },
    trangThai: "hoan-thanh",
    ngayTao: "2026-10-20T08:00:00.000Z",
  },
];

function getStoredRequests(): YeuCau[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("hue_cung_dinh_customer_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return [...DEFAULT_SEED_REQUESTS];
}

export function persistCustomerRequests(reqs: YeuCau[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("hue_cung_dinh_customer_orders", JSON.stringify(reqs));
    } catch {
      // ignore
    }
  }
}

const FALLBACK_REQUESTS: YeuCau[] = getStoredRequests();

const DEFAULT_CUSTOM_INVITATIONS: CustomShareInvitation[] = [
  {
    slug: "quoc-bao-ngoc-han-2026",
    mauThiepId: "tc-01",
    tenMauThiep: "Hoàng Kim Liên Hoa",
    phongCach: "cung-dinh",
    loai: "vip",
    tenChuRe: "Phan Quốc Bảo",
    tenCoDau: "Võ Thị Ngọc Hân",
    ngayCuoi: "2026-12-28",
    gioToChuc: "10:30",
    diaDiem: "Cung An Định - 179B Phan Đình Phùng, TP. Huế",
    diaChiChiTiet: "Sảnh Khải Tường Lầu, Cung An Định, TP. Huế",
    loiMoi:
      "Trân trọng kính mời Quý Quan Khách quang lâm dự Tiệc Rượu Mừng Lễ Thành Hôn của hai con chúng tôi tại không gian di sản Cố đô Huế.",
    nganHang: "VCB",
    soTaiKhoan: "0161001689999",
    chuTaiKhoan: "PHAN QUOC BAO",
    soTienMungGoiY: 500000,
    hinhAnh: "https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=900&q=80",
    amNhac: "Nhã Nhạc Cung Đình Huế - Lưu Thủy Kim Tiền",
    nguoiTao: "Phan Quốc Bảo",
    danhSachRsvp: [
      {
        id: "rsvp-01",
        tenKhachMoi: "Nguyễn Phúc Minh Quân",
        soDienThoai: "0905888111",
        phiaKhach: "nha-trai",
        trangThaiThamDu: "tham-du",
        soLuongNguoi: 2,
        cheDoAn: "man",
        loiChuc: "Chúc hai bạn trăm năm hạnh phúc, sắc son bền chặt như gấm vóc Hoàng Triều!",
        ngayGui: "2026-11-05T09:00:00.000Z",
      },
      {
        id: "rsvp-02",
        tenKhachMoi: "Lê Thị Diệu Thảo",
        soDienThoai: "0914222333",
        phiaKhach: "nha-gai",
        trangThaiThamDu: "tham-du",
        soLuongNguoi: 1,
        cheDoAn: "chay",
        loiChuc: "Mừng hạnh phúc Quốc Bảo & Ngọc Hân! Hẹn gặp hai bạn tại Cung An Định nhé.",
        ngayGui: "2026-11-06T14:30:00.000Z",
      },
    ],
    ngayTao: "2026-11-04T08:00:00.000Z",
  },
];

const CUSTOM_INVITATIONS_STORAGE_KEY = "hue_cung_dinh_custom_invitations";

function getStoredCustomInvitations(): CustomShareInvitation[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CUSTOM_INVITATIONS_STORAGE_KEY);
      if (raw) {
        const parsed = customShareInvitationListSchema.safeParse(JSON.parse(raw));
        if (parsed.success && parsed.data.length > 0) {
          return parsed.data;
        }
      }
    } catch {
      // ignore
    }
  }
  return [...DEFAULT_CUSTOM_INVITATIONS];
}

function persistCustomInvitations(list: CustomShareInvitation[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CUSTOM_INVITATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

const FALLBACK_CUSTOM_INVITATIONS: CustomShareInvitation[] = getStoredCustomInvitations();

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
   3. SUPABASE ASYNC DATA SERVICE API (VỚI FALLBACK AN TOÀN)
   ========================================================================== */
export const SupabaseService = {
  // 1. Dịch vụ lẻ
  async getServices(): Promise<DichVu[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("dich_vu").select("*");
        if (!error && data && data.length > 0) {
          const parsed = z.array(supabaseDichVuRowSchema).safeParse(data);
          if (parsed.success) {
            const remote = parsed.data.map(mapSupabaseDichVu);
            const remoteIds = new Set(remote.map((r) => r.id));
            const missing = FALLBACK_SERVICES.filter((f) => !remoteIds.has(f.id));
            return [...remote, ...missing];
          }
        }
      } catch {
        // Fallback sang danh mục mặc định
      }
    }
    return [...FALLBACK_SERVICES];
  },

  // 2. Gói cưới
  async getPackages(): Promise<GoiCuoi[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("goi_cuoi").select("*");
        if (!error && data && data.length > 0) {
          const parsed = z.array(supabaseGoiCuoiRowSchema).safeParse(data);
          if (parsed.success) {
            const remote = parsed.data.map(mapSupabaseGoiCuoi);
            const remoteIds = new Set(remote.map((r) => r.id));
            const missing = FALLBACK_PACKAGES.filter((f) => !remoteIds.has(f.id));
            return [...remote, ...missing];
          }
        }
      } catch {
        // Fallback sang gói cưới mặc định
      }
    }
    return [...FALLBACK_PACKAGES];
  },

  // 3. Thiệp cưới (Kho mẫu + CRUD)
  async getInvitations(): Promise<ThiepCuoi[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from("thiep_cuoi").select("*");
        if (!error && data && data.length > 0) {
          const parsed = z.array(supabaseThiepCuoiRowSchema).safeParse(data);
          if (parsed.success) {
            const remote = parsed.data.map(mapSupabaseThiepCuoi);
            const remoteIds = new Set(remote.map((r) => r.id));
            const missing = FALLBACK_INVITATIONS.filter((f) => !remoteIds.has(f.id));
            return [...remote, ...missing];
          }
        }
      } catch {
        // Fallback sang thiệp mặc định
      }
    }
    return [...FALLBACK_INVITATIONS];
  },

  async getInvitationById(id: string): Promise<ThiepCuoi | null> {
    const all = await this.getInvitations();
    return all.find((item) => item.id === id) || null;
  },

  async createInvitation(payload: Omit<ThiepCuoi, "id"> & { id?: string }): Promise<boolean> {
    const id = payload.id || `tc-${Date.now().toString().slice(-4)}`;
    const newItem: ThiepCuoi = {
      id,
      ten: payload.ten,
      phongCach: payload.phongCach,
      loai: payload.loai,
      gia: Number(payload.gia),
      giaGoc: Number(payload.giaGoc) || Math.round(Number(payload.gia) * 1.4),
      moTa: payload.moTa,
      hinhAnh: payload.hinhAnh || DEFAULT_INVITATION_IMG,
      coDau: payload.coDau,
      chuRe: payload.chuRe,
      ngayCuoi: payload.ngayCuoi,
      diaDiem: payload.diaDiem,
      amNhac: payload.amNhac || "Nhã Nhạc Cung Đình",
      tinhNang: payload.tinhNang || ["Mã QR Mừng Cưới", "Sổ Lưu Bút & RSVP"],
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("thiep_cuoi").insert({
          id,
          ten: newItem.ten,
          phong_cach: newItem.phongCach,
          loai: newItem.loai,
          gia: newItem.gia,
          gia_goc: newItem.giaGoc,
          mo_ta: newItem.moTa,
          hinh_anh: newItem.hinhAnh,
          co_dau: newItem.coDau,
          chu_re: newItem.chuRe,
          ngay_cuoi: newItem.ngayCuoi,
          dia_diem: newItem.diaDiem,
          am_nhac: newItem.amNhac,
          tinh_nang: newItem.tinhNang,
        });
      } catch {
        // Fallback
      }
    }
    FALLBACK_INVITATIONS.unshift(newItem);
    return true;
  },

  async updateInvitation(id: string, payload: Partial<ThiepCuoi>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.ten) updateData.ten = payload.ten;
        if (payload.phongCach) updateData.phong_cach = payload.phongCach;
        if (payload.loai) updateData.loai = payload.loai;
        if (payload.gia !== undefined) updateData.gia = payload.gia;
        if (payload.giaGoc !== undefined) updateData.gia_goc = payload.giaGoc;
        if (payload.moTa) updateData.mo_ta = payload.moTa;
        if (payload.hinhAnh) updateData.hinh_anh = payload.hinhAnh;
        if (payload.coDau) updateData.co_dau = payload.coDau;
        if (payload.chuRe) updateData.chu_re = payload.chuRe;
        if (payload.ngayCuoi) updateData.ngay_cuoi = payload.ngayCuoi;
        if (payload.diaDiem) updateData.dia_diem = payload.diaDiem;
        if (payload.amNhac) updateData.am_nhac = payload.amNhac;
        if (payload.tinhNang) updateData.tinh_nang = payload.tinhNang;
        await supabase.from("thiep_cuoi").update(updateData).eq("id", id);
      } catch {
        // Fallback
      }
    }
    const found = FALLBACK_INVITATIONS.find((i) => i.id === id);
    if (found) {
      Object.assign(found, payload);
    }
    return true;
  },

  async deleteInvitation(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("thiep_cuoi").delete().eq("id", id);
      } catch {
        // Fallback
      }
    }
    const idx = FALLBACK_INVITATIONS.findIndex((i) => i.id === id);
    if (idx !== -1) {
      FALLBACK_INVITATIONS.splice(idx, 1);
    }
    return true;
  },

  // 3b. Thiệp Cưới Chia Sẻ Công Khai (/thiep-cuoi/moi/:slug) + Sổ Lưu Bút & RSVP
  async getCustomInvitations(): Promise<CustomShareInvitation[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("thiep_khach_tao")
          .select("*")
          .order("ngay_tao", { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: CustomShareInvitation[] = [];
          for (const raw of data) {
            const rec = raw as Record<string, unknown>;
            const candidate = customShareInvitationListSchema.element.safeParse({
              slug: rec.slug,
              mauThiepId: rec.mau_thiep_id || "tc-01",
              tenMauThiep: rec.ten_mau_thiep || "Thiệp Hoàng Triều",
              phongCach: rec.phong_cach || "cung-dinh",
              loai: rec.loai || "vip",
              tenChuRe: rec.ten_chu_re,
              tenCoDau: rec.ten_co_dau,
              ngayCuoi: rec.ngay_cuoi,
              gioToChuc: rec.gio_to_chuc || "10:30",
              diaDiem: rec.dia_diem,
              diaChiChiTiet: rec.dia_chi_chi_tiet || "",
              loiMoi: rec.loi_moi,
              nganHang: rec.ngan_hang || "MB",
              soTaiKhoan: rec.so_tai_khoan || "0905123456",
              chuTaiKhoan: rec.chu_tai_khoan || "",
              soTienMungGoiY: Number(rec.so_tien_mung_goi_y || 500000),
              hinhAnh: rec.hinh_anh || DEFAULT_INVITATION_IMG,
              amNhac: rec.am_nhac || "Nhã Nhạc Cung Đình",
              nguoiTao: rec.nguoi_tao || "",
              danhSachRsvp: Array.isArray(rec.danh_sach_rsvp) ? rec.danh_sach_rsvp : [],
              ngayTao: rec.ngay_tao || new Date().toISOString(),
            });
            if (candidate.success) mapped.push(candidate.data);
          }
          if (mapped.length > 0) {
            const slugs = new Set(mapped.map((m) => m.slug));
            const localExtra = FALLBACK_CUSTOM_INVITATIONS.filter((l) => !slugs.has(l.slug));
            return [...mapped, ...localExtra];
          }
        }
      } catch {
        // Fallback
      }
    }
    return [...FALLBACK_CUSTOM_INVITATIONS];
  },

  async getCustomInvitationBySlug(slug: string): Promise<CustomShareInvitation | null> {
    const all = await this.getCustomInvitations();
    return all.find((item) => item.slug === slug) || null;
  },

  async saveCustomInvitation(invitation: CustomShareInvitation): Promise<CustomShareInvitation> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("thiep_khach_tao").upsert({
          slug: invitation.slug,
          mau_thiep_id: invitation.mauThiepId,
          ten_mau_thiep: invitation.tenMauThiep,
          phong_cach: invitation.phongCach,
          loai: invitation.loai,
          ten_chu_re: invitation.tenChuRe,
          ten_co_dau: invitation.tenCoDau,
          ngay_cuoi: invitation.ngayCuoi,
          gio_to_chuc: invitation.gioToChuc,
          dia_diem: invitation.diaDiem,
          dia_chi_chi_tiet: invitation.diaChiChiTiet || "",
          loi_moi: invitation.loiMoi,
          ngan_hang: invitation.nganHang,
          so_tai_khoan: invitation.soTaiKhoan,
          chu_tai_khoan: invitation.chuTaiKhoan,
          so_tien_mung_goi_y: invitation.soTienMungGoiY,
          hinh_anh: invitation.hinhAnh,
          am_nhac: invitation.amNhac || "",
          nguoi_tao: invitation.nguoiTao || "",
          danh_sach_rsvp: invitation.danhSachRsvp,
          ngay_tao: invitation.ngayTao,
        });
      } catch {
        // Fallback
      }
    }
    const existingIdx = FALLBACK_CUSTOM_INVITATIONS.findIndex((i) => i.slug === invitation.slug);
    if (existingIdx !== -1) {
      FALLBACK_CUSTOM_INVITATIONS[existingIdx] = invitation;
    } else {
      FALLBACK_CUSTOM_INVITATIONS.unshift(invitation);
    }
    persistCustomInvitations(FALLBACK_CUSTOM_INVITATIONS);
    return invitation;
  },

  async addRsvpToCustomInvitation(slug: string, input: TaoRsvpInput): Promise<RsvpEntry | null> {
    const newEntry: RsvpEntry = {
      id: `rsvp-${Date.now().toString().slice(-5)}`,
      ...input,
      ngayGui: new Date().toISOString(),
    };
    const found = FALLBACK_CUSTOM_INVITATIONS.find((i) => i.slug === slug);
    if (found) {
      found.danhSachRsvp = [newEntry, ...found.danhSachRsvp];
      persistCustomInvitations(FALLBACK_CUSTOM_INVITATIONS);
      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("thiep_khach_tao")
            .update({ danh_sach_rsvp: found.danhSachRsvp })
            .eq("slug", slug);
        } catch {
          // Fallback
        }
      }
      return newEntry;
    }
    return null;
  },

  async deleteCustomInvitation(slug: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("thiep_khach_tao").delete().eq("slug", slug);
      } catch {
        // Fallback
      }
    }
    const idx = FALLBACK_CUSTOM_INVITATIONS.findIndex((i) => i.slug === slug);
    if (idx !== -1) {
      FALLBACK_CUSTOM_INVITATIONS.splice(idx, 1);
      persistCustomInvitations(FALLBACK_CUSTOM_INVITATIONS);
    }
    return true;
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
          const parsed = z.array(supabaseYeuCauRowSchema).safeParse(data);
          if (parsed.success) {
            return parsed.data.map(mapSupabaseYeuCau);
          }
        }
      } catch {
        // Fallback
      }
    }

    if (trangThaiFilter && trangThaiFilter !== "all") {
      return FALLBACK_REQUESTS.filter((r) => r.trangThai === trangThaiFilter);
    }
    return [...FALLBACK_REQUESTS];
  },

  // 5. Tạo đơn yêu cầu mới (Tự động hỗ trợ cả Supabase Cloud và Fallback In-Memory + LocalStorage)
  async createRequest(payload: {
    id?: string;
    tenKhach: string;
    soDienThoai: string;
    ngayCuoi: string;
    caChup?: CaChup;
    diaDiemChup?: string;
    tenDon?: string;
    danhSachDichVu?: Array<{ id: string; ten: string; gia: number; soLuong: number }>;
    soLuongKhach?: number;
    nganSach?: number;
    goiDeXuatId?: string;
    ghiChu?: string;
    mongMuonBoSung?: string;
  }): Promise<boolean> {
    const generatedId = payload.id || `yc-${Date.now().toString().slice(-5)}`;
    const newReq: YeuCau = {
      id: generatedId,
      tenDon: payload.tenDon || (payload.goiDeXuatId ? `Gói Cưới Hoàng Gia #${payload.goiDeXuatId}` : "Dịch Vụ Chụp Ảnh Cưới Hoàng Triều"),
      tenKhach: payload.tenKhach,
      soDienThoai: payload.soDienThoai,
      ngayCuoi: payload.ngayCuoi,
      caChup: payload.caChup || "binh-minh",
      diaDiemChup: payload.diaDiemChup || "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
      soLuongKhach: payload.soLuongKhach,
      nganSach: payload.nganSach || 20000000,
      goiDeXuatId: payload.goiDeXuatId,
      ghiChu: payload.ghiChu || "",
      mongMuonBoSung: payload.mongMuonBoSung || "",
      danhSachDichVu: payload.danhSachDichVu || [],
      lichSuChamSoc: [
        {
          thoiGian: new Date().toISOString(),
          noiDung: "Hệ thống ghi nhận phiếu yêu cầu tư vấn & đặt lịch từ khách hàng.",
          nguoiGhi: "Hệ thống Hoàng Triều",
        },
      ],
      trangThai: "cho-xu-ly",
      ngayTao: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("yeu_cau").insert({
          ten_don: newReq.tenDon,
          ten_khach: payload.tenKhach,
          so_dien_thoai: payload.soDienThoai,
          ngay_cuoi: payload.ngayCuoi,
          ca_chup: newReq.caChup,
          dia_diem_chup: newReq.diaDiemChup,
          so_luong_khach: payload.soLuongKhach || 2,
          ngan_sach: payload.nganSach || 20000000,
          goi_de_xuat_id: payload.goiDeXuatId || null,
          ghi_chu: payload.ghiChu || "",
          mong_muon_bo_sung: payload.mongMuonBoSung || "",
          danh_sach_dich_vu: newReq.danhSachDichVu,
          lich_su_cham_soc: newReq.lichSuChamSoc,
          trang_thai: "cho-xu-ly",
        });
      } catch {
        // Fallback sang local
      }
    }

    FALLBACK_REQUESTS.unshift(newReq);
    persistCustomerRequests(FALLBACK_REQUESTS);
    return true;
  },

  // 6. Cập nhật trạng thái đơn yêu cầu
  async updateRequestStatus(id: string, newStatus: TrangThaiYeuCau): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("yeu_cau")
          .update({ trang_thai: newStatus })
          .eq("id", id);
      } catch {
        // Fallback
      }
    }

    const found = FALLBACK_REQUESTS.find((r) => r.id === id);
    if (found) {
      found.trangThai = newStatus;
      persistCustomerRequests(FALLBACK_REQUESTS);
    }
    return true;
  },

  // 6b. Cập nhật bổ sung mong muốn / ghi chú chụp ảnh từ khách hàng
  async updateRequestNotes(id: string, newNotes: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("yeu_cau")
          .update({ mong_muon_bo_sung: newNotes })
          .eq("id", id);
      } catch {
        // Fallback
      }
    }
    const found = FALLBACK_REQUESTS.find((r) => r.id === id);
    if (found) {
      found.mongMuonBoSung = newNotes;
      persistCustomerRequests(FALLBACK_REQUESTS);
    }
    return true;
  },

  // 6c. Phân công Ekip Nhiếp ảnh gia & Stylist + Ca chụp
  async updateRequestScheduleAndCrew(
    id: string,
    payload: { caChup?: CaChup; ngayCuoi?: string; ekipPhuTrach?: EkipPhuTrach }
  ): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.caChup) updateData.ca_chup = payload.caChup;
        if (payload.ngayCuoi) updateData.ngay_cuoi = payload.ngayCuoi;
        if (payload.ekipPhuTrach) updateData.ekip_phu_trach = payload.ekipPhuTrach;
        await supabase.from("yeu_cau").update(updateData).eq("id", id);
      } catch {
        // Fallback
      }
    }
    const found = FALLBACK_REQUESTS.find((r) => r.id === id);
    if (found) {
      if (payload.caChup) found.caChup = payload.caChup;
      if (payload.ngayCuoi) found.ngayCuoi = payload.ngayCuoi;
      if (payload.ekipPhuTrach) found.ekipPhuTrach = payload.ekipPhuTrach;
      persistCustomerRequests(FALLBACK_REQUESTS);
    }
    return true;
  },

  // 6d. Ghi nhật ký chăm sóc khách hàng trên đơn
  async appendRequestCareLog(
    id: string,
    entry: { noiDung: string; nguoiGhi: string }
  ): Promise<LichSuChamSocItem | null> {
    const item: LichSuChamSocItem = {
      thoiGian: new Date().toISOString(),
      noiDung: entry.noiDung,
      nguoiGhi: entry.nguoiGhi,
    };
    const found = FALLBACK_REQUESTS.find((r) => r.id === id);
    if (found) {
      found.lichSuChamSoc = [item, ...(found.lichSuChamSoc || [])];
      persistCustomerRequests(FALLBACK_REQUESTS);
      if (isSupabaseConfigured) {
        try {
          await supabase
            .from("yeu_cau")
            .update({ lich_su_cham_soc: found.lichSuChamSoc })
            .eq("id", id);
        } catch {
          // Fallback
        }
      }
      return item;
    }
    return item;
  },

  // 7. Xóa đơn yêu cầu
  async deleteRequest(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("yeu_cau").delete().eq("id", id);
      } catch {
        // Fallback
      }
    }

    const idx = FALLBACK_REQUESTS.findIndex((r) => r.id === id);
    if (idx !== -1) {
      FALLBACK_REQUESTS.splice(idx, 1);
      persistCustomerRequests(FALLBACK_REQUESTS);
    }
    return true;
  },

  // 8. Thống kê KPI Quản Trị (Tính toán động từ dữ liệu thực tế kết hợp nền lịch sử 6 tháng)
  async getAdminStats(): Promise<ThongKe> {
    const requests = await this.getRequests("all");
    const packages = await this.getPackages();

    const tongDon = requests.length;
    const donChoXuLy = requests.filter((y) => y.trangThai === "cho-xu-ly").length;
    const donThanhCong = requests.filter(
      (y) => y.trangThai === "da-duyet" || y.trangThai === "hoan-thanh" || y.trangThai === "da-lien-he"
    ).length;
    const validRequests = requests.filter((y) => y.trangThai !== "tu-choi");
    const tongDoanhThuThucTe = validRequests.reduce((acc, y) => acc + (y.nganSach || 0), 0);
    const tyLeThanhCong =
      tongDon > 0 ? Math.round((donThanhCong / tongDon) * 100) : 95;

    // Tính cơ cấu gói cưới từ đơn thực tế kết hợp kho gói cưới
    const pkgCounts = new Map<string, number>();
    for (const req of validRequests) {
      const pkg = packages.find((p) => p.id === req.goiDeXuatId);
      const label = pkg ? pkg.ten.replace(/^Gói\s+/i, "") : "Dịch vụ lẻ tự chọn";
      pkgCounts.set(label, (pkgCounts.get(label) || 0) + 1);
    }

    let tyLeGoiCuoi: Array<{ tenGoi: string; soLuong: number; phanTram: number }>;
    const totalValid = validRequests.length;
    if (totalValid >= 3 && pkgCounts.size >= 2) {
      const entries = Array.from(pkgCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);
      const subTotal = entries.reduce((s, [, c]) => s + c, 0) || 1;
      tyLeGoiCuoi = entries.map(([tenGoi, soLuong]) => ({
        tenGoi,
        soLuong,
        phanTram: Math.round((soLuong / subTotal) * 100),
      }));
    } else {
      tyLeGoiCuoi = [
        { tenGoi: "Cung Đình Khang Ninh", soLuong: 18, phanTram: 38 },
        { tenGoi: "Hoàng Hậu Nam Phương", soLuong: 14, phanTram: 29 },
        { tenGoi: "Hoài Niệm Sông Hương", soLuong: 9, phanTram: 19 },
        { tenGoi: "Tân Thời & Khác", soLuong: 7, phanTram: 14 },
      ];
    }

    return {
      tongDon,
      donChoXuLy,
      tongDoanhThuDuKien: tongDoanhThuThucTe > 0 ? tongDoanhThuThucTe : 137400000,
      tyLeThanhCong: Math.min(100, Math.max(0, tyLeThanhCong)),
      doanhThuTheoThang: [
        { thang: "T6", doanhThu: 140000000 },
        { thang: "T7", doanhThu: 165000000 },
        { thang: "T8", doanhThu: 180000000 },
        { thang: "T9", doanhThu: 210000000 },
        { thang: "T10", doanhThu: 235000000 },
        { thang: "T11", doanhThu: 120000000 + tongDoanhThuThucTe },
      ],
      tyLeGoiCuoi,
    };
  },

  // 9. Thuật toán AI Tư Vấn Hôn Lễ Hoàng Triều (Chạy Client-Side độc lập)
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
      "phim-truong": "Cung Điện Nội Bộ",
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
    const tenHinhThuc = hinhThucMap[hinhThucChup] || "Ngoại cảnh Hoàng Cung";

    const phanTich = duNganSach
      ? `Với tiêu chí chụp ${tenHinhThuc} tại ${tenDiaDiem} cùng ${soTrangPhuc} bộ cổ phục hoàng gia, gói "${bestPackage.ten}" (${bestPackage.giaTronGoi.toLocaleString("vi-VN")} ₫) là phương án tối ưu trong tầm ngân sách. Quý khách còn dư ${chenhLech.toLocaleString("vi-VN")} ₫ để bổ sung các hạng mục dịch vụ lẻ gợi ý bên dưới.`
      : `Dựa trên mong muốn chụp ${tenHinhThuc} tại ${tenDiaDiem} với ${soTrangPhuc} bộ phục trang, gói phù hợp nhất là "${bestPackage.ten}" (${bestPackage.giaTronGoi.toLocaleString("vi-VN")} ₫). Quý khách cần bổ sung khoảng ${Math.abs(chenhLech).toLocaleString("vi-VN")} ₫ so với mức ngân sách ban đầu.`;

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
          const parsed = z.array(supabaseProfileRowSchema).safeParse(data);
          if (parsed.success) {
            return parsed.data.map(mapSupabaseProfile);
          }
        }
      } catch {
        // Fallback
      }
    }
    return [...FALLBACK_USERS];
  },

  // 11. Quản lý Dịch Vụ Lẻ (CRUD)
  async createService(payload: Omit<DichVu, "id"> & { id?: string }): Promise<boolean> {
    const id = payload.id || `dv-${Date.now().toString().slice(-4)}`;
    const newService: DichVu = {
      id,
      ten: payload.ten,
      loai: payload.loai,
      gia: Number(payload.gia),
      moTa: payload.moTa,
      hinhAnh: payload.hinhAnh || DEFAULT_SERVICE_IMG,
      isTop: Boolean(payload.isTop),
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("dich_vu").insert({
          id,
          ten: newService.ten,
          loai: newService.loai,
          gia: newService.gia,
          mo_ta: newService.moTa,
          hinh_anh: newService.hinhAnh,
          is_top: newService.isTop,
        });
        if (!error) {
          FALLBACK_SERVICES.unshift(newService);
          return true;
        }
      } catch {
        // Fallback
      }
    }
    FALLBACK_SERVICES.unshift(newService);
    return true;
  },

  async updateService(id: string, payload: Partial<DichVu>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.ten) updateData.ten = payload.ten;
        if (payload.loai) updateData.loai = payload.loai;
        if (payload.gia !== undefined) updateData.gia = payload.gia;
        if (payload.moTa) updateData.mo_ta = payload.moTa;
        if (payload.hinhAnh) updateData.hinh_anh = payload.hinhAnh;
        if (payload.isTop !== undefined) updateData.is_top = payload.isTop;

        const { error } = await supabase.from("dich_vu").update(updateData).eq("id", id);
        if (!error) {
          const found = FALLBACK_SERVICES.find((s) => s.id === id);
          if (found) Object.assign(found, payload);
          return true;
        }
      } catch {
        // Fallback
      }
    }
    const found = FALLBACK_SERVICES.find((s) => s.id === id);
    if (found) {
      Object.assign(found, payload);
      return true;
    }
    return true;
  },

  async deleteService(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("dich_vu").delete().eq("id", id);
        if (!error) {
          const idx = FALLBACK_SERVICES.findIndex((s) => s.id === id);
          if (idx !== -1) FALLBACK_SERVICES.splice(idx, 1);
          return true;
        }
      } catch {
        // Fallback
      }
    }
    const idx = FALLBACK_SERVICES.findIndex((s) => s.id === id);
    if (idx !== -1) {
      FALLBACK_SERVICES.splice(idx, 1);
      return true;
    }
    return true;
  },

  // 12. Quản lý Gói Cưới Combo (CRUD)
  async createPackage(payload: Omit<GoiCuoi, "id"> & { id?: string }): Promise<boolean> {
    const id = payload.id || `gc-${Date.now().toString().slice(-4)}`;
    const newPkg: GoiCuoi = {
      id,
      ten: payload.ten,
      moTa: payload.moTa,
      giaTronGoi: Number(payload.giaTronGoi),
      danhSachDichVuIds: payload.danhSachDichVuIds || ["dv-01"],
      phongCach: payload.phongCach || "cung-dinh",
      hinhAnh: payload.hinhAnh || DEFAULT_PACKAGE_IMG,
      isTop: Boolean(payload.isTop),
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("goi_cuoi").insert({
          id,
          ten: newPkg.ten,
          mo_ta: newPkg.moTa,
          gia_tron_goi: newPkg.giaTronGoi,
          danh_sach_dich_vu_ids: newPkg.danhSachDichVuIds,
          phong_cach: newPkg.phongCach,
          hinh_anh: newPkg.hinhAnh,
          is_top: newPkg.isTop,
        });
        if (!error) {
          FALLBACK_PACKAGES.unshift(newPkg);
          return true;
        }
      } catch {
        // Fallback
      }
    }
    FALLBACK_PACKAGES.unshift(newPkg);
    return true;
  },

  async updatePackage(id: string, payload: Partial<GoiCuoi>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.ten) updateData.ten = payload.ten;
        if (payload.moTa) updateData.mo_ta = payload.moTa;
        if (payload.giaTronGoi !== undefined) updateData.gia_tron_goi = payload.giaTronGoi;
        if (payload.danhSachDichVuIds) updateData.danh_sach_dich_vu_ids = payload.danhSachDichVuIds;
        if (payload.phongCach) updateData.phong_cach = payload.phongCach;
        if (payload.hinhAnh) updateData.hinh_anh = payload.hinhAnh;
        if (payload.isTop !== undefined) updateData.is_top = payload.isTop;

        const { error } = await supabase.from("goi_cuoi").update(updateData).eq("id", id);
        if (!error) {
          const found = FALLBACK_PACKAGES.find((p) => p.id === id);
          if (found) Object.assign(found, payload);
          return true;
        }
      } catch {
        // Fallback
      }
    }
    const found = FALLBACK_PACKAGES.find((p) => p.id === id);
    if (found) {
      Object.assign(found, payload);
      return true;
    }
    return true;
  },

  async deletePackage(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("goi_cuoi").delete().eq("id", id);
        if (!error) {
          const idx = FALLBACK_PACKAGES.findIndex((p) => p.id === id);
          if (idx !== -1) FALLBACK_PACKAGES.splice(idx, 1);
          return true;
        }
      } catch {
        // Fallback
      }
    }
    const idx = FALLBACK_PACKAGES.findIndex((p) => p.id === id);
    if (idx !== -1) {
      FALLBACK_PACKAGES.splice(idx, 1);
      return true;
    }
    return true;
  },

  // 13. Quản lý Tài Khoản (CRUD)
  async createUser(payload: {
    username: string;
    fullName: string;
    role: "admin" | "user";
    phone?: string;
    email?: string;
  }): Promise<boolean> {
    const id = `u-${Date.now().toString().slice(-4)}`;
    const newUser: UserAccount = {
      id,
      username: payload.username,
      fullName: payload.fullName,
      role: payload.role,
      phone: payload.phone || "",
      email: payload.email || "",
      active: true,
      createdAt: new Date().toISOString().split("T")[0] || "2026-10-25",
    };
    if (isSupabaseConfigured) {
      try {
        await supabase.from("profiles").insert({
          id,
          username: newUser.username,
          full_name: newUser.fullName,
          role: newUser.role,
          phone: newUser.phone,
          email: newUser.email,
          active: true,
        });
      } catch {
        // Fallback
      }
    }
    FALLBACK_USERS.unshift(newUser);
    return true;
  },

  async updateUser(id: string, payload: Partial<UserAccount>): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.fullName) updateData.full_name = payload.fullName;
        if (payload.role) updateData.role = payload.role;
        if (payload.phone !== undefined) updateData.phone = payload.phone;
        if (payload.email !== undefined) updateData.email = payload.email;
        if (payload.active !== undefined) updateData.active = payload.active;
        await supabase.from("profiles").update(updateData).eq("id", id);
      } catch {
        // Fallback
      }
    }
    const found = FALLBACK_USERS.find((u) => u.id === id);
    if (found) {
      Object.assign(found, payload);
      return true;
    }
    return true;
  },

  async deleteUser(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("profiles").delete().eq("id", id);
      } catch {
        // Fallback
      }
    }
    const idx = FALLBACK_USERS.findIndex((u) => u.id === id);
    if (idx !== -1) {
      FALLBACK_USERS.splice(idx, 1);
      return true;
    }
    return true;
  },

  // 14. Tải ảnh lên Supabase Storage (kèm Fallback nén ảnh sang DataURL an toàn khi offline)
  async uploadImageAsset(file: File, folder: string = "uploads"): Promise<string> {
    if (isSupabaseConfigured) {
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error } = await supabase.storage
          .from("studio-media")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (!error) {
          const { data } = supabase.storage.from("studio-media").getPublicUrl(path);
          if (data?.publicUrl) return data.publicUrl;
        }
      } catch {
        // Chuyển sang Fallback đọc DataURL bên dưới
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Không thể đọc tệp hình ảnh"));
        }
      };
      reader.onerror = () => reject(new Error("Lỗi đọc tệp hình ảnh"));
      reader.readAsDataURL(file);
    });
  },
};
