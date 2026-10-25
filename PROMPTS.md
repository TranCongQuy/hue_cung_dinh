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

---

### Batch 11: Chuẩn Hóa Toàn Diện Theo Mẫu Thầy (AGENTS.md & PRD), Xử Lý Triệt Để Lỗi HTML/JSON Trên Vercel & Tích Hợp Supabase Cloud
- **Mục tiêu:**
  1. Tái cấu trúc `AGENTS.md` theo cấu trúc mẫu chuẩn của giảng viên (`Stack`, `Cấu trúc thư mục`, `Qui ước`, `Cấm`, `Backend & Cloud Deployment`, `Danh mục tài liệu đồng bộ`).
  2. Tái cấu trúc `docs/PRD.md` theo cấu trúc 8 mục chuẩn mực của giảng viên (`1. Vấn đề`, `2. Người Dùng`, `3. User Story (8 US cốt lõi kèm Tiêu chí xong Acceptance Criteria)`, `4. Các Thực Thể Dữ Liệu`, `5. Danh Sách Tuyến (17 Routes)`, `6. Ngoài Phạm Vi`, `7. Tiêu Chí Định Nghĩa Xong`, `8. Ghi Chú Kỹ Thuật`).
  3. Khắc phục lỗi `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` trên Vercel do cơ chế SPA Rewrite chuyển `/api/*` về `index.html`. Xây dựng tầng Client-side Adapter và Fallback đa tầng bảo đảm trang web luôn hiển thị đầy đủ 100% dữ liệu ngay cả khi chưa kết nối API.
  4. Tự động chuẩn hóa và làm sạch `VITE_SUPABASE_URL` (loại bỏ `/rest/v1/` và dấu gạch chéo dư thừa), chống lỗi 404 khi người dùng sao chép REST URL từ Supabase Dashboard.
  5. Chuyển đổi toàn bộ thuật toán tính toán gói cưới tối ưu AI (`/tu-van`) chạy thuần Client-Side, mang lại trải nghiệm tức thì (0ms latency), không phụ thuộc vào server Node.js.
- **Kết quả nghiệm thu:** 13/13 unit tests Vitest đạt chuẩn, `npm run typecheck` 0 lỗi, `npm run build` hoàn tất, ứng dụng vận hành hoàn hảo trên `https://huecungdinh.vercel.app/`.

---

### Batch 12: Bổ Sung Phân Hệ Đơn Của Tôi (/don-cua-toi), Mở Rộng 22 Booking Mẫu & Điền Định Danh Học Viên
- **Mục tiêu:**
  1. Thêm trang **"Lịch Sử Đơn Hàng & Tra Cứu" (`/don-cua-toi`)** dành riêng cho Khách Hàng, khớp 100% với **US#4** trong mẫu PRD của giảng viên. Cung cấp tính năng tra cứu theo SĐT/Mã đơn, phân loại 6 trạng thái và cho phép bấm "Hủy đơn" an toàn với Modal xác nhận.
  2. Bổ sung bộ dữ liệu mẫu lên **22 đơn yêu cầu/booking** trải dài từ `yc-01` đến `yc-22` với các trạng thái (`cho-xu-ly`, `da-duyet`, `da-lien-he`, `hoan-thanh`, `tu-choi`), đáp ứng hoàn hảo tiêu chí Done Criteria `≥20 booking` của Thầy.
  3. Bổ sung lớp lỗi có cấu trúc `AppError extends Error` tại `src/lib/types.ts` theo đúng quy ước `AGENTS.md`.
  4. Cập nhật chính xác thông tin sinh viên thực hiện: **Trần Công Quý (MSSV: 2401ITA001 - Lớp CNTT K22 - GVHD: Thầy Dương Ngọc Duy)** trên toàn bộ hệ thống tài liệu: `docs/PRD.md`, `docs/ROUTES.md`, `README.md`, `AI-DECLARATION.md`, `AGENTS.md`, `PROMPTS.md`.
  5. Đăng ký tuyến mới trong React Router (tổng 18 routes), thêm liên kết điều hướng tại Header Navbar, User Dropdown Menu và Footer.
