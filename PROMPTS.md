# NHẬT KÝ KỸ THUẬT VÀ CÂU LỆNH NHẬP LIỆU (PROMPTS.MD)

Tài liệu này ghi lại toàn bộ hệ thống các câu lệnh kỹ thuật (Prompts), chiến lược định hướng tư duy (Chain-of-Thought) và phương pháp kiểm thử được áp dụng trong quá trình phát triển dự án **"Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh" (`doan-fenc`)**.

---

## 1. CHIẾN LƯỢC KỸ THUẬT PROMPT (PROMPT ENGINEERING STRATEGY)

Để đạt chất lượng mã nguồn cao nhất cho môn học FrontEnd Nâng Cao, chúng tôi áp dụng các kỹ thuật định hướng mô hình ngôn ngữ lớn sau:
1. **Role-Based Persona:** Định hình rõ vai trò là "Senior Frontend Engineer & UI/UX Designer xuất sắc".
2. **Negative Constraints (Ràng buộc tiêu cực nghiêm ngặt):**
   - CẤM TUYỆT ĐỐI Tailwind CSS, Bootstrap, MUI.
   - CẤM thư viện Icon bên ngoài (Lucide, FontAwesome, React-Icons).
   - CẤM Emoji trong giao diện người dùng.
   - CẤM dùng kiểu `any` và cấm ép kiểu `as`.
   - CẤM thư viện Express (chỉ dùng Node.js HTTP gốc).
3. **Gradual Execution (Thực thi phân đoạn theo từng Batch):** Chia nhỏ dự án thành 7 phân đoạn (Batch 0 -> Batch 6) để kiểm soát chất lượng, chạy `typecheck` sau mỗi bước nhằm triệt tiêu lỗi tiềm ẩn.

---

## 2. NHẬT KÝ CHI TIẾT CÁC BATCH (PROMPT LOG)

### Batch 0: Khởi Tạo Hồ Sơ & Tài Liệu Kiến Trúc
- **Mục tiêu:** Xây dựng toàn bộ hệ thống tài liệu chuẩn mực trước khi gõ dòng code ứng dụng đầu tiên.
- **Prompt kỹ thuật:**
  > "Khởi tạo hệ thống tài liệu hoàn chỉnh gồm: `AGENTS.md` (quy chuẩn kỹ thuật cho developer/agent), `docs/PRD.md` (đặc tả yêu cầu sản phẩm chi tiết với persona và mô hình dữ liệu), `docs/ROUTES.md` (đặc tả 11 tuyến đường và sơ đồ định tuyến), `AI-DECLARATION.md` (bản tuyên bố liêm chính học thuật), `PROMPTS.md` (nhật ký câu lệnh kỹ thuật), và `README.md` (hướng dẫn vận hành dự án). Toàn bộ nội dung bằng tiếng Việt trang trọng, chuẩn mực đại học."
- **Kết quả đạt được:** Bộ 6 file tài liệu đồng bộ, rõ ràng, định hình toàn bộ cấu trúc cho các giai đoạn tiếp theo.

---

### Batch 1: Hệ Thống Giao Diện Cung Đình & Thư Viện Thành Phần Dùng Chung
- **Mục tiêu:** Thiết lập nền móng thiết kế với CSS Variables, typography cổ điển và hệ thống SVG thuần.
- **Prompt kỹ thuật:**
  > "Hãy thiết kế bảng màu Cung Đình Huế: Đỏ đô hoàng gia (#8B0000), Vàng kim (#D4AF37), Trắng ngà (#FDFBF7) cho Light Mode và Nền tối (#1A1512), Bề mặt (#26201C), Chữ ngà sáng (#EAE3D9) cho Dark Mode. Tạo file `src/styles/globals.css` với CSS Variables và typography serif sang trọng kết hợp sans-serif nội dung.
  > Tạo bộ component dùng chung: `Icon.tsx` (tự vẽ các SVG: Menu, Moon, Sun, Cart, Filter, Chevron, Check, Trash, Edit, Close, v.v.), `Button.tsx` (nhiều biến thể primary, secondary, danger, ghost có hiệu ứng hover nhấc nhẹ), `Input.tsx` (hỗ trợ label, touched, aria-invalid, alert error message), `Modal.tsx` và `Toast.tsx`."
- **Rà soát mã nguồn:** Đảm bảo không có bất kỳ thư viện ngoài nào được import, toàn bộ animation và kiểu dáng thuần CSS.

---

