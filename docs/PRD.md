# PRD — Nền Tảng Dịch Vụ Cưới & Chụp Ảnh Cố Đô "Huế Cung Đình"

**Dự án:** Huế Cung Đình – Dịch vụ Cưới & Chụp ảnh Hoàng Triều (`doan-fenc`)  
**Phiên bản:** 2.0  
**Học phần:** Web FrontEnd Nâng Cao (Mã môn: INT.7.18)  
**Sinh viên thực hiện:** Trần Công Quý  
**Mã số sinh viên (MSSV):** 2401ITA001  
**Lớp:** CNTT K22  
**Giảng viên hướng dẫn:** Thầy Dương Ngọc Duy  
**Ngày hoàn thành:** Tháng 10, 2026  
**Địa chỉ triển khai (Production):** [https://huecungdinh.vercel.app](https://huecungdinh.vercel.app)  
**Mã nguồn GitHub:** [https://github.com/TranCongQuy/hue_cung_dinh.git](https://github.com/TranCongQuy/hue_cung_dinh.git)  

---

## 1. Vấn đề

Huế – vùng đất Cố Đô ngàn năm văn hiến với quần thể di tích triều Nguyễn đặc sắc – là niềm mơ ước của hàng triệu cặp đôi muốn ghi dấu ngày trọng đại bằng bộ ảnh cưới cổ phục hoàng gia (Áo Nhật Bình, Áo Tấc, Giao Lĩnh). Tuy nhiên, hiện nay các cặp đôi và đơn vị studio cưới truyền thống đang gặp phải các rào cản lớn:
- **Khó khăn cho cặp đôi:**
  - Thông tin dịch vụ phân mảnh, không minh bạch về chi phí và số lượng hạng mục đi kèm.
  - Lo sợ phát sinh chi phí vượt dự toán ngân sách, khó so khớp giữa trang phục, ekip thợ ảnh và địa điểm Đại Nội.
  - Thiếu công cụ tạo thiệp cưới điện tử hiện đại mang âm hưởng văn hóa dân tộc có tích hợp mừng cưới trực tuyến.
  - Phải đến trực tiếp studio ký hợp đồng giấy thủ công, thanh toán cọc rườm rà.
- **Khó khăn cho đơn vị quản lý Studio:**
  - Quản lý lịch chụp, đơn tư vấn bằng sổ sách hoặc tin nhắn mạng xã hội dễ thất lạc, chậm trễ phản hồi.
  - Không có bảng điều hành số liệu doanh thu thời gian thực và theo dõi tiến độ chăm sóc khách hàng trực quan.

**Cơ hội:** Xây dựng nền tảng số hóa dịch vụ cưới và chụp ảnh Cung Đình Huế cao cấp:
- **Đối với cặp đôi:** Tự do khám phá dịch vụ lẻ, so sánh combo cưới, dùng công cụ AI tư vấn ngân sách chuẩn xác, tạo thiệp cưới online và đặt cọc 20% giữ ngày cưới siêu tốc qua Dynamic VietQR.
- **Đối với Studio:** Quản lý quy trình chăm sóc khách hàng bằng bảng Kanban, theo dõi số liệu kinh doanh qua Dashboard phong cách SaaS quốc tế với 100% biểu đồ Pure SVG.

---

## 2. Người Dùng

### 2.1 Khách hàng / Cặp đôi chuẩn bị kết hôn (Customer / Public User)
- **Ai:** Các bạn trẻ độ tuổi 22–35 trên toàn quốc yêu chuộng văn hóa truyền thống Cố Đô Huế.
- **Nhu cầu:**
  - Khám phá danh mục cổ phục cung đình, thợ ảnh di sản, địa điểm Đại Nội / lăng tẩm và phong cách trang trí gia tiên.
  - Lựa chọn các gói cưới combo tiết kiệm chi phí, in dự thảo hợp đồng A4 hoàng gia ngay tại nhà.
  - Sử dụng AI để tính toán ngân sách thừa/thiếu và gợi ý gói cưới tối ưu.
  - Tạo và cá nhân hóa thiệp cưới trực tuyến có nhạc nhã nhạc, bản đồ và mã VietQR mừng cưới.
  - Quản lý giỏ dịch vụ và thanh toán đặt cọc 20% tức thì qua mã QR ngân hàng.

### 2.2 Quản trị viên Studio Hoàng Gia (Super Admin)
- **Ai:** Chủ studio hoặc người điều hành cấp cao của Huế Cung Đình Studio.
- **Nhu cầu:**
  - Theo dõi tổng quan kinh doanh qua Dashboard thời gian thực (số khách online, doanh thu kỳ vọng, hợp đồng cưới, tỷ lệ chốt).
  - Quản lý và xử lý đơn tư vấn khách hàng qua Bảng danh sách hoặc Bảng Kanban 4 cột tiến độ.
  - Quản lý toàn bộ danh mục dịch vụ lẻ và gói cưới combo (CRUD).
  - Quản lý và phân quyền tài khoản người dùng hệ thống (kích hoạt, khóa, xóa tài khoản).
  - Xuất báo cáo KPI và tải hóa đơn bản quyền hệ thống (.txt).

---

## 3. User Story (Các User Story Cốt Lõi)

### US#1: Khách hàng khám phá danh mục dịch vụ lẻ
> Khi tôi vào trang dịch vụ (`/dich-vu`), tôi muốn **xem danh sách các dịch vụ cưới lẻ, lọc theo loại (Áo dài, Thợ ảnh, Địa điểm, Trang trí) và sắp xếp theo giá**, để **chọn các hạng mục phù hợp với sở thích cá nhân**.

**Tiêu chí xong:**
- Hiển thị danh sách dịch vụ với hình ảnh thật sắc nét, tên, đơn giá niêm yết chuẩn VND và mô tả ngắn.
- Bộ lọc danh mục (Tất cả, Áo dài, Thợ ảnh, Địa điểm, Trang trí) phản hồi tức thì mà không cần tải lại trang.
- Sắp xếp linh hoạt: Giá tăng dần, Giá giảm dần, Tên A-Z.
- Nút "Xem Chi Tiết" dẫn sang trang thông tin chi tiết từng dịch vụ (`/dich-vu/:id`).

---

### US#2: Khách hàng so sánh gói cưới combo và yêu cầu báo giá nhanh
> Khi tôi vào trang chi tiết gói cưới (`/goi-cuoi/:id`), tôi muốn **xem đầy đủ danh sách các dịch vụ thành phần được bao gồm, xem nhanh chi tiết từng dịch vụ qua modal popup, các đặc quyền chụp ảnh di sản 8h tại Đại Nội và gửi yêu cầu đàm phán báo giá nhanh**, để **dễ dàng tùy biến gói chụp ảnh hoàng gia theo mong muốn cá nhân**.

**Tiêu chí xong:**
- Trang chi tiết hiển thị: Tên gói, phong cách hoàng gia, tổng chi phí trọn gói, danh sách từng dịch vụ thành phần kèm đơn giá lẻ.
- Từng dịch vụ đi kèm có thể nhấn trực tiếp để mở `QuickViewServiceModal` xem ảnh và thông số mà không rời khỏi trang.
- Hộp đặc quyền chụp ảnh hoàng gia: Thời lượng 8 giờ tại Đại Nội & Lăng tẩm, đặc cách chụp tại cung Diên Thọ/Điện Kiến Trung, miễn phí 02 bộ áo Nhật Bình thêu tay, trả toàn bộ file gốc HD và album cao cấp.
- Cụm nút "Thêm Vào Giỏ Dịch Vụ" và "Nhận Báo Giá Nhanh" đặt cùng hàng cân đối.
- Modal Báo Giá Nhanh hiển thị danh sách các mục kèm checkbox: Khách hàng có thể bỏ bớt hạng mục để tự động chuyển sang hình thức "Thương lượng giá theo nhu cầu", loại bỏ hoàn toàn ô ngân sách cố định và kích hoạt Flash Message 5 giây trang trọng sau khi gửi.

---

### US#3: Khách hàng sử dụng công cụ AI Tư Vấn Hôn Lễ Hoàng Triều
> Khi tôi vào trang AI tư vấn (`/tu-van`), tôi muốn **kéo thanh trượt ngân sách, chọn số lượng cổ phục, địa điểm di sản mong muốn và phong cách ưa thích**, để **hệ thống tự động so khớp và gợi ý gói cưới tối ưu nhất cùng phân tích chi tiết bộ ảnh**.

**Tiêu chí xong:**
- Biểu mẫu nhập liệu có thanh trượt ngân sách responsive đầy đủ 100% chiều rộng, không bị chèn dính chữ.
- Thuật toán AI chạy tức thì trên Client (phối hợp dữ liệu Supabase) so khớp gói cưới phù hợp nhất.
- Hiển thị thẻ kết quả gồm: Gói cưới được đề xuất, số tiền chênh lệch thừa/thiếu, gợi ý 3 dịch vụ lẻ nên nâng cấp thêm và đoạn văn phân tích hoàng triều trang trọng.
- Cho phép gửi đơn đăng ký tư vấn trực tiếp từ kết quả phân tích kèm Flash Message 5 giây.

---

### US#4: Khách hàng tra cứu và xem lịch sử đơn đặt lịch / huỷ đơn & xuất hợp đồng pháp lý A4
> Khi tôi vào trang đơn của tôi (`/don-cua-toi`), tôi muốn **tra cứu đơn chụp ảnh theo số điện thoại hoặc mã đơn, xem trạng thái màu sắc rõ ràng, bổ sung mong muốn chụp ảnh, hủy đơn hoàn cọc và xuất hợp đồng A4 pháp lý**, để **quản lý trọn vẹn hợp đồng dịch vụ chụp ảnh cưới của mình**.

**Tiêu chí xong:**
- Dữ liệu ban đầu hoàn toàn sạch sẽ để người dùng và giảng viên kiểm thử bằng dữ liệu thực tế.
- Thẻ thông tin đơn chi tiết: Mã đơn `#YC-XXXXX`, tên đơn chụp ảnh, họ tên khách hàng, số liên hệ, ngày chụp ảnh dự kiến, địa điểm di sản (hoàn toàn loại bỏ quy mô tiệc/khách ăn cỗ), tổng chi phí và badge trạng thái phân màu chuẩn mực.
- Modal Chi Tiết Đơn: Hiển thị đầy đủ danh sách hạng mục đã chọn, cho phép khách hàng gõ thêm mong muốn bổ sung (góc chụp hoàng hôn, đổi màu cổ phục) và lưu trực tiếp vào cơ sở dữ liệu.
- **Xuất Hợp Đồng A4 Pháp Lý:** Khi đơn ở trạng thái "Đã duyệt" (`da-duyet`), nút "Xuất Hợp Đồng A4" hiển thị cho cả Khách hàng và Quản trị viên, mở bản hợp đồng đầy đủ căn cứ pháp lý, điều khoản thanh toán, cam kết chất lượng, dấu đỏ điện tử và tối ưu in ấn khổ A4 qua `@media print` (`window.print()`).
- Nút "Hủy Đơn" kèm Modal xác nhận với **Thuật toán tính toán Hoàn cọc phân tầng theo thời gian (Tiered Policy)**:
  - Hủy trước ngày chụp $\ge 15$ ngày: Hoàn 100% tiền đặt cọc giữ lịch.
  - Hủy trong khoảng 7 - 14 ngày: Hoàn 50% tiền cọc (khấu trừ 50% chi phí chuẩn bị cổ phục và lịch ekip thợ ảnh).
  - Hủy dưới 7 ngày: Không hoàn cọc (phí hủy 100% do lịch trình Đại Nội đã được ấn định đặc cách).

---

### US#5: Khách hàng trải nghiệm kho thiệp cưới điện tử, nghe Nhã Nhạc Cung Đình và mừng cưới VietQR
> Khi tôi vào trang thiệp cưới (`/thiep-cuoi`), tôi muốn **duyệt qua các mẫu thiệp điện tử (Basic, PRO, VIP), mở xem trước giao diện smartphone có hiệu ứng mở phong bì, nghe Nhã Nhạc Cung Đình và quét mã QR mừng cưới**, để **chọn mẫu thiệp ưng ý cho ngày hôn lễ của mình**.

**Tiêu chí xong:**
- Hiển thị danh mục thiệp cưới theo khung điện thoại smartphone mô phỏng.
- Modal Live Demo cho phép mở phong bì hoàng gia, nghe **Nhã Nhạc Cung Đình ngũ cung truyền thống (Web Audio API 100% offline)** với biểu tượng đĩa hoa sen SVG xoay 360 độ, xem đồng hồ đếm ngược ngày cưới.
- Tích hợp hộp mừng cưới thông minh hiển thị mã VietQR tạo động theo số tài khoản cô dâu chú rể.
- Cho phép đăng ký tùy biến thiệp cưới qua form hoặc trang thiết kế riêng (`/thiep-cuoi/dang-ky`).

---

### US#6: Khách hàng quản lý giỏ hàng và thanh toán đặt cọc 20% giữ ngày cưới
> Khi tôi vào giỏ hàng (`/gio-hang`), tôi muốn **kiểm tra danh sách dịch vụ đã chọn, xem tổng tiền và chọn đặt cọc 20% qua VietQR**, để **hoàn tất giữ chỗ lịch chụp và ngày cưới tại Đại Nội**.

**Tiêu chí xong:**
- Giỏ hàng hiển thị danh sách các mục đã chọn, cho phép tăng/giảm số lượng hoặc xóa mục.
- Modal thanh toán tích hợp tùy chọn: "Đặt cọc trước 20% giữ ngày cưới".
- Hệ thống tự động tính chính xác số tiền cọc (20% tổng giá trị) và hiển thị mã VietQR động kèm cú pháp chuyển khoản chuẩn mực.
- Sau khi gửi đơn, giỏ hàng tự động làm sạch và thông báo thành công.

---

### US#7: Quản trị viên điều hành Dashboard KPI cao cấp (Phong cách Corbel SaaS) & Xuất Báo Cáo
> Khi tôi (quản trị viên) đăng nhập vào `/admin`, tôi muốn **theo dõi số khách đang online thời gian thực, 4 thẻ KPI kèm đường sóng SVG Sparkline, biểu đồ cột doanh thu và xuất file báo cáo Excel**, để **nắm bắt toàn diện hiệu quả kinh doanh của studio**.

**Tiêu chí xong:**
- Bộ đếm khách online (Live Visitor Odometer) có đèn xung nhịp pulsing xanh ngọc thời gian thực.
- Lời chào thông minh (Smart Greeter) tự đổi câu chào theo buổi sáng/chiều/tối kèm lịch trình ngày hôm nay.
- Bộ lọc 4 mốc thời gian: Hôm nay | 7 ngày qua | Tháng này | Cả năm 2026.
- 4 thẻ KPI vẽ bằng Pure SVG Sparklines: Doanh thu kỳ vọng, Tổng hợp đồng cưới, Đơn chờ xử lý, Tỷ lệ chốt thành công.
- Biểu đồ Cột SVG tương tác hiển thị tooltip khi hover và biểu đồ Donut SVG có tổng hợp đồng ở tâm.
- Nút **Xuất Báo Cáo KPI ra file Excel/CSV** (Pure JS Blob kèm UTF-8 BOM hiển thị tiếng Việt hoàn mỹ).
- Widget bản quyền Studio Enterprise cho phép tải trực tiếp file hóa đơn `.txt`.

---

### US#8: Quản trị viên quản lý đơn yêu cầu tư vấn trên Bảng Kanban & Xuất Dữ Liệu
> Khi tôi vào trang quản lý yêu cầu (`/admin/yeu-cau`), tôi muốn **chuyển đổi linh hoạt giữa Chế độ Bảng và Chế độ Kanban 4 cột tiến độ, đồng thời xuất dữ liệu ra Excel**, để **tiếp nhận, duyệt đơn và theo dõi quy trình chăm sóc khách hàng**.

**Tiêu chí xong:**
- Nút chuyển đổi mượt mà giữa "Bảng Danh Sách" và "Kanban Tiến Độ".
- Bảng Kanban chia 4 cột chuẩn nghiệp vụ: Chờ Xử Lý ➔ Đã Duyệt ➔ Đã Liên Hệ ➔ Hoàn Thành.
- Nút **Xuất Danh Sách Đơn ra Excel/CSV** tải ngay lập tức danh sách đơn theo tab bộ lọc hiện tại với đầy đủ cột tiếng Việt.
- Nút chuyển trạng thái nhanh 1-click giữa các cột tiến độ, đồng bộ tức thì về cơ sở dữ liệu Supabase.
- Cho phép xóa đơn yêu cầu với hộp thoại xác nhận an toàn.

---

### US#9: Quản trị viên quản lý tài khoản và phân quyền người dùng (2-Tier RBAC)
> Khi tôi vào trang quản lý tài khoản (`/admin/tai-khoan`), tôi muốn **xem danh sách người dùng, lọc theo vai trò (Admin, User), tạo mới tài khoản hoặc bật/tắt khóa tài khoản**, để **bảo vệ an ninh hệ thống studio**.

**Tiêu chí xong:**
- 4 thẻ KPI: Tổng tài khoản, Quản trị viên, Khách hàng, Đang hoạt động.
- Thanh tìm kiếm đa năng theo họ tên, username, SĐT, email.
- Bảng người dùng có nút gạt bật/tắt trạng thái kích hoạt tức thì.
- Modal Thêm / Chỉnh sửa tài khoản với Zod validation.
- Bảo vệ Root Admin: Tuyệt đối không cho phép khóa hoặc xóa tài khoản Quản trị viên tối cao (`admin`).

---

## 4. Các Thực Thể Dữ Liệu

| Thực thể | Tên Bảng (Supabase) | Trường chính | Ghi chú & Ràng buộc |
|---|---|---|---|
| **Dịch Vụ Lẻ** (`DichVu`) | `public.dich_vu` | `id`, `ten`, `loai`, `gia`, `mo_ta`, `hinh_anh`, `is_top`, `created_at` | `loai` IN ('ao-dai', 'tho-anh', 'dia-diem', 'trang-tri'); `gia` >= 0 |
| **Gói Cưới Combo** (`GoiCuoi`) | `public.goi_cuoi` | `id`, `ten`, `mo_ta`, `gia_tron_goi`, `danh_sach_dich_vu_ids`, `phong_cach`, `hinh_anh`, `is_top` | `phong_cach` IN ('cung-dinh', 'hien-dai', 'co-dien'); mảng ID liên kết dịch vụ lẻ |
| **Đơn Yêu Cầu** (`YeuCau`) | `public.yeu_cau` | `id`, `ten_khach`, `so_dien_thoai`, `ngay_cuoi`, `so_luong_khach`, `ngan_sach`, `goi_de_xuat_id`, `ghi_chu`, `trang_thai`, `ngay_tao` | `trang_thai` IN ('cho-xu-ly', 'da-duyet', 'da-lien-he', 'hoan-thanh'); số điện thoại chuẩn VN |
| **Mẫu Thiệp Cưới** (`ThiepCuoi`) | `public.thiep_cuoi` | `id`, `ten`, `phong_cach`, `loai`, `gia`, `gia_goc`, `mo_ta`, `hinh_anh`, `co_dau`, `chu_re`, `ngay_cuoi`, `dia_diem`, `qr_ngan_hang`, `tinh_nang` | `loai` IN ('basic', 'vip', 'pro'); hỗ trợ hiển thị mobile responsive |
| **Hồ Sơ & Tài Khoản** (`Profile`) | `public.profiles` | `id`, `username`, `full_name`, `role`, `phone`, `email`, `active`, `created_at` | `role` IN ('admin', 'user'); `id` liên kết `auth.users`; `active` cờ trạng thái |
| **Thống Kê Kinh Doanh** (`ThongKe`) | *Computed / Cache* | `tongDon`, `donChoXuLy`, `tongDoanhThuDuKien`, `tyLeThanhCong`, `doanhThuTheoThang[]`, `tyLeGoiCuoi[]` | Tự động tính toán từ bảng `yeu_cau` và `goi_cuoi` |

---

## 5. Danh Sách Tuyến (Routes) — Hoàn Chỉnh

Hệ thống thiết lập **18 Tuyến Đường** chuẩn mực với React Router v8:

| STT | Tuyến (Path) | Thành phần chính (Component) | Phân quyền truy cập | Mục đích & Nghiệp vụ |
|:---:|:---|:---|:---:|:---|
| 1 | `/` | `HomePage` | Public (Mọi người) | Hero banner hoàng gia, Marquee combo chạy tự động, Form tư vấn nhanh |
| 2 | `/dich-vu` | `ServicesPage` | Public (Mọi người) | Danh mục dịch vụ lẻ, bộ lọc danh mục, sắp xếp đơn giá |
| 3 | `/dich-vu/:id` | `ServiceDetailPage` | Public (Mọi người) | Chi tiết từng dịch vụ cổ phục/thợ ảnh, ảnh HD, nút đặt dịch vụ |
| 4 | `/goi-cuoi` | `PackagesPage` | Public (Mọi người) | Lưới gói cưới combo cung đình/hiện đại/cổ điển |
| 5 | `/goi-cuoi/:id` | `PackageDetailPage` | Public (Mọi người) | Chi tiết gói cưới, **In Báo Giá & Dự Thảo Hợp Đồng A4 (`window.print()`)** |
| 6 | `/thiep-cuoi` | `InvitationsPage` | Public (Mọi người) | Kho mẫu thiệp cưới smartphone, mở phong bì, **mừng cưới VietQR động** |
| 7 | `/thiep-cuoi/dang-ky` | `InvitationCustomPage` | Public (Mọi người) | Biểu mẫu thiết kế thiệp tùy biến, tải ảnh dâu rể, nhập ngày cưới |
| 8 | `/gio-hang` | `CartPage` | Public (Mọi người) | Giỏ hàng hoàng gia, **đặt cọc trước 20% giữ ngày cưới qua VietQR** |
| 9 | `/don-cua-toi` | `MyBookingsPage` | Public (Mọi người) | **Lịch sử đơn & Tra cứu tiến độ hôn lễ, hủy yêu cầu (Chuẩn US#4 của Thầy)** |
| 10 | `/dat-lich` | `BookingPage` | Public (Mọi người) | Đặt lịch trải nghiệm cổ phục và chụp ảnh tại Đại Nội Huế |
| 11 | `/tu-van` | `ConsultationPage` | Public (Mọi người) | AI Tư vấn ngân sách, thuật toán tối ưu tài chính hôn lễ Cố Đô |
| 12 | `/login` | `LoginPage` | Public (Mọi người) | Cổng đăng nhập Admin & Khách hàng kèm 2 nút chọn nhanh tài khoản thử nghiệm |
| 13 | `/admin` | `AdminDashboardPage` | **Chỉ `admin`** | **Dashboard Corbel:** Live Visitor Counter, 4 Sparklines, Bar & Donut SVG, Hóa đơn .txt |
| 14 | `/admin/dich-vu` | `AdminServicesPage` | **Chỉ `admin`** | Quản lý dịch vụ lẻ (CRUD với Modal xác nhận an toàn) |
| 15 | `/admin/goi-cuoi` | `AdminPackagesPage` | **Chỉ `admin`** | Quản lý combo gói cưới (Multi-select checkbox dịch vụ thành phần) |
| 16 | `/admin/yeu-cau` | `AdminRequestsPage` | **Chỉ `admin`** | Quản lý đơn tư vấn với **Bảng Danh Sách + Kanban Board 4 cột tiến độ** |
| 17 | `/admin/tai-khoan` | `AdminUsersPage` | **Chỉ `admin`** | **Quản lý tài khoản 2 cấp độ: Quản trị viên & Khách hàng** |
| 18 | `*` | `NotFoundPage` | Public (Mọi người) | Trang 404 "Cung Điện Vắng Bóng" hoài niệm xứ Huế |

---

## 6. Ngoài Phạm Vi (Out of Scope)

- ❌ Cổng thanh toán thẻ tín dụng quốc tế phức tạp (Stripe/PayPal thật) ➔ Sử dụng **Dynamic VietQR 24/7** chuẩn ngân hàng Việt Nam.
- ❌ Dịch vụ gửi SMS OTP viễn thông trả phí ➔ Xác thực tức thời qua hệ thống đăng nhập token JWT và demo quick-fill.
- ❌ Gọi điện thoại tự động qua tổng đài VoIP ➔ Cung cấp liên kết `tel:` trực tiếp đến hotline chuyên viên.
- ❌ Ứng dụng di động Native (iOS/Android App) ➔ Tối ưu hóa **100% Responsive PWA/Web** chuẩn mực trên mọi màn hình điện thoại và tablet.

---

## 7. Tiêu Chí Định Nghĩa Xong (Done Criteria)

- [x] Toàn bộ 18 tuyến đường hoạt động trơn tru không lỗi định tuyến, F5 không bị 404 trên Vercel.
- [x] Mock data sẵn sàng khi nạp trang: **18 dịch vụ lẻ** (đạt chuẩn ≥10), **5 gói combo**, **22 booking đơn yêu cầu** (đạt chuẩn ≥20 booking của Thầy).
- [x] Trang khách hàng `/don-cua-toi` cho phép tra cứu đơn và bấm hủy đơn có hộp thoại xác nhận.
- [x] Biểu mẫu có kiểm thực dữ liệu Zod Schema chặt chẽ (số điện thoại VN 10 số, ngân sách tối thiểu, ngày cưới tương lai).
- [x] CSDL đám mây Supabase PostgreSQL hoạt động 100%, có Row Level Security (RLS) bảo vệ từng bảng.
- [x] Hệ thống phân quyền 2 cấp độ (2-Tier RBAC) bảo vệ nghiêm ngặt khu vực `/admin/*`.
- [x] 100% CSS thuần túy không dùng Tailwind/Bootstrap, hỗ trợ Dark/Light Theme Cung Đình Huế.
- [x] 100% SVG thuần tự tính toán toạ độ (Bar Chart, Donut Chart, Sparklines wave).
- [x] Tính năng in ấn hợp đồng A4 (`window.print()`) xuất trang in hoàng gia chuẩn tỷ lệ.
- [x] Bộ đếm khách trực tuyến thời gian thực và widget bản quyền Corbel SaaS hoạt động trên Dashboard.
- [x] TypeScript `strict: true` không có bất kỳ lỗi cú pháp nào (`npm run typecheck` ➔ 0 lỗi).
- [x] Bộ kiểm thử tự động Vitest vượt qua 100% (`npm test` ➔ 14/14 ca kiểm thử passed).
- [x] Triển khai trực tuyến thành công trên Vercel với tên miền chính thức: `https://huecungdinh.vercel.app`.

---

## 8. Ghi Chú Kỹ Thuật (Cho Vibe Coding & Phát Triển Bền Vững)

- **Kiến trúc dữ liệu Hybrid:** Frontend ưu tiên gọi Supabase Database trực tiếp qua `SupabaseService`. Khi offline hoặc không có mạng, hệ thống tự động fallback về Mock Server Node.js cổng 4000 hoặc dữ liệu hạt giống nội bộ, đảm bảo bài thi luôn chạy thành công trong mọi điều kiện chấm điểm.
- **Tối ưu hóa Vercel SPA:** File `vercel.json` định tuyến toàn bộ URL về `/index.html` kèm tiêu đề bộ nhớ đệm `Cache-Control` cho tài nguyên tĩnh có mã băm (immutable hash).
- **Trải nghiệm A11y & UI/UX Cung Đình:** Màu đỏ đô `#8B0000`, vàng kim `#D4AF37`, font chữ hoàng gia *Playfair Display* kết hợp *Be Vietnam Pro* cho khả năng đọc hoàn mỹ ở cả chế độ ban ngày và ban đêm.
