import nodemailer from 'nodemailer';

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

        // If Brevo API Key is present, send email via HTTP API (Port 443) to avoid SMTP port blocking on Render Free Tier
        if (process.env.BREVO_API_KEY) {
            const senderEmail = process.env.FROM_EMAIL
                ? (process.env.FROM_EMAIL.match(/<([^>]+)>/)?.[1] || process.env.FROM_EMAIL)
                : "notecraft.app@gmail.com";

            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: "NoteCraft",
                        email: senderEmail,
                    },
                    to: [
                        {
                            email: email,
                            name: username,
                        },
                    ],
                    subject: 'Notecraft | Verification code',
                    htmlContent: html ?? '',
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Brevo HTTP API failed: ${response.status} - ${errText}`);
            }

            return { success: true, message: "verification email sent" };
        }

        // Fallback: SMTP transporter for local testing
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.FROM_EMAIL || `"NoteCraft" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Notecraft | Verification code',
            html: html ?? '',
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