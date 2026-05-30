// Admin API client — tiny fetch wrapper that injects the admin bearer token.
// Token is stored in localStorage under `donia.admin.token`.

const TOKEN_KEY = "donia.admin.token";
const EMAIL_KEY = "donia.admin.email";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://donia-api-production.up.railway.app";

export type ApiError = { status: number; code?: string; message: string };

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const t = window.localStorage.getItem(TOKEN_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    let body: { error?: { code?: string; message?: string } } = {};
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    const err: ApiError = {
      status: res.status,
      code: body?.error?.code,
      message: body?.error?.message ?? res.statusText ?? "Request failed",
    };
    // 401 anywhere → clear token so the SPA bounces back to /login
    if (res.status === 401 && typeof window !== "undefined") clearSession();
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, body?: unknown) => request<T>(p, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(p: string, body?: unknown) => request<T>(p, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(p: string) => request<T>(p, { method: "DELETE" }),
};

// ─── session ───
export function saveSession(token: string, email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
}

export function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(EMAIL_KEY);
}

export function hasToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(TOKEN_KEY));
}

// Format a number using the French locale (spaces as thousand separators).
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

// Format an integer that may be huge — 14287 → "14 287", 2410000 → "2,41 M".
export function compactNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(".", ",")} M`;
  if (Math.abs(n) >= 1_000) return new Intl.NumberFormat("fr-FR").format(n);
  return n.toString();
}