- **Kết quả nghiệm thu:** 14/14 ca kiểm thử Vitest thành công (thêm kiểm thử cho route `/don-cua-toi`), `npm run typecheck` đạt 0 lỗi, `npm run build` thành công rực rỡ.


---

### Batch 13: Đại Tu Toàn Diện 23 Hạng Mục Logic Nghiệp Vụ & UX/UI Cung Đình Hoàng Triều
- **Mục tiêu:** Thực hiện theo lệnh trực tiếp của người dùng sau khi rà soát và đối chiếu thực tế toàn bộ luồng dự án qua 23 ảnh chụp màn hình:
  1. **Tối ưu thanh điều hướng Header & Menu tài khoản (Mục 1, Mục 4):** Ẩn "Đơn Của Tôi" khi chưa đăng nhập; sau khi đăng nhập tích hợp tinh gọn trong User Menu Dropdown; loại bỏ lối tắt công khai "Cổng Quản Trị Studio" ở Footer để nâng cao tính bảo mật.
  2. **Trang Chủ Cung Đình (Mục 2, Mục 3):** Đổi nút phụ Hero thành "Khám Phá Gói Cưới" (`/goi-cuoi`); thay thế biểu mẫu tư vấn nhanh bằng Phân hệ Đánh Giá Trải Nghiệm Khách Hàng Thực Tế (`CustomerTestimonialsSection`) với các cặp đôi đã thực hiện bộ ảnh hoàng gia.
  3. **Trang Dịch Vụ Lẻ & Chi Tiết (Mục 5, 6, 7, 8, 9, 10):**
     - Bỏ auto-open giỏ hàng khi nhấn "Thêm giỏ", thêm hiệu ứng thông báo Toast 5s.
     - Thêm nút "Chi tiết" trực tiếp trên từng thẻ dịch vụ bên cạnh nút "Thêm giỏ".
     - Tại trang chi tiết dịch vụ: Bổ sung "Mẫu Tham Khảo & Cùng Phong Cách" và Phân hệ Đánh giá/Bình luận của khách hàng.
     - Thêm huy hiệu Top `⭐ Được Đặt Nhiều` xếp hạng sản phẩm.
     - Khắc phục triệt để lỗi bộ gõ tiếng Việt Telex/VNI bị ngắt chữ/che chữ bằng cơ chế local state debounced.
     - Chuẩn hóa bộ lọc sắp xếp giá và tên hoạt động chính xác 100% bằng useMemo Client-Side.
  4. **Trang Gói Cưới Combo & Báo Giá Nhanh (Mục 11, 12, 13, 14, 15):**
     - Bỏ in hợp đồng A4 tại trang chi tiết gói và dịch vụ (chuyển sang vị trí pháp lý chuẩn tại `/don-cua-toi`).
     - Đặt "Nhận Báo Giá Nhanh" và "Thêm Vào Giỏ Dịch Vụ" nằm cùng hàng cân đối.
     - Nâng cấp Modal Báo Giá Nhanh: Hiển thị tên gói, danh sách checkbox các mục trong combo cho phép khách hàng tự do bỏ bớt để chuyển sang cơ chế "Thương lượng giá theo nhu cầu", bỏ ô ngân sách cố định và kích hoạt Flash message 5s trang trọng.
     - Bổ sung hộp Đặc Quyền Chụp Ảnh Di Sản 8h tại Đại Nội, cho phép nhấn vào từng dịch vụ đi kèm để mở popup xem nhanh (`QuickViewServiceModal`) không rời trang.
  5. **Mẫu Thiệp Cưới, Chi Tiết & Tự Thiết Kế (Mục 16, 17, 18, 19, 20):**
     - Tạo lớp nhẫn hoàng gia bay lơ lửng cố định bằng Pure SVG (`FixedFloatingRings`) trên 4 trang dịch vụ chính.
     - Bổ sung Floating Contact Widget cố định góc dưới bên phải màn hình.
     - Đổi "Chọn thiệp" thành "Chi tiết" và xây dựng trang chi tiết thiệp độc lập (`/thiep-cuoi/:id`).
     - Thiết lập hiệu ứng Spotlight khung vàng đồng bộ tương tác giữa các nút phân loại và bảng giá.
     - Sửa triệt để lỗi dính chữ tại hàng chọn phong cách hôn lễ tại trang `/thiep-cuoi/dang-ky`.
     - Xây dựng giao diện 2 cột hoàn chỉnh: Bên phải nhập liệu chi tiết (tân lang, tân nương, song thân, ngày âm/dương, địa điểm, STK VietQR, nhạc nền, lời ngỏ); Bên trái là Mockup thiệp hoàng cung và VietQR mừng cưới thông minh hiển thị cập nhật theo thời gian thực (Real-time).
  6. **Đơn Của Tôi & Hợp Đồng A4 Pháp Lý (Mục 21):**
     - Làm sạch dữ liệu ban đầu để kiểm thử bằng dữ liệu thực tế.
     - Thẻ đơn hiển thị rõ mã đơn `#YC-XXXXX`, tên đơn, trạng thái màu sắc trực quan, ngày chụp và địa điểm di sản (loại bỏ hoàn toàn quy mô tiệc ăn cỗ).
     - Xây dựng Modal Chi Tiết Đơn có chức năng Hủy đơn hoàn cọc và Bổ sung mong muốn chụp ảnh (lưu trực tiếp vào CSDL).
     - **Xuất Hợp Đồng A4 Pháp Lý:** Khi đơn ở trạng thái "Đã duyệt" (`da-duyet`), kích hoạt nút "Xem & Xuất Hợp Đồng A4" cho cả Khách hàng và Admin, in ấn sắc nét qua `@media print`.
  7. **Giỏ Hàng & Modal Xác Nhận Chụp Ảnh (Mục 22, 23):**
     - Flash message 5s thông báo khi thêm/xóa món.
     - Modal đặt lịch hiển thị danh sách các món chụp ảnh đã chọn, thông tin liên hệ, ngày chụp, địa điểm di sản, cọc 20% VietQR.
     - Bổ sung bước xác nhận pop-up trang trọng kiểm tra lại các hạng mục tránh nhầm lẫn trước khi nhấn "Đồng Ý Đặt Lịch", hiển thị Flash message 5s cảm ơn và chuyển ngay đến trang "Đơn Của Tôi".
