import { z } from "zod";

export const phongCachGoiCuoiEnum = z.enum(["cung-dinh", "hien-dai", "co-dien"], {
  message: "Phong cách gói cưới không hợp lệ",
});

export const goiCuoiSchema = z.object({
  id: z.string(),
  ten: z.string().min(2, "Tên gói cưới phải có ít nhất 2 ký tự"),
  moTa: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  giaTronGoi: z.number().positive("Giá trọn gói phải lớn hơn 0"),
  danhSachDichVuIds: z.array(z.string()).min(1, "Gói cưới phải chứa ít nhất 1 dịch vụ"),
  phongCach: phongCachGoiCuoiEnum,
  hinhAnh: z.string().url("Hình ảnh phải là đường dẫn URL hợp lệ"),
  isTop: z.boolean().optional(),
});

export const goiCuoiListSchema = z.array(goiCuoiSchema);
export const taoGoiCuoiInputSchema = goiCuoiSchema.omit({ id: true });

export type PhongCachGoiCuoi = z.infer<typeof phongCachGoiCuoiEnum>;
export type GoiCuoi = z.infer<typeof goiCuoiSchema>;
export type TaoGoiCuoiInput = z.infer<typeof taoGoiCuoiInputSchema>;
