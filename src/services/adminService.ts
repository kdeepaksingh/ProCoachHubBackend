import { Types } from "mongoose";
import User from "../models/User";
import { z } from "zod";
import { Enrollment } from "../models/studentModel/Enrollment";
import { FeePlan } from "../models/studentModel/FeePlan";
import { Course } from "../models/studentModel/Course";
import { Payment } from "../models/studentModel/Payment";
import { Notification } from "../models/studentModel/Notification";
import { Subject } from "../models/studentModel/Subject";
import { Batch } from "../models/studentModel/Batch";
import { hashPassword } from "../utils/password";

const createUserSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  qualification: z.string().optional(),
  organizationName: z.string().optional(),
  coachingInterest: z.string().optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  bio: z.string().optional(),
  emergencyContact: z.string().optional(),
  isVerified: z.boolean().optional(),
});

const createCourseSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  durationMonths: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

const createSubjectSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  courseId: z.string().optional(),
});

const createBatchSchema = z.object({
  name: z.string().min(2),
  courseId: z.string(),
  teacherId: z.string(),
  subjects: z.array(z.string()).optional(),
  startTime: z.string(),
  endTime: z.string(),
  schedule: z.object({
    days: z.array(z.string()),
    time: z.string(),
    mode: z.enum(["online", "offline"]),
    link: z.string().optional(),
    room: z.string().optional(),
  }),
  maxStudents: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

const createEnrollmentSchema = z.object({
  studentId: z.string(),
  batchId: z.string(),
  courseId: z.string(),
  status: z.enum(["active", "completed", "dropped"]).optional(),
});

const createFeePlanSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  batchId: z.string().optional(),
  totalAmount: z.number().positive(),
  discount: z.number().min(0).optional(),
  installments: z.array(
    z.object({
      dueDate: z.string(),
      amount: z.number().positive(),
      description: z.string().optional(),
    }),
  ),
});

const createPaymentSchema = z.object({
  studentId: z.string(),
  feePlanId: z.string(),
  installmentIndex: z.number().int().min(0),
  amountPaid: z.number().positive(),
  paymentDate: z.string().optional(),
  paymentMode: z.enum(["cash", "upi", "card", "bank"]),
  transactionId: z.string().optional(),
  receiptUrl: z.string().optional(),
});

const createNotificationSchema = z.object({
  userId: z.string(),
  title: z.string().min(2),
  message: z.string().min(2),
  type: z.enum(["system", "fee", "class", "exam", "announcement"]),
});

const bulkNotificationSchema = z.object({
  userIds: z.array(z.string()),
  title: z.string().min(2),
  message: z.string().min(2),
  type: z.enum(["system", "fee", "class", "exam", "announcement"]),
});

export class AdminService {
  // Users
  async getUsers(query: {
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { role, page = 1, limit = 20, search } = query;
    const filter: any = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select("-passwordHash")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    return { users, total, page, limit };
  }

  async getUserById(id: string) {
    return User.findById(id).select("-passwordHash");
  }

  async createUser(input: z.infer<typeof createUserSchema>) {
    const data = createUserSchema.parse(input);
    const { password, ...rest } = data;

    const passwordHash = await hashPassword(password);

    const user = await User.create({ ...rest, passwordHash });
    return user;
  }

  async updateUser(
    id: string,
    input: Partial<z.infer<typeof createUserSchema>>,
  ) {
    const data = createUserSchema.partial().parse(input);
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-passwordHash");
    return user;
  }

  async deleteUser(id: string) {
    return User.findByIdAndDelete(id);
  }

  // Courses
  async getCourses(query: { isActive?: boolean; search?: string }) {
    const { isActive, search } = query;
    const filter: any = {};
    if (typeof isActive === "boolean") filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }
    return Course.find(filter);
  }

  async getCourseById(id: string) {
    return Course.findById(id);
  }

  async createCourse(input: z.infer<typeof createCourseSchema>) {
    const data = createCourseSchema.parse(input);
    return Course.create(data);
  }

