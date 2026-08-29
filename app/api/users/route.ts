import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { DEFAULT_USERS } from "@/lib/usersData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const branchId = searchParams.get("branchId");

    const db = await getDatabase();
    const collection = db.collection("users");

    const query: any = {};
    if (role && role !== "all") query.role = role;
    if (branchId && branchId !== "all") query.branchId = branchId;

    let users = await collection.find(query).sort({ createdDate: -1 }).toArray();

    if (users.length === 0 && Object.keys(query).length === 0) {
      for (const u of DEFAULT_USERS) {
        await collection.updateOne({ username: u.username }, { $set: u }, { upsert: true });
      }
      users = await collection.find({}).toArray();
    }

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    console.error("❌ MongoDB GET users error:", error);
    return NextResponse.json({ success: false, users: DEFAULT_USERS, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUsername = body.username || body.phone || "";
    const cleanUsername = String(rawUsername).trim();

    if (!cleanUsername) {
      return NextResponse.json({ success: false, message: "Tên đăng nhập hoặc Số điện thoại là bắt buộc!" }, { status: 400 });
    }

    const newUser = {
      id: body.id || "u_" + Date.now(),
      username: cleanUsername,
      fullName: (body.fullName || "").trim(),
      phone: (body.phone || cleanUsername).trim(),
      email: (body.email || "").trim(),
      class: body.class || body.className || "Python Nâng Cao",
      password: (body.password || "123456").trim(),
      role: body.role || "student",
      branchId: body.branchId || "branch_thuduc",
      branchName: body.branchName || "Chi Nhánh TP. Thủ Đức",
      pin: body.pin?.trim() || (body.role === "admin" || body.role === "branch_manager" || body.role === "teacher" ? "8888" : undefined),
      status: body.status || "active",
      enrolledSubjects: body.enrolledSubjects || ["python"],
      totalStudySeconds: body.totalStudySeconds || 0,
      createdDate: body.createdDate || new Date().toISOString().split("T")[0]
    };

    const db = await getDatabase();
    const collection = db.collection("users");
    const result = await collection.updateOne(
      { $or: [{ username: newUser.username }, { id: newUser.id }] },
      { $set: newUser },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      user: newUser, 
      message: `Đã lưu tài khoản ${newUser.username} (${newUser.fullName}) trực tiếp vào MongoDB Atlas!` 
    });
  } catch (error: any) {
    console.error("❌ MongoDB User POST Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi kết nối MongoDB Atlas: " + error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, username } = body;

    if (!id && !username) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc Username người dùng" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("users");

    const filter: any = id ? { id } : { username };
    const updateDoc: any = {};

    if (body.fullName) updateDoc.fullName = body.fullName.trim();
    if (body.phone !== undefined) updateDoc.phone = body.phone.trim();
    if (body.class || body.className) updateDoc.class = (body.class || body.className).trim();
    if (body.password) updateDoc.password = body.password.trim();
    if (body.role) updateDoc.role = body.role;
    if (body.pin) updateDoc.pin = body.pin.trim();
    if (body.branchId) updateDoc.branchId = body.branchId;
    if (body.branchName) updateDoc.branchName = body.branchName;
    if (body.email !== undefined) updateDoc.email = body.email.trim();
    if (body.status) updateDoc.status = body.status;
    if (body.enrolledSubjects) updateDoc.enrolledSubjects = body.enrolledSubjects;
    if (body.totalStudySeconds !== undefined) updateDoc.totalStudySeconds = body.totalStudySeconds;

    const result = await collection.updateOne(filter, { $set: updateDoc });
    return NextResponse.json({ success: true, message: "Cập nhật tài khoản vào MongoDB Atlas thành công!" });
  } catch (error: any) {
    console.error("❌ MongoDB User PUT Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật MongoDB: " + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    if (!id && !username) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc Username" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("users");
    const filter = id ? { id } : { username };
    await collection.deleteOne(filter);

    return NextResponse.json({ success: true, message: "Đã xóa người dùng khỏi MongoDB Atlas!" });
  } catch (error: any) {
    console.error("❌ MongoDB User DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi xóa user MongoDB: " + error.message }, { status: 500 });
  }
}
