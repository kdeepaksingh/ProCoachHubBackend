export const ROLES = {
  STUDENT: "student",
  COACH: "coach",
  TEACHER: "teacher",
  PARENT: "parent",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
