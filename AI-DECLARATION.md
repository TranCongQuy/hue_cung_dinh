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
2. Sinh viên/Kỹ sư phát triển là người trực tiếp xây dựng ý tưởng, định hình kiến trúc, đưa ra các ràng buộc kỹ thuật khắt khe, kiểm thử, phản biện và chịu trách nhiệm hoàn toàn về chất lượng của từng dòng mã nguồn.
3. Không sao chép nguyên mẫu mã nguồn không hiểu rõ hoặc sử dụng mã không đáp ứng các tiêu chuẩn kỹ thuật nghiêm ngặt của học phần (như cấm dùng `any`, cấm dùng Tailwind CSS, cấm thư viện UI/Icon bên ngoài, bắt buộc dùng CSS thuần và React 19).

---

## 2. PHẠM VI ỨNG DỤNG CÔNG CỤ TRÍ TUỆ NHÂN TẠO

Trong quá trình thực hiện đồ án, công cụ AI được ứng dụng vào các khâu cụ thể sau:

| STT | Khâu thực hiện | Vai trò của AI | Kiểm soát & Thẩm định bởi Sinh viên/Kỹ sư |
|:---:|:---|:---|:---|
| 1 | **Tài liệu & Đặc tả** | Hỗ trợ soạn thảo khung tài liệu chuẩn PRD, ROUTES, AGENTS | Rà soát 100% nội dung, chỉnh sửa câu chữ, bổ sung các luồng nghiệp vụ chi tiết thực tế của đám cưới Huế |
| 2 | **Dữ liệu Giả lập (Mock Data)** | Gợi ý tên gọi trang phục cổ phục triều Nguyễn, tìm kiếm ảnh Unsplash phù hợp chủ đề Cố đô Huế | Lọc và kiểm tra từng URL ảnh thật, điều chỉnh mức giá VND thực tế và phân loại danh mục dịch vụ |
| 3 | **Toán học Hình học SVG** | Gợi ý công thức tính toán tọa độ góc cung tròn (Polar to Cartesian) cho biểu đồ Pie Chart SVG | Tự viết và tối ưu hóa component SVG thuần túy, kiểm tra độ co giãn responsive và khả năng hiển thị |
| 4 | **Tối ưu Kiểu dữ liệu (TypeScript)** | Hỗ trợ phát hiện các trường hợp rò rỉ kiểu dữ liệu hoặc ép kiểu ngầm định | Thiết lập cấu hình `strict: true`, xây dựng Discriminated Union `AsyncState<T>` với nhánh vét cạn `never` |
| 5 | **Soạn thảo Kịch bản Kiểm thử** | Gợi ý các ca kiểm thử biên cho Router và Form Validation | Trực tiếp chạy `npm run test` với Vitest, hiệu chỉnh các ca kiểm thử bộ định tuyến `createMemoryRouter` |
| 6 | **Phân Quyền & Quản Trị Hệ Thống** | Gợi ý cấu trúc RBAC tinh gọn 2 cấp độ (Admin & Khách hàng) và phân hệ quản lý tài khoản | Tự tay kiểm soát luồng chuyển hướng bảo vệ `ProtectedRoute`, bảo vệ tài khoản root admin và đồng bộ dữ liệu |
| 7 | **In Ấn & Tích Hợp Cổng Thanh Toán** | Gợi ý cú pháp CSS `@media print` và cấu trúc VietQR API mở | Thiết kế bố cục hợp đồng A4 hoàng gia sang trọng, kiểm tra hiển thị thực tế trên trình duyệt và thiết bị di động |
| 8 | **Thiết Kế Dashboard & Dữ Liệu Thời Gian Thực** | Tham khảo cấu trúc Dashboard SaaS hiện đại (Live counter, sparklines, time horizon) | Trực tiếp tự lập trình 100% SVG Sparkline thuần, thiết kế logic tính toán co giãn thời gian và tính năng tải hóa đơn `.txt` |

---

## 3. CÁC NỘI DUNG TUYỆT ĐỐI KHÔNG PHỤ THUỘC VÀO AI

Để đảm bảo tinh thần của một đồ án môn học "FrontEnd Nâng Cao":
- **Kiến trúc hệ thống:** Mô hình Feature-based và quy tắc phụ thuộc một chiều (`app → pages → features → components → lib`) do người phát triển chủ động hoạch định.
- **Tư duy Thẩm mỹ (UI/UX):** Bảng màu hoàng gia cung đình (Đỏ đô `#8B0000`, Vàng gold `#D4AF37`, Trắng ngà `#FDFBF7`, Tối `#1A1512`), tỷ lệ tương phản WCAG 2.1 AA, bố cục Flexbox/Grid được tính toán thủ công bằng CSS thuần.
- **Làm chủ mã nguồn:** Người phát triển sẵn sàng giải trình chi tiết từng hàm, từng hook, từng schema Zod và từng component trước hội đồng chấm thi môn học.

---

## 4. KẾT LUẬN & CAM KẾT TRÁCH NHIỆM

Việc sử dụng Trí tuệ Nhân tạo trong đồ án này mang tính chất minh bạch, có trách nhiệm và nâng cao năng suất kỹ thuật. Toàn bộ mã nguồn đã được biên dịch thành công (`npm run typecheck` đạt 0 lỗi), kiểm thử đạt chuẩn và tuân thủ 100% các tiêu chí khắt khe của giảng viên hướng dẫn.

