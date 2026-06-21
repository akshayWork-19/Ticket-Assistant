import winston from "winston";
import config from "../config/config.js"

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}:${stack || message}`
});

const logger = winston.createLogger({
    level: config.nodeEnv === "development" ? "debug" : "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        config.nodeEnv === "development" ? colorize() : winston.format.uncolorize(),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ]
})

export default logger;