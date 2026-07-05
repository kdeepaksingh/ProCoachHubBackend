import { type Response, type NextFunction } from "express";
import { type AuthRequest } from "../interface/auth.interface";
import { adminService } from "../services/adminService";

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await adminService.getUsers({
      role: req.query.role as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      search: req.query.search as string,
    });

    res.json({ success: true, message: "Users fetched", data: result });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const user = await adminService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "User fetched", data: user });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await adminService.createUser(req.body);
    res.json({ success: true, message: "User created", data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const user = await adminService.updateUser(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "User updated", data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const user = await adminService.deleteUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

// Courses
export const getCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses = await adminService.getCourses({
      isActive:
        req.query.isActive === "true"
          ? true
          : req.query.isActive === "false"
            ? false
            : undefined,
      search: req.query.search as string,
    });
    res.json({ success: true, message: "Courses fetched", data: courses });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const course = await adminService.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ success: true, message: "Course fetched", data: course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await adminService.createCourse(req.body);
    res.json({ success: true, message: "Course created", data: course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const course = await adminService.updateCourse(id, req.body);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ success: true, message: "Course updated", data: course });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const course = await adminService.deleteCourse(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

// Subjects
export const getSubjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subjects = await adminService.getSubjects({
      courseId: req.query.courseId as string,
    });
    res.json({ success: true, message: "Subjects fetched", data: subjects });
  } catch (err) {
    next(err);
  }
};

export const getSubjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const subject = await adminService.getSubjectById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject fetched", data: subject });
  } catch (err) {
    next(err);
  }
};

export const createSubject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subject = await adminService.createSubject(req.body);
    res.json({ success: true, message: "Subject created", data: subject });
  } catch (err) {
    next(err);
  }
};

export const updateSubject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const subject = await adminService.updateSubject(id, req.body);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject updated", data: subject });
  } catch (err) {
    next(err);
  }
};

export const deleteSubject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const subject = await adminService.deleteSubject(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ success: true, message: "Subject deleted" });
  } catch (err) {
    next(err);
  }
};

// Batches
export const getBatches = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const batches = await adminService.getBatches({
      courseId: req.query.courseId as string,
      teacherId: req.query.teacherId as string,
      isActive:
        req.query.isActive === "true"
          ? true
          : req.query.isActive === "false"
            ? false
            : undefined,
    });
    res.json({ success: true, message: "Batches fetched", data: batches });
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
    const { id } = req.params as { id: string }; // Fixed
    const batch = await adminService.getBatchById(id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json({ success: true, message: "Batch fetched", data: batch });
  } catch (err) {
    next(err);
  }
};

export const createBatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const batch = await adminService.createBatch(req.body);
    res.json({ success: true, message: "Batch created", data: batch });
  } catch (err) {
    next(err);
  }
};

export const updateBatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const batch = await adminService.updateBatch(id, req.body);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json({ success: true, message: "Batch updated", data: batch });
  } catch (err) {
    next(err);
  }
};

export const deleteBatch = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const batch = await adminService.deleteBatch(id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json({ success: true, message: "Batch deleted" });
  } catch (err) {
    next(err);
  }
};

// Enrollments
export const getEnrollments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const enrollments = await adminService.getEnrollments({
      studentId: req.query.studentId as string,
      batchId: req.query.batchId as string,
      courseId: req.query.courseId as string,
      status: req.query.status as string,
    });
    res.json({
      success: true,
      message: "Enrollments fetched",
      data: enrollments,
    });
  } catch (err) {
    next(err);
  }
};

export const getEnrollmentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const enrollment = await adminService.getEnrollmentById(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json({
      success: true,
      message: "Enrollment fetched",
      data: enrollment,
    });
  } catch (err) {
    next(err);
  }
};

export const createEnrollment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const enrollment = await adminService.createEnrollment(req.body);
    res.json({
      success: true,
      message: "Enrollment created",
      data: enrollment,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEnrollment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const enrollment = await adminService.updateEnrollment(id, req.body);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json({
      success: true,
      message: "Enrollment updated",
      data: enrollment,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEnrollment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const enrollment = await adminService.deleteEnrollment(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json({
      success: true,
      message: "Enrollment deleted",
    });
  } catch (err) {
    next(err);
  }
};

// Fee Plans
export const getFeePlans = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feePlans = await adminService.getFeePlans({
      studentId: req.query.studentId as string,
      courseId: req.query.courseId as string,
      batchId: req.query.batchId as string,
    });
    res.json({
      success: true,
      message: "Fee plans fetched",
      data: feePlans,
    });
  } catch (err) {
    next(err);
  }
};

export const getFeePlanById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const feePlan = await adminService.getFeePlanById(id);
    if (!feePlan) {
      return res.status(404).json({ message: "Fee plan not found" });
    }
    res.json({
      success: true,
      message: "Fee plan fetched",
      data: feePlan,
    });
  } catch (err) {
    next(err);
  }
};

export const createFeePlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feePlan = await adminService.createFeePlan(req.body);
    res.json({
      success: true,
      message: "Fee plan created",
      data: feePlan,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFeePlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // Fixed
    const feePlan = await adminService.updateFeePlan(id, req.body);
    if (!feePlan) {
      return res.status(404).json({ message: "Fee plan not found" });
    }
    res.json({
      success: true,
      message: "Fee plan updated",
      data: feePlan,
    });
  } catch (err) {
    next(err);
  }
};

// Payments
export const getPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payments = await adminService.getPayments({
      studentId: req.query.studentId as string,
      feePlanId: req.query.feePlanId as string,
    });
    res.json({
      success: true,
      message: "Payments fetched",
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

export const createPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payment = await adminService.createPayment(req.body);
    res.json({
      success: true,
      message: "Payment created",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

// Notifications
export const createNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notification = await adminService.createNotification(req.body);
    res.json({
      success: true,
      message: "Notification created",
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

export const createBulkNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notifications = await adminService.createBulkNotifications(req.body);
    res.json({
      success: true,
      message: "Bulk notifications created",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};
