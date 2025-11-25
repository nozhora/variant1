import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nozhora510@gmail.com",
    pass: "jaxx kdev nvsj hhiy",
  },
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 60000, // 60 seconds
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: "nozhora510@gmail.com",
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}

export { sendMail };
