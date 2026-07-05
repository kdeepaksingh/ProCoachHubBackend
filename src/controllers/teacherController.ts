import { type Response, type NextFunction } from "express";
import { type AuthRequest } from "../interface/auth.interface";
import { teacherService } from "../services/teacherService";

export const getTeacherDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const dashboard = await teacherService.getDashboard(teacherId);

    res.json({
      success: true,
      message: "Teacher dashboard fetched",
      data: dashboard,
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
    const teacherId = req.user.id;
    const batches = await teacherService.getMyBatches(teacherId);

    res.json({
      success: true,
      message: "Batches fetched",
      data: batches,
    });
  } catch (err) {
    next(err);
  }
};

export const getBatchById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params as { id: string }; // Fixed
    const batch = await teacherService.getBatchById(teacherId, id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({
      success: true,
      message: "Batch fetched",
      data: batch,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentsByBatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const batchId = req.query.batchId as string;

    if (!batchId) {
      return res.status(400).json({ message: "batchId query param required" });
    }

    const students = await teacherService.getStudentsByBatch(
      teacherId,
      batchId,
    );

    res.json({
      success: true,
      message: "Students fetched",
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

export const getAttendance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const batchId = req.query.batchId as string;

    if (!batchId) {
      return res.status(400).json({ message: "batchId query param required" });
    }

    const attendance = await teacherService.getAttendance(teacherId, {
      batchId,
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

export const markAttendance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const attendance = await teacherService.markAttendance(teacherId, req.body);

    res.json({
      success: true,
      message: "Attendance marked",
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
};

export const getAssignments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const assignments = await teacherService.getAssignments(teacherId, {
      batchId: req.query.batchId as string,
    });

    res.json({
      success: true,
      message: "Assignments fetched",
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const assignment = await teacherService.createAssignment(
      teacherId,
      req.body,
    );

    res.json({
      success: true,
      message: "Assignment created",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAssignment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params as { id: string }; // Fixed
    const assignment = await teacherService.updateAssignment(
      teacherId,
      id,
      req.body,
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({
      success: true,
      message: "Assignment updated",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAssignment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params as { id: string }; // Fixed
    const assignment = await teacherService.deleteAssignment(teacherId, id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({
      success: true,
      message: "Assignment deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getTests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const tests = await teacherService.getTests(teacherId, {
      batchId: req.query.batchId as string,
    });

    res.json({
      success: true,
      message: "Tests fetched",
      data: tests,
    });
  } catch (err) {
    next(err);
  }
};

export const createTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const test = await teacherService.createTest(teacherId, req.body);

    res.json({
      success: true,
      message: "Test created",
      data: test,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params as { id: string }; // Fixed
    const test = await teacherService.updateTest(teacherId, id, req.body);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({
      success: true,
      message: "Test updated",
      data: test,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params as { id: string }; // Fixed
    const test = await teacherService.deleteTest(teacherId, id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({
      success: true,
      message: "Test deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getTestResults = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const testId = req.query.testId as string;

    if (!testId) {
      return res.status(400).json({ message: "testId query param required" });
    }

    const results = await teacherService.getTestResults(teacherId, { testId });

    res.json({
      success: true,
      message: "Test results fetched",
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

export const createTestResult = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const result = await teacherService.createTestResult(teacherId, req.body);

    res.json({
      success: true,
      message: "Test result created",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const createBulkTestResults = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const results = await teacherService.createBulkTestResults(
      teacherId,
      req.body,
    );

    res.json({
      success: true,
      message: "Bulk test results created",
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

export const createNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teacherId = req.user.id;
    const notifications = await teacherService.createNotification(
      teacherId,
      req.body,
    );

    res.json({
      success: true,
      message: "Notification(s) created",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};
