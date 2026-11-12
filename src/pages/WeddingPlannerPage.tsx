import { useEffect, useMemo, useState, FormEvent } from "react";
import { Link } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import { formatCurrency } from "../lib/formatters";
import { useToastStore } from "../lib/toastStore";
import { Button, Input } from "../components/common/UI";
import { Icon } from "../components/common/Icon";
import "./WeddingPlannerPage.css";

type MilestoneId = "m-6m" | "m-3m" | "m-1m" | "m-7d" | "m-1d";

interface PlannerTask {
  id: string;
  milestone: MilestoneId;
  title: string;
  done: boolean;
}

interface BudgetRow {
  id: string;
  category: string;
  planned: number;
  actual: number;
  color: string;
}

interface StoredPlannerData {
  coupleTitle: string;
  weddingDate: string;
  tasks: PlannerTask[];
  budgets: BudgetRow[];
}

const MILESTONES: Array<{ id: MilestoneId; label: string; subtitle: string }> = [
  { id: "m-6m", label: "Trước 3 – 6 Tháng", subtitle: "Chọn ngày lành, ngân sách & đặt địa điểm" },
  { id: "m-3m", label: "Trước 2 – 3 Tháng", subtitle: "Chụp ảnh cưới di sản & thử cổ phục Nhật Bình" },
  { id: "m-1m", label: "Trước 30 Ngày", subtitle: "Phát hành thiệp online RSVP & đặt tráp lễ" },
  { id: "m-7d", label: "Trước 7 Ngày", subtitle: "Nhận cổ phục đã hấp thảo mộc & chốt sơ đồ bàn" },
  { id: "m-1d", label: "Trước Giờ G (24h)", subtitle: "Kiểm tra lễ vật gia tiên & nghỉ ngơi giữ thần thái" },
];

const DEFAULT_TASKS: PlannerTask[] = [
  { id: "t-01", milestone: "m-6m", title: "Xem ngày lành tháng tốt cho Lễ Ăn Hỏi & Lễ Thành Hôn", done: true },
  { id: "t-02", milestone: "m-6m", title: "Thống nhất tổng ngân sách dự kiến giữa hai bên gia đình", done: true },
  { id: "t-03", milestone: "m-3m", title: "Chốt gói chụp ảnh cưới Hoàng Triều tại Đại Nội & Cung Diên Thọ", done: true },
  { id: "t-04", milestone: "m-3m", title: "Lấy số đo & thử Áo Nhật Bình, Áo Tấc cho Dâu Rể", done: false },
  { id: "t-05", milestone: "m-1m", title: "Khởi tạo thiệp cưới điện tử VietQR & gửi link xác nhận RSVP", done: false },
  { id: "t-06", milestone: "m-1m", title: "Đặt bộ 6 tráp sơn mài khảm xà cừ & trang trí gia tiên", done: false },
  { id: "t-07", milestone: "m-7d", title: "Duyệt ảnh phóng cổng & video slideshow chiếu sảnh tiệc", done: false },
  { id: "t-08", milestone: "m-7d", title: "Chốt số lượng bàn tiệc mặn / chay theo danh sách RSVP", done: false },
  { id: "t-09", milestone: "m-1d", title: "Chuẩn bị bao lì xì đội bê tráp & kiểm tra nhẫn cưới", done: false },
];

const DEFAULT_BUDGETS: BudgetRow[] = [
  { id: "b-01", category: "Gói Chụp Ảnh & Quay Phim Di Sản", planned: 26900000, actual: 26900000, color: "#8B0000" },
  { id: "b-02", category: "Thuê Cổ Phục Nhật Bình, Áo Tấc & Phụ Kiện", planned: 8500000, actual: 7800000, color: "#D4AF37" },
  { id: "b-03", category: "Trang Trí Lễ Gia Tiên & Bộ Tráp Sơn Mài", planned: 15000000, actual: 14500000, color: "#B7791F" },
  { id: "b-04", category: "Thiệp Cưới Online & Thiệp Giấy Truyền Thống", planned: 2500000, actual: 1950000, color: "#2B6CB0" },
  { id: "b-05", category: "Dự Phòng Phát Sinh & Di Chuyển Ekip", planned: 5000000, actual: 3200000, color: "#2F855A" },
];

