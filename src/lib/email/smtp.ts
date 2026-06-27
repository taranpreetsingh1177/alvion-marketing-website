import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure =
    process.env.SMTP_SECURE === "true" || (port === 465 && process.env.SMTP_SECURE !== "false");

  return { host, port, secure, user, pass };
}

export function isEmailConfigured(): boolean {
  return getSmtpConfig() !== null;
}

export function getMailTransporter(): Transporter {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return transporter;
}

export function getFromAddress(): string {
  return process.env.CONTACT_FROM_EMAIL ?? "Alvion <office@alvion.in>";
}

export function getInboxAddress(): string {
  return process.env.CONTACT_TO_EMAIL ?? "office@alvion.in";
}
