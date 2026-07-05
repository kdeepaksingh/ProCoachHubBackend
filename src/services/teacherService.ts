import { Types } from "mongoose";
import { z } from "zod";

import { Enrollment } from "../models/studentModel/Enrollment";
import { Batch } from "../models/studentModel/Batch";
import { Test } from "../models/studentModel/Test";
import { Attendance } from "../models/studentModel/Attendance";
import { Assignment } from "../models/studentModel/Assignment";
import { Notification } from "../models/studentModel/Notification";
import { TestResult } from "../models/studentModel/TestResult";

const markAttendanceSchema = z.object({
  batchId: z.string(),
  date: z.string(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["present", "absent", "late"]),
    }),
  ),
});

const createAssignmentSchema = z.object({
  batchId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["assignment", "note", "material"]).optional(),
  attachmentUrl: z.string().optional(),
  dueDate: z.string().optional(),
});

const createTestSchema = z.object({
  batchId: z.string(),
  title: z.string().min(2),
  type: z.enum(["mock", "chapter", "full"]),
  subjectId: z.string().optional(),
  scheduledAt: z.string(),
  durationMinutes: z.number().int().positive(),
  maxMarks: z.number().int().positive(),
  link: z.string().optional(),
});

const createTestResultSchema = z.object({
  testId: z.string(),
  studentId: z.string(),
  marksObtained: z.number().int().min(0),
});

const bulkTestResultsSchema = z.object({
  testId: z.string(),
  results: z.array(
    z.object({
      studentId: z.string(),
      marksObtained: z.number().int().min(0),
    }),
  ),
});

const createNotificationSchema = z.object({
  batchId: z.string(),
  title: z.string().min(2),
  message: z.string().min(2),
  type: z.enum(["system", "fee", "class", "exam", "announcement"]),
});

export class TeacherService {
  async getDashboard(teacherId: string) {
    const batches = await Batch.find({
      teacherId: new Types.ObjectId(teacherId),
    })
      .populate("courseId", "name code")
      .populate("subjects", "name");

    const batchIds = batches.map((b) => b._id);

    const enrollments = await Enrollment.find({
      batchId: { $in: batchIds },
    });
    const totalStudents = enrollments.length;

    const upcomingTests = await Test.find({
      batchId: { $in: batchIds },
      scheduledAt: { $gte: new Date() },
    })
      .sort({ scheduledAt: 1 })
      .limit(5)
      .populate("batchId", "name");

    return {
      batches,
      totalStudents,
      upcomingTests,
    };
  }

  async getMyBatches(teacherId: string) {
    return Batch.find({ teacherId: new Types.ObjectId(teacherId) })
      .populate("courseId", "name code")
      .populate("subjects", "name");
  }

