import { FOOTER_CONTACT_EMAIL } from "@/lib/site-config";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAX_TITLE_LENGTH = 140;
const MAX_MAIN_LENGTH = 4000;

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const body = (payload ?? {}) as {
    email?: string;
    title?: string;
    main?: string;
    locale?: string;
  };

  const email = (body.email ?? "").trim();
  const title = (body.title ?? "").trim();
  const main = (body.main ?? "").trim();
  const locale = (body.locale ?? "").trim();

  if (!title || !main) {
    return NextResponse.json(
      { error: "Title and Main are required." },
      { status: 400 },
    );
  }
  if (title.length > MAX_TITLE_LENGTH || main.length > MAX_MAIN_LENGTH) {
    return NextResponse.json(
      { error: "Title or Main is too long." },
      { status: 400 },
    );
  }
  if (email.toLowerCase() !== FOOTER_CONTACT_EMAIL.toLowerCase()) {
    return NextResponse.json(
      { error: "Email field is invalid." },
      { status: 400 },
    );
  }

  const smtpHost = env("SMTP_HOST");
  const smtpPort = Number(env("SMTP_PORT") || "587");
  const smtpUser = env("SMTP_USER");
  const smtpPass = env("SMTP_PASS");
  const smtpFrom = env("SMTP_FROM") || `PopOut Market <${smtpUser}>`;
  const receiver = env("CONTACT_RECEIVER_EMAIL") || FOOTER_CONTACT_EMAIL;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: "Email service is not configured on server." },
      { status: 500 },
    );
  }

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const requestIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const submittedAt = new Date().toISOString();

  await transport.sendMail({
    from: smtpFrom,
    to: receiver,
    replyTo: email,
    subject: `[PopOut Contact] ${title}`,
    text: [
      `Email: ${email}`,
      `Locale: ${locale || "unknown"}`,
      `SubmittedAt: ${submittedAt}`,
      `IP: ${requestIp}`,
      "",
      "Main:",
      main,
    ].join("\n"),
    html: `
      <h2>PopOut Contact Form</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Locale:</strong> ${escapeHtml(locale || "unknown")}</p>
      <p><strong>SubmittedAt:</strong> ${escapeHtml(submittedAt)}</p>
      <p><strong>IP:</strong> ${escapeHtml(requestIp)}</p>
      <hr />
      <p><strong>Main:</strong></p>
      <p>${escapeHtml(main).replaceAll("\n", "<br />")}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
