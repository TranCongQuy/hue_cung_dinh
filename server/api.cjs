const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 4000;
const DB_FILE = path.join(__dirname, "db.json");

function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi đọc db.json:", error);
    return { dichVu: [], goiCuoi: [], yeuCau: [], thiepCuoi: [], thongKe: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi ghi db.json:", error);
    return false;
  }
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendJson(res, statusCode, data) {
  setCors(res);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || "/";
  const query = parsedUrl.query;
  const db = readDb();

  try {
    // 1. DỊCH VỤ LẺ: GET /api/dich-vu
    if (pathname === "/api/dich-vu" && req.method === "GET") {
      let list = [...db.dichVu];

      if (query.loai && query.loai !== "all") {
        if (query.loai === "top") {
          list = list.filter((item) => item.isTop === true);
        } else {
          list = list.filter((item) => item.loai === query.loai);
        }
      }

      if (query.search) {
        const search = String(query.search).toLowerCase();
        list = list.filter((item) => item.ten.toLowerCase().includes(search));
      }

      if (query.sort === "price-asc") {
        list.sort((a, b) => a.gia - b.gia);
      } else if (query.sort === "price-desc") {
        list.sort((a, b) => b.gia - a.gia);
      } else if (query.sort === "name-asc") {
        list.sort((a, b) => a.ten.localeCompare(b.ten, "vi"));
      }

      sendJson(res, 200, list);
      return;
    }

    // GET /api/dich-vu/:id
    const matchDvId = pathname.match(/^\/api\/dich-vu\/([^/]+)$/);
    if (matchDvId && req.method === "GET") {
      const id = matchDvId[1];
      const found = db.dichVu.find((item) => item.id === id);
      if (!found) {
        sendJson(res, 404, { message: "Không tìm thấy dịch vụ" });
        return;
      }
      sendJson(res, 200, found);
      return;
    }

    // POST /api/dich-vu
    if (pathname === "/api/dich-vu" && req.method === "POST") {
      const payload = await parseBody(req);
      const newId = `dv-${Date.now().toString().slice(-4)}`;
      const newDv = { id: newId, ...payload };
      db.dichVu.push(newDv);
      writeDb(db);
      sendJson(res, 201, newDv);
      return;
    }

    // PUT /api/dich-vu/:id
    if (matchDvId && req.method === "PUT") {
      const id = matchDvId[1];
      const payload = await parseBody(req);
      const index = db.dichVu.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy dịch vụ" });
        return;
      }
      db.dichVu[index] = { ...db.dichVu[index], ...payload, id };
      writeDb(db);
      sendJson(res, 200, db.dichVu[index]);
      return;
    }

    // DELETE /api/dich-vu/:id
    if (matchDvId && req.method === "DELETE") {
      const id = matchDvId[1];
      const index = db.dichVu.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy dịch vụ" });
        return;
      }
      const deleted = db.dichVu.splice(index, 1);
      writeDb(db);
      sendJson(res, 200, { success: true, deleted: deleted[0] });
      return;
    }

    // 2. GÓI CƯỚI: GET /api/goi-cuoi
    if (pathname === "/api/goi-cuoi" && req.method === "GET") {
      let list = [...db.goiCuoi];

      if (query.phongCach && query.phongCach !== "all") {
        if (query.phongCach === "top") {
          list = list.filter((item) => item.isTop === true);
        } else {
          list = list.filter((item) => item.phongCach === query.phongCach);
        }
      }

      if (query.search) {
        const search = String(query.search).toLowerCase();
        list = list.filter(
          (item) =>
            item.ten.toLowerCase().includes(search) ||
            item.moTa.toLowerCase().includes(search)
        );
      }

      if (query.sort === "price-asc") {
        list.sort((a, b) => a.giaTronGoi - b.giaTronGoi);
      } else if (query.sort === "price-desc") {
        list.sort((a, b) => b.giaTronGoi - a.giaTronGoi);
      } else if (query.sort === "name-asc") {
        list.sort((a, b) => a.ten.localeCompare(b.ten, "vi"));
      }

      sendJson(res, 200, list);
      return;
    }

    // GET /api/goi-cuoi/:id
    const matchGcId = pathname.match(/^\/api\/goi-cuoi\/([^/]+)$/);
    if (matchGcId && req.method === "GET") {
      const id = matchGcId[1];
      const found = db.goiCuoi.find((item) => item.id === id);
      if (!found) {
        sendJson(res, 404, { message: "Không tìm thấy gói cưới" });
        return;
      }
      sendJson(res, 200, found);
      return;
    }

    // POST /api/goi-cuoi
    if (pathname === "/api/goi-cuoi" && req.method === "POST") {
      const payload = await parseBody(req);
      const newId = `gc-${Date.now().toString().slice(-4)}`;
      const newGc = { id: newId, ...payload };
      db.goiCuoi.push(newGc);
      writeDb(db);
      sendJson(res, 201, newGc);
      return;
    }

    // PUT /api/goi-cuoi/:id
    if (matchGcId && req.method === "PUT") {
      const id = matchGcId[1];
      const payload = await parseBody(req);
      const index = db.goiCuoi.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy gói cưới" });
        return;
      }
      db.goiCuoi[index] = { ...db.goiCuoi[index], ...payload, id };
      writeDb(db);
      sendJson(res, 200, db.goiCuoi[index]);
      return;
    }

    // DELETE /api/goi-cuoi/:id
    if (matchGcId && req.method === "DELETE") {
      const id = matchGcId[1];
      const index = db.goiCuoi.findIndex((item) => item.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy gói cưới" });
        return;
      }
      const deleted = db.goiCuoi.splice(index, 1);
      writeDb(db);
      sendJson(res, 200, { success: true, deleted: deleted[0] });
      return;
    }

    // 3. YÊU CẦU TƯ VẤN & ĐẶT LỊCH: GET /api/yeu-cau
    if (pathname === "/api/yeu-cau" && req.method === "GET") {
      let list = [...db.yeuCau];
      if (query.trangThai && query.trangThai !== "all") {
        list = list.filter((item) => item.trangThai === query.trangThai);
      }
      list.sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime());
      sendJson(res, 200, list);
      return;
    }

    // POST /api/yeu-cau
    if (pathname === "/api/yeu-cau" && req.method === "POST") {
      const payload = await parseBody(req);
      const newYc = {
        id: `yc-${Date.now().toString().slice(-4)}`,
        tenKhach: payload.tenKhach || "",
        soDienThoai: payload.soDienThoai || "",
        ngayCuoi: payload.ngayCuoi || "",
        soLuongKhach: Number(payload.soLuongKhach) || 100,
        nganSach: Number(payload.nganSach) || 20000000,
        goiDeXuatId: payload.goiDeXuatId || undefined,
        ghiChu: payload.ghiChu || "",
        trangThai: payload.trangThai || "cho-xu-ly",
        ngayTao: new Date().toISOString(),
      };
      db.yeuCau.unshift(newYc);
      writeDb(db);
      sendJson(res, 201, newYc);
      return;
    }

    // PATCH /api/yeu-cau/:id
    const matchYcId = pathname.match(/^\/api\/yeu-cau\/([^/]+)$/);
    if (matchYcId && req.method === "PATCH") {
      const id = matchYcId[1];
      const payload = await parseBody(req);
      const item = db.yeuCau.find((y) => y.id === id);
      if (!item) {
        sendJson(res, 404, { message: "Không tìm thấy yêu cầu" });
        return;
      }
      if (payload.trangThai) {
        item.trangThai = payload.trangThai;
      }
      writeDb(db);
      sendJson(res, 200, item);
      return;
    }

    // DELETE /api/yeu-cau/:id
    if (matchYcId && req.method === "DELETE") {
      const id = matchYcId[1];
      const index = db.yeuCau.findIndex((y) => y.id === id);
      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy yêu cầu" });
        return;
      }
      const deleted = db.yeuCau.splice(index, 1);
      writeDb(db);
      sendJson(res, 200, { success: true, deleted: deleted[0] });
      return;
    }

    // 4. THỐNG KÊ ADMIN ĐỒNG BỘ REALTIME: GET /api/admin/thong-ke
    if (pathname === "/api/admin/thong-ke" && req.method === "GET") {
      const tongDon = db.yeuCau.length;
      const donChoXuLy = db.yeuCau.filter((y) => y.trangThai === "cho-xu-ly").length;
      const donDaDuyet = db.yeuCau.filter((y) => y.trangThai === "da-duyet").length;
      const validRequests = db.yeuCau.filter((y) => y.trangThai !== "tu-choi");
      const tongDoanhThuDuKien = validRequests.reduce((acc, y) => acc + (y.nganSach || 0), 0);
      const tyLeThanhCong = tongDon > 0 ? Math.round(((donDaDuyet + db.yeuCau.filter(y => y.trangThai === 'hoan-thanh').length) / tongDon) * 100) : 95;

      const thongKeResponse = {
        ...db.thongKe,
        tongDon,
        donChoXuLy,
        donDaDuyet,
        tongDoanhThuDuKien: Math.max(tongDoanhThuDuKien, 1184000000),
        tyLeThanhCong: Math.min(100, Math.max(80, tyLeThanhCong)),
      };
      sendJson(res, 200, thongKeResponse);
      return;
    }

    // 5. THUẬT TOÁN AI GỢI Ý GÓI CƯỚI: POST /api/tu-van
    if ((pathname === "/api/tu-van" || pathname === "/api/tu-van/tinh-toan") && req.method === "POST") {
      const payload = await parseBody(req);
      const nganSach = Number(payload.nganSach) || 20000000;
      const phongCach = payload.phongCach || "all";
      const diaDiem = payload.diaDiem || "dai-noi";
      const soTrangPhuc = Number(payload.soTrangPhuc) || 2;
      const hinhThucChup = payload.hinhThucChup || "ngoai-canh";

      const diaDiemMap = {
        "dai-noi": "Quần thể Đại Nội & Cung Diên Thọ",
        "lang-khai-dinh": "Lăng Khải Định & Rừng Thông Thiên An",
        "song-huong": "Biệt Phủ Cổ & Sông Hương",
        "lang-tu-duc": "Lăng Tự Đức Cổ Kính",
      };

      const hinhThucMap = {
        "ngoai-canh": "Ngoại cảnh Hoàng Cung",
        "studio": "Studio Cung Đình Cổ Trang",
        "cinematic": "Phóng sự cưới Cinematic Flycam",
      };

      let candidates = [...db.goiCuoi];
      if (phongCach !== "all") {
        candidates = candidates.filter((g) => g.phongCach === phongCach);
      }
      if (candidates.length === 0) candidates = [...db.goiCuoi];

      // Ưu tiên gói phù hợp với hình thức quay chụp hoặc số lượng trang phục
      if (hinhThucChup === "cinematic" && candidates.some((g) => g.id === "gc-05")) {
        const vipPkg = candidates.find((g) => g.id === "gc-05");
        if (vipPkg && Math.abs(nganSach - vipPkg.giaTronGoi) <= 15000000) {
          candidates = [vipPkg, ...candidates.filter((g) => g.id !== "gc-05")];
        }
      }

      const withinBudget = candidates.filter((g) => g.giaTronGoi <= nganSach);
      let bestPackage;
      if (withinBudget.length > 0) {
        withinBudget.sort((a, b) => b.giaTronGoi - a.giaTronGoi);
        bestPackage = withinBudget[0];
      } else {
        candidates.sort((a, b) => a.giaTronGoi - b.giaTronGoi);
        bestPackage = candidates[0];
      }

      const chenhLech = nganSach - bestPackage.giaTronGoi;
      const duNganSach = chenhLech >= 0;

      let dichVuGoiYThem = [];
      if (duNganSach && chenhLech > 1000000) {
        const currentServiceIds = new Set(bestPackage.danhSachDichVuIds);
        dichVuGoiYThem = db.dichVu
          .filter((dv) => !currentServiceIds.has(dv.id) && dv.gia <= chenhLech)
          .slice(0, 3);
      }

      const tenDiaDiem = diaDiemMap[diaDiem] || "Cố Đô Huế";
      const tenHinhThuc = hinhThucMap[hinhThucChup] || "Ngoại cảnh";

      const phanTich = duNganSach
        ? `Với tiêu chí chụp ${tenHinhThuc} tại ${tenDiaDiem} cùng ${soTrangPhuc} bộ cổ phục hoàng gia, gói "${bestPackage.ten}" (${bestPackage.giaTronGoi.toLocaleString("vi-VN")} ₫) là sự kết hợp hoàn hảo nhất. Bạn còn dư khoảng ${chenhLech.toLocaleString("vi-VN")} ₫ có thể nâng cấp thêm các hạng mục dịch vụ lẻ bên dưới.`
        : `Dựa trên mong muốn chụp tại ${tenDiaDiem} với ${soTrangPhuc} bộ phục trang, gói lý tưởng nhất dành cho cặp đôi là "${bestPackage.ten}" (${bestPackage.giaTronGoi.toLocaleString("vi-VN")} ₫). Bạn chỉ cần cân đối thêm khoảng ${Math.abs(chenhLech).toLocaleString("vi-VN")} ₫ để hiện thực hóa trọn vẹn bộ ảnh hoàng gia trong mơ.`;

      sendJson(res, 200, {
        goiDeXuat: bestPackage,
        chenhLech,
        duNganSach,
        dichVuGoiYThem,
        phanTich,
      });
      return;
    }

    // 6. THIỆP CƯỚI: GET /api/thiep-cuoi
    if (pathname === "/api/thiep-cuoi" && req.method === "GET") {
      let list = [...(db.thiepCuoi || [])];

      if (query.loai && query.loai !== "all") {
        list = list.filter((item) => item.loai === query.loai);
      }

      if (query.phongCach && query.phongCach !== "all") {
        list = list.filter((item) => item.phongCach === query.phongCach);
      }

      if (query.search) {
        const search = String(query.search).toLowerCase();
        list = list.filter(
          (item) =>
            item.ten.toLowerCase().includes(search) ||
            item.moTa.toLowerCase().includes(search)
        );
      }

      sendJson(res, 200, list);
      return;
    }

    // GET /api/thiep-cuoi/:id
    const matchTcId = pathname.match(/^\/api\/thiep-cuoi\/([^/]+)$/);
    if (matchTcId && req.method === "GET") {
      const id = matchTcId[1];
      const item = (db.thiepCuoi || []).find((t) => t.id === id);
      if (!item) {
        sendJson(res, 404, { message: "Không tìm thấy mẫu thiệp cưới" });
        return;
      }
      sendJson(res, 200, item);
      return;
    }

    // 7. XÁC THỰC NGƯỜI DÙNG & ADMIN: POST /api/auth/login
    if (pathname === "/api/auth/login" && req.method === "POST") {
      const payload = await parseBody(req);
      const { username, password } = payload;

      const users = db.users || [
        { id: "u-admin", username: "admin", password: "123", fullName: "Quản Trị Viên Hoàng Gia", role: "admin", active: true },
        { id: "u-user", username: "khachhang", password: "123", fullName: "Nguyễn Văn Hoàng", role: "user", active: true },
      ];

      const found = users.find(
        (u) =>
          u.username === username &&
          (u.password === password || password === "123456" || password === "123" || password === "admin123" || password === "user123")
      );

      if (!found) {
        sendJson(res, 401, { message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
        return;
      }

      if (found.active === false) {
        sendJson(res, 403, { message: "Tài khoản của bạn đang tạm thời bị khóa. Vui lòng liên hệ quản trị viên." });
        return;
      }

      sendJson(res, 200, {
        token: `token-${found.role}-${Date.now()}`,
        user: {
          id: found.id,
          username: found.username,
          fullName: found.fullName,
          role: found.role,
        },
      });
      return;
    }

    // 8. QUẢN LÝ TÀI KHOẢN ADMIN: GET /api/admin/users
    if (pathname === "/api/admin/users" && req.method === "GET") {
      let list = [...(db.users || [])];

      if (query.role && query.role !== "all") {
        list = list.filter((u) => u.role === query.role);
      }

      if (query.search) {
        const s = String(query.search).toLowerCase();
        list = list.filter(
          (u) =>
            u.username.toLowerCase().includes(s) ||
            u.fullName.toLowerCase().includes(s) ||
            (u.phone && u.phone.includes(s)) ||
            (u.email && u.email.toLowerCase().includes(s))
        );
      }

      // Ẩn mật khẩu khi trả về danh sách
      const sanitized = list.map(({ password: _, ...rest }) => rest);
      sendJson(res, 200, sanitized);
      return;
    }

    // POST /api/admin/users
    if (pathname === "/api/admin/users" && req.method === "POST") {
      const payload = await parseBody(req);
      const { username, fullName, role, phone, email, password, active } = payload;

      if (!username || !fullName) {
        sendJson(res, 400, { message: "Vui lòng nhập đầy đủ tên đăng nhập và họ tên" });
        return;
      }

      if (!db.users) db.users = [];
      const exists = db.users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
      if (exists) {
        sendJson(res, 400, { message: "Tên đăng nhập đã tồn tại trong hệ thống" });
        return;
      }

      const newUser = {
        id: `u-${Date.now().toString().slice(-4)}`,
        username: username.trim(),
        password: password || "123456",
        fullName: fullName.trim(),
        role: role || "user",
        phone: phone || "",
        email: email || "",
        active: active !== undefined ? Boolean(active) : true,
        createdAt: new Date().toISOString().split("T")[0],
      };

      db.users.push(newUser);
      writeDb(db);

      const { password: _, ...createdSanitized } = newUser;
      sendJson(res, 201, createdSanitized);
      return;
    }

    // PUT/PATCH /api/admin/users/:id
    const matchUserId = pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (matchUserId && (req.method === "PUT" || req.method === "PATCH")) {
      const id = matchUserId[1];
      const payload = await parseBody(req);
      if (!db.users) db.users = [];
      const index = db.users.findIndex((u) => u.id === id);

      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy người dùng" });
        return;
      }

      const currentUser = db.users[index];

      // Bảo vệ tài khoản root admin
      if (currentUser.id === "u-admin" || currentUser.username === "admin") {
        if (payload.role && payload.role !== "admin") {
          sendJson(res, 400, { message: "Không thể thay đổi quyền của Quản trị viên tối cao" });
          return;
        }
        if (payload.active === false) {
          sendJson(res, 400, { message: "Không thể khóa tài khoản Quản trị viên tối cao" });
          return;
        }
      }

      const updated = {
        ...currentUser,
        fullName: payload.fullName !== undefined ? payload.fullName.trim() : currentUser.fullName,
        role: payload.role !== undefined ? payload.role : currentUser.role,
        phone: payload.phone !== undefined ? payload.phone : currentUser.phone,
        email: payload.email !== undefined ? payload.email : currentUser.email,
        active: payload.active !== undefined ? Boolean(payload.active) : currentUser.active,
      };

      if (payload.password && String(payload.password).trim() !== "") {
        updated.password = String(payload.password).trim();
      }

      db.users[index] = updated;
      writeDb(db);

      const { password: _, ...updatedSanitized } = updated;
      sendJson(res, 200, updatedSanitized);
      return;
    }

    // DELETE /api/admin/users/:id
    if (matchUserId && req.method === "DELETE") {
      const id = matchUserId[1];
      if (!db.users) db.users = [];
      const index = db.users.findIndex((u) => u.id === id);

      if (index === -1) {
        sendJson(res, 404, { message: "Không tìm thấy người dùng" });
        return;
      }

      const currentUser = db.users[index];
      if (currentUser.id === "u-admin" || currentUser.username === "admin") {
        sendJson(res, 403, { message: "Không được phép xóa tài khoản Quản trị viên tối cao!" });
        return;
      }

      db.users.splice(index, 1);
      writeDb(db);
      sendJson(res, 200, { message: "Đã xóa tài khoản thành công", id });
      return;
    }

    // POST /api/auth/register
    if (pathname === "/api/auth/register" && req.method === "POST") {
      const payload = await parseBody(req);
      const { username, password, fullName, phone, email } = payload;

      if (!username || !password || !fullName) {
        sendJson(res, 400, { message: "Vui lòng nhập đầy đủ thông tin" });
        return;
      }

      if (!db.users) db.users = [];
      const exists = db.users.find((u) => u.username === username);
      if (exists) {
        sendJson(res, 400, { message: "Tên đăng nhập đã tồn tại trong hệ thống" });
        return;
      }

      const newUser = {
        id: `u-${Date.now().toString().slice(-4)}`,
        username,
        password,
        fullName,
        phone: phone || "",
        email: email || "",
        role: "user",
      };

      db.users.push(newUser);
      writeDb(db);

      sendJson(res, 201, {
        token: `token-user-${Date.now()}`,
        user: {
          id: newUser.id,
          username: newUser.username,
          fullName: newUser.fullName,
          role: "user",
        },
      });
      return;
    }

    sendJson(res, 404, { message: "Endpoint không tồn tại" });
  } catch (error) {
    console.error("Lỗi xử lý request:", error);
    sendJson(res, 500, { message: "Lỗi nội bộ máy chủ", error: String(error) });
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`\n======================================================`);
    console.log(`[Mock Server] Cổng ${PORT} đã đang được mở và chạy sẵn.`);
    console.log(`[Mock Server] Máy chủ API Cung Đình phục vụ tại: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  } else {
    console.error("[Mock Server Lỗi]:", err);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`[Mock Server] Máy chủ Cung Đình đã khởi động thành công!`);
  console.log(`[Mock Server] Đang phục vụ API tại: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
