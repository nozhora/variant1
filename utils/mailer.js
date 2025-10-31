import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "nozhora510@gmail.com",
    pass: process.env.SMTP_PASS || "jaxx kdev nvsj hhiy",
  },
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: process.env.SMTP_FROM || "user@example.com",
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}

export { sendMail };
