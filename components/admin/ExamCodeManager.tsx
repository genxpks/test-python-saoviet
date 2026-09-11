"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ExamAccessCode, Subject, Branch } from "@/types";
import {
  KeyRound, Plus, Copy, Trash2, RefreshCw, Clock, CheckCircle2,
  XCircle, AlertCircle, Calendar, BookOpen, Building2, Tag, Eye, EyeOff
} from "lucide-react";

// ─── Helpers định dạng ngày dd/mm/yyyy ─────────────────────────────
function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

interface ExamCodeManagerProps {
  subjects: Subject[];
  branches: Branch[];
  currentUser: { username: string; branchId?: string; role: string };
}

function getRemainingLabel(expiresAt: string): { label: string; color: string; expired: boolean } {
  const now = new Date();
  const exp = new Date(expiresAt);
  const diffMs = exp.getTime() - now.getTime();
  if (diffMs <= 0) return { label: "Đã hết hạn", color: "#dc2626", expired: true };
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return { label: `Còn ${diffMin} phút`, color: "#f59e0b", expired: false };
  const diffH = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  return {
    label: `Còn ${diffH}h${remMin > 0 ? remMin + "p" : ""}`,
    color: "#059669",
    expired: false,
  };
}

export default function ExamCodeManager({ subjects, branches, currentUser }: ExamCodeManagerProps) {
  const [codes, setCodes] = useState<ExamAccessCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);

  // Form state
  const [formSubjectId, setFormSubjectId] = useState("all");
  const [formBranchId, setFormBranchId] = useState(
    currentUser.role === "admin" ? "all" : currentUser.branchId || "all"
  );

  // LOGIC-02 FIX: Sync formBranchId khi currentUser thay doi
  useEffect(() => {
    setFormBranchId(currentUser.role === "admin" ? "all" : currentUser.branchId || "all");
  }, [currentUser.role, currentUser.branchId]);
  const [formLabel, setFormLabel] = useState("");
  const [formExpiresAt, setFormExpiresAt] = useState(() => {
    // Mặc định: 4 giờ từ bây giờ
    const d = new Date(Date.now() + 4 * 60 * 60 * 1000);
    // format local datetime-local input
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // LOGIC-01 FIX: Dung primitive deps thay vi object de tranh infinite re-render
  const loadCodes = useCallback(async () => {
    setLoading(true);
    try {
      const branchParam = currentUser.role === "admin" ? "" : `?branchId=${currentUser.branchId || "all"}`;
      const res = await fetch(`/api/exam-codes${branchParam}`, {
        headers: { "X-User-Role": currentUser.role },
      });
      const data = await res.json();
      if (data.success) setCodes(data.codes || []);
    } catch {
      setCodes([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser.role, currentUser.branchId]); // primitive deps - stable

  useEffect(() => { loadCodes(); }, [loadCodes]);

  const handleCreate = async () => {
    setCreateError("");
    if (!formExpiresAt) { setCreateError("Vui lòng chọn thời gian hết hạn!"); return; }
    const expDate = new Date(formExpiresAt);
    if (expDate <= new Date()) { setCreateError("Thời gian hết hạn phải sau thời điểm hiện tại!"); return; }

    setCreating(true);
    try {
      const res = await fetch("/api/exam-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": currentUser.role,
        },
        body: JSON.stringify({
          subjectId: formSubjectId,
          branchId: formBranchId,
          label: formLabel,
          createdBy: currentUser.username,
          expiresAt: expDate.toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setFormLabel("");
        loadCodes();
      } else {
        setCreateError(data.message || "Loi tao ma!");
      }
    } catch (e: any) {
      setCreateError("Loi ket noi: " + e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Vo hieu hoa ma nay? Hoc vien dang dung se khong the dung lai.")) return;
    try {
      const res = await fetch(`/api/exam-codes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "X-User-Role": currentUser.role },
      });
      // FLOW-02 FIX: Kiem tra response.ok truoc khi reload
      if (!res.ok) { alert("Khong the vo hieu hoa ma. Thu lai!"); return; }
      loadCodes();
    } catch { alert("Loi ket noi khi vo hieu hoa ma."); }
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm("Xoa vinh vien ma nay? Khong the phuc hoi!")) return;
    try {
      const res = await fetch(`/api/exam-codes?id=${encodeURIComponent(id)}&hard=true`, {
        method: "DELETE",
        headers: { "X-User-Role": currentUser.role },
      });
      // FLOW-02 FIX: Kiem tra response.ok
      if (!res.ok) { alert("Khong the xoa ma. Thu lai!"); return; }
      loadCodes();
    } catch { alert("Loi ket noi khi xoa ma."); }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => alert("Khong the copy. Vui long sao chep thu cong: " + code));
  };

  // LOGIC-04 FIX: useMemo de tranh tinh toan lai moi render
  const visibleCodes = useMemo(() =>
    showExpired
      ? codes
      : codes.filter(c => c.isActive && new Date(c.expiresAt) > new Date()),
    [codes, showExpired]
  );

  const card: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1.5rem",
    marginBottom: "1.25rem",
    boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.85rem",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "0.88rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const btnPrimary: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.55rem 1.1rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #1e40af, #2563eb)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px -2px rgba(37,99,235,0.3)",
  };

  const subjectName = (id: string) => {
    if (id === "all") return "Tất cả môn";
    return subjects.find(s => s.id === id)?.name || id.toUpperCase();
  };
  const branchName = (id: string) => {
    if (id === "all") return "Tất cả cơ sở";
    return branches.find(b => b.id === id)?.name || id;
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <KeyRound size={22} color="#2563eb" /> Mã Phòng Thi
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.83rem", margin: "0.2rem 0 0" }}>
            Cấp mã 6 số để học viên mở đề thi — có thời hạn theo ca thi
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowExpired(p => !p)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.5rem 0.9rem", borderRadius: "10px",
              border: "1.5px solid #e2e8f0", background: "#fff",
              color: "#64748b", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
            }}
          >
            {showExpired ? <EyeOff size={14} /> : <Eye size={14} />}
            {showExpired ? "Ẩn hết hạn" : "Xem tất cả"}
          </button>
          <button onClick={loadCodes} style={{ ...btnPrimary, background: "#f1f5f9", color: "#334155", boxShadow: "none" }}>
            <RefreshCw size={14} /> Tải lại
          </button>
          <button onClick={() => setShowForm(p => !p)} style={btnPrimary}>
            <Plus size={16} /> Tạo Mã Mới
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ ...card, border: "2px solid #2563eb", background: "linear-gradient(135deg, #eff6ff, #ffffff)" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1e40af", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Plus size={18} /> Tạo Mã Phòng Thi Mới
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                <BookOpen size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Môn học áp dụng
              </label>
              <select value={formSubjectId} onChange={e => setFormSubjectId(e.target.value)} style={inputStyle}>
                <option value="all">Tất cả môn</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                <Building2 size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Cơ sở áp dụng
              </label>
              <select
                value={formBranchId}
                onChange={e => setFormBranchId(e.target.value)}
                style={inputStyle}
                disabled={currentUser.role !== "admin"}
              >
                <option value="all">Tất cả cơ sở</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                <Calendar size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Hết hạn lúc
              </label>
              <input
                type="datetime-local"
                value={formExpiresAt}
                onChange={e => setFormExpiresAt(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                <Tag size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Ghi chú (tuỳ chọn)
              </label>
              <input
                type="text"
                value={formLabel}
                onChange={e => setFormLabel(e.target.value)}
                placeholder="VD: Lớp Python chiều T2 CN Bình Thạnh"
                style={inputStyle}
              />
            </div>
          </div>

          {createError && (
            <div style={{ marginTop: "0.75rem", padding: "0.55rem 0.8rem", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <AlertCircle size={14} /> {createError}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
            <button onClick={handleCreate} disabled={creating} style={{ ...btnPrimary, opacity: creating ? 0.7 : 1 }}>
              {creating ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : <KeyRound size={14} />}
              {creating ? "Đang tạo..." : "Tạo Mã Ngay"}
            </button>
            <button onClick={() => { setShowForm(false); setCreateError(""); }} style={{ ...btnPrimary, background: "#f1f5f9", color: "#475569", boxShadow: "none" }}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Codes List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
          <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: "0.5rem" }} />
          <p>Đang tải danh sách mã...</p>
        </div>
      ) : visibleCodes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", background: "#f8fafc", borderRadius: "14px", border: "1.5px dashed #e2e8f0" }}>
          <KeyRound size={40} style={{ marginBottom: "0.75rem", opacity: 0.4 }} />
          <p style={{ fontWeight: 700, color: "#64748b", margin: "0 0 0.25rem" }}>Chưa có mã phòng thi nào</p>
          <p style={{ fontSize: "0.83rem", margin: 0 }}>Nhấn "Tạo Mã Mới" để cấp mã cho ca thi tiếp theo</p>
        </div>
      ) : (
        <div>
          {visibleCodes.map(item => {
            const { label: remainLabel, color: remainColor, expired } = getRemainingLabel(item.expiresAt);
            const isInactive = !item.isActive || expired;
            return (
              <div key={item.id} style={{
                ...card,
                opacity: isInactive ? 0.65 : 1,
                borderLeft: `4px solid ${isInactive ? "#cbd5e1" : "#2563eb"}`,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  {/* Code + info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.45rem", flexWrap: "wrap" }}>
                      {/* Big code badge */}
                      <div style={{
                        fontFamily: "monospace",
                        fontSize: "2rem",
                        fontWeight: 900,
                        letterSpacing: "0.25em",
                        color: isInactive ? "#94a3b8" : "#1e40af",
                        background: isInactive ? "#f1f5f9" : "#eff6ff",
                        padding: "0.3rem 0.85rem",
                        borderRadius: "12px",
                        border: `2px solid ${isInactive ? "#e2e8f0" : "#bfdbfe"}`,
                        lineHeight: 1.2,
                      }}>
                        {item.code}
                      </div>
                      {/* Status badge */}
                      <span style={{
                        padding: "0.2rem 0.65rem",
                        borderRadius: "9999px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        background: isInactive ? "#f1f5f9" : "#dcfce7",
                        color: isInactive ? "#94a3b8" : "#16a34a",
                        display: "flex", alignItems: "center", gap: "0.3rem"
                      }}>
                        {isInactive ? <XCircle size={11} /> : <CheckCircle2 size={11} />}
                        {!item.isActive ? "Vô hiệu" : expired ? "Hết hạn" : "Đang hoạt động"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.83rem", color: "#475569", fontWeight: 600, marginBottom: "0.3rem" }}>
                      {item.label}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.78rem", color: "#64748b" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <BookOpen size={12} /> {subjectName(item.subjectId)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Building2 size={12} /> {branchName(item.branchId)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: remainColor, fontWeight: 700 }}>
                        <Clock size={12} /> {remainLabel}
                      </span>
                      <span>Dùng {item.usageCount} lần</span>
                      <span>GV: {item.createdBy}</span>
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                      Het han: {fmtDateTime(item.expiresAt)} &nbsp;|&nbsp; Tao luc: {fmtDate(item.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                    <button
                      onClick={() => handleCopy(item.code, item.id)}
                      title="Sao chép mã"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.45rem 0.8rem", borderRadius: "8px",
                        border: "1.5px solid #e2e8f0", background: copiedId === item.id ? "#dcfce7" : "#f8fafc",
                        color: copiedId === item.id ? "#16a34a" : "#475569",
                        fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
                      }}
                    >
                      {copiedId === item.id ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                      {copiedId === item.id ? "Đã copy!" : "Copy mã"}
                    </button>
                    {item.isActive && !expired && (
                      <button
                        onClick={() => handleDeactivate(item.id)}
                        title="Vô hiệu hóa mã"
                        style={{
                          display: "flex", alignItems: "center", gap: "0.35rem",
                          padding: "0.45rem 0.8rem", borderRadius: "8px",
                          border: "1.5px solid #fed7aa", background: "#fff7ed",
                          color: "#c2410c", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
                        }}
                      >
                        <XCircle size={13} /> Vô hiệu
                      </button>
                    )}
                    <button
                      onClick={() => handleHardDelete(item.id)}
                      title="Xóa vĩnh viễn"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.45rem 0.8rem", borderRadius: "8px",
                        border: "1.5px solid #fecaca", background: "#fef2f2",
                        color: "#dc2626", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
