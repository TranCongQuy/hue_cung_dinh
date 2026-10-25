import { describe, it, expect } from "vitest";
import { dichVuSchema } from "../features/services/types";
import { goiCuoiSchema } from "../features/packages/types";
import { taoYeuCauInputSchema } from "../features/requests/types";
import { tuVanInputSchema } from "../features/consultation/types";

describe("Kiểm thực Dữ liệu Zod Schema (Type-Safety)", () => {
  it("xác thực dịch vụ lẻ hợp lệ thành công", () => {
    const validDichVu = {
      id: "dv-01",
      ten: "Áo Nhật Bình Hoàng Gia Thêu Long Phụng",
      loai: "ao-dai",
      gia: 4500000,
      moTa: "Cổ phục Nhật Bình hoàng hậu triều Nguyễn dệt gấm tơ tằm thượng hạng.",
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
    };
    const result = dichVuSchema.safeParse(validDichVu);
    expect(result.success).toBe(true);
  });

  it("từ chối dịch vụ lẻ có đơn giá âm", () => {
    const invalidDichVu = {
      id: "dv-99",
      ten: "Dịch vụ lỗi",
      loai: "ao-dai",
      gia: -500000,
      moTa: "Mô tả hợp lệ nhưng đơn giá âm",
      hinhAnh: "https://example.com/photo.jpg",
    };
    const result = dichVuSchema.safeParse(invalidDichVu);
    expect(result.success).toBe(false);
  });

  it("xác thực gói cưới combo với mảng dịch vụ thành phần", () => {
    const validPkg = {
      id: "gc-01",
      ten: "Gói Cung Đình Khang Ninh",
      moTa: "Trải nghiệm nghi thức cưới hoàng tộc đỉnh cao.",
      giaTronGoi: 26900000,
      danhSachDichVuIds: ["dv-01", "dv-02", "dv-04"],
      phongCach: "cung-dinh",
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
    };
    const result = goiCuoiSchema.safeParse(validPkg);
    expect(result.success).toBe(true);
  });

  it("xác thực số điện thoại Việt Nam trong đơn yêu cầu", () => {
    const validRequest = {
      tenKhach: "Nguyễn Văn A",
      soDienThoai: "0912345678",
      ngayCuoi: "2026-12-12",
      soLuongKhach: 120,
      nganSach: 25000000,
    };
    const result = taoYeuCauInputSchema.safeParse(validRequest);
    expect(result.success).toBe(true);

    const invalidPhoneRequest = {
      ...validRequest,
      soDienThoai: "12345",
    };
    const invalidResult = taoYeuCauInputSchema.safeParse(invalidPhoneRequest);
    expect(invalidResult.success).toBe(false);
  });

  it("yêu cầu ngân sách tối thiểu từ 10.000.000 ₫ trong form AI tư vấn", () => {
    const validTuVan = {
      nganSach: 20000000,
      soLuongKhach: 100,
      phongCach: "cung-dinh",
    };
    expect(tuVanInputSchema.safeParse(validTuVan).success).toBe(true);

    const tooLowTuVan = {
      nganSach: 5000000,
      soLuongKhach: 100,
      phongCach: "cung-dinh",
    };
    expect(tuVanInputSchema.safeParse(tooLowTuVan).success).toBe(false);
  });

  it("xác thực mẫu thiệp cưới trực tuyến hợp lệ", async () => {
    const { thiepCuoiSchema } = await import("../features/invitations/types");
    const sampleInvitation = {
      id: "tc-01",
      ten: "Hoàng Kim Liên Hoa",
      phongCach: "cung-dinh",
      loai: "vip",
      gia: 450000,
      giaGoc: 990000,
      moTa: "Chủ đề Sen Vàng Hoàng Cung quý phái",
      hinhAnh: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
      coDau: "Diễm Hằng",
      chuRe: "Xuân Thịnh",
      ngayCuoi: "2026-12-28",
      diaDiem: "Đại Cung Môn - Cố Đô Huế",
    };
    expect(thiepCuoiSchema.safeParse(sampleInvitation).success).toBe(true);
  });

  it("xác thực biểu mẫu quản lý tài khoản người dùng và phân quyền 2 cấp (Admin & User)", async () => {
    const { userAccountSchema, userFormSchema } = await import("../features/auth/types");
    const validAccount = {
      id: "u-user-01",
      username: "khachhang_hue",
      fullName: "Lê Thị Thảo",
      role: "user",
      phone: "0905888999",
      email: "khachhang@huecungdinh.vn",
      active: true,
      createdAt: "2026-10-01",
    };
    expect(userAccountSchema.safeParse(validAccount).success).toBe(true);

    // Không còn vai trò "nhan-vien", phải bị từ chối
    const legacyStaffAccount = {
      ...validAccount,
      role: "nhan-vien",
    };
    expect(userAccountSchema.safeParse(legacyStaffAccount).success).toBe(false);

    const validCreateForm = {
      username: "admin_assistant",
      fullName: "Trần Trọng Trí",
      password: "secretpassword123",
      role: "admin",
      phone: "0905111222",
      email: "assistant@huecungdinh.vn",
      active: true,
    };
    expect(userFormSchema.safeParse(validCreateForm).success).toBe(true);

    const invalidShortUsername = {
      ...validCreateForm,
      username: "ab",
    };
    expect(userFormSchema.safeParse(invalidShortUsername).success).toBe(false);

    const invalidRole = {
      ...validCreateForm,
      role: "super-guest-unknown",
    };
    expect(userFormSchema.safeParse(invalidRole).success).toBe(false);
  });

  /* ==========================================================================
     TEST CHÍNH SÁCH HOÀN HỦY & QUY TẮC NGHIỆP VỤ (BUSINESS RULES)
     ========================================================================== */
  it("tính toán chính sách hoàn cọc 100% khi thời gian hủy ≥ 15 ngày", async () => {
    const { calculateRefundPolicy } = await import("../lib/formatters");
    // Tạo ngày cưới cách hiện tại 20 ngày
    const futureDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "2026-12-25";
    const totalBudget = 30000000; // 30 triệu
    const policy = calculateRefundPolicy(futureDate, totalBudget);

    expect(policy.daysRemaining).toBeGreaterThanOrEqual(15);
    expect(policy.refundPercent).toBe(100);
    expect(policy.refundAmount).toBe(6000000); // 20% của 30 triệu là 6 triệu
    expect(policy.feeAmount).toBe(0);
    expect(policy.tierVariant).toBe("success");
  });

  it("tính toán chính sách hoàn cọc 50% khi thời gian hủy từ 7 đến 14 ngày", async () => {
    const { calculateRefundPolicy } = await import("../lib/formatters");
    // Tạo ngày cưới cách hiện tại 10 ngày
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "2026-11-15";
    const totalBudget = 20000000; // 20 triệu (cọc 20% là 4 triệu)
    const policy = calculateRefundPolicy(futureDate, totalBudget);

    expect(policy.daysRemaining).toBeGreaterThanOrEqual(7);
    expect(policy.daysRemaining).toBeLessThanOrEqual(14);
    expect(policy.refundPercent).toBe(50);
    expect(policy.depositAmount).toBe(4000000);
    expect(policy.refundAmount).toBe(2000000);
    expect(policy.feeAmount).toBe(2000000);
    expect(policy.tierVariant).toBe("warning");
  });

  it("tính toán phí hủy 100% cọc khi thời gian hủy dưới 7 ngày", async () => {
    const { calculateRefundPolicy } = await import("../lib/formatters");
    // Tạo ngày cưới cách hiện tại 3 ngày
    const nearDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "2026-10-28";
    const totalBudget = 50000000; // 50 triệu (cọc 20% là 10 triệu)
    const policy = calculateRefundPolicy(nearDate, totalBudget);

    expect(policy.daysRemaining).toBeLessThan(7);
    expect(policy.refundPercent).toBe(0);
    expect(policy.refundAmount).toBe(0);
    expect(policy.feeAmount).toBe(10000000);
    expect(policy.tierVariant).toBe("danger");
  });

  it("thuật toán AI Cung Đình tư vấn gói cưới phù hợp ngân sách và cổ phục", async () => {
    const { SupabaseService } = await import("../lib/supabaseAdapter");
    const aiResult = await SupabaseService.calculateConsultation({
      nganSach: 25000000,
      soLuongKhach: 100,
      phongCach: "cung-dinh",
      diaDiem: "dai-noi",
      soTrangPhuc: 2,
      hinhThucChup: "ngoai-canh",
    });

    expect(aiResult).toBeDefined();
    expect(aiResult.goiDeXuat).toBeDefined();
    expect(aiResult.goiDeXuat.giaTronGoi).toBeGreaterThan(0);
    expect(typeof aiResult.duNganSach).toBe("boolean");
    expect(aiResult.phanTich.length).toBeGreaterThan(10);
    expect(Array.isArray(aiResult.dichVuGoiYThem)).toBe(true);
  });

  it("định dạng tiền tệ VND và nhãn trạng thái đơn hàng chính xác", async () => {
    const { formatCurrency, getStatusInfo } = await import("../lib/formatters");
    const formatted = formatCurrency(15000000);
    expect(formatted).toContain("15.000.000");

    expect(getStatusInfo("cho-xu-ly").variant).toBe("warning");
    expect(getStatusInfo("da-duyet").variant).toBe("success");
    expect(getStatusInfo("tu-choi").variant).toBe("danger");
  });

  /* ==========================================================================
     TEST QUẢN LÝ TRẠNG THÁI GIỎ HÀNG (ZUSTAND STORE)
     ========================================================================== */
  it("quản lý giỏ hàng Zustand thêm sản phẩm và tính tổng tiền chính xác", async () => {
    const { useCartStore } = await import("../features/packages/cartStore");
    useCartStore.getState().clearCart();

    useCartStore.getState().addItem({
      id: "test-dv-01",
      ten: "Áo Nhật Bình Test",
      gia: 4500000,
      hinhAnh: "https://example.com/item.jpg",
      soLuong: 2,
    });

    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0]?.soLuong).toBe(2);
    expect(useCartStore.getState().getTotalPrice()).toBe(9000000);

    // Cập nhật số lượng
    useCartStore.getState().updateQuantity("test-dv-01", 1);
    expect(useCartStore.getState().items[0]?.soLuong).toBe(3);
    expect(useCartStore.getState().getTotalPrice()).toBe(13500000);

    // Xóa khỏi giỏ
    useCartStore.getState().removeItem("test-dv-01");
    expect(useCartStore.getState().items.length).toBe(0);
    expect(useCartStore.getState().getTotalPrice()).toBe(0);
  });

  /* ==========================================================================
     TEST XUẤT BÁO CÁO CSV / EXCEL TIẾNG VIỆT
     ========================================================================== */
  it("hàm xuất dữ liệu đơn yêu cầu ra CSV trả về true khi có dữ liệu và false khi rỗng", async () => {
    const { exportRequestsToCSV } = await import("../lib/formatters");
    // Khi mảng rỗng
    expect(exportRequestsToCSV([])).toBe(false);

    // Giả lập DOM URL và createElement cho môi trường jsdom
    const sample = [
      {
        id: "yc-test-01",
        tenKhach: "Trần Công Quý",
        soDienThoai: "0905123456",
        ngayCuoi: "2026-12-25",
        nganSach: 25000000,
        trangThai: "da-duyet",
        ngayTao: "2026-10-25",
      },
    ];
    expect(exportRequestsToCSV(sample)).toBe(true);
  });

  it("hàm xuất báo cáo KPI và doanh thu theo tháng hoạt động đúng", async () => {
    const { exportRevenueStatsToCSV } = await import("../lib/formatters");
    const sampleStats = {
      tongDon: 48,
      donChoXuLy: 7,
      tongDoanhThuDuKien: 1184000000,
      tyLeThanhCong: 95,
      doanhThuTheoThang: [{ thang: "T10", doanhThu: 254000000 }],
      tyLeGoiCuoi: [{ tenGoi: "Cung Đình Khang Ninh", soLuong: 18, phanTram: 38 }],
    };
    expect(exportRevenueStatsToCSV(sampleStats)).toBe(true);
  });

  it("xác thực biểu mẫu đăng ký thiệp cưới online datThiepFormSchema", async () => {
    const { datThiepFormSchema } = await import("../features/invitations/types");
    const validForm = {
      tenKhach: "Trần Công Quý",
      soDienThoai: "0905123456",
      tenCoDau: "Lê Nhật Ánh",
      tenChuRe: "Trần Công Quý",
      ngayCuoi: "2026-12-25",
      diaDiem: "Khách Sạn Mường Thanh Cố Đô Huế",
      mauThiepId: "tc-01",
      goiDichVu: "vip",
    };
    expect(datThiepFormSchema.safeParse(validForm).success).toBe(true);

    const invalidShortName = {
      ...validForm,
      tenCoDau: "A",
    };
    expect(datThiepFormSchema.safeParse(invalidShortName).success).toBe(false);
  });
});

