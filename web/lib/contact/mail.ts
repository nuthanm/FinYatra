import nodemailer from "nodemailer";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSubmittedAt(): string {
  return (
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }).replace(",", "") + " IST"
  );
}

export function buildHtml(name: string, email: string, requestType: string, subject: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeRequestType = escapeHtml(requestType);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const submittedAt = escapeHtml(formatSubmittedAt());

  return `<div style="margin:0;padding:0;background-color:#f1f5f9;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a">
  <div style="width:100%;padding:24px 12px;box-sizing:border-box">
    <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #dbe2ea;border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#dbeafe,#eff6ff);border-bottom:1px solid #dbe2ea;padding:18px 22px">
        <h1 style="margin:0;font-size:20px;line-height:1.3">New FinYatra contact message</h1>
        <p style="margin:6px 0 0;font-size:13px;color:#475569">Received from the FinYatra contact form.</p>
      </div>
      <div style="padding:20px 22px">
        <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:14px">
          <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Name</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${safeName}</td></tr>
          <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Email</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none">${safeEmail}</a></td></tr>
          <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Request type</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${safeRequestType}</td></tr>
          <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Subject</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${safeSubject}</td></tr>
          <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Submitted</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${submittedAt}</td></tr>
        </table>
        <div style="margin-top:14px;padding:14px;border:1px solid #dbe2ea;border-radius:10px;background:#f8fafc;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap">${safeMessage}</div>
      </div>
      <div style="border-top:1px solid #dbe2ea;background:#f8fafc;padding:14px 22px 18px">
        <p style="margin:3px 0;font-size:12px;color:#64748b"><strong>FinYatra</strong> — free India-first finance calculators</p>
        <p style="margin:3px 0;font-size:12px;color:#64748b">Reply directly to this email to reach the sender.</p>
      </div>
    </div>
  </div>
</div>`;
}

export function buildPlainText(name: string, email: string, requestType: string, subject: string, message: string): string {
  return [
    "FinYatra contact request",
    "------------------------",
    `Name: ${name}`,
    `Email: ${email}`,
    `Request type: ${requestType}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    "---",
    "Sent via FinYatra contact form",
  ].join("\n");
}

export async function sendContactMail(
  name: string,
  email: string,
  requestType: string,
  subject: string,
  message: string,
): Promise<void> {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "") ?? "";
  const mailTo = process.env.SMTP_MAIL_TO?.trim();
  if (!user || !pass || !mailTo) {
    throw new Error("Mail server is not configured.");
  }

  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";
  const from = process.env.SMTP_FROM ?? `FinYatra <${user}>`;

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  await transporter.sendMail({
    from,
    to: mailTo,
    replyTo: email,
    subject: `[FinYatra] ${requestType}: ${subject}`,
    text: buildPlainText(name, email, requestType, subject, message),
    html: buildHtml(name, email, requestType, subject, message),
  });
}
