# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRODUCT REQUIREMENTS DOCUMENT - PRD)

**Dự án:** Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh (`doan-fenc`)  
**Học phần:** Web FrontEnd Nâng Cao (Mã môn: INT.7.18)  
**Phiên bản:** 1.0.0  
**Tác giả:** Đội ngũ Kỹ sư FrontEnd Nâng Cao  
**Trạng thái:** Chính thức (Approved)

---

## 1. TỔNG QUAN VÀ TẦM NHÌN SẢN PHẨM (PRODUCT VISION)

### 1.1. Bối cảnh
Huế – vùng đất cố đô cổ kính với di sản văn hóa triều Nguyễn đặc sắc – là nguồn cảm hứng bất tận cho những bộ ảnh cưới và lễ cưới mang đậm bản sắc văn hóa Việt Nam. Tuy nhiên, khách hàng hiện nay thường gặp khó khăn trong việc tìm kiếm các gói dịch vụ cưới cung đình chuẩn chỉ, minh bạch về giá cả, và thiếu công cụ tư vấn số hóa để hoạch định ngân sách chi tiết.

### 1.2. Tầm nhìn & Mục tiêu
Xây dựng nền tảng web hiện đại, đậm chất hoàng gia cung đình Huế nhưng ứng dụng các công nghệ FrontEnd tiên tiến nhất:
- Mang lại trải nghiệm số hóa mượt mà cho các cặp đôi lựa chọn trang phục Nhật Bình, Áo Tấc, thợ ảnh và địa điểm Đại Nội.
- Cung cấp công cụ "AI Tư Vấn Hôn Lễ Hoàng Triều" giúp khách hàng lập kế hoạch chi tiêu chính xác theo ngân sách và phong cách mong muốn.
- Cung cấp hệ thống Quản trị (Admin CMS) trực quan với Dashboard phân tích số liệu kinh doanh sử dụng biểu đồ SVG thuần túy không dùng thư viện ngoài.
- Minh chứng năng lực kỹ thuật FrontEnd nâng cao: Kiến trúc Feature-based, Type-safety tuyệt đối với TypeScript Strict + Zod v4, Discriminated Union Async State, CSS thuần không phụ thuộc UI framework.

---

## 2. NGƯỜI DÙNG MỤC TIÊU (USER PERSONAS)

### Persona 1: Cặp đôi chuẩn bị kết hôn (Khách vãng lai / Public User)
- **Độ tuổi:** 24 - 35 tuổi.
- **Nhu cầu:** Tìm kiếm trang phục cưới truyền thống (Áo Nhật Bình, Áo Tấc, Áo Dài Long Phụng), gói chụp ảnh cố đô, địa điểm đãi tiệc sang trọng.
- **Điểm nghẽn:** Ngân sách có hạn, lo sợ chi phí phát sinh, khó ước lượng chi phí trọn gói.
- **Hành động chính:** Khám phá dịch vụ lẻ, so sánh các gói cưới combo, dùng công cụ tư vấn tính toán ngân sách, gửi đơn đăng ký tư vấn.

### Persona 2: Quản trị viên Tối cao (Super Admin)
- **Vai trò:** Chủ sở hữu studio, toàn quyền điều hành toàn bộ hệ thống.
- **Nhu cầu:** Quản lý toàn bộ danh mục tài khoản người dùng, phân quyền truy cập, theo dõi doanh thu tổng qua Dashboard cao cấp, quản lý dịch vụ, gói cưới, xử lý đơn yêu cầu tư vấn trên bảng Kanban.
- **Hành động chính:** Đăng nhập `/login`, vào `/admin` điều hành toàn bộ các phân hệ (Tổng quan, Dịch vụ, Gói cưới, Đơn yêu cầu, Quản lý tài khoản `/admin/tai-khoan`).

---

## 3. PHẠM VI CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)

### 3.1. Phân hệ Người dùng Công cộng (Public Portal)

