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

export const yeuCauSchema = z.object({
  id: z.string(),
  tenKhach: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không đúng định dạng Việt Nam"),
  ngayCuoi: z.string().min(1, "Vui lòng chọn ngày cưới dự kiến"),
  soLuongKhach: z.number().positive("Số lượng khách phải lớn hơn 0"),
  nganSach: z.number().positive("Ngân sách dự kiến phải lớn hơn 0"),
  goiDeXuatId: z.string().optional(),
  ghiChu: z.string().optional(),
  trangThai: trangThaiYeuCauEnum,
  ngayTao: z.string(),
});

export const yeuCauListSchema = z.array(yeuCauSchema);

export const taoYeuCauInputSchema = z.object({
  tenKhach: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không đúng định dạng Việt Nam (10 chữ số)"),
  ngayCuoi: z.string().min(1, "Vui lòng chọn ngày cưới dự kiến"),
  soLuongKhach: z.coerce.number().min(10, "Số lượng khách dự kiến tối thiểu 10 người"),
  nganSach: z.coerce.number().min(5000000, "Ngân sách tối thiểu 5.000.000 ₫"),
  goiDeXuatId: z.string().optional(),
  ghiChu: z.string().optional(),
});

export type TrangThaiYeuCau = z.infer<typeof trangThaiYeuCauEnum>;
export type YeuCau = z.infer<typeof yeuCauSchema>;
export type TaoYeuCauInput = z.infer<typeof taoYeuCauInputSchema>;
