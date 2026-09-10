"use client";

import { useState } from "react";
import { User, Subject } from "@/types";
import { updateUser } from "@/lib/usersData";
import { BookOpen, X, CheckSquare, Square, UserCheck, Sparkles, Save } from "lucide-react";

interface TeacherSubjectAssignModalProps {
  teacher: User;
  subjects: Subject[];
  onClose: () => void;
  onSaved: () => void;
}

export default function TeacherSubjectAssignModal({
  teacher,
  subjects,
  onClose,
  onSaved
}: TeacherSubjectAssignModalProps) {
  const [assigned, setAssigned] = useState<string[]>(teacher.assignedSubjectIds || []);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (subId: string) => {
    setAssigned(prev =>
      prev.includes(subId) ? prev.filter(s => s !== subId) : [...prev, subId]
    );
  };

  const selectAll = () => setAssigned(subjects.map(s => s.id));
  const clearAll = () => setAssigned([]);

  const handleSave = async () => {
    setIsLoading(true);
    updateUser(teacher.id, { assignedSubjectIds: assigned });
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teacher.id, assignedSubjectIds: assigned })
      });
    } catch {}
    setIsLoading(false);
    alert(`✅ Đã phân công ${assigned.length} môn học cho giáo viên ${teacher.fullName}!`);
    onSaved();
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1100,
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        color: "#0f172a",
        maxWidth: "520px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "2rem",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.22)",
        position: "relative"
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "1.2rem", right: "1.2rem",
          background: "#f1f5f9", border: "none", borderRadius: "50%",
          width: "32px", height: "32px", display: "flex",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#64748b"
        }}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "linear-gradient(135deg, #059669, #10b981)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <BookOpen size={24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>
              Phân Công Môn Học
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0" }}>
              Giáo viên: <strong style={{ color: "#059669" }}>{teacher.fullName}</strong>
              {teacher.branchName && <> • {teacher.branchName}</>}
            </p>
          </div>
        </div>

        {/* Select All / Clear */}
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
          <button onClick={selectAll} style={{
            padding: "0.35rem 0.85rem", borderRadius: "999px",
            background: "#059669", color: "white", border: "none",
            fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.35rem"
          }}>
            <CheckSquare size={13} /> Chọn Tất Cả
          </button>
          <button onClick={clearAll} style={{
            padding: "0.35rem 0.85rem", borderRadius: "999px",
            background: "#f1f5f9", color: "#64748b",
            border: "1.5px solid #e2e8f0",
            fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.35rem"
          }}>
            <Square size={13} /> Bỏ Tất Cả
          </button>
          <span style={{
            marginLeft: "auto", fontSize: "0.8rem",
            color: "#059669", fontWeight: 800,
            display: "flex", alignItems: "center"
          }}>
            {assigned.length}/{subjects.length} môn được chọn
          </span>
        </div>

        {/* Subject Checkboxes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
          {subjects.map(sub => {
            const isChecked = assigned.includes(sub.id);
            return (
              <div
                key={sub.id}
                onClick={() => toggle(sub.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  border: isChecked ? "2px solid #059669" : "1.5px solid #e2e8f0",
                  background: isChecked ? "rgba(5,150,105,0.06)" : "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "6px",
                  border: isChecked ? "none" : "2px solid #cbd5e1",
                  background: isChecked ? "#059669" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s ease"
                }}>
                  {isChecked && <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 900 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>
                    {sub.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.1rem" }}>
                    Mã: <span style={{ fontFamily: "var(--font-mono)", color: "#2563eb" }}>{sub.code}</span>
                    {" • "}{sub.totalModules} chương học
                  </div>
                </div>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 800, padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: isChecked ? "rgba(5,150,105,0.12)" : "#f1f5f9",
                  color: isChecked ? "#059669" : "#94a3b8"
                }}>
                  {sub.runtime}
                </span>
              </div>
            );
          })}
        </div>

        {/* Info note */}
        {assigned.length === 0 && (
          <div style={{
            padding: "0.75rem 1rem", borderRadius: "10px",
            background: "#fef9c3", border: "1.5px solid #fde047",
            color: "#854d0e", fontSize: "0.82rem", fontWeight: 600,
            marginBottom: "1rem"
          }}>
            ⚠️ Cần chọn ít nhất 1 môn học để giáo viên có thể giám sát thi.
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          style={{
            width: "100%", padding: "0.9rem",
            borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "white", fontWeight: 800, fontSize: "0.95rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", opacity: isLoading ? 0.7 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {isLoading ? (
            <><Sparkles size={16} /> Đang lưu...</>
          ) : (
            <><Save size={16} /> Lưu Phân Công ({assigned.length} môn)</>
          )}
        </button>
      </div>
    </div>
  );
}
