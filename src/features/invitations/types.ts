import { z } from "zod";

export const thiepCuoiPhongCachSchema = z.enum([
  "cung-dinh",
  "co-dien",
  "hien-dai",
]);
export const thiepCuoiLoaiSchema = z.enum(["vip", "pro", "basic"]);

export const thiepCuoiSchema = z.object({
  id: z.string().min(1, "Mã thiệp không được để trống"),
  ten: z.string().min(2, "Tên mẫu thiệp phải từ 2 ký tự"),
  phongCach: thiepCuoiPhongCachSchema,
  loai: thiepCuoiLoaiSchema,
  gia: z.number().nonnegative("Giá phải là số không âm"),
  giaGoc: z.number().nonnegative("Giá gốc phải là số không âm"),
  moTa: z.string().min(5, "Mô tả mẫu thiệp tối thiểu 5 ký tự"),
  hinhAnh: z.string().url("Hình ảnh phải là đường dẫn URL hợp lệ"),
  coDau: z.string().min(1, "Tên cô dâu không được để trống"),
  chuRe: z.string().min(1, "Tên chú rể không được để trống"),
  ngayCuoi: z.string().min(1, "Ngày cưới không được để trống"),
  diaDiem: z.string().min(1, "Địa điểm không được để trống"),
  amNhac: z.string().optional(),
  tinhNang: z.array(z.string()).optional(),
});

export const thiepCuoiListSchema = z.array(thiepCuoiSchema);

export const datThiepFormSchema = z.object({
  tenKhach: z.string().min(2, "Họ và tên quý khách phải từ 2 ký tự"),
  soDienThoai: z
    .string()
    .regex(
      /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
      "Số điện thoại không hợp lệ (10 chữ số)",
    ),
  tenCoDau: z.string().min(2, "Họ tên cô dâu phải từ 2 ký tự"),
  tenChuRe: z.string().min(2, "Họ tên chú rể phải từ 2 ký tự"),
  ngayCuoi: z.string().min(10, "Vui lòng chọn ngày tổ chức hôn lễ"),
  diaDiem: z.string().min(3, "Vui lòng nhập địa điểm tổ chức tiệc cưới"),
  mauThiepId: z.string().min(1, "Vui lòng chọn mẫu thiệp cưới"),
  goiDichVu: thiepCuoiLoaiSchema,
  ghiChu: z.string().optional(),
});

export type ThiepCuoiPhongCach = z.infer<typeof thiepCuoiPhongCachSchema>;
export type ThiepCuoiLoai = z.infer<typeof thiepCuoiLoaiSchema>;
export type ThiepCuoi = z.infer<typeof thiepCuoiSchema>;
export type DatThiepFormData = z.infer<typeof datThiepFormSchema>;

export interface GoiGiaThiep {
  loai: ThiepCuoiLoai;
  tenGoi: string;
  gia: number;
  giaGoc: number;
  tagline: string;
  noiBat?: boolean;
  tinhNang: string[];
}
