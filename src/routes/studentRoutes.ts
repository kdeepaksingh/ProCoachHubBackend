import { Router, type RequestHandler } from "express";

import { authorizeRoles } from "../middleware/authorizeRoles";
import { Role, ROLES } from "../constants/roles";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getMyAssignments,
  getMyAttendance,
  getMyBatches,
  getMyCourses,
  getMyFeePlans,
  getMyPayments,
  getMySchedule,
  getMyTestResults,
  getMyTests,
  getNotifications,
  getPerformanceReport,
  getStudentDashboard,
  getStudentProfile,
  markAllNotificationsRead,
  markNotificationRead,
  updateStudentProfile,
} from "../controllers/studentController";

const router = Router();

// Apply authentication and role-based authorization
router.use(requireAuth);
router.use(authorizeRoles(ROLES.STUDENT as Role));

// =========================
// Dashboard & Core
// =========================

/**
 * GET /api/student/dashboard
 * Get student dashboard summary:
 * - totalBatches
 * - upcomingClasses
 * - recentTests
 * - attendanceSummary
 * - feeSummary
 */
router.get("/dashboard", getStudentDashboard as RequestHandler);

/**
 * GET /api/student/courses
 * Get list of courses the student is enrolled in.
 */
router.get("/courses", getMyCourses as RequestHandler);

/**
 * GET /api/student/batches
 * Get list of batches (with course info) the student is enrolled in.
 */
router.get("/batches", getMyBatches as RequestHandler);

/**
 * GET /api/student/schedule
 * Get weekly class schedule for active batches.
 */
router.get("/schedule", getMySchedule as RequestHandler);

// =========================
// Academic
// =========================

/**
 * GET /api/student/attendance
 * Get attendance records for the student.
 * Query params (optional):
 *  - from: YYYY-MM-DD
 *  - to:   YYYY-MM-DD
 */
router.get("/attendance", getMyAttendance as RequestHandler);

/**
 * GET /api/student/assignments
 * Get assignments / notes / study material for enrolled batches.
 */
router.get("/assignments", getMyAssignments as RequestHandler);

/**
 * GET /api/student/tests
 * Get list of tests for enrolled batches.
 */
router.get("/tests", getMyTests as RequestHandler);

/**
 * GET /api/student/test-results
 * Get test results with marks, max marks, and percentages.
 */
router.get("/test-results", getMyTestResults as RequestHandler);

/**
 * GET /api/student/performance/report
 * Get performance report:
 *  - attendance stats
 *  - test stats (average %, total tests, etc.)
 */
router.get("/performance/report", getPerformanceReport as RequestHandler);

// =========================
// Fees
// =========================

/**
 * GET /api/student/fee-plans
 * Get fee plans for the student (total amount, installments, etc.).
 */
router.get("/fee-plans", getMyFeePlans as RequestHandler);

/**
 * GET /api/student/payments
 * Get payment history for the student.
 */
router.get("/payments", getMyPayments as RequestHandler);

// =========================
// Notifications
// =========================

/**
 * GET /api/student/notifications
 * Get notifications for the student.
 * Query params (optional):
 *  - limit: number (default 20)
 *  - unreadOnly: "true" | "false"
 */
router.get("/notifications", getNotifications as RequestHandler);

/**
 * PATCH /api/student/notifications/:id/read
 * Mark a specific notification as read.
 * URL params:
 *  - id: notification ObjectId
 */
router.patch("/notifications/:id/read", markNotificationRead as RequestHandler);

/**
 * PATCH /api/student/notifications/read-all
 * Mark all notifications for the student as read.
 */
router.patch(
  "/notifications/read-all",
  markAllNotificationsRead as RequestHandler,
);

// =========================
// Profile
// =========================

/**
 * GET /api/student/profile
 * Get student profile (user details without password).
 */
router.get("/profile", getStudentProfile as RequestHandler);

/**
 * PATCH /api/student/profile
 * Update student profile fields.
 * Body (partial, all optional):
 * {
 *   "fullName": string,
 *   "phone": string,
 *   "gender": "male" | "female" | "other",
 *   "dateOfBirth": "YYYY-MM-DD",
 *   "address": string,
 *   "city": string,
 *   "state": string,
 *   "country": string,
 *   "coachingInterest": string,
 *   "experienceLevel": "beginner" | "intermediate" | "advanced",
 *   "bio": string,
 *   "qualification": string,
 *   "organizationName": string,
 *   "emergencyContact": string
 * }
 */
router.patch("/profile", updateStudentProfile as RequestHandler);

export default router;