### Batch 2: Tầng Dữ Liệu Type-Safe & Mock Server Thuần Node.js
- **Mục tiêu:** Tạo Zod Schema 3 tầng, Discriminated Union AsyncState và máy chủ backend thuần cổng 4000.
- **Prompt kỹ thuật:**
  > "Viết Zod Schemas cho DichVu, GoiCuoi, YeuCau, NguoiDung bằng Zod v4. Suy ra các type bằng `z.infer`. Tạo generic `AsyncState<T>` bằng Discriminated Union. Xây dựng hook `useFetch` an toàn, nhận `schema: z.ZodSchema<T>` và trả về dữ liệu đã `safeParse`.
  > Viết file `server/api.cjs` sử dụng module `http` thuần của Node.js (KHÔNG dùng Express) phục vụ dữ liệu từ `server/db.json` trên cổng 4000. Hỗ trợ CORS, các phương thức GET, POST, PUT, PATCH, DELETE và endpoint tính toán gói cưới `POST /api/tu-van/tinh-toan`."
- **Rà soát mã nguồn:** Xác thực rằng mọi API endpoint đều trả về JSON đúng chuẩn và parse an toàn với Zod.

---

### Batch 3: Xác Thực, Chủ Đề & Các Tuyến Đường Công Cộng
- **Mục tiêu:** Hoàn thiện AuthContext, ThemeContext, ProtectedRoute, Trang chủ, Danh mục Dịch vụ và Gói cưới.
- **Prompt kỹ thuật:**
  > "Triển khai `ThemeContext` (lưu trạng thái light/dark vào localStorage và gán `data-theme` lên thẻ `<html>`).
  > Triển khai `AuthContext` quản lý đăng nhập Admin (`admin/123456`). Tạo `ProtectedRoute` chặn truy cập trái phép.
  > Xây dựng `HomePage` với Hero Banner hoàng gia, giới thiệu di sản, các gói cưới tiêu biểu và Form tư vấn nhanh.
  > Xây dựng `ServicesPage` có bộ lọc category và sắp xếp giá. Xây dựng `PackagesPage` hiển thị lưới combo cưới."
- **Kiểm tra chất lượng:** Giao diện phản hồi nhạy (responsive), chuyển đổi chế độ sáng/tối tức thời.

---

### Batch 4: Tuyến Động Chi Tiết Gói, AI Tư Vấn & Giỏ Hàng Zustand
- **Mục tiêu:** Triển khai tuyến `/goi-cuoi/:id`, công cụ tính toán `/tu-van` và Zustand `cartStore`.
- **Prompt kỹ thuật:**
  > "Xây dựng trang `/goi-cuoi/:id` đọc `useParams`, fetch thông tin gói cưới và map chi tiết các dịch vụ con kèm hình ảnh và đơn giá. Tích hợp nút 'Thêm vào giỏ' kết nối với `cartStore` (Zustand v5 + persist middleware).
  > Xây dựng trang `/tu-van` cho phép nhập ngân sách, quy mô khách và phong cách. Gọi API `POST /api/tu-van/tinh-toan` để hiển thị gói cưới tối ưu, phân tích thừa/thiếu ngân sách và cho phép gửi đơn yêu cầu ngay tại chỗ."
- **Đặc tả kiểm tra:** Kiểm tra tính bền vững của dữ liệu giỏ hàng khi người dùng F5 tải lại trang.

---

### Batch 5: Phân Hệ Quản Trị & Biểu Đồ SVG Thuần
- **Mục tiêu:** Xây dựng Dashboard và các trang quản trị CRUD chuyên nghiệp.
- **Prompt kỹ thuật:**
  > "Xây dựng giao diện `AdminLayout` với thanh điều hướng Cung Đình.
  > Tại `AdminDashboardPage`, tự vẽ Biểu đồ Cột SVG (Bar Chart) doanh thu theo tháng và Biểu đồ Tròn SVG (Donut Chart) tỷ lệ gói cưới hoàn toàn bằng thẻ `<svg>`, `<rect>`, `<path>`, `<text>` thuần túy, không dùng bất kỳ thư viện biểu đồ nào.
  > Xây dựng `AdminServicesPage` (CRUD dịch vụ lẻ kèm Confirm Modal trước khi xóa).
  > Xây dựng `AdminPackagesPage` (CRUD gói cưới có giao diện checkbox chọn nhiều dịch vụ lẻ).
  > Xây dựng `AdminRequestsPage` (duyệt và đổi trạng thái đơn tư vấn: Chờ xử lý -> Đã liên hệ -> Hoàn thành)."
