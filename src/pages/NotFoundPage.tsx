import { Link } from "react-router";
import { Button } from "../components/common/UI";
import { Icon } from "../components/common/Icon";

export function NotFoundPage() {
  return (
    <div className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
      <div style={{ marginBottom: "20px" }}>
        <Icon name="alert" size={56} color="var(--primary)" />
      </div>
      <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>404 - Cung Cấm Vắng Lối</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 32px" }}>
        Đường dẫn bạn tìm kiếm hiện không tồn tại hoặc đã được di dời sang cung điện khác. Hãy quay về sảnh chính để tiếp tục khám phá.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg" leftIcon={<Icon name="arrowRight" size={18} />}>
          Quay Về Trang Chủ
        </Button>
      </Link>
    </div>
  );
}

