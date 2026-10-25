# HUẾ CUNG ĐÌNH – DỊCH VỤ CƯỚI & CHỤP ẢNH HOÀNG TRIỀU
## ĐỒ ÁN KẾT THÚC HỌC PHẦN: WEB FRONTEND NÂNG CAO (MÃ MÔN: INT.7.18)
**Mã dự án:** `doan-fenc`  
**Sinh viên thực hiện:** Trần Công Quý  
**Mã số sinh viên (MSSV):** 2401ITA001  
**Lớp:** CNTT K22  
**Giảng viên hướng dẫn:** Thầy Dương Ngọc Duy  
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

## 3. CÁC TÍNH NĂNG NỔI BẬT ĐƯỢC BỔ SUNG & HOÀN THIỆN (BẢN 2.5 - CUNG ĐÌNH DI SẢN)

1. 🖨️ **Xuất & In Hợp Đồng Pháp Lý Hoàng Gia Chuẩn Khổ A4 (`window.print()`):**
   - Hợp đồng dịch vụ nhiếp ảnh cưới cung đình chuyên nghiệp có hiệu lực pháp lý (Căn cứ Bộ luật Dân sự, Luật Thương mại).
   - Đầy đủ thông tin Bên A (Studio Huế Cung Đình - Giám đốc Trần Công Quý, MST, hotline) và Bên B (Khách hàng, SĐT, ngày chụp, địa điểm di sản).
   - Tự động hiển thị khi đơn hàng chuyển sang trạng thái "Đã duyệt" (`da-duyet`), cho phép cả Khách hàng tại `/don-cua-toi` và Quản trị viên tại `/admin/yeu-cau` xem và in ấn A4 sắc nét qua `@media print`.
   - Chứa dấu đỏ điện tử xác thực và chữ ký số trang trọng.

2. 💍 **Hiệu Ứng Nhẫn Cưới Bay Cố Định & Widget Hỗ Trợ Đa Phân Hệ:**
   - Lớp nền Fixed Floating Rings bằng Pure SVG chuyển động lơ lửng nhẹ nhàng cố định phía sau nội dung, hiển thị xuyên suốt tại Dịch Vụ Lẻ, Gói Cưới Combo, Mẫu Thiệp Cưới và AI Tư Vấn.
   - Widget liên hệ thông minh (`FloatingContactWidget`) đặt cố định góc dưới bên phải màn hình, tự động thay đổi thông điệp và hành động CTA phù hợp với từng trang.

3. 💌 **Cá Nhân Hóa Thiệp Cưới Real-Time & Tích Hợp VietQR Mừng Cưới:**
   - Trang `/thiep-cuoi/dang-ky` bố trí 2 cột trực quan: Cột phải điền thông tin chi tiết (tân lang, tân nương, song thân hai họ, ngày âm/dương lịch, địa điểm & Google Map, STK nhận mừng cưới, nhạc nền cung đình); Cột trái là Mockup thiệp hoàng gia và mã VietQR mừng cưới thông minh hiển thị cập nhật theo thời gian thực (Real-time).
   - Sửa triệt để lỗi dính chữ tại hàng chọn phong cách hôn lễ.

4. 📋 **Quy Trình Chăm Sóc Khách Hàng Với Kanban Board (`/admin/yeu-cau`):**
   - Hỗ trợ chuyển đổi mượt mà giữa **Chế độ Bảng Danh Sách** và **Chế độ Kanban Board**.
   - 4 Cột tiến độ chuẩn nghiệp vụ cưới: `Chờ Xử Lý` ➔ `Đã Duyệt` ➔ `Đã Liên Hệ` ➔ `Hoàn Thành`.
   - Xem và in ngay Hợp đồng A4 cho các đơn đã duyệt ngay trên thẻ Kanban và bảng dữ liệu.

5. 📜 **Quản Lý Đơn Chụp Ảnh & Bổ Sung Mong Muốn (`/don-cua-toi`):**
   - Dữ liệu ban đầu sạch sẽ để kiểm thử thực tế. Thẻ đơn hiển thị rõ mã đơn `#YC-XXXXX`, tên đơn, trạng thái phân màu, ngày chụp và địa điểm di sản (loại bỏ hoàn toàn quy mô tiệc ăn cỗ).
   - Khách hàng có thể mở Modal Chi tiết đơn để bổ sung mong muốn chụp ảnh (góc máy, đổi màu cổ phục) và lưu trực tiếp.

6. 🛒 **Giỏ Hàng Chụp Ảnh Cưới & Modal Xác Nhận Tránh Nhầm Lẫn:**
   - Thông báo Flash message 5 giây trang trọng khi thêm/xóa dịch vụ.
   - Khi bấm "Xác Nhận Đặt Lịch", hộp thoại xác nhận hoàng gia xuất hiện yêu cầu kiểm tra lại danh sách hạng mục để tránh nhầm lẫn trước khi gửi đơn.

