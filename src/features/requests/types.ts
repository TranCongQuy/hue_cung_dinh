import { z } from "zod";

export const trangThaiYeuCauEnum = z.enum([
  "cho-xu-ly",
  "da-duyet",
  "da-lien-he",
  "hoan-thanh",
  "tu-choi",
], {
  message: "Trạng thái đơn yêu cầu không hợp lệ",
});

export const yeuCauDichVuItemSchema = z.object({
  id: z.string(),
  ten: z.string(),
  gia: z.number(),
  soLuong: z.number().default(1),
});
export type YeuCauDichVuItem = z.infer<typeof yeuCauDichVuItemSchema>;

export const yeuCauSchema = z.object({
  id: z.string(),
  tenDon: z.string().optional(),
  tenKhach: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không đúng định dạng Việt Nam"),
  ngayCuoi: z.string().min(1, "Vui lòng chọn ngày chụp dự kiến"),
  diaDiemChup: z.string().optional(),
  soLuongKhach: z.number().optional(),
  nganSach: z.number().default(0),
  goiDeXuatId: z.string().optional(),
  ghiChu: z.string().optional(),
  mongMuonBoSung: z.string().optional(),
  danhSachDichVu: z.array(yeuCauDichVuItemSchema).optional(),
  trangThai: trangThaiYeuCauEnum,
  ngayTao: z.string(),
});

export const yeuCauListSchema = z.array(yeuCauSchema);

export const taoYeuCauInputSchema = z.object({
  tenDon: z.string().optional(),
  tenKhach: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không đúng định dạng Việt Nam (10 chữ số)"),
  ngayCuoi: z.string().min(1, "Vui lòng chọn ngày chụp dự kiến"),
  diaDiemChup: z.string().optional(),
  soLuongKhach: z.coerce.number().optional(),
  nganSach: z.coerce.number().default(0),
  goiDeXuatId: z.string().optional(),
  ghiChu: z.string().optional(),
  mongMuonBoSung: z.string().optional(),
  danhSachDichVu: z.array(yeuCauDichVuItemSchema).optional(),
});

export type TrangThaiYeuCau = z.infer<typeof trangThaiYeuCauEnum>;
export type YeuCau = z.infer<typeof yeuCauSchema>;
export type TaoYeuCauInput = z.infer<typeof taoYeuCauInputSchema>;
