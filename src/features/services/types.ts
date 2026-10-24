import { z } from "zod";

export const loaiDichVuEnum = z.enum(["ao-dai", "tho-anh", "dia-diem", "trang-tri"], {
  message: "Phân loại dịch vụ không hợp lệ",
});

export const dichVuSchema = z.object({
  id: z.string(),
  ten: z.string().min(2, "Tên dịch vụ phải có ít nhất 2 ký tự"),
  loai: loaiDichVuEnum,
  gia: z.number().positive("Đơn giá phải lớn hơn 0"),
  moTa: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  hinhAnh: z.string().url("Hình ảnh phải là đường dẫn URL hợp lệ"),
  isTop: z.boolean().optional(),
});

export const dichVuListSchema = z.array(dichVuSchema);
export const taoDichVuInputSchema = dichVuSchema.omit({ id: true });

export type LoaiDichVu = z.infer<typeof loaiDichVuEnum>;
export type DichVu = z.infer<typeof dichVuSchema>;
export type TaoDichVuInput = z.infer<typeof taoDichVuInputSchema>;
