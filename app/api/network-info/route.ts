import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const cfIp = req.headers.get("cf-connecting-ip");
    
    let ip = cfIp || realIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || "127.0.0.1";
    
    // Normalize localhost IPv6
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    const userAgent = req.headers.get("user-agent") || "Unknown Browser";
    const now = new Date();

    return NextResponse.json({
      success: true,
      ip,
      userAgent,
      time: now.toLocaleTimeString("vi-VN"),
      date: now.toLocaleDateString("vi-VN"),
      fullTimestamp: now.toISOString(),
      isLocal: ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      ip: "127.0.0.1",
      error: error.message
    });
  }
}
