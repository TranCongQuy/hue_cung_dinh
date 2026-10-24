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
});

