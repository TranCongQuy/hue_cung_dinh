-- ============================================================================
-- HUẾ CUNG ĐÌNH — DỊCH VỤ CƯỚI & CHỤP ẢNH (doan-fenc)
-- SUPABASE POSTGRESQL SCHEMA & INITIAL SEED DATA
-- Hỗ trợ phân quyền 2 cấp độ (2-Tier RBAC: admin & user)
-- ============================================================================

-- 1. BẬT TIỆN ÍCH MÃ HÓA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BẢNG DỊCH VỤ LẺ (dich_vu)
CREATE TABLE IF NOT EXISTS public.dich_vu (
    id TEXT PRIMARY KEY,
    ten TEXT NOT NULL,
    loai TEXT NOT NULL CHECK (loai IN ('ao-dai', 'tho-anh', 'dia-diem', 'trang-tri')),
    gia BIGINT NOT NULL CHECK (gia >= 0),
    mo_ta TEXT,
    hinh_anh TEXT,
    is_top BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG GÓI CƯỚI COMBO (goi_cuoi)
CREATE TABLE IF NOT EXISTS public.goi_cuoi (
    id TEXT PRIMARY KEY,
    ten TEXT NOT NULL,
    mo_ta TEXT,
    gia_tron_goi BIGINT NOT NULL CHECK (gia_tron_goi >= 0),
    danh_sach_dich_vu_ids TEXT[] DEFAULT '{}',
    phong_cach TEXT NOT NULL CHECK (phong_cach IN ('cung-dinh', 'hien-dai', 'co-dien')),
    hinh_anh TEXT,
    is_top BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG ĐƠN YÊU CẦU TƯ VẤN (yeu_cau)
CREATE TABLE IF NOT EXISTS public.yeu_cau (
    id TEXT PRIMARY KEY,
    ten_khach TEXT NOT NULL,
    so_dien_thoai TEXT NOT NULL,
    ngay_cuoi TEXT NOT NULL,
    so_luong_khach INTEGER DEFAULT 100,
    ngan_sach BIGINT NOT NULL CHECK (ngan_sach >= 0),
    goi_de_xuat_id TEXT,
    ghi_chu TEXT DEFAULT '',
    trang_thai TEXT NOT NULL CHECK (trang_thai IN ('cho-xu-ly', 'da-duyet', 'da-lien-he', 'hoan-thanh')) DEFAULT 'cho-xu-ly',
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG MẪU THIỆP CƯỚI ONLINE (thiep_cuoi)
CREATE TABLE IF NOT EXISTS public.thiep_cuoi (
    id TEXT PRIMARY KEY,
    ten TEXT NOT NULL,
    phong_cach TEXT NOT NULL,
    loai TEXT NOT NULL CHECK (loai IN ('basic', 'vip', 'pro')),
    gia BIGINT NOT NULL CHECK (gia >= 0),
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

-- 6. BẢNG HỒ SƠ NGƯỜI DÙNG & PHÂN QUYỀN (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    phone TEXT,
    email TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FUNCTION & TRIGGER TỰ ĐỘNG ĐỒNG BỘ USER TỪ AUTH.USERS SANG PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, role, phone, email, active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Khách Hàng'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        NEW.email,
        true
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. THIẾT LẬP CHÍNH SÁCH BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.dich_vu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goi_cuoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yeu_cau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thiep_cuoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function kiểm tra quyền admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Chính sách dich_vu
DROP POLICY IF EXISTS "Public view services" ON public.dich_vu;
CREATE POLICY "Public view services" ON public.dich_vu FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify services" ON public.dich_vu;
CREATE POLICY "Admin modify services" ON public.dich_vu FOR ALL USING (public.is_admin());

-- Chính sách goi_cuoi
DROP POLICY IF EXISTS "Public view packages" ON public.goi_cuoi;
CREATE POLICY "Public view packages" ON public.goi_cuoi FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify packages" ON public.goi_cuoi;
CREATE POLICY "Admin modify packages" ON public.goi_cuoi FOR ALL USING (public.is_admin());

-- Chính sách thiep_cuoi
DROP POLICY IF EXISTS "Public view invitations" ON public.thiep_cuoi;
CREATE POLICY "Public view invitations" ON public.thiep_cuoi FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify invitations" ON public.thiep_cuoi;
CREATE POLICY "Admin modify invitations" ON public.thiep_cuoi FOR ALL USING (public.is_admin());

-- Chính sách yeu_cau
DROP POLICY IF EXISTS "Public create requests" ON public.yeu_cau;
CREATE POLICY "Public create requests" ON public.yeu_cau FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage requests" ON public.yeu_cau;
CREATE POLICY "Admin manage requests" ON public.yeu_cau FOR ALL USING (public.is_admin());

-- Chính sách profiles
DROP POLICY IF EXISTS "Users view own profile or admin view all" ON public.profiles;
CREATE POLICY "Users view own profile or admin view all" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users update own profile or admin update all" ON public.profiles;
CREATE POLICY "Users update own profile or admin update all" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- 9. SEED DATA MẪU KHỞI TẠO ĐẦY ĐỦ 18 DỊCH VỤ, 9 GÓI CƯỚI & 6 THIỆP CƯỚI CUNG ĐÌNH HUẾ
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
