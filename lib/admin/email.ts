import {
  BREVO_API_KEY,
  BREVO_FROM_EMAIL,
  BREVO_FROM_NAME,
} from "@/lib/supabase/env";

/**
 * Sends a password-reset email through Brevo's transactional API.
 * Returns true when Brevo accepted the message.
 *
 * Returns false when BREVO_API_KEY is missing or the API call fails —
 * callers fall back to dev-mode link display / server logs.
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
): Promise<boolean> {
  if (!BREVO_API_KEY) {
    return false;
  }

  const subject = "Reset your Puppy Paradise admin password";

  const textContent = [
    "Hello,",
    "",
    "Someone requested a password reset for the Puppy Paradise admin account.",
    "Open the link below to choose a new password (valid for one hour):",
    "",
    resetLink,
    "",
    "If you did not request this, you can safely ignore this email.",
  ].join("\n");

  const htmlContent = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 520px; margin: 0 auto; color: #1f2937;">
      <h2 style="color: #4d3827;">Reset your admin password</h2>
      <p>Hello,</p>
      <p>
        Someone requested a password reset for the
        <strong>Puppy Paradise</strong> admin account.
        Choose a new password with the button below (the link is valid
        for one hour).
      </p>
      <p style="margin: 28px 0;">
        <a href="${resetLink}"
           style="background: #6b4f35; color: #ffffff; text-decoration: none;
                  padding: 12px 24px; border-radius: 999px; font-weight: bold;">
          Set a new password
        </a>
      </p>
      <p style="color: #6b7280; font-size: 13px;">
        If the button does not work, copy this link into your browser:<br/>
        ${resetLink}
      </p>
      <p style="color: #6b7280; font-size: 13px;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  try {
    const response = await fetch("https://api.brevo.com/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: BREVO_FROM_NAME, email: BREVO_FROM_EMAIL },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[email] Brevo send failed (${response.status}): ${body.slice(0, 500)}`,
      );
      return false;
    }

    return true;
  } catch (cause) {
    console.error("[email] Brevo send threw:", cause);
    return false;
  }
}
