import { useState, FormEvent } from "react";
import { useFetch } from "../../lib/useFetch";
import {
  CaChup,
  YeuCau,
  yeuCauListSchema,
} from "../../features/requests/types";
import { Modal } from "../../components/common/Modal";
import { Button, Input, Skeleton } from "../../components/common/UI";
import { Icon } from "../../components/common/Icon";
import { useToastStore } from "../../lib/toastStore";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { assertNever } from "../../lib/types";
import { getStatusInfo } from "../../lib/formatters";
import "./AdminServicesPage.css";

const PHOTOGRAPHERS = [
  "Trần Minh Quân (Nhiếp Ảnh Trưởng Đại Nội)",
  "Lê Hoàng Bảo (Chuyên Gia Màu Phim Medium Format)",
  "Nguyễn Đình Khôi (Đạo Diễn Hình Ảnh Ngoại Cảnh)",
];

const STYLISTS = [
  "Tôn Nữ Bích Ngọc (Nghệ Nhân Cổ Phục Nhật Bình)",
  "Hoàng Thanh Trúc (Chuyên Gia Trang Điểm Cung Đình)",
  "Phạm Nhã Phương (Stylist Nghi Lễ Gia Tiên)",
];

const SHIFT_LABELS: Record<CaChup, string> = {
  "binh-minh": "Ca Bình Minh (05:30–09:30)",
  "hoang-hon": "Ca Hoàng Hôn (14:30–18:00)",
  "tron-ngay": "Trọn Ngày (06:00–17:00)",
};

