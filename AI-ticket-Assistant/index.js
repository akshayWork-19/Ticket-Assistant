import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import { serve } from "inngest/express";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/tickets.js";
import { inngest } from "./inngest/client.js";
import { onTicketCreation } from "./inngest/inngest-Functions/on-ticketCreated.js";
import { onUserSignup } from "./inngest/inngest-Functions/on-signup.js";
import { configDotenv } from "dotenv";


configDotenv();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173" }));

app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreation]
  })
)


app.use((err, _, res, _) => {

  console.error("🔥 Global Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err

  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected✅ :: `)
    app.listen(PORT, () => console.log(`🚀Server at http://localhost:${PORT}`))

  })
  .catch((err) => console.error(`❌ MongoDB error :: ${err} `))
