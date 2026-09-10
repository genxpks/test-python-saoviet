/**
 * Network and Timestamp Helper for Sao Viet Exam & Study System
 * Provides Client IP checking, Login Time, and Exam Timestamping
 */

export interface ClientNetworkInfo {
  ip: string;
  date: string;              // VD: "10/09/2026"
  time: string;              // VD: "11:05:20"
  formattedDateTime: string; // VD: "11:05:20 - 10/09/2026"
  userAgent: string;
}

let cachedNetworkInfo: ClientNetworkInfo | null = null;
let lastCheckTimestamp = 0;

export async function fetchClientNetworkInfo(): Promise<ClientNetworkInfo> {
  const now = new Date();
  const date = now.toLocaleDateString("vi-VN");
  const time = now.toLocaleTimeString("vi-VN");
  const formattedDateTime = `${time} - ${date}`;

  // Cache IP check for 60 seconds to avoid repetitive requests
  if (cachedNetworkInfo && (Date.now() - lastCheckTimestamp < 60000)) {
    return {
      ...cachedNetworkInfo,
      date,
      time,
      formattedDateTime
    };
  }

  let resolvedIp = "127.0.0.1";
  let userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown Browser";

  // 1. Check local Next.js API route
  try {
    const res = await fetch("/api/network-info");
    const data = await res.json();
    if (data && data.success && data.ip) {
      resolvedIp = data.ip;
      if (data.userAgent) userAgent = data.userAgent;
    }
  } catch {}

  // 2. If IP is localhost (127.0.0.1 or ::1) and we are in browser, try fast public IP lookup
  if (resolvedIp === "127.0.0.1" && typeof window !== "undefined") {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1200);
      const pubRes = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
      clearTimeout(timer);
      const pubData = await pubRes.json();
      if (pubData && pubData.ip) {
        resolvedIp = pubData.ip;
      }
    } catch {
      // Local lab environment without external internet
      resolvedIp = "127.0.0.1 (Phòng Máy Lab)";
    }
  }

  const result: ClientNetworkInfo = {
    ip: resolvedIp,
    date,
    time,
    formattedDateTime,
    userAgent
  };

  cachedNetworkInfo = result;
  lastCheckTimestamp = Date.now();
  return result;
}

export function getCurrentVNDateTime(): { date: string; time: string; full: string } {
  const now = new Date();
  const date = now.toLocaleDateString("vi-VN");
  const time = now.toLocaleTimeString("vi-VN");
  return {
    date,
    time,
    full: `${time} - ${date}`
  };
}

export function formatTimeSpent(seconds: number): string {
  if (!seconds || seconds <= 0) return "0 giây";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} giây`;
  if (s === 0) return `${m} phút`;
  return `${m} phút ${s} giây`;
}
