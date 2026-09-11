/**
 * lib/rbac.ts — Hệ Thống Phân Quyền 5 Cấp Tin Học Sao Việt
 * ─────────────────────────────────────────────────────────────
 * admin (5) > internal_manager (4) > branch_manager (3) > teacher (2) > student (1)
 */

import { User, UserRole, ROLE_HIERARCHY } from "@/types";

// ─── Kiểm tra cấp bậc ─────────────────────────────────────────────
export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY[role] ?? 0;
}

export function isHigherOrEqual(actor: UserRole, target: UserRole): boolean {
  return getRoleLevel(actor) >= getRoleLevel(target);
}

export function isHigherThan(actor: UserRole, target: UserRole): boolean {
  return getRoleLevel(actor) > getRoleLevel(target);
}

// ─── Role mà actor có thể TẠO ────────────────────────────────────
export function getCreatableRoles(actor: User): UserRole[] {
  switch (actor.role) {
    case "admin":
      // Admin tạo được tất cả role
      return ["admin", "internal_manager", "branch_manager", "teacher", "student"];
    case "internal_manager":
      // Internal manager tạo branch_manager, teacher, student
      return ["branch_manager", "teacher", "student"];
    case "branch_manager":
      // Branch manager chỉ tạo teacher & student trong chi nhánh
      return ["teacher", "student"];
    default:
      return [];
  }
}

// ─── Quyền TẠO user ──────────────────────────────────────────────
export function canCreateUser(actor: User, targetRole: UserRole): boolean {
  return getCreatableRoles(actor).includes(targetRole);
}

// ─── Quyền SỬA user ──────────────────────────────────────────────
export function canEditUser(actor: User, target: User): boolean {
  if (actor.id === target.id) return false; // Không tự sửa qua admin panel
  if (!isHigherThan(actor.role, target.role)) return false; // Phải có cấp bậc cao hơn

  // Branch manager chỉ sửa user trong chi nhánh mình
  if (actor.role === "branch_manager") {
    return target.branchId === actor.branchId;
  }
  // Internal manager có thể sửa branch_manager, teacher, student ở mọi chi nhánh
  if (actor.role === "internal_manager") {
    return target.role !== "admin" && target.role !== "internal_manager";
  }
  return true; // admin
}

// ─── Quyền XÓA user ──────────────────────────────────────────────
export function canDeleteUser(actor: User, target: User): boolean {
  if (actor.id === target.id) return false;
  if (!isHigherThan(actor.role, target.role)) return false;

  if (actor.role === "branch_manager") {
    return target.branchId === actor.branchId;
  }
  if (actor.role === "internal_manager") {
    return target.role !== "admin" && target.role !== "internal_manager";
  }
  return true; // admin
}

// ─── Quyền xem CHI NHÁNH ─────────────────────────────────────────
export function canViewBranch(actor: User, branchId: string): boolean {
  switch (actor.role) {
    case "admin":
    case "internal_manager":
      return true; // Xem tất cả chi nhánh
    case "branch_manager":
    case "teacher":
    case "student":
      return actor.branchId === branchId;
    default:
      return false;
  }
}

// ─── Lấy danh sách branchId mà actor được quyền thấy ────────────
export function getAccessibleBranchIds(actor: User, allBranchIds: string[]): string[] {
  if (actor.role === "admin" || actor.role === "internal_manager") {
    return allBranchIds;
  }
  return actor.branchId ? [actor.branchId] : [];
}

// ─── Quyền truy cập TAB trong admin panel ────────────────────────
export type AdminTab = "questions" | "practicals" | "users" | "subjects" | "branches" | "results" | "settings" | "exam_codes";

export const TAB_ACCESS: Record<AdminTab, UserRole[]> = {
  questions:   ["admin", "internal_manager"],           // Ngân hàng câu hỏi
  practicals:  ["admin", "internal_manager"],           // Bài thực hành
  users:       ["admin", "internal_manager", "branch_manager", "teacher"], // Quản lý user
  subjects:    ["admin", "internal_manager"],           // Quản lý môn học
  branches:    ["admin"],                               // Quản lý chi nhánh (chỉ admin)
  results:     ["admin", "internal_manager", "branch_manager", "teacher"], // Kết quả thi
  settings:    ["admin"],                               // Cấu hình hệ thống (chỉ admin)
  exam_codes:  ["admin", "internal_manager", "branch_manager", "teacher"], // Mã phòng thi
};

export function canAccessTab(actor: User, tab: AdminTab): boolean {
  return TAB_ACCESS[tab]?.includes(actor.role) ?? false;
}

// ─── Quyền vào trang ADMIN PANEL ─────────────────────────────────
export function canAccessAdminPanel(role: UserRole): boolean {
  return ["admin", "internal_manager", "branch_manager", "teacher"].includes(role);
}

// ─── Quyền PHÂN CÔNG môn học cho teacher ─────────────────────────
export function canAssignSubjects(actor: User, targetTeacher: User): boolean {
  if (targetTeacher.role !== "teacher") return false;
  if (actor.role === "admin" || actor.role === "internal_manager") return true;
  if (actor.role === "branch_manager") {
    return targetTeacher.branchId === actor.branchId;
  }
  return false;
}

// ─── Quyền xem kết quả thi ────────────────────────────────────────
export function canViewExamResult(actor: User, result: { branchId: string; subjectId: string }): boolean {
  if (actor.role === "admin" || actor.role === "internal_manager") return true;
  if (actor.role === "branch_manager") return result.branchId === actor.branchId;
  if (actor.role === "teacher") {
    const inBranch = result.branchId === actor.branchId;
    const hasSubject = actor.assignedSubjectIds?.includes(result.subjectId) ?? false;
    return inBranch && hasSubject;
  }
  return false; // student không vào admin
}

// ─── Lọc danh sách user theo quyền ──────────────────────────────
export function filterUsersForActor(actor: User, users: User[]): User[] {
  switch (actor.role) {
    case "admin":
    case "internal_manager":
      return users; // Xem tất cả
    case "branch_manager":
      // Chỉ thấy user trong chi nhánh mình (không thấy admin/internal_manager)
      return users.filter(u =>
        u.branchId === actor.branchId &&
        u.role !== "admin" &&
        u.role !== "internal_manager"
      );
    case "teacher":
      // Chỉ thấy student trong chi nhánh, môn được giao
      return users.filter(u =>
        u.role === "student" &&
        u.branchId === actor.branchId &&
        u.enrolledSubjects?.some(s => actor.assignedSubjectIds?.includes(s))
      );
    default:
      return [];
  }
}

// ─── Helpers UI: Badge color & label ─────────────────────────────
import { ROLE_LABELS, ROLE_COLORS } from "@/types";

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}

export function getRoleColor(role: UserRole): string {
  return ROLE_COLORS[role] ?? "#64748b";
}

export function getRoleBadgeStyle(role: UserRole): Record<string, string | number> {
  const color = getRoleColor(role);
  return {
    background: `${color}18`,
    color,
    border: `1.5px solid ${color}40`,
    padding: "0.15rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 800,
    display: "inline-block",
    whiteSpace: "nowrap",
  };
}