  async getBatchById(teacherId: string, batchId: string) {
    return Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    })
      .populate("courseId", "name code")
      .populate("subjects", "name");
  }

  async getStudentsByBatch(teacherId: string, batchId: string) {
    const batch = await Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) return [];

    const enrollments = await Enrollment.find({
      batchId: new Types.ObjectId(batchId),
    })
      .populate("studentId", "fullName email phone")
      .populate("courseId", "name code");

    return enrollments.map((e) => ({
      enrollment: e,
      student: e.studentId,
      course: e.courseId,
    }));
  }

  async getAttendance(
    teacherId: string,
    query: { batchId: string; from?: string; to?: string },
  ) {
    const { batchId, from, to } = query;

    const batch = await Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) return [];

    const filter: any = { batchId: new Types.ObjectId(batchId) };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    return Attendance.find(filter).populate("batchId", "name");
  }

  async markAttendance(
    teacherId: string,
    input: z.infer<typeof markAttendanceSchema>,
  ) {
    const data = markAttendanceSchema.parse(input);
    const { batchId, date, records } = data;

    const batch = await Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Batch not found or not authorized");

    const attendance = await Attendance.findOne({
      batchId: new Types.ObjectId(batchId),
      date: new Date(date),
    });

    if (attendance) {
      attendance.records = records.map((r) => ({
        studentId: new Types.ObjectId(r.studentId),
        status: r.status,
      }));
      attendance.markedBy = new Types.ObjectId(teacherId);
      attendance.markedAt = new Date();
      await attendance.save();
      return attendance;
    }

    return Attendance.create({
      batchId: new Types.ObjectId(batchId),
      date: new Date(date),
      records: records.map((r) => ({
        studentId: new Types.ObjectId(r.studentId),
        status: r.status,
      })),
      markedBy: new Types.ObjectId(teacherId),
      markedAt: new Date(),
    });
  }

  async getAssignments(teacherId: string, query: { batchId?: string }) {
    const { batchId } = query;
    const filter: any = {};

    if (batchId) {
      const batch = await Batch.findOne({
        _id: new Types.ObjectId(batchId),
        teacherId: new Types.ObjectId(teacherId),
      });
      if (!batch) return [];
      filter.batchId = new Types.ObjectId(batchId);
    } else {
      const batches = await Batch.find({
        teacherId: new Types.ObjectId(teacherId),
      }).select("_id");
      const batchIds = batches.map((b) => b._id);
      filter.batchId = { $in: batchIds };
    }

    return Assignment.find(filter).populate("batchId", "name");
  }

  async createAssignment(
    teacherId: string,
    input: z.infer<typeof createAssignmentSchema>,
  ) {
    const data = createAssignmentSchema.parse(input);
    const { batchId } = data;

    const batch = await Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Batch not found or not authorized");

    return Assignment.create({
      ...data,
      postedBy: new Types.ObjectId(teacherId),
    });
  }

  async updateAssignment(
    teacherId: string,
    id: string,
    input: Partial<z.infer<typeof createAssignmentSchema>>,
  ) {
    const assignment = await Assignment.findById(id);
    if (!assignment) return null;

    const batch = await Batch.findOne({
      _id: assignment.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Not authorized");

    const data = createAssignmentSchema.partial().parse(input);
    return Assignment.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteAssignment(teacherId: string, id: string) {
    const assignment = await Assignment.findById(id);
    if (!assignment) return null;

    const batch = await Batch.findOne({
      _id: assignment.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Not authorized");

    return Assignment.findByIdAndDelete(id);
  }

  async getTests(teacherId: string, query: { batchId?: string }) {
    const { batchId } = query;
    const filter: any = {};

    if (batchId) {
      const batch = await Batch.findOne({
        _id: new Types.ObjectId(batchId),
        teacherId: new Types.ObjectId(teacherId),
      });
      if (!batch) return [];
      filter.batchId = new Types.ObjectId(batchId);
    } else {
      const batches = await Batch.find({
        teacherId: new Types.ObjectId(teacherId),
      }).select("_id");
      const batchIds = batches.map((b) => b._id);
      filter.batchId = { $in: batchIds };
    }

    return Test.find(filter)
      .populate("batchId", "name")
      .populate("subjectId", "name");
  }

  async createTest(teacherId: string, input: z.infer<typeof createTestSchema>) {
    const data = createTestSchema.parse(input);
    const { batchId } = data;

    const batch = await Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Batch not found or not authorized");

    return Test.create(data);
  }

  async updateTest(
    teacherId: string,
    id: string,
    input: Partial<z.infer<typeof createTestSchema>>,
  ) {
    const test = await Test.findById(id);
    if (!test) return null;

    const batch = await Batch.findOne({
      _id: test.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Not authorized");

    const data = createTestSchema.partial().parse(input);
    return Test.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTest(teacherId: string, id: string) {
    const test = await Test.findById(id);
    if (!test) return null;

    const batch = await Batch.findOne({
      _id: test.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Not authorized");

    return Test.findByIdAndDelete(id);
  }

  async getTestResults(teacherId: string, query: { testId: string }) {
    const { testId } = query;

    const test = await Test.findById(testId);
    if (!test) return [];

    const batch = await Batch.findOne({
      _id: test.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) return [];

    return TestResult.find({ testId: new Types.ObjectId(testId) })
      .populate("testId", "title maxMarks")
      .populate("studentId", "fullName email");
  }

  async createTestResult(
    teacherId: string,
    input: z.infer<typeof createTestResultSchema>,
  ) {
    const data = createTestResultSchema.parse(input);
    const { testId } = data;

    const test = await Test.findById(testId);
    if (!test) throw new Error("Test not found");

    const batch = await Batch.findOne({
      _id: test.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Not authorized");

    return TestResult.create(data);
  }

  async createBulkTestResults(
    teacherId: string,
    input: z.infer<typeof bulkTestResultsSchema>,
  ) {
    const data = bulkTestResultsSchema.parse(input);
    const { testId, results } = data;

    const test = await Test.findById(testId);
    if (!test) throw new Error("Test not found");

    const batch = await Batch.findOne({
      _id: test.batchId,
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Not authorized");

    const docs = results.map((r) => ({
      testId: new Types.ObjectId(testId),
      studentId: new Types.ObjectId(r.studentId),
      marksObtained: r.marksObtained,
    }));

    return TestResult.insertMany(docs);
  }

  async createNotification(
    teacherId: string,
    input: z.infer<typeof createNotificationSchema>,
  ) {
    const data = createNotificationSchema.parse(input);
    const { batchId } = data;

    const batch = await Batch.findOne({
      _id: new Types.ObjectId(batchId),
      teacherId: new Types.ObjectId(teacherId),
    });
    if (!batch) throw new Error("Batch not found or not authorized");

    const enrollments = await Enrollment.find({
      batchId: new Types.ObjectId(batchId),
    }).select("studentId");
    const userIds = enrollments.map((e) => e.studentId);

    const notifications = userIds.map((userId) => ({
      userId,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: false,
    }));

    return Notification.insertMany(notifications);
  }
}

export const teacherService = new TeacherService();
