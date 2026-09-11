import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { DEFAULT_USERS, generateDefaultStudentPassword } from "@/lib/usersData";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUsername = String(body.username || "").trim();
    const password = String(body.password || "").trim();

    if (!rawUsername) {
      return NextResponse.json({ success: false, message: "Vui lòng nhập tên đăng nhập hoặc số điện thoại!" }, { status: 400 });
    }

    const lowerUsername = rawUsername.toLowerCase();
    const cleanPhone = rawUsername.replace(/\D/g, "");

    let foundUser: any = null;

    try {
      const db = await getDatabase();
      const collection = db.collection("users");
      foundUser = await collection.findOne({
        $or: [
          { username: rawUsername },
          { username: lowerUsername },
          { phone: rawUsername },
          { phone: cleanPhone }
        ]
      });
    } catch (dbErr) {
      console.warn("DB connection warning during login, falling back to system registry:", dbErr);
    }

    if (!foundUser) {
      foundUser = DEFAULT_USERS.find(u => 
        (u.username && (u.username.toLowerCase() === lowerUsername || u.username === rawUsername)) ||
        (u.phone && (u.phone === rawUsername || u.phone.replace(/\D/g, "") === cleanPhone))
      );
    }

    if (!foundUser) {
      return NextResponse.json({ success: false, message: "Tài khoản không tồn tại trên hệ thống!" }, { status: 404 });
    }

    if (foundUser.status === "locked") {
      return NextResponse.json({ success: false, message: "Tài khoản đang bị tạm khóa. Vui lòng liên hệ Quản lý!" }, { status: 403 });
    }

    let isValid = false;

    // 1. Khớp password đã lưu
    if (foundUser.password && (foundUser.password === password || foundUser.password.toLowerCase() === password.toLowerCase())) {
      isValid = true;
    }

    // 2. Học viên: Tên + SĐT
    if (!isValid && foundUser.role === "student") {
      const expectedPass = generateDefaultStudentPassword(foundUser.fullName || "", foundUser.phone || foundUser.username || "");
      if (password === expectedPass || password.toLowerCase() === expectedPass.toLowerCase()) {
        isValid = true;
      }
      const parts = (foundUser.fullName || "").trim().split(/\s+/);
      const rawFirst = parts[parts.length - 1] || "";
      const sPhone = (foundUser.phone || foundUser.username || "").replace(/\D/g, "");
      if (sPhone && `${rawFirst}${sPhone}`.toLowerCase() === password.toLowerCase()) {
        isValid = true;
      }
      if (sPhone && password === sPhone) {
        isValid = true;
      }
    }

    // 3. Mật khẩu chuẩn mặc định
    if (!isValid && (password === "saoviet@2026" || password === "123456" || password === "saoviet2026")) {
      isValid = true;
    }

    // 4. Admin
    if (!isValid && foundUser.role === "admin" && (password === "saoviet@admin2026" || password === "admin")) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Mật khẩu không chính xác!" }, { status: 401 });
    }

    // Cập nhật lastLogin
    const now = Date.now();
    const nowDate = new Date(now);
    const loginDate = nowDate.toLocaleDateString("vi-VN");
    const loginTime = nowDate.toLocaleTimeString("vi-VN");

    try {
      const db = await getDatabase();
      await db.collection("users").updateOne(
        { id: foundUser.id },
        { $set: { lastLoginDate: loginDate, lastLoginTime: loginTime } }
      );
    } catch {}

    const { password: _p, pin: _pin, ...safeUser } = foundUser;
    safeUser.lastLoginDate = loginDate;
    safeUser.lastLoginTime = loginTime;

    return NextResponse.json({
      success: true,
      user: safeUser,
      token: `sv_auth_${safeUser.id}_${now}`
    });
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json({ success: false, message: "Lỗi hệ thống: " + error.message }, { status: 500 });
  }
}
