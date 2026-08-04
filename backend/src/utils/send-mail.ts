import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// ── Shared Layout ──────────────────────────────────────────────────────────

function layout(content: string, previewText?: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Velocity</title>
  ${
    previewText
      ? `
  <!-- Preview text (hidden in inbox preview) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${previewText}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>`
      : ""
  }
</head>
<body style="
  margin:0;
  padding:0;
  background-color:#f4f4f5;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
">

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="background-color:#f4f4f5;padding:40px 0;">
  <tr>
    <td align="center">

      <!-- Card -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="
          background:#ffffff;
          border-radius:16px;
          overflow:hidden;
          border:1px solid #e4e4e7;
          box-shadow:0 2px 8px rgba(0,0,0,0.06);
        ">

        <!-- Header -->
        <tr>
          <td style="background:#09090b;padding:24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <!-- Logo mark -->
                  <img
                    src="https://velocity-ai.site/email/velocity-logo-email.png"
                    alt="Velocity"
                    width="140"
                    style="display:block; max-width:140px; width:100%; height:auto; margin:0 auto 24px auto; border:0; outline:none; text-decoration:none;"
                  />
                </td>
                <td align="right">
                  <span style="
                    font-size:11px;
                    color:#52525b;
                    letter-spacing:0.06em;
                    text-transform:uppercase;
                    font-weight:500;
                  ">
                    AI Receptionist Platform
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Gold accent line -->
        <tr>
          <td style="
            background:linear-gradient(90deg,#c9a97a 0%,#e8c99a 50%,#c9a97a 100%);
            height:2px;
            font-size:0;
            line-height:0;
          ">
            &nbsp;
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="
            padding:0 40px;
            border-top:1px solid #f4f4f5;
          ">
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px 32px;background:#fafafa;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="
                    margin:0 0 8px;
                    font-size:12px;
                    color:#a1a1aa;
                    line-height:1.6;
                  ">
                    You're receiving this from
                    <strong style="color:#71717a;">Velocity</strong> —
                    the AI receptionist platform for modern healthcare practices.
                  </p>
                  <p style="
                    margin:0;
                    font-size:11px;
                    color:#d4d4d8;
                  ">
                    © ${new Date().getFullYear()} Velocity Health Intelligence, Inc.
                    &nbsp;·&nbsp; All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

      <!-- Bottom spacing -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="
              margin:0;
              font-size:11px;
              color:#a1a1aa;
            ">
              Velocity · velocity-ai.site
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

// ── Shared Helpers ─────────────────────────────────────────────────────────

function heading(text: string) {
  return `
    <h1 style="
      margin:0 0 8px;
      font-size:24px;
      font-weight:700;
      color:#09090b;
      letter-spacing:-0.4px;
      line-height:1.2;
    ">${text}</h1>
  `;
}

function subheading(text: string) {
  return `
    <p style="
      margin:0 0 28px;
      font-size:14px;
      color:#71717a;
      line-height:1.6;
    ">${text}</p>
  `;
}

function paragraph(text: string) {
  return `
    <p style="
      margin:0 0 20px;
      font-size:14px;
      color:#3f3f46;
      line-height:1.75;
    ">${text}</p>
  `;
}

function label(text: string) {
  return `
    <p style="
      margin:0 0 8px;
      font-size:10px;
      font-weight:700;
      letter-spacing:0.1em;
      text-transform:uppercase;
      color:#a1a1aa;
    ">${text}</p>
  `;
}

function button(text: string, url: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0"
      style="margin:28px 0;">
      <tr>
        <td style="
          background:#09090b;
          border-radius:10px;
        ">
          <a href="${url}" style="
            display:inline-block;
            padding:14px 32px;
            font-size:14px;
            font-weight:600;
            color:#ffffff;
            text-decoration:none;
            letter-spacing:0.2px;
          ">${text} →</a>
        </td>
      </tr>
    </table>
  `;
}

function goldButton(text: string, url: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0"
      style="margin:28px 0;">
      <tr>
        <td style="
          background:#c9a97a;
          border-radius:10px;
        ">
          <a href="${url}" style="
            display:inline-block;
            padding:14px 32px;
            font-size:14px;
            font-weight:600;
            color:#09090b;
            text-decoration:none;
            letter-spacing:0.2px;
          ">${text} →</a>
        </td>
      </tr>
    </table>
  `;
}

function infoBox(rows: { label: string; value: string }[]) {
  const rowsHtml = rows
    .map(
      ({ label, value }, i) => `
    <tr>
      <td style="
        padding:12px 16px;
        font-size:11px;
        font-weight:600;
        letter-spacing:0.06em;
        text-transform:uppercase;
        color:#a1a1aa;
        white-space:nowrap;
        background:${i % 2 === 0 ? "#fafafa" : "#ffffff"};
        border-bottom:1px solid #f4f4f5;
        width:35%;
      ">${label}</td>
      <td style="
        padding:12px 16px;
        font-size:13px;
        color:#09090b;
        font-weight:500;
        background:${i % 2 === 0 ? "#fafafa" : "#ffffff"};
        border-bottom:1px solid #f4f4f5;
      ">${value}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="
        border:1px solid #e4e4e7;
        border-radius:10px;
        overflow:hidden;
        margin:20px 0 28px;
      ">
      ${rowsHtml}
    </table>
  `;
}

function icon(name: string, size = 16) {
  return `<img src="https://velocity-ai.site/email/icons/${name}.png" alt="" width="${size}" height="${size}" style="display:inline-block; width:${size}px; height:${size}px; vertical-align:middle; margin-right:8px; border:0; outline:none; text-decoration:none;" />`;
}

function callout(text: string, type: "info" | "warning" | "success" = "info") {
  const styles = {
    info: { bg: "#fdf6ec", border: "#c9a97a", color: "#92703d" },
    warning: { bg: "#fffbeb", border: "#d97706", color: "#92400e" },
    success: { bg: "#f0fdf4", border: "#16a34a", color: "#14532d" },
  };
  const s = styles[type];
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="margin:0 0 24px;">
      <tr>
        <td style="
          background:${s.bg};
          border:1px solid ${s.border};
          border-left:3px solid ${s.border};
          border-radius:8px;
          padding:14px 18px;
          font-size:13px;
          color:${s.color};
          line-height:1.6;
        ">${text}</td>
      </tr>
    </table>
  `;
}

function divider() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="margin:28px 0;">
      <tr>
        <td style="
          border-top:1px solid #f4f4f5;
          font-size:0;
          line-height:0;
        ">&nbsp;</td>
      </tr>
    </table>
  `;
}

function disclaimer(text: string) {
  return `
    <p style="
      margin:0;
      font-size:12px;
      color:#a1a1aa;
      line-height:1.6;
    ">${text}</p>
  `;
}

// ── 1. Email Verification ──────────────────────────────────────────────────

export const sendVerificationEmail = async (to: string, url: string) => {
  const html = layout(
    `
    ${label("Account Verification")}
    ${heading("Verify your email address")}
    ${subheading("Just one more step to activate your Velocity workspace.")}

    ${paragraph(
      "Click the button below to verify your email address and " +
        "gain access to your AI receptionist dashboard. This link " +
        'expires in <strong style="color:#09090b;">24 hours</strong>.',
    )}

    ${button("Verify Email Address", url)}

    ${callout(
      icon("lock-gold") +
        "For security, this verification link can only be used once " +
        "and expires in 24 hours. If you did not create a Velocity account, " +
        "you can safely ignore this email.",
      "info",
    )}

    ${divider()}

    ${disclaimer(
      "If the button above doesn't work, copy and paste this link " +
        "into your browser:<br/>" +
        `<a href="${url}" style="color:#c9a97a;word-break:break-all;">${url}</a>`,
    )}
  `,
    "Verify your Velocity account — action required",
  );

  await send(to, "Verify your Velocity account", html);
};

// ── 2. Welcome (after email verified) ─────────────────────────────────────

export const sendWelcomeEmail = async (to: string, fullName: string, dashboardUrl: string) => {
  const firstName = fullName.split(" ")[0];

  const html = layout(
    `
    ${label("Welcome to Velocity")}
    ${heading(`You're live, ${firstName}.`)}
    ${subheading(
      "Your AI receptionist is standing by. " + "Every missed call from here is automatically recovered.",
    )}

    ${paragraph(
      "Your Velocity workspace is ready. Complete the 3-step onboarding " +
        "below and your AI will be answering missed calls within minutes.",
    )}

    ${infoBox([
      { label: "Step 1", value: "Connect your phone number via Twilio" },
      { label: "Step 2", value: "Sync your calendar (Google or Calendly)" },
      { label: "Step 3", value: "Activate your AI voice persona" },
    ])}

    ${goldButton("Go to Dashboard", dashboardUrl)}

    ${divider()}

    ${paragraph("Questions? Reply to this email — our team responds within 24 hours.")}

    ${disclaimer(
      "You're receiving this because you created a Velocity account. " +
        "This is a transactional email and cannot be unsubscribed.",
    )}
  `,
    `Welcome ${firstName} — your AI receptionist is ready`,
  );

  await send(to, `Welcome to Velocity, ${firstName}`, html);
};

// ── 3. Member Invite ───────────────────────────────────────────────────────

export const sendMemberInviteEmail = async (
  to: string,
  inviterName: string,
  tenantName: string,
  role: string,
  inviteUrl: string,
) => {
  const html = layout(
    `
    ${label("Team Invitation")}
    ${heading(`You've been invited to ${tenantName}`)}
    ${subheading(`${inviterName} has added you to their Velocity workspace.`)}

    ${infoBox([
      { label: "Workspace", value: tenantName },
      { label: "Your Role", value: role },
      { label: "Invited by", value: inviterName },
      { label: "Expires", value: "7 days from now" },
    ])}

    ${paragraph(
      `You've been granted <strong>${role}</strong> access to the ` +
        `<strong>${tenantName}</strong> Velocity dashboard. ` +
        "Accept below to set up your account and start managing leads.",
    )}

    ${button("Accept Invitation", inviteUrl)}

    ${callout(
      icon("clock-amber") +
        `This invitation expires in 7 days. After that, ${inviterName} will need to send a new invite.`,
      "warning",
    )}

    ${divider()}

    ${disclaimer(
      "If you weren't expecting this invitation or don't know " +
        `${inviterName}, you can safely ignore this email.`,
    )}
  `,
    `${inviterName} invited you to join ${tenantName} on Velocity`,
  );

  await send(to, `${inviterName} invited you to ${tenantName}`, html);
};

// ── 4. Password Reset ──────────────────────────────────────────────────────

export const sendPasswordResetEmail = async (to: string, url: string) => {
  const html = layout(
    `
    ${label("Account Security")}
    ${heading("Reset your password")}
    ${subheading("We received a request to reset the password on your Velocity account.")}

    ${paragraph(
      "Click the button below to choose a new password. " +
        'This link is valid for <strong style="color:#09090b;">1 hour</strong> ' +
        "and can only be used once.",
    )}

    ${button("Reset My Password", url)}

    ${callout(
      icon("lock-amber") +
        "If you didn't request a password reset, your account may be " +
        "at risk. Contact us immediately at security@velocity-ai.site " +
        "and change your password.",
      "warning",
    )}

    ${divider()}

    ${disclaimer(
      "If the button above doesn't work, copy and paste this link " +
        "into your browser:<br/>" +
        `<a href="${url}" style="color:#c9a97a;word-break:break-all;">${url}</a>`,
    )}
  `,
    "Reset your Velocity password — link expires in 1 hour",
  );

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
  const firstName = patientName.split(" ")[0];

  const html = layout(
    `
    ${label("Appointment Reminder")}
    ${heading(`See you soon, ${firstName}.`)}
    ${subheading(`Your upcoming appointment at ${businessName} is confirmed.`)}

    ${infoBox([
      { label: "Business", value: businessName },
      { label: "Service", value: service },
      { label: "Date & Time", value: datetime },
      { label: "Address", value: address },
    ])}

    ${callout(
      icon("check-green") +
        "Your appointment is confirmed. If you need to reschedule " +
        "or cancel, please contact the practice directly at least " +
        "24 hours in advance.",
      "success",
    )}

    ${divider()}

    ${disclaimer(
      "This reminder was sent automatically by Velocity on behalf of " +
        `${businessName}. For appointment changes, contact the practice directly.`,
    )}
  `,
    `Reminder: Your appointment at ${businessName}`,
  );

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
  const html = layout(
    `
    <!-- Alert banner -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="margin:0 0 24px;">
      <tr>
        <td style="
          background:#fef2f2;
          border:1px solid #fecaca;
          border-radius:10px;
          padding:14px 18px;
          text-align:center;
        ">
          <span style="
            font-size:13px;
            font-weight:700;
            color:#dc2626;
            letter-spacing:0.04em;
            text-transform:uppercase;
          ">
            ${icon("alert-red", 15)}Critical Lead — Immediate Attention Required
          </span>
        </td>
      </tr>
    </table>

    ${label("Lead Alert")}
    ${heading("Action required, " + staffName.split(" ")[0])}
    ${subheading(`A lead in ${tenantName} has been escalated and requires immediate response.`)}

    ${paragraph(
      "The Velocity AI detected an emergency keyword or critical signal " +
        "in this conversation and has escalated it for human intervention. " +
        "Please review and respond immediately.",
    )}

    ${infoBox([
      { label: "Lead Name", value: leadName },
      { label: "Phone", value: leadPhone },
      { label: "Workspace", value: tenantName },
      { label: "Summary", value: summary },
    ])}

    ${button("View Lead in Dashboard", dashboardUrl)}

    ${divider()}

    ${disclaimer(
      "This alert was generated automatically by Velocity's AI " +
        "escalation engine. Critical leads are flagged based on " +
        "keyword detection and sentiment analysis.",
    )}
  `,
    "Critical lead requires your immediate attention",
  );

  await send(to, `Critical lead alert — ${tenantName}`, html);
};

// ── Internal sender ────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  // If using a dummy/skip API key, just log to console — do NOT throw
  const isDummyKey =
    !env.RESEND_API_KEY ||
    env.RESEND_API_KEY.startsWith("re_skip") ||
    env.RESEND_API_KEY === "re_skip_for_now";

  if (isDummyKey) {
    console.log(
      `\n📧 [DEV EMAIL — RESEND NOT CONFIGURED]\n  To: ${to}\n  Subject: ${subject}\n  (HTML content omitted — check server logs for verification links)\n`,
    );
    return;
  }

  console.log('[send-mail] Sending to:', to)
  console.log('[send-mail] From:', FROM)
  console.log('[send-mail] Key prefix:', env.RESEND_API_KEY?.substring(0, 10))

  try {
    const result = await resend.emails.send({ from: FROM, to, subject, html })
    console.log('[send-mail] SUCCESS:', JSON.stringify(result))
  } catch (error) {
    console.error('[send-mail] FAILED:', JSON.stringify(error))
    // Still not throwing — just logging
  }
}
