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
      await collection.insertMany(DEFAULT_USERS as any);
      users = await collection.find({}).toArray();
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, users: DEFAULT_USERS, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, fullName, phone, className, password, role, pin, branchId, branchName, email, enrolledSubjects } = body;

    const db = await getDatabase();
    const collection = db.collection("users");

    const existing = await collection.findOne({ username: username.trim() });
    if (existing) {
      return NextResponse.json({ success: false, message: "Tên đăng nhập đã tồn tại trên hệ thống!" }, { status: 400 });
    }

    const newUser = {
      id: "u_" + Date.now(),
      username: username.trim(),
      fullName: fullName.trim(),
      phone: phone?.trim() || "",
      email: email?.trim() || "",
      class: className || "Python Nâng Cao",
      password: password?.trim() || "123456",
      role: role || "student",
      branchId: branchId || "branch_thuduc",
      branchName: branchName || "Chi Nhánh TP. Thủ Đức",
      pin: pin?.trim() || (role === "admin" || role === "branch_manager" || role === "teacher" ? "8888" : undefined),
      status: "active",
      enrolledSubjects: enrolledSubjects || ["python"],
      totalStudySeconds: 0,
      createdDate: new Date().toISOString().split("T")[0]
    };

    await collection.insertOne(newUser);
    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, username, fullName, phone, className, password, role, pin, branchId, branchName, email, status, enrolledSubjects } = body;

    if (!id && !username) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc Username người dùng!" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("users");

    const filter = id ? { id } : { username };
    const updateDoc: any = {};

    if (fullName) updateDoc.fullName = fullName.trim();
    if (phone !== undefined) updateDoc.phone = phone.trim();
    if (className) updateDoc.class = className.trim();
    if (password) updateDoc.password = password.trim();
    if (role) updateDoc.role = role;
    if (pin) updateDoc.pin = pin.trim();
    if (branchId) updateDoc.branchId = branchId;
    if (branchName) updateDoc.branchName = branchName;
    if (email !== undefined) updateDoc.email = email.trim();
    if (status) updateDoc.status = status;
    if (enrolledSubjects) updateDoc.enrolledSubjects = enrolledSubjects;

    await collection.updateOne(filter, { $set: updateDoc });
    return NextResponse.json({ success: true, message: "Cập nhật tài khoản thành công!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID người dùng cần xóa!" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("users");

    await collection.deleteOne({ id });
    return NextResponse.json({ success: true, message: "Đã xóa tài khoản thành công!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
