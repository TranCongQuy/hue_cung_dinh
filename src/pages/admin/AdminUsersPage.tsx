import { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import { Icon } from "../../components/common/Icon";
import { Button, Input, Skeleton } from "../../components/common/UI";
import { Modal, ConfirmModal } from "../../components/common/Modal";
import { useToastStore } from "../../lib/toastStore";
import {
  UserAccount,
  userAccountListSchema,
  userFormSchema,
  UserFormData,
} from "../../features/auth/types";
import "./AdminUsersPage.css";

/* ==========================================================================
   FALLBACK MOCK DATA (Khi server offline hoặc khởi động)
   ========================================================================== */
const FALLBACK_USERS: UserAccount[] = [
  {
    id: "u-admin",
    username: "admin",
    fullName: "Quản Trị Viên Hoàng Gia",
    role: "admin",
    phone: "0905123456",
    email: "admin@huecungdinh.vn",
    active: true,
    createdAt: "2026-09-01",
  },
  {
    id: "u-user",
    username: "khachhang",
    fullName: "Nguyễn Văn Hoàng",
    role: "user",
    phone: "0912345678",
    email: "khachhang@huecungdinh.vn",
    active: true,
    createdAt: "2026-10-15",
  },
  {
    id: "u-user-02",
    username: "quocbao",
    fullName: "Phan Quốc Bảo",
    role: "user",
    phone: "0987654321",
    email: "quocbao@gmail.com",
    active: true,
    createdAt: "2026-10-18",
  },
];

export function AdminUsersPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    fullName: "",
    password: "",
    role: "user",
    phone: "",
    email: "",
    active: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  // 1. Tải danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json: unknown = await res.json();
        const parsed = userAccountListSchema.safeParse(json);
        if (parsed.success) {
          setUsers(parsed.data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Offline fallback
    }
    setUsers(FALLBACK_USERS);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Thống kê KPI
  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      client: users.filter((u) => u.role === "user").length,
      active: users.filter((u) => u.active).length,
    };
  }, [users]);

  // 3. Lọc danh sách
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const s = search.toLowerCase().trim();
      const matchSearch =
        !s ||
        u.fullName.toLowerCase().includes(s) ||
        u.username.toLowerCase().includes(s) ||
        (u.phone && u.phone.includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s));
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, search]);

  // 4. Mở modal thêm mới
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      fullName: "",
      password: "",
      role: "user",
      phone: "",
      email: "",
      active: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 5. Mở modal chỉnh sửa
  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      password: "",
      role: user.role,
      phone: user.phone || "",
      email: user.email || "",
      active: user.active,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 6. Xử lý lưu form
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = userFormSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Partial<Record<keyof UserFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UserFormData;
        if (field && !errMap[field]) errMap[field] = issue.message;
      });
      setFormErrors(errMap);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Cập nhật người dùng hiện tại
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          addToast(`Đã cập nhật thông tin tài khoản @${editingUser.username}`, "success");
        } else {
          const err = await res.json().catch(() => ({}));
          addToast(err.message || "Cập nhật tài khoản thất bại", "error");
        }
      } else {
        // Tạo người dùng mới
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          addToast(`Đã tạo mới tài khoản @${formData.username}`, "success");
        } else {
          const err = await res.json().catch(() => ({}));
          addToast(err.message || "Tạo tài khoản thất bại", "error");
        }
      }
      await fetchUsers();
      setIsModalOpen(false);
    } catch {
      // Local fallback simulation
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
        );
        addToast(`Đã cập nhật tài khoản @${editingUser.username}`, "success");
      } else {
        const newUser: UserAccount = {
          id: `u-${Date.now().toString().slice(-4)}`,
          username: formData.username,
          fullName: formData.fullName,
          role: formData.role,
          phone: formData.phone || "",
          email: formData.email || "",
          active: formData.active,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers((prev) => [newUser, ...prev]);
        addToast(`Đã tạo tài khoản @${newUser.username}`, "success");
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Bật / Tắt trạng thái hoạt động
  const handleToggleActive = async (user: UserAccount) => {
    if (user.id === "u-admin" || user.username === "admin") {
      addToast("Không thể khóa tài khoản Quản trị viên tối cao!", "warning");
      return;
    }

    const nextState = !user.active;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextState }),
      });
      if (res.ok) {
        addToast(
          nextState
            ? `Đã kích hoạt tài khoản @${user.username}`
            : `Đã tạm khóa tài khoản @${user.username}`,
          "info"
        );
        fetchUsers();
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, active: nextState } : u))
      );
      addToast(nextState ? "Đã kích hoạt tài khoản" : "Đã tạm khóa tài khoản", "info");
    }
  };

  // 8. Xóa tài khoản
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.id === "u-admin" || deleteTarget.username === "admin") {
      addToast("Không thể xóa tài khoản Quản trị viên tối cao!", "error");
      setDeleteTarget(null);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        addToast(`Đã xóa vĩnh viễn tài khoản @${deleteTarget.username}`, "success");
        fetchUsers();
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.message || "Xóa tài khoản thất bại", "error");
      }
    } catch {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      addToast(`Đã xóa tài khoản @${deleteTarget.username}`, "success");
    } finally {
      setIsSubmitting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="admin-users-root">
      {/* 1. Header */}
      <div className="admin-users-header">
        <div>
          <h1 className="admin-users-title">
            <Icon name="crown" size={28} color="var(--secondary)" />
            Quản Lý Tài Khoản & Phân Quyền Hoàng Gia
          </h1>
          <p className="admin-users-subtitle">
            Hệ thống quản trị tài khoản 2 cấp độ: Quản trị viên & Khách hàng
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          leftIcon={<Icon name="plus" size={16} />}
          onClick={handleOpenCreate}
        >
          Thêm Tài Khoản Mới
        </Button>
      </div>

      {/* 2. KPI Cards */}
      <div className="admin-users-kpi-grid">
        <div className="kpi-user-card">
          <div className="kpi-user-icon kpi-icon-total">
            <Icon name="sparkles" size={24} />
          </div>
          <div className="kpi-user-meta">
            <span className="kpi-user-label">Tổng Tài Khoản</span>
            <span className="kpi-user-count">{stats.total}</span>
          </div>
        </div>

        <div className="kpi-user-card">
          <div className="kpi-user-icon kpi-icon-admin">
            <Icon name="crown" size={24} />
          </div>
          <div className="kpi-user-meta">
            <span className="kpi-user-label">Quản Trị Viên</span>
            <span className="kpi-user-count">{stats.admin}</span>
          </div>
        </div>

        <div className="kpi-user-card">
          <div className="kpi-user-icon kpi-icon-client">
            <Icon name="heart" size={24} />
          </div>
          <div className="kpi-user-meta">
            <span className="kpi-user-label">Khách Hàng</span>
            <span className="kpi-user-count">{stats.client}</span>
          </div>
        </div>

        <div className="kpi-user-card">
          <div className="kpi-user-icon kpi-icon-total">
            <Icon name="check" size={24} />
          </div>
          <div className="kpi-user-meta">
            <span className="kpi-user-label">Đang Hoạt Động</span>
            <span className="kpi-user-count">{stats.active}</span>
          </div>
        </div>
      </div>

      {/* 3. Toolbar & Filters */}
      <div className="admin-users-toolbar">
        <div className="toolbar-search-wrapper">
          <span className="toolbar-search-icon">
            <Icon name="search" size={18} />
          </span>
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Tìm theo họ tên, username, SĐT, email..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-role-pills" role="tablist">
          <button
            type="button"
            className={`role-pill-btn ${roleFilter === "all" ? "active" : ""}`}
            onClick={() => setRoleFilter("all")}
          >
            Tất Cả ({stats.total})
          </button>
          <button
            type="button"
            className={`role-pill-btn ${roleFilter === "admin" ? "active" : ""}`}
            onClick={() => setRoleFilter("admin")}
          >
            Quản Trị ({stats.admin})
          </button>
          <button
            type="button"
            className={`role-pill-btn ${roleFilter === "user" ? "active" : ""}`}
            onClick={() => setRoleFilter("user")}
          >
            Khách Hàng ({stats.client})
          </button>
        </div>
      </div>

      {/* 4. Table */}
      <div className="admin-users-table-card">
        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <Skeleton height="36px" />
            <Skeleton height="36px" />
            <Skeleton height="36px" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-users-empty">
            <Icon name="user" size={48} color="var(--secondary)" />
            <p>Không tìm thấy tài khoản nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="admin-users-table-responsive">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Tài Khoản</th>
                  <th>Vai Trò Phân Quyền</th>
                  <th>Thông Tin Liên Hệ</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Đăng Ký</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isRoot = u.id === "u-admin" || u.username === "admin";
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-identity-cell">
                          <div className="user-avatar-badge">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-identity-meta">
                            <span className="user-display-name">
                              {u.fullName}
                              {isRoot && (
                                <span className="user-root-crown" title="Quản trị viên tối cao">
                                  <Icon name="crown" size={14} color="var(--secondary)" />
                                </span>
                              )}
                            </span>
                            <span className="user-username">@{u.username}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {u.role === "admin" && (
                          <span className="badge-role badge-role-admin">
                            <Icon name="crown" size={12} /> Quản Trị Viên
                          </span>
                        )}
                        {u.role === "user" && (
                          <span className="badge-role badge-role-user">
                            <Icon name="heart" size={12} /> Khách Hàng
                          </span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {u.phone ? (
                            <span style={{ fontSize: "0.88rem" }}>📞 {u.phone}</span>
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                              Chưa có SĐT
                            </span>
                          )}
                          {u.email && (
                            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                              ✉️ {u.email}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`badge-status ${
                            u.active ? "badge-status-active" : "badge-status-locked"
                          }`}
                          onClick={() => handleToggleActive(u)}
                          disabled={isRoot}
                          title={
                            isRoot
                              ? "Tài khoản Root không thể khóa"
                              : "Bấm để bật/tắt kích hoạt"
                          }
                          style={{
                            cursor: isRoot ? "not-allowed" : "pointer",
                            border: "none",
                          }}
                        >
                          <span className="status-dot" />
                          <span>{u.active ? "Hoạt động" : "Tạm khóa"}</span>
                        </button>
                      </td>

                      <td>
                        <span style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
                          {u.createdAt || "2026-10-01"}
                        </span>
                      </td>

                      <td>
                        <div className="user-action-buttons">
                          <button
                            type="button"
                            className="btn-action-icon"
                            onClick={() => handleOpenEdit(u)}
                            title="Chỉnh sửa thông tin"
                            aria-label={`Chỉnh sửa ${u.username}`}
                          >
                            <Icon name="sparkles" size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon btn-delete"
                            onClick={() => setDeleteTarget(u)}
                            disabled={isRoot}
                            title={isRoot ? "Không thể xóa root admin" : "Xóa tài khoản"}
                            aria-label={`Xóa ${u.username}`}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Modal Thêm / Chỉnh Sửa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Chỉnh Sửa Tài Khoản: @${editingUser.username}` : "Tạo Tài Khoản Mới"}
      >
        <form onSubmit={handleFormSubmit} noValidate className="user-form-grid">
          <div className="user-form-row">
            <Input
              label="Tên đăng nhập"
              name="username"
              placeholder="VD: nv_dieukhoan"
              value={formData.username}
              disabled={Boolean(editingUser)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((p) => ({ ...p, username: e.target.value }))
              }
              error={formErrors.username}
              required
            />
            <Input
              label="Họ và tên hiển thị"
              name="fullName"
              placeholder="VD: Lê Thị Mỹ Hạnh"
              value={formData.fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((p) => ({ ...p, fullName: e.target.value }))
              }
              error={formErrors.fullName}
              required
            />
          </div>

          <div className="user-form-row">
            <div className="form-group-select">
              <label htmlFor="user-role-select" className="form-select-label">
                Vai trò phân quyền <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <select
                id="user-role-select"
                className="form-select-control"
                value={formData.role}
                disabled={Boolean(editingUser && editingUser.username === "admin")}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    role: e.target.value as "admin" | "user",
                  }))
                }
              >
                <option value="user">Khách Hàng (Đặt dịch vụ & thiệp cưới)</option>
                <option value="admin">Quản Trị Viên (Toàn quyền hệ thống)</option>
              </select>
            </div>

            <Input
              label={editingUser ? "Mật khẩu mới (bỏ trống nếu không đổi)" : "Mật khẩu khởi tạo"}
              name="password"
              type="password"
              placeholder={editingUser ? "Để trống giữ nguyên" : "Tối thiểu 6 ký tự"}
              value={formData.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              error={formErrors.password}
              required={!editingUser}
            />
          </div>

          <div className="user-form-row">
            <Input
              label="Số điện thoại"
              name="phone"
              placeholder="0905xxxxxx"
              value={formData.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              error={formErrors.phone}
            />
            <Input
              label="Địa chỉ Email"
              name="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
              error={formErrors.email}
            />
          </div>

          <label className="user-form-checkbox-label">
            <input
              type="checkbox"
              checked={formData.active}
              disabled={Boolean(editingUser && editingUser.username === "admin")}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((p) => ({ ...p, active: e.target.checked }))
              }
            />
            <span>Kích hoạt trạng thái hoạt động ngay cho tài khoản này</span>
          </label>

          <div className="user-form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy Bỏ
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingUser ? "Cập Nhật Tài Khoản" : "Tạo Mới Tài Khoản"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Modal Xác Nhận Xóa */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xác Nhận Xóa Tài Khoản"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản @${deleteTarget?.username} (${deleteTarget?.fullName}) khỏi hệ thống?`}
        confirmText="Xác Nhận Xóa"
        cancelText="Giữ Lại"
        isLoading={isSubmitting}
      />
    </div>
  );
}

