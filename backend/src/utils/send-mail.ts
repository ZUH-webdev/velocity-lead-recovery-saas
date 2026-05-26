import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

const FROM = "Velocity <noreply@interview-ai.live>";

// ── Shared Layout ──────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Velocity</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#09090b;padding:28px 40px;">
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                ⚡ Velocity
              </span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">
                You're receiving this email from Velocity — the AI receptionist platform.<br/>
                © ${new Date().getFullYear()} Velocity. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;padding:12px 28px;background:#09090b;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.2px;">${text}</a>`;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;letter-spacing:-0.3px;">${text}</h1>`;
}

function subtext(text: string) {
  return `<p style="margin:0 0 24px;font-size:14px;color:#71717a;line-height:1.6;">${text}</p>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.7;">${text}</p>`;
}

function infoBox(rows: { label: string; value: string }[]) {
  const rowsHtml = rows
    .map(
      ({ label, value }) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#71717a;width:40%;">${label}</td>
      <td style="padding:10px 16px;font-size:13px;color:#09090b;font-weight:500;">${value}</td>
    </tr>`,
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:8px;margin:24px 0;border:1px solid #f0f0f0;">
    ${rowsHtml}
  </table>`;
}

// ── 1. Email Verification ──────────────────────────────────────────────────

export const sendVerificationEmail = async (to: string, url: string) => {
  const html = layout(`
    ${heading("Verify your email address")}
    ${subtext("Just one more step to get started with Velocity.")}
    ${paragraph("Click the button below to verify your email address. This link expires in <strong>24 hours</strong>.")}
    ${button("Verify Email Address", url)}
    <p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;">
      If you didn't create a Velocity account, you can safely ignore this email.
    </p>
  `);

  await send(to, "Verify your email — Velocity", html);
};

// ── 2. Welcome (after email verified) ─────────────────────────────────────

export const sendWelcomeEmail = async (to: string, fullName: string, dashboardUrl: string) => {
  const html = layout(`
    ${heading(`Welcome to Velocity, ${fullName.split(" ")[0]}! 🎉`)}
    ${subtext("Your AI receptionist is ready to be set up.")}
    ${paragraph("You're all set. Head to your dashboard to complete onboarding — it takes less than 10 minutes to have your AI receptionist live and answering calls.")}
    ${button("Go to Dashboard", dashboardUrl)}
    ${paragraph("Questions? Just reply to this email — we're happy to help.")}
  `);

  await send(to, "Welcome to Velocity — let's get you live", html);
};

// ── 3. Member Invite ───────────────────────────────────────────────────────

export const sendMemberInviteEmail = async (
  to: string,
  inviterName: string,
  tenantName: string,
  role: string,
  inviteUrl: string,
) => {
  const html = layout(`
    ${heading(`You've been invited to join ${tenantName}`)}
    ${subtext(`${inviterName} has invited you to Velocity as a ${role}.`)}
    ${paragraph(`You've been added to <strong>${tenantName}</strong>'s Velocity workspace. Accept the invitation below to set up your account and start managing leads.`)}
    ${infoBox([
      { label: "Workspace", value: tenantName },
      { label: "Role", value: role },
      { label: "Invited by", value: inviterName },
    ])}
    ${button("Accept Invitation", inviteUrl)}
    <p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;">
      This invitation expires in <strong>7 days</strong>. If you weren't expecting this, you can safely ignore it.
    </p>
  `);

  await send(to, `${inviterName} invited you to ${tenantName} on Velocity`, html);
};

// ── 4. Password Reset ──────────────────────────────────────────────────────

export const sendPasswordResetEmail = async (to: string, url: string) => {
  const html = layout(`
    ${heading("Reset your password")}
    ${subtext("We received a request to reset your Velocity password.")}
    ${paragraph("Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.")}
    ${button("Reset Password", url)}
    <p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;">
      If you didn't request a password reset, you can safely ignore this email. Your password won't change.
    </p>
  `);

  await send(to, "Reset your Velocity password", html);
};

// ── 5. Appointment Reminder ────────────────────────────────────────────────

export const sendAppointmentReminderEmail = async (
  to: string,
  patientName: string,
  businessName: string,
  service: string,
  datetime: string,
  address: string,
) => {
  const html = layout(`
    ${heading("Appointment Reminder")}
    ${subtext(`Your upcoming appointment at ${businessName}.`)}
    ${paragraph(`Hi <strong>${patientName}</strong>, this is a reminder about your upcoming appointment.`)}
    ${infoBox([
      { label: "Business", value: businessName },
      { label: "Service", value: service },
      { label: "Date & Time", value: datetime },
      { label: "Address", value: address },
    ])}
    ${paragraph("If you need to reschedule or cancel, please contact the business directly.")}
  `);

  await send(to, `Appointment reminder — ${businessName}`, html);
};

// ── 6. Critical Lead Alert ─────────────────────────────────────────────────

export const sendCriticalLeadAlert = async (
  to: string,
  staffName: string,
  tenantName: string,
  leadName: string,
  leadPhone: string,
  summary: string,
  dashboardUrl: string,
) => {
  const html = layout(`
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;font-weight:600;color:#dc2626;">🚨 Critical Lead — Immediate Attention Required</p>
    </div>
    ${heading("Action required")}
    ${subtext(`A lead has been flagged as CRITICAL in ${tenantName}.`)}
    ${paragraph(`Hi <strong>${staffName}</strong>, the AI receptionist has detected an emergency keyword in a conversation and escalated it for immediate human attention.`)}
    ${infoBox([
      { label: "Lead", value: leadName },
      { label: "Phone", value: leadPhone },
      { label: "Summary", value: summary },
    ])}
    ${button("View in Dashboard", dashboardUrl)}
  `);

  await send(to, `🚨 Critical lead alert — ${tenantName}`, html);
};

// ── Internal sender ────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error("Failed to send email");
  }
}