export type UserRole = "admin" | "teacher" | "student" | "coach" | "parent";

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
