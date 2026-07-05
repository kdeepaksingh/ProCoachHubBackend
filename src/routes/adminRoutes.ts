import { Router, type RequestHandler } from "express";

import { authorizeRoles } from "../middleware/authorizeRoles";
import { ROLES } from "../constants/roles";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getFeePlans,
  getFeePlanById,
  createFeePlan,
  updateFeePlan,
  getPayments,
  createPayment,
  createNotification,
  createBulkNotifications,
} from "../controllers/adminController";

const router = Router();

// Apply authentication and role-based authorization
router.use(requireAuth);
router.use(authorizeRoles(ROLES.ADMIN));

// =========================
// Users
// =========================

/**
 * GET /api/admin/users
 * Get list of users with pagination, optional role filter, and search.
 * Query params (optional):
 *  - role: "ADMIN" | "TEACHER" | "STUDENT"
 *  - page: number (default 1)
 *  - limit: number (default 20)
 *  - search: string (searches fullName & email)
 */
router.get("/users", getUsers as RequestHandler);

/**
 * GET /api/admin/users/:id
 * Get a single user by ID.
 * URL params:
 *  - id: user ObjectId
 */
router.get("/users/:id", getUserById as RequestHandler);

/**
 * POST /api/admin/users
 * Create a new user (admin, teacher, or student).
 * Body (required + optional):
 * {
 *   "fullName": string,
 *   "email": string,
 *   "password": string,
 *   "role": "ADMIN" | "TEACHER" | "STUDENT",
 *   "phone": string,
 *   "gender": "male" | "female" | "other",
 *   "dateOfBirth": "YYYY-MM-DD",
 *   "address": string,
 *   "city": string,
 *   "state": string,
 *   "country": string,
 *   "qualification": string,
 *   "organizationName": string,
 *   "coachingInterest": string,
 *   "experienceLevel": "beginner" | "intermediate" | "advanced",
 *   "bio": string,
 *   "emergencyContact": string,
 *   "isVerified": boolean
 * }
 */
router.post("/users", createUser as RequestHandler);

/**
 * PATCH /api/admin/users/:id
 * Update an existing user (partial update).
 * URL params:
 *  - id: user ObjectId
 * Body (all fields optional, same structure as createUser body without password if not changing).
 */
router.patch("/users/:id", updateUser as RequestHandler);

/**
 * DELETE /api/admin/users/:id
 * Delete a user by ID.
 * URL params:
 *  - id: user ObjectId
 */
router.delete("/users/:id", deleteUser as RequestHandler);

// =========================
// Courses
// =========================

/**
 * GET /api/admin/courses
 * Get list of courses.
 * Query params (optional):
 *  - isActive: "true" | "false"
 *  - search: string (searches name & code)
 */
router.get("/courses", getCourses as RequestHandler);

/**
 * GET /api/admin/courses/:id
 * Get a single course by ID.
 * URL params:
 *  - id: course ObjectId
 */
router.get("/courses/:id", getCourseById as RequestHandler);

/**
 * POST /api/admin/courses
 * Create a new course.
 * Body:
 * {
 *   "name": string,
 *   "code": string,
 *   "description": string,
 *   "durationMonths": number,
 *   "isActive": boolean
 * }
 */
router.post("/courses", createCourse as RequestHandler);

/**
 * PATCH /api/admin/courses/:id
 * Update an existing course (partial update).
 * URL params:
 *  - id: course ObjectId
 * Body (all fields optional, same structure as createCourse body).
 */
router.patch("/courses/:id", updateCourse as RequestHandler);

/**
 * DELETE /api/admin/courses/:id
 * Delete a course by ID.
 * URL params:
 *  - id: course ObjectId
 */
router.delete("/courses/:id", deleteCourse as RequestHandler);

// =========================
// Subjects
// =========================

/**
 * GET /api/admin/subjects
 * Get list of subjects.
 * Query params (optional):
 *  - courseId: course ObjectId
 */
router.get("/subjects", getSubjects as RequestHandler);

/**
 * GET /api/admin/subjects/:id
 * Get a single subject by ID.
 * URL params:
 *  - id: subject ObjectId
 */
router.get("/subjects/:id", getSubjectById as RequestHandler);

/**
 * POST /api/admin/subjects
 * Create a new subject.
 * Body:
 * {
 *   "name": string,
 *   "code": string,
 *   "courseId": string (ObjectId, optional)
 * }
 */
router.post("/subjects", createSubject as RequestHandler);

/**
 * PATCH /api/admin/subjects/:id
 * Update an existing subject (partial update).
 * URL params:
 *  - id: subject ObjectId
 * Body (all fields optional, same structure as createSubject body).
 */
router.patch("/subjects/:id", updateSubject as RequestHandler);

/**
 * DELETE /api/admin/subjects/:id
 * Delete a subject by ID.
 * URL params:
 *  - id: subject ObjectId
 */
router.delete("/subjects/:id", deleteSubject as RequestHandler);

// =========================
// Batches
// =========================

/**
 * GET /api/admin/batches
 * Get list of batches.
 * Query params (optional):
 *  - courseId: course ObjectId
 *  - teacherId: user ObjectId (teacher)
 *  - isActive: "true" | "false"
 */
router.get("/batches", getBatches as RequestHandler);

/**
 * GET /api/admin/batches/:id
 * Get a single batch by ID.
 * URL params:
 *  - id: batch ObjectId
 */
router.get("/batches/:id", getBatchById as RequestHandler);

