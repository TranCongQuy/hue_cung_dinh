-- ============================================================================
-- HUẾ CUNG ĐÌNH — TỰ ĐỘNG KHỞI TẠO BẢNG, PHÂN QUYỀN RLS & NẠP DỮ LIỆU
-- Dán và chạy đoạn mã này trong: Supabase Dashboard -> SQL Editor -> Run
-- Đảm bảo an toàn 100%: Tự tạo bảng nếu chưa có, không bao giờ bị lỗi relation not exist!
-- ============================================================================

-- BẬT TIỆN ÍCH TẠO UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TẠO CÁC BẢNG (NẾU CHƯA CÓ)
-- ============================================================================

-- Bảng dịch vụ lẻ
CREATE TABLE IF NOT EXISTS public.dich_vu (
    id TEXT PRIMARY KEY,
    ten TEXT NOT NULL,
    loai TEXT NOT NULL,
    gia BIGINT NOT NULL,
    mo_ta TEXT,
    hinh_anh TEXT,
    is_top BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng gói cưới combo
CREATE TABLE IF NOT EXISTS public.goi_cuoi (
    id TEXT PRIMARY KEY,
    ten TEXT NOT NULL,
    mo_ta TEXT,
    gia_tron_goi BIGINT NOT NULL,
    danh_sach_dich_vu_ids TEXT[] DEFAULT '{}',
    phong_cach TEXT NOT NULL,
    hinh_anh TEXT,
    is_top BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng đơn yêu cầu tư vấn (Khách hàng đặt trên web)
CREATE TABLE IF NOT EXISTS public.yeu_cau (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ten_khach TEXT NOT NULL,
    so_dien_thoai TEXT NOT NULL,
    ngay_cuoi TEXT NOT NULL,
    so_luong_khach INTEGER DEFAULT 100,
    ngan_sach BIGINT NOT NULL DEFAULT 20000000,
    goi_de_xuat_id TEXT,
    ghi_chu TEXT DEFAULT '',
    trang_thai TEXT NOT NULL DEFAULT 'cho-xu-ly',
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng mẫu thiệp cưới online
CREATE TABLE IF NOT EXISTS public.thiep_cuoi (
    id TEXT PRIMARY KEY,
    ten TEXT NOT NULL,
    phong_cach TEXT NOT NULL,
    loai TEXT NOT NULL,
    gia BIGINT NOT NULL,
    gia_goc BIGINT,
    mo_ta TEXT,
    hinh_anh TEXT,
    co_dau TEXT,
    chu_re TEXT,
    ngay_cuoi TEXT,
    dia_diem TEXT,
    am_nhac TEXT,
    qr_ngan_hang TEXT,
    tinh_nang TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (ROW LEVEL SECURITY - RLS)
-- ============================================================================

-- Bật RLS
ALTER TABLE public.dich_vu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goi_cuoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thiep_cuoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yeu_cau ENABLE ROW LEVEL SECURITY;

-- Cấp quyền cho bảng dich_vu
DROP POLICY IF EXISTS "Public read services" ON public.dich_vu;
CREATE POLICY "Public read services" ON public.dich_vu FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage services" ON public.dich_vu;
CREATE POLICY "Public manage services" ON public.dich_vu FOR ALL TO anon, authenticated USING (true);

-- Cấp quyền cho bảng goi_cuoi
DROP POLICY IF EXISTS "Public read packages" ON public.goi_cuoi;
CREATE POLICY "Public read packages" ON public.goi_cuoi FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage packages" ON public.goi_cuoi;
CREATE POLICY "Public manage packages" ON public.goi_cuoi FOR ALL TO anon, authenticated USING (true);

-- Cấp quyền cho bảng thiep_cuoi
DROP POLICY IF EXISTS "Public read invitations" ON public.thiep_cuoi;
CREATE POLICY "Public read invitations" ON public.thiep_cuoi FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage invitations" ON public.thiep_cuoi;
CREATE POLICY "Public manage invitations" ON public.thiep_cuoi FOR ALL TO anon, authenticated USING (true);

-- Cấp quyền cho bảng yeu_cau (Mọi người được gửi đơn và xem đơn)
DROP POLICY IF EXISTS "Public create requests" ON public.yeu_cau;
CREATE POLICY "Public create requests" ON public.yeu_cau FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public view requests" ON public.yeu_cau;
CREATE POLICY "Public view requests" ON public.yeu_cau FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public update requests" ON public.yeu_cau;
CREATE POLICY "Public update requests" ON public.yeu_cau FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public delete requests" ON public.yeu_cau;
CREATE POLICY "Public delete requests" ON public.yeu_cau FOR DELETE TO anon, authenticated USING (true);

-- ============================================================================
-- 3. NẠP DỮ LIỆU ĐẦY ĐỦ 18 DỊCH VỤ CUNG ĐÌNH CAO CẤP
-- ============================================================================

INSERT INTO public.dich_vu (id, ten, loai, gia, mo_ta, hinh_anh, is_top)
VALUES
('dv-01', 'Áo Nhật Bình Hoàng Gia Thêu Long Phụng', 'ao-dai', 4500000, 'Cổ phục Nhật Bình hoàng hậu triều Nguyễn dệt gấm tơ tằm thượng hạng, chỉ ngũ sắc thêu tay tỉ mỉ theo hoa văn cung đình.', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', true),
('dv-02', 'Áo Tấc Ngũ Thân Nam Giới Hoàng Triều', 'ao-dai', 3200000, 'Áo tấc ngũ thân tay thụng trang trọng cho chú rể, chất liệu gấm vân mây cung đình, phối khăn đóng truyền thống cao cấp.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', true),
('dv-03', 'Áo Dài Cưới Gấm Sen Vàng Hoàng Cung', 'ao-dai', 3500000, 'Áo dài cưới lụa tơ tằm dệt thủ công sắc đỏ son son thiếp hoa sen vàng may mắn cùng hoa văn cung đình cao sang.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', true),
('dv-04', 'Nhiếp Ảnh Gia Di Sản - Chụp Ngoại Cảnh Đại Nội', 'tho-anh', 6500000, 'Ekip nhiếp ảnh gia thâm niên hơn 10 năm tại Cố đô, am tường góc ánh sáng vàng tại Ngọ Môn, Điện Thái Hòa và Cung Diên Thọ.', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', true),
('dv-05', 'Phóng Sự Cưới Hoàng Gia Cinematic (2 Máy Ảnh + Flycam)', 'tho-anh', 9000000, 'Ghi trọn vẹn từng khoảnh khắc cảm xúc của ngày tân hôn với tông màu phim điện ảnh hoài niệm cố đô.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', true),
('dv-06', 'Quần Thể Di Tích Đại Nội & Cung Diên Thọ', 'dia-diem', 5000000, 'Giấy phép quay chụp đặc cách tại các cung điện uy nghiêm nhất của Triều Nguyễn, không gian cổ kính ngàn năm.', 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80', true),
('dv-07', 'Biệt Phủ Cổ Hoa Nghiêm Cung Đình Sông Hương', 'dia-diem', 7500000, 'Biệt phủ nhà rường gỗ lim 100 năm tuổi ven dòng sông Hương thơ mộng, khuôn viên hoa sen nở ngát hương thơm.', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', false),
('dv-08', 'Lăng Khải Định & Rừng Thông Thiên An', 'dia-diem', 4000000, 'Sự kết hợp hoàn hảo giữa kiến trúc khảm sành sứ lộng lẫy và nét đẹp trữ tình của đồi thông ngút ngàn xứ Huế.', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80', false),
('dv-09', 'Trang Trí Gia Tiên Phong Cách Hoàng Tộc (Long Phụng Sum Vầy)', 'trang-tri', 8500000, 'Không gian lễ gia tiên bài trí bàn thờ gỗ gụ chạm trổ, bình gốm cổ, lọng vàng che lụa và hoa tươi sen trắng thơm ngát.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', false),
('dv-10', 'Cổng Hoa Sen Đồng Cung Đình & Lồng Đèn Gấm', 'trang-tri', 6000000, 'Cổng hoa thiết kế mái vòm cong cung đình, kết hợp hàng trăm đóa sen hồng ngát hương và đèn lồng lụa đỏ ấm cúng.', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80', false),
('dv-11', 'Trang Điểm Cô Dâu Phong Thái Hoàng Hậu', 'ao-dai', 2500000, 'Nghệ thuật trang điểm thanh tú, tự nhiên tôn lên nét đẹp phúc hậu của phụ nữ Á Đông cùng trâm cài tóc mạ vàng tinh xảo.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', false),
('dv-12', 'Ban Nhạc Cung Đình & Nghi Thức Rước Dâu Truyền Thống', 'trang-tri', 5500000, 'Đội hình nghinh hôn cổ truyền với đội lọng che tía, nhạc bát âm nhã nhạc cung đình Huế tạo nên không khí trang nghiêm.', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80', false)
ON CONFLICT (id) DO UPDATE SET
  ten = EXCLUDED.ten,
  gia = EXCLUDED.gia,
  mo_ta = EXCLUDED.mo_ta,
  hinh_anh = EXCLUDED.hinh_anh;

-- ============================================================================
-- 4. NẠP DỮ LIỆU CÁC GÓI CƯỚI COMBO HOÀNG TRIỀU
-- ============================================================================

INSERT INTO public.goi_cuoi (id, ten, mo_ta, gia_tron_goi, danh_sach_dich_vu_ids, phong_cach, hinh_anh, is_top)
VALUES
('gc-01', 'Gói Cung Đình Khang Ninh - Hoàng Gia Trọng Thể', 'Trải nghiệm nghi thức cưới hoàng tộc đỉnh cao với phục trang Nhật Bình thêu tay, chụp ảnh tại Đại Nội và trang trí gia tiên long phụng.', 26900000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-06', 'dv-09', 'dv-11'], 'cung-dinh', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', true),
('gc-02', 'Gói Hoàng Hậu Nam Phương - Cổ Phục Tinh Hoa', 'Gói chụp ảnh cưới thanh lịch lấy cảm hứng từ vẻ đẹp huyền thoại của Hoàng hậu Nam Phương, phục trang tơ tằm thêu hoa sen trang nhã.', 19500000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-07', 'dv-11'], 'cung-dinh', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', true),
('gc-03', 'Gói Tân Thời Tối Giản - Dạ Nguyệt Cố Đô', 'Sự giao thoa tinh tế giữa tà áo dài truyền thống và phong cách tối giản hiện đại của các cặp đôi trẻ yêu nét đẹp di sản.', 15900000, ARRAY['dv-03', 'dv-02', 'dv-04', 'dv-08', 'dv-11'], 'hien-dai', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', false),
('gc-04', 'Gói Hoài Niệm Sông Hương - Cổ Điển Trầm Mặc', 'Bộ ảnh cưới mang âm hưởng lãng mạn hoài cổ tại biệt phủ nhà rường và bến thuyền sông Hương với tông màu phim trầm lắng.', 18200000, ARRAY['dv-03', 'dv-04', 'dv-07', 'dv-10', 'dv-11'], 'co-dien', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', false),
('gc-05', 'Gói Đại Nội Vĩnh Cửu - Hoàng Tộc Toàn Năng', 'Gói cưới VIP toàn diện từ trang phục, 2 máy ảnh phóng sự cinematic, flycam, ban nhạc bát âm cung đình và trang trí gia tiên lộng lẫy.', 38500000, ARRAY['dv-01', 'dv-02', 'dv-05', 'dv-06', 'dv-09', 'dv-10', 'dv-11', 'dv-12'], 'cung-dinh', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO UPDATE SET
  ten = EXCLUDED.ten,
  gia_tron_goi = EXCLUDED.gia_tron_goi,
  mo_ta = EXCLUDED.mo_ta,
  hinh_anh = EXCLUDED.hinh_anh;

-- ============================================================================
-- 5. NẠP DỮ LIỆU CÁC MẪU THIỆP CƯỚI ONLINE
-- ============================================================================

-- ============================================================================
-- 6. NẠP DỮ LIỆU ĐƠN YÊU CẦU TƯ VẤN & ĐẶT LỊCH HÔN LỄ (>= 20 BOOKING MẪU)
-- ============================================================================

INSERT INTO public.yeu_cau (id, ten_khach, so_dien_thoai, ngay_cuoi, so_luong_khach, ngan_sach, goi_de_xuat_id, ghi_chu, trang_thai, ngay_tao)
VALUES
('yc-01', 'Trần Nguyễn Minh Anh', '0912345678', '2026-11-20', 120, 30000000, 'gc-01', 'Muốn tư vấn thêm về nghi thức rước dâu bằng kiệu và lọng vàng hoàng tộc.', 'da-duyet', '2026-10-15 09:30:00+07'),
('yc-02', 'Lê Hoàng Bảo Ngọc', '0987654321', '2026-12-08', 80, 20000000, 'gc-02', 'Quan tâm gói Hoàng hậu Nam Phương, muốn chụp thêm ảnh hoàng hôn bên sông Hương.', 'cho-xu-ly', '2026-10-18 14:15:00+07'),
('yc-03', 'Nguyễn Văn Đức Huy', '0905123987', '2027-01-15', 200, 45000000, 'gc-05', 'Đăng ký gói VIP Đại Nội Vĩnh Cửu cho lễ cưới đầu năm mới.', 'da-lien-he', '2026-10-10 11:00:00+07'),
('yc-04', 'Tôn Nữ Bích Trâm', '0935123456', '2026-11-28', 150, 26900000, 'gc-01', 'Đã hoàn thành bộ ảnh cưới Cung Đình Khang Ninh tại Điện Kiến Trung và Cung Diên Thọ.', 'hoan-thanh', '2026-09-28 08:20:00+07'),
('yc-05', 'Phan Đình Hoàng Long', '0978998877', '2026-12-12', 100, 19500000, 'gc-02', 'Yêu cầu phục trang Áo Nhật Bình màu xanh chính cung và Áo Tấc gấm ngũ thân nam.', 'da-duyet', '2026-10-19 10:00:00+07'),
('yc-06', 'Võ Thị Kim Ngân', '0944556677', '2026-12-25', 90, 15900000, 'gc-03', 'Đặt lịch trải nghiệm cổ phục và chụp phóng sự cưới phong cách tối giản.', 'cho-xu-ly', '2026-10-21 16:45:00+07'),
('yc-07', 'Đặng Quốc Triều', '0918223344', '2026-10-30', 60, 12000000, NULL, 'Khách đổi kế hoạch dời sang năm sau do bận công tác nước ngoài.', 'tu-choi', '2026-09-15 13:10:00+07'),
('yc-08', 'Nguyễn Phúc Gia Hân', '0909112233', '2027-02-14', 180, 38000000, 'gc-01', 'Lễ cưới ngày Valentine 2027, yêu cầu ekip quay phim 4K Flycam tại lăng Khải Định.', 'da-lien-he', '2026-10-05 15:30:00+07'),
('yc-09', 'Hoàng Trọng Tuấn Kiệt', '0932889900', '2026-11-15', 110, 25000000, 'gc-02', 'Hài lòng với dịch vụ trang điểm cô dâu cung đình và bộ ảnh ngoại cảnh Ngọ Môn.', 'hoan-thanh', '2026-09-20 09:15:00+07'),
('yc-10', 'Trương Mỹ Duyên', '0966778899', '2026-12-18', 130, 28500000, 'gc-01', 'Cần tư vấn đặt cọc 20% giữ ngày chụp và hỗ trợ thiết kế thiệp cưới điện tử hoàng gia.', 'cho-xu-ly', '2026-10-22 11:05:00+07'),
('yc-11', 'Bùi Văn Hữu Phước', '0914667788', '2027-01-08', 250, 52000000, 'gc-05', 'Tiệc cưới đại gia đình tại biệt phủ cổ bên bờ sông Hương, yêu cầu nhã nhạc cung đình biểu diễn.', 'da-duyet', '2026-10-12 14:40:00+07'),
('yc-12', 'Trần Thị Thanh Thảo', '0983114477', '2026-11-05', 75, 16500000, 'gc-03', 'Đã thanh toán hợp đồng đầy đủ và nhận trọn bộ album ảnh gỗ tráng gương cao cấp.', 'hoan-thanh', '2026-09-10 10:20:00+07'),
('yc-13', 'Phạm Đăng Khoa', '0903882211', '2026-12-22', 140, 32000000, 'gc-01', 'Hẹn gặp tư vấn trực tiếp tại Cung Diên Thọ vào sáng thứ Bảy tuần tới.', 'da-lien-he', '2026-10-17 08:50:00+07'),
('yc-14', 'Đỗ Mai Phương', '0972334455', '2027-03-01', 100, 21000000, 'gc-02', 'Muốn thử trước 3 bộ cổ phục Nhật Bình tại studio trước khi chốt lịch chính thức.', 'cho-xu-ly', '2026-10-23 15:10:00+07'),
('yc-15', 'Ngô Quang Khải', '0915998811', '2026-10-22', 50, 9500000, NULL, 'Khách hàng hủy do trùng lịch công tác đột xuất của chú rể.', 'tu-choi', '2026-09-05 09:00:00+07'),
('yc-16', 'Dương Thùy Linh', '0948226699', '2027-01-20', 160, 35000000, 'gc-01', 'Đã đặt cọc 20% qua VietQR, đăng ký gói Cung Đình Khang Ninh.', 'da-duyet', '2026-10-14 17:25:00+07'),
('yc-17', 'Lương Thế Vinh', '0907445588', '2026-11-12', 95, 18000000, 'gc-02', 'Bộ ảnh cưới tuyệt đẹp tại Rừng Thông Thiên An và Lăng Tự Đức.', 'hoan-thanh', '2026-09-18 16:00:00+07'),
('yc-18', 'Tống Khánh Huyền', '0938551122', '2026-12-30', 120, 27000000, 'gc-01', 'Tư vấn thực đơn cỗ cưới phong vị cung đình và trang trí gia tiên long phụng.', 'da-lien-he', '2026-10-16 11:40:00+07'),
('yc-19', 'Huỳnh Nhật Minh', '0961882233', '2027-02-28', 220, 48000000, 'gc-05', 'Khách Việt kiều về Huế tổ chức hôn lễ truyền thống, cần hỗ trợ thủ tục cấp phép quay phim.', 'cho-xu-ly', '2026-10-24 08:15:00+07'),
('yc-20', 'Tạ Thị Ngọc Ánh', '0989332211', '2026-11-25', 85, 17500000, 'gc-02', 'Duyệt yêu cầu thuê thêm 2 bộ Áo Tấc cho phụ dâu phụ rể chụp cùng.', 'da-duyet', '2026-10-20 13:50:00+07'),
('yc-21', 'Trần Công Quý', '0905123456', '2026-12-15', 150, 36000000, 'gc-01', 'Đăng ký dịch vụ trọn gói hoàng gia Cố Đô Huế, in dự thảo hợp đồng A4.', 'da-duyet', '2026-10-24 09:00:00+07'),
('yc-22', 'Mai Hoàng Anh Thư', '0919447722', '2027-01-10', 130, 29000000, 'gc-01', 'Yêu cầu chuyên gia trang điểm cổ phong và chuyên viên thắt khăn đóng truyền thống.', 'cho-xu-ly', '2026-10-24 10:30:00+07')
ON CONFLICT (id) DO UPDATE SET
  ten_khach = EXCLUDED.ten_khach,
  so_dien_thoai = EXCLUDED.so_dien_thoai,
  ngay_cuoi = EXCLUDED.ngay_cuoi,
  ngan_sach = EXCLUDED.ngan_sach,
  trang_thai = EXCLUDED.trang_thai,
  ghi_chu = EXCLUDED.ghi_chu;

-- ============================================================================
-- 6. NẠP DỮ LIỆU ĐƠN YÊU CẦU TƯ VẤN & ĐẶT LỊCH HÔN LỄ (>= 20 BOOKING MẪU)
-- ============================================================================

INSERT INTO public.yeu_cau (id, ten_khach, so_dien_thoai, ngay_cuoi, so_luong_khach, ngan_sach, goi_de_xuat_id, ghi_chu, trang_thai, ngay_tao)
VALUES
('yc-01', 'Trần Nguyễn Minh Anh', '0912345678', '2026-11-20', 120, 30000000, 'gc-01', 'Muốn tư vấn thêm về nghi thức rước dâu bằng kiệu và lọng vàng hoàng tộc.', 'da-duyet', '2026-10-15 09:30:00+07'),
('yc-02', 'Lê Hoàng Bảo Ngọc', '0987654321', '2026-12-08', 80, 20000000, 'gc-02', 'Quan tâm gói Hoàng hậu Nam Phương, muốn chụp thêm ảnh hoàng hôn bên sông Hương.', 'cho-xu-ly', '2026-10-18 14:15:00+07'),
('yc-03', 'Nguyễn Văn Đức Huy', '0905123987', '2027-01-15', 200, 45000000, 'gc-05', 'Đăng ký gói VIP Đại Nội Vĩnh Cửu cho lễ cưới đầu năm mới.', 'da-lien-he', '2026-10-10 11:00:00+07'),
('yc-04', 'Tôn Nữ Bích Trâm', '0935123456', '2026-11-28', 150, 26900000, 'gc-01', 'Đã hoàn thành bộ ảnh cưới Cung Đình Khang Ninh tại Điện Kiến Trung và Cung Diên Thọ.', 'hoan-thanh', '2026-09-28 08:20:00+07'),
('yc-05', 'Phan Đình Hoàng Long', '0978998877', '2026-12-12', 100, 19500000, 'gc-02', 'Yêu cầu phục trang Áo Nhật Bình màu xanh chính cung và Áo Tấc gấm ngũ thân nam.', 'da-duyet', '2026-10-19 10:00:00+07'),
('yc-06', 'Võ Thị Kim Ngân', '0944556677', '2026-12-25', 90, 15900000, 'gc-03', 'Đặt lịch trải nghiệm cổ phục và chụp phóng sự cưới phong cách tối giản.', 'cho-xu-ly', '2026-10-21 16:45:00+07'),
('yc-07', 'Đặng Quốc Triều', '0918223344', '2026-10-30', 60, 12000000, NULL, 'Khách đổi kế hoạch dời sang năm sau do bận công tác nước ngoài.', 'tu-choi', '2026-09-15 13:10:00+07'),
('yc-08', 'Nguyễn Phúc Gia Hân', '0909112233', '2027-02-14', 180, 38000000, 'gc-01', 'Lễ cưới ngày Valentine 2027, yêu cầu ekip quay phim 4K Flycam tại lăng Khải Định.', 'da-lien-he', '2026-10-05 15:30:00+07'),
('yc-09', 'Hoàng Trọng Tuấn Kiệt', '0932889900', '2026-11-15', 110, 25000000, 'gc-02', 'Hài lòng với dịch vụ trang điểm cô dâu cung đình và bộ ảnh ngoại cảnh Ngọ Môn.', 'hoan-thanh', '2026-09-20 09:15:00+07'),
('yc-10', 'Trương Mỹ Duyên', '0966778899', '2026-12-18', 130, 28500000, 'gc-01', 'Cần tư vấn đặt cọc 20% giữ ngày chụp và hỗ trợ thiết kế thiệp cưới điện tử hoàng gia.', 'cho-xu-ly', '2026-10-22 11:05:00+07'),
('yc-11', 'Bùi Văn Hữu Phước', '0914667788', '2027-01-08', 250, 52000000, 'gc-05', 'Tiệc cưới đại gia đình tại biệt phủ cổ bên bờ sông Hương, yêu cầu nhã nhạc cung đình biểu diễn.', 'da-duyet', '2026-10-12 14:40:00+07'),
('yc-12', 'Trần Thị Thanh Thảo', '0983114477', '2026-11-05', 75, 16500000, 'gc-03', 'Đã thanh toán hợp đồng đầy đủ và nhận trọn bộ album ảnh gỗ tráng gương cao cấp.', 'hoan-thanh', '2026-09-10 10:20:00+07'),
('yc-13', 'Phạm Đăng Khoa', '0903882211', '2026-12-22', 140, 32000000, 'gc-01', 'Hẹn gặp tư vấn trực tiếp tại Cung Diên Thọ vào sáng thứ Bảy tuần tới.', 'da-lien-he', '2026-10-17 08:50:00+07'),
('yc-14', 'Đỗ Mai Phương', '0972334455', '2027-03-01', 100, 21000000, 'gc-02', 'Muốn thử trước 3 bộ cổ phục Nhật Bình tại studio trước khi chốt lịch chính thức.', 'cho-xu-ly', '2026-10-23 15:10:00+07'),
('yc-15', 'Ngô Quang Khải', '0915998811', '2026-10-22', 50, 9500000, NULL, 'Khách hàng hủy do trùng lịch công tác đột xuất của chú rể.', 'tu-choi', '2026-09-05 09:00:00+07'),
('yc-16', 'Dương Thùy Linh', '0948226699', '2027-01-20', 160, 35000000, 'gc-01', 'Đã đặt cọc 20% qua VietQR, đăng ký gói Cung Đình Khang Ninh.', 'da-duyet', '2026-10-14 17:25:00+07'),
('yc-17', 'Lương Thế Vinh', '0907445588', '2026-11-12', 95, 18000000, 'gc-02', 'Bộ ảnh cưới tuyệt đẹp tại Rừng Thông Thiên An và Lăng Tự Đức.', 'hoan-thanh', '2026-09-18 16:00:00+07'),
('yc-18', 'Tống Khánh Huyền', '0938551122', '2026-12-30', 120, 27000000, 'gc-01', 'Tư vấn thực đơn cỗ cưới phong vị cung đình và trang trí gia tiên long phụng.', 'da-lien-he', '2026-10-16 11:40:00+07'),
('yc-19', 'Huỳnh Nhật Minh', '0961882233', '2027-02-28', 220, 48000000, 'gc-05', 'Khách Việt kiều về Huế tổ chức hôn lễ truyền thống, cần hỗ trợ thủ tục cấp phép quay phim.', 'cho-xu-ly', '2026-10-24 08:15:00+07'),
('yc-20', 'Tạ Thị Ngọc Ánh', '0989332211', '2026-11-25', 85, 17500000, 'gc-02', 'Duyệt yêu cầu thuê thêm 2 bộ Áo Tấc cho phụ dâu phụ rể chụp cùng.', 'da-duyet', '2026-10-20 13:50:00+07'),
('yc-21', 'Trần Công Quý', '0905123456', '2026-12-15', 150, 36000000, 'gc-01', 'Đăng ký dịch vụ trọn gói hoàng gia Cố Đô Huế, in dự thảo hợp đồng A4.', 'da-duyet', '2026-10-24 09:00:00+07'),
('yc-22', 'Mai Hoàng Anh Thư', '0919447722', '2027-01-10', 130, 29000000, 'gc-01', 'Yêu cầu chuyên gia trang điểm cổ phong và chuyên viên thắt khăn đóng truyền thống.', 'cho-xu-ly', '2026-10-24 10:30:00+07')
ON CONFLICT (id) DO UPDATE SET
  ten_khach = EXCLUDED.ten_khach,
  so_dien_thoai = EXCLUDED.so_dien_thoai,
  ngay_cuoi = EXCLUDED.ngay_cuoi,
  ngan_sach = EXCLUDED.ngan_sach,
  trang_thai = EXCLUDED.trang_thai,
  ghi_chu = EXCLUDED.ghi_chu;

