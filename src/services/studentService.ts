import { RequestHandler } from "express";
import { z } from "zod";
import User from "../models/User";
import { Enrollment } from "../models/studentModel/Enrollment";
import { Test } from "../models/studentModel/Test";
import { FeePlan } from "../models/studentModel/FeePlan";
import { Course } from "../models/studentModel/Course";
import { Assignment } from "../models/studentModel/Assignment";
import { TestResult } from "../models/studentModel/TestResult";
import { Payment } from "../models/studentModel/Payment";
import { Notification } from "../models/studentModel/Notification";
import { Attendance } from "../models/studentModel/Attendance";

const dateRangeSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

const profileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  coachingInterest: z.string().optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  bio: z.string().optional(),
  qualification: z.string().optional(),
  organizationName: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export interface DashboardData {
  totalBatches: number;
  upcomingClasses: any[];
  recentTests: any[];
  attendanceSummary: {
    totalDays: number;
    presentDays: number;
    percentage: number;
  };
  feeSummary: {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
  };
}

export interface AttendanceRecord {
  date: Date;
  batchName: string;
  status: "present" | "absent" | "late";
}

export interface TestResultRow {
  testTitle: string;
  testType: string;
  batchName?: string;
  maxMarks: number;
  marksObtained: number;
  submittedAt: Date;
}

export interface PerformanceReport {
  attendance: {
    totalDays: number;
    presentDays: number;
    percentage: number;
  };
  tests: {
    totalTests: number;
    averagePercentage: number;
    totalMarksObtained: number;
    totalMaxMarks: number;
  };
}

export class StudentService {
  // ============ Dashboard ============

  async getDashboard(studentId: string): Promise<DashboardData> {
    const enrollments = await Enrollment.find({ studentId, status: "active" })
      .populate("batchId", "name startTime endTime schedule")
      .populate("courseId", "name code");

    const now = new Date();
    const upcomingClasses = enrollments
      .map((e) => e.batchId as any)
      .filter((b: any) => b && new Date(b.endTime) >= now)
      .slice(0, 5)
      .map((b: any) => ({
        batchName: b.name,
        courseName: (b.courseId as any)?.name,
        startTime: b.startTime,
        endTime: b.endTime,
        schedule: b.schedule,
      }));

    const recentTests = await Test.find({
      batchId: { $in: enrollments.map((e) => e.batchId) },
    })
      .sort({ scheduledAt: -1 })
      .limit(3)
      .populate("subjectId", "name");

    const attRecords = await Attendance.find({
      batchId: { $in: enrollments.map((e) => e.batchId) },
      "records.studentId": studentId,
    });

    const totalDays = attRecords.length;
    const presentDays = attRecords.filter((r: any) =>
      r.records.some(
        (rec: any) =>
          rec.studentId.toString() === studentId &&
          ["present", "late"].includes(rec.status),
      ),
    ).length;

    const attendancePercentage = totalDays
      ? (presentDays / totalDays) * 100
      : 0;

    const feePlans = await FeePlan.find({ studentId });
    const totalAmount = feePlans.reduce((sum, fp) => sum + fp.totalAmount, 0);
    const paidAmount = feePlans.reduce((sum, fp) => {
      const paidInPlan = fp.installments
        .filter((i) => i.paid)
        .reduce((s, i) => s + i.amount, 0);
      return sum + paidInPlan;
    }, 0);
    const pendingAmount = totalAmount - paidAmount;

    return {
      totalBatches: enrollments.length,
      upcomingClasses,
      recentTests: recentTests || [],
      attendanceSummary: {
        totalDays,
        presentDays,
        percentage: Math.round(attendancePercentage * 100) / 100,
      },
      feeSummary: {
        totalAmount,
        paidAmount,
        pendingAmount,
      },
    };
  }

  // ============ Courses & Batches ============

  async getCourses(studentId: string) {
    const enrollments = await Enrollment.find({ studentId }).distinct(
      "courseId",
    );
    return Course.find({ _id: { $in: enrollments } });
  }

  async getBatches(studentId: string) {
    const enrollments = await Enrollment.find({ studentId })
      .populate("batchId")
      .populate("courseId", "name code");

    return enrollments.map((e) => ({
      enrollment: e,
      batch: e.batchId,
      course: (e.courseId as any) || null,
    }));
  }

  async getSchedule(studentId: string) {
    const now = new Date();

    const enrollments = await Enrollment.find({
      studentId,
      status: "active",
    }).populate({
      path: "batchId",
      select: "name startTime endTime schedule",
      populate: { path: "courseId", select: "name code" },
    });

    const schedule = enrollments
      .map((e) => e.batchId as any)
      .filter((b: any) => b && new Date(b.endTime) >= now)
      .map((b: any) => ({
        batchName: b.name,
        course: (b.courseId as any)?.name,
        startTime: b.startTime,
        endTime: b.endTime,
        schedule: b.schedule,
      }));

    return schedule;
  }

  // ============ Attendance ============

