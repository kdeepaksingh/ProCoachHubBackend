import { Router, type RequestHandler } from "express";

import { authorizeRoles } from "../middleware/authorizeRoles";
import { ROLES } from "../constants/roles";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getTeacherDashboard,
  getMyBatches,
  getBatchById,
  getStudentsByBatch,
  getAttendance,
  markAttendance,
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getTests,
  createTest,
  updateTest,
  deleteTest,
  getTestResults,
  createTestResult,
  createBulkTestResults,
  createNotification,
} from "../controllers/teacherController";

const router = Router();

// Apply authentication and role-based authorization
router.use(requireAuth);
router.use(authorizeRoles(ROLES.TEACHER));

// =========================
// Dashboard
// =========================

/**
 * GET /api/teacher/dashboard
 * Get teacher dashboard summary:
 *  - list of batches (with course & subjects)
 *  - totalStudents across all batches
 *  - upcomingTests (next 5)
 */
router.get("/dashboard", getTeacherDashboard as RequestHandler);

// =========================
// Batches
// =========================

/**
 * GET /api/teacher/batches
 * Get all batches assigned to the logged-in teacher.
 */
router.get("/batches", getMyBatches as RequestHandler);

/**
 * GET /api/teacher/batches/:id
 * Get a specific batch by ID (only if owned by the teacher).
 * URL params:
 *  - id: batch ObjectId
 */
router.get("/batches/:id", getBatchById as RequestHandler);

// =========================
// Students
// =========================

/**
 * GET /api/teacher/students
 * Get students enrolled in a specific batch.
 * Query params (required):
 *  - batchId: batch ObjectId
 */
router.get("/students", getStudentsByBatch as RequestHandler);

// =========================
// Attendance
// =========================

/**
 * GET /api/teacher/attendance
 * Get attendance records for a batch taught by the teacher.
 * Query params (required):
 *  - batchId: batch ObjectId
 * Query params (optional):
 *  - from: YYYY-MM-DD
 *  - to:   YYYY-MM-DD
 */
router.get("/attendance", getAttendance as RequestHandler);

/**
 * POST /api/teacher/attendance
 * Mark/update attendance for a batch on a specific date.
 * Body:
 * {
 *   "batchId": string,
 *   "date": "YYYY-MM-DD",
 *   "records": [
 *     {
 *       "studentId": string,
 *       "status": "present" | "absent" | "late"
 *     }
 *   ]
 * }
 */
router.post("/attendance", markAttendance as RequestHandler);

// =========================
// Assignments / Materials
// =========================

/**
 * GET /api/teacher/assignments
 * Get assignments / notes / materials for batches taught by the teacher.
 * Query params (optional):
 *  - batchId: batch ObjectId (if not provided, returns for all teacher's batches)
 */
router.get("/assignments", getAssignments as RequestHandler);

/**
 * POST /api/teacher/assignments
 * Create a new assignment / note / material for a batch.
 * Body:
 * {
 *   "batchId": string,
 *   "title": string,
 *   "description": string,
 *   "type": "assignment" | "note" | "material",
 *   "attachmentUrl": string,
 *   "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ"
 * }
 */
router.post("/assignments", createAssignment as RequestHandler);

/**
 * PATCH /api/teacher/assignments/:id
 * Update an existing assignment / note / material.
 * URL params:
 *  - id: assignment ObjectId
 * Body (all fields optional, same structure as createAssignment body).
 */
router.patch("/assignments/:id", updateAssignment as RequestHandler);

/**
 * DELETE /api/teacher/assignments/:id
 * Delete an assignment / note / material.
 * URL params:
 *  - id: assignment ObjectId
 */
router.delete("/assignments/:id", deleteAssignment as RequestHandler);

// =========================
// Tests
// =========================

/**
 * GET /api/teacher/tests
 * Get tests for batches taught by the teacher.
 * Query params (optional):
 *  - batchId: batch ObjectId (if not provided, returns for all teacher's batches)
 */
router.get("/tests", getTests as RequestHandler);

/**
 * POST /api/teacher/tests
 * Create a new test for a batch.
 * Body:
 * {
 *   "batchId": string,
 *   "title": string,
 *   "type": "mock" | "chapter" | "full",
 *   "subjectId": string (optional),
 *   "scheduledAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
 *   "durationMinutes": number,
 *   "maxMarks": number,
 *   "link": string (optional)
 * }
 */
router.post("/tests", createTest as RequestHandler);

/**
 * PATCH /api/teacher/tests/:id
 * Update an existing test.
 * URL params:
 *  - id: test ObjectId
 * Body (all fields optional, same structure as createTest body).
 */
router.patch("/tests/:id", updateTest as RequestHandler);

/**
 * DELETE /api/teacher/tests/:id
 * Delete a test.
 * URL params:
 *  - id: test ObjectId
 */
router.delete("/tests/:id", deleteTest as RequestHandler);

// =========================
// Test Results
// =========================

/**
 * GET /api/teacher/test-results
 * Get test results for a specific test.
 * Query params (required):
 *  - testId: test ObjectId
 */
router.get("/test-results", getTestResults as RequestHandler);

/**
 * POST /api/teacher/test-results
 * Create a single test result for a student.
 * Body:
 * {
 *   "testId": string,
 *   "studentId": string,
 *   "marksObtained": number
 * }
 */
router.post("/test-results", createTestResult as RequestHandler);

/**
 * POST /api/teacher/test-results/bulk
 * Create multiple test results at once for a test.
 * Body:
 * {
 *   "testId": string,
 *   "results": [
 *     {
 *       "studentId": string,
 *       "marksObtained": number
 *     }
 *   ]
 * }
 */
router.post("/test-results/bulk", createBulkTestResults as RequestHandler);

// =========================
// Notifications (Batch-level)
// =========================

/**
 * POST /api/teacher/notifications
 * Send notifications to all students in a specific batch.
 * Body:
 * {
 *   "batchId": string,
 *   "title": string,
 *   "message": string,
 *   "type": "system" | "fee" | "class" | "exam" | "announcement"
 * }
 */
router.post("/notifications", createNotification as RequestHandler);

export default router;
