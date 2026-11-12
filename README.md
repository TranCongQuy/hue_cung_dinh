# HUẾ CUNG ĐÌNH – DỊCH VỤ CƯỚI & CHỤP ẢNH HOÀNG TRIỀU
## ĐỒ ÁN KẾT THÚC HỌC PHẦN: WEB FRONTEND NÂNG CAO (MÃ MÔN: INT.7.18)
**Mã dự án:** `doan-fenc` (Phiên bản: `1.0.0`)  
**Sinh viên thực hiện:** Trần Công Quý  
**Mã số sinh viên (MSSV):** 2401ITA001  
**Lớp:** CNTT K22  
**Giảng viên hướng dẫn:** Thầy Dương Ngọc Duy  
**Công nghệ:** React 19 + TypeScript (Strict) + Vite 6 + React Router v8 + Zustand v5 + Zod v4 + Pure CSS + Pure SVG + Supabase Cloud & Node.js Mock API  
**Live Demo trên Vercel:** [https://huecungdinh.vercel.app/](https://huecungdinh.vercel.app/)  
**GitHub Repository:** [https://github.com/TranCongQuy/hue_cung_dinh.git](https://github.com/TranCongQuy/hue_cung_dinh.git)  

---

## 1. GIỚI THIỆU TỔNG QUAN

Website **"Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh"** là nền tảng số hóa dịch vụ hôn lễ và nhiếp ảnh cổ phục triều Nguyễn tại Cố đô Huế. Dự án được xây dựng kết hợp trải nghiệm văn hóa hoàng gia với các kỹ thuật FrontEnd nâng cao:
- **Kiến trúc Feature-Based Một Chiều:** Phân tách rõ ràng giữa 8 phân hệ nghiệp vụ (`home`, `services`, `packages`, `consultation`, `requests`, `invitations`, `admin`, `auth`).
- **Type-Safe Nghiêm Ngặt:** TypeScript bật `strict: true` và `noUncheckedIndexedAccess: true`, 0 kiểu `any`, toàn bộ dữ liệu ngoài kiểm thực bằng Zod Schema (`safeParse`).
- **Pure CSS & Pure SVG 100%:** Không dùng Tailwind CSS, Bootstrap hay bất kỳ thư viện icon/biểu đồ ngoài nào; tự xây dựng 63 biểu tượng SVG, Bản đồ Di sản Cố đô SVG, Phòng phối cổ phục 2D SVG và các biểu đồ Bar/Donut/Sparklines SVG; 0 ký tự Emoji trong mã nguồn giao diện.
- **Tối Ưu Hóa Gói Đóng Gói (`React.lazy` & `manualChunks`):** Chia tách gói thông minh trên Vite 6 giúp toàn bộ chunk JavaScript đều nhỏ hơn 450 kB (0 cảnh báo vượt ngưỡng 500 kB).
- **Đa Nền Tảng Backend & Fallback Đa Tầng:** Hỗ trợ song song Supabase Cloud (PostgreSQL 6 bảng + Storage `studio-media` + RLS), máy chủ Node.js gốc (`server/api.cjs` cổng 4000) và kho dữ liệu hạt giống dự phòng ngoại tuyến.

---

## 2. BẢNG TÀI KHOẢN TRẢI NGHIỆM & PHÂN QUYỀN (2-TIER RBAC)

Hệ thống thiết lập cơ chế Phân Quyền Theo Vai Trò 2 Cấp Độ (2-Tier Role-Based Access Control) với 2 tài khoản thử nghiệm trên trang `/login`:

| Vai Trò | Tên Đăng Nhập (Username) | Mật Khẩu (Password) | Phạm Vi Quyền Hạn Trong Hệ Thống |
|:---|:---:|:---:|:---|
| **Quản Trị Viên (Super Admin)** | `admin` | `123456` *(hoặc `123`)* | **Toàn quyền hệ thống:** Dashboard KPI động, CRUD Dịch vụ, Gói cưới, Kho Thiệp & RSVP (`/admin/thiep-cuoi`), Kanban kéo thả 5 cột & Nhật ký CSKH (`/admin/yeu-cau`), Lịch Điều Phối Ekip (`/admin/lich-chup`), Quản lý Tài khoản (`/admin/tai-khoan`) và Cẩm nang SOP (`/quy-trinh`). |
| **Khách Hàng (Customer)** | `khachhang` | `123456` *(hoặc `123`)* | **Cổng Khách Hàng:** Khám phá Bản đồ Di sản, Phòng phối cổ phục 2D, Triển lãm Lookbook, Sổ tay Kế hoạch Cưới (`/ke-hoach-cuoi`), So sánh 3 gói cưới, Danh sách yêu thích, phát hành link thiệp cưới công khai `/thiep-cuoi/moi/:slug`, đặt cọc 20% VietQR và in Hợp đồng A4. |

---

## 3. HỆ SINH THÁI 12 PHÂN HỆ & NÂNG CẤP TRỌNG ĐIỂM

1. **Bản Đồ Di Sản Cố Đô Tương Tác Pure SVG (`/ban-do-di-san`):**
   - Bản đồ minh họa 2 bờ Sông Hương bằng Pure SVG với **9 tọa độ nhiếp ảnh di sản** thuộc 3 phân khu (Hoàng Thành, Lăng Tẩm, Thiên Nhiên & Phủ Đệ).
   - Cung cấp khung giờ vàng ánh sáng, phí giấy phép quay chụp, gợi ý cổ phục, quy tắc bảo tồn và **3 lộ trình bấm máy 1 ngày** nối tuyến trực tiếp sang trang Đặt lịch.
2. **Phòng Phối Cổ Phục Trực Quan 2D (`/phoi-co-phuc`):**
   - Sân khấu ma-nơ-canh đôi Tân Nương & Tân Lang vẽ bằng các lớp SVG đa tầng; tùy chọn 3 phom áo cô dâu, 2 phom áo chú rể, 9 sắc gấm truyền thống, mấn phượng và phụ kiện cầm tay.
   - Tính tổng chi phí thuê theo thời gian thực và thêm trọn bộ phối riêng vào giỏ cưới chỉ với 1 thao tác.
3. **Triển Lãm Lookbook & Thanh Trượt Hậu Kỳ Trước / Sau (`/trien-lam`):**
   - Thanh trượt tương tác Before/After kiểm chứng sự khác biệt giữa ảnh gốc máy ảnh và 3 preset chỉnh màu phim cung đình, kèm 9 bộ ảnh Lookbook và hộp xem ảnh phóng lớn hỗ trợ phím mũi tên.
4. **Thanh Tìm Kiếm Toàn Hệ Thống `Ctrl + K` (`RoyalCommandPalette`) & Chất Liệu Cung Đình:**
   - Hộp tìm kiếm nhanh mở từ bất kỳ trang nào bằng tổ hợp phím `Ctrl + K` (hoặc `Cmd + K`), tra cứu tức thì lối tắt phân hệ, 9 gói cưới, 18 dịch vụ lẻ, 6 mẫu thiệp và 9 địa danh di sản.
   - Kết hợp thanh tiến độ đọc trang mạ vàng (`ScrollProgressBar`) và dải hoa văn ngăn cách (`RoyalDivider`).
5. **Thiệp Cưới Online Chia Sẻ Công Khai (`/thiep-cuoi/moi/:slug`), 15 Ngân Hàng VietQR & RSVP:**
   - Sau khi cá nhân hóa tại `/thiep-cuoi/dang-ky`, cặp đôi phát hành đường dẫn công khai `/thiep-cuoi/moi/:slug` (ví dụ mẫu `/thiep-cuoi/moi/quoc-bao-ngoc-han-2026`).
   - Khách mời mở phong bì ấn triện sáp vàng không cần đăng nhập, nghe Nhã Nhạc Cung Đình (Web Audio API), xem đồng hồ đếm ngược thời gian thực tới từng giây, quét VietQR theo đúng mã BIN của **15 ngân hàng Việt Nam** và gửi xác nhận tham dự (RSVP mặn/chay) kèm lời chúc Sổ lưu bút.
6. **So Sánh Gói Cưới Trực Quan (Tối Đa 3 Gói) & Danh Sách Yêu Thích (`wishlistStore`):**
   - Lưu mục yêu thích xuyên suốt cho dịch vụ, gói cưới và mẫu thiệp; đặt tối đa 3 gói cưới cạnh nhau trên bảng đối chiếu hạng mục đi kèm.
7. **Lịch Tháng Kiểm Tra Ngày Trống Ekip & Chọn Ca Chụp (`/dat-lich`):**
   - Lịch tháng trực quan báo trạng thái *Trống lịch / Còn 1 ekip / Kín lịch*, chọn ca chụp (*Bình minh 05:30–09:30*, *Hoàng hôn 14:30–18:00*, *Trọn ngày*), kết hợp bộ chọn `RoyalSelect` hỗ trợ điều hướng bàn phím A11y và tự động điền họ tên + số điện thoại từ tài khoản.
8. **Sổ Tay Kế Hoạch & Dự Toán Đám Cưới Cá Nhân (`/ke-hoach-cuoi`):**
   - Checklist chuẩn bị lễ cưới theo 5 mốc thời gian, bảng theo dõi ngân sách dự kiến so với thực chi kèm Biểu đồ Donut Pure SVG và chế độ xuất bản in khổ A4 (`window.print()`).
9. **Quản Trị Kho Thiệp Cưới & Khách Mời RSVP (`/admin/thiep-cuoi`):**
   - Đầy đủ CRUD kho mẫu thiệp Studio (kèm tải ảnh bìa) và bảng thống kê các thiệp khách hàng đã phát hành kèm tổng số khách xác nhận tham dự (khẩu phần mặn / chay).
10. **Lịch Điều Phối Ekip Nhiếp Ảnh & Stylist Theo Tháng (`/admin/lich-chup`):**
    - Lịch điều hành trực quan giúp Quản trị viên phân công Nhiếp ảnh gia chánh máy, Nghệ nhân cổ phục và ca chụp cho từng đơn yêu cầu.
11. **Kanban Kéo Thả HTML5 5 Cột, Nhật Ký CSKH & Tải Ảnh Lên Studio (`/admin/yeu-cau`, `/admin/dich-vu`, `/admin/goi-cuoi`):**
    - Bảng Kanban 5 cột đầy đủ (`Chờ Xử Lý`, `Đã Duyệt`, `Đã Liên Hệ`, `Hoàn Thành`, `Đã Từ Chối`) hỗ trợ kéo thả thẻ đơn trực tiếp (HTML5 Drag & Drop) kết hợp nút chuyển nhanh, Modal ghi Nhật ký chăm sóc khách hàng và hộp thoại xác nhận `ConfirmModal` (không dùng `window.confirm`).
    - Biểu mẫu Dịch vụ, Gói cưới và Thiệp cưới hỗ trợ tải tệp ảnh trực tiếp lên Supabase Storage `studio-media` (kèm fallback chuyển đổi DataURL an toàn khi ngoại tuyến).
12. **Xuất & In Hợp Đồng Pháp Lý Khổ A4 & Đặt Cọc 20% Mã Hóa `[COC_YC-...]`:**
    - Cú pháp chuyển khoản đặt cọc VietQR tự sinh mã phiếu đối soát `[COC_YC-XXXXX]`, đồng bộ sang đơn yêu cầu và cho phép xuất Hợp đồng dịch vụ khổ A4 khi đơn ở trạng thái `da-duyet`.

---

## 4. CÔNG NGHỆ & KẾT QUẢ KIỂM CHỨNG CHẤT LƯỢNG

| Hạng mục | Công nghệ / Quy chuẩn | Ghi chú & Kết quả kiểm chứng thực tế |
|:---|:---|:---|
| **Core Framework** | React 19 + TypeScript 5.7 | Function Components + Hooks, `tsc --noEmit` đạt **0 lỗi** |
| **Định tuyến (Routing)** | React Router v8.4 | **28 tuyến chức năng** (29 khai báo leaf route), chia tách chunk bằng `React.lazy` |
| **Quản lý Trạng thái** | Zustand v5 + React Context | `cartStore` + `wishlistStore` (`persist`), `toastStore`; Context cho Theme & Auth |
| **Kiểm thực Dữ liệu** | Zod v4 | Xác thực 3 tầng: API Response, Form Inputs, URL Query/Params |
| **Giao diện (Styling)** | CSS Thuần túy (`variables.css`) | Không Tailwind/Bootstrap, Dark/Light Mode, `overflow-x: clip` trên `html, body, #root` |
| **Đồ họa & Biểu đồ** | Pure SVG 100% | 63 Icon SVG, Bản đồ Di sản SVG, Phối cổ phục 2D SVG, Bar/Donut/Sparklines SVG, **0 Emoji** |
| **Cơ sở dữ liệu Cloud** | Supabase PostgreSQL + Storage | **6 bảng quan hệ** (`dich_vu`, `goi_cuoi`, `yeu_cau`, `thiep_cuoi`, `thiep_khach_tao`, `profiles`) + RLS |
| **Backend Mock Dự phòng** | Node.js HTTP (`server/api.cjs`) | Không dùng Express, cổng 4000, dữ liệu tại `server/db.json` (18 dịch vụ, 9 gói, 6 thiệp, 22 đơn) |
| **Kiểm thử (Testing)** | Vitest 3.2.7 + Testing Library | **53/53 ca kiểm thử thành công (100% Passed)** trên 3 tệp kiểm thử |

---

## 5. BẢN ĐỒ ĐỊNH TUYẾN TOÀN DIỆN (28 TUYẾN CHỨC NĂNG)

### Phân hệ Khách hàng Công cộng (Public — 10 tuyến)
1. `/` : Trang Chủ (Hero Banner, Không gian tương tác Hoàng Triều, Marquee gói cưới, Cảm nhận khách hàng).
2. `/dich-vu` : Danh mục 18 dịch vụ cưới lẻ + Tìm kiếm tiếng Việt, lọc danh mục, yêu thích.
3. `/goi-cuoi` : Danh mục 9 gói cưới combo hoàng gia + Chọn so sánh tối đa 3 gói cưới.
4. `/thiep-cuoi` : Kho 6 mẫu thiệp cưới điện tử Studio + Bảng giá VIP / PRO / BASIC.
5. `/thiep-cuoi/moi/:slug` : Trang thiệp cưới chia sẻ công khai cho khách mời (Mở ấn sáp vàng, Nhã Nhạc, Đếm ngược thực, VietQR 15 ngân hàng, Gửi RSVP & Sổ lưu bút).
6. `/tu-van` : AI Tư vấn ngân sách hôn lễ 10–60 triệu đồng + Chuyển thẳng sang Đặt lịch.
7. `/ban-do-di-san` : Bản đồ số hóa 9 tọa độ nhiếp ảnh di sản Cố đô Huế bằng Pure SVG.
8. `/phoi-co-phuc` : Phòng phối cổ phục cưới trực quan 2D cho Cô dâu & Chú rể.
9. `/trien-lam` : Triển lãm Lookbook & Thanh trượt so sánh hậu kỳ màu phim Trước / Sau.
10. `/login` *(kèm `*` 404)* : Cổng đăng nhập 2 vai trò và trang 404 "Cung Điện Vắng Bóng".

### Phân hệ Khách hàng Yêu cầu Đăng nhập (Protected `user` / `admin` — 9 tuyến)
11. `/dich-vu/:id` : Chi tiết dịch vụ lẻ, gợi ý cùng danh mục `loai` và đánh giá lưu bền vững.
12. `/goi-cuoi/:id` : Chi tiết gói cưới combo, đặc quyền 8h Đại Nội, xem nhanh thành phần & báo giá đàm phán.
13. `/thiep-cuoi/:id` : Chi tiết mẫu thiệp hoàng triều, nghe Nhã Nhạc ngũ cung và gửi lời chúc.
14. `/thiep-cuoi/dang-ky` : Thiết kế thiệp cưới 2 cột, chọn 15 ngân hàng VietQR và phát hành link công khai `/thiep-cuoi/moi/:slug`.
15. `/thiep-cuoi/tuy-bien` : Tuyến tùy biến giao diện thiệp kết nối từ trang chi tiết thiệp.
16. `/dat-lich` : Đặt lịch bấm máy với Lịch tháng kiểm tra ca trống Ekip, chọn ca chụp & `RoyalSelect`.
17. `/ke-hoach-cuoi` : Sổ tay kế hoạch cưới 5 mốc thời gian, dự toán Donut SVG & in khổ A4.
18. `/gio-hang` : Giỏ hàng cưới, đặt cọc trước 20% qua VietQR mã hóa `[COC_YC-...]`.
19. `/don-cua-toi` : Quản lý đơn cá nhân, bổ sung mong muốn, hủy đơn hoàn cọc 3 tầng & In Hợp đồng A4.

### Phân hệ Quản trị Studio (Protected `admin` — 8 tuyến chức năng + 1 alias)
20. `/quy-trinh` *(và bí danh `/huong-dan-quy-trinh`)* : Cẩm nang Vận hành & SOP (6 quy trình, 4 vai trò, 7 phân hệ, 8 quy tắc di sản, in A4).
21. `/admin` : Dashboard KPI động (4 Sparklines SVG, Bar & Donut SVG, Xuất báo cáo CSV).
22. `/admin/dich-vu` : Quản trị dịch vụ lẻ (CRUD + tải ảnh lên + `ConfirmModal`).
23. `/admin/goi-cuoi` : Quản trị gói cưới combo (Multi-checkbox dịch vụ con + tải ảnh lên).
24. `/admin/thiep-cuoi` : Quản trị kho mẫu thiệp Studio & Theo dõi khách mời RSVP مặn/chay.
25. `/admin/yeu-cau` : Quản trị đơn yêu cầu với Bảng + Kanban kéo thả 5 cột, Nhật ký CSKH & Hợp đồng A4.
26. `/admin/lich-chup` : Lịch điều phối Ekip Nhiếp ảnh gia & Stylist cổ phục theo tháng.
27. `/admin/tai-khoan` : Quản trị tài khoản 2 cấp độ (`admin` / `user`), bảo vệ Root Admin.

---

## 6. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH

```bash
# 1. Cài đặt phụ thuộc
npm install

# 2. (Tùy chọn) Khởi chạy máy chủ giả lập Node.js thuần cổng 4000
npm run server

# 3. Khởi chạy môi trường phát triển Vite (cổng 5173)
npm run dev

# 4. Kiểm tra kiểu dữ liệu, chạy 53 ca kiểm thử Vitest & đóng gói Production
npm run typecheck
npm test
npm run build
```
