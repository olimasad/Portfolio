import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

function getBaseUrl(request) {
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  return `${proto}://${host}`;
}

function redirectWithError(redirectUrl, error) {
  redirectUrl.searchParams.set("sent", "0");
  redirectUrl.searchParams.set("error", error);
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
    secure: smtpPort === 465,
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  await transporter.sendMail({
    subject: `New portfolio message from ${name.replace(/[\r\n]/g, " ")}`,
    from: fromEmail,
    to: contactTo,
    replyTo: email.replace(/[\r\n]/g, ""),
    text: buildMessageBody(name, email, message),
  });
}

export async function POST(request) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  // Honeypot: bots fill this; humans leave it empty.
  const website = String(formData.get("website") || "").trim();

  const redirectUrl = new URL("/contact", getBaseUrl(request));

  if (website) {
    redirectUrl.searchParams.set("sent", "1");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (!name || !email || !message) {
    return redirectWithError(redirectUrl, "missing_fields");
  }

  if (!email.includes("@")) {
    return redirectWithError(redirectUrl, "invalid_email");
  }

  const contactTo = process.env.CONTACT_TO_EMAIL || "olimasad@gmail.com";
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || "465");
  const smtpUsername = process.env.SMTP_USERNAME;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ||
    (resendApiKey ? "Portfolio Contact <onboarding@resend.dev>" : null) ||
    smtpUsername ||
    "no-reply@example.com";

  if (!resendApiKey && !(smtpUsername && smtpPassword)) {
    return redirectWithError(redirectUrl, "smtp_not_configured");
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
  } catch {
    return redirectWithError(redirectUrl, "send_failed");
  }

  redirectUrl.searchParams.set("sent", "1");
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
