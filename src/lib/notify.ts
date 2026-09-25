/**
 * Lead notification system.
 *
 * When a new lead is submitted, we want to notify Rick on his phone and/or
 * email so he can follow up quickly. This module supports two channels:
 *
 * 1. SMS via email-to-SMS gateway — most US carriers have an email address
 *    that converts incoming emails to text messages. The user sets the
 *    NOTIFICATION_SMS_GATEWAY env var to their carrier's domain (e.g.
 *    "@vtext.com" for Verizon, "@tmomail.net" for T-Mobile, etc.) and we
 *    send to "7345525888@vtext.com".
 *
 * 2. Email — sends a formatted email to the NOTIFICATION_EMAIL address.
 *
 * Both channels use Node's built-in `nodemailer`-style SMTP transport.
 * For Namecheap hosting, the user sets SMTP_HOST / SMTP_PORT / SMTP_USER /
 * SMTP_PASS env vars to their Namecheap email account.
 *
 * If no SMTP config is present, notifications are silently skipped (the
 * lead still persists to the database — it's just not emailed). This lets
 * the site work during development without email setup.
 */

import { createTransport, type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = createTransport({
    host,
    port: port ? parseInt(port, 10) : 465,
    secure: true,
    auth: { user, pass },
  });
  return transporter;
}

/** Rick's phone number as digits (no spaces/parens). */
const PHONE_DIGITS = '7345525888';

/** Build the SMS gateway email from the phone + carrier domain env var. */
function getSmsAddress(): string | null {
  const gateway = process.env.NOTIFICATION_SMS_GATEWAY;
  if (!gateway) return null;
  return `${PHONE_DIGITS}@${gateway.replace(/^@/, '')}`;
}

interface LeadData {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  message?: string | null;
  design?: string | null;
  estimate?: string | null;
}

/**
 * Send a lead notification to Rick's phone (SMS) and/or email.
 * Silently skips if no SMTP or notification config is present.
 */
export async function notifyNewLead(lead: LeadData): Promise<void> {
  const tr = getTransporter();
  if (!tr) return; // No SMTP configured — skip silently

  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const smsAddress = getSmsAddress();
  if (!notificationEmail && !smsAddress) return;

  const subject = `New lead: ${lead.name} — ${lead.phone}`;
  const textBody = [
    `New lead received from the website!`,
    ``,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.service ? `Service: ${lead.service}` : null,
    lead.estimate ? `Estimate shown: ${lead.estimate}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    ``,
    `Reply fast — this lead is fresh.`,
  ].filter(Boolean).join('\n');

  const recipients = [notificationEmail, smsAddress].filter(Boolean).join(', ');
  if (!recipients) return;

  try {
    await tr.sendMail({
      from: process.env.SMTP_USER,
      to: recipients,
      subject,
      text: textBody,
    });
  } catch (err) {
    // Log but don't throw — the lead is already in the database.
    console.error('[notifyNewLead] Failed to send notification:', err);
  }
}
