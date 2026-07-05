import { Response, NextFunction } from "express";
import { AuthRequest } from "../interface/auth.interface";
import { studentService } from "../services/studentService";

export const getStudentDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user.id;
    const dashboard = await studentService.getDashboard(studentId);

    res.json({
      success: true,
      message: "Student dashboard data fetched",
      data: dashboard,
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
    const courses = await studentService.getMyCourses(studentId);
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
    const batches = await studentService.getMyBatches(studentId);

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
    const schedule = await studentService.getMySchedule(studentId);

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
    const attendance = await studentService.getMyAttendance(studentId, {
      from: req.query.from as string,
      to: req.query.to as string,
    });

    res.json({
      success: true,
      message: "Attendance fetched",
      data: attendance,
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
    const assignments = await studentService.getMyAssignments(studentId);

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
    const tests = await studentService.getMyTests(studentId);

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
    const results = await studentService.getMyTestResults(studentId);

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
    const feePlans = await studentService.getMyFeePlans(studentId);

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
    const payments = await studentService.getMyPayments(studentId);

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

    const notifications = await studentService.getNotifications(studentId, {
      limit,
      unreadOnly,
    });

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
    const notification = await studentService.markNotificationRead(
      studentId,
      req.params.id,
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
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
    const profile = await studentService.getStudentProfile(studentId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      success: true,
      message: "Profile fetched",
      data: profile,
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
    const profile = await studentService.updateStudentProfile(
      studentId,
      req.body,
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      success: true,
      message: "Profile updated",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};
