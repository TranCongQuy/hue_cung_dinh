# BẢNG TỰ KIỂM ĐỐI CHIẾU SỐ LIỆU ĐỊNH LƯỢNG (BANG-TU-KIEM.MD)

**Dự án:** Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều (`doan-fenc`)  
**Tài liệu đối chiếu:** `Docx/BaoCao_TongQuan_DuAn_HueCungDinh.docx`  
**Ngày kiểm chứng:** 12/11/2026  
**Người kiểm chứng:** Trần Công Quý (MSSV: 2401ITA001)

Tài liệu này lập ra nhằm mục đích đối soát và chứng minh 100% tính xác thực của mọi khẳng định định lượng trong bản báo cáo Word học thuật đối với mã nguồn thực tế của dự án. Mọi con số đều được đo đạc, đếm trực tiếp từ mã nguồn thật, không phỏng đoán hay sao chép từ tài liệu cũ.

---

## 1. BẢNG ĐỐI CHIẾU CÁC KHẲNG ĐỊNH ĐỊNH LƯỢNG

| STT | Khẳng Định Định Lượng Trong Docx | Giá Trị Thực Tế Đo Được | Tệp Tin Mã Nguồn Bằng Chứng | Dòng Code Cụ Thể / Vị Trí Bằng Chứng |
|:---:|:---|:---:|:---|:---|
| 1 | **Phiên bản hệ thống:** Phiên bản 1.0.0 | `1.0.0` | `package.json` | Dòng 4: `"version": "1.0.0"` |
| 2 | **Số ca kiểm thử tự động:** 26/26 tests passed | `26 passed` (2 files) | `src/test/validation.test.ts`<br>`src/test/routes.test.tsx` | `validation.test.ts`: 16 tests (dòng 1–137)<br>`routes.test.tsx`: 10 tests (dòng 1–155) |
| 3 | **Tổng số dịch vụ cưới lẻ:** 18 dịch vụ | `18 dịch vụ` | `server/db.json`<br>`supabase/schema.sql` | `db.json`: mảng `dichVu` có 18 phần tử (dòng 2–165)<br>`schema.sql`: 18 câu lệnh INSERT (dòng 162–181) |
| 4 | **Phân loại danh mục dịch vụ lẻ:** 5 áo dài, 4 thợ ảnh, 4 địa điểm, 5 trang trí | `ao-dai: 5`<br>`tho-anh: 4`<br>`dia-diem: 4`<br>`trang-tri: 5` | `server/db.json` | Đếm theo trường `loai` trong mảng `dichVu` |
| 5 | **Khoảng giá dịch vụ lẻ:** 2.500.000 đ đến 9.000.000 đ | `Min: 2.500.000 ₫`<br>`Max: 9.000.000 ₫` | `server/db.json` | `dv-11` (Trang điểm): 2.500.000 đ (dòng 95)<br>`dv-05` (Phim Cinematic): 9.000.000 đ (dòng 41) |
| 6 | **Tổng số gói cưới combo:** 9 gói cưới | `9 gói cưới` | `server/db.json`<br>`supabase/schema.sql` | `db.json`: mảng `goiCuoi` có 9 phần tử (dòng 166–267)<br>`schema.sql`: 9 câu lệnh INSERT (dòng 183–193) |
| 7 | **Phân loại phong cách gói cưới:** 4 cung đình, 2 hiện đại, 3 cổ điển | `cung-dinh: 4`<br>`hien-dai: 2`<br>`co-dien: 3` | `server/db.json` | Đếm theo trường `phongCach` trong mảng `goiCuoi` |
| 8 | **Khoảng giá gói cưới combo:** 15.900.000 đ đến 38.500.000 đ | `Min: 15.900.000 ₫`<br>`Max: 38.500.000 ₫` | `server/db.json` | `gc-03` (Thanh Lịch Tối Giản): 15.900.000 đ (dòng 193)<br>`gc-09` (Đại Triều Trọng Thể): 38.500.000 đ (dòng 259) |
| 9 | **Tổng số mẫu thiệp cưới điện tử:** 6 mẫu thiệp | `6 mẫu thiệp` | `server/db.json`<br>`supabase/schema.sql` | `db.json`: mảng `thiepCuoi` có 6 phần tử (dòng 268–353)<br>`schema.sql`: 6 câu lệnh INSERT (dòng 195–202) |
| 10 | **Phân hạng gói thiệp cưới:** 2 VIP, 2 PRO, 2 Basic | `vip: 2`<br>`pro: 2`<br>`basic: 2` | `server/db.json` | Đếm theo trường `loai` trong mảng `thiepCuoi` (`tc-01..06`) |
| 11 | **Khoảng giá khởi tạo thiệp cưới:** 168.000 đ đến 450.000 đ | `Min: 168.000 ₫`<br>`Max: 450.000 ₫` | `server/db.json` | `tc-01`, `tc-02` (Basic): 168.000 đ (dòng 275, 289)<br>`tc-05`, `tc-06` (VIP): 450.000 đ (dòng 331, 345) |
| 12 | **Tổng số đơn yêu cầu ban đầu (Seed Data):** 22 đơn | `22 đơn yêu cầu` | `server/db.json` | Mảng `yeuCau` gồm 22 phần tử (dòng 354–619, từ `yc-01` đến `yc-22`) |
| 13 | **Phân bổ trạng thái đơn yêu cầu ban đầu:** 6 đã duyệt, 6 chờ xử lý, 4 đã liên hệ, 4 hoàn thành, 2 từ chối | `da-duyet: 6`<br>`cho-xu-ly: 6`<br>`da-lien-he: 4`<br>`hoan-thanh: 4`<br>`tu-choi: 2` | `server/db.json` | Đếm theo trường `trangThai` trong mảng `yeuCau` (tổng đúng 22) |
| 14 | **Số quy trình tiêu chuẩn (SOP):** 6 quy trình | `6 SOPs` | `src/pages/ProcessGuidePage.tsx` | Mảng `SOP_DATA`: `sop-01` đến `sop-06` (dòng 76–218) |
| 15 | **Số vai trò nhân sự trong SOP:** 4 vai trò | `4 vai trò` | `src/pages/ProcessGuidePage.tsx` | Mảng `ROLES_DATA`: `role-01` đến `role-04` (dòng 220–362) |
| 16 | **Số phân hệ phần mềm trong SOP:** 7 phân hệ | `7 phân hệ` | `src/pages/ProcessGuidePage.tsx` | Mảng `SYSTEMS_DATA`: `sys-01` đến `sys-07` (dòng 364–460) |
| 17 | **Số quy tắc nghiệp vụ trong SOP:** 8 quy tắc | `8 quy tắc` | `src/pages/ProcessGuidePage.tsx` | Mảng `RULES_DATA`: `rule-01` đến `rule-08` (dòng 462–527) |
| 18 | **Tổng số tuyến đường hệ thống:** 21 tuyến đường | `21 tuyến đường` (22 khai báo) | `src/app/routes.tsx` | Dòng 28–136: 22 router entries (tuyến `/huong-dan-quy-trinh` là alias cùng render `ProcessGuidePage`) |
| 19 | **Số component trang (Pages):** 20 component trang | `20 component` (15 client + 5 admin) | `src/pages/`<br>`src/pages/admin/` | `src/pages/`: 15 file `.tsx`<br>`src/pages/admin/`: 5 file `.tsx` |
| 20 | **Khoảng thanh trượt ngân sách AI Tư Vấn:** 10.000.000 đ – 60.000.000 đ | `min: 10.000.000`<br>`max: 60.000.000`<br>`step: 1.000.000` | `src/features/consultation/components/ConsultationWidgets.tsx` | Dòng 106–108: `min={10000000}`, `max={60000000}`, `step={1000000}` |
| 21 | **Số dịch vụ gợi ý tại trang chi tiết dịch vụ:** Đúng 3 dịch vụ khác | `3 dịch vụ` | `src/pages/ServiceDetailPage.tsx` | Dòng 119–121: `filter((s) => s.id !== service.id).slice(0, 3)` (không lọc cùng loại) |
| 22 | **Đích đến của 2 nút CTA tại Hero banner:** Nút chính: `/dat-lich`<br>Nút phụ: `/goi-cuoi` | `/dat-lich`<br>`/goi-cuoi` | `src/features/home/components/HeroSection.tsx` | Dòng 183–188: `<Link to="/dat-lich">` và `<Link to="/goi-cuoi">` |
| 23 | **Điền tự động form Đặt lịch:** Chỉ tự điền tên, SĐT để trống | `tenKhach: user?.ten`<br>`soDienThoai: ""` | `src/pages/BookingPage.tsx` | Dòng 117–118: `const [tenKhach, setTenKhach] = useState(user?.ten || "")`<br>`const [soDienThoai, setSoDienThoai] = useState("")` |
| 24 | **Tỷ lệ đặt cọc giỏ hàng:** 20% tổng giá trị | `20%` | `src/components/common/CartDrawer.tsx` | Dòng 293: `formatCurrency(depositAmount)` với `depositAmount = Math.round(totalPrice * 0.2)` |
| 25 | **Cú pháp VietQR đặt cọc:** `addInfo = "Dat coc " + tenKhach` | `"Dat coc " + tenKhach` | `src/components/common/CartDrawer.tsx` | Dòng 298: `addInfo=${encodeURIComponent("Dat coc " + (formData.tenKhach || "chup anh cuoi"))}` |
| 26 | **Tài khoản VietQR đặt cọc & thiệp demo:** MB Bank `0905123456` | `MB-0905123456` | `src/components/common/CartDrawer.tsx`<br>`src/features/invitations/components/InvitationModals.tsx` | `CartDrawer.tsx` dòng 298<br>`InvitationModals.tsx` dòng 158 |
| 27 | **Khóa cứng BIN ngân hàng VietQR mừng cưới:** BIN `970422` (MB Bank), số tiền 500.000 đ | BIN: `970422`<br>Amount: `500000` | `src/pages/InvitationCustomPage.tsx` | Dòng 83–84: `const bankBin = "970422";`<br>`amount=500000` |
| 28 | **Đồng hồ đếm ngược thiệp cưới:** 4 con số cố định: 28 ngày, 12 giờ, 30 phút, 45 giây | `28 / 12 / 30 / 45` | `src/features/invitations/components/InvitationModals.tsx` | Dòng 128, 132, 136, 140: Các thẻ `<span className="countdown-number">` chứa giá trị số tĩnh |
| 29 | **Design Tokens cốt lõi:** `--primary: #8B0000`, `--primary-hover: #A30000`, `--secondary: #D4AF37`, `--bg-main: #FDFBF7` / `#1A1512`, `--surface: #FFFFFF` / `#26201C` | Chuẩn 100% | `src/styles/variables.css` | Dòng 5–18 (Light theme) và dòng 75–88 (Dark theme) |
| 30 | **Khử tràn viền toàn cục:** `overflow-x: clip;` áp dụng cho `html` và `body` | `html`, `body` | `src/styles/globals.css` | Dòng 17 (thẻ `html`), dòng 38 (thẻ `body`) — không có quy tắc cho `#root` |
| 31 | **Số cột trên Bảng Kanban:** 4 cột tiến độ | `4 cột` | `src/pages/admin/AdminRequestsPage.tsx` | Dòng 217–222: `kanbanColumns` gồm `cho-xu-ly`, `da-duyet`, `da-lien-he`, `hoan-thanh` (đơn `tu-choi` không có cột Kanban) |
| 32 | **Hiện trạng Emoji:** Còn sót ký tự `⭐` tại 2 vị trí | Còn `⭐` | `src/pages/ServicesPage.tsx`<br>`src/pages/ProcessGuidePage.tsx` | `ServicesPage.tsx` dòng 18: `label: "⭐ Top Dịch Vụ"`<br>`ProcessGuidePage.tsx` dòng 406 |

---

## 2. KẾT LUẬN KIỂM CHỨNG

Toàn bộ 32 khẳng định định lượng nêu trên đã được đối soát 1:1 với mã nguồn dự án tại commit mới nhất. Mọi nội dung trình bày trong tệp tài liệu `Docx/BaoCao_TongQuan_DuAn_HueCungDinh.docx` hoàn toàn trùng khớp với kết quả kiểm chứng này.
