import { useEffect, useState, FormEvent } from "react";
import { useParams, Link } from "react-router";
import { AsyncState, assertNever } from "../lib/types";
import {
  CustomShareInvitation,
  TaoRsvpInput,
  taoRsvpInputSchema,
  calculateCountdownParts,
  buildVietQrImageUrl,
  resolveBankBin,
} from "../features/invitations/types";
import { SupabaseService } from "../lib/supabaseAdapter";
import { useRoyalCourtAudio } from "../features/invitations/components/RoyalCourtAudio";
import { useToastStore } from "../lib/toastStore";
import { formatCurrency } from "../lib/formatters";
import { Button, Input, SkeletonCard } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import { RoyalDivider } from "../components/common/RoyalDivider";
import "./PublicInvitationSharePage.css";

export function PublicInvitationSharePage() {
  const { slug = "quoc-bao-ngoc-han-2026" } = useParams<{ slug: string }>();
  const addToast = useToastStore((s) => s.addToast);
  const { isPlaying, togglePlay, stop } = useRoyalCourtAudio(0.3);

  const [state, setState] = useState<AsyncState<CustomShareInvitation>>({
    status: "loading",
  });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  // RSVP Form State
  const [tenKhachMoi, setTenKhachMoi] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [phiaKhach, setPhiaKhach] = useState<"nha-trai" | "nha-gai">("nha-trai");
  const [trangThaiThamDu, setTrangThaiThamDu] = useState<
    "tham-du" | "ban-vieccao-loi"
  >("tham-du");
  const [soLuongNguoi, setSoLuongNguoi] = useState<number>(2);
  const [cheDoAn, setCheDoAn] = useState<"man" | "chay">("man");
  const [loiChuc, setLoiChuc] = useState("");
  const [rsvpErrors, setRsvpErrors] = useState<Record<string, string>>({});
  const [isSendingRsvp, setIsSendingRsvp] = useState(false);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    SupabaseService.getCustomInvitationBySlug(slug)
      .then((found) => {
        if (!active) return;
        if (!found) {
          setState({
            status: "error",
            message:
              "Không tìm thấy thiệp cưới tương ứng với đường dẫn này. Vui lòng kiểm tra lại liên kết.",
          });
        } else {
          setState({ status: "success", data: found });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            status: "error",
            message: "Không thể tải dữ liệu thiệp cưới lúc này.",
          });
        }
      });

    return () => {
      active = false;
      stop();
    };
  }, [slug, stop]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleRsvpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.status !== "success") return;

    const payload: TaoRsvpInput = {
      tenKhachMoi: tenKhachMoi.trim(),
      soDienThoai: soDienThoai.trim() || undefined,
      phiaKhach,
      trangThaiThamDu,
      soLuongNguoi: trangThaiThamDu === "tham-du" ? soLuongNguoi : 1,
      cheDoAn,
      loiChuc: loiChuc.trim(),
    };

    const parsed = taoRsvpInputSchema.safeParse(payload);
    if (!parsed.success) {
      const errMap: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        const key = iss.path[0];
        if (key) errMap[String(key)] = iss.message;
      });
      setRsvpErrors(errMap);
      addToast("Vui lòng nhập đầy đủ tên và lời chúc mừng!", "error");
      return;
    }

    setRsvpErrors({});
    setIsSendingRsvp(true);
    try {
      const savedEntry = await SupabaseService.addRsvpToCustomInvitation(
        state.data.slug,
        parsed.data
      );
      if (savedEntry) {
        const refreshed = await SupabaseService.getCustomInvitationBySlug(
          state.data.slug
        );
        if (refreshed) {
          setState({ status: "success", data: refreshed });
        }
        setTenKhachMoi("");
        setSoDienThoai("");
        setLoiChuc("");
        addToast(
          "Cảm ơn quý khách đã gửi lời chúc phúc & xác nhận tham dự đến gia đình!",
          "success"
        );
      }
    } finally {
      setIsSendingRsvp(false);
    }
  };

  switch (state.status) {
    case "loading":
      return (
        <div className="public-invite-page">
          <div className="container" style={{ maxWidth: "760px", padding: "48px 16px" }}>
            <SkeletonCard />
          </div>
        </div>
      );

    case "error":
      return (
        <div className="public-invite-page">
          <div className="container public-invite-error">
            <Icon name="crown" size={36} color="var(--secondary)" />
            <h1>Không Tìm Thấy Thiệp Hồng</h1>
            <p>{state.message}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/thiep-cuoi/moi/quoc-bao-ngoc-han-2026">
                <Button variant="primary">Xem Thiệp Mẫu Quốc Bảo &amp; Ngọc Hân</Button>
              </Link>
              <Link to="/thiep-cuoi/dang-ky">
                <Button variant="secondary">Tự Tạo Thiệp Cưới Mới</Button>
              </Link>
            </div>
          </div>
        </div>
      );

    case "success": {
      const invite = state.data;
      const countdown = calculateCountdownParts(
        `${invite.ngayCuoi}T${invite.gioToChuc || "10:30"}:00`,
        nowMs
      );
      const bankInfo = resolveBankBin(invite.nganHang);
      const vietQrImg = buildVietQrImageUrl({
        bankNameOrCode: invite.nganHang,
        accountNumber: invite.soTaiKhoan,
        accountName: invite.chuTaiKhoan,
        amount: invite.soTienMungGoiY > 0 ? invite.soTienMungGoiY : undefined,
        addInfo: `Mung Cuoi ${invite.tenChuRe} ${invite.tenCoDau}`,
      });

      const attendingTotal = invite.danhSachRsvp
        .filter((r) => r.trangThaiThamDu === "tham-du")
        .reduce((sum, r) => sum + r.soLuongNguoi, 0);

      return (
        <div className="public-invite-page">
          <div className="container public-invite-container">
            {/* Thanh điều khiển Nhã nhạc & Chia sẻ */}
            <div className="public-invite-topbar">
              <button
                type="button"
                className="public-audio-pill"
                onClick={togglePlay}
              >
                <Icon
                  name={isPlaying ? "music" : "volumeX"}
                  size={15}
                  color="var(--secondary)"
                />
                <span>
                  {isPlaying
                    ? `Đang tấu: ${invite.amNhac || "Nhã Nhạc Cung Đình"}`
                    : "Bật Nhã Nhạc Cung Đình"}
                </span>
              </button>

              <button
                type="button"
                className="public-share-pill"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  addToast("Đã sao chép đường dẫn thiệp cưới!", "success");
                }}
              >
                <Icon name="copy" size={14} />
                <span>Sao chép link thiệp</span>
              </button>
            </div>

            {!envelopeOpen ? (
              <div
                className="public-sealed-card"
                role="button"
                tabIndex={0}
                aria-label="Chạm dấu ấn hoàng kim để mở thiệp cưới"
                onClick={() => setEnvelopeOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEnvelopeOpen(true);
                  }
                }}
              >
                <span className="sealed-kicker">THIỆP BÁO HỶ TRỰC TUYẾN HOÀNG TRIỀU</span>
                <div className="sealed-wax-medallion">
                  <Icon name="crown" size={38} color="#D4AF37" />
                </div>
                <h1 className="sealed-couple-names">
                  {invite.tenChuRe} &amp; {invite.tenCoDau}
                </h1>
                <p className="sealed-date-venue">
                  {invite.gioToChuc} • {invite.ngayCuoi} • {invite.diaDiem}
                </p>
                <span className="sealed-open-cta">
                  Chạm ấn triện vàng để mở thiệp hồng
                </span>
              </div>
            ) : (
              <div className="public-opened-wrapper">
                {/* 1. Tờ Thiệp Chính */}
                <article className="public-main-card">
                  <div className="public-hero-photo">
                    <img
                      src={invite.hinhAnh}
                      alt={`Ảnh cưới ${invite.tenChuRe} & ${invite.tenCoDau}`}
                    />
                    <div className="public-hero-gradient" />
                    <div className="public-hero-titles">
                      <span className="hero-save-badge">TRÂN TRỌNG KÍNH MỜI</span>
                      <h1>
                        {invite.tenChuRe} &amp; {invite.tenCoDau}
                      </h1>
                    </div>
                  </div>

                  <div className="public-card-inner">
                    {invite.diaChiChiTiet && (
                      <p className="public-family-meta">{invite.diaChiChiTiet}</p>
                    )}

                    <blockquote className="public-invite-quote">
                      &ldquo;{invite.loiMoi}&rdquo;
                    </blockquote>

                    <div className="public-ceremony-box">
                      <div className="ceremony-item">
                        <Icon name="clock" size={18} color="var(--secondary)" />
                        <div>
                          <span>Thời gian cử hành hôn lễ</span>
                          <strong>
                            {invite.gioToChuc} — Ngày {invite.ngayCuoi}
                          </strong>
                        </div>
                      </div>
                      <div className="ceremony-item">
                        <Icon name="mapPin" size={18} color="var(--secondary)" />
                        <div>
                          <span>Địa điểm đón tiếp quan khách</span>
                          <strong>{invite.diaDiem}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Đồng hồ đếm ngược thời gian thực */}
                    <div className="public-countdown-grid">
                      {[
                        { v: countdown.days, label: "Ngày" },
                        { v: countdown.hours, label: "Giờ" },
                        { v: countdown.minutes, label: "Phút" },
                        { v: countdown.seconds, label: "Giây" },
                      ].map((cell) => (
                        <div key={cell.label} className="public-cd-cell">
                          <strong>{String(cell.v).padStart(2, "0")}</strong>
                          <span>{cell.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="public-map-actions">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          invite.diaDiem
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="map-external-link"
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Icon name="mapPin" size={15} />}
                        >
                          Mở Bản Đồ Chỉ Đường Google Maps
                        </Button>
                      </a>
                    </div>
                  </div>
                </article>

                <RoyalDivider variant="lotus" />

                {/* 2. Hộp Mừng Cưới VietQR + Form Xác Nhận Tham Dự (RSVP) */}
                <div className="public-interactive-grid">
                  {/* Hộp Mừng Cưới */}
                  <section className="public-gift-card">
                    <span className="section-tag">GỬI TRAO TẤM LÒNG</span>
                    <h2>Hộp Mừng Cưới VietQR</h2>
                    <p className="gift-desc">
                      Dành cho quý bạn hữu ở xa chưa thể trực tiếp chung vui. Quét mã tương thích
                      với các ứng dụng ngân hàng Napas 247.
                    </p>

                    <div className="gift-qr-frame">
                      <img
                        src={vietQrImg}
                        alt={`Mã QR ngân hàng ${bankInfo.shortName}`}
                      />
                    </div>

                    <div className="gift-account-meta">
                      <div>
                        <span>Ngân hàng thụ hưởng</span>
                        <strong>
                          {bankInfo.shortName} (Mã BIN {bankInfo.bin})
                        </strong>
                      </div>
                      <div>
                        <span>Chủ tài khoản</span>
                        <strong>{invite.chuTaiKhoan}</strong>
                      </div>
                      <div>
                        <span>Số tài khoản</span>
                        <strong>{invite.soTaiKhoan}</strong>
                      </div>
                      {invite.soTienMungGoiY > 0 && (
                        <div>
                          <span>Mức gợi ý mặc định (có thể sửa trên app)</span>
                          <strong>{formatCurrency(invite.soTienMungGoiY)}</strong>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      leftIcon={<Icon name="copy" size={15} />}
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(invite.soTaiKhoan);
                        }
                        addToast("Đã sao chép số tài khoản mừng cưới!", "success");
                      }}
                    >
                      Sao Chép Số Tài Khoản
                    </Button>
                  </section>

                  {/* Form Xác Nhận Tham Dự & Gửi Lời Chúc */}
                  <section className="public-rsvp-card">
                    <span className="section-tag">XÁC NHẬN THAM DỰ (RSVP)</span>
                    <h2>Sổ Lưu Bút &amp; Báo Hiện Diện</h2>
                    <p className="gift-desc">
                      Sự phản hồi của quý khách giúp gia đình sắp xếp bàn tiệc chu đáo nhất.
                    </p>

                    <form onSubmit={handleRsvpSubmit} noValidate className="rsvp-form">
                      <Input
                        name="tenKhachMoi"
                        label="Họ và tên quý khách"
                        placeholder="VD: Anh Minh Tuấn (Bạn Đại học)"
                        value={tenKhachMoi}
                        onChange={(e) => setTenKhachMoi(e.target.value)}
                        error={rsvpErrors.tenKhachMoi}
                        required
                      />

                      <div className="rsvp-duo-row">
                        <Input
                          name="soDienThoai"
                          label="Số điện thoại (Tùy chọn)"
                          placeholder="VD: 0905123456"
                          value={soDienThoai}
                          onChange={(e) => setSoDienThoai(e.target.value)}
                        />

                        <div className="rsvp-field-wrap">
                          <label htmlFor="rsvp-phia-khach" className="input-label">
                            Khách mời của bên
                          </label>
                          <select
                            id="rsvp-phia-khach"
                            name="phiaKhach"
                            className="input-control select-control"
                            value={phiaKhach}
                            aria-invalid={false}
                            aria-describedby="desc-phia-khach"
                            onChange={(e) =>
                              setPhiaKhach(
                                e.target.value as "nha-trai" | "nha-gai"
                              )
                            }
                          >
                            <option value="nha-trai">Khách Nhà Trai</option>
                            <option value="nha-gai">Khách Nhà Gái</option>
                          </select>
                          <span id="desc-phia-khach" className="sr-only">
                            Chọn phía gia đình mời quý khách
                          </span>
                        </div>
                      </div>

                      <div className="rsvp-duo-row">
                        <div className="rsvp-field-wrap">
                          <label htmlFor="rsvp-tham-du" className="input-label">
                            Trạng thái tham dự
                          </label>
                          <select
                            id="rsvp-tham-du"
                            name="trangThaiThamDu"
                            className="input-control select-control"
                            value={trangThaiThamDu}
                            aria-invalid={false}
                            aria-describedby="desc-tham-du"
                            onChange={(e) =>
                              setTrangThaiThamDu(
                                e.target.value as "tham-du" | "ban-vieccao-loi"
                              )
                            }
                          >
                            <option value="tham-du">Sẽ đến chung vui</option>
                            <option value="ban-vieccao-loi">
                              Bận việc, xin gửi lời chúc từ xa
                            </option>
                          </select>
                          <span id="desc-tham-du" className="sr-only">
                            Xác nhận có thể tham dự hay bận việc
                          </span>
                        </div>

                        <div className="rsvp-field-wrap">
                          <label htmlFor="rsvp-so-nguoi" className="input-label">
                            Số người đi cùng (gồm bạn)
                          </label>
                          <select
                            id="rsvp-so-nguoi"
                            name="soLuongNguoi"
                            className="input-control select-control"
                            value={soLuongNguoi}
                            disabled={trangThaiThamDu !== "tham-du"}
                            aria-invalid={false}
                            aria-describedby="desc-so-nguoi"
                            onChange={(e) =>
                              setSoLuongNguoi(Number(e.target.value))
                            }
                          >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <option key={n} value={n}>
                                {n} khách
                              </option>
                            ))}
                          </select>
                          <span id="desc-so-nguoi" className="sr-only">
                            Số lượng khách tham dự tiệc
                          </span>
                        </div>
                      </div>

                      <div className="rsvp-field-wrap">
                        <label htmlFor="rsvp-che-do-an" className="input-label">
                          Thực đơn mong muốn
                        </label>
                        <select
                          id="rsvp-che-do-an"
                          name="cheDoAn"
                          className="input-control select-control"
                          value={cheDoAn}
                          aria-invalid={false}
                          aria-describedby="desc-che-do-an"
                          onChange={(e) =>
                            setCheDoAn(e.target.value as "man" | "chay")
                          }
                        >
                          <option value="man">Cỗ Mặn Truyền Thống Xứ Huế</option>
                          <option value="chay">Bàn Tiệc Chay Thanh Tịnh</option>
                        </select>
                        <span id="desc-che-do-an" className="sr-only">
                          Chọn thực đơn mặn hoặc chay
                        </span>
                      </div>

                      <div className="rsvp-field-wrap">
                        <label htmlFor="rsvp-loi-chuc" className="input-label">
                          Lời chúc phúc gửi Cô Dâu &amp; Chú Rể *
                        </label>
                        <textarea
                          id="rsvp-loi-chuc"
                          name="loiChuc"
                          className="input-control"
                          rows={3}
                          value={loiChuc}
                          onChange={(e) => setLoiChuc(e.target.value)}
                          aria-invalid={Boolean(rsvpErrors.loiChuc)}
                          aria-describedby={
                            rsvpErrors.loiChuc
                              ? "err-rsvp-loi-chuc"
                              : "desc-rsvp-loi-chuc"
                          }
                          placeholder="Chúc hai bạn trăm năm tình viên mãn, bạc đầu nghĩa phu thê..."
                        />
                        <span id="desc-rsvp-loi-chuc" className="sr-only">
                          Nhập lời chúc hiển thị trên sổ lưu bút
                        </span>
                        {rsvpErrors.loiChuc && (
                          <p
                            id="err-rsvp-loi-chuc"
                            role="alert"
                            className="input-error-msg"
                          >
                            {rsvpErrors.loiChuc}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        isLoading={isSendingRsvp}
                        leftIcon={<Icon name="heart" size={16} />}
                      >
                        Gửi Lời Chúc Phúc &amp; Xác Nhận RSVP
                      </Button>
                    </form>
                  </section>
                </div>

                {/* 3. Bảng Sổ Lưu Bút Trực Tuyến */}
                <section className="public-guestbook-section">
                  <div className="guestbook-header">
                    <div>
                      <span className="section-tag">SỔ LƯU BÚT TRỰC TUYẾN</span>
                      <h2>
                        Lời Chúc Từ Bạn Hữu ({invite.danhSachRsvp.length} lượt gửi •{" "}
                        {attendingTotal} khách báo dự tiệc)
                      </h2>
                    </div>
                  </div>

                  {invite.danhSachRsvp.length === 0 ? (
                    <p className="guestbook-empty">
                      Hãy là người đầu tiên gửi lời chúc phúc tốt đẹp nhất đến{" "}
                      {invite.tenChuRe} &amp; {invite.tenCoDau}!
                    </p>
                  ) : (
                    <div className="guestbook-wishes-grid">
                      {invite.danhSachRsvp.map((entry) => (
                        <div key={entry.id} className="wish-card">
                          <div className="wish-card-top">
                            <strong>{entry.tenKhachMoi}</strong>
                            <span
                              className={`wish-badge ${
                                entry.trangThaiThamDu === "tham-du"
                                  ? "attending"
                                  : "regret"
                              }`}
                            >
                              {entry.trangThaiThamDu === "tham-du"
                                ? `Tham dự (${entry.soLuongNguoi} khách • ${
                                    entry.cheDoAn === "chay" ? "Tiệc chay" : "Tiệc mặn"
                                  })`
                                : "Gửi lời chúc từ xa"}
                            </span>
                          </div>
                          <p className="wish-content">&ldquo;{entry.loiChuc}&rdquo;</p>
                          <small className="wish-meta">
                            {entry.phiaKhach === "nha-trai"
                              ? "Khách Nhà Trai"
                              : "Khách Nhà Gái"}{" "}
                            •{" "}
                            {new Date(entry.ngayGui).toLocaleDateString("vi-VN")}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      );
    }

    default:
      return assertNever(state);
  }
}
