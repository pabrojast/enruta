import type { userRoleEnum } from "@/db/schema";

export type Role = (typeof userRoleEnum.enumValues)[number];

export const ROLE_LABELS: Record<Role, string> = {
  student: "Estudiante",
  guardian: "Apoderado/a",
  counselor: "Orientador/a",
  psychologist: "Psicólogo/a educacional",
  head_teacher: "Profesor/a jefe",
  school_admin: "Equipo directivo / UTP",
  enruta_admin: "Administrador ENRUTA",
  partner: "Empresa / institución",
};

export function homeForRole(role: Role): string {
  switch (role) {
    case "student":
      return "/app";
    case "counselor":
    case "psychologist":
      return "/pro";
    case "head_teacher":
    case "school_admin":
      return "/colegio";
    case "enruta_admin":
      return "/admin";
    case "guardian":
      return "/familia";
    case "partner":
      return "/partner";
    default:
      return "/";
  }
}

export function isProfessional(role: Role) {
  return role === "counselor" || role === "psychologist";
}

export function isSchoolStaff(role: Role) {
  return (
    role === "counselor" ||
    role === "psychologist" ||
    role === "head_teacher" ||
    role === "school_admin"
  );
}

export function canReviewReports(role: Role) {
  return role === "counselor" || role === "psychologist" || role === "enruta_admin";
}

export function canSeeRestrictedAlerts(role: Role) {
  return role === "psychologist" || role === "enruta_admin";
}