1. **Trang Chủ (Landing Page - `/`):**
   - **Hero Banner Hoàng Gia:** Khẩu hiệu ấn tượng, nút kêu gọi hành động (CTA) "Khám Phá Gói Cưới" & "Tư Vấn Ngân Sách".
   - **Thanh Chạy Combo Tiêu Biểu (Marquee Carousel):** Tự động trượt ngang vô tận giới thiệu các gói cưới hot nhất Cố Đô Huế.
   - **Giới thiệu Tinh hoa Cung Đình:** Giá trị văn hóa, cam kết chất lượng trang phục hoàng triều và ekip chuyên nghiệp.
   - **Form Đăng ký Tư vấn Nhanh:** Nhập tên, số điện thoại, ngày cưới dự kiến; kiểm thực hợp lệ bằng Zod trước khi gửi.

2. **Trang Danh Sách Dịch Vụ Lẻ (`/dich-vu`):**
   - Hiển thị danh mục dịch vụ: `ao-dai` (Áo Dài Cổ Phục), `tho-anh` (Nhiếp Ảnh Gia), `dia-diem` (Địa Điểm Chụp & Đãi Tiệc), `trang-tri` (Trang Trí Không Gian).
   - Bộ lọc theo danh mục dạng Tabs/Pills thân thiện.
   - Sắp xếp linh hoạt: Giá tăng dần, Giá giảm dần, Tên A-Z.
   - Thẻ dịch vụ chi tiết: Ảnh thật chất lượng cao, nhãn phân loại, giá niêm yết chuẩn VND, mô tả ngắn.

3. **Trang Danh Sách Gói Cưới Combo (`/goi-cuoi`):**
   - Danh sách hiển thị dạng lưới CSS Grid cân đối, viền vàng gold sang trọng.
   - Thanh tác vụ chuẩn mực: Ô tìm kiếm tên gói, bộ lọc phong cách (`cung-dinh`, `hien-dai`, `co-dien`) và nút sắp xếp giá tăng/giảm.
   - Hiển thị tóm tắt các dịch vụ bao gồm trong gói và tổng giá trọn gói tiết kiệm so với đặt lẻ.

4. **Trang Chi Tiết Gói Cưới (`/goi-cuoi/:id`):**
   - Tuyến đường động nhận diện `id` gói cưới.
   - Hiển thị chi tiết mô tả, hình ảnh đại diện, phong cách, giá trọn gói.
   - Bảng kê chi tiết các dịch vụ thành phần: tên dịch vụ, đơn giá gốc, tổng giá trị dịch vụ.
   - **Tính Năng Đột Phá - In Báo Giá & Dự Thảo Hợp Đồng Cung Đình A4 (`window.print()`):**
     - Nút "In Hợp Đồng A4" chuyển đổi toàn bộ trang thành bản in chuẩn A4 hoàng gia sang trọng.
     - Tự động ẩn thanh điều hướng, chân trang và các nút bấm; hiển thị tiêu đề quốc hiệu, bảng danh mục hạng mục, điều khoản cam kết và chữ ký hai bên.
   - Nút hành động: "Thêm Vào Giỏ Dịch Vụ" (lưu vào `cartStore` Zustand) và "Nhận Báo Giá Nhanh".

5. **Trang Kho Mẫu Thiệp Cưới Online & Hướng Dẫn (`/thiep-cuoi`):**
   - **Kho Giao Diện Thiệp Cưới:** Hiển thị danh mục mẫu thiệp theo khung điện thoại smartphone, phân hạng huy hiệu VIP, PRO, Basic.
   - **Xem Trước Tương Tác (Live Demo Modal):** Mô phỏng smartphone có hiệu ứng mở phong bì hoàng gia, nút bật/tắt nhạc nền, đồng hồ đếm ngược ngày cưới.
   - **Tích Hợp VietQR Mừng Cưới Động:** Quét mã QR chuyển khoản mừng cưới 24/7 trực tiếp vào tài khoản ngân hàng của cô dâu chú rể.
   - **Bảng Giá 3 Gói Trải Nghiệm:** Gói Basic (168k), Gói VIP (450k), Gói PRO (295k) với modal đăng ký thiệp cưới tự động lưu vào hệ thống.

