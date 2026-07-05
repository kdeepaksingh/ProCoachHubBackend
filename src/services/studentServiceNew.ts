import { Types } from "mongoose";
import { z } from "zod";
import User from "../models/User";
import { Enrollment } from "../models/studentModel/Enrollment";
import { Test } from "../models/studentModel/Test";
import { FeePlan } from "../models/studentModel/FeePlan";
import { Assignment } from "../models/studentModel/Assignment";
import { TestResult } from "../models/studentModel/TestResult";
import { Payment } from "../models/studentModel/Payment";
import { Attendance } from "../models/studentModel/Attendance";

const updateProfileSchema = z.object({
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

export class StudentService {
  async getDashboard(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
      status: "active",
    })
      .populate("batchId", "name schedule")
      .populate("courseId", "name code");

    const totalBatches = enrollments.length;
    const batchIds = enrollments.map((e) => e.batchId._id);

    const now = new Date();
    const upcomingClasses = await Batch.find({
      _id: { $in: batchIds },
      isActive: true,
    })
      .populate("courseId", "name")
      .limit(5);

    const tests = await Test.find({
      batchId: { $in: batchIds },
      scheduledAt: { $gte: now },
    })
      .sort({ scheduledAt: 1 })
      .limit(5);

    const attendanceRecords = await Attendance.find({
      batchId: { $in: batchIds },
    });

    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach((record) => {
      record.records.forEach((r) => {
        if (r.studentId.toString() === studentId) {
          totalDays += 1;
          if (r.status === "present" || r.status === "late") {
            presentDays += 1;
          }
        }
      });
    });

    const attendancePercentage =
      totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

    const feePlans = await FeePlan.find({
      studentId: new Types.ObjectId(studentId),
    });

    let totalAmount = 0;
    let paidAmount = 0;

    feePlans.forEach((fp) => {
      totalAmount += fp.totalAmount;
      fp.installments.forEach((inst) => {
        if (inst.paid) paidAmount += inst.amount;
      });
    });

    const pendingAmount = totalAmount - paidAmount;

    return {
      totalBatches,
      upcomingClasses,
      recentTests: tests,
      attendanceSummary: {
        totalDays,
        presentDays,
        percentage: attendancePercentage,
      },
      feeSummary: {
        totalAmount,
        paidAmount,
        pendingAmount,
      },
    };
  }

  async getMyCourses(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
    }).populate("courseId", "name code durationMonths isActive");

    return enrollments.map((e) => e.courseId);
  }

  async getMyBatches(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
    })
      .populate(
        "batchId",
        "name courseId startTime endTime schedule maxStudents enrolledCount isActive",
      )
      .populate("courseId", "name code");

    return enrollments.map((e) => ({
      enrollment: e,
      batch: e.batchId,
      course: e.courseId,
    }));
  }

  async getMySchedule(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
      status: "active",
    }).populate("batchId", "name courseId startTime endTime schedule");

    return enrollments.map((e) => ({
      batchName: e.batchId.name,
      course: (e.batchId.courseId as any)?.name || "",
      startTime: e.batchId.startTime,
      endTime: e.batchId.endTime,
      schedule: e.batchId.schedule,
    }));
  }

  async getMyAttendance(
    studentId: string,
    query: { from?: string; to?: string },
  ) {
    const { from, to } = query;

    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
    }).select("batchId");

    const batchIds = enrollments.map((e) => e.batchId);

    const filter: any = { batchId: { $in: batchIds } };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const records = await Attendance.find(filter).populate("batchId", "name");

    const result = records.flatMap((r) =>
      r.records
        .filter((rec) => rec.studentId.toString() === studentId)
        .map((rec) => ({
          date: r.date,
          batchName: r.batchId.name,
          status: rec.status,
        })),
    );

    return result;
  }

  async getMyAssignments(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
    }).select("batchId");

    const batchIds = enrollments.map((e) => e.batchId);

    const assignments = await Assignment.find({
      batchId: { $in: batchIds },
    }).populate("batchId", "name");

    return assignments.map((a) => ({
      _id: a._id,
      batchId: a.batchId,
      title: a.title,
      description: a.description,
      type: a.type,
      attachmentUrl: a.attachmentUrl,
      dueDate: a.dueDate,
      postedAt: a.postedAt,
    }));
  }

  async getMyTests(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
    }).select("batchId");

    const batchIds = enrollments.map((e) => e.batchId);

    const tests = await Test.find({
      batchId: { $in: batchIds },
    }).populate("batchId", "name");

    return tests.map((t) => ({
      _id: t._id,
      batchId: t.batchId,
      title: t.title,
      type: t.type,
      scheduledAt: t.scheduledAt,
      durationMinutes: t.durationMinutes,
      maxMarks: t.maxMarks,
      link: t.link,
    }));
  }

  async getMyTestResults(studentId: string) {
    const results = await TestResult.find({
      studentId: new Types.ObjectId(studentId),
    })
      .populate("testId", "title type maxMarks")
      .populate({
        path: "testId",
        populate: {
          path: "batchId",
          select: "name",
        },
      });

    return results.map((r: any) => ({
      testTitle: r.testId.title,
      testType: r.testId.type,
      batchName: r.testId.batchId?.name || "",
      maxMarks: r.testId.maxMarks,
      marksObtained: r.marksObtained,
      submittedAt: r.submittedAt,
    }));
  }

  async getPerformanceReport(studentId: string) {
    const enrollments = await Enrollment.find({
      studentId: new Types.ObjectId(studentId),
    }).select("batchId");

    const batchIds = enrollments.map((e) => e.batchId);

    const attendanceRecords = await Attendance.find({
      batchId: { $in: batchIds },
    });

    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach((record) => {
      record.records.forEach((r) => {
        if (r.studentId.toString() === studentId) {
          totalDays += 1;
          if (r.status === "present" || r.status === "late") {
            presentDays += 1;
          }
        }
      });
    });

    const attendancePercentage =
      totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

    const results = await TestResult.find({
      studentId: new Types.ObjectId(studentId),
    }).populate("testId", "maxMarks");

    let totalTests = results.length;
    let totalMarksObtained = 0;
    let totalMaxMarks = 0;

    results.forEach((r) => {
      totalMarksObtained += r.marksObtained;
      totalMaxMarks += (r.testId as any).maxMarks || 0;
    });

    const averagePercentage =
      totalMaxMarks === 0 ? 0 : (totalMarksObtained / totalMaxMarks) * 100;

    return {
      attendance: {
        totalDays,
        presentDays,
        percentage: attendancePercentage,
      },
      tests: {
        totalTests,
        totalMarksObtained,
        totalMaxMarks,
        averagePercentage: Math.round(averagePercentage * 10) / 10,
      },
    };
  }

  async getMyFeePlans(studentId: string) {
    return FeePlan.find({
      studentId: new Types.ObjectId(studentId),
    })
      .populate("courseId", "name code")
      .populate("batchId", "name");
  }

  async getMyPayments(studentId: string) {
    return Payment.find({
      studentId: new Types.ObjectId(studentId),
    }).populate("feePlanId", "totalAmount");
  }

  async getNotifications(
    studentId: string,
    query: { limit?: number; unreadOnly?: boolean },
  ) {
    const { limit = 20, unreadOnly } = query;
    const filter: any = { userId: new Types.ObjectId(studentId) };
    if (unreadOnly) filter.isRead = false;

    return Notification.find(filter).sort({ createdAt: -1 }).limit(limit);
  }

  async markNotificationRead(studentId: string, notificationId: string) {
    return Notification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(studentId),
      },
      { isRead: true },
      { new: true },
    );
  }

  async markAllNotificationsRead(studentId: string) {
    return Notification.updateMany(
      { userId: new Types.ObjectId(studentId), isRead: false },
      { isRead: true },
    );
  }

  async getStudentProfile(studentId: string) {
    return User.findById(studentId).select("-passwordHash");
  }

  async updateStudentProfile(
    studentId: string,
    input: z.infer<typeof updateProfileSchema>,
  ) {
    const data = updateProfileSchema.parse(input);
    return User.findByIdAndUpdate(studentId, data, {
      new: true,
    }).select("-passwordHash");
  }
}

export const studentService = new StudentService();
