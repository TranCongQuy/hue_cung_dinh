import { describe, it, expect, beforeEach } from "vitest";
import {
  useWishlistStore,
  MAX_COMPARE_PACKAGES,
} from "../lib/wishlistStore";
import {
  BANK_BINS,
  resolveBankBin,
  buildVietQrImageUrl,
  calculateCountdownParts,
  taoRsvpInputSchema,
  customShareInvitationSchema,
} from "../features/invitations/types";
import { SupabaseService } from "../lib/supabaseAdapter";
import { HUE_HERITAGE_SPOTS } from "../pages/HeritageMapPage";

describe("Kiểm thử Chuyên sâu 12 Phân hệ Nâng cấp Hoàng Triều (Store, VietQR, RSVP & ERP)", () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
    useWishlistStore.getState().clearComparePackages();
    useWishlistStore.getState().closeCommandPalette();
  });

  /* ==========================================================================
     1. DANH SÁCH YÊU THÍCH, SO SÁNH GÓI CƯỚI (TỐI ĐA 3) & COMMAND PALETTE
     ========================================================================== */
  it("thêm và gỡ mục yêu thích trong useWishlistStore chính xác", () => {
    const added = useWishlistStore.getState().toggleWishlistItem({
      id: "dv-01",
      ten: "Áo Nhật Bình Hoàng Gia",
      gia: 4500000,
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      phanLoai: "dich-vu",
      duongDan: "/dich-vu/dv-01",
    });
    expect(added).toBe(true);
    expect(useWishlistStore.getState().isWishlisted("dv-01")).toBe(true);
    expect(useWishlistStore.getState().wishlist.length).toBe(1);

    const toggledOff = useWishlistStore.getState().toggleWishlistItem({
      id: "dv-01",
      ten: "Áo Nhật Bình Hoàng Gia",
      gia: 4500000,
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      phanLoai: "dich-vu",
      duongDan: "/dich-vu/dv-01",
    });
    expect(toggledOff).toBe(false);
    expect(useWishlistStore.getState().isWishlisted("dv-01")).toBe(false);
  });

  it("giới hạn so sánh tối đa 3 gói cưới và trả về 'limit' khi chọn gói thứ 4", () => {
    expect(MAX_COMPARE_PACKAGES).toBe(3);
    const makePkg = (id: string, gia: number) => ({
      id,
      ten: `Gói ${id}`,
      moTa: "Mô tả gói cưới",
      giaTronGoi: gia,
      danhSachDichVuIds: ["dv-01", "dv-02"],
      phongCach: "cung-dinh",
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
    });

    expect(useWishlistStore.getState().toggleComparePackage(makePkg("gc-01", 26900000))).toBe("added");
    expect(useWishlistStore.getState().toggleComparePackage(makePkg("gc-02", 18500000))).toBe("added");
    expect(useWishlistStore.getState().toggleComparePackage(makePkg("gc-03", 22900000))).toBe("added");
    expect(useWishlistStore.getState().comparePackages.length).toBe(3);

    // Gói thứ 4 phải bị chặn với mã "limit"
    expect(useWishlistStore.getState().toggleComparePackage(makePkg("gc-04", 35000000))).toBe("limit");
    expect(useWishlistStore.getState().comparePackages.length).toBe(3);

    // Gỡ 1 gói thành công trả về "removed"
    expect(useWishlistStore.getState().toggleComparePackage(makePkg("gc-02", 18500000))).toBe("removed");
    expect(useWishlistStore.getState().comparePackages.length).toBe(2);
  });

  it("điều khiển mở/đóng Command Palette (Ctrl + K) trong store", () => {
    expect(useWishlistStore.getState().isCommandPaletteOpen).toBe(false);
    useWishlistStore.getState().openCommandPalette();
    expect(useWishlistStore.getState().isCommandPaletteOpen).toBe(true);
    useWishlistStore.getState().toggleCommandPalette();
    expect(useWishlistStore.getState().isCommandPaletteOpen).toBe(false);
  });

  /* ==========================================================================
     2. DANH BẠ 15 NGÂN HÀNG VIETQR NAPAS & ĐẾM NGƯỢC THỜI GIAN THỰC
     ========================================================================== */
  it("cung cấp đúng 15 ngân hàng phổ biến tại Việt Nam trong BANK_BINS", () => {
    expect(BANK_BINS.length).toBe(15);
    const codes = BANK_BINS.map((b) => b.code);
    expect(codes).toContain("VCB");
    expect(codes).toContain("MB");
    expect(codes).toContain("TCB");
    expect(codes).toContain("BIDV");
    expect(codes).toContain("ACB");
  });

  it("phân giải mã BIN ngân hàng chính xác theo mã viết tắt, tên thương hiệu và fallback an toàn", () => {
    expect(resolveBankBin("VCB").bin).toBe("970436");
    expect(resolveBankBin("Techcombank").bin).toBe("970407");
    expect(resolveBankBin("BIDV").bin).toBe("970418");
    expect(resolveBankBin("Ngân hàng chưa rõ").bin).toBe("970422"); // Fallback MB Bank
  });

  it("sinh URL ảnh VietQR chuẩn với BIN động, số tiền và nội dung chuyển khoản", () => {
    const qrUrl = buildVietQrImageUrl({
      bankNameOrCode: "VCB",
      accountNumber: "0161 0016 89999",
      accountName: "Phan Quoc Bao",
      amount: 500000,
      addInfo: "Mung cuoi Quoc Bao Ngoc Han",
    });
    expect(qrUrl).toContain("https://img.vietqr.io/image/970436-0161001689999-compact2.png");
    expect(qrUrl).toContain("amount=500000");
    expect(qrUrl).toContain("accountName=PHAN+QUOC+BAO");
  });

  it("tính toán đồng hồ đếm ngược ngày-giờ-phút-giây chính xác cho ngày tương lai", () => {
    const baseNow = new Date("2026-12-01T00:00:00.000Z").getTime();
    const target = "2026-12-03T02:30:15.000Z";
    const parts = calculateCountdownParts(target, baseNow);

    expect(parts.isExpired).toBe(false);
    expect(parts.days).toBe(2);
    expect(parts.hours).toBe(2);
    expect(parts.minutes).toBe(30);
    expect(parts.seconds).toBe(15);
  });

  it("trả về trạng thái đã qua ngày cưới (isExpired = true) khi ngày đích nhỏ hơn hiện tại", () => {
    const now = new Date("2027-01-10T12:00:00.000Z").getTime();
    const past = calculateCountdownParts("2026-12-28", now);
    expect(past.isExpired).toBe(true);
    expect(past.days).toBe(0);
    expect(past.seconds).toBe(0);
  });

  it("hỗ trợ phân tích chuỗi ngày cưới định dạng DD/MM/YYYY trong calculateCountdownParts", () => {
    const now = new Date(2026, 10, 1, 9, 0, 0).getTime(); // 01/11/2026
    const parts = calculateCountdownParts("15/11/2026", now);
    expect(parts.isExpired).toBe(false);
    expect(parts.days).toBe(14);
  });

  /* ==========================================================================
     3. SCHEMA & CRUD THIỆP CƯỚI CHIA SẺ CÔNG KHAI + SỔ LƯU BÚT RSVP
     ========================================================================== */
  it("xác thực form khách mời gửi lời chúc & xác nhận tham dự (taoRsvpInputSchema)", () => {
    const validRsvp = {
      tenKhachMoi: "Tôn Thất Hoàng Minh",
      soDienThoai: "0905123789",
      phiaKhach: "nha-trai",
      trangThaiThamDu: "tham-du",
      soLuongNguoi: 2,
      cheDoAn: "chay",
      loiChuc: "Chúc hai bạn trăm năm hạnh phúc viên mãn!",
    };
    expect(taoRsvpInputSchema.safeParse(validRsvp).success).toBe(true);

    const invalidGuests = { ...validRsvp, soLuongNguoi: 25 };
    expect(taoRsvpInputSchema.safeParse(invalidGuests).success).toBe(false);
  });

  it("truy xuất thiệp chia sẻ công khai mặc định theo slug 'quoc-bao-ngoc-han-2026'", async () => {
    const found = await SupabaseService.getCustomInvitationBySlug("quoc-bao-ngoc-han-2026");
    expect(found).not.toBeNull();
    expect(found?.tenChuRe).toBe("Phan Quốc Bảo");
    expect(found?.tenCoDau).toBe("Võ Thị Ngọc Hân");
    expect(found?.nganHang).toBe("VCB");
  });

  it("phát hành thiệp chia sẻ mới, ghi nhận khách RSVP và xóa thiệp thành công", async () => {
    const newInvite = customShareInvitationSchema.parse({
      slug: "minh-khang-thao-vy-2026",
      mauThiepId: "tc-02",
      tenMauThiep: "Phượng Hoàng Cẩm Tú",
      phongCach: "cung-dinh",
      loai: "vip",
      tenChuRe: "Minh Khang",
      tenCoDau: "Thảo Vy",
      ngayCuoi: "2026-12-30",
      gioToChuc: "11:00",
      diaDiem: "Khách Sạn Indochine Palace Huế",
      loiMoi: "Trân trọng kính mời Quý khách đến dự lễ thành hôn của chúng tôi.",
      nganHang: "ACB",
      soTaiKhoan: "88996677",
      chuTaiKhoan: "NGUYEN MINH KHANG",
      soTienMungGoiY: 500000,
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      danhSachRsvp: [],
      ngayTao: "2026-11-12T10:00:00.000Z",
    });

    await SupabaseService.saveCustomInvitation(newInvite);
    const fetched = await SupabaseService.getCustomInvitationBySlug("minh-khang-thao-vy-2026");
    expect(fetched?.tenCoDau).toBe("Thảo Vy");

    const rsvp = await SupabaseService.addRsvpToCustomInvitation("minh-khang-thao-vy-2026", {
      tenKhachMoi: "Lê Quang Hải",
      phiaKhach: "nha-trai",
      trangThaiThamDu: "tham-du",
      soLuongNguoi: 3,
      cheDoAn: "man",
      loiChuc: "Chúc mừng hạnh phúc đôi trẻ!",
    });
    expect(rsvp).not.toBeNull();

    const updated = await SupabaseService.getCustomInvitationBySlug("minh-khang-thao-vy-2026");
    expect(updated?.danhSachRsvp.length).toBe(1);
    expect(updated?.danhSachRsvp[0]?.soLuongNguoi).toBe(3);

    await SupabaseService.deleteCustomInvitation("minh-khang-thao-vy-2026");
    const afterDelete = await SupabaseService.getCustomInvitationBySlug("minh-khang-thao-vy-2026");
    expect(afterDelete).toBeNull();
  });

  /* ==========================================================================
     4. QUẢN TRỊ KHO THIỆP STUDIO, ĐIỀU PHỐI EKIP, NHẬT KÝ CSKH & BẢN ĐỒ DI SẢN
     ========================================================================== */
  it("thêm, cập nhật và xóa mẫu thiệp cưới Studio qua SupabaseService", async () => {
    const before = await SupabaseService.getInvitations();
    const initialLen = before.length;
    expect(initialLen).toBeGreaterThanOrEqual(6);

    await SupabaseService.createInvitation({
      ten: "Mẫu Thiệp Hoàng Triều Thử Nghiệm",
      phongCach: "cung-dinh",
      loai: "vip",
      gia: 550000,
      giaGoc: 990000,
      moTa: "Thiết kế thử nghiệm ấn vàng cung đình",
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      coDau: "Ngọc Trân",
      chuRe: "Bảo Khánh",
      ngayCuoi: "2026-12-29",
      diaDiem: "Đại Nội Huế",
    });

    const afterCreate = await SupabaseService.getInvitations();
    expect(afterCreate.length).toBe(initialLen + 1);
    const createdId = afterCreate[0]!.id;

    await SupabaseService.updateInvitation(createdId, { gia: 600000 });
    const afterUpdate = await SupabaseService.getInvitationById(createdId);
    expect(afterUpdate?.gia).toBe(600000);

    await SupabaseService.deleteInvitation(createdId);
    const afterDelete = await SupabaseService.getInvitations();
    expect(afterDelete.length).toBe(initialLen);
  });

  it("phân công Ekip Nhiếp ảnh gia, Stylist cổ phục và ca chụp cho đơn yêu cầu", async () => {
    const ok = await SupabaseService.updateRequestScheduleAndCrew("yc-1003", {
      caChup: "hoang-hon",
      ekipPhuTrach: {
        nhiepAnhGia: "NAG. Tôn Thất Minh Khôi",
        stylist: "Stylist Lê Ngọc Trân",
      },
    });
    expect(ok).toBe(true);

    const requests = await SupabaseService.getRequests("all");
    const target = requests.find((r) => r.id === "yc-1003");
    expect(target?.caChup).toBe("hoang-hon");
    expect(target?.ekipPhuTrach?.nhiepAnhGia).toBe("NAG. Tôn Thất Minh Khôi");
  });

  it("ghi nhận bổ sung nhật ký chăm sóc khách hàng (CSKH Care Log) vào đơn yêu cầu", async () => {
    const entry = await SupabaseService.appendRequestCareLog("yc-1003", {
      noiDung: "Đã gửi bảng phối màu Áo Tấc xanh lục bảo qua Zalo cho cô dâu.",
      nguoiGhi: "Quản Trị Viên Hoàng Triều",
    });
    expect(entry).not.toBeNull();
    expect(entry?.noiDung).toContain("Áo Tấc xanh lục bảo");

    const requests = await SupabaseService.getRequests("all");
    const target = requests.find((r) => r.id === "yc-1003");
    expect((target?.lichSuChamSoc || []).length).toBeGreaterThanOrEqual(1);
  });

  it("hỗ trợ tải lên hình ảnh dạng DataURL base64 trong schema dịch vụ & gói cưới", async () => {
    const { dichVuSchema } = await import("../features/services/types");
    const sampleDataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const parsed = dichVuSchema.safeParse({
      id: "dv-upload-test",
      ten: "Dịch vụ tải ảnh trực tiếp",
      loai: "tho-anh",
      gia: 3500000,
      moTa: "Kiểm tra chấp nhận DataURL khi lưu ảnh offline",
      hinhAnh: sampleDataUrl,
    });
    expect(parsed.success).toBe(true);
  });

  it("thuật toán AI Tư Vấn hỗ trợ lựa chọn hình thức 'phim-truong' (Cung Điện Nội Bộ)", async () => {
    const res = await SupabaseService.calculateConsultation({
      nganSach: 35000000,
      soLuongKhach: 120,
      phongCach: "cung-dinh",
      diaDiem: "lang-khai-dinh",
      soTrangPhuc: 3,
      hinhThucChup: "phim-truong",
    });
    expect(res.phanTich).toContain("Cung Điện Nội Bộ");
    expect(res.phanTich).toContain("Lăng Khải Định");
  });

  it("tính toán động chỉ số KPI quản trị (getAdminStats) từ danh sách đơn thực tế", async () => {
    const stats = await SupabaseService.getAdminStats();
    const allReqs = await SupabaseService.getRequests("all");
    expect(stats.tongDon).toBe(allReqs.length);
    expect(stats.doanhThuTheoThang.length).toBe(6);
    expect(stats.tyLeGoiCuoi.length).toBeGreaterThanOrEqual(2);
  });

  it("Bản đồ Di sản Cố đô sở hữu đúng 9 tọa độ nhiếp ảnh chia thành 3 phân khu di sản", () => {
    expect(HUE_HERITAGE_SPOTS.length).toBe(9);
    const zones = new Set(HUE_HERITAGE_SPOTS.map((s) => s.zone));
    expect(zones.has("hoang-thanh")).toBe(true);
    expect(zones.has("lang-tam")).toBe(true);
    expect(zones.has("thien-nhien")).toBe(true);
  });
});
