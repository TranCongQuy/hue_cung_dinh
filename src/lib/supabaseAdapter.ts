import { supabase, isSupabaseConfigured } from "./supabase";
import { DichVu } from "../features/services/types";
import { GoiCuoi } from "../features/packages/types";
import { YeuCau } from "../features/requests/types";
import { ThiepCuoi } from "../features/invitations/types";
import { UserAccount } from "../features/auth/types";

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
   2. SUPABASE ASYNC DATA SERVICE API
   ========================================================================== */
export const SupabaseService = {
  // 1. Dịch vụ lẻ
  async getServices(): Promise<DichVu[] | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from("dich_vu").select("*");
    if (error || !data || data.length === 0) return null;
    return (data as unknown as SupabaseDichVuRow[]).map(mapSupabaseDichVu);
  },

  // 2. Gói cưới
  async getPackages(): Promise<GoiCuoi[] | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from("goi_cuoi").select("*");
    if (error || !data || data.length === 0) return null;
    return (data as unknown as SupabaseGoiCuoiRow[]).map(mapSupabaseGoiCuoi);
  },

  // 3. Thiệp cưới
  async getInvitations(): Promise<ThiepCuoi[] | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from("thiep_cuoi").select("*");
    if (error || !data || data.length === 0) return null;
    return (data as unknown as SupabaseThiepCuoiRow[]).map(mapSupabaseThiepCuoi);
  },

  // 4. Đơn yêu cầu
  async getRequests(): Promise<YeuCau[] | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from("yeu_cau").select("*").order("ngay_tao", { ascending: false });
    if (error || !data) return null;
    return (data as unknown as SupabaseYeuCauRow[]).map(mapSupabaseYeuCau);
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
  },

  // 6. Tài khoản người dùng
  async getUsers(): Promise<UserAccount[] | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from("profiles").select("*");
    if (error || !data || data.length === 0) return null;
    return (data as unknown as SupabaseProfileRow[]).map(mapSupabaseProfile);
  },
};

