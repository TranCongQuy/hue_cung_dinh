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

-- Bảng đơn yêu cầu tư vấn & đặt lịch
CREATE TABLE IF NOT EXISTS public.yeu_cau (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ten_don TEXT,
    ten_khach TEXT NOT NULL,
    so_dien_thoai TEXT NOT NULL,
    ngay_cuoi TEXT NOT NULL,
    ca_chup TEXT DEFAULT 'binh-minh',
    dia_diem_chup TEXT,
    so_luong_khach INTEGER DEFAULT 100,
    ngan_sach BIGINT NOT NULL DEFAULT 20000000,
    goi_de_xuat_id TEXT,
    ghi_chu TEXT DEFAULT '',
    mong_muon_bo_sung TEXT DEFAULT '',
    danh_sach_dich_vu JSONB DEFAULT '[]'::jsonb,
    ekip_phu_trach JSONB DEFAULT '{}'::jsonb,
    lich_su_cham_soc JSONB DEFAULT '[]'::jsonb,
    trang_thai TEXT NOT NULL DEFAULT 'cho-xu-ly',
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- Bổ sung cột mới an toàn nếu bảng yeu_cau đã tồn tại trước đó
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS ten_don TEXT;
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS ca_chup TEXT DEFAULT 'binh-minh';
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS dia_diem_chup TEXT;
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS mong_muon_bo_sung TEXT DEFAULT '';
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS danh_sach_dich_vu JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS ekip_phu_trach JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.yeu_cau ADD COLUMN IF NOT EXISTS lich_su_cham_soc JSONB DEFAULT '[]'::jsonb;

-- Bảng thiệp cưới chia sẻ công khai & Sổ lưu bút RSVP
CREATE TABLE IF NOT EXISTS public.thiep_khach_tao (
    slug TEXT PRIMARY KEY,
    mau_thiep_id TEXT NOT NULL,
    ten_mau_thiep TEXT NOT NULL,
    phong_cach TEXT NOT NULL DEFAULT 'cung-dinh',
    loai TEXT NOT NULL DEFAULT 'vip',
    ten_chu_re TEXT NOT NULL,
    ten_co_dau TEXT NOT NULL,
    ngay_cuoi TEXT NOT NULL,
    gio_to_chuc TEXT DEFAULT '10:30',
    dia_diem TEXT NOT NULL,
    dia_chi_chi_tiet TEXT DEFAULT '',
    loi_moi TEXT NOT NULL,
    ngan_hang TEXT DEFAULT 'MB',
    so_tai_khoan TEXT DEFAULT '0905123456',
    chu_tai_khoan TEXT DEFAULT '',
    so_tien_mung_goi_y BIGINT DEFAULT 500000,
    hinh_anh TEXT,
    am_nhac TEXT,
    nguoi_tao TEXT,
    danh_sach_rsvp JSONB DEFAULT '[]'::jsonb,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.thiep_khach_tao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public manage shared invitations" ON public.thiep_khach_tao;
CREATE POLICY "Public manage shared invitations" ON public.thiep_khach_tao FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- 2. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (ROW LEVEL SECURITY - RLS)
-- ============================================================================

ALTER TABLE public.dich_vu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goi_cuoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thiep_cuoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yeu_cau ENABLE ROW LEVEL SECURITY;

-- Quyền cho bảng dich_vu
DROP POLICY IF EXISTS "Public read services" ON public.dich_vu;
CREATE POLICY "Public read services" ON public.dich_vu FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage services" ON public.dich_vu;
CREATE POLICY "Public manage services" ON public.dich_vu FOR ALL TO anon, authenticated USING (true);

-- Quyền cho bảng goi_cuoi
DROP POLICY IF EXISTS "Public read packages" ON public.goi_cuoi;
CREATE POLICY "Public read packages" ON public.goi_cuoi FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage packages" ON public.goi_cuoi;
CREATE POLICY "Public manage packages" ON public.goi_cuoi FOR ALL TO anon, authenticated USING (true);

-- Quyền cho bảng thiep_cuoi
DROP POLICY IF EXISTS "Public read invitations" ON public.thiep_cuoi;
CREATE POLICY "Public read invitations" ON public.thiep_cuoi FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage invitations" ON public.thiep_cuoi;
CREATE POLICY "Public manage invitations" ON public.thiep_cuoi FOR ALL TO anon, authenticated USING (true);

-- Quyền cho bảng yeu_cau
DROP POLICY IF EXISTS "Public create requests" ON public.yeu_cau;
CREATE POLICY "Public create requests" ON public.yeu_cau FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public view requests" ON public.yeu_cau;
CREATE POLICY "Public view requests" ON public.yeu_cau FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public update requests" ON public.yeu_cau;
CREATE POLICY "Public update requests" ON public.yeu_cau FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public delete requests" ON public.yeu_cau;
CREATE POLICY "Public delete requests" ON public.yeu_cau FOR DELETE TO anon, authenticated USING (true);

-- ============================================================================
-- 3. NẠP DỮ LIỆU ĐẦY ĐỦ 18 DỊCH VỤ CƯỚI & CHỤP ẢNH CUNG ĐÌNH HUẾ
-- ============================================================================

INSERT INTO public.dich_vu (id, ten, loai, gia, mo_ta, hinh_anh, is_top)
VALUES
('dv-01', 'Áo Nhật Bình Hoàng Gia Thêu Long Phụng', 'ao-dai', 4500000, 'Cổ phục Nhật Bình hoàng hậu triều Nguyễn dệt gấm tơ tằm thượng hạng, chỉ ngũ sắc thêu tay tỉ mỉ theo hoa văn cung đình Đại Nội Huế.', 'https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80', true),
('dv-02', 'Áo Tấc Ngũ Thân Nam Giới Hoàng Triều', 'ao-dai', 3200000, 'Áo tấc ngũ thân tay thụng trang trọng cho chú rể, chất liệu gấm vân mây cung đình, phối khăn đóng truyền thống cao cấp Cố Đô.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', true),
('dv-03', 'Áo Dài Cưới Gấm Sen Vàng Hoàng Cung', 'ao-dai', 3500000, 'Áo dài cưới lụa tơ tằm dệt thủ công sắc đỏ son thếp hoa sen vàng may mắn cùng hoa văn cung đình triều Nguyễn cao sang.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', true),
('dv-04', 'Nhiếp Ảnh Gia Di Sản - Chụp Ngoại Cảnh Đại Nội', 'tho-anh', 6500000, 'Ekip nhiếp ảnh gia thâm niên hơn 10 năm tại Cố đô Huế, am tường góc ánh sáng vàng tại Ngọ Môn, Điện Thái Hòa và Cung Diên Thọ.', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', true),
('dv-05', 'Phóng Sự Cưới Hoàng Gia Cinematic (2 Máy Ảnh + Flycam)', 'tho-anh', 9000000, 'Ghi trọn vẹn từng khoảnh khắc cảm xúc của ngày tân hôn với tông màu phim điện ảnh hoài niệm cố đô Huế kèm góc máy trên không.', 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80', true),
('dv-06', 'Quần Thể Di Tích Đại Nội & Cung Diên Thọ', 'dia-diem', 5000000, 'Giấy phép quay chụp đặc cách tại các cung điện uy nghiêm nhất của Triều Nguyễn, không gian điện ngọc cổ kính ngàn năm.', 'https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80', true),
('dv-07', 'Biệt Phủ Cổ Hoa Nghiêm Cung Đình Sông Hương', 'dia-diem', 7500000, 'Biệt phủ nhà rường gỗ lim 100 năm tuổi ven dòng sông Hương thơ mộng, khuôn viên hoa sen nở ngát hương và bến thuyền riêng.', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', false),
('dv-08', 'Lăng Khải Định & Rừng Thông Thiên An', 'dia-diem', 4000000, 'Sự kết hợp hoàn hảo giữa kiến trúc khảm sành sứ lộng lẫy Lăng Khải Định và nét đẹp trữ tình của đồi thông ngút ngàn đồi Thiên An xứ Huế.', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80', false),
('dv-09', 'Trang Trí Gia Tiên Phong Cách Hoàng Tộc (Long Phụng Sum Vầy)', 'trang-tri', 8500000, 'Không gian lễ gia tiên bài trí bàn thờ gỗ gụ chạm trổ, bình gốm cổ, lọng vàng che lụa và hoa tươi sen trắng thơm ngát Cố Đô.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', false),
('dv-10', 'Cổng Hoa Sen Đồng Cung Đình & Lồng Đèn Gấm', 'trang-tri', 6000000, 'Cổng hoa thiết kế mái vòm cong cung đình, kết hợp hàng trăm đóa sen hồng ngát hương và đèn lồng lụa đỏ ấm cúng xứ Huế.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', false),
('dv-11', 'Trang Điểm Cô Dâu Phong Thái Hoàng Hậu', 'ao-dai', 2500000, 'Nghệ thuật trang điểm thanh tú, tự nhiên tôn lên nét đẹp phúc hậu của phụ nữ Á Đông cùng trâm cài tóc mạ vàng tinh xảo.', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80', false),
('dv-12', 'Ban Nhạc Cung Đình & Nghi Thức Rước Dâu Truyền Thống', 'trang-tri', 5500000, 'Đội hình nghinh hôn cổ truyền với đội lọng che tía, nhạc bát âm nhã nhạc cung đình Huế tạo nên không khí trang nghiêm.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', false),
('dv-13', 'Áo Giao Lĩnh Tơ Tằm Cưới Triều Lê - Nguyễn', 'ao-dai', 3900000, 'Cổ phục Áo Giao Lĩnh tơ tằm dệt thủ công sắc đỏ chu sa hoàng tộc, cổ chéo giao nhau đài các dành cho dâu rể truyền thống.', 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80', false),
('dv-14', 'Kiệu Hoa Rước Dâu Hoàng Cung Chạm Khắc Long Phụng', 'trang-tri', 7000000, 'Kiệu cưới sơn son thếp vàng chạm trổ tứ linh Long Lân Quy Phụng, phục vụ nghi thức nghinh hôn trang trọng qua các phố cổ Huế.', 'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&w=800&q=80', false),
('dv-15', 'Chụp Ảnh Phim Cổ Điển Medium Format Cố Đô', 'tho-anh', 5800000, 'Chụp bằng máy ảnh phim khổ lớn Hasselblad/Mamiya, mang lại nước ảnh hạt mịn màng, sắc độ trầm mặc sâu thẳm của Cố Đô.', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', false),
('dv-16', 'Quay Phim Teaser Trailer Cưới Điện Ảnh 4K', 'tho-anh', 8000000, 'Video teaser giới thiệu câu chuyện tình yêu phong cách phim ngắn điện ảnh hoàng gia, lồng tiếng thơ và nhạc khúc trữ tình Huế.', 'https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80', false),
('dv-17', 'Lăng Tự Đức & Cầu Ngói Thanh Toàn Cổ Kính', 'dia-diem', 4500000, 'Không gian thơ mộng khiên lăng Tự Đức hòa quyện cùng cầu ngói Thanh Toàn hơn 200 năm tuổi, tạo nên bộ ảnh mộc mạc hoài cổ.', 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80', false),
('dv-18', 'Tráp Cưới Sơn Mài Khảm Xà Cừ Rồng Bay Phượng Múa', 'trang-tri', 6800000, 'Bộ 6 tráp sơn mài mỹ nghệ Huế thếp vàng khảm ốc xà cừ thượng hạng, chứa trầu cau, bánh cốm, chè sen, rượu tiến vua.', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80', false)
ON CONFLICT (id) DO UPDATE SET
  ten = EXCLUDED.ten,
  loai = EXCLUDED.loai,
  gia = EXCLUDED.gia,
  mo_ta = EXCLUDED.mo_ta,
  hinh_anh = EXCLUDED.hinh_anh,
  is_top = EXCLUDED.is_top;

-- ============================================================================
-- 4. NẠP DỮ LIỆU ĐẦY ĐỦ 9 GÓI CƯỚI COMBO HOÀNG TRIỀU HUẾ
-- ============================================================================

INSERT INTO public.goi_cuoi (id, ten, mo_ta, gia_tron_goi, danh_sach_dich_vu_ids, phong_cach, hinh_anh, is_top)
VALUES
('gc-01', 'Gói Cung Đình Khang Ninh - Hoàng Gia Trọng Thể', 'Trải nghiệm nghi thức cưới hoàng tộc đỉnh cao với phục trang Nhật Bình thêu tay, chụp ảnh tại Đại Nội và trang trí gia tiên long phụng.', 26900000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-06', 'dv-09', 'dv-11'], 'cung-dinh', 'https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80', true),
('gc-02', 'Gói Hoàng Hậu Nam Phương - Cổ Phục Tinh Hoa', 'Gói chụp ảnh cưới thanh lịch lấy cảm hứng từ vẻ đẹp huyền thoại của Hoàng hậu Nam Phương, phục trang tơ tằm thêu hoa sen trang nhã.', 19500000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-07', 'dv-11'], 'cung-dinh', 'https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80', true),
('gc-03', 'Gói Tân Thời Tối Giản - Dạ Nguyệt Cố Đô', 'Sự giao thoa tinh tế giữa tà áo dài truyền thống và phong cách tối giản hiện đại của các cặp đôi trẻ yêu nét đẹp di sản Cố Đô.', 15900000, ARRAY['dv-03', 'dv-02', 'dv-04', 'dv-08', 'dv-11'], 'hien-dai', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', false),
('gc-04', 'Gói Hoài Niệm Sông Hương - Cổ Điển Trầm Mặc', 'Bộ ảnh cưới mang âm hưởng lãng mạn hoài cổ tại biệt phủ nhà rường và bến thuyền sông Hương với tông màu phim trầm lắng.', 18200000, ARRAY['dv-03', 'dv-04', 'dv-07', 'dv-10', 'dv-11'], 'co-dien', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', false),
('gc-05', 'Gói Đại Nội Vĩnh Cửu - Hoàng Tộc Toàn Năng', 'Gói cưới VIP toàn diện từ trang phục, 2 máy ảnh phóng sự cinematic, flycam, ban nhạc bát âm cung đình và trang trí gia tiên lộng lẫy.', 38500000, ARRAY['dv-01', 'dv-02', 'dv-05', 'dv-06', 'dv-09', 'dv-10', 'dv-11', 'dv-12'], 'cung-dinh', 'https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80', true),
('gc-06', 'Gói Phong Vị Cố Đô - Lễ Nghinh Hôn Cổ Truyền', 'Tái hiện trọn vẹn nghi lễ rước dâu truyền thống xứ Huế với kiệu hoa, tráp sơn mài khảm xà cừ và nghi lễ bái tạ tổ tiên.', 21800000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-12', 'dv-14', 'dv-18'], 'co-dien', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', false),
('gc-07', 'Gói Long Phụng Kỳ Duyên - Cổ Phục Toàn Diện', 'Bộ sưu tập cổ phục trọn gói cho dâu rể cùng hai họ, chụp tại Ngọ Môn - Điện Kiến Trung với album ảnh gỗ sơn mài cao cấp.', 31500000, ARRAY['dv-01', 'dv-02', 'dv-13', 'dv-04', 'dv-06', 'dv-11', 'dv-18'], 'cung-dinh', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', true),
('gc-08', 'Gói Dạ Yến Cố Đô - Thơ Mộng Sông Hương', 'Không gian tiệc cưới và chụp ảnh bên dòng sông Hương thơ mộng, thả đèn hoa đăng lung linh và hòa tấu đàn tranh Huế.', 24500000, ARRAY['dv-03', 'dv-05', 'dv-07', 'dv-10', 'dv-12'], 'co-dien', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', false),
('gc-09', 'Gói Tinh Hoa Di Sản - Phóng Sự Cưới Phim 4K', 'Kết hợp chụp ảnh phim medium format và video 4K cinematic bắt trọn vẻ đẹp di sản Cố Đô trường tồn cùng năm tháng.', 28900000, ARRAY['dv-01', 'dv-02', 'dv-05', 'dv-15', 'dv-16', 'dv-17'], 'hien-dai', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80', false)
ON CONFLICT (id) DO UPDATE SET
  ten = EXCLUDED.ten,
  mo_ta = EXCLUDED.mo_ta,
  gia_tron_goi = EXCLUDED.gia_tron_goi,
  danh_sach_dich_vu_ids = EXCLUDED.danh_sach_dich_vu_ids,
  phong_cach = EXCLUDED.phong_cach,
  hinh_anh = EXCLUDED.hinh_anh,
  is_top = EXCLUDED.is_top;

-- ============================================================================
-- 5. NẠP DỮ LIỆU ĐẦY ĐỦ 6 MẪU THIỆP CƯỚI ONLINE CUNG ĐÌNH HUẾ
-- ============================================================================

INSERT INTO public.thiep_cuoi (id, ten, phong_cach, loai, gia, gia_goc, mo_ta, hinh_anh, co_dau, chu_re, ngay_cuoi, dia_diem, am_nhac, tinh_nang)
VALUES
('tc-01', 'Hoàng Kim Liên Hoa', 'cung-dinh', 'vip', 450000, 990000, 'Chủ đề Sen Vàng Hoàng Cung quý phái, kết hợp hoa văn son thiếp vàng cung đình. Tối ưu giao diện hiển thị cho mọi thiết bị di động.', 'https://images.unsplash.com/photo-1775049400316-a705eb6bacf3?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-12-28', 'Đại Cung Môn - Cố Đô Huế', 'Nhã Nhạc Cung Đình - Phú Lục Địch', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tự Động', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Google Maps', 'Album Ảnh Cưới HD', 'Đếm Ngược Ngày Cưới']),
('tc-02', 'Phượng Vũ Long Phi', 'cung-dinh', 'vip', 450000, 990000, 'Họa tiết Long Phụng trình tường uy nghi, lồng ghép nhã nhạc hoàng gia cùng album ảnh cưới di sản sắc nét từng chi tiết.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-11-20', 'Cung Diên Thọ - Hoàng Thành Huế', 'Dạ Cổ Hoài Lang Cung Đình', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tự Động', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Google Maps', 'Album Ảnh Cưới HD', 'Đếm Ngược Ngày Cưới']),
('tc-03', 'Thanh Phong Tố Nguyệt', 'co-dien', 'pro', 295000, 450000, 'Phong cách hoài niệm sông Hương thơ mộng, tông kem ngà tinh tế. Tích hợp đếm ngược ngày trọng đại và bản đồ chỉ đường thông minh.', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-12-15', 'Biệt Phủ Nhà Rường Hương Thủy', 'Tình Khúc Huế Dịu Êm', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tùy Chỉnh', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Chỉ Đường', 'Album 12 Ảnh Cưới']),
('tc-04', 'Bách Niên Hảo Hợp', 'co-dien', 'pro', 295000, 450000, 'Mẫu thiệp hoài niệm cố đô trang nhã với họa tiết hoa mai vàng nở rộ, hiệu ứng lật trang 3D mượt mà và hộp chúc phúc online.', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2027-01-08', 'Cung An Định - Cố Đô Huế', 'Hòa Tấu Đàn Tranh Nam Bình', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tùy Chỉnh', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Chỉ Đường', 'Album 12 Ảnh Cưới']),
('tc-05', 'Tân Hôn Cung Đình', 'hien-dai', 'basic', 168000, 250000, 'Phong cách trẻ trung kết hợp nét cung đình Huế đương đại, tải nhanh trong 1 giây, chia sẻ tức thì qua Zalo và Messenger.', 'https://images.unsplash.com/photo-1774240627288-e7c6eebb77a9?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-12-25', 'Khách Sạn Sài Gòn Morin Huế', 'Khúc Tương Phùng Nhẹ Nhàng', ARRAY['Mã QR Mừng Cưới', 'Thiết Kế Tinh Gọn', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Google Maps']),
('tc-06', 'Diễm Lệ Cố Đô', 'hien-dai', 'basic', 168000, 250000, 'Giao diện tối giản hiện đại tôn vinh hình ảnh cô dâu chú rể trong tà áo dài truyền thống, tích hợp quét mã chuyển khoản mừng cưới.', 'https://images.unsplash.com/photo-1777917676270-ce763c4f0833?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2027-02-14', 'Làng Cổ Phước Tích - Thừa Thiên Huế', 'Tiếng Đàn Bầu Xứ Huế', ARRAY['Mã QR Mừng Cưới', 'Thiết Kế Tinh Gọn', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Google Maps'])
ON CONFLICT (id) DO UPDATE SET
  ten = EXCLUDED.ten,
  phong_cach = EXCLUDED.phong_cach,
  loai = EXCLUDED.loai,
  gia = EXCLUDED.gia,
  gia_goc = EXCLUDED.gia_goc,
  mo_ta = EXCLUDED.mo_ta,
  hinh_anh = EXCLUDED.hinh_anh,
  co_dau = EXCLUDED.co_dau,
  chu_re = EXCLUDED.chu_re,
  ngay_cuoi = EXCLUDED.ngay_cuoi,
  dia_diem = EXCLUDED.dia_diem,
  am_nhac = EXCLUDED.am_nhac,
  tinh_nang = EXCLUDED.tinh_nang;

-- ============================================================================
-- 6. NẠP DỮ LIỆU ĐƠN YÊU CẦU TƯ VẤN & ĐẶT LỊCH HÔN LỄ MẪU
-- ============================================================================

INSERT INTO public.yeu_cau (id, ten_khach, so_dien_thoai, ngay_cuoi, so_luong_khach, ngan_sach, goi_de_xuat_id, ghi_chu, trang_thai, ngay_tao)
VALUES
('yc-01', 'Trần Nguyễn Minh Anh', '0912345678', '2026-11-20', 120, 30000000, 'gc-01', 'Muốn tư vấn thêm về nghi thức rước dâu bằng kiệu và lọng vàng hoàng tộc.', 'da-duyet', '2026-10-15T09:30:00.000Z'),
('yc-02', 'Lê Hoàng Bảo Ngọc', '0987654321', '2026-12-08', 80, 20000000, 'gc-02', 'Quan tâm gói Hoàng hậu Nam Phương, muốn chụp thêm ảnh hoàng hôn bên sông Hương.', 'cho-xu-ly', '2026-10-18T14:15:00.000Z'),
('yc-03', 'Nguyễn Văn Đức Huy', '0905123987', '2027-01-15', 200, 45000000, 'gc-05', 'Đăng ký gói VIP Đại Nội Vĩnh Cửu cho lễ cưới đầu năm mới.', 'da-lien-he', '2026-10-10T11:00:00.000Z'),
('yc-04', 'Tôn Nữ Bích Trâm', '0935123456', '2026-11-28', 150, 26900000, 'gc-01', 'Đã hoàn thành bộ ảnh cưới Cung Đình Khang Ninh tại Điện Kiến Trung và Cung Diên Thọ.', 'hoan-thanh', '2026-09-28T08:20:00.000Z'),
('yc-05', 'Phan Đình Hoàng Long', '0978998877', '2026-12-12', 100, 19500000, 'gc-02', 'Yêu cầu phục trang Áo Nhật Bình màu xanh chính cung và Áo Tấc gấm ngũ thân nam.', 'da-duyet', '2026-10-19T10:00:00.000Z'),
('yc-06', 'Võ Thị Kim Ngân', '0944556677', '2026-12-25', 90, 15900000, 'gc-03', 'Đặt lịch trải nghiệm cổ phục và chụp phóng sự cưới phong cách tối giản.', 'cho-xu-ly', '2026-10-21T16:45:00.000Z'),
('yc-07', 'Đặng Quốc Triều', '0918223344', '2026-10-30', 60, 12000000, NULL, 'Khách đổi kế hoạch dời sang năm sau do bận công tác nước ngoài.', 'tu-choi', '2026-09-15T13:10:00.000Z'),
('yc-08', 'Nguyễn Phúc Gia Hân', '0909112233', '2027-02-14', 180, 38000000, 'gc-01', 'Lễ cưới ngày Valentine 2027, yêu cầu ekip quay phim 4K Flycam tại lăng Khải Định.', 'da-lien-he', '2026-10-05T15:30:00.000Z'),
('yc-09', 'Hoàng Trọng Tuấn Kiệt', '0932889900', '2026-11-15', 110, 25000000, 'gc-02', 'Hài lòng với dịch vụ trang điểm cô dâu cung đình và bộ ảnh ngoại cảnh Ngọ Môn.', 'hoan-thanh', '2026-09-20T09:15:00.000Z'),
('yc-10', 'Trương Mỹ Duyên', '0966778899', '2026-12-18', 130, 28500000, 'gc-01', 'Cần tư vấn đặt cọc 20% giữ ngày chụp và hỗ trợ thiết kế thiệp cưới điện tử hoàng gia.', 'cho-xu-ly', '2026-10-22T11:05:00.000Z'),
('yc-11', 'Bùi Văn Hữu Phước', '0914667788', '2027-01-08', 250, 52000000, 'gc-05', 'Tiệc cưới đại gia đình tại biệt phủ cổ bên bờ sông Hương, yêu cầu nhã nhạc cung đình biểu diễn.', 'da-duyet', '2026-10-12T14:40:00.000Z'),
('yc-12', 'Trần Thị Thanh Thảo', '0983114477', '2026-11-05', 75, 16500000, 'gc-03', 'Đã thanh toán hợp đồng đầy đủ và nhận trọn bộ album ảnh gỗ tráng gương cao cấp.', 'hoan-thanh', '2026-09-10T10:20:00.000Z'),
('yc-13', 'Phạm Đăng Khoa', '0903882211', '2026-12-22', 140, 32000000, 'gc-01', 'Hẹn gặp tư vấn trực tiếp tại Cung Diên Thọ vào sáng thứ Bảy tuần tới.', 'da-lien-he', '2026-10-17T08:50:00.000Z'),
('yc-14', 'Đỗ Mai Phương', '0972334455', '2027-03-01', 100, 21000000, 'gc-02', 'Muốn thử trước 3 bộ cổ phục Nhật Bình tại studio trước khi chốt lịch chính thức.', 'cho-xu-ly', '2026-10-23T15:10:00.000Z'),
('yc-15', 'Ngô Quang Khải', '0915998811', '2026-10-22', 50, 9500000, NULL, 'Khách hàng hủy do trùng lịch công tác đột xuất của chú rể.', 'tu-choi', '2026-09-05T09:00:00.000Z'),
('yc-16', 'Dương Thùy Linh', '0948226699', '2027-01-20', 160, 35000000, 'gc-01', 'Đã đặt cọc 20% qua VietQR, đăng ký gói Cung Đình Khang Ninh.', 'da-duyet', '2026-10-14T17:25:00.000Z'),
('yc-17', 'Lương Thế Vinh', '0907445588', '2026-11-12', 95, 18000000, 'gc-02', 'Bộ ảnh cưới tuyệt đẹp tại Rừng Thông Thiên An và Lăng Tự Đức.', 'hoan-thanh', '2026-09-18T16:00:00.000Z'),
('yc-18', 'Tống Khánh Huyền', '0938551122', '2026-12-30', 120, 27000000, 'gc-01', 'Tư vấn thực đơn cỗ cưới phong vị cung đình và trang trí gia tiên long phụng.', 'da-lien-he', '2026-10-16T11:40:00.000Z'),
('yc-19', 'Huỳnh Nhật Minh', '0961882233', '2027-02-28', 220, 48000000, 'gc-05', 'Khách Việt kiều về Huế tổ chức hôn lễ truyền thống, cần hỗ trợ thủ tục cấp phép quay phim.', 'cho-xu-ly', '2026-10-24T08:15:00.000Z'),
('yc-20', 'Tạ Thị Ngọc Ánh', '0989332211', '2026-11-25', 85, 17500000, 'gc-02', 'Duyệt yêu cầu thuê thêm 2 bộ Áo Tấc cho phụ dâu phụ rể chụp cùng.', 'da-duyet', '2026-10-20T13:50:00.000Z'),
('yc-21', 'Trần Công Quý', '0905123456', '2026-12-15', 150, 36000000, 'gc-01', 'Đăng ký dịch vụ trọn gói hoàng gia Cố Đô Huế, in dự thảo hợp đồng A4.', 'da-duyet', '2026-10-24T09:00:00.000Z'),
('yc-22', 'Mai Hoàng Anh Thư', '0919447722', '2027-01-10', 130, 29000000, 'gc-01', 'Yêu cầu chuyên gia trang điểm cổ phong và chuyên viên thắt khăn đóng truyền thống.', 'cho-xu-ly', '2026-10-24T10:30:00.000Z')
ON CONFLICT (id) DO UPDATE SET
  ten_khach = EXCLUDED.ten_khach,
  so_dien_thoai = EXCLUDED.so_dien_thoai,
  ngay_cuoi = EXCLUDED.ngay_cuoi,
  so_luong_khach = EXCLUDED.so_luong_khach,
  ngan_sach = EXCLUDED.ngan_sach,
  goi_de_xuat_id = EXCLUDED.goi_de_xuat_id,
  ghi_chu = EXCLUDED.ghi_chu,
  trang_thai = EXCLUDED.trang_thai;
