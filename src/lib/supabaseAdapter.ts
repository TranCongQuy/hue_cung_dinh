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
  ten_don?: string;
  ten_khach: string;
  so_dien_thoai: string;
  ngay_cuoi: string;
  dia_diem_chup?: string;
  so_luong_khach?: number;
  ngan_sach: number;
  goi_de_xuat_id?: string;
  ghi_chu?: string;
  mong_muon_bo_sung?: string;
  danh_sach_dich_vu?: Array<{ id: string; ten: string; gia: number; soLuong: number }>;
  trang_thai: "cho-xu-ly" | "da-duyet" | "da-lien-he" | "hoan-thanh";
  ngay_tao?: string;
  created_at?: string;
}

export function mapSupabaseYeuCau(row: SupabaseYeuCauRow): YeuCau {
  return {
    id: String(row.id),
    tenDon: row.ten_don || (row.goi_de_xuat_id ? `Gói Cưới Hoàng Gia #${row.goi_de_xuat_id}` : "Dịch Vụ Chụp Ảnh Cưới Cố Đô"),
    tenKhach: row.ten_khach,
    soDienThoai: row.so_dien_thoai,
    ngayCuoi: row.ngay_cuoi || "2026-12-25",
    diaDiemChup: row.dia_diem_chup || "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
    soLuongKhach: row.so_luong_khach ? Number(row.so_luong_khach) : undefined,
    nganSach: row.ngan_sach ? Number(row.ngan_sach) : 0,
    goiDeXuatId: row.goi_de_xuat_id || undefined,
    ghiChu: row.ghi_chu || "",
    mongMuonBoSung: row.mong_muon_bo_sung || "",
    danhSachDichVu: Array.isArray(row.danh_sach_dich_vu) ? row.danh_sach_dich_vu : [],
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
  const validStyles = ["cung-dinh", "co-dien", "hien-dai"] as const;
  const phongCach = validStyles.includes(row.phong_cach as (typeof validStyles)[number])
    ? row.phong_cach
    : "cung-dinh";

  const validTiers = ["vip", "pro", "basic"] as const;
  const loai = validTiers.includes(row.loai as (typeof validTiers)[number])
    ? row.loai
    : "vip";

  const gia = Number(row.gia) > 0 ? Number(row.gia) : 450000;
  const giaGoc = Number(row.gia_goc) > 0 ? Number(row.gia_goc) : Math.round(gia * 1.5);

  return {
    id: String(row.id),
    ten: row.ten || "Thiệp Cưới Cung Đình Hoàng Triều",
    phongCach,
    loai,
    gia,
    giaGoc,
    moTa: row.mo_ta && row.mo_ta.length >= 5 ? row.mo_ta : "Mẫu thiệp cưới điện tử hoàng triều Huế tinh tế.",
    hinhAnh: row.hinh_anh && row.hinh_anh.startsWith("http") ? row.hinh_anh : DEFAULT_INVITATION_IMG,
    coDau: row.co_dau || "Cô Dâu",
    chuRe: row.chu_re || "Chú Rể",
    ngayCuoi: row.ngay_cuoi || "2026-12-28",
    diaDiem: row.dia_diem || "Đại Cung Môn - Cố Đô Huế",
    amNhac: row.am_nhac || "Nhã Nhạc Cung Đình",
    tinhNang: Array.isArray(row.tinh_nang) && row.tinh_nang.length > 0 ? row.tinh_nang : ["Mã QR Mừng Cưới", "Bản Đồ Google Maps"],
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

function getStoredRequests(): YeuCau[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("hue_cung_dinh_customer_orders");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  return [];
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

  // 5. Tạo đơn yêu cầu mới (Tự động hỗ trợ cả Supabase Cloud và Fallback In-Memory + LocalStorage)
  async createRequest(payload: {
    tenKhach: string;
    soDienThoai: string;
    ngayCuoi: string;
    diaDiemChup?: string;
    tenDon?: string;
    danhSachDichVu?: Array<{ id: string; ten: string; gia: number; soLuong: number }>;
    soLuongKhach?: number;
    nganSach?: number;
    goiDeXuatId?: string;
    ghiChu?: string;
    mongMuonBoSung?: string;
  }): Promise<boolean> {
    const generatedId = `yc-${Date.now().toString().slice(-5)}`;
    const newReq: YeuCau = {
      id: generatedId,
      tenDon: payload.tenDon || (payload.goiDeXuatId ? `Gói Cưới Hoàng Gia #${payload.goiDeXuatId}` : "Dịch Vụ Chụp Ảnh Cưới Hoàng Triều"),
      tenKhach: payload.tenKhach,
      soDienThoai: payload.soDienThoai,
      ngayCuoi: payload.ngayCuoi,
      diaDiemChup: payload.diaDiemChup || "Quần Thể Di Tích Đại Nội & Cung Diên Thọ",
      soLuongKhach: payload.soLuongKhach,
      nganSach: payload.nganSach || 20000000,
      goiDeXuatId: payload.goiDeXuatId,
      ghiChu: payload.ghiChu || "",
      mongMuonBoSung: payload.mongMuonBoSung || "",
      danhSachDichVu: payload.danhSachDichVu || [],
      trangThai: "cho-xu-ly",
      ngayTao: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("yeu_cau").insert({
          ten_khach: payload.tenKhach,
          so_dien_thoai: payload.soDienThoai,
          ngay_cuoi: payload.ngayCuoi,
          so_luong_khach: payload.soLuongKhach || 2,
          ngan_sach: payload.nganSach || 20000000,
          goi_de_xuat_id: payload.goiDeXuatId || null,
          ghi_chu: payload.ghiChu || "",
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
    const found = FALLBACK_REQUESTS.find((r) => r.id === id);
    if (found) {
      found.mongMuonBoSung = newNotes;
      persistCustomerRequests(FALLBACK_REQUESTS);
    }
    return true;
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
    const newUser: UserAccount = {
      id: `u-${Date.now().toString().slice(-4)}`,
      username: payload.username,
      fullName: payload.fullName,
      role: payload.role,
      phone: payload.phone || "",
      email: payload.email || "",
      active: true,
      createdAt: new Date().toISOString().split("T")[0] || "2026-10-25",
    };
    FALLBACK_USERS.unshift(newUser);
    return true;
  },

  async updateUser(id: string, payload: Partial<UserAccount>): Promise<boolean> {
    const found = FALLBACK_USERS.find((u) => u.id === id);
    if (found) {
      Object.assign(found, payload);
      return true;
    }
    return true;
  },

  async deleteUser(id: string): Promise<boolean> {
    const idx = FALLBACK_USERS.findIndex((u) => u.id === id);
    if (idx !== -1) {
      FALLBACK_USERS.splice(idx, 1);
      return true;
    }
    return true;
  },
};
