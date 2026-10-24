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

-- 9. SEED DATA MẪU KHỞI TẠO
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
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.goi_cuoi (id, ten, mo_ta, gia_tron_goi, danh_sach_dich_vu_ids, phong_cach, hinh_anh, is_top)
VALUES
('gc-01', 'Gói Cung Đình Khang Ninh - Hoàng Gia Trọng Thể', 'Trải nghiệm nghi thức cưới hoàng tộc đỉnh cao với phục trang Nhật Bình thêu tay, chụp ảnh tại Đại Nội và trang trí gia tiên long phụng.', 26900000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-06', 'dv-09', 'dv-11'], 'cung-dinh', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', true),
('gc-02', 'Gói Hoàng Hậu Nam Phương - Cổ Phục Tinh Hoa', 'Gói chụp ảnh cưới thanh lịch lấy cảm hứng từ vẻ đẹp huyền thoại của Hoàng hậu Nam Phương, phục trang tơ tằm thêu hoa sen trang nhã.', 19500000, ARRAY['dv-01', 'dv-02', 'dv-04', 'dv-07', 'dv-11'], 'cung-dinh', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', true),
('gc-03', 'Gói Tân Thời Tối Giản - Dạ Nguyệt Cố Đô', 'Sự giao thoa tinh tế giữa tà áo dài truyền thống và phong cách tối giản hiện đại của các cặp đôi trẻ yêu nét đẹp di sản.', 15900000, ARRAY['dv-03', 'dv-02', 'dv-04', 'dv-08', 'dv-11'], 'hien-dai', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', false),
('gc-04', 'Gói Hoài Niệm Sông Hương - Cổ Điển Trầm Mặc', 'Bộ ảnh cưới mang âm hưởng lãng mạn hoài cổ tại biệt phủ nhà rường và bến thuyền sông Hương với tông màu phim trầm lắng.', 18200000, ARRAY['dv-03', 'dv-04', 'dv-07', 'dv-10', 'dv-11'], 'co-dien', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', false),
('gc-05', 'Gói Đại Nội Vĩnh Cửu - Hoàng Tộc Toàn Năng', 'Gói cưới VIP toàn diện từ trang phục, 2 máy ảnh phóng sự cinematic, flycam, ban nhạc bát âm cung đình và trang trí gia tiên lộng lẫy.', 38500000, ARRAY['dv-01', 'dv-02', 'dv-05', 'dv-06', 'dv-09', 'dv-10', 'dv-11', 'dv-12'], 'cung-dinh', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.thiep_cuoi (id, ten, phong_cach, loai, gia, gia_goc, mo_ta, hinh_anh, co_dau, chu_re, ngay_cuoi, dia_diem, am_nhac, tinh_nang)
VALUES
('tc-01', 'Hoàng Kim Liên Hoa', 'cung-dinh', 'vip', 450000, 990000, 'Chủ đề Sen Vàng Hoàng Cung quý phái, kết hợp hoa văn son thiếp vàng cung đình. Tối ưu giao diện hiển thị cho mọi thiết bị di động.', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-12-28', 'Đại Cung Môn - Cố Đô Huế', 'Nhã Nhạc Cung Đình - Phú Lục Địch', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tự Động', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Google Maps', 'Album Ảnh Cưới HD', 'Đếm Ngược Ngày Cưới']),
('tc-02', 'Phượng Vũ Long Phi', 'cung-dinh', 'vip', 450000, 990000, 'Họa tiết Long Phụng trình tường uy nghi, lồng ghép nhã nhạc hoàng gia cùng album ảnh cưới di sản sắc nét từng chi tiết.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-11-20', 'Cung Diên Thọ - Hoàng Thành Huế', 'Dạ Cổ Hoài Lang Cung Đình', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tự Động', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Google Maps', 'Album Ảnh Cưới HD', 'Đếm Ngược Ngày Cưới']),
('tc-03', 'Thanh Phong Tố Nguyệt', 'co-dien', 'pro', 295000, 450000, 'Phong cách hoài niệm sông Hương thơ mộng, tông kem ngà tinh tế. Tích hợp đếm ngược ngày trọng đại và bản đồ chỉ đường thông minh.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'Cô Dâu', 'Chú Rể', '2026-12-15', 'Biệt Phủ Nhà Rường Hương Thủy', 'Tình Khúc Huế Dịu Êm', ARRAY['Mã QR Mừng Cưới', 'Nhạc Nền Tùy Chỉnh', 'Xác Nhận Tham Dự (RSVP)', 'Bản Đồ Chỉ Đường', 'Album 12 Ảnh Cưới'])
ON CONFLICT (id) DO NOTHING;

