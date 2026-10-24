# HUẾ CUNG ĐÌNH – DỊCH VỤ CƯỚI & CHỤP ẢNH HOÀNG TRIỀU
## ĐỒ ÁN KẾT THÚC HỌC PHẦN: WEB FRONTEND NÂNG CAO (MÃ MÔN: INT.7.18)
**Mã dự án:** `doan-fenc`  
**Công nghệ:** React 19 + TypeScript (Strict) + Vite + React Router v8 + Zustand v5 + Zod v4 + Pure CSS + Supabase Cloud & Node.js Mock API  
**Live Demo trên Vercel:** [https://huecungdinh.vercel.app/](https://huecungdinh.vercel.app/)  
**GitHub Repository:** [https://github.com/TranCongQuy/hue_cung_dinh.git](https://github.com/TranCongQuy/hue_cung_dinh.git)  

---

## 1. GIỚI THIỆU TỔNG QUAN

Website **"Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh"** là nền tảng số hóa dịch vụ hôn lễ và nhiếp ảnh cổ phục triều Nguyễn cao cấp tại Cố đô Huế. Dự án được xây dựng với mục tiêu mang lại trải nghiệm đậm chất hoàng gia, giao diện chuẩn mực, đồng thời phô diễn toàn bộ các kỹ thuật FrontEnd nâng cao:
- **Kiến trúc Feature-Based:** Phân tách rõ ràng giữa các phân hệ nghiệp vụ (`services`, `packages`, `consultation`, `requests`, `invitations`, `auth`).
- **100% Type-Safe:** TypeScript bật `strict: true`, cấm hoàn toàn `any` và ép kiểu mù quáng `as`.
- **Pure CSS 100%:** Tuyệt đối không dùng Tailwind CSS hay thư viện giao diện; sử dụng CSS Variables, Flexbox, Grid và SVG thuần.
- **Async State Chặt chẽ:** Ứng dụng mẫu thiết kế Discriminated Union `AsyncState<T>` với kiểm tra vét cạn `never`.
- **Đa Nền Tảng Backend:** Hỗ trợ song song Supabase Cloud Database (PostgreSQL với RLS) và Máy chủ Node.js gốc (`http` module, không dùng Express) trên cổng 4000 với thuật toán AI Client-Side tức thì.
- **Triển khai Cloud Production:** Hoàn tất triển khai trên Vercel với cấu hình SPA Rewrite và HTTP Caching tối ưu.

---

## 2. BẢNG TÀI KHOẢN TRẢI NGHIỆM & PHÂN QUYỀN (2-TIER RBAC)

Hệ thống hỗ trợ cơ chế Phân Quyền Theo Vai Trò Tinh Gọn (2-Tier Role-Based Access Control) với 2 tài khoản demo sẵn có để kiểm tra ngay trên trang `/login`:

| Vai Trò | Tên Đăng Nhập (Username) | Mật Khẩu (Password) | Phạm Vi Quyền Hạn Trong Hệ Thống |
|:---|:---:|:---:|:---|
| 👑 **Quản Trị Viên (Super Admin)** | `admin` | `123456` *(hoặc `123`)* | **Toàn quyền hệ thống:** Dashboard KPI Corbel SaaS, CRUD Dịch vụ, Gói cưới, Bảng Kanban Đơn yêu cầu, và **độc quyền Quản Lý Tài Khoản & Phân Quyền (`/admin/tai-khoan`)**. |
| 💍 **Khách Hàng (Customer)** | `khachhang` | `123456` *(hoặc `123`)* | **Cổng Khách Hàng:** Xem dịch vụ, gói combo, kho thiệp điện tử, AI tư vấn ngân sách, giỏ hàng, **thanh toán đặt cọc qua VietQR**, in báo giá & hợp đồng A4. |

---

## 3. CÁC TÍNH NĂNG NỔI BẬT ĐƯỢC BỔ SUNG & HOÀN THIỆN

1. 👑 **Quản Lý Tài Khoản & Phân Quyền (`/admin/tai-khoan`):**
   - 4 Thẻ KPI thống kê số lượng tài khoản: Tổng tài khoản, Quản trị viên, Khách hàng, Đang hoạt động.
   - Bảng tài khoản thông minh kèm bộ lọc vai trò, tìm kiếm đa trường (họ tên, username, SĐT, email).
   - Modal Thêm / Chỉnh sửa tài khoản với Zod Schema kiểm thực nghiêm ngặt.
   - Nút gạt / click đổi trạng thái kích hoạt tài khoản tức thì.
   - **Bảo vệ Root Admin:** Ngăn chặn tuyệt đối việc xóa hoặc khóa tài khoản Quản trị viên tối cao.

2. 📋 **Quy Trình Chăm Sóc Khách Hàng Với Kanban Board (`/admin/yeu-cau`):**
   - Hỗ trợ chuyển đổi mượt mà giữa **Chế độ Bảng Danh Sách** và **Chế độ Kanban Board**.
   - 4 Cột tiến độ chuẩn nghiệp vụ cưới: `Chờ Xử Lý` ➔ `Đã Duyệt` ➔ `Đã Liên Hệ` ➔ `Hoàn Thành`.
   - Chuyển trạng thái 1-click giữa các cột tiến độ.

3. 🖨️ **In Báo Giá & Dự Thảo Hợp Đồng Hoàng Gia Chuẩn A4 (`/goi-cuoi/:id`):**
   - Nút "In Hợp Đồng A4" sử dụng công nghệ CSS `@media print`.
   - Xuất ra bản in trang trọng chuẩn tỷ lệ A4, chứa quốc hiệu triều Nguyễn, bảng chi tiết từng hạng mục dịch vụ, mức tiết kiệm gói combo, cam kết chất lượng cổ phục và vị trí ký tên/đóng dấu của hai bên.

4. 📲 **Tích Hợp Dynamic VietQR Thông Minh:**
   - **Kho Mẫu Thiệp Cưới (`/thiep-cuoi`):** Hộp mừng cưới thông minh hiển thị mã VietQR tạo động theo tên dâu rể và thông tin tài khoản ngân hàng.
   - **Giỏ Hàng Cưới (`/gio-hang`):** Lựa chọn đặt cọc trước 20% giữ ngày cưới, tự động sinh mã VietQR kèm số tiền cọc chính xác và cú pháp chuyển khoản.

5. 📱 **Tối Ưu Hóa Giao Diện Đa Thiết Bị Web & Mobile (100% Responsive):**
   - Desktop (> 1024px): Layout lưới rộng rãi, sidebar cố định sang trọng.
   - Tablet (768px - 1024px): Grid tự co giãn thông minh, thanh tác vụ tinh gọn.
   - Mobile (< 768px): Sidebar biến thành Navigation Drawer trượt từ cạnh trái với backdrop làm mờ, bảng dữ liệu hỗ trợ cuộn ngang an toàn, các nút bấm đạt kích thước chuẩn ngón tay (Touch Target >= 44px).

6. 📊 **Admin Dashboard Hoàng Gia Cao Cấp (Lấy cảm hứng từ Corbel SaaS Dashboard):**
   - **Live Visitor Counter:** Bộ đếm khách trực tuyến với đèn xung nhịp pulsing xanh ngọc thời gian thực (15-28 khách).
   - **Smart Greeter & Quick Action Bar:** Lời chào theo buổi trong ngày và cụm thao tác nhanh (`+ Thêm Dịch Vụ`, `+ Đóng Gói Cưới`, `📋 Kanban`, `🖨️ In Báo Cáo KPI`).
   - **Time Horizon Switcher:** Chuyển đổi linh hoạt 4 khoảng thời gian (`Hôm Nay`, `7 Ngày Qua`, `Tháng Này`, `Cả Năm 2026`).
   - **4 Thẻ KPI Kèm Pure SVG Sparklines:** Doanh thu (+18.5%), Hợp đồng (+12.5%), Đơn chờ (-15%), Tỷ lệ chốt (92%), kèm thanh đo mục tiêu tháng (82%).
   - **Biểu Đồ Cột & Donut SVG Tương Tác:** Cột kép so sánh baseline cùng kỳ, hover tooltip chi tiết; biểu đồ Donut tâm hiển thị tổng số hợp đồng kèm thanh tiến độ thị phần.
   - **Live Activity Stream & Top Sellers:** Cập nhật nhật ký khách đặt cọc, duyệt đơn thời gian thực và bảng vinh danh 3 sản phẩm bán chạy nhất.
   - **Widget Bản Quyền Studio Enterprise:** Theo dõi hạn bản quyền 28 ngày và tải trực tiếp hóa đơn bản quyền `INV-2026-1024P.txt`.

---

## 3. CÔNG NGHỆ & RÀNG BUỘC KỸ THUẬT

| Hạng mục | Công nghệ / Quy chuẩn | Ghi chú & Ràng buộc |
|:---|:---|:---|
| **Core Framework** | React 19 + TypeScript 5.x | Function Components + Hooks, Strict Mode |
| **Định tuyến (Routing)** | React Router v8 | Import từ `"react-router"` & `"react-router/dom"`, không dùng `react-router-dom` |
| **Quản lý Trạng thái** | Zustand v5 + React Context | Zustand (`persist`) cho Giỏ hàng; Context CHỈ dùng cho Theme & Auth |
| **Kiểm thực Dữ liệu** | Zod v4 | Xác thực 3 tầng: API Response, Form Inputs, URL Query/Params |
| **Giao diện (Styling)** | CSS Thuần túy (CSS Variables) | Không Tailwind, không UI libs, Dark/Light Mode Cung Đình Huế |
| **Biểu tượng (Icons)** | SVG Thuần (Tự vẽ) | Không dùng font icon/thư viện ngoài, không emoji trong UI |
| **Biểu đồ (Charts)** | SVG Thuần (Bar & Donut) | Tự tính toán toạ độ hình học, không dùng Chart.js hay Recharts |
| **Backend Mock** | Node.js HTTP Server (`server/api.cjs`) | Không dùng Express, cổng 4000, dữ liệu tại `server/db.json` |
| **Kiểm thử (Testing)** | Vitest + Testing Library | Kiểm thử định tuyến với `createMemoryRouter` |

---

## 4. BẢN ĐỒ ĐỊNH TUYẾN (11 ROUTES)

### Phân hệ Công cộng (Public)
1. `/` : Trang Chủ (Hero Banner, Giới thiệu cổ phục, Gói cưới tiêu biểu, Form tư vấn nhanh).
2. `/dich-vu` : Danh sách dịch vụ lẻ (Áo dài, Thợ ảnh, Địa điểm, Trang trí) + Bộ lọc & Sắp xếp giá.
3. `/goi-cuoi` : Danh sách gói cưới combo hoàng gia + Bộ lọc phong cách.
4. `/goi-cuoi/:id` : Chi tiết gói cưới + Danh sách dịch vụ thành phần + Thêm vào giỏ cưới.
5. `/tu-van` : AI Tư vấn ngân sách hôn lễ (Tính thừa/thiếu, gợi ý gói cưới tối ưu, đăng ký tư vấn).
6. `/login` : Đăng nhập quản trị viên an toàn (`admin/123456`).
7. `*` : Trang 404 Cung Cấm không tìm thấy.

### Phân hệ Quản trị (Protected Admin)
8. `/admin` : Dashboard tổng quan kinh doanh, Biểu đồ Cột SVG doanh thu & Biểu đồ Tròn SVG cơ cấu gói.
9. `/admin/dich-vu` : Quản lý dịch vụ lẻ (Thêm, Sửa, Xóa có Modal Xác nhận).
10. `/admin/goi-cuoi` : Quản lý gói cưới (Đóng gói combo, chọn nhiều dịch vụ lẻ bằng checkbox).
11. `/admin/yeu-cau` : Quản lý và xử lý đơn yêu cầu tư vấn (Chuyển đổi trạng thái xử lý).

---

## 5. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH

### 5.1. Yêu cầu Môi trường
- Node.js >= 18.0.0
- Trình quản lý gói `npm` (đi kèm Node.js)

### 5.2. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### 5.3. Khởi chạy Máy chủ Giả lập (Mock Server Node.js thuần cổng 4000)
Mở một cửa sổ dòng lệnh (Terminal 1):
```bash
npm run server
```
*Máy chủ sẽ chạy tại `http://localhost:4000` với đầy đủ RESTful API và thuật toán gợi ý gói cưới.*

### 5.4. Khởi chạy Ứng dụng FrontEnd (Vite Dev Server)
Mở một cửa sổ dòng lệnh khác (Terminal 2):
```bash
npm run dev
```
*Truy cập ứng dụng tại `http://localhost:5173`.*

### 5.5. Các lệnh kiểm tra chất lượng mã nguồn
- **Kiểm tra kiểu dữ liệu TypeScript nghiêm ngặt:**
  ```bash
  npm run typecheck
  ```
- **Chạy bộ kiểm thử tự động Vitest:**
  ```bash
  npm run test
  ```
- **Đóng gói mã nguồn cho Production:**
  ```bash
  npm run build
  ```

---

## 6. CẤU TRÚC THƯ MỤC DỰ ÁN

```
doanFE-hoanthanh/
├── docs/                 # Tài liệu kỹ thuật chi tiết
│   ├── PRD.md            # Đặc tả yêu cầu sản phẩm theo chuẩn mẫu 8 phần của thầy
│   └── ROUTES.md         # Đặc tả chi tiết 17 tuyến đường và ma trận 2-Tier RBAC
├── server/               # Mock Server Node.js thuần túy
│   ├── api.cjs           # Máy chủ HTTP thuần không dùng Express
│   └── db.json           # Cơ sở dữ liệu JSON ban đầu
├── supabase/             # Cơ sở dữ liệu Supabase Cloud
│   ├── schema.sql        # Định nghĩa DDL PostgreSQL và RLS policies
│   └── fix_and_enrich.sql# Kịch bản DDL độc lập và nạp dữ liệu mẫu
├── src/
│   ├── app/              # Điểm khởi tạo ứng dụng & cấu hình Router
│   ├── pages/            # 17 Trang chức năng theo đặc tả
│   ├── features/         # Logic nghiệp vụ theo module (Feature-based)
│   │   ├── services/     # Dịch vụ lẻ
│   │   ├── packages/     # Gói cưới combo & Cart Store
│   │   ├── consultation/ # AI Tư vấn ngân sách
│   │   ├── requests/     # Đơn yêu cầu tư vấn
│   │   └── auth/         # Xác thực Admin & ProtectedRoute
│   ├── components/       # UI Components tái sử dụng (Button, Input, Modal, Icon)
│   ├── context/          # ThemeContext (Sáng/Tối)
│   ├── lib/              # Http Client, Helper, Formatter
│   └── styles/           # CSS Variables Cung Đình Huế, Typography, Reset
├── AGENTS.md             # Quy tắc phát triển dành cho Agent/Developer
├── AI-DECLARATION.md     # Bản tuyên bố liêm chính học thuật AI
├── PROMPTS.md            # Nhật ký câu lệnh kỹ thuật phân đoạn
├── package.json          # Cấu hình gói & kịch bản script
├── tsconfig.json         # Cấu hình TypeScript Strict Mode
└── vite.config.ts        # Cấu hình Vite & Vitest
```

---

## 7. TIÊU CHÍ ĐÁNH GIÁ ĐỒ ÁN NÂNG CAO

- [x] **Kiến trúc mã nguồn:** Tuân thủ Feature-based, quan hệ phụ thuộc một chiều, bóc tách module rõ ràng.
- [x] **Độ an toàn kiểu:** TypeScript Strict bật, 0 lỗi `any`, Zod v4 kiểm soát toàn diện 3 tầng.
- [x] **Xử lý bất đồng bộ:** Áp dụng triệt để Discriminated Union `AsyncState` và exhaustive check `never`.
- [x] **Trải nghiệm người dùng:** Giao diện hoàng gia sang trọng, chuyển đổi Light/Dark mode, hình ảnh Unsplash thật chất lượng cao.
- [x] **Tự chủ công nghệ:** 100% CSS thuần, tự vẽ Icon SVG và Biểu đồ thống kê SVG không dùng thư viện ngoài.
- [x] **Hồ sơ tài liệu:** Đầy đủ, chỉn chu, đạt chuẩn học thuật đại học.

