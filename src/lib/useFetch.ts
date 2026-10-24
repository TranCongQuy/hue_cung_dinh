import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { AsyncState } from "./types";
import { SupabaseService } from "./supabaseAdapter";

// Helper trích xuất và điều phối dữ liệu từ Adapter dựa trên URL
async function resolveEndpointData(cleanUrl: string): Promise<unknown> {
  // 1. Chi tiết từng mục đơn lẻ (Single item)
  const matchSingleDichVu = cleanUrl.match(/^\/api\/dich-vu\/([^/?]+)/);
  if (matchSingleDichVu) {
    const id = matchSingleDichVu[1];
    const services = await SupabaseService.getServices();
    return services.find((s) => s.id === id) || null;
  }

  const matchSingleGoiCuoi = cleanUrl.match(/^\/api\/goi-cuoi\/([^/?]+)/);
  if (matchSingleGoiCuoi) {
    const id = matchSingleGoiCuoi[1];
    const packages = await SupabaseService.getPackages();
    return packages.find((p) => p.id === id) || null;
  }

  const matchSingleThiepCuoi = cleanUrl.match(/^\/api\/thiep-cuoi\/([^/?]+)/);
  if (matchSingleThiepCuoi) {
    const id = matchSingleThiepCuoi[1];
    const invitations = await SupabaseService.getInvitations();
    return invitations.find((i) => i.id === id) || null;
  }

  const matchSingleYeuCau = cleanUrl.match(/^\/api\/yeu-cau\/([^/?]+)/);
  if (matchSingleYeuCau) {
    const id = matchSingleYeuCau[1];
    const requests = await SupabaseService.getRequests();
    return requests.find((r) => r.id === id) || null;
  }

  // 2. Danh sách tổng hợp & Thống kê KPI
  if (cleanUrl === "/api/admin/thong-ke") {
    return await SupabaseService.getAdminStats();
  }
  if (cleanUrl.startsWith("/api/yeu-cau")) {
    const matchFilter = cleanUrl.match(/[?&]trangThai=([^&]+)/);
    const filter = matchFilter ? matchFilter[1] : undefined;
    return await SupabaseService.getRequests(filter);
  }
  if (cleanUrl.startsWith("/api/dich-vu")) {
    return await SupabaseService.getServices();
  }
  if (cleanUrl.startsWith("/api/goi-cuoi")) {
    return await SupabaseService.getPackages();
  }
  if (cleanUrl.startsWith("/api/thiep-cuoi")) {
    return await SupabaseService.getInvitations();
  }
  if (cleanUrl.startsWith("/api/admin/users")) {
    return await SupabaseService.getUsers();
  }

  return null;
}

export function useFetch<T>(url: string, schema: z.ZodType<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setState({ status: "loading" });

      // Làm sạch URL: loại bỏ tiền tố domain (ví dụ http://localhost:4000)
      const cleanUrl = url.replace(/^https?:\/\/[^/]+/, "");

      // 1. Thử tải dữ liệu từ Supabase Cloud / Fallback Adapter trước
      try {
        const supabaseData = await resolveEndpointData(cleanUrl);

        if (supabaseData) {
          const parsed = schema.safeParse(supabaseData);
          if (parsed.success) {
            setState({ status: "success", data: parsed.data });
            return;
          }
        }
      } catch {
        // Tiếp tục fallback bên dưới
      }

      // 2. Fallback sang HTTP Fetch thông thường (Khi chạy Node server cục bộ)
      try {
        const response = await fetch(url, { signal });
        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();
        const isHtml = contentType.includes("text/html") || text.trim().startsWith("<");

        // Bảo vệ chống lỗi HTML trên Vercel: Nếu Vercel rewrite về index.html thì nạp an toàn từ adapter
        if (isHtml) {
          const fallbackData = await resolveEndpointData(cleanUrl);

          if (fallbackData) {
            const parsed = schema.safeParse(fallbackData);
            if (parsed.success) {
              setState({ status: "success", data: parsed.data });
              return;
            }
          }
          throw new Error("Không thể kết nối API máy chủ");
        }

        if (!response.ok) {
          throw new Error(`Yêu cầu thất bại với mã lỗi HTTP ${response.status}`);
        }

        let raw: unknown;
        try {
          raw = JSON.parse(text);
        } catch {
          throw new Error("Định dạng dữ liệu từ máy chủ không hợp lệ");
        }

        const parsed = schema.safeParse(raw);

        if (!parsed.success) {
          const errMsg = parsed.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");
          setState({
            status: "error",
            message: `Dữ liệu không khớp định dạng: ${errMsg}`,
          });
          return;
        }

        setState({ status: "success", data: parsed.data });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi tải dữ liệu";
        setState({ status: "error", message });
      }
    },
    [url, schema]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { state, refetch };
}