200: - **Kết quả nghiệm thu:** Toàn bộ 25/25 unit tests Vitest pass, `npm run typecheck` đạt 0 lỗi, `npm run build` hoàn thành trong 4.62s.
201: 
202: ---
203: 
204: ### Batch 14: Hoàn Thiện 9 Giao Diện Thiệp, Thứ Bậc Gia Đình, Sửa Triệt Để Layout Báo Giá & Tự Động Cuộn Đầu Trang (Scroll-To-Top)
205: - **Mục tiêu:**
206:   1. **Thiết kế 9 giao diện thiệp cưới riêng biệt (3 Hạng x 3 Phong cách):**
207:      - VIP Cung Đình: Vàng kim hoàng gia & gấm son thêu lộng lẫy, viền kép mạ vàng kép.
208:      - VIP Cổ Điển: Nâu son trầm mặc, nền giấy dó sông Hương, viền nhũ đồng baroque.
209:      - VIP Hiện Đại: Vàng hồng quý tộc & ngọc trai trắng sang trọng, viền kim loại thanh tao.
210:      - PRO Cung Đình: Đỏ đô son thắm & hoa sen vàng hoàng tộc.
211:      - PRO Cổ Điển: Xanh rêu di sản & nền ngà hoài niệm.
212:      - PRO Hiện Đại: Xanh Sapphire lam ngọc quý phái & bạch kim.
213:      - Basic Cung Đình: Đỏ gạch truyền thống Cố Đô & chữ Hỷ tôn nghiêm.
214:      - Basic Cổ Điển: Nâu đất mộc mạc hương xưa.
215:      - Basic Hiện Đại: Trắng tinh giản hiện đại, typography thanh thoát.
216:   2. **Thứ bậc gia đình Cô dâu & Chú rể:**
217:      - Thêm dropdown chọn danh xưng truyền thống: Chú rể (`Trưởng Nam`, `Thứ Nam`, `Út Nam`, `Quý Nam`, `Giai Út`, `Trưởng Tôn`); Cô dâu (`Trưởng Nữ`, `Thứ Nữ`, `Út Nữ`, `Quý Nữ`, `Gái Út`, `Trưởng Tôn Nữ`).
218:      - Hiển thị trực quan trên thiệp cưới: `{thuBacChuRe}: {tenChuRe}` & `{thuBacCoDau}: {tenCoDau}`.
219:   3. **Sửa lỗi layout Modal Báo Giá Nhanh Gói Cưới:**
220:      - Tái cấu trúc danh sách dịch vụ đi kèm thành dạng dòng ngang rộng rãi, loại bỏ hoàn toàn lỗi vỡ layout chữ xếp thẳng đứng từng ký tự.
221:      - Loại bỏ ký tự lặp dấu sao `* *` ở nhãn form, mở rộng modal lên `size="lg"` (720px) thoáng đãng, sang trọng.
222:   4. **Sửa text và hiệu ứng Khung Vàng Spotlight Bảng Giá Thiệp Cưới:**
223:      - Đổi tiêu đề thành: `BẢNG GIÁ DỊCH VỤ THIỆP CƯỚI - Bảng Giá Khởi Tạo Thiệp Cưới Cung Đình`.
224:      - Khung vàng chuyển động theo chuột (hover) linh hoạt sang bất kỳ thẻ nào, và cố định phát sáng rực rỡ khi click chọn gói đó, 2 gói còn lại mờ nhẹ.
225:   5. **Nâng cấp hiệu ứng Nhẫn & Trái Tim Đỏ Bay Lơ Lửng (`FixedFloatingRings`):**
226:      - Tăng số lượng lên 12-14 items gồm Nhẫn cưới kim cương mạ vàng, Nhẫn đôi hoàng gia, Trái tim son đỏ thắm (Ruby Heart SVG) và Kim cương hoa sen.
227:      - Tốc độ bay nhanh và chuyển động vô định, phong phú hơn với 3 quỹ đạo `driftWander`.
228:   6. **Trải nghiệm Giỏ hàng & Xem chi tiết cho Khách Vãng Lai (Chưa đăng nhập):**
229:      - Bổ sung nút liên kết trực tiếp trên thanh điều hướng và menu di động, đảm bảo khách chưa đăng nhập vẫn xem chi tiết, thêm giỏ và mở giỏ hàng 100% trơn tru.
230:      - Tự động hợp nhất dữ liệu fallback đa tầng trong `supabaseAdapter.ts` và `useFetch.ts` để không bao giờ bị lỗi 404 hoặc thiếu mục khi khách chưa đăng nhập.
231:   7. **Tự động cuộn đầu trang (Scroll-To-Top):**
232:      - Tạo component `<ScrollToTop />` kích hoạt `window.scrollTo(0, 0)` tức thời mỗi khi chuyển trang.
233: - **Kết quả nghiệm thu:** 25/25 unit tests pass, `npm run typecheck` 0 lỗi, `npm run build` hoàn tất (3.50s).