7. 📊 **Admin Dashboard Hoàng Gia Cao Cấp (Lấy cảm hứng từ Corbel SaaS Dashboard):**
   - **Live Visitor Counter:** Bộ đếm khách trực tuyến với đèn xung nhịp pulsing xanh ngọc thời gian thực (15-28 khách).
   - **4 Thẻ KPI Kèm Pure SVG Sparklines:** Doanh thu (+18.5%), Hợp đồng (+12.5%), Đơn chờ (-15%), Tỷ lệ chốt (92%).
   - **Biểu Đồ Cột & Donut SVG Tương Tác:** Cột kép so sánh baseline cùng kỳ, hover tooltip chi tiết; biểu đồ Donut tâm hiển thị tổng số hợp đồng.
   - **Xuất Báo Cáo Excel/CSV:** Pure JS Blob với UTF-8 BOM tiếng Việt chuẩn mực.

---

## 3. CÔNG NGHỆ & RÀNG BUỘC KỸ THUẬT

| Hạng mục | Công nghệ / Quy chuẩn | Ghi chú & Ràng buộc |
|:---|:---|:---|
| **Core Framework** | React 19 + TypeScript 5.x | Function Components + Hooks, Strict Mode 100% |
| **Định tuyến (Routing)** | React Router v8 | Import từ `"react-router"` & `"react-router/dom"` |
| **Quản lý Trạng thái** | Zustand v5 + React Context | Zustand (`persist`) cho Giỏ hàng; Context CHỈ dùng cho Theme & Auth |
| **Kiểm thực Dữ liệu** | Zod v4 | Xác thực 3 tầng: API Response, Form Inputs, URL Query/Params |
| **Giao diện (Styling)** | CSS Thuần túy (CSS Variables) | Không Tailwind, không UI libs, Dark/Light Mode Cung Đình Huế |
| **Biểu tượng (Icons)** | SVG Thuần (Tự vẽ) | Không dùng font icon/thư viện ngoài, không emoji trong UI |
| **Biểu đồ (Charts)** | SVG Thuần (Bar & Donut) | Tự tính toán toạ độ hình học, không dùng Chart.js hay Recharts |
| **Cơ sở dữ liệu Cloud** | Supabase Cloud PostgreSQL | 5 Bảng dữ liệu quan hệ, Row Level Security (RLS) bảo vệ từng hàng |
| **Backend Mock Dự phòng** | Node.js HTTP Server (`server/api.cjs`) | Không dùng Express, cổng 4000, dữ liệu tại `server/db.json` |
| **Kiểm thử (Testing)** | Vitest + Testing Library | 14/14 ca kiểm thử định tuyến, phân quyền và xác thực Zod |

---

## 4. BẢN ĐỒ ĐỊNH TUYẾN TOÀN DIỆN (18 ROUTES)

### Phân hệ Khách hàng Công cộng (Public)
1. `/` : Trang Chủ (Hero Banner, Giới thiệu cổ phục, Gói cưới tiêu biểu, Form tư vấn nhanh).
2. `/dich-vu` : Danh sách dịch vụ lẻ (Áo dài, Thợ ảnh, Địa điểm, Trang trí) + Bộ lọc & Sắp xếp giá.
3. `/dich-vu/:id` : Chi tiết từng dịch vụ cổ phục/thợ ảnh di sản, ảnh HD, đặt dịch vụ.
4. `/goi-cuoi` : Danh sách gói cưới combo hoàng gia + Bộ lọc phong cách cung đình/cổ điển/tân thời.
5. `/goi-cuoi/:id` : Chi tiết gói cưới combo, **In Báo Giá & Dự Thảo Hợp Đồng Hoàng Gia Chuẩn A4 (`window.print()`)**.
6. `/thiep-cuoi` : Kho giao diện thiệp cưới điện tử smartphone, mở phong bì hoàng triều, **mừng cưới VietQR động**.
7. `/thiep-cuoi/dang-ky` : Thiết kế thiệp cưới tùy biến, tải ảnh dâu rể, nhập ngày cưới và địa điểm hôn lễ.
8. `/gio-hang` : Giỏ hàng hoàng gia, **đặt cọc trước 20% giữ ngày cưới qua Dynamic VietQR**.
9. `/don-cua-toi` : **Lịch sử đơn & Tra cứu tiến độ hôn lễ, hủy đơn yêu cầu (Chuẩn US#4 Mẫu Giảng Viên)**.
10. `/dat-lich` : Đặt lịch trải nghiệm cổ phục và chụp ảnh tại Đại Nội Huế.
11. `/tu-van` : AI Tư vấn ngân sách hôn lễ (Thuật toán Client-Side tối ưu chi phí, so khớp gói cưới).
12. `/login` : Cổng đăng nhập quản trị viên và khách hàng kèm nút quick-fill 2 vai trò.
13. `*` : Trang 404 "Cung Điện Vắng Bóng" hoài niệm xứ Huế.

### Phân hệ Quản trị Studio (Protected Admin - Phân quyền 2-Tier RBAC)
14. `/admin` : Dashboard KPI Corbel SaaS (Live Visitor Counter, 4 Sparklines, Bar & Donut SVG, Hóa đơn .txt).
15. `/admin/dich-vu` : Quản lý dịch vụ lẻ (Thêm, Sửa, Xóa có ConfirmModal hoàng gia).
16. `/admin/goi-cuoi` : Quản lý combo gói cưới (Multi-select checkbox dịch vụ thành phần).
17. `/admin/yeu-cau` : Quản lý đơn tư vấn với **Bảng Danh Sách + Kanban Board 4 cột tiến độ**.
18. `/admin/tai-khoan` : **Quản lý tài khoản & phân quyền 2 cấp độ (Admin & Khách hàng), bảo vệ Root Admin**.

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

