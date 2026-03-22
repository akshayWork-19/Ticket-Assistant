import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SMTP_USER,
            to,
            subject, text
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Email Error:", error.message);
    }
}