import { z } from "zod";

export const thongKeSchema = z.object({
  tongDon: z.number(),
  donChoXuLy: z.number(),
  tongDoanhThuDuKien: z.number(),
  tyLeThanhCong: z.number(),
  doanhThuTheoThang: z.array(
    z.object({
      thang: z.string(),
      doanhThu: z.number(),
    })
  ),
  tyLeGoiCuoi: z.array(
    z.object({
      tenGoi: z.string(),
      soLuong: z.number(),
      phanTram: z.number(),
    })
  ),
});

export type ThongKe = z.infer<typeof thongKeSchema>;

