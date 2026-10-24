import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lấy biến môi trường từ Vite
const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Làm sạch URL: loại bỏ khoảng trắng, dấu gạch chéo cuối và /rest/v1 nếu người dùng lỡ dán vào
function cleanSupabaseUrl(url?: string): string {
  if (!url) return "";
  let cleaned = url.trim();
  // Loại bỏ /rest/v1 hoặc /rest/v1/
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, "");
  // Loại bỏ dấu gạch chéo cuối cùng
  cleaned = cleaned.replace(/\/+$/, "");
  return cleaned;
}

const supabaseUrl = cleanSupabaseUrl(rawUrl);
const supabaseAnonKey = rawAnonKey?.trim() || "";

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 20
);

// Khởi tạo Supabase Client an toàn (singleton)
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient("https://placeholder.supabase.co", "placeholder-key");

export interface SupabaseProfile {
  id: string;
  username: string;
  full_name: string;
  role: "admin" | "user";
  phone?: string;
  email?: string;
  active: boolean;
  created_at: string;
}

