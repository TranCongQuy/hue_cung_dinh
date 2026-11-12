# BẢN TUYÊN BỐ SỬ DỤNG TRÍ TUỆ NHÂN TẠO (AI DECLARATION)

**Học phần:** Web FrontEnd Nâng Cao (Mã môn: INT.7.18)  
**Tên đồ án:** Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh Hoàng Triều (`doan-fenc`)  
**Sinh viên thực hiện:** Trần Công Quý  
**Mã số sinh viên (MSSV):** 2401ITA001  
**Lớp:** CNTT K22  
**Giảng viên hướng dẫn:** Thầy Dương Ngọc Duy  
**Đối tượng áp dụng:** Báo cáo đồ án cuối kỳ, Mã nguồn hệ thống và Tài liệu kỹ thuật đi kèm.

---

## 1. NGUYÊN TẮC LIÊM CHÍNH HỌC THUẬT (ACADEMIC INTEGRITY)

Chúng tôi cam kết tuân thủ nghiêm ngặt các quy định về liêm chính học thuật trong nghiên cứu và phát triển phần mềm:
1. Trí tuệ nhân tạo (Generative AI / Coding Assistant) được sử dụng với vai trò là **Công cụ Hỗ trợ Lập trình (Pair Programming Tool)** và **Cố vấn Kỹ thuật (Technical Advisor)**.
2. Sinh viên phát triển là người trực tiếp xây dựng ý tưởng, định hình kiến trúc, đưa ra các ràng buộc kỹ thuật khắt khe, kiểm thử, phản biện và chịu trách nhiệm hoàn toàn về chất lượng của từng dòng mã nguồn.
3. Không sao chép nguyên mẫu mã nguồn không hiểu rõ hoặc sử dụng mã không đáp ứng các tiêu chuẩn kỹ thuật nghiêm ngặt của học phần (như cấm dùng `any`, cấm dùng Tailwind CSS, cấm thư viện UI/Icon/Chart bên ngoài, bắt buộc dùng CSS thuần, Pure SVG và React 19).

---

## 2. PHẠM VI ỨNG DỤNG CÔNG CỤ TRÍ TUỆ NHÂN TẠO

Trong quá trình thực hiện đồ án, công cụ AI được ứng dụng vào các khâu cụ thể sau:

| STT | Khâu thực hiện | Vai trò của AI | Kiểm soát & Thẩm định bởi Sinh viên |
|:---:|:---|:---|:---|
| 1 | **Tài liệu & Đặc tả** | Hỗ trợ soạn thảo khung tài liệu chuẩn PRD, ROUTES, AGENTS và kịch bản sinh báo cáo `.docx` | Rà soát đối chiếu 1:1 từng con số định lượng với mã nguồn thực tế, chỉnh sửa câu chữ học thuật |
| 2 | **Dữ liệu Giả lập (Mock Data)** | Gợi ý tên gọi trang phục cổ phục triều Nguyễn và địa danh di sản Cố đô Huế | Lọc và kiểm tra từng URL ảnh Unsplash 200 OK, chuẩn hóa mức giá VND thực tế cho 18 dịch vụ và 9 gói cưới |
| 3 | **Toán học Hình học Pure SVG** | Gợi ý tọa độ đường cong Bézier sông Hương, lớp ma-nơ-canh 2D và cung tròn Donut Chart | Tự viết và tinh chỉnh toàn bộ 63 icon SVG, Bản đồ Di sản 9 tọa độ, Phòng phối cổ phục 2D và các biểu đồ thống kê |
| 4 | **Tối ưu Kiểu dữ liệu (TypeScript)** | Hỗ trợ phát hiện các trường hợp rò rỉ kiểu dữ liệu hoặc chỉ mục mảng chưa kiểm tra | Thiết lập `strict: true` + `noUncheckedIndexedAccess: true`, xây dựng `AsyncState<T>` với nhánh vét cạn `assertNever` |
| 5 | **Soạn thảo Kịch bản Kiểm thử** | Gợi ý các ca kiểm thử biên cho Router, Store, VietQR BIN, đếm ngược thời gian thực và RSVP | Trực tiếp thực thi `npm test` với Vitest v3.2.7 đạt 53/53 ca kiểm thử vượt qua trên 3 tệp test |
| 6 | **Phân Quyền & Quản Trị ERP** | Gợi ý cấu trúc 2-Tier RBAC (`admin` & `user`), Kanban HTML5 Drag & Drop 5 cột và điều phối Ekip | Trực tiếp kiểm soát `ProtectedRoute`, bảo vệ tài khoản root admin, đồng bộ lịch chụp và nhật ký CSKH |
| 7 | **In Ấn & Thanh Toán VietQR** | Gợi ý cú pháp CSS `@media print` và cấu trúc mã BIN 15 ngân hàng Napas247 | Thiết kế bố cục Hợp đồng A4 pháp lý và Sổ tay kế hoạch cưới A4, kiểm tra sinh mã QR động trên trình duyệt |

---

## 3. CÁC NỘI DUNG TUYỆT ĐỐI KHÔNG PHỤ THUỘC VÀO AI

Để đảm bảo tinh thần của một đồ án môn học "Web FrontEnd Nâng Cao":
- **Kiến trúc hệ thống:** Mô hình Feature-based và quy tắc phụ thuộc một chiều (`app ➔ pages ➔ features ➔ components ➔ lib`) do người phát triển chủ động hoạch định.
- **Tư duy Thẩm mỹ (UI/UX):** Bảng màu hoàng gia cung đình trong `src/styles/variables.css` (Đỏ mận `#8B0000`, Vàng kim `#D4AF37`, Trắng ngà `#FDFBF7`, Nền tối `#1A1512`), độ tương phản dễ đọc và bố cục Flexbox/Grid được tính toán bằng CSS thuần.
- **Làm chủ mã nguồn:** Người phát triển sẵn sàng giải trình chi tiết từng hàm, từng hook, từng schema Zod và từng component trước hội đồng chấm thi môn học.

---

## 4. KẾT LUẬN & CAM KẾT TRÁCH NHIỆM

Việc sử dụng Trí tuệ Nhân tạo trong đồ án này mang tính chất minh bạch, có trách nhiệm và nâng cao năng suất kỹ thuật. Toàn bộ mã nguồn đã được biên dịch thành công (`npm run typecheck` đạt 0 lỗi), vượt qua 53/53 ca kiểm thử tự động Vitest và tuân thủ nghiêm ngặt các tiêu chí của giảng viên hướng dẫn.
