import {razorpay} from "../lib/razorpay"
import { Request, Response } from 'express';
import {prisma} from '../db/db';

export const createSubscription = async (req: Request, res: Response) => {
    if(!req.user || !req.user.id || !req.user.email) { 
         res.status(401).json({ message: "Unauthorized" });
            return;
    }
    try {   

        
        const customer = await razorpay.customers.create({
            email: req.user.email,
            name:req.user.name!
        })
        
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID!,
            customer_notify: 1,
            total_count: 12,
        })
        console.log(
            "Subscription created successfully:", subscription.id, subscription.status
        );
        await prisma.subscription.create({
            data:{
                userId: req.user.id,
                subscriptionId: subscription.id,
                status: 'pending',
            }
        })
        res.json({
            subscriptionId: subscription.id,
            customerId: customer.id,
            keyId: process.env.RAZORPAY_KEY_ID,
          });
    } catch (error) {
        console.error("Error creating subscription:", error);
         res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}