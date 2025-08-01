import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY ?? "");
export async function sendVerificationEmail(email: string, username: string, verifyCode: string,route:"register" | "forgotpassword") {
    let html:string| null = null
    try {
        if(route === 'register'){
            html = `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hi ${username},</h2>
            <p>Thank you for signing up for <strong>Notecraft</strong>!</p>
            <p>Your verification code is:</p>
            <h3 style="color: #4A90E2;">${verifyCode}</h3>
            <p>If you didn't request this, just ignore this email.</p>
            </div> 
            `;
        }
        else {
            html = `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hi ${username},</h2>
            <p>Here is your otp for resetting password</p>
            <h3 style="color: #4A90E2;">${verifyCode}</h3>
            <p>Note It is only valid for 5 mins</p>
            </div> 
            `
        }
        await resend.emails.send({
            from: process.env.FROM_EMAIL || 'default@notecraft.tech',
            to: email,
            subject: 'Notecraft | Verification code',
            html,
        });
        return { success: true, message: "verification email sent" }
    } catch (error) {
        console.log('Error sending verification email', error);
        return { success: false, message: "Error sending verification email" }
    }
}




export function generateSafeEmail(email: string) {
    const [name, domain] = email.split('@');
    return `${name}+${Date.now()}@${domain}`;
}