6. **Trang Giỏ Hàng & Thanh Toán Đặt Cọc (`/gio-hang`):**
   - Quản lý danh sách dịch vụ và combo đã chọn, cập nhật số lượng, tính tổng chi phí.
   - Modal Đặt Lịch & Thanh Toán: Tích hợp lựa chọn **Đặt cọc trước 20% qua VietQR**, tự động tính số tiền cọc và sinh mã QR kèm nội dung chuyển khoản chuẩn mực.

7. **Trang AI Tư Vấn Hôn Lễ Thông Minh (`/tu-van`):**
   - Form nhập tiêu chí: Ngân sách dự kiến (VND), Số lượng khách mời, Phong cách ưa thích.
   - Thuật toán so khớp gói cưới tối ưu nhất, tính toán chênh lệch tài chính và gợi ý dịch vụ lẻ bổ sung.

8. **Trang Đăng Nhập & Đăng Ký Tài Khoản (`/login`):**
   - Biểu mẫu đăng nhập bảo mật hỗ trợ 2 vai trò: Admin và Khách Hàng.
   - Cung cấp sẵn 2 nút chọn nhanh tài khoản thử nghiệm (Quick-fill) phục vụ chấm điểm và trải nghiệm:
     - 👑 **Admin:** `admin` / `123456` (hoặc `123`)
     - 💍 **Khách Hàng:** `khachhang` / `123456` (hoặc `123`)

---

### 3.2. Phân hệ Quản Trị Viên (Protected Admin Portal - RBAC)

1. **Bảo vệ Tuyến đường Quản Trị (`ProtectedRoute`):**
   - Kiểm tra vai trò người dùng trong `AuthContext`.
   - Chặn khách vãng lai và tài khoản `user` vào khu vực `/admin/*`, tự động điều hướng về `/login`.
   - Bảo đảm chỉ tài khoản có vai trò `admin` mới truy cập được các chức năng quản trị.

2. **Admin Dashboard Hoàng Gia Cao Cấp (`/admin`):**
   - **Bộ Đếm Khách Trực Tuyến Thời Gian Thực (Live Visitor Odometer):**
     - Đèn tín hiệu xanh ngọc phát sáng nhấp nháy (`pulsing dot`), hiển thị số lượng khách đang truy cập xem dịch vụ và thiệp cưới trên website theo thời gian thực (15-28 khách).
   - **Thanh Lời Chào Thông Minh (Smart Greeter):**
     - Tự động nhận diện buổi trong ngày (Sáng / Chiều / Tối), hiển thị tổng hợp lịch chụp ảnh tại Đại Nội và các đơn cần xử lý trong ngày.
   - **Bộ Lọc Khoảng Thời Gian Đa Năng (Time Horizon Switcher):**
     - 4 Chế độ: `Hôm Nay` | `7 Ngày Qua` | `Tháng Này (Mặc định)` | `Cả Năm 2026`, tính toán và co giãn dữ liệu KPI tự động.
   - **4 Thẻ KPI Tích Hợp Biểu Đồ Mini (Pure SVG Sparklines):**
     - Doanh thu dự kiến (+18.5% tăng trưởng, đường sóng SVG vàng kim, thanh đo tiến độ đạt 82% chỉ tiêu tháng).
     - Tổng hợp đồng hôn lễ (+12.5% tăng trưởng, đường sóng SVG đỏ mận, ghi chú 39 đơn chốt cọc).
     - Đơn chờ xử lý (-15% thời gian phản hồi, phản hồi trung bình 18 phút).
     - Tỷ lệ chốt thành công (92% - 99.4% khách hàng hài lòng).
   - **Hệ Thống Biểu Đồ SVG Cung Đình Tương Tác Sâu:**
     - **Biểu đồ Cột SVG Doanh thu:** Cột kép với thanh mờ so sánh baseline cùng kỳ, định dạng gradient đỏ mận - vàng kim, hiển thị tooltip chi tiết khi rê chuột (Tháng, Doanh thu, Hợp đồng).
     - **Biểu đồ Tròn Donut SVG Cơ cấu gói cưới:** Số lượng hợp đồng tổng nằm ở tâm hình tròn, chú giải kèm thanh tiến độ mini % đóng góp doanh thu của từng gói.
   - **Cụm Widget Đa Nhiệm Phía Dưới:**
     - **Bảng Đơn Tư Vấn Mới Nhất:** Duyệt nhanh 1-click hoặc xóa đơn.
     - **Nhật Ký Hoạt Động Real-time & Top Cổ Phục Thịnh Hành:** Dòng sự kiện khách hàng đặt cọc, duyệt đơn, tạo thiệp theo thời gian tương đối ("12 phút trước") và bảng vinh danh Top 3 sản phẩm bán chạy nhất.
   - **Widget Bản Quyền Studio Enterprise & Tải Hóa Đơn (.TXT):**
     - Thẻ thông tin gói Enterprise VIP của studio, hiển thị thanh đo thời hạn bản quyền còn 28 ngày gia hạn, danh sách 5 tính năng cốt lõi và nút bấm tải trực tiếp hóa đơn bản quyền `INV-2026-1024P.txt`.
   - **Thanh Tác Vụ Nhanh (Quick Actions):**
     - Các nút tắt: `+ Thêm Dịch Vụ`, `+ Đóng Gói Cưới`, `📋 Mở Bảng Kanban`, `🖨️ In Báo Cáo KPI`.

