import nodemailer from "nodemailer";
import { getReportEmailTemplate } from "./templates";
import { Decision } from "@/lib/db/decisions";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const fromName = process.env.MAIL_FROM_NAME || "The Unbias";

  if (!user || !pass) {
    console.warn("Gmail SMTP credentials missing. Email was logged but not sent.");
    return { ok: false, error: "SMTP credentials not configured" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { ok: true, messageId: info.messageId };
}

export async function sendDecisionAuditEmail(decision: Decision, recipientEmail: string) {
  const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/decisions/${decision.id}`;
  const template = getReportEmailTemplate(decision.title, viewUrl);

  return sendEmail({
    to: recipientEmail,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}
