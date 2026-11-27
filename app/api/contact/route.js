import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function firstHeaderValue(value) {
  return (value || "").split(",")[0].trim();
}

function buildRedirect(request, params) {
  const proto = firstHeaderValue(request.headers.get("x-forwarded-proto"));
  const host =
    firstHeaderValue(request.headers.get("x-forwarded-host")) || firstHeaderValue(request.headers.get("host"));

  let redirectUrl;
  try {
    redirectUrl = new URL("/contact", host ? `${proto || "http"}://${host}` : request.url);
  } catch {
    redirectUrl = new URL("/contact", request.url);
  }

  for (const [key, value] of Object.entries(params)) {
    redirectUrl.searchParams.set(key, value);
  }

  return NextResponse.redirect(redirectUrl, { status: 303 });
}

function buildMessageBody(name, email, message) {
  return (
    "New message from your portfolio contact form.\n\n" +
    `Name: ${name}\n` +
    `Email: ${email}\n\n` +
    `Message:\n${message}\n`
  );
}

async function sendWithResend({ apiKey, fromEmail, contactTo, name, email, message }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [contactTo],
      reply_to: email,
      subject: `New portfolio message from ${name.replace(/[\r\n]/g, " ")}`,
      text: buildMessageBody(name, email, message),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend failed with status ${response.status}`);
  }
}

async function sendWithSmtp({
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword,
  fromEmail,
  contactTo,
  name,
  email,
  message,
}) {
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    // Port 465 is implicit TLS; 587/25 start plaintext and upgrade via STARTTLS.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465,
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
    // Hosts that block outbound SMTP would otherwise hang until the request times out.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  await transporter.sendMail({
    subject: `New portfolio message from ${name.replace(/[\r\n]/g, " ")}`,
    from: { name: `Portfolio Contact (${name.replace(/[\r\n]/g, " ")})`, address: fromEmail },
    to: contactTo,
    replyTo: email.replace(/[\r\n]/g, ""),
    text: buildMessageBody(name, email, message),
  });
}

export async function POST(request) {
  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("[contact] could not parse form submission:", error);
    return buildRedirect(request, { sent: "0", error: "bad_request" });
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  // Honeypot: bots fill this; humans leave it empty.
  const website = String(formData.get("website") || "").trim();

  if (website) {
    return buildRedirect(request, { sent: "1" });
  }

  if (!name || !email || !message) {
    return buildRedirect(request, { sent: "0", error: "missing_fields" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return buildRedirect(request, { sent: "0", error: "invalid_email" });
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUsername = process.env.SMTP_USERNAME;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO_EMAIL || "nebula@oliverms.com";
  // Prefer Resend on hosts that block SMTP; otherwise use the authenticated SMTP mailbox.
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ||
    (resendApiKey ? "Portfolio Contact <onboarding@resend.dev>" : null) ||
    smtpUsername;

  if (!resendApiKey && !(smtpUsername && smtpPassword)) {
    console.error("[contact] RESEND_API_KEY or SMTP_USERNAME/SMTP_PASSWORD must be set.");
    return buildRedirect(request, { sent: "0", error: "smtp_not_configured" });
  }

  try {
    if (resendApiKey) {
      await sendWithResend({
        apiKey: resendApiKey,
        fromEmail,
        contactTo,
        name,
        email,
        message,
      });
    } else {
      await sendWithSmtp({
        smtpHost,
        smtpPort,
        smtpUsername,
        smtpPassword,
        fromEmail,
        contactTo,
        name,
        email,
        message,
      });
    }
  } catch (error) {
    console.error("[contact] failed to send message:", error);
    return buildRedirect(request, { sent: "0", error: "send_failed" });
  }

  return buildRedirect(request, { sent: "1" });
}
