import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;
if (smtpHost && smtpUser) {
  transporter = nodemailer.createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user: smtpUser, pass: smtpPass } });
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!transporter) throw new Error("SMTP not configured");
  const info = await transporter.sendMail({ from: process.env.SMTP_FROM || smtpUser, to, subject, text, html });
  return info;
}
