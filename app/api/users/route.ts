import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { DEFAULT_USERS } from "@/lib/usersData";

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection("users");
    let users = await collection.find({}).toArray();

    // If database is empty, seed default users
    if (users.length === 0) {
      await collection.insertMany(DEFAULT_USERS as any);
      users = await collection.find({}).toArray();
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("MongoDB GET users error:", error);
    return NextResponse.json({ success: false, users: DEFAULT_USERS, error: error.message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, fullName, className, password, role } = body;

    const db = await getDatabase();
    const collection = db.collection("users");

    const existing = await collection.findOne({ username: username.trim() });
    if (existing) {
      return NextResponse.json({ success: false, message: "Tên đăng nhập đã tồn tại!" }, { status: 400 });
    }

    const newUser = {
      id: "u_" + Date.now(),
      username: username.trim(),
      fullName: fullName.trim(),
      class: className || "Python Nâng Cao",
      password: password?.trim() || "123456",
      role: role || "student",
      createdDate: new Date().toISOString().split("T")[0]
    };

    await collection.insertOne(newUser);
    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

    const db = await getDatabase();
    const collection = db.collection("users");
    await collection.deleteOne({ id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
