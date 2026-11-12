import { z } from "zod";

export const thiepCuoiPhongCachSchema = z.enum([
  "cung-dinh",
  "co-dien",
  "hien-dai",
]);
export const thiepCuoiLoaiSchema = z.enum(["vip", "pro", "basic"]);

const imageUrlOrDataSchema = z
  .string()
  .refine(
    (val) => /^https?:\/\/.+|^data:image\/[a-zA-Z0-9.+-]+;base64,.+/.test(val.trim()),
    "Hình ảnh phải là đường dẫn URL hợp lệ hoặc tệp ảnh tải lên"
  );

export const thiepCuoiSchema = z.object({
  id: z.string().min(1, "Mã thiệp không được để trống"),
  ten: z.string().min(2, "Tên mẫu thiệp phải từ 2 ký tự"),
  phongCach: thiepCuoiPhongCachSchema,
  loai: thiepCuoiLoaiSchema,
  gia: z.number().nonnegative("Giá phải là số không âm"),
  giaGoc: z.number().nonnegative("Giá gốc phải là số không âm"),
  moTa: z.string().min(5, "Mô tả mẫu thiệp tối thiểu 5 ký tự"),
  hinhAnh: imageUrlOrDataSchema,
  coDau: z.string().min(1, "Tên cô dâu không được để trống"),
  chuRe: z.string().min(1, "Tên chú rể không được để trống"),
  ngayCuoi: z.string().min(1, "Ngày cưới không được để trống"),
  diaDiem: z.string().min(1, "Địa điểm không được để trống"),
  amNhac: z.string().optional(),
  tinhNang: z.array(z.string()).optional(),
});

export const thiepCuoiListSchema = z.array(thiepCuoiSchema);
export const taoThiepCuoiInputSchema = thiepCuoiSchema.omit({ id: true });

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

/* ==========================================================================
   DANH BẠ 15 NGÂN HÀNG VIỆT NAM (MÃ BIN NAPAS / VIETQR)
   ========================================================================== */
export interface BankBinInfo {
  code: string;
  bin: string;
  shortName: string;
  fullName: string;
}

export const BANK_BINS: BankBinInfo[] = [
  { code: "VCB", bin: "970436", shortName: "Vietcombank", fullName: "Ngân hàng TMCP Ngoại thương Việt Nam" },
  { code: "MB", bin: "970422", shortName: "MB Bank", fullName: "Ngân hàng TMCP Quân Đội" },
  { code: "TCB", bin: "970407", shortName: "Techcombank", fullName: "Ngân hàng TMCP Kỹ thương Việt Nam" },
  { code: "BIDV", bin: "970418", shortName: "BIDV", fullName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam" },
  { code: "ICB", bin: "970415", shortName: "VietinBank", fullName: "Ngân hàng TMCP Công thương Việt Nam" },
  { code: "ACB", bin: "970416", shortName: "ACB", fullName: "Ngân hàng TMCP Á Châu" },
  { code: "VPB", bin: "970432", shortName: "VPBank", fullName: "Ngân hàng TMCP Việt Nam Thịnh Vượng" },
  { code: "TPB", bin: "970423", shortName: "TPBank", fullName: "Ngân hàng TMCP Tiên Phong" },
  { code: "STB", bin: "970403", shortName: "Sacombank", fullName: "Ngân hàng TMCP Sài Gòn Thương Tín" },
  { code: "VBA", bin: "970405", shortName: "Agribank", fullName: "Ngân hàng Nông nghiệp và Phát triển Nông thôn" },
  { code: "HDB", bin: "970437", shortName: "HDBank", fullName: "Ngân hàng TMCP Phát triển TP.HCM" },
  { code: "VIB", bin: "970441", shortName: "VIB", fullName: "Ngân hàng TMCP Quốc tế Việt Nam" },
  { code: "SHB", bin: "970443", shortName: "SHB", fullName: "Ngân hàng TMCP Sài Gòn - Hà Nội" },
  { code: "MSB", bin: "970426", shortName: "MSB", fullName: "Ngân hàng TMCP Hàng Hải Việt Nam" },
  { code: "OCB", bin: "970448", shortName: "OCB", fullName: "Ngân hàng TMCP Phương Đông" },
];

export function resolveBankBin(bankNameOrCode: string): BankBinInfo {
  const normalized = bankNameOrCode.trim().toLowerCase();
  const exact = BANK_BINS.find(
    (b) =>
      b.code.toLowerCase() === normalized ||
      b.bin === normalized ||
      b.shortName.toLowerCase() === normalized ||
      b.fullName.toLowerCase() === normalized
  );
  if (exact) return exact;

  const partial = BANK_BINS.find((b) => {
    if (normalized.includes(b.shortName.toLowerCase())) return true;
    const wordRegex = new RegExp(`\\b${b.code.toLowerCase()}\\b`, "i");
    return wordRegex.test(normalized);
  });
  return partial ?? BANK_BINS[1]!;
}

export function buildVietQrImageUrl(params: {
  bankNameOrCode: string;
  accountNumber: string;
  accountName?: string;
  amount?: number;
  addInfo?: string;
}): string {
  const bank = resolveBankBin(params.bankNameOrCode);
  const cleanAcc = params.accountNumber.replace(/\s+/g, "") || "0905123456";
  const query = new URLSearchParams();
  if (params.amount && params.amount > 0) {
    query.set("amount", String(Math.round(params.amount)));
  }
  if (params.addInfo) {
    query.set("addInfo", params.addInfo);
  }
  if (params.accountName) {
    query.set("accountName", params.accountName.toUpperCase());
  }
  const qs = query.toString();
  return `https://img.vietqr.io/image/${bank.bin}-${cleanAcc}-compact2.png${qs ? `?${qs}` : ""}`;
}

/* ==========================================================================
   ĐẾM NGƯỢC THỜI GIAN THỰC TỚI NGÀY HÔN LỄ
   ========================================================================== */
export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function calculateCountdownParts(
  targetDateStr: string,
  nowMs: number = Date.now()
): CountdownParts {
  // Hỗ trợ cả YYYY-MM-DD và DD/MM/YYYY hoặc chuỗi ngày có số
  let targetMs = Date.parse(targetDateStr);
  if (Number.isNaN(targetMs)) {
    const dmyMatch = targetDateStr.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (dmyMatch) {
      const day = Number(dmyMatch[1]);
      const month = Number(dmyMatch[2]) - 1;
      const year = Number(dmyMatch[3]);
      targetMs = new Date(year, month, day, 9, 0, 0).getTime();
    }
  }
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, isExpired: false };
}

