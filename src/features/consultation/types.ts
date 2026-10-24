import { z } from "zod";
import { goiCuoiSchema } from "../packages/types";
import { dichVuSchema } from "../services/types";

export const tuVanInputSchema = z.object({
  nganSach: z.coerce.number().min(10000000, "Ngân sách tối thiểu từ 10.000.000 ₫"),
  diaDiem: z.string().optional().default("dai-noi"),
  soTrangPhuc: z.coerce.number().min(1).max(5).optional().default(2),
  hinhThucChup: z.string().optional().default("ngoai-canh"),
  phongCach: z.enum(["all", "cung-dinh", "hien-dai", "co-dien"], {
    message: "Phong cách không hợp lệ",
  }),
  soLuongKhach: z.coerce.number().optional().default(100),
});

export const tuVanResultSchema = z.object({
  goiDeXuat: goiCuoiSchema,
  chenhLech: z.number(),
  duNganSach: z.boolean(),
  dichVuGoiYThem: z.array(dichVuSchema),
  phanTich: z.string(),
});

export type TuVanInput = z.infer<typeof tuVanInputSchema>;
export type TuVanResult = z.infer<typeof tuVanResultSchema>;
