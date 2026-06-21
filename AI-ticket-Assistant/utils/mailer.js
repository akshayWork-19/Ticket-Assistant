import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from './logger.js';

export const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.mailtrapSmtpUser,
                pass: config.mailtrapSmtpPass,
            },
        });

        const mailOptions = {
            from: config.mailtrapSmtpUser,
            to,
            subject, text
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
        logger.error(`Email Error: ${error.message}`);
    }
}