/* ==========================================================================
   THIỆP CƯỚI CHIA SẺ CÔNG KHAI (/thiep-cuoi/moi/:slug) + SỔ LƯU BÚT & RSVP
   ========================================================================== */
export const rsvpEntrySchema = z.object({
  id: z.string(),
  tenKhachMoi: z.string().min(2, "Vui lòng nhập họ tên khách mời (tối thiểu 2 ký tự)"),
  soDienThoai: z.string().optional(),
  phiaKhach: z.enum(["nha-trai", "nha-gai"]),
  trangThaiThamDu: z.enum(["tham-du", "ban-vieccao-loi"]),
  soLuongNguoi: z.number().int().min(1).max(10),
  cheDoAn: z.enum(["man", "chay"]),
  loiChuc: z.string().min(3, "Lời chúc tối thiểu 3 ký tự"),
  ngayGui: z.string(),
});

export const taoRsvpInputSchema = rsvpEntrySchema.omit({ id: true, ngayGui: true });

export const customShareInvitationSchema = z.object({
  slug: z.string().min(3),
  mauThiepId: z.string(),
  tenMauThiep: z.string(),
  phongCach: thiepCuoiPhongCachSchema,
  loai: thiepCuoiLoaiSchema,
  tenChuRe: z.string().min(2),
  tenCoDau: z.string().min(2),
  ngayCuoi: z.string().min(1),
  gioToChuc: z.string().default("10:30"),
  diaDiem: z.string().min(3),
  diaChiChiTiet: z.string().optional(),
  loiMoi: z.string().min(5),
  nganHang: z.string().default("MB"),
  soTaiKhoan: z.string().default("0905123456"),
  chuTaiKhoan: z.string().default("STUDIO HUE CUNG DINH"),
  soTienMungGoiY: z.number().nonnegative().default(500000),
  hinhAnh: imageUrlOrDataSchema,
  amNhac: z.string().optional(),
  nguoiTao: z.string().optional(),
  danhSachRsvp: z.array(rsvpEntrySchema).default([]),
  ngayTao: z.string(),
});

export const customShareInvitationListSchema = z.array(customShareInvitationSchema);

export type ThiepCuoiPhongCach = z.infer<typeof thiepCuoiPhongCachSchema>;
export type ThiepCuoiLoai = z.infer<typeof thiepCuoiLoaiSchema>;
export type ThiepCuoi = z.infer<typeof thiepCuoiSchema>;
export type TaoThiepCuoiInput = z.infer<typeof taoThiepCuoiInputSchema>;
export type DatThiepFormData = z.infer<typeof datThiepFormSchema>;
export type RsvpEntry = z.infer<typeof rsvpEntrySchema>;
export type TaoRsvpInput = z.infer<typeof taoRsvpInputSchema>;
export type CustomShareInvitation = z.infer<typeof customShareInvitationSchema>;

export interface GoiGiaThiep {
  loai: ThiepCuoiLoai;
  tenGoi: string;
  gia: number;
  giaGoc: number;
  tagline: string;
  noiBat?: boolean;
  tinhNang: string[];
}
