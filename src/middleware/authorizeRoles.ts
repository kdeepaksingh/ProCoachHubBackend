import { RequestHandler } from "express";
import { UserRole } from "../types/auth.types";
import { AuthRequest } from "../interface/auth.interface";

export const authorizeRoles =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req, res, next) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };

// // src/routes/adminRoutes.ts
// import { Router } from "express";
// import { authMiddleware } from "../middleware/authMiddleware";
// import { authorizeRoles } from "../middleware/authorizeRoles";

// const router = Router();

// router.use(authMiddleware);

// // Only admin
// router.get("/dashboard", authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Admin dashboard" });
// });

// // Admin and teacher
// router.get("/reports", authorizeRoles("admin", "teacher"), (req, res) => {
//   res.json({ message: "Reports data" });
// });

// router.get("/dashboard", authorizeRoles("student"), getStudentDashboard);
// router.get("/dashboard", authorizeRoles("teacher"), getTeacherDashboard);

// export default router;