3. **Quản Lý Đơn Yêu Cầu Tư Vấn (`/admin/yeu-cau`):**
   - **Hai Chế Độ Xem Linh Hoạt:**
     - **Chế độ Bảng Danh Sách:** Bảng phân loại trạng thái chi tiết kèm nút xử lý nhanh.
     - **Chế độ Kanban Board Trực Quan:** 4 cột tiến độ (`Chờ Xử Lý` → `Đã Duyệt` → `Đã Liên Hệ` → `Hoàn Thành`). Hỗ trợ chuyển trạng thái 1-click giữa các cột.

4. **Quản Lý Dịch Vụ Lẻ (`/admin/dich-vu`) & Gói Cưới (`/admin/goi-cuoi`):**
   - CRUD đầy đủ với Zod schema validation và ConfirmModal cảnh báo trước khi xóa.
   - Đóng gói combo với cơ chế chọn nhiều dịch vụ thành phần.

5. **Phân Hệ Quản Lý Tài Khoản & Phân Quyền (`/admin/tai-khoan`):**
   - Bảng danh sách toàn bộ tài khoản trong hệ thống kèm avatar viết tắt, họ tên, username, số điện thoại, email, vai trò và trạng thái.
   - 4 Thẻ KPI: Tổng số tài khoản, Quản trị viên, Khách hàng, Đang hoạt động.
   - Thanh tìm kiếm đa năng (theo tên, username, SĐT, email) và bộ lọc theo vai trò (Tất cả, Quản trị viên, Khách hàng).
   - Modal Thêm / Chỉnh sửa tài khoản với Zod validation.
   - Chức năng Bật / Tắt kích hoạt tài khoản ngay tức thì.
   - Cơ chế bảo vệ đặc biệt: Tuyệt đối không cho phép xóa hoặc khóa tài khoản Quản trị viên tối cao (`u-admin`).

---

## 4. MÔ HÌNH DỮ LIỆU & SCHEMA (DATA MODEL)