---

### Batch 15: Chế Độ Khách Vãng Lai Chỉ Xem Danh Mục (Guest View-Only Mode), Bảo Vệ Trang Chi Tiết & Đơn Hàng, Khắc Phục Lỗi Huy Hiệu, Tiêu Đề Bảng Giá & Nhãn Thứ Bậc
- **Mục tiêu:**
  1. **Thiết lập Phân Quyền Nghiêm Ngặt Khách Vãng Lai vs Người Dùng Đã Đăng Nhập:**
     - **Chưa đăng nhập (`!isAuthenticated`)**:
       - Ẩn hoàn toàn mục "Đơn Của Tôi" trên Header navigation.
       - Khách chỉ được xem danh mục sản phẩm (ảnh, tên, giá, tìm kiếm, lọc danh mục).
       - Không được xem chi tiết hay đặt gói: Bất kỳ click vào "Chi Tiết", "Thêm Giỏ", "Đặt Lịch", "Chọn Thiệp", "Tùy Biến" đều kích hoạt cảnh báo thông tin và điều hướng về `/login`.
       - Bảo vệ toàn bộ các tuyến đường nghiệp vụ (`/dich-vu/:id`, `/goi-cuoi/:id`, `/thiep-cuoi/:id`, `/thiep-cuoi/dang-ky`, `/thiep-cuoi/tuy-bien`, `/dat-lich`, `/gio-hang`, `/don-cua-toi`) bằng `<ProtectedRoute allowedRoles={["admin", "user"]}>`.
     - **Đã đăng nhập (`isAuthenticated`)**:
       - Mở khóa toàn quyền: xem "Đơn Của Tôi", xem chi tiết mọi sản phẩm, đặt lịch, thêm vào giỏ hàng, nhận báo giá đàm phán và in hợp đồng A4.
     - **Trang Đăng Nhập (`/login`)**:
       - Hiển thị hộp thông báo lý do điều hướng rõ ràng khi có `location.state.from`.
       - Tích hợp 2 nút đăng nhập 1-click tức thì cho Khách Hàng (`khachhang` / `123456`) và Quản Trị Viên (`admin` / `123456`) giúp kiểm thử và nghiệm thu đồ án thuận tiện.
  2. **Khắc Phục Lỗi Giao Diện Theo Ảnh Chụp:**
     - **Ảnh 1 (Chồng chéo huy hiệu):** Tái cấu trúc `.package-badges-header` và `.service-badges-header` bằng Flexbox `justify-content: space-between; flex-wrap: wrap; gap: 8px;`, đặt các huy hiệu ở tọa độ tương đối/tự nhiên triệt tiêu hoàn toàn lỗi chồng lấn huy hiệu phong cách và huy hiệu "⭐ Được Đặt Nhiều Nhất".
     - **Ảnh 2 (Khoảng cách tiêu đề Bảng Giá Thiệp Cưới):** Thiết lập class `.pricing-tag` dạng royal pill badge trang trọng, có nền vàng mạ, viền nhũ và khoảng đệm `margin-bottom: 16px`, tách biệt thẩm mỹ với tiêu đề `Bảng Giá Khởi Tạo Thiệp Cưới Cung Đình`.
     - **Ảnh 3 (Dấu sao rớt dòng & Trái tim che form):** Rút ngắn nhãn thành `Thứ bậc (Chú Rể)` và `Thứ bậc (Cô Dâu)`, mở rộng cột dropdown lên 220px kèm `white-space: nowrap; display: inline-flex;` ngăn dấu `*` rớt dòng; đưa toàn bộ tầng vật phẩm bay `.fixed-floating-rings-layer` về `z-index: -1` và `pointer-events: none` ở lớp nền sau toàn bộ form nhập liệu.
- **Kết quả nghiệm thu:** 25/25 unit tests Vitest pass, `npm run typecheck` 0 lỗi, `npm run build` hoàn thành trong 3.03s.
