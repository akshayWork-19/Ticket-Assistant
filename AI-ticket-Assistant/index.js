import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit"
import logger from "./utils/logger.js";
import { serve } from "inngest/express";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/tickets.js";
import { inngest } from "./inngest/client.js";
import { onTicketCreation } from "./inngest/inngest-Functions/on-ticketCreated.js";
import { onUserSignup } from "./inngest/inngest-Functions/on-signup.js";
import config from "./config/config.js";
import morgan from "morgan";



// configDotenv();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests from this IP,please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false
})
const PORT = process.env.PORT || 3000;
const app = express();

app.use(apiLimiter);

// console.log(process.env.ALLOWED_ORIGIN);
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));

app.use(express.json({ limit: "5mb" }));

const morganFormat = config.nodeEnv === "production" ? "combined" : "dev";
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the landing page from the public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    environment: config.nodeEnv,
    dbState: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});
app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreation]
  })
)


app.use((err, req, res, next) => {
  // Use our new logger for errors
  logger.error(`🔥 Global Error: ${err.message}`, { stack: err.stack });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: config.nodeEnv === "production" ? {} : err
  });
});
// console.log(process.env.MONGO_URI);

mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info("✅ MongoDB connected successfully!");
    app.listen(config.port, () => logger.info(`🚀 Server running at http://localhost:${config.port}`));
  })
  .catch((err) => {
    logger.error(`❌ MongoDB connection error: ${err.message}`, { stack: err.stack });
  });
