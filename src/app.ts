import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

/* =========================
   HELMET
========================= */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

/* =========================
   BODY PARSERS
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   REQUEST LOGGER
========================= */

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   STATIC FILES
========================= */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "OK",
  });
});

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

export default app;
