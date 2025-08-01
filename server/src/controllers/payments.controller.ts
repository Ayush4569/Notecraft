import { razorpay } from "../lib/razorpay"
import { Request, Response } from 'express';
import { prisma } from '../db/db';
import crypto from "crypto"
import { generateSafeEmail } from "../helpers/email-verification";
import { RedisClient } from "helpers/redis";
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

        if (user?.subscription && ["pending", "created", "incomplete", "failed"].includes(user.subscription.status)) {
            try {
                await razorpay.subscriptions.cancel(user.subscription.subscriptionId, true);
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        isPro: false,
                    }
                })
                await RedisClient.del(`user:${req.user.id}`)
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
        const customerEmail = generateSafeEmail(userEmail)

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
    if ([req.user, req.user?.id, req.user?.email].some(item => !item)) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const userSubscriptionId = await prisma.subscription.findUnique({
        where: {
            userId: req.user!.id,
        },
        select: {
            subscriptionId: true,
        }
    })
    if (!userSubscriptionId?.subscriptionId) {
        res.status(400).json({ message: "No subscriptions found for user" });
        return;
    }
    try {
        const subscription = await razorpay.subscriptions.fetch(userSubscriptionId.subscriptionId);
        if (!subscription) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        await razorpay.subscriptions.cancel(userSubscriptionId.subscriptionId,1);
        await prisma.user.update({
            where:{
                id:req.user!.id
            },
            data:{
                isPro:false
            }
        })
        await RedisClient.del(`user:${req.user!.id}`)
        res.json({ success: true, message: "Subscription cancelled successfully" });
        return;
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}

export const webhook = async (req: Request, res: Response) => {


    const rawBody = req.body;

    const signature = req.headers["x-razorpay-signature"] as string;

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
        const event = parsedBody.event;
        const subscription = parsedBody.payload.subscription.entity;
        
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
                    aiCreditsLeft: 100,
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
            await RedisClient.del(`user:${subscription.notes.userId}`)

        }

        if (event === "subscription.cancelled") {
            await razorpay.subscriptions.cancel(subscription.id,1)
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
