import { Icon } from "../../../components/common/Icon";
import "./CustomerTestimonialsSection.css";

interface Testimonial {
  id: string;
  names: string;
  date: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
  service: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "rv-1",
    names: "Hoàng Long & Bích Trâm",
    date: "Tháng 10/2026",
    location: "Cung Diên Thọ & Điện Kiến Trung",
    quote: "Ekip Huế Cung Đình vô cùng chu đáo! Bộ trang phục Nhật Bình màu đỏ chu sa thêu rồng phượng cực kỳ tinh xảo, từng nếp gấp tà áo và khăn đóng được chuyên gia cổ phục căn chỉnh kỹ lưỡng. Bộ ảnh cưới của vợ chồng mình nhận được vô số lời khen ngợi từ gia đình hai họ.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=300&q=80",
    service: "Gói Cung Đình Khang Ninh (VIP)",
  },
  {
    id: "rv-2",
    names: "Minh Anh & Diễm My",
    date: "Tháng 09/2026",
    location: "Quần thể Đại Nội & Cung An Định",
    quote: "Trải nghiệm chụp ảnh cưới hoàng triều tuyệt vời vượt mong đợi. Nhiếp ảnh gia bắt trọn những góc máy điện ảnh có chiều sâu hoài niệm, tông màu phim cố đô thanh lịch. Đặc biệt thiệp cưới online tích hợp nhạc nhã nhạc cung đình gửi quan khách ai cũng trầm trồ.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80",
    service: "Gói Hoàng Hậu Nam Phương",
  },
  {
    id: "rv-3",
    names: "Đức Huy & Quỳnh Như",
    date: "Tháng 08/2026",
    location: "Biệt Phủ Sông Hương & Lăng Tự Đức",
    quote: "Không gian trang nghiêm, dịch vụ tư vấn nhiệt tình từ lúc chọn kiểu áo tấc ngũ thân cho đến lúc hoàn thiện album photobook sơn mài. Rất cảm ơn đội ngũ Huế Cung Đình đã giúp ngày trọng đại của chúng mình lưu giữ trọn vẹn văn hóa dân tộc.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80",
    service: "Chụp Ảnh Cổ Phục & Phóng Sự Cưới",
  },
];

export function CustomerTestimonialsSection() {
  return (
    <section className="testimonials-section" aria-label="Cảm nhận và đánh giá của khách hàng">
      <div className="container">
        <div className="section-header-center">
          <span className="section-tag">TRẢI NGHIỆM & CẢM NHẬN</span>
          <h2 className="section-title">Khách Hàng Nói Về Huế Cung Đình</h2>
          <div className="gold-accent-divider">
            <span className="divider-diamond"></span>
          </div>
          <p className="section-subtitle">
            Hạnh phúc của các cặp dâu rể là minh chứng sống động cho sứ mệnh tôn vinh nét đẹp văn hóa cưới hỏi hoàng gia Cố Đô.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars" aria-label={`${t.rating} sao`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="star-gold">★</span>
                ))}
              </div>

              <blockquote className="testimonial-quote">
                "{t.quote}"
              </blockquote>

              <div className="testimonial-author">
                <img src={t.avatar} alt={t.names} className="testimonial-avatar" />
                <div className="author-info">
                  <h4 className="author-name">{t.names}</h4>
                  <span className="author-service">{t.service}</span>
                  <span className="author-meta">
                    <Icon name="mapPin" size={12} color="var(--secondary)" /> {t.location} • {t.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

