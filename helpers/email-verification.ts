import { Resend } from 'resend';
import EmailTemplate from "@/components/email-template"
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, username: string, verifyCode: string) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Notecraft | Verification code',
            react: EmailTemplate({ otp: verifyCode, username })
        });
        return { success: true, message: "verification email sent" }
    } catch (error) {
        console.log('Error sending verification email', error);
        return { success: false, message: "Error sending verification email" }
    }
}