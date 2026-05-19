import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (to: string, url: string) => {
  try {
    await resend.emails.send({
      from: "LeadBooster <noreply@interview-ai.live>",
      to,
      subject: "Verify your email for LeadBooster",
      html: `
                <p>Hi there,</p>
                <p>Thanks for signing up for LeadBooster! Please verify your email by clicking the link below:</p>
                <a href="${url}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
                <p>If you didn't create an account, you can ignore this email.</p>
                <p>Best regards,<br/>The LeadBooster Team</p>
            `,
    });
  } catch (error) {
    console.error("Failed to send verification email", error);
    throw new Error("Failed to send verification email");
  }
};