export function AdminSchedulePage() {
  const addToast = useToastStore((s) => s.addToast);
  const { state, refetch } = useFetch(
    "/api/yeu-cau?trangThai=all",
    yeuCauListSchema
  );

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0..11

  const [assignTarget, setAssignTarget] = useState<YeuCau | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editShift, setEditShift] = useState<CaChup>("binh-minh");
  const [editPhoto, setEditPhoto] = useState(PHOTOGRAPHERS[0]);
  const [editStylist, setEditStylist] = useState(STYLISTS[0]);
  const [isSaving, setIsSaving] = useState(false);

  const openAssignModal = (req: YeuCau) => {
    setAssignTarget(req);
    setEditDate(req.ngayCuoi);
    setEditShift(req.caChup || "binh-minh");
    setEditPhoto(req.ekipPhuTrach?.nhiepAnhGia || PHOTOGRAPHERS[0]);
    setEditStylist(req.ekipPhuTrach?.stylist || STYLISTS[0]);
  };

  const handleSaveSchedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!assignTarget) return;
    setIsSaving(true);
    try {
      await SupabaseService.updateRequestScheduleAndCrew(assignTarget.id, {
        ngayCuoi: editDate,
        caChup: editShift,
        ekipPhuTrach: {
          nhiepAnhGia: editPhoto,
          stylist: editStylist,
        },
      });
      addToast(
        `Đã phân công ekip tác nghiệp cho đơn "${assignTarget.tenKhach}"!`,
        "success"
      );
      setAssignTarget(null);
      refetch();
    } finally {
      setIsSaving(false);
    }
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const leadingEmpty = (firstDay + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="admin-services-root">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            Lịch Điều Phối Ekip Nhiếp Ảnh &amp; Cổ Phục
          </h1>
          <p className="admin-page-desc">
            Quản lý lịch bấm máy theo tháng, phân công Nhiếp ảnh gia &amp; Nghệ nhân cổ phục và kiểm soát trùng ca
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={prevMonth}
            aria-label="Tháng trước"
          >
            <Icon name="chevronLeft" size={16} />
          </Button>
          <strong style={{ fontSize: "1.05rem", minWidth: "120px", textAlign: "center" }}>
            Tháng {String(viewMonth + 1).padStart(2, "0")} / {viewYear}
          </strong>
          <Button
            variant="secondary"
            size="sm"
            onClick={nextMonth}
            aria-label="Tháng sau"
          >
            <Icon name="chevronRight" size={16} />
          </Button>
        </div>
      </div>

      {(() => {
        switch (state.status) {
          case "loading":
            return <Skeleton height="420px" />;
          case "error":
            return (
              <div className="error-box" style={{ margin: "32px auto", maxWidth: "460px" }}>
                <p>{state.message}</p>
                <Button variant="secondary" size="sm" onClick={refetch}>
                  Thử lại
                </Button>
              </div>
            );
          case "success": {
            const activeShoots = state.data.filter(
              (r) => r.trangThai !== "tu-choi"
            );

            const byDate: Record<string, YeuCau[]> = {};
            activeShoots.forEach((r) => {
              if (!byDate[r.ngayCuoi]) byDate[r.ngayCuoi] = [];
              byDate[r.ngayCuoi]!.push(r);
            });

            return (
              <>
                {/* Lưới Lịch Tháng Điều Phối */}
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "24px",
                    overflowX: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, minmax(128px, 1fr))",
                      gap: "8px",
                      minWidth: "920px",
                    }}
                  >
                    {[
                      "Thứ Hai",
                      "Thứ Ba",
                      "Thứ Tư",
                      "Thứ Năm",
                      "Thứ Sáu",
                      "Thứ Bảy",
                      "Chủ Nhật",
                    ].map((wd) => (
                      <div
                        key={wd}
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "var(--text-muted)",
                          borderBottom: "1px solid var(--border-color)",
                        }}
                      >
                        {wd}
                      </div>
                    ))}

                    {Array.from({ length: leadingEmpty }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        style={{
                          minHeight: "96px",
                          background: "var(--bg-alt)",
                          borderRadius: "10px",
                          opacity: 0.45,
                        }}
                      />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const iso = `${viewYear}-${String(viewMonth + 1).padStart(
                        2,
                        "0"
                      )}-${String(day).padStart(2, "0")}`;
                      const dayShoots = byDate[iso] || [];
                      const hasBusyLoad = dayShoots.length >= 2;

                      return (
                        <div
                          key={iso}
                          style={{
                            minHeight: "106px",
                            padding: "8px",
                            borderRadius: "10px",
                            border: hasBusyLoad
                              ? "1.5px solid var(--secondary)"
                              : "1px solid var(--border-color)",
                            background:
                              dayShoots.length > 0
                                ? "var(--bg-alt)"
                                : "var(--surface)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <strong style={{ fontSize: "0.84rem" }}>{day}</strong>
                            {dayShoots.length > 0 && (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 800,
                                  padding: "1px 6px",
                                  borderRadius: "99px",
                                  background: "var(--primary)",
                                  color: "#FFF",
                                }}
                              >
                                {dayShoots.length} ca
                              </span>
                            )}
                          </div>

                          {dayShoots.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => openAssignModal(s)}
                              style={{
                                textAlign: "left",
                                padding: "5px 7px",
                                borderRadius: "6px",
                                border: "1px solid var(--border-gold)",
                                background: "var(--surface)",
                                cursor: "pointer",
                                fontSize: "0.74rem",
                                color: "var(--text-main)",
                              }}
                            >
                              <strong style={{ display: "block", color: "var(--primary)" }}>
                                {s.tenKhach}
                              </strong>
                              <span>
                                {s.caChup === "hoang-hon"
                                  ? "Hoàng hôn"
                                  : s.caChup === "tron-ngay"
                                  ? "Trọn ngày"
                                  : "Bình minh"}
                              </span>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Danh sách chi tiết Ekip phụ trách */}
                <div className="admin-card-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ngày &amp; Ca Chụp</th>
                        <th>Khách Hàng</th>
                        <th>Địa Điểm Di Sản</th>
                        <th>Nhiếp Ảnh Gia</th>
                        <th>Stylist Cổ Phục</th>
                        <th>Trạng Thái</th>
                        <th style={{ textAlign: "right" }}>Điều Phối</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeShoots.map((req) => {
                        const st = getStatusInfo(req.trangThai);
                        return (
                          <tr key={req.id}>
                            <td>
                              <strong>{req.ngayCuoi}</strong>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                {SHIFT_LABELS[req.caChup || "binh-minh"]}
                              </div>
                            </td>
                            <td className="fw-bold">{req.tenKhach}</td>
                            <td>{req.diaDiemChup || "Đại Nội Huế"}</td>
                            <td>
                              {req.ekipPhuTrach?.nhiepAnhGia || (
                                <span style={{ color: "var(--warning)", fontWeight: 600 }}>
                                  Chưa phân công
                                </span>
                              )}
                            </td>
                            <td>
                              {req.ekipPhuTrach?.stylist || (
                                <span style={{ color: "var(--text-muted)" }}>
                                  Chưa phân công
                                </span>
                              )}
                            </td>
                            <td>
                              <span className={`status-pill status-${st.variant}`}>
                                {st.label}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openAssignModal(req)}
                              >
                                Phân Công Ekip
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            );
          }
          default:
            return assertNever(state);
        }
      })()}

      {/* Modal Phân Công Ekip & Ca Chụp */}
      <Modal
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        title={
          assignTarget
            ? `Phân Công Ekip — ${assignTarget.tenKhach}`
            : "Phân Công Ekip"
        }
      >
        {assignTarget && (
          <form onSubmit={handleSaveSchedule} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input
              name="editDate"
              label="Ngày bấm máy"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />

            <div className="input-field-group">
              <label className="input-label" htmlFor="sched-shift">
                Ca ánh sáng tác nghiệp
              </label>
              <select
                id="sched-shift"
                name="editShift"
                className="input-control"
                value={editShift}
                aria-invalid={false}
                aria-describedby="desc-sched-shift"
                onChange={(e) => setEditShift(e.target.value as CaChup)}
              >
                <option value="binh-minh">Ca Bình Minh (05:30 – 09:30)</option>
                <option value="hoang-hon">Ca Hoàng Hôn (14:30 – 18:00)</option>
                <option value="tron-ngay">Trọn Ngày Di Sản (06:00 – 17:00)</option>
              </select>
              <span id="desc-sched-shift" className="sr-only">
                Chọn ca chụp cho ekip
              </span>
            </div>

            <div className="input-field-group">
              <label className="input-label" htmlFor="sched-photo">
                Nhiếp ảnh gia phụ trách chính
              </label>
              <select
                id="sched-photo"
                name="editPhoto"
                className="input-control"
                value={editPhoto}
                aria-invalid={false}
                aria-describedby="desc-sched-photo"
                onChange={(e) => setEditPhoto(e.target.value)}
              >
                {PHOTOGRAPHERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <span id="desc-sched-photo" className="sr-only">
                Chọn nhiếp ảnh gia
              </span>
            </div>

            <div className="input-field-group">
              <label className="input-label" htmlFor="sched-stylist">
                Nghệ nhân Cổ phục &amp; Trang điểm
              </label>
              <select
                id="sched-stylist"
                name="editStylist"
                className="input-control"
                value={editStylist}
                aria-invalid={false}
                aria-describedby="desc-sched-stylist"
                onChange={(e) => setEditStylist(e.target.value)}
              >
                {STYLISTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span id="desc-sched-stylist" className="sr-only">
                Chọn nghệ nhân cổ phục và trang điểm
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAssignTarget(null)}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Lưu Lịch Điều Phối
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
