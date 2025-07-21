import { Router,raw } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSubscription,cancelSubscription, webhook } from "../controllers/payments.controller";
import { rateLimiter } from "../middlewares/redis.middleware";

const webhookRouter:Router = Router()
webhookRouter.post("/subscriptions/webhook", raw({ type: "application/json" }), webhook);

const router:Router = Router()
router.post("/subscriptions/create",authMiddleware,rateLimiter("rl:subscription:create",10,300),createSubscription)
router.post("/subscriptions/cancel",authMiddleware,cancelSubscription)

export default {
    router,
    webhookRouter
}