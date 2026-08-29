"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Subject } from "@/types";
import { getCurrentUser, isSubjectEnrolled, DEFAULT_SUBJECTS } from "@/lib/usersData";
import { Lock, ShieldAlert, BookOpen, ArrowRight, Building2, Phone, CheckCircle2 } from "lucide-react";

interface SubjectAccessGateProps {
  subjectId: string;
  children: React.ReactNode;
}

export default function SubjectAccessGate({ subjectId, children }: SubjectAccessGateProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div style={{ color: "var(--brand-primary)", fontWeight: 700, fontSize: "1.1rem" }}>
          Đang xác thực quyền môn học...
        </div>
      </div>
    );
  }

  const hasAccess = isSubjectEnrolled(currentUser, subjectId);

  if (hasAccess) {
    return <>{children}</>;
  }

  const currentSubjectObj = DEFAULT_SUBJECTS.find(s => s.id === subjectId) || {
    name: subjectId,
    code: subjectId.toUpperCase()
  };

  const allowedSubjectsList = DEFAULT_SUBJECTS.filter(s => 
    currentUser?.enrolledSubjects?.includes(s.id)
  );

  return (
    <div style={{ maxWidth: "620px", margin: "3rem auto", padding: "0 1rem" }}>
      <div className="q-card" style={{ padding: "2.5rem 2rem", textAlign: "center", borderTop: "4px solid var(--brand-rose)" }}>
        <div style={{
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          background: "rgba(225, 29, 72, 0.1)",
          color: "var(--brand-rose)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.2rem auto",
          boxShadow: "0 8px 20px rgba(225, 29, 72, 0.15)"
        }}>
          <Lock size={32} />
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-full)",
          background: "rgba(225, 29, 72, 0.08)",
          color: "var(--brand-rose)",
          fontSize: "0.78rem",
          fontWeight: 800,
          marginBottom: "0.8rem"
        }}>
          <ShieldAlert size={14} />
          <span>MÔN HỌC BỊ KHÓA / CHƯA PHÂN QUYỀN</span>
        </div>

        <h2 style={{ fontSize: "1.45rem", fontWeight: 900, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          {currentSubjectObj.name} ({currentSubjectObj.code})
        </h2>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
          Tài khoản <strong>{currentUser?.fullName}</strong> ({currentUser?.phone || currentUser?.username}) hiện chưa được cấp quyền học và thi môn này tại <strong>{currentUser?.branchName || "Trung Tâm Tin Học Sao Việt"}</strong>.
        </p>

        {allowedSubjectsList.length > 0 && (
          <div style={{
            background: "var(--surface-subtle)",
            padding: "1.2rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            textAlign: "left"
          }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", marginBottom: "0.6rem", textTransform: "uppercase" }}>
              Các môn học đã kích hoạt cho bạn:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {allowedSubjectsList.map(s => (
                <span
                  key={s.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "6px",
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "var(--brand-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 700
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>{s.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{
          padding: "0.9rem 1.1rem",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(6, 182, 212, 0.05))",
          border: "1px solid rgba(37, 99, 235, 0.15)",
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          marginBottom: "1.5rem",
          textAlign: "left"
        }}>
          <div style={{ fontWeight: 800, color: "var(--brand-primary)", marginBottom: "0.2rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Building2 size={15} />
            <span>Liên Hệ Quản Lý Cơ Sở Để Kích Hoạt Môn Học:</span>
          </div>
          <div>Vui lòng thông báo cho Giáo viên phụ trách hoặc Quản lý chi nhánh để được thêm mã môn vào hồ sơ học viên.</div>
        </div>

        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
          <Link href="/study" className="btn btn-primary btn-md">
            <BookOpen size={16} />
            <span>Quay Lại Môn Đã Cấp</span>
          </Link>
          <Link href="/" className="btn btn-secondary btn-md">
            <span>Trang Chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
