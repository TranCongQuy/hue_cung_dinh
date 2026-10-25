import { useState } from "react";
import { useFetch } from "../../lib/useFetch";
import { yeuCauListSchema, YeuCau, TrangThaiYeuCau } from "../../features/requests/types";
import { Button, Skeleton } from "../../components/common/UI";
import { Icon } from "../../components/common/Icon";
import { useToastStore } from "../../lib/toastStore";
import { assertNever } from "../../lib/types";
import { formatCurrency, formatDate, getStatusInfo, exportRequestsToCSV } from "../../lib/formatters";
import { SupabaseService } from "../../lib/supabaseAdapter";
import { isSupabaseConfigured } from "../../lib/supabase";
import "./AdminRequestsPage.css";

/* ==========================================================================
   1. ADMIN REQUEST ROW COMPONENT
   ========================================================================== */
interface AdminRequestRowProps {
  req: YeuCau;
  onUpdateStatus: (id: string, newStatus: TrangThaiYeuCau) => void;
  onDelete?: (id: string) => void;
  isUpdating: boolean;
  showDetails?: boolean;
}

export function AdminRequestRow({
  req,
  onUpdateStatus,
  onDelete,
  isUpdating,
  showDetails = false,
}: AdminRequestRowProps) {
  const statusInfo = getStatusInfo(req.trangThai);

  return (
    <tr>
      <td className="fw-bold">{req.tenKhach}</td>
      <td>
        <a href={`tel:${req.soDienThoai}`} style={{ color: "var(--primary)", fontWeight: 600 }}>
          {req.soDienThoai}
        </a>
      </td>
      <td>{formatDate(req.ngayCuoi)}</td>
      {showDetails && <td>{req.soLuongKhach} khách</td>}
      <td className="text-primary fw-bold">{formatCurrency(req.nganSach)}</td>
      {showDetails && <td className="table-desc-cell">{req.ghiChu || "—"}</td>}
      <td>
        <span className={`status-pill status-${statusInfo.variant}`}>
          {statusInfo.label}
        </span>
      </td>
      <td>
        <div className="status-action-btns">
          {req.trangThai === "cho-xu-ly" && (
            <button
              type="button"
              className="quick-status-btn btn-approve"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(req.id, "da-duyet")}
              title="Duyệt đơn này"
            >
              Duyệt
            </button>
          )}

          {(req.trangThai === "cho-xu-ly" || req.trangThai === "da-duyet") && (
            <button
              type="button"
              className="quick-status-btn btn-call"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(req.id, "da-lien-he")}
              title="Đánh dấu đã liên hệ"
            >
              Đã LH
            </button>
          )}

          {(req.trangThai === "da-duyet" || req.trangThai === "da-lien-he") && (
            <button
              type="button"
              className="quick-status-btn btn-done"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(req.id, "hoan-thanh")}
              title="Đánh dấu hoàn thành"
            >
              Xong
            </button>
          )}

          {req.trangThai !== "tu-choi" && req.trangThai !== "hoan-thanh" && (
            <button
              type="button"
              className="quick-status-btn btn-reject"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(req.id, "tu-choi")}
              title="Từ chối đơn"
            >
              Hủy
            </button>
          )}

          {(req.trangThai === "tu-choi" || req.trangThai === "hoan-thanh") && (
            <button
              type="button"
              className="quick-status-btn btn-call"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(req.id, "cho-xu-ly")}
              title="Mở lại xử lý"
            >
              Mở lại
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="quick-status-btn btn-delete"
              disabled={isUpdating}
              onClick={() => onDelete(req.id)}
              title="Xóa đơn khỏi hệ thống"
              aria-label="Xóa đơn"
            >
              <Icon name="trash" size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ==========================================================================
   2. ADMIN REQUESTS PAGE COMPONENT
   ========================================================================== */
const STATUS_TABS: Array<{ id: "all" | TrangThaiYeuCau; label: string }> = [
  { id: "all", label: "Tất Cả Đơn" },
  { id: "cho-xu-ly", label: "Chờ Xử Lý" },
  { id: "da-duyet", label: "Đã Duyệt" },
  { id: "da-lien-he", label: "Đã Liên Hệ" },
  { id: "hoan-thanh", label: "Hoàn Thành" },
  { id: "tu-choi", label: "Đã Từ Chối" },
];

export function AdminRequestsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [activeTab, setActiveTab] = useState<"all" | TrangThaiYeuCau>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Trong chế độ Kanban, fetch tất cả đơn để phân bổ vào các cột
  const queryParam = viewMode === "kanban" ? "all" : activeTab;
  const apiUrl = `/api/yeu-cau?trangThai=${queryParam}`;
  const { state, refetch } = useFetch(apiUrl, yeuCauListSchema);

  const handleUpdateStatus = async (id: string, newStatus: TrangThaiYeuCau) => {
    setUpdatingId(id);
    try {
      let ok = false;
      if (isSupabaseConfigured) {
        ok = await SupabaseService.updateRequestStatus(id, newStatus);
      }
      if (!ok) {
        const res = await fetch(`/api/yeu-cau/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trangThai: newStatus }),
        });
        if (res.ok) ok = true;
      }
      addToast("Cập nhật trạng thái đơn thành công!", "success");
      refetch();
    } catch {
      addToast("Lỗi khi cập nhật trạng thái đơn", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn yêu cầu này?")) return;
    setUpdatingId(id);
    try {
      let ok = false;
      if (isSupabaseConfigured) {
        ok = await SupabaseService.deleteRequest(id);
      }
      if (!ok) {
        const res = await fetch(`/api/yeu-cau/${id}`, { method: "DELETE" });
        if (res.ok) ok = true;
      }
      addToast("Đã xóa đơn khỏi hệ thống!", "success");
      refetch();
    } catch {
      addToast("Lỗi khi xóa đơn", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (state.status !== "success" || state.data.length === 0) {
      addToast("Không có dữ liệu đơn để xuất file!", "warning");
      return;
    }
    const success = exportRequestsToCSV(state.data, `don-yeu-cau-cung-dinh-${activeTab}.csv`);
    if (success) {
      addToast(`Đã xuất ${state.data.length} đơn yêu cầu ra file CSV (Excel) thành công!`, "success");
    }
  };

  const kanbanColumns: Array<{ id: TrangThaiYeuCau; label: string; color: string }> = [
    { id: "cho-xu-ly", label: "Chờ Xử Lý", color: "var(--warning)" },
    { id: "da-duyet", label: "Đã Duyệt", color: "#16a34a" },
    { id: "da-lien-he", label: "Đã Liên Hệ", color: "var(--info)" },
    { id: "hoan-thanh", label: "Hoàn Thành", color: "var(--success)" },
  ];

  return (
    <div className="admin-services-root">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản Lý Đơn Yêu Cầu Tư Vấn</h1>
          <p className="admin-page-desc">Theo dõi thông tin khách hàng và cập nhật tiến độ tư vấn hôn lễ</p>
        </div>
        <div className="admin-header-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            title="Xuất dữ liệu đơn ra file Excel/CSV tiếng Việt UTF-8"
          >
            <Icon name="download" size={16} /> Xuất Báo Cáo Excel
          </Button>
        </div>
      </div>

      <div className="requests-toolbar-row">
        {viewMode === "table" ? (
          <div className="request-tabs-bar">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`pill-btn ${activeTab === tab.id ? "pill-btn-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600 }}>
            ✨ Bảng Kanban Quản Lý Quy Trình Chăm Sóc Khách Hàng
          </div>
        )}

        <div className="view-mode-toggle" role="group" aria-label="Chế độ hiển thị">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Xem dạng Bảng"
          >
            <Icon name="barChart" size={16} /> Bảng Danh Sách
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
            onClick={() => setViewMode("kanban")}
            title="Xem dạng Kanban"
          >
            <Icon name="kanban" size={16} /> Kanban Tiến Độ
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="kanban-board-container">
          {(() => {
            switch (state.status) {
              case "loading":
                return Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="kanban-column">
                    <Skeleton height="32px" />
                    <Skeleton height="100px" />
                    <Skeleton height="100px" />
                  </div>
                ));
              case "error":
                return (
                  <div className="error-box" style={{ gridColumn: "1 / -1", margin: "20px auto" }}>
                    <p>{state.message}</p>
                    <Button variant="secondary" size="sm" onClick={refetch}>Thử lại</Button>
                  </div>
                );
              case "success":
                return kanbanColumns.map((col) => {
                  const colItems = state.data.filter((item) => item.trangThai === col.id);
                  return (
                    <div key={col.id} className="kanban-column">
                      <div className="kanban-column-header">
                        <span className="kanban-column-title" style={{ borderLeft: `3px solid ${col.color}`, paddingLeft: 8 }}>
                          {col.label}
                        </span>
                        <span className="kanban-column-badge">{colItems.length}</span>
                      </div>

                      <div className="kanban-card-list">
                        {colItems.length === 0 ? (
                          <div className="kanban-empty-col">Không có đơn nào</div>
                        ) : (
                          colItems.map((item) => (
                            <div key={item.id} className="kanban-card">
                              <div className="kanban-card-top">
                                <span className="kanban-card-customer">{item.tenKhach}</span>
                                <span className="kanban-card-budget">{formatCurrency(item.nganSach)}</span>
                              </div>
                              <a href={`tel:${item.soDienThoai}`} className="kanban-card-phone">
                                📞 {item.soDienThoai}
                              </a>
                              <div className="kanban-card-meta">
                                <span>📅 Ngày cưới: {formatDate(item.ngayCuoi)}</span>
                                <span>👥 Quy mô: {item.soLuongKhach} khách</span>
                              </div>
                              {item.ghiChu && (
                                <div className="kanban-card-note">"{item.ghiChu}"</div>
                              )}
                              <div className="kanban-card-actions">
                                <div style={{ display: "flex", gap: 4 }}>
                                  {col.id === "cho-xu-ly" && (
                                    <button
                                      type="button"
                                      className="quick-status-btn btn-approve"
                                      disabled={updatingId === item.id}
                                      onClick={() => handleUpdateStatus(item.id, "da-duyet")}
                                    >
                                      Duyệt →
                                    </button>
                                  )}
                                  {col.id === "da-duyet" && (
                                    <button
                                      type="button"
                                      className="quick-status-btn btn-call"
                                      disabled={updatingId === item.id}
                                      onClick={() => handleUpdateStatus(item.id, "da-lien-he")}
                                    >
                                      Liên hệ →
                                    </button>
                                  )}
                                  {col.id === "da-lien-he" && (
                                    <button
                                      type="button"
                                      className="quick-status-btn btn-done"
                                      disabled={updatingId === item.id}
                                      onClick={() => handleUpdateStatus(item.id, "hoan-thanh")}
                                    >
                                      Hoàn tất ✓
                                    </button>
                                  )}
                                  {col.id === "hoan-thanh" && (
                                    <button
                                      type="button"
                                      className="quick-status-btn btn-call"
                                      disabled={updatingId === item.id}
                                      onClick={() => handleUpdateStatus(item.id, "cho-xu-ly")}
                                    >
                                      Mở lại ↺
                                    </button>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className="quick-status-btn btn-delete"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={updatingId === item.id}
                                  title="Xóa đơn"
                                >
                                  <Icon name="trash" size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                });
              default:
                return assertNever(state);
            }
          })()}
        </div>
      ) : (
        <div className="admin-card-table-wrapper">
          {(() => {
            switch (state.status) {
              case "loading":
                return (
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} height="52px" />
                    ))}
                  </div>
                );
              case "error":
                return (
                  <div className="error-box" style={{ margin: "32px auto", maxWidth: "460px" }}>
                    <p>{state.message}</p>
                    <Button variant="secondary" size="sm" onClick={refetch}>Thử lại</Button>
                  </div>
                );
              case "success":
                if (state.data.length === 0) {
                  return (
                    <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
                      <Icon name="phone" size={36} color="var(--secondary)" />
                      <h3 style={{ marginTop: "12px", color: "var(--text-main)" }}>Chưa có đơn yêu cầu nào</h3>
                    </div>
                  );
                }
                return (
                  <table className="admin-table admin-requests-table">
                    <thead>
                      <tr>
                        <th>Khách Hàng</th>
                        <th>Số Điện Thoại</th>
                        <th>Ngày Cưới</th>
                        <th>Số Khách</th>
                        <th>Ngân Sách</th>
                        <th>Ghi Chú</th>
                        <th>Trạng Thái</th>
                        <th style={{ textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.data.map((req) => (
                        <AdminRequestRow
                          key={req.id}
                          req={req}
                          onUpdateStatus={handleUpdateStatus}
                          onDelete={handleDelete}
                          isUpdating={updatingId === req.id}
                          showDetails
                        />
                      ))}
                    </tbody>
                  </table>
                );
              default:
                return assertNever(state);
            }
          })()}
        </div>
      )}
    </div>
  );
}
