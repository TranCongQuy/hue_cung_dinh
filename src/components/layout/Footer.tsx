import { Link } from "react-router";
import { Icon } from "../common/Icon";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        {/* Cột 1: Thương hiệu */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Icon name="crown" size={24} color="var(--secondary)" />
            </div>
            <span className="footer-logo-title">Huế Cung Đình</span>
          </div>
          <p className="footer-desc">
            Không gian tôn vinh văn hóa cưới hỏi hoàng triều và nghệ thuật nhiếp ảnh di sản Cố đô Huế. Gìn giữ phong vị trang phục Nhật Bình, Áo Tấc hoàng gia qua từng khoảnh khắc vĩnh cửu.
          </p>
          <div className="footer-social-links">
            <span className="footer-tagline">Tinh Hoa Cố Đô • Hạnh Phúc Hoàng Triều</span>
          </div>
        </div>

        {/* Cột 2: Dịch Vụ Cưới */}
        <div className="footer-col">
          <h4 className="footer-col-title">Dịch Vụ Cưới</h4>
          <ul className="footer-links">
            <li><Link to="/dich-vu?loai=ao-dai">Áo Nhật Bình & Cổ Phục</Link></li>
            <li><Link to="/dich-vu?loai=tho-anh">Nhiếp Ảnh Gia Di Sản</Link></li>
            <li><Link to="/dich-vu?loai=dia-diem">Địa Điểm Chụp Đại Nội</Link></li>
            <li><Link to="/dich-vu?loai=trang-tri">Không Gian Cưới Hoàng Cung</Link></li>
          </ul>
        </div>

        {/* Cột 3: Trải Nghiệm Khách Hàng */}
        <div className="footer-col">
          <h4 className="footer-col-title">Trải Nghiệm</h4>
          <ul className="footer-links">
            <li><Link to="/goi-cuoi">Gói Cưới Combo</Link></li>
            <li><Link to="/thiep-cuoi">Thiệp Cưới Điện Tử</Link></li>
            <li><Link to="/tu-van">AI Tư Vấn Ngân Sách</Link></li>
            <li><Link to="/login">Cổng Quản Trị Studio</Link></li>
          </ul>
        </div>

        {/* Cột 4: Thông Tin Liên Hệ */}
        <div className="footer-col contact-col">
          <h4 className="footer-col-title">Tư Dinh Huế</h4>
          <div className="footer-contact-item">
            <Icon name="mapPin" size={18} color="var(--secondary)" />
            <span>Đại Nội Huế, Phường Thuận Thành, TP. Huế</span>
          </div>
          <div className="footer-contact-item">
            <Icon name="phone" size={18} color="var(--secondary)" />
            <span>Hotline: (0234) 3888 999</span>
          </div>
          <div className="footer-contact-item">
            <Icon name="sparkles" size={18} color="var(--secondary)" />
            <span>Thời gian đón tiếp: 08:00 - 20:30 hàng ngày</span>
          </div>
        </div>
      </div>

      {/* Dòng Bản Quyền & Học Phần */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            © 2026 <strong>Huế Cung Đình</strong>. Toàn bộ hình ảnh & bản quyền thuộc về dự án đồ án cưới cố đô.
          </p>
          <p className="academic-badge">
            Đồ án môn <strong>Web FrontEnd Nâng Cao (INT.7.18)</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

