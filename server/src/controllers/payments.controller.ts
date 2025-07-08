import { razorpay } from "../lib/razorpay"
import { Request, Response } from 'express';
import { prisma } from '../db/db';
import crypto from "crypto"
import { generateSafeEmail } from "../helpers/email-verification";
export const createSubscription = async (req: Request, res: Response) => {
    if (!req.user || !req.user.id || !req.user.email) {
         res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name || "Notecraft User";

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
            },
        });

        if (user?.subscription?.status === "active") {
            res.status(400).json({ message: "You already have an active subscription" });
            return;
        }

        if (user?.subscription && ["pending", "created"].includes(user.subscription.status)) {
            try {
                await razorpay.subscriptions.cancel(user.subscription.subscriptionId, true);
                await prisma.subscription.delete({
                    where: {
                        subscriptionId: user.subscription.subscriptionId,
                    },
                });
            } catch (cancelErr) {
                console.error("Failed to cancel previous subscription", cancelErr);
                 res.status(500).json({ message: "Cleanup failed. Try again." });
                return;
            }
        }
        const customerEmail =
        process.env.NODE_ENV === 'production'
          ? userEmail
          :generateSafeEmail(userEmail)
          console.log('customerEmail', customerEmail);
          
        const customer = await razorpay.customers.create({
            email: customerEmail,
            name: userName,
            notes: { userId },
        });

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID!,
            customer_notify: 1,
            total_count: 12,
            notes: {
                userId,
            },
        });

        // 6. Save new subscription in DB
        await prisma.subscription.create({
            data: {
                subscriptionId: subscription.id,
                userId,
                status: "pending"
            },
        });

         res.status(200).json({
            subscriptionId: subscription.id,
            customerId: customer.id,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
        return;
    } catch (error) {
        console.error("Error creating subscription:", error);
         res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};

export const cancelSubscription = async (req: Request, res: Response) => {
    if (!req.user || !req.user.id || !req.user.email) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
        res.status(400).json({ message: "Subscription ID is required" });
        return;
    }
    try {
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        if (subscription.status == 'created' || subscription.status == 'pending') {
            await razorpay.subscriptions.cancel(subscriptionId);
            await prisma.subscription.update({
                where: {
                    subscriptionId: subscription.id,
                },
                data: {
                    status: 'cancelled',
                }
            })
        }

        res.json({ success: true, message: "Subscription cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export const webhook = async (req: Request, res: Response) => {
    console.log('inside webhook');

    
    const rawBody = req.body;
    console.log('rawBody', rawBody);
    
    const signature = req.headers["x-razorpay-signature"] as string;
    console.log('signature', signature);
    
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(rawBody)
        .digest("hex");

    if (expectedSignature !== signature) {
        res.status(400).json({ success: false, message: "Invalid signature" });
        return;
    }

    try {
        const parsedBody = JSON.parse(rawBody.toString());
        console.log('parsedBody', parsedBody);

        const event = parsedBody.event;
        const subscription = parsedBody.payload.subscription.entity;
        console.log('event', event);
        console.log('subscription', subscription);

        if (event === "subscription.activated") {
            if (!subscription.notes?.userId) {
                console.error("Missing userId in subscription notes");
                res.status(400).json({ success: false, message: "Missing userId" });
                return;

            }

            await prisma.subscription.update({
                where: {
                    subscriptionId: subscription.id,
                },
                data: {
                    status: "active",
                    expiryDate: new Date(subscription.current_end * 1000),
                    nextBillingDate: new Date(subscription.current_end * 1000),
                },
            });

            await prisma.user.update({
                where: {
                    id: subscription.notes.userId,
                },
                data: {
                    isPro: true,
                },
            });
        }

        if (event === "subscription.cancelled") {
            await prisma.subscription.delete({
                where: { subscriptionId: subscription.id }
            });
        }

        if (event === "payment.failed") {
            await prisma.subscription.delete({
                where: { subscriptionId: subscription.id },
            });
        }

        res.status(200).json({ success: true });
        return;

    } catch (err) {
        console.error("Webhook DB update failed", err);
        res.status(500).json({ success: false });
        return;

    }
};
