import { Response, NextFunction } from "express";
import { studentService } from "../services/studentService";
import { z } from "zod";
import { AuthRequest } from "../interface/auth.interface";

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

export const getStudentDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = req.user.id;

    const data = await studentService.getDashboard(studentId);

    res.json({
      success: true,
      message: "Student dashboard data fetched",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const courses = await studentService.getCourses(studentId);

    res.json({
      success: true,
      message: "Courses fetched",
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyBatches = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const batches = await studentService.getBatches(studentId);

    res.json({
      success: true,
      message: "Batches fetched",
      data: batches,
    });
  } catch (err) {
    next(err);
  }
};

export const getMySchedule = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const schedule = await studentService.getSchedule(studentId);

    res.json({
      success: true,
      message: "Schedule fetched",
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyAttendance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const parsed = dateRangeSchema.parse(req.query);

    const data = await studentService.getAttendance(studentId, {
      from: parsed.from,
      to: parsed.to,
    });

    res.json({
      success: true,
      message: "Attendance fetched",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyAssignments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const assignments = await studentService.getAssignments(studentId);

    res.json({
      success: true,
      message: "Assignments fetched",
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyTests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const tests = await studentService.getTests(studentId);

    res.json({
      success: true,
      message: "Tests fetched",
      data: tests,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyTestResults = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const results = await studentService.getTestResults(studentId);

    res.json({
      success: true,
      message: "Test results fetched",
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

export const getPerformanceReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const report = await studentService.getPerformanceReport(studentId);

    res.json({
      success: true,
      message: "Performance report fetched",
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyFeePlans = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const feePlans = await studentService.getFeePlans(studentId);

    res.json({
      success: true,
      message: "Fee plans fetched",
      data: feePlans,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const payments = await studentService.getPayments(studentId);

    res.json({
      success: true,
      message: "Payments fetched",
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const limit = Number(req.query.limit) || 20;
    const unreadOnly = req.query.unreadOnly === "true";

    const notifications = await studentService.getNotifications(
      studentId,
      limit,
      unreadOnly,
    );

    res.json({
      success: true,
      message: "Notifications fetched",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    // Fix: explicitly type id as string, not string[]
    const { id } = req.params as { id: string };

    const notification = await studentService.markNotificationRead(
      studentId,
      id,
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

export const markAllNotificationsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;

    await studentService.markAllNotificationsRead(studentId);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const user = await studentService.getProfile(studentId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "Profile fetched",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStudentProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const body = profileUpdateSchema.parse(req.body);

    const user = await studentService.updateProfile(studentId, body);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