- **Kiểm duyệt UI:** Biểu đồ SVG sắc nét ở mọi độ phân giải, giao diện quản trị sang trọng và đồng bộ.

---

### Batch 6: Kiểm Thử Toàn Diện & Tối Ưu Hóa Cuối Cùng
- **Mục tiêu:** Viết kiểm thử Vitest, rà soát typecheck và hoàn tất nghiệm thu.
- **Prompt kỹ thuật:**
  > "Thiết lập Vitest và `@testing-library/react`. Viết các ca kiểm thử tích hợp định tuyến bằng `createMemoryRouter` cho cả Public Routes và Protected Admin Routes. Kiểm thử logic tính toán ngân sách và xác thực Zod.
  > Chạy `npm run typecheck` và `npm run build` để chứng minh 0 lỗi cú pháp và kiểu dữ liệu."
- **Kết quả:** Mã nguồn đạt chất lượng tối đa, sẵn sàng bảo vệ đồ án.

---

### Batch 7: Tái Cấu Trúc Gộp File & Khôi Phục Hệ Thống Thiết Kế (Design System Restoration)
- **Mục tiêu:** Gộp các micro-files (types, schema, micro-components) để giảm 30% số lượng file phân mảnh theo quy chuẩn Clean Code, đồng thời khôi phục trọn vẹn 100% bản sắc thiết kế cung đình: Font Serif hoàng triều, theme tokens, card hover elevation, skeleton loading.
- **Prompt kỹ thuật:**
  > "Thực hiện đại tu cấu trúc file (Refactor) để làm gọn dự án mà không thay đổi bất kỳ logic nghiệp vụ nào. Gộp types và Zod schema vào `types.ts`, gộp micro-components vào `UI.tsx`. Sau đó, tiến hành Deep Design Restoration để đảm bảo toàn bộ CSS Variables, màu sắc Đỏ mận (#8B0000) và Vàng gold (#D4AF37), hiệu ứng hover thẻ và modal xem trước thiệp cưới hiển thị hoàn hảo."
- **Kết quả:** Giảm số lượng file đáng kể, kiến trúc tinh gọn, giao diện đạt chuẩn thẩm mỹ cao.

---

### Batch 8: Nâng Cấp Phân Quyền 3 Vai Trò, Quản Lý Tài Khoản, Kanban & In Hợp Đồng A4
- **Mục tiêu:** Bổ sung đầy đủ các tính năng nâng cao theo phản hồi chuyên môn của giảng viên hướng dẫn:
  1. Xây dựng phân hệ **Quản Lý Tài Khoản & Phân Quyền (`/admin/tai-khoan`)** độc quyền cho Super Admin.
  2. Thiết lập cơ chế **3-Tier RBAC** (`admin` toàn quyền, `nhan-vien` điều phối dịch vụ/đơn hàng, `user` khách hàng công cộng).
  3. Bổ sung chế độ xem **Kanban Board** chuyển cột trạng thái 1-click cho Đơn Yêu Cầu Tư Vấn (`/admin/yeu-cau`).
  4. Tích hợp **In Báo Giá & Dự Thảo Hợp Đồng Hoàng Gia A4** (`window.print()`) với `@media print` trang trọng.
  5. Tích hợp **Dynamic VietQR** cho mừng cưới trực tuyến và đặt cọc giữ lịch cưới 20%.
  6. Tối ưu hóa **100% Responsive Web & Mobile** với Sidebar Drawer mượt mà trên điện thoại.
- **Prompt kỹ thuật:**
  > "Đảm bảo không có lỗi gì và test full lại các chức năng của dự án. Mọi luồng và nút nhấn phải có logic chặt chẽ với nhau. Bổ sung các tính năng đột phá: Quản lý tài khoản Admin, phân quyền 3 vai trò, Kanban Board, In ấn A4, Dynamic VietQR, và cập nhật toàn bộ hệ thống tài liệu .md."
- **Kết quả nghiệm thu:** 13/13 ca kiểm thử Vitest thành công, TypeScript typecheck 0 lỗi, Vite production build 100% vượt qua.

---

