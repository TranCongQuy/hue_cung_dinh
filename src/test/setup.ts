import "@testing-library/jest-dom";
import { vi } from "vitest";

// Giải quyết xung đột giữa JSDOM và Node 24 Undici Request/AbortSignal
const NativeRequest = globalThis.Request;
class SafeTestRequest extends NativeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    const cleanInit = init ? { ...init } : undefined;
    if (cleanInit && "signal" in cleanInit) {
      delete cleanInit.signal;
    }
    super(input, cleanInit);
  }
}

globalThis.Request = SafeTestRequest;

// Mock fetch an toàn cho môi trường test
globalThis.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve([]),
  })
);