/**
 * POST /api/admin/batches
 * Create a new batch.
 * Body:
 * {
 *   "name": string,
 *   "courseId": string,
 *   "teacherId": string,
 *   "subjects": string[] (ObjectIds, optional),
 *   "startTime": "YYYY-MM-DDTHH:mm:ss.sssZ",
 *   "endTime": "YYYY-MM-DDTHH:mm:ss.sssZ",
 *   "schedule": {
 *     "days": string[], e.g. ["Mon", "Wed", "Fri"],
 *     "time": string, e.g. "18:00-19:30",
 *     "mode": "online" | "offline",
 *     "link": string (optional, for online),
 *     "room": string (optional, for offline)
 *   },
 *   "maxStudents": number,
 *   "isActive": boolean
 * }
 */
router.post("/batches", createBatch as RequestHandler);

/**
 * PATCH /api/admin/batches/:id
 * Update an existing batch (partial update).
 * URL params:
 *  - id: batch ObjectId
 * Body (all fields optional, same structure as createBatch body).
 */
router.patch("/batches/:id", updateBatch as RequestHandler);

/**
 * DELETE /api/admin/batches/:id
 * Delete a batch by ID.
 * URL params:
 *  - id: batch ObjectId
 */
router.delete("/batches/:id", deleteBatch as RequestHandler);

// =========================
// Enrollments
// =========================

/**
 * GET /api/admin/enrollments
 * Get list of enrollments.
 * Query params (optional):
 *  - studentId: user ObjectId
 *  - batchId: batch ObjectId
 *  - courseId: course ObjectId
 *  - status: "active" | "completed" | "dropped"
 */
router.get("/enrollments", getEnrollments as RequestHandler);

/**
 * GET /api/admin/enrollments/:id
 * Get a single enrollment by ID.
 * URL params:
 *  - id: enrollment ObjectId
 */
router.get("/enrollments/:id", getEnrollmentById as RequestHandler);

/**
 * POST /api/admin/enrollments
 * Create a new enrollment.
 * Body:
 * {
 *   "studentId": string,
 *   "batchId": string,
 *   "courseId": string,
 *   "status": "active" | "completed" | "dropped" (optional, default "active")
 * }
 */
router.post("/enrollments", createEnrollment as RequestHandler);

/**
 * PATCH /api/admin/enrollments/:id
 * Update an existing enrollment (partial update).
 * URL params:
 *  - id: enrollment ObjectId
 * Body (all fields optional, same structure as createEnrollment body).
 */
router.patch("/enrollments/:id", updateEnrollment as RequestHandler);

/**
 * DELETE /api/admin/enrollments/:id
 * Delete an enrollment by ID.
 * URL params:
 *  - id: enrollment ObjectId
 */
router.delete("/enrollments/:id", deleteEnrollment as RequestHandler);

// =========================
// Fee Plans
// =========================

/**
 * GET /api/admin/fee-plans
 * Get list of fee plans.
 * Query params (optional):
 *  - studentId: user ObjectId
 *  - courseId: course ObjectId
 *  - batchId: batch ObjectId
 */
router.get("/fee-plans", getFeePlans as RequestHandler);

/**
 * GET /api/admin/fee-plans/:id
 * Get a single fee plan by ID.
 * URL params:
 *  - id: feePlan ObjectId
 */
router.get("/fee-plans/:id", getFeePlanById as RequestHandler);

/**
 * POST /api/admin/fee-plans
 * Create a new fee plan with installments.
 * Body:
 * {
 *   "studentId": string,
 *   "courseId": string,
 *   "batchId": string (optional),
 *   "totalAmount": number,
 *   "discount": number (optional),
 *   "installments": [
 *     {
 *       "dueDate": "YYYY-MM-DD",
 *       "amount": number,
 *       "description": string (optional)
 *     }
 *   ]
 * }
 */
router.post("/fee-plans", createFeePlan as RequestHandler);

/**
 * PATCH /api/admin/fee-plans/:id
 * Update an existing fee plan (partial update).
 * URL params:
 *  - id: feePlan ObjectId
 * Body (all fields optional, same structure as createFeePlan body).
 */
router.patch("/fee-plans/:id", updateFeePlan as RequestHandler);

// =========================
// Payments
// =========================

/**
 * GET /api/admin/payments
 * Get list of payments.
 * Query params (optional):
 *  - studentId: user ObjectId
 *  - feePlanId: feePlan ObjectId
 */
router.get("/payments", getPayments as RequestHandler);

/**
 * POST /api/admin/payments
 * Record a new payment and mark the corresponding installment as paid.
 * Body:
 * {
 *   "studentId": string,
 *   "feePlanId": string,
 *   "installmentIndex": number,
 *   "amountPaid": number,
 *   "paymentDate": "YYYY-MM-DDTHH:mm:ss.sssZ" (optional, default now),
 *   "paymentMode": "cash" | "upi" | "card" | "bank",
 *   "transactionId": string (optional),
 *   "receiptUrl": string (optional)
 * }
 */
router.post("/payments", createPayment as RequestHandler);

// =========================
// Notifications
// =========================

/**
 * POST /api/admin/notifications
 * Create a notification for a single user.
 * Body:
 * {
 *   "userId": string,
 *   "title": string,
 *   "message": string,
 *   "type": "system" | "fee" | "class" | "exam" | "announcement"
 * }
 */
router.post("/notifications", createNotification as RequestHandler);

/**
 * POST /api/admin/notifications/bulk
 * Create notifications for multiple users at once.
 * Body:
 * {
 *   "userIds": string[],
 *   "title": string,
 *   "message": string,
 *   "type": "system" | "fee" | "class" | "exam" | "announcement"
 * }
 */
router.post("/notifications/bulk", createBulkNotifications as RequestHandler);

export default router;