### Batch 9: Đại Nâng Cấp Admin Dashboard Phong Cách Corbel SaaS
- **Mục tiêu:** Nâng tầm giao diện và nghiệp vụ của trang `/admin` đạt chuẩn mực quốc tế như Corbel Dashboard, kết hợp hoàn hảo với linh hồn Cung Đình Huế:
  1. **Live Visitor Odometer:** Đèn xanh ngọc phát sáng nhấp nháy (`pulsing dot`) và bộ đếm khách online thời gian thực.
  2. **Smart Greeter & Quick Action Bar:** Lời chào theo buổi trong ngày và cụm nút thao tác nhanh.
  3. **Time Horizon Switcher:** Bộ lọc 4 khoảng thời gian linh hoạt (Hôm nay, 7 ngày, Tháng này, Năm 2026).
  4. **4 KPI Sparklines:** Tích hợp đường sóng Pure SVG gradient, tỷ lệ tăng trưởng và thanh đo quota tháng.
  5. **Biểu đồ Cột & Donut SVG Tương Tác:** Tooltip nổi khi hover, so sánh baseline cùng kỳ và tâm hiển thị tổng số hợp đồng.
  6. **Live Activity Stream & Top Sellers:** Nhật ký sự kiện khách hàng thời gian thực và bảng vinh danh sản phẩm hot.
  7. **Studio Plan & License Card:** Lấy cảm hứng trực tiếp từ `Corbel #settings/plan`, hiển thị bản quyền VIP và hỗ trợ tải hóa đơn `INV-2026-1024P.txt`.
- **Prompt kỹ thuật:**
  > "Triển khai nâng cấp toàn bộ trang Admin Dashboard (/admin), nâng cấp tất cả, cập nhật các file .md, đảm bảo các luồng đúng chức năng, 0 lỗi và test đầy đủ."
- **Kết quả nghiệm thu:** Giao diện Dashboard đạt tính thẩm mỹ và nghiệp vụ tối đa, 13/13 unit tests pass, typecheck 0 lỗi, build 100% thành công.

---

### Batch 10: Tinh Gọn Hệ Thống Phân Quyền 2 Cấp Độ (2-Tier RBAC) - Loại Bỏ Điều Phối Viên
- **Mục tiêu:** Thực hiện theo chỉ đạo của người dùng: Loại bỏ triệt để vai trò "Điều Phối Viên" (`nhan-vien`) trên toàn bộ hệ sinh thái mã nguồn, đưa hệ thống về mô hình chuẩn hóa 2 vai trò tinh gọn:
  - `admin`: Quản Trị Viên Tối Cao (toàn quyền hệ thống, quản lý tài khoản, dịch vụ, gói cưới, đơn yêu cầu).
  - `user`: Khách Hàng (sử dụng cổng dịch vụ công cộng, thiệp cưới điện tử, AI tư vấn, giỏ hàng VietQR).
- **Phạm vi tái cấu trúc:**
  1. `src/features/auth/types.ts`: Xóa `"nhan-vien"` khỏi `nguoiDungSchema`, `userAccountSchema`, `userFormSchema`.
  2. `src/features/auth/AuthContext.tsx`: Loại bỏ `STAFF_USER`, `isStaff`, hợp nhất logic `canAccessAdmin = isAdmin`.
  3. `src/features/auth/ProtectedRoute.tsx` & `src/app/routes.tsx`: Rút gọn danh sách `allowedRoles` thành `["admin"]` cho toàn bộ các tuyến `/admin/*`.
  4. `src/app/AdminLayout.tsx`: Luôn kích hoạt menu Quản Lý Tài Khoản cho Admin, xóa bỏ nhãn "Điều Phối Viên".
  5. `src/pages/LoginPage.tsx`: Thu gọn nút chọn nhanh tài khoản về 2 nút chuẩn: Admin & Khách Hàng.
  6. `src/pages/admin/AdminUsersPage.tsx`: Xóa bỏ dữ liệu mẫu nhân viên, cập nhật 4 thẻ KPI (Tổng, Quản Trị, Khách Hàng, Đang Hoạt Động), lọc và phân quyền chỉ gồm 2 vai trò.
  7. `server/api.cjs` & `server/db.json`: Xóa sạch tài khoản `u-staff` (`nhanvien`) khỏi cơ sở dữ liệu.
  8. `src/test/routes.test.tsx` & `src/test/validation.test.ts`: Cập nhật ca kiểm thử xác nhận `nhan-vien` bị từ chối và luồng admin được bảo vệ nghiêm ngặt.
  9. Đồng bộ hóa toàn bộ hệ thống tài liệu: `docs/PRD.md`, `docs/ROUTES.md`, `README.md`, `PROMPTS.md`, `AI-DECLARATION.md`.
- **Kết quả nghiệm thu:** Toàn bộ 13/13 unit tests Vitest vượt qua xuất sắc, `npm run typecheck` đạt 0 lỗi, `npm run build` hoàn thành nhanh chóng (4.27s).