  async updateCourse(
    id: string,
    input: Partial<z.infer<typeof createCourseSchema>>,
  ) {
    const data = createCourseSchema.partial().parse(input);
    return Course.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCourse(id: string) {
    return Course.findByIdAndDelete(id);
  }

  // Subjects
  async getSubjects(query: { courseId?: string }) {
    const { courseId } = query;
    const filter: any = {};
    if (courseId) filter.courseId = new Types.ObjectId(courseId);
    return Subject.find(filter);
  }

  async getSubjectById(id: string) {
    return Subject.findById(id);
  }

  async createSubject(input: z.infer<typeof createSubjectSchema>) {
    const data = createSubjectSchema.parse(input);
    return Subject.create(data);
  }

  async updateSubject(
    id: string,
    input: Partial<z.infer<typeof createSubjectSchema>>,
  ) {
    const data = createSubjectSchema.partial().parse(input);
    return Subject.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteSubject(id: string) {
    return Subject.findByIdAndDelete(id);
  }

  // Batches
  async getBatches(query: {
    courseId?: string;
    teacherId?: string;
    isActive?: boolean;
  }) {
    const { courseId, teacherId, isActive } = query;
    const filter: any = {};
    if (courseId) filter.courseId = new Types.ObjectId(courseId);
    if (teacherId) filter.teacherId = new Types.ObjectId(teacherId);
    if (typeof isActive === "boolean") filter.isActive = isActive;

    return Batch.find(filter)
      .populate("courseId", "name code")
      .populate("teacherId", "fullName email");
  }

  async getBatchById(id: string) {
    return Batch.findById(id)
      .populate("courseId", "name code")
      .populate("teacherId", "fullName email");
  }

  async createBatch(input: z.infer<typeof createBatchSchema>) {
    const data = createBatchSchema.parse(input);
    return Batch.create(data);
  }

  async updateBatch(
    id: string,
    input: Partial<z.infer<typeof createBatchSchema>>,
  ) {
    const data = createBatchSchema.partial().parse(input);
    return Batch.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBatch(id: string) {
    return Batch.findByIdAndDelete(id);
  }

  // Enrollments
  async getEnrollments(query: {
    studentId?: string;
    batchId?: string;
    courseId?: string;
    status?: string;
  }) {
    const { studentId, batchId, courseId, status } = query;
    const filter: any = {};
    if (studentId) filter.studentId = new Types.ObjectId(studentId);
    if (batchId) filter.batchId = new Types.ObjectId(batchId);
    if (courseId) filter.courseId = new Types.ObjectId(courseId);
    if (status) filter.status = status;

    return Enrollment.find(filter)
      .populate("studentId", "fullName email")
      .populate("batchId", "name")
      .populate("courseId", "name code");
  }

  async getEnrollmentById(id: string) {
    return Enrollment.findById(id)
      .populate("studentId", "fullName email")
      .populate("batchId", "name")
      .populate("courseId", "name code");
  }

  async createEnrollment(input: z.infer<typeof createEnrollmentSchema>) {
    const data = createEnrollmentSchema.parse(input);
    return Enrollment.create(data);
  }

  async updateEnrollment(
    id: string,
    input: Partial<z.infer<typeof createEnrollmentSchema>>,
  ) {
    const data = createEnrollmentSchema.partial().parse(input);
    return Enrollment.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteEnrollment(id: string) {
    return Enrollment.findByIdAndDelete(id);
  }

  // Fee Plans
  async getFeePlans(query: {
    studentId?: string;
    courseId?: string;
    batchId?: string;
  }) {
    const { studentId, courseId, batchId } = query;
    const filter: any = {};
    if (studentId) filter.studentId = new Types.ObjectId(studentId);
    if (courseId) filter.courseId = new Types.ObjectId(courseId);
    if (batchId) filter.batchId = new Types.ObjectId(batchId);

    return FeePlan.find(filter)
      .populate("studentId", "fullName email")
      .populate("courseId", "name code")
      .populate("batchId", "name");
  }

  async getFeePlanById(id: string) {
    return FeePlan.findById(id)
      .populate("studentId", "fullName email")
      .populate("courseId", "name code")
      .populate("batchId", "name");
  }

  async createFeePlan(input: z.infer<typeof createFeePlanSchema>) {
    const data = createFeePlanSchema.parse(input);
    const installments = data.installments.map((i) => ({
      dueDate: new Date(i.dueDate),
      amount: i.amount,
      description: i.description || "",
      paid: false,
    }));

    return FeePlan.create({ ...data, installments });
  }

  async updateFeePlan(
    id: string,
    input: Partial<z.infer<typeof createFeePlanSchema>>,
  ) {
    const data = createFeePlanSchema.partial().parse(input);
    return FeePlan.findByIdAndUpdate(id, data, { new: true });
  }

  // Payments
  async getPayments(query: { studentId?: string; feePlanId?: string }) {
    const { studentId, feePlanId } = query;
    const filter: any = {};
    if (studentId) filter.studentId = new Types.ObjectId(studentId);
    if (feePlanId) filter.feePlanId = new Types.ObjectId(feePlanId);

    return Payment.find(filter)
      .populate("studentId", "fullName email")
      .populate("feePlanId", "totalAmount");
  }

  async createPayment(input: z.infer<typeof createPaymentSchema>) {
    const data = createPaymentSchema.parse(input);
    const payment = await Payment.create(data);

    const feePlan = await FeePlan.findById(data.feePlanId);
    if (feePlan && feePlan.installments[data.installmentIndex]) {
      feePlan.installments[data.installmentIndex].paid = true;
      await feePlan.save();
    }

    return payment;
  }

  // Notifications
  async createNotification(input: z.infer<typeof createNotificationSchema>) {
    const data = createNotificationSchema.parse(input);
    return Notification.create(data);
  }

  async createBulkNotifications(input: z.infer<typeof bulkNotificationSchema>) {
    const data = bulkNotificationSchema.parse(input);
    const notifications = data.userIds.map((userId) => ({
      userId: new Types.ObjectId(userId),
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: false,
    }));

    return Notification.insertMany(notifications);
  }
}

export const adminService = new AdminService();
