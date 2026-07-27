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
  const contactTo = process.env.CONTACT_TO_EMAIL || "olimasad@gmail.com";
  // Gmail and most providers reject a From address that isn't the authenticated account.
  const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUsername;

  if (!smtpUsername || !smtpPassword) {
    console.error("[contact] SMTP_USERNAME and/or SMTP_PASSWORD are not set in this environment.");
    return buildRedirect(request, { sent: "0", error: "smtp_not_configured" });
  }

  try {
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
      text:
        "New message from your portfolio contact form.\n\n" +
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}\n`,
    });
  } catch (error) {
    console.error("[contact] failed to send message:", error);
    return buildRedirect(request, { sent: "0", error: "send_failed" });
  }

  return buildRedirect(request, { sent: "1" });
}
