# BẢNG TỰ KIỂM ĐỐI CHIẾU SỐ LIỆU ĐỊNH LƯỢNG (BANG-TU-KIEM.MD)

**Dự án:** Huế Cung Đình – Dịch Vụ Cưới & Nhiếp Ảnh Cổ Phục Hoàng Triều (`doan-fenc`)  
**Tài liệu đối chiếu:** `Docx/BaoCao_TongQuan_DuAn_HueCungDinh.docx`  
**Ngày kiểm chứng:** 12/11/2026  
**Người kiểm chứng:** Trần Công Quý (MSSV: 2401ITA001)

Tài liệu này đối soát 1:1 các con số định lượng trong bản báo cáo Word học thuật mới nhất với mã nguồn thực tế của dự án sau khi hoàn tất 12 phân hệ nâng cấp.

---

## 1. BẢNG ĐỐI CHIẾU CÁC KHẲNG ĐỊNH ĐỊNH LƯỢNG

| STT | Khẳng Định Định Lượng Trong Docx | Giá Trị Thực Tế Đo Được | Tệp Tin Mã Nguồn Bằng Chứng | Vị Trí / Cơ Chế Kiểm Chứng |
|:---:|:---|:---:|:---|:---|
| 1 | **Phiên bản hệ thống** | `1.0.0` | `package.json` | Trường `"version": "1.0.0"` (dòng 4) |
| 2 | **Số ca kiểm thử tự động Vitest** | `53 passed` (3 tệp test) | `src/test/validation.test.ts`<br>`src/test/features.test.ts`<br>`src/test/routes.test.tsx` | `validation.test.ts`: 16 ca<br>`features.test.ts`: 19 ca<br>`routes.test.tsx`: 18 ca (tổng 53 ca passed) |
| 3 | **Tổng số dịch vụ cưới lẻ** | `18 dịch vụ` | `server/db.json`, `supabase/schema.sql`, `src/lib/supabaseAdapter.ts` | `ao-dai: 5`, `tho-anh: 4`, `dia-diem: 4`, `trang-tri: 5`; giá `2.500.000 ₫` – `9.000.000 ₫` |
| 4 | **Tổng số gói cưới combo** | `9 gói cưới` | `server/db.json`, `supabase/schema.sql`, `src/lib/supabaseAdapter.ts` | `cung-dinh: 4`, `hien-dai: 2`, `co-dien: 3`; giá `15.900.000 ₫` – `38.500.000 ₫` |
| 5 | **Kho mẫu thiệp cưới Studio** | `6 mẫu thiệp` | `server/db.json`, `supabase/schema.sql`, `src/lib/supabaseAdapter.ts` | `vip: 2`, `pro: 2`, `basic: 2`; giá khởi tạo `168.000 ₫` – `450.000 ₫` |
| 6 | **Thiệp chia sẻ công khai mẫu** | `1 bản ghi mẫu` + `2 RSVP` | `src/lib/supabaseAdapter.ts`, `server/db.json` | Slug `quoc-bao-ngoc-han-2026` (gồm 1 khách mặn 2 người + 1 khách chay 1 người) |
| 7 | **Đơn yêu cầu mẫu (Seed Data)** | `22 đơn` (`db.json`) / `5 đơn` (`supabaseAdapter.ts`) | `server/db.json`<br>`src/lib/supabaseAdapter.ts` | `db.json`: 22 đơn (`6 da-duyet, 6 cho-xu-ly, 4 da-lien-he, 4 hoan-thanh, 2 tu-choi`); `DEFAULT_SEED_REQUESTS`: 5 đơn có đủ ekip & nhật ký CSKH |
| 8 | **Tổng số bảng PostgreSQL** | `6 bảng` + bucket `studio-media` | `supabase/schema.sql` | `dich_vu`, `goi_cuoi`, `yeu_cau`, `thiep_cuoi`, `thiep_khach_tao`, `profiles` |
| 9 | **Số component trang (`src/pages`)** | `27 component trang` | `src/pages/` (20 tệp)<br>`src/pages/admin/` (7 tệp) | 20 tệp `.tsx` cấp ngoài + 7 tệp `.tsx` trong `admin/` |
| 10 | **Số tuyến đường định tuyến** | `28 tuyến chức năng` (`29 leaf routes`) | `src/app/routes.tsx` | 22 khai báo con dưới `/` + 7 khai báo con dưới `/admin` (bao gồm 1 bí danh `/huong-dan-quy-trinh`) |
| 11 | **Số biểu tượng Pure SVG** | `63 nhánh case` | `src/components/common/Icon.tsx` | Đếm trực tiếp các nhánh `case "...":` trong hàm render SVG |
| 12 | **Bản đồ Di sản Cố đô** | `9 tọa độ` / `3 phân khu` / `3 lộ trình` | `src/pages/HeritageMapPage.tsx` | Mảng `HUE_HERITAGE_SPOTS` (9 phần tử) và `SUGGESTED_ITINERARIES` (3 phần tử) |
| 13 | **Phòng phối cổ phục 2D** | `3 áo dâu`, `2 áo rể`, `5+4 màu`, `3 mấn`, `3 phụ kiện`, `3 preset` | `src/pages/RoyalFittingRoomPage.tsx` | Đếm từ các hằng `BRIDE_GARMENTS`, `GROOM_GARMENTS`, `BRIDE_COLORS`, `GROOM_COLORS`, `BRIDE_HEADWEAR`, `ACCESSORIES`, `CURATED_PRESETS` |
| 14 | **Triển lãm Lookbook & Hậu kỳ** | `3 preset Trước/Sau` + `9 tác phẩm` | `src/pages/LookbookGalleryPage.tsx` | Mảng `RETOUCH_PRESETS` (3 phần tử) và `LOOKBOOK_PHOTOS` (9 phần tử) |
| 15 | **Sổ tay Kế hoạch Cưới** | `5 mốc thời gian`, `10 việc mẫu`, `6 mục ngân sách` | `src/pages/WeddingPlannerPage.tsx` | Mảng `MILESTONES` (5), `DEFAULT_TASKS` (10), `DEFAULT_BUDGETS` (6) |
| 16 | **Danh bạ ngân hàng VietQR** | `15 ngân hàng` | `src/features/invitations/types.ts` | Mảng `BANK_BINS` gồm 15 mã BIN Napas247 phổ biến tại Việt Nam |
| 17 | **Giới hạn so sánh gói cưới** | Tối đa `3 gói` | `src/lib/wishlistStore.ts` | Hằng số `MAX_COMPARE_PACKAGES = 3` (dòng 52) |
| 18 | **Khoảng thanh trượt AI Tư Vấn** | `10.000.000 ₫` – `60.000.000 ₫` | `src/features/consultation/components/ConsultationWidgets.tsx` | `min={10000000}`, `max={60000000}`, `step={1000000}` |
| 19 | **Cẩm nang SOP (`/quy-trinh`)** | `6 SOP`, `4 vai trò`, `7 phân hệ`, `8 quy tắc` | `src/pages/ProcessGuidePage.tsx` | Giao diện hiển thị động `{SOP_DATA.length}`, `{ROLES_DATA.length}`, `{SYSTEMS_DATA.length}`, `{RULES_DATA.length}` |
| 20 | **Số cột Bảng Kanban kéo thả** | `5 cột tiến độ` | `src/pages/admin/AdminRequestsPage.tsx` | `cho-xu-ly`, `da-duyet`, `da-lien-he`, `hoan-thanh`, `tu-choi` kèm sự kiện HTML5 Drag & Drop |
| 21 | **Cú pháp VietQR đặt cọc 20%** | `[COC_YC-XXXXX] Dat coc ...` | `src/components/common/CartDrawer.tsx` | Sinh mã phiếu `pendingOrderCode` trước khi tạo URL ảnh VietQR |
| 22 | **Khử tràn ngang toàn cục** | `html`, `body`, `#root` | `src/styles/globals.css` | `overflow-x: clip;` tại dòng 17 (`html`), dòng 38 (`body`) và dòng 62 (`#root`) |
| 23 | **Hiện trạng Emoji màu trong `src/`** | `0 Emoji` | Toàn bộ thư mục `src/` | Đã quét tự động bằng biểu thức chính quy Unicode Pictographic đạt 0 kết quả |
| 24 | **Kích thước gói JS lớn nhất khi build** | `437,55 kB` (< 500 kB) | `vite.config.ts`, `src/app/routes.tsx` | Tách `vendor`, `supabase`, `zod` và `React.lazy` (0 cảnh báo vượt 500 kB) |