  async getAttendance(
    studentId: string,
    query?: { from?: string; to?: string },
  ) {
    const parsed = dateRangeSchema.parse(query || {});

    const enrollments = await Enrollment.find({ studentId }).select("batchId");
    const batchIds = enrollments.map((e) => e.batchId);

    let filter: any = {
      batchId: { $in: batchIds },
      "records.studentId": studentId,
    };

    if (parsed.from)
      filter.date = { ...filter.date, $gte: new Date(parsed.from) };
    if (parsed.to) filter.date = { ...filter.date, $lte: new Date(parsed.to) };

    const records = await Attendance.find(filter).populate("batchId", "name");

    const attendanceList: AttendanceRecord[] = records.map((att: any) => {
      const record = att.records.find(
        (r: any) => r.studentId.toString() === studentId,
      );
      return {
        date: att.date,
        batchName: att.batchId?.name || "",
        status: record?.status || "absent",
      };
    });

    return attendanceList;
  }

  // ============ Assignments ============

  async getAssignments(studentId: string) {
    const enrollments = await Enrollment.find({ studentId }).select("batchId");
    const batchIds = enrollments.map((e) => e.batchId);

    return Assignment.find({ batchId: { $in: batchIds } })
      .sort({ postedAt: -1 })
      .populate("batchId", "name");
  }

  // ============ Tests ============

  async getTests(studentId: string) {
    const enrollments = await Enrollment.find({ studentId }).select("batchId");
    const batchIds = enrollments.map((e) => e.batchId);

    return Test.find({ batchId: { $in: batchIds } })
      .sort({ scheduledAt: -1 })
      .populate("subjectId", "name")
      .populate("batchId", "name");
  }

  async getTestResults(studentId: string): Promise<TestResultRow[]> {
    const results = await TestResult.find({ studentId })
      .sort({ submittedAt: -1 })
      .populate({
        path: "testId",
        select: "title type maxMarks batchId",
        populate: { path: "batchId", select: "name" },
      });

    return results.map((r: any) => ({
      testTitle: r.testId?.title,
      testType: r.testId?.type,
      batchName: r.testId?.batchId?.name,
      maxMarks: r.testId?.maxMarks,
      marksObtained: r.marksObtained,
      submittedAt: r.submittedAt,
    }));
  }

  // ============ Performance ============

  async getPerformanceReport(studentId: string): Promise<PerformanceReport> {
    const enrollments = await Enrollment.find({ studentId }).select("batchId");
    const batchIds = enrollments.map((e) => e.batchId);

    const attRecords = await Attendance.find({
      batchId: { $in: batchIds },
      "records.studentId": studentId,
    });
    const totalDays = attRecords.length;
    const presentDays = attRecords.filter((r: any) =>
      r.records.some(
        (rec: any) =>
          rec.studentId.toString() === studentId &&
          ["present", "late"].includes(rec.status),
      ),
    ).length;
    const attendancePercentage = totalDays
      ? (presentDays / totalDays) * 100
      : 0;

    const results = await TestResult.find({ studentId }).populate(
      "testId",
      "maxMarks",
    );
    const totalTests = results.length;
    const totalMaxMarks = results.reduce(
      (sum, r: any) => sum + (r.testId as any)?.maxMarks || 0,
      0,
    );
    const totalObtained = results.reduce((sum, r) => sum + r.marksObtained, 0);
    const averagePercentage = totalMaxMarks
      ? (totalObtained / totalMaxMarks) * 100
      : 0;

    return {
      attendance: {
        totalDays,
        presentDays,
        percentage: Math.round(attendancePercentage * 100) / 100,
      },
      tests: {
        totalTests,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        totalMarksObtained: totalObtained,
        totalMaxMarks,
      },
    };
  }

  // ============ Fees ============

  async getFeePlans(studentId: string) {
    return FeePlan.find({ studentId })
      .populate("courseId", "name code")
      .populate("batchId", "name");
  }

  async getPayments(studentId: string) {
    return Payment.find({ studentId })
      .sort({ paymentDate: -1 })
      .populate({
        path: "feePlanId",
        populate: { path: "courseId", select: "name code" },
      });
  }

  // ============ Notifications ============

  async getNotifications(
    studentId: string,
    limit: number = 20,
    unreadOnly: boolean = false,
  ) {
    const query: any = { userId: studentId };
    if (unreadOnly) query.isRead = false;

    return Notification.find(query).sort({ createdAt: -1 }).limit(limit);
  }

  async markNotificationRead(studentId: string, notificationId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId: studentId },
      { isRead: true },
      { new: true },
    );
  }

  async markAllNotificationsRead(studentId: string) {
    return Notification.updateMany(
      { userId: studentId, isRead: false },
      { isRead: true },
    );
  }

  // ============ Profile ============

  async getProfile(studentId: string) {
    return User.findById(studentId).select("-passwordHash");
  }

  async updateProfile(
    studentId: string,
    input: Partial<typeof profileUpdateSchema._type>,
  ) {
    const body = profileUpdateSchema.parse(input);

    const user = await User.findByIdAndUpdate(studentId, body, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    return user;
  }
}

export const studentService = new StudentService();
