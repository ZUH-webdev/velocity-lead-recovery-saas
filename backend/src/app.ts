import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import chalk from "chalk";
import { limiter } from "./middleware/rateLimiter";
import cors from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./config/prisma";
import { getRedisClient } from "./config/redis";

import authRoutes from "./routes/auth.routes";
import businessRoutes from "./routes/business.routes";
import leadsRoutes from "./routes/leads.routes";
import smsRoutes from "./routes/sms.routes";
import calendarRoutes from "./routes/calendar.routes";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(limiter);

// Morgan: concise colored format in dev, minimal in prod
const STATUS_COLOR = (status: number) => {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  return chalk.green(status);
};

morgan.token("status-colored", (req, res) =>
  STATUS_COLOR(res.statusCode)
);
morgan.token("method-colored", (req) => {
  const m = req.method ?? "";
  return chalk.bold.white(m.padEnd(6));
});

const devFormat =
  ":method-colored :url :status-colored :response-time ms — :res[content-length] bytes";
const prodFormat = ":method :url :status :response-time ms";

app.use(
  morgan(process.env.NODE_ENV === "production" ? prodFormat : devFormat, {
    skip: (req) => req.url === "/api/health", // don't pollute logs with health pings
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Velocity Lead Recovery API",
    endpoints: ["/api/health", "/api/auth", "/api/business", "/api/leads", "/api/sms", "/api/calendar"],
  });
});

app.get("/api/health", async (req, res) => {
  const [dbOk, redisOk] = await Promise.all([
    prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
    getRedisClient()
      .then(() => true)
      .catch(() => false),
  ]);

  const status = dbOk && redisOk ? 200 : 503;
  res.status(status).json({
    success: status === 200,
    data: {
      status: status === 200 ? "ok" : "degraded",
      services: {
        db: dbOk ? "connected" : "unreachable",
        redis: redisOk ? "connected" : "unreachable",
      },
    },
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/leads", leadsRoutes);
app.use("/api/v1/sms", smsRoutes);
app.use("/api/v1/calendar", calendarRoutes);

// ── Fallback & Error ──────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Not Found", code: "NOT_FOUND" });
});

app.use(errorHandler);

export default app;