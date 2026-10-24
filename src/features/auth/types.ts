import { z } from "zod";

export const loginInputSchema = z.object({
  tenDangNhap: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  matKhau: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerInputSchema = z.object({
  hoTen: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  tenDangNhap: z.string().min(3, "Tên đăng nhập từ 3 ký tự"),
  matKhau: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const nguoiDungSchema = z.object({
  id: z.string(),
  ten: z.string(),
  tenDangNhap: z.string(),
  vaiTro: z.enum(["admin", "user", "khach"]),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type NguoiDung = z.infer<typeof nguoiDungSchema>;

// Quản lý người dùng Admin
export const userAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullName: z.string(),
  role: z.enum(["admin", "user"]),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  active: z.boolean().default(true),
  createdAt: z.string().optional(),
});

export type UserAccount = z.infer<typeof userAccountSchema>;
export const userAccountListSchema = z.array(userAccountSchema);

export const userFormSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập tối thiểu 3 ký tự").regex(/^[a-zA-Z0-9_.-]+$/, "Tên đăng nhập không chứa dấu hoặc ký tự đặc biệt"),
  fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  password: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: "Mật khẩu nếu nhập phải có ít nhất 6 ký tự",
  }),
  role: z.enum(["admin", "user"]),
  phone: z.string().optional().refine((val) => !val || /^(0|\+84)[0-9]{9,10}$/.test(val), {
    message: "Số điện thoại không hợp lệ (10 số bắt đầu bằng 0 hoặc +84)",
  }),
  email: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Định dạng email không hợp lệ",
  }),
  active: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userFormSchema>;
