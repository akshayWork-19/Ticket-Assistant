// config/config.js
import "dotenv/config";

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGO_URI,
    allowedOrigin: process.env.ALLOWED_ORIGIN,
    jwtSecret: process.env.JWT_SECRET,
    groqApiKey: process.env.GROQ_API_KEY,
    mailtrapSmtpUser: process.env.MAILTRAP_SMTP_USER,
    mailtrapSmtpPass: process.env.MAILTRAP_SMTP_PASS,
};

export default config;
