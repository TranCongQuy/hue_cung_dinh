# PRD — Nền Tảng Dịch Vụ Cưới & Chụp Ảnh Cố Đô "Huế Cung Đình"

**Dự án:** Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh Hoàng Triều (`doan-fenc`)  
**Phiên bản:** `1.0.0` (theo `package.json`)  
**Học phần:** Web FrontEnd Nâng Cao (Mã môn: INT.7.18)  
**Sinh viên thực hiện:** Trần Công Quý  
**Mã số sinh viên (MSSV):** 2401ITA001  
**Lớp:** CNTT K22  
**Giảng viên hướng dẫn:** Thầy Dương Ngọc Duy  
**Ngày cập nhật:** Tháng 11, 2026  
**Địa chỉ triển khai (Production):** [https://huecungdinh.vercel.app](https://huecungdinh.vercel.app)  
**Mã nguồn GitHub:** [https://github.com/TranCongQuy/hue_cung_dinh.git](https://github.com/TranCongQuy/hue_cung_dinh.git)  

---

## 1. Vấn đề

Huế – vùng đất Cố Đô với quần thể di tích triều Nguyễn đặc sắc – là điểm đến của đông đảo cặp đôi mong muốn ghi dấu ngày trọng đại bằng bộ ảnh cưới cổ phục hoàng gia (Áo Nhật Bình, Áo Tấc, Giao Lĩnh, Mãng Bào). Tuy nhiên, quy trình truyền thống đang tồn tại nhiều hạn chế:
- **Khó khăn cho cặp đôi:**
  - Thông tin giá dịch vụ, phí giấy phép quay chụp tại di tích và khung giờ ánh sáng đẹp bị phân mảnh.
  - Không có công cụ phối thử cổ phục trực quan hay đối chiếu trước/sau chất lượng màu phim của studio.
  - Khó dự toán tổng chi phí lễ cưới, thiếu sổ tay checklist chuẩn bị đám cưới theo mốc thời gian.
  - Thiếu thiệp cưới điện tử mang bản sắc cung đình có đường dẫn chia sẻ công khai cho khách mời xác nhận tham dự (RSVP) và quét VietQR theo đúng ngân hàng của dâu rể.
- **Khó khăn cho đơn vị quản lý Studio:**
  - Sắp xếp lịch chụp và phân công Nhiếp ảnh gia / Stylist cổ phục bằng sổ tay dễ dẫn đến trùng ca chụp bình minh / hoàng hôn.
  - Quản lý đơn yêu cầu thiếu bảng kéo thả trực quan, thiếu nhật ký chăm sóc khách hàng và công cụ thống kê lượng khách RSVP trên các thiệp cưới đã phát hành.

**Cơ hội:** Xây dựng nền tảng số hóa toàn diện dịch vụ cưới & nhiếp ảnh cổ phục Hoàng Triều kết hợp hệ thống quản trị ERP thu nhỏ cho Studio Cố Đô.

---

## 2. Người Dùng

### 2.1 Khách hàng / Cặp đôi chuẩn bị kết hôn (`user` & Khách vãng lai)
- **Độ tuổi:** 22–35 tuổi yêu chuộng văn hóa Cố Đô Huế.
- **Nhu cầu cốt lõi:**
  - Tra cứu Bản đồ 9 tọa độ nhiếp ảnh di sản, thử phối cổ phục 2D, kiểm chứng hậu kỳ màu phim Trước/Sau.
  - Lọc dịch vụ lẻ, đặt tối đa 3 gói cưới cạnh nhau để so sánh hạng mục, lưu danh sách yêu thích và tìm kiếm nhanh toàn trang bằng `Ctrl + K`.
  - Dùng AI tư vấn ngân sách (10–60 triệu đồng) và chuyển thẳng sang Đặt lịch có kiểm tra lịch trống Ekip theo tháng.
  - Phát hành thiệp cưới chia sẻ công khai `/thiep-cuoi/moi/:slug` tích hợp 15 ngân hàng VietQR, đếm ngược từng giây và Sổ lưu bút RSVP.
  - Quản lý Sổ tay kế hoạch cưới A4, đặt cọc 20% mã hóa `[COC_YC-...]` và in Hợp đồng pháp lý khổ A4.

### 2.2 Quản trị viên Studio Hoàng Gia (`admin`)
- **Vai trò:** Chủ studio hoặc người điều hành cấp cao.
- **Nhu cầu cốt lõi:**
  - Theo dõi Dashboard KPI tính toán động từ dữ liệu đơn thực tế (4 Sparklines SVG, Bar & Donut SVG, xuất CSV).
  - Quản trị CRUD Dịch vụ lẻ, Gói cưới combo và Kho mẫu thiệp Studio kèm tải tệp ảnh trực tiếp lên Supabase Storage `studio-media`.
  - Kéo thả thẻ đơn trên Bảng Kanban 5 cột HTML5 Drag & Drop, ghi Nhật ký chăm sóc khách hàng và in Hợp đồng A4.
  - Điều phối Nhiếp ảnh gia & Nghệ nhân cổ phục trên Lịch tháng `/admin/lich-chup`, theo dõi khách mời RSVP tại `/admin/thiep-cuoi`, quản lý tài khoản `/admin/tai-khoan` và tra cứu Cẩm nang SOP `/quy-trinh`.

---

## 3. User Story (Các User Story Cốt Lõi)

### US#1: Khám phá Không gian Tương tác Di sản (Bản đồ SVG, Phối Cổ phục 2D & Triển lãm Hậu kỳ)
> Khi tôi truy cập các phân hệ khám phá (`/ban-do-di-san`, `/phoi-co-phuc`, `/trien-lam`), tôi muốn **xem tọa độ di sản trên bản đồ SVG, tự tay phối màu Áo Nhật Bình – Áo Tấc trên ma-nơ-canh 2D và kéo thanh trượt so sánh ảnh gốc/hậu kỳ**, để **chọn đúng địa điểm, trang phục và phong cách màu phim trước khi đặt lịch**.

**Tiêu chí xong:**
- Bản đồ Pure SVG hiển thị 9 địa danh Cố đô chia làm 3 phân khu, kèm giờ vàng ánh sáng, phí giấy phép quay chụp và 3 lộ trình gợi ý 1 ngày.
- Phòng phối cổ phục 2D cho phép đổi phom áo cô dâu/chú rể, sắc gấm, phụ kiện pháp lam, tính tổng tiền tức thời và thêm bộ phối vào `cartStore`.
- Trang Triển lãm tích hợp thanh trượt Before/After điều khiển bằng chuột/cảm ứng/bàn phím (`<input type="range">` chuẩn A11y) và 9 tác phẩm Lookbook có Lightbox.

---

### US#2: Tra cứu Dịch vụ lẻ, So sánh tối đa 3 Gói cưới & Danh sách Yêu thích
> Khi tôi duyệt `/dich-vu` và `/goi-cuoi`, tôi muốn **thả tim lưu mục yêu thích, chọn tối đa 3 gói cưới để mở bảng đối chiếu song song và nhấn `Ctrl + K` tìm kiếm nhanh**, để **ra quyết định chọn gói tiết kiệm thời gian**.

**Tiêu chí xong:**
- `wishlistStore` (Zustand `persist`) lưu danh sách yêu thích và danh sách gói so sánh (giới hạn `MAX_COMPARE_PACKAGES = 3`).
- Thanh nổi phía dưới màn hình mở Modal đối chiếu trực quan giá trọn gói, phong cách và dấu tích từng dịch vụ thành phần.
- Trang chi tiết dịch vụ (`/dich-vu/:id`) ưu tiên gợi ý 3 dịch vụ cùng phân loại `loai` và lưu bền vững bình luận đánh giá của khách hàng vào `localStorage`.

---

### US#3: AI Tư vấn Ngân sách 10–60 Triệu & Chuyển thẳng Đặt lịch Kiểm tra Ca chụp
> Khi tôi dùng AI tư vấn (`/tu-van`) và chuyển sang Đặt lịch (`/dat-lich`), tôi muốn **nhận gợi ý gói cưới tối ưu trong tầm ngân sách 10–60 triệu đồng rồi bấm chuyển thẳng sang biểu mẫu Đặt lịch có lịch tháng báo ca trống Ekip**, để **chốt ngày bấm máy không bị trùng lịch**.

**Tiêu chí xong:**
- Thanh trượt ngân sách từ `10.000.000 ₫` đến `60.000.000 ₫` (bước nhảy `1.000.000 ₫`), hỗ trợ đầy đủ 4 hình thức chụp gồm cả `"phim-truong"` (Cung Điện Nội Bộ).
- Nút `"Chuyển Thành Đơn Đặt Lịch Với Gói Này"` điều hướng thẳng sang `/dat-lich?goi=...&diaDiem=...`.
- Trang `/dat-lich` tự động điền cả họ tên lẫn số điện thoại từ tài khoản đăng nhập, tích hợp lịch tháng báo trạng thái ekip (*Trống lịch / Còn 1 ekip / Kín lịch*) và chọn ca chụp (*Bình minh / Hoàng hôn / Trọn ngày*).

---

### US#4: Cá nhân hóa Thiệp cưới 15 Ngân hàng VietQR & Phát hành Link Khách mời RSVP
> Khi tôi tạo thiệp tại `/thiep-cuoi/dang-ky`, tôi muốn **chọn đúng ngân hàng thụ hưởng trong 15 ngân hàng Việt Nam và phát hành đường dẫn công khai `/thiep-cuoi/moi/:slug`**, để **gửi qua Zalo/Messenger cho quan khách mở thiệp, xem đồng hồ đếm ngược thực và xác nhận tham dự RSVP**.

**Tiêu chí xong:**
- `BANK_BINS` hỗ trợ 15 ngân hàng phổ biến tại Việt Nam (Vietcombank, MB Bank, Techcombank, BIDV, VietinBank, ACB, VPBank, TPBank, Sacombank, Agribank, HDBank, VIB, SHB, MSB, OCB), sinh ảnh QR động qua `buildVietQrImageUrl`.
- Đồng hồ đếm ngược (`calculateCountdownParts`) cập nhật từng giây thực tế tới ngày cưới.
- Trang `/thiep-cuoi/moi/:slug` mở công khai không cần đăng nhập, có hiệu ứng mở ấn sáp vàng, nhạc Nhã Nhạc Cung Đình, form RSVP (số khách 1–10, thực đơn mặn/chay) và Sổ lưu bút chúc phúc thời gian thực.

---

### US#5: Sổ tay Kế hoạch Cưới Cá nhân, Đặt cọc 20% `[COC_YC-...]` & Hợp đồng A4
> Khi tôi chuẩn bị hôn lễ, tôi muốn **quản lý checklist 5 mốc thời gian & biểu đồ ngân sách tại `/ke-hoach-cuoi`, đặt cọc 20% có mã phiếu đối soát tại giỏ hàng và xuất Hợp đồng pháp lý A4 tại `/don-cua-toi`**, để **kiểm soát trọn vẹn tài chính và pháp lý**.

**Tiêu chí xong:**
- Sổ tay `/ke-hoach-cuoi` lưu tự động theo tài khoản người dùng, vẽ Biểu đồ Donut Pure SVG so sánh dự toán/thực chi và hỗ trợ in khổ A4.
- `CartDrawer` sinh mã đơn trước khi tạo QR đặt cọc 20% theo cú pháp `[COC_YC-XXXXX]`.
- Trang `/don-cua-toi` tính hoàn cọc 3 tầng ($\ge 15$ ngày: 100%; $7\text{–}14$ ngày: 50%; $< 7$ ngày: 0%) và mở `RoyalContractA4Modal` in khổ A4 khi đơn đạt trạng thái `da-duyet`.

---

### US#6: Quản trị ERP Toàn diện (Dashboard Động, Kanban Kéo thả 5 Cột, Điều phối Ekip & Kho Thiệp RSVP)
> Khi tôi đăng nhập vai trò `admin`, tôi muốn **quản lý kho dịch vụ/gói/thiệp có tải ảnh lên, kéo thả đơn trên Kanban 5 cột kèm ghi chú CSKH và phân công Nhiếp ảnh gia trên lịch tháng**, để **vận hành studio khoa học và không chồng chéo nhân sự**.

**Tiêu chí xong:**
- `/admin/yeu-cau` trang bị Bảng Kanban 5 cột (`cho-xu-ly`, `da-duyet`, `da-lien-he`, `hoan-thanh`, `tu-choi`) hỗ trợ kéo thả HTML5 Drag & Drop, Modal Nhật ký CSKH và hộp thoại `ConfirmModal` chuẩn mực.
- `/admin/lich-chup` hiển thị lịch tháng bấm máy, cho phép gán Nhiếp ảnh gia chánh máy, Nghệ nhân cổ phục và ca chụp cho từng đơn.
- `/admin/thiep-cuoi` quản lý CRUD mẫu thiệp Studio (kèm tải ảnh) và thống kê tổng khách RSVP mặn/chay của các thiệp đã phát hành.
- `/quy-trinh` hiển thị chính xác 6 quy trình SOP, 4 vai trò, 7 phân hệ và 8 quy tắc di sản (đếm động từ mảng dữ liệu).

---

## 4. Các Thực Thể Dữ Liệu (6 Bảng PostgreSQL + Storage)

| Thực thể | Tên Bảng (Supabase) | Trường chính | Ghi chú & Ràng buộc |
|---|---|---|---|
| **Dịch Vụ Lẻ** (`DichVu`) | `public.dich_vu` | `id`, `ten`, `loai`, `gia`, `mo_ta`, `hinh_anh`, `is_top` | 18 bản ghi mẫu; `loai` IN (`ao-dai`, `tho-anh`, `dia-diem`, `trang-tri`); hỗ trợ URL & DataURL |
| **Gói Cưới Combo** (`GoiCuoi`) | `public.goi_cuoi` | `id`, `ten`, `mo_ta`, `gia_tron_goi`, `danh_sach_dich_vu_ids`, `phong_cach`, `hinh_anh`, `is_top` | 9 bản ghi mẫu; `phong_cach` IN (`cung-dinh`, `hien-dai`, `co-dien`) |
| **Đơn Yêu Cầu** (`YeuCau`) | `public.yeu_cau` | `id`, `ten_don`, `ten_khach`, `so_dien_thoai`, `ngay_cuoi`, `ca_chup`, `dia_diem_chup`, `ngan_sach`, `ekip_phu_trach`, `lich_su_cham_soc`, `trang_thai` | 5 trạng thái (`cho-xu-ly`, `da-duyet`, `da-lien-he`, `hoan-thanh`, `tu-choi`); lưu JSONB ekip & nhật ký CSKH |
| **Mẫu Thiệp Studio** (`ThiepCuoi`) | `public.thiep_cuoi` | `id`, `ten`, `phong_cach`, `loai`, `gia`, `gia_goc`, `mo_ta`, `hinh_anh`, `co_dau`, `chu_re`, `ngay_cuoi`, `dia_diem` | 6 mẫu thiệp khởi tạo (`vip`, `pro`, `basic`) |
| **Thiệp Khách Phát Hành** (`CustomShareInvitation`) | `public.thiep_khach_tao` | `slug`, `mau_thiep_id`, `ten_chu_re`, `ten_co_dau`, `ngay_cuoi`, `gio_to_chuc`, `dia_diem`, `ngan_hang`, `so_tai_khoan`, `danh_sach_rsvp` | Khóa chính `slug`; cho phép khách mời xem công khai & gửi RSVP JSONB |
| **Hồ Sơ Tài Khoản** (`UserAccount`) | `public.profiles` | `id`, `username`, `full_name`, `role`, `phone`, `email`, `active` | Phân quyền 2 cấp độ (`admin`, `user`); liên kết `auth.users` |

---

## 5. Danh Sách Tuyến (28 Tuyến Chức Năng — 29 Khai Báo Leaf Route)

Chi tiết đầy đủ được đặc tả tại `docs/ROUTES.md`, bao gồm:
- **10 tuyến Công khai (Public):** `/`, `/dich-vu`, `/goi-cuoi`, `/thiep-cuoi`, `/thiep-cuoi/moi/:slug`, `/tu-van`, `/ban-do-di-san`, `/phoi-co-phuc`, `/trien-lam`, `/login` (cùng tuyến bắt lỗi `*`).
- **9 tuyến Khách hàng Đã đăng nhập (`user` / `admin`):** `/dich-vu/:id`, `/goi-cuoi/:id`, `/thiep-cuoi/:id`, `/thiep-cuoi/dang-ky`, `/thiep-cuoi/tuy-bien`, `/dat-lich`, `/ke-hoach-cuoi`, `/gio-hang`, `/don-cua-toi`.
- **8 tuyến Quản trị Studio (`admin`) + 1 tuyến bí danh:** `/quy-trinh` (bí danh `/huong-dan-quy-trinh`), `/admin`, `/admin/dich-vu`, `/admin/goi-cuoi`, `/admin/thiep-cuoi`, `/admin/yeu-cau`, `/admin/lich-chup`, `/admin/tai-khoan`.

---

## 6. Ngoài Phạm Vi (Out of Scope)

- Cổng gạch nợ tự động qua Webhook ngân hàng thương mại (hiện sử dụng sinh ảnh **Dynamic VietQR Napas247** theo 15 mã BIN ngân hàng kèm mã đối soát `[COC_YC-...]`).
- Gửi thông báo tự động qua SMS OTP / Zalo ZNS doanh nghiệp trả phí.
- Ứng dụng cài đặt ngoại tuyến có Service Worker (hiện tối ưu **Responsive Web Application** trên trình duyệt máy tính, máy tính bảng và điện thoại).

---

## 7. Tiêu Chí Định Nghĩa Xong (Done Criteria)

- [x] Toàn bộ 28 tuyến đường chức năng hoạt động ổn định, chia tách gói `React.lazy` không còn cảnh báo bundle > 500 kB, F5 không lỗi 404 trên Vercel.
- [x] Dữ liệu mẫu phong phú: **18 dịch vụ lẻ**, **9 gói cưới combo**, **6 mẫu thiệp Studio**, **1 thiệp chia sẻ công khai mẫu**, **22 đơn yêu cầu trong `server/db.json`**.
- [x] Hoàn thiện 12 phân hệ nâng cấp lớn: Bản đồ Di sản SVG, Phòng phối cổ phục 2D, Triển lãm Before/After, Command Palette `Ctrl+K`, Thiệp công khai RSVP + 15 ngân hàng VietQR + đếm ngược thực, So sánh 3 gói & Yêu thích, Lịch tháng đặt lịch & ca chụp, Sổ tay kế hoạch cưới A4, Quản trị Kho thiệp RSVP, Lịch điều phối Ekip, Kanban kéo thả 5 cột + Nhật ký CSKH + Tải ảnh lên.
- [x] 100% Pure CSS (`variables.css`) & 100% Pure SVG (`Icon.tsx` 63 biểu tượng), **0 Emoji** trong giao diện, **0 `window.confirm`**, **0 `console.log`/`console.error`**, **0 kiểu `any`**.
- [x] `npm run typecheck` đạt **0 lỗi**; `npm test` vượt qua **53/53 ca kiểm thử (100% Passed)** trên 3 tệp test; `npm run build` thành công sạch sẽ.
- [x] Báo cáo học thuật `.docx` tại `Docx/BaoCao_TongQuan_DuAn_HueCungDinh.docx` đối soát khớp 100% với mã nguồn thực tế.

---

## 8. Ghi Chú Kỹ Thuật

- **Kiến trúc Hybrid 3 Tầng:** `SupabaseService` ưu tiên truy vấn Supabase Cloud (PostgreSQL + Storage), tự động chuyển đổi mượt mà sang máy chủ Node.js `http` cổng 4000 hoặc dữ liệu dự phòng cục bộ (`localStorage` + Seed Data) khi ngoại tuyến.
- **Tối ưu hiệu năng đóng gói:** `vite.config.ts` tách riêng `vendor`, `supabase` và `zod` kết hợp `React.lazy` tại `src/app/routes.tsx`, giữ gói chính chỉ ~437,55 kB.