const STORAGE_KEY_PREFIX = "hue_wedding_planner_v1_";

export function WeddingPlannerPage() {
  const { user } = useAuth();
  const addToast = useToastStore((s) => s.addToast);
  const storageKey = `${STORAGE_KEY_PREFIX}${user?.tenDangNhap || "guest"}`;

  const [coupleTitle, setCoupleTitle] = useState(
    user?.ten ? `Kế hoạch lễ cưới — ${user.ten}` : "Kế hoạch hôn lễ Hoàng Triều"
  );
  const [weddingDate, setWeddingDate] = useState("2026-12-28");
  const [tasks, setTasks] = useState<PlannerTask[]>(DEFAULT_TASKS);
  const [budgets, setBudgets] = useState<BudgetRow[]>(DEFAULT_BUDGETS);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskMilestone, setNewTaskMilestone] = useState<MilestoneId>("m-1m");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredPlannerData>;
        if (parsed.coupleTitle) setCoupleTitle(parsed.coupleTitle);
        if (parsed.weddingDate) setWeddingDate(parsed.weddingDate);
        if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
          setTasks(parsed.tasks);
        }
        if (Array.isArray(parsed.budgets) && parsed.budgets.length > 0) {
          setBudgets(parsed.budgets);
        }
      }
    } catch {
      // Bỏ qua nếu dữ liệu cũ không hợp lệ
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      const payload: StoredPlannerData = {
        coupleTitle,
        weddingDate,
        tasks,
        budgets,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Bỏ qua lỗi bộ nhớ
    }
  }, [storageKey, coupleTitle, weddingDate, tasks, budgets]);

  const completedCount = tasks.filter((t) => t.done).length;
  const completionPct =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const totalPlanned = useMemo(
    () => budgets.reduce((s, b) => s + b.planned, 0),
    [budgets]
  );
  const totalActual = useMemo(
    () => budgets.reduce((s, b) => s + b.actual, 0),
    [budgets]
  );
  const diffBudget = totalPlanned - totalActual;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim().length < 3) {
      addToast("Vui lòng nhập nội dung công việc tối thiểu 3 ký tự", "warning");
      return;
    }
    const item: PlannerTask = {
      id: `task-${Date.now().toString().slice(-5)}`,
      milestone: newTaskMilestone,
      title: newTaskTitle.trim(),
      done: false,
    };
    setTasks((prev) => [...prev, item]);
    setNewTaskTitle("");
    addToast("Đã bổ sung công việc vào sổ tay cưới!", "success");
  };

  const updateBudgetAmount = (
    id: string,
    field: "planned" | "actual",
    val: number
  ) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, [field]: Math.max(0, val) } : b
      )
    );
  };

  // Tính toán các cung tròn Pure SVG Donut Chart
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let cumulativeFraction = 0;

  return (
    <div className="wedding-planner-page">
      <div className="container">
        {/* Header Bar */}
        <header className="planner-header">
          <div>
            <span className="section-tag">SỔ TAY CẶP ĐÔI CÁ NHÂN HÓA</span>
            <h1 className="planner-title">{coupleTitle}</h1>
            <p className="planner-sub">
              Mọi thay đổi được lưu tự động trên trình duyệt. Sẵn sàng xuất bản in khổ giấy A4
              để bàn bạc cùng hai bên gia đình.
            </p>
          </div>
          <div className="planner-header-actions no-print">
            <Button
              variant="secondary"
              leftIcon={<Icon name="printer" size={16} />}
              onClick={() => window.print()}
            >
              In Sổ Tay Cưới (A4)
            </Button>
            <Link to="/dat-lich">
              <Button variant="primary" rightIcon={<Icon name="arrowRight" size={16} />}>
                Đặt Lịch Studio
              </Button>
            </Link>
          </div>
        </header>

        {/* 3 Thẻ Chỉ Số Tổng Quan */}
        <div className="planner-kpi-row">
          <div className="planner-kpi-card">
            <span className="kpi-label">Tiến độ hoàn tất checklist</span>
            <strong className="kpi-big">
              {completedCount}/{tasks.length} hạng mục ({completionPct}%)
            </strong>
            <div className="kpi-progress-track">
              <div
                className="kpi-progress-fill"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          <div className="planner-kpi-card">
            <span className="kpi-label">Tổng ngân sách dự kiến</span>
            <strong className="kpi-big">{formatCurrency(totalPlanned)}</strong>
            <small className="kpi-sub">Ngày trọng đại: {weddingDate}</small>
          </div>

          <div className="planner-kpi-card">
            <span className="kpi-label">Chi phí thực tế ước tính</span>
            <strong className="kpi-big highlight">
              {formatCurrency(totalActual)}
            </strong>
            <small className={diffBudget >= 0 ? "kpi-saving" : "kpi-over"}>
              {diffBudget >= 0
                ? `Đang tiết kiệm: ${formatCurrency(diffBudget)}`
                : `Vượt dự toán: ${formatCurrency(Math.abs(diffBudget))}`}
            </small>
          </div>
        </div>

        {/* Chỉnh sửa thông tin chung */}
        <div className="planner-meta-editor no-print">
          <Input
            name="coupleTitle"
            label="Tiêu đề sổ tay cưới"
            value={coupleTitle}
            onChange={(e) => setCoupleTitle(e.target.value)}
          />
          <Input
            name="weddingDate"
            label="Ngày cử hành hôn lễ dự kiến"
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
          />
        </div>

        <div className="planner-main-grid">
          {/* Cột Trái: Timeline Checklist 5 Cột Mốc */}
          <section className="planner-checklist-col">
            <div className="col-box-header">
              <h2>1. Lộ Trình Chuẩn Bị Qua 5 Cột Mốc</h2>
            </div>

            <form onSubmit={handleAddTask} className="add-task-form no-print">
              <div className="add-task-inputs">
                <Input
                  name="newTaskTitle"
                  label="Thêm đầu việc mới"
                  placeholder="VD: Đặt xe hoa cổ điển đưa đón dâu..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="milestone-select-wrap">
                  <label htmlFor="select-milestone" className="input-label">
                    Cột mốc thời gian
                  </label>
                  <select
                    id="select-milestone"
                    name="milestone"
                    className="input-control select-control"
                    value={newTaskMilestone}
                    aria-invalid={false}
                    aria-describedby="desc-milestone"
                    onChange={(e) =>
                      setNewTaskMilestone(e.target.value as MilestoneId)
                    }
                  >
                    {MILESTONES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <span id="desc-milestone" className="sr-only">
                    Chọn giai đoạn thực hiện đầu việc
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                leftIcon={<Icon name="plus" size={15} />}
              >
                Bổ Sung Đầu Việc
              </Button>
            </form>

            <div className="milestones-stack">
              {MILESTONES.map((ms) => {
                const groupTasks = tasks.filter((t) => t.milestone === ms.id);
                return (
                  <div key={ms.id} className="milestone-card">
                    <div className="milestone-head">
                      <div>
                        <h3>{ms.label}</h3>
                        <span>{ms.subtitle}</span>
                      </div>
                      <span className="ms-count">
                        {groupTasks.filter((g) => g.done).length}/{groupTasks.length}
                      </span>
                    </div>

                    <ul className="ms-task-list">
                      {groupTasks.map((task) => (
                        <li
                          key={task.id}
                          className={`ms-task-item ${task.done ? "done" : ""}`}
                        >
                          <label className="ms-checkbox-label">
                            <input
                              id={`chk-${task.id}`}
                              name={`chk-${task.id}`}
                              type="checkbox"
                              checked={task.done}
                              aria-invalid={false}
                              aria-describedby={`lbl-${task.id}`}
                              onChange={() => toggleTask(task.id)}
                            />
                            <span id={`lbl-${task.id}`}>{task.title}</span>
                          </label>
                          <button
                            type="button"
                            className="ms-delete-btn no-print"
                            onClick={() => removeTask(task.id)}
                            aria-label={`Xóa công việc ${task.title}`}
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cột Phải: Bảng Dự Toán & Pure SVG Donut Chart */}
          <aside className="planner-budget-col">
            <div className="col-box-header">
              <h2>2. Phân Bổ Ngân Sách Hôn Lễ</h2>
            </div>

            <div className="donut-chart-card">
              <svg
                viewBox="0 0 180 180"
                className="planner-donut-svg"
                role="img"
                aria-label="Biểu đồ tròn phân bổ ngân sách đám cưới"
              >
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="var(--border-color)"
                  strokeWidth="22"
                />
                {totalActual > 0 &&
                  budgets.map((b) => {
                    const frac = b.actual / totalActual;
                    const dash = frac * circumference;
                    const offset = -cumulativeFraction * circumference;
                    cumulativeFraction += frac;
                    return (
                      <circle
                        key={b.id}
                        cx="90"
                        cy="90"
                        r={radius}
                        fill="none"
                        stroke={b.color}
                        strokeWidth="22"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={offset}
                        transform="rotate(-90 90 90)"
                      />
                    );
                  })}
                <text
                  x="90"
                  y="86"
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--text-muted)"
                  fontWeight="700"
                >
                  THỰC CHI
                </text>
                <text
                  x="90"
                  y="104"
                  textAnchor="middle"
                  fontSize="12.5"
                  fill="var(--text-main)"
                  fontWeight="800"
                >
                  {Math.round(totalActual / 1000000)} Triệu
                </text>
              </svg>

              <div className="donut-legend">
                {budgets.map((b) => {
                  const pct =
                    totalActual > 0
                      ? Math.round((b.actual / totalActual) * 100)
                      : 0;
                  return (
                    <div key={b.id} className="donut-legend-item">
                      <span
                        className="legend-color-swatch"
                        style={{ backgroundColor: b.color }}
                      />
                      <span className="legend-cat-name">{b.category}</span>
                      <strong>{pct}%</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="budget-rows-list">
              {budgets.map((row) => (
                <div key={row.id} className="budget-edit-card">
                  <div className="budget-card-title">
                    <span
                      className="legend-color-swatch"
                      style={{ backgroundColor: row.color }}
                    />
                    <strong>{row.category}</strong>
                  </div>

                  <div className="budget-inputs-duo">
                    <div>
                      <label
                        htmlFor={`plan-${row.id}`}
                        className="budget-mini-label"
                      >
                        Dự toán (VNĐ)
                      </label>
                      <input
                        id={`plan-${row.id}`}
                        name={`plan-${row.id}`}
                        type="number"
                        step={500000}
                        min={0}
                        className="input-control"
                        value={row.planned}
                        aria-invalid={false}
                        aria-describedby={`desc-plan-${row.id}`}
                        onChange={(e) =>
                          updateBudgetAmount(
                            row.id,
                            "planned",
                            Number(e.target.value)
                          )
                        }
                      />
                      <span id={`desc-plan-${row.id}`} className="sr-only">
                        Ngân sách dự kiến cho {row.category}
                      </span>
                    </div>

                    <div>
                      <label
                        htmlFor={`act-${row.id}`}
                        className="budget-mini-label"
                      >
                        Thực tế (VNĐ)
                      </label>
                      <input
                        id={`act-${row.id}`}
                        name={`act-${row.id}`}
                        type="number"
                        step={500000}
                        min={0}
                        className="input-control"
                        value={row.actual}
                        aria-invalid={false}
                        aria-describedby={`desc-act-${row.id}`}
                        onChange={(e) =>
                          updateBudgetAmount(
                            row.id,
                            "actual",
                            Number(e.target.value)
                          )
                        }
                      />
                      <span id={`desc-act-${row.id}`} className="sr-only">
                        Chi phí thực tế cho {row.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
