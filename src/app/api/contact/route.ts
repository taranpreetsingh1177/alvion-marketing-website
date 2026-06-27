import { NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email/send";
import { isEmailConfigured } from "@/lib/email/smtp";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 },
    );
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : "";
  const email = isNonEmptyString(body.email) ? body.email.trim() : "";
  const message = isNonEmptyString(body.message) ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!isEmailConfigured()) {
    console.error("SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS)");
    return NextResponse.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 },
    );
  }

  try {
    await sendContactEmails({ name, email, message });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