### 4.1. Dịch Vụ Lẻ (`DichVu`)
```typescript
{
  id: string; // Khóa chính (UUID hoặc định danh chuỗi dv-01)
  ten: string; // Tên dịch vụ (VD: "Áo Nhật Bình Hoàng Gia Thêu Tay")
  loai: 'ao-dai' | 'tho-anh' | 'dia-diem' | 'trang-tri'; // Phân loại
  gia: number; // Đơn giá (VND)
  moTa: string; // Mô tả đặc tính dịch vụ
  hinhAnh: string; // URL ảnh Unsplash chất lượng cao
}
```

### 4.2. Gói Cưới Combo (`GoiCuoi`)
```typescript
{
  id: string; // Khóa chính (VD: "gc-01")
  ten: string; // Tên gói (VD: "Gói Cưới Hoàng Hậu Nam Phương")
  moTa: string; // Giới thiệu tổng quan
  giaTronGoi: number; // Giá ưu đãi trọn gói (VND)
  danhSachDichVuIds: string[]; // Mảng các id dịch vụ lẻ thành phần
  phongCach: 'cung-dinh' | 'hien-dai' | 'co-dien';
  hinhAnh: string; // URL ảnh đại diện gói
}
```

### 4.3. Đơn Yêu Cầu Tư Vấn (`YeuCau`)
```typescript
{
  id: string; // Khóa chính
  tenKhach: string; // Họ tên khách hàng
  soDienThoai: string; // Số điện thoại (kiểm thực 10 số theo chuẩn VN)
  ngayCuoi: string; // Định dạng YYYY-MM-DD
  soLuongKhach: number; // Quy mô khách mời
  nganSach: number; // Mức ngân sách dự trù (VND)
  goiDeXuatId?: string; // ID gói cưới quan tâm (nếu có)
  ghiChu?: string; // Ghi chú thêm
  trangThai: 'cho-xu-ly' | 'da-lien-he' | 'hoan-thanh';
  ngayTao: string; // ISO 8601 Timestamp
}
```

### 4.4. Người Dùng Quản Trị (`NguoiDung`)
```typescript
{
  id: string;
  ten: string;
  tenDangNhap: string;
  vaiTro: 'admin' | 'khach';
}
```

---

## 5. YÊU CẦU PHI CHỨC NĂNG & TIÊU CHUẨN KỸ THUẬT NÂNG CAO

1. **Hiệu năng & Bundle Size:**
   - Hoàn toàn không tải font web từ Google Fonts để loại bỏ blocking request; sử dụng font stack có sẵn:
     - Headings: `"Playfair Display", "Times New Roman", "Palatino", serif`.
     - Body: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
   - Không sử dụng thư viện UI nặng (giảm 80% kích thước JavaScript ban đầu).
   - Điểm Google Lighthouse dự kiến: Performance > 90, Accessibility > 95, Best Practices > 95, SEO > 90.

2. **Khả năng tiếp cận (Accessibility - A11y):**
   - Đạt chuẩn WCAG 2.1 AA.
   - Tỷ lệ tương phản màu sắc giữa Text và Background luôn >= 4.5:1.
   - Thẻ ngữ nghĩa chuẩn HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Hỗ trợ hoàn toàn điều hướng bằng phím Tab và phím Enter/Space.
   - Các thông báo lỗi biểu mẫu luôn có `role="alert"` để trình đọc màn hình (Screen Reader) phản hồi ngay lập tức.

3. **Chủ đề Giao diện (Theming):**
   - Hỗ trợ đầy đủ 2 chế độ: Sáng (Light Mode) và Tối (Dark Mode).
   - Hệ thống CSS Variables chuẩn hóa, chuyển đổi mượt mà không bị giật layout (zero layout shift).

4. **Kiến trúc Code & Bảo trì:**
   - 100% Type-safe: Không có `any`, không ép kiểu `as`.
   - Giới hạn component tối đa 150 dòng; mã nguồn sạch sẽ, tách biệt rõ ràng giữa Presentation Component và Container/Hook logic.
   - Kiểm thử đơn vị và tích hợp định tuyến bằng Vitest (`createMemoryRouter`